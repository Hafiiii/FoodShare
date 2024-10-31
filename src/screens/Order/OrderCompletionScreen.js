import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
// firebase
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import palette from '../../theme/palette';
import { GOOGLE_MAPS_API_KEY } from '@env';

const RiderHomeScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [reservedOrders, setReservedOrders] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const reservedItemsCollection = collection(firestore, 'reservedItems');
        const reservedItemsSnapshot = await getDocs(reservedItemsCollection);

        const ordersList = reservedItemsSnapshot.docs
          .map((doc) => {
            const data = doc.data();

            // Check if isReserved or isCompleted meets the condition for display
            if (data.isReserved || data.isCompleted) {
              const donatorLocation = data.donatorLocation && data.donatorLocation.latitude !== undefined && data.donatorLocation.longitude !== undefined
                ? { latitude: data.donatorLocation.latitude, longitude: data.donatorLocation.longitude }
                : null;

              const receiverLocation = data.receiverLocation && data.receiverLocation.latitude !== undefined && data.receiverLocation.longitude !== undefined
                ? { latitude: data.receiverLocation.latitude, longitude: data.receiverLocation.longitude }
                : null;

              const startTime = data.reservedAt ? new Date(data.reservedAt) : new Date();
              const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

              return {
                orderId: doc.id,
                isReserved: data.isReserved,
                isCompleted: data.isCompleted,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                donatorLocation,
                receiverLocation,
                itemName: data.itemName
              };
            }
            return null; // Exclude orders that don't meet the criteria
          })
          .filter(order => order !== null); // Remove null values from the list

        const ordersWithAddresses = await Promise.all(
          ordersList.map(async (order) => {
            const donatorAddress = order.donatorLocation ? await getAddressFromGeoPoint(order.donatorLocation) : 'Location not available';
            const receiverAddress = order.receiverLocation ? await getAddressFromGeoPoint(order.receiverLocation) : 'Location not available';
            return {
              ...order,
              donatorLocation: donatorAddress,
              receiverLocation: receiverAddress,
            };
          })
        );

        setOrders(ordersWithAddresses);
      } catch (error) {
        console.error("Error fetching reserved items or locations:", error);
      }
    };

    fetchOrders();

    const unsubscribe = navigation.addListener('focus', () => {
      setReservedOrders((prev) => ({ ...prev }));
    });

    return unsubscribe;
  }, [navigation]);


  const getAddressFromGeoPoint = async (geoPoint) => {
    if (geoPoint && geoPoint.latitude && geoPoint.longitude) {
      const lat = geoPoint.latitude;
      const lng = geoPoint.longitude;
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].formatted_address;
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    }
    return 'Address not available';
  };

  const renderOrder = ({ item }) => {
    const isReserved = reservedOrders[item.orderId];
    const containerStyle = isReserved ? [styles.orderContainer, styles.reservedContainer] : styles.orderContainer;

    return (
      <View style={containerStyle}>
        <Text style={{ fontSize: 18, fontWeight: 800 }}>{item.itemName}</Text>
        <Text>{new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}</Text>
        <Text>Donator's Location: {item.donatorLocation}</Text>
        <Text>Receiver's Location: {item.receiverLocation}</Text>
      </View>
    );
  };

  const navigateToProfile = () => {
    navigation.navigate('ProfileHome');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={palette.primary.main} style={{ marginRight: 5 }} />
          </TouchableOpacity>

          <Text style={styles.title}>Booking Planner</Text>
        </View>
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.orderId.toString()}
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
        onPress={navigateToProfile}
      >
        <Icon name="account" size={28} color="#fff" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold' },
  orderContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#D4D4D4',
    borderRadius: 8
  },
  reservedContainer: { backgroundColor: palette.primary.light },
  foodShareShift: { fontSize: 18, fontWeight: 'bold' },
});

export default RiderHomeScreen;