import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import palette from '../../theme/palette';
import { GOOGLE_MAPS_API_KEY } from '@env';

// ----------------------------------------------------------------------

export default function RiderHomeScreen() {
  const navigation = useNavigation();
  const [reservedItems, setReservedItems] = useState([]);
  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    const fetchReservedItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "reservedItems"));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservedItems(items);
      } catch (error) {
        console.error("Error fetching reserved items: ", error);
      }
    };

    fetchReservedItems();
    const unsubscribe = navigation.addListener('focus', fetchReservedItems);
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const convertTimestampToDateTime = (timestamp) => {
    if (!timestamp) return 'No date available';

    const date = new Date(timestamp);
    if (isNaN(date)) {
      console.warn("Invalid date format:", timestamp);
      return 'Invalid date';
    }

    const formattedDate = date.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return `${formattedDate} ${formattedTime}`;
  };

  const getAddressFromGeoPoint = async (location, itemId, type) => {
    const { latitude, longitude } = location;
    if (latitude && longitude) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setAddresses((prev) => ({
            ...prev,
            [itemId]: { ...prev[itemId], [type]: address },
          }));
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    }
  };

  useEffect(() => {
    reservedItems.forEach((item) => {
      if (item.donatorLocation && (!addresses[item.id] || !addresses[item.id].donator)) {
        getAddressFromGeoPoint(item.donatorLocation, item.id, 'donator');
      }
      if (item.receiverLocation && (!addresses[item.id] || !addresses[item.id].receiver)) {
        getAddressFromGeoPoint(item.receiverLocation, item.id, 'receiver');
      }
    });
  }, [reservedItems]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BookingDetailScreen', { item, addresses })}
    >
      <View
        style={{
          marginBottom: 10,
          padding: 15,
          backgroundColor: '#D4D4D4',
          borderRadius: 8,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.receiverName}</Text>
          <Text style={{ color: palette.disabled.main }}>
            {convertTimestampToDateTime(item.reservedAt)}
          </Text>
        </View>
        <Text>Donator: {addresses[item.id]?.donator || 'Loading...'}</Text>
        <Text>Receiver: {addresses[item.id]?.receiver || 'Loading...'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 40, marginBottom: 10 }}>Booking Planner</Text>
        <FlatList
          data={reservedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 46,
          height: 46,
          borderRadius: 30,
          backgroundColor: palette.primary.main,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 5,
        }}
        onPress={() => navigation.navigate('ProfileHome')}
      >
        <Icon name="account" size={28} color="#fff" />
      </TouchableOpacity>
    </>
  );
}