import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';

// const GOOGLE_API_KEY = 'AIzaSyCRJGqmHnj66TuD0ak44IdsHd7pJZ7kRgw'; // Replace with your Google Maps API key

const RiderHomeScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]); 
  const [reservedOrders, setReservedOrders] = useState({}); // Track reserved orders
  // const [orderLocations, setOrderLocations] = useState({}); // Store both donator and receiver locations in string
  // const [addresses, setAddresses] = useState({}); // Keep track of addresses for each order

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(firestore, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const ordersWithLocations = await Promise.all(
          ordersList.map(async (order) => {
            if (order.itemRef) {
              const itemDocRef = doc(firestore, 'items', order.itemRef.id);
              const itemDocSnapshot = await getDoc(itemDocRef);

              if (itemDocSnapshot.exists()) {
                const itemData = itemDocSnapshot.data();
                return {
                  ...order,
                  donatorLocation: itemData.location,
                  receiverLocation: itemData.receiverLocation,
                };
              }
            }
            return order;
          })
        );

        setOrders(ordersWithLocations);
      } catch (error) {
        console.error("Error fetching orders or item locations:", error);
      }
    };

    fetchOrders();

    // Use navigation.addListener to detect when the screen comes back into focus
    const unsubscribe = navigation.addListener('focus', () => {
      // Update reservedOrders or re-fetch orders if necessary
      setReservedOrders((prev) => ({ ...prev })); // Update state here if needed
    });

    return unsubscribe;
  }, [navigation]);

  // Helper function to convert Firestore Timestamp to readable time
  const convertTimestampToTime = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000); // Convert to milliseconds
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extract time only
    }
    return 'No time available';
  };
  /*
  // Reverse Geocoding: Convert GeoPoint to address using Google Maps API
  const getAddressFromGeoPoint = async (geoPoint, orderId) => {
    if (geoPoint && geoPoint.latitude && geoPoint.longitude) {
      const lat = geoPoint.latitude;
      const lng = geoPoint.longitude;
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setAddresses((prev) => ({ ...prev, [orderId]: address })); // Update address for specific order
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    }
  };

  // Fetch addresses for orders when component mounts or orders are updated
  useEffect(() => {
    orders.forEach((order) => {
      if (order.donatorLocation && !addresses[order.id]) {
        getAddressFromGeoPoint(order.donatorLocation, order.id);
      }
    });
  }, [orders]);
*/

const renderOrder = ({ item }) => {
  // If the order is reserved, apply the reserved styling, otherwise use the default style
  const isReserved = reservedOrders[item.id]; // Check if order is reserved
  const containerStyle = isReserved ? [styles.orderContainer, styles.reservedContainer] : styles.orderContainer;

    return (
      <TouchableOpacity
      onPress={() => {
        navigation.navigate('BookingDetailScreen', { orderId: item.id });
        setReservedOrders((prev) => ({ ...prev, [item.id]: true })); // Update state here instead of passing as param
      }}
      >

        <View style={containerStyle}>
          <Text style={styles.foodShareShift}>FoodShare Shift</Text>
          <Text>{convertTimestampToTime(item.startTime)} - {convertTimestampToTime(item.endTime)}</Text>
          <Text>Donator Location: {item.donatorLocation ? JSON.stringify(item.donatorLocation) : 'Loading...'}</Text>
          <Text>Receiver Location: {item.receiverLocation ? JSON.stringify(item.receiverLocation) : 'Loading...'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Planner</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  orderContainer: { 
    marginBottom: 10, 
    padding: 15, 
    backgroundColor: '#D4D4D4', 
    borderRadius: 8 
  },
  reservedContainer: { backgroundColor: '#A8D5BA' }, // Highlight reserved orders in green
  foodShareShift: { fontSize: 18, fontWeight: 'bold' },
  time: { fontSize: 16 },
  donatorLocation: { fontSize: 16, color: 'gray' },
  receiverLocation: { fontSize: 16, color: 'gray' },
});

export default RiderHomeScreen;
