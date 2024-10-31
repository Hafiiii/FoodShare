import { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
// @react-navigation
import { useNavigation, useRoute } from '@react-navigation/native';
// location
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// firebase
import { doc, setDoc, GeoPoint, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../../../utils/firebase';
// components
import palette from '../../../theme/palette';
import { GOOGLE_MAPS_API_KEY } from '@env';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ----------------------------------------------------------------------

const ReservationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    contact: Yup.string().required('Contact is required'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    location: Yup.string().required('Location is required'),
});

// ----------------------------------------------------------------------

export default function ReservedItemForm() {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [receiverAddress, setReceiverAddress] = useState('');
    const [location, setLocation] = useState(null);
    const [userProfile, setUserProfile] = useState({ firstName: '', lastName: '', email: '', userRole: '' });

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(ReservationSchema),
    });

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to access this feature.');
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
        })();
    }, []);

    const fetchUserProfile = async () => {
        const uid = auth.currentUser?.uid;

        if (uid) {
            try {
                const userDoc = doc(firestore, "users", uid);
                const userSnapshot = await getDoc(userDoc);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setUserProfile({
                        firstName: userData.FirstName || '',
                        lastName: userData.LastName || '',
                        email: userData.UserEmailAddress || '',
                        userRole: userData.UserRole || '',
                    });
                    setValue('email', userData.UserEmailAddress || '');
                    setValue('name', userData.FirstName || '');
                    setValue('userRole', userData.UserRole || '');
                }
            } catch (error) {
                console.error("Error fetching user profile: ", error);
            }
        }
    };

    const fetchCoordinates = async (receiverAddress) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(receiverAddress)}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            console.log('Geocoding response:', data);
            if (data.status === 'OK' && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                setLocation({
                    latitude: location.lat,
                    longitude: location.lng,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Location Found',
                    text2: 'Location set successfully.',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Location Not Found',
                    text2: 'Unable to find location from the address entered.',
                });
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch location coordinates.',
            });
        }
    };

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        const uid = auth.currentUser?.uid;
        if (!uid) {
            alert('You must be logged in to reserve an item.');
            setLoading(false);
            return;
        }
        try {
            const docRef = doc(firestore, 'reservedItems', `${item.id}-${uid}`);
            await setDoc(docRef, {
                itemId: item.id,
                itemName: item.itemName,
                donatorLocation: item.location,
                donatorEmail: item.location,
                receiverLocation: new GeoPoint(location.latitude, location.longitude),
                itemDescription: item.description,
                itemImageUrl: item.imageUrl,
                receiverId: uid,
                reservedAt: new Date().toISOString(),
                receiverContactNo: data.contact,
                receiverEmail: data.email,
                receiverName: data.name,
                receiverMessage: data.message,
            });
            alert('Item reserved successfully!');
            navigation.navigate('ReceiverHome');
        } catch (error) {
            console.error('Error reserving item:', error);
            setError('Failed to reserve item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color={palette.primary.main} style={{ marginRight: 5 }} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontWeight: '700' }}>Complete Reservation</Text>
                </View>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.name}
                            style={{ marginVertical: 10 }}
                        />
                    )}
                />
                {errors.name && <Text style={{ color: palette.error.main }}>{errors.name.message}</Text>}

                <Controller
                    control={control}
                    name="contact"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Contact"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="phone-pad"
                            error={!!errors.contact}
                            style={{ marginVertical: 10 }}
                        />
                    )}
                />
                {errors.contact && <Text style={{ color: palette.error.main }}>{errors.contact.message}</Text>}

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.email}
                            style={{ marginVertical: 10 }}
                        />
                    )}
                />
                {errors.email && <Text style={{ color: palette.error.main }}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    name="message"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Message"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            multiline
                            numberOfLines={4}
                            style={{ height: 80, marginVertical: 10 }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Location Address"
                            onBlur={onBlur}
                            onChangeText={(value) => {
                                onChange(value);
                                setReceiverAddress(value);
                            }}
                            value={value}
                            error={!!errors.location}
                            style={{ marginVertical: 10 }}
                        />
                    )}
                />
                {errors.location && <Text style={{ color: palette.error.main }}>{errors.location.message}</Text>}

                <Button mode="contained" onPress={() => fetchCoordinates(receiverAddress)} style={{ marginVertical: 10 }}>
                    Confirm Address
                </Button>

                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginVertical: 10,
                    }}
                >
                    Location:
                </Text>
                <MapView
                    style={{ width: '100%', height: 300 }}
                    initialRegion={{
                        latitude: location ? location.latitude : 1.5534,
                        longitude: location ? location.longitude : 110.3591,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={handleMapPress}
                >
                    {location && <Marker coordinate={location} />}
                </MapView>

                {error && <Text style={{ color: palette.error.main }}>{error}</Text>}

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                    disabled={loading}
                    style={{ marginTop: 20 }}
                >
                    Submit Reservation
                </Button>
            </ScrollView>
        </View>
    );
}
