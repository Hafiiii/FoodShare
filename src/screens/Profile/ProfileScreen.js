import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../utils/firebase';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [UserContactNo, setContactNo] = useState('');
    const [UserEmailAddress, setEmail] = useState('');
    const [UserGender, setGender] = useState('');
    const [UserRole, setRole] = useState('');
    const [loading, setLoading] = useState(false);

    const user = auth.currentUser;

    const handleSaveProfile = async () => {
        if (!user) return;

        if (!FirstName || !LastName || !UserContactNo || !UserEmailAddress || !UserGender || !UserRole) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'All fields must be filled out.',
            });
            return;
        }

        setLoading(true);
        try {
            await setDoc(doc(firestore, "users", user.uid), {
                FirstName: FirstName || '',
                LastName: LastName || '',
                UserContactNo: UserContactNo || '',
                UserEmailAddress: UserEmailAddress || '',
                UserGender: UserGender || '',
                UserRole: UserRole || ''
            });

            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your profile details have been saved successfully.',
            });
        } catch (error) {
            console.error("Error saving profile: ", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        if (!user) return;

        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setFirstName(data.FirstName || '');
            setLastName(data.LastName || '');
            setContactNo(data.UserContactNo || '');
            setEmail(data.UserEmailAddress || '');
            setGender(data.UserGender || '');
            setRole(data.UserRole || '');
        } else {
            console.log("No such document!");
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();

            Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'You have been logged out successfully.',
            });
            navigation.navigate('Home');
        } catch (error) {
            console.error("Error logging out: ", error);

            Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: 'An error occurred while logging out.',
            });
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                padding: 20,
                backgroundColor: '#f5f5f5',
            }}
        >
            <Card style={{ padding: 20 }}>
                <Card.Title title="Profile" />
                <Card.Content>
                    <TextInput
                        label="First Name"
                        value={FirstName}
                        onChangeText={text => setFirstName(text)}
                        style={{ marginBottom: 20 }}
                    />
                    <TextInput
                        label="Last Name"
                        value={LastName}
                        onChangeText={text => setLastName(text)}
                        style={{ marginBottom: 20 }}
                    />
                    <TextInput
                        label="Contact Number"
                        value={UserContactNo}
                        onChangeText={text => setContactNo(text)}
                        keyboardType="phone-pad"
                        style={{ marginBottom: 20 }}
                    />
                    <TextInput
                        label="Email"
                        value={UserEmailAddress}
                        onChangeText={text => setEmail(text)}
                        keyboardType="email-address"
                        editable={false}
                        style={{ marginBottom: 20 }}
                    />
                    <TextInput
                        label="Gender"
                        value={UserGender}
                        onChangeText={text => setGender(text)}
                        style={{ marginBottom: 20 }}
                    />
                    <TextInput
                        label="Role"
                        value={UserRole}
                        onChangeText={text => setRole(text)}
                        editable={false}
                        style={{ marginBottom: 20 }}
                    />
                    <Button
                        mode="contained"
                        onPress={handleSaveProfile}
                        loading={loading}
                        disabled={loading}
                        style={{ marginVertical: 20 }}
                    >
                        Save Profile
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={handleLogout}
                    >
                        Logout
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}