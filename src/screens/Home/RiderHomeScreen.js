import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { dummyOrder } from '../Volunteer/dummyData'; 
import { FlatList } from 'react-native-gesture-handler';
// import firebase from 'firebase/app';
// import 'firebase/firestore';

const RiderHomeScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([dummyOrder]); // Placeholder for fetched orders

  // Uncomment to fetch data from Firebase
  /*
  useEffect(() => {
    const fetchOrders = async () => {
      const ordersArray = [];
      const snapshot = await firebase.firestore().collection('orders').get();
      snapshot.forEach(doc => {
        ordersArray.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersArray);
      };
      fetchOrders();
  }, []);
  */

  const renderOrder = ({ item }) => (
    <TouchableOpacity 
    style={[styles.bookingContainer, item.reserved && styles.reservedContainer]} 
    onPress={() => navigation.navigate('BookingDetailScreen', { order : item })}
    >
      <Text style={styles.foodShareShift}>FoodShare Shift</Text>
      <Text style={styles.time}>{time.startTime} - {item.endTime}</Text>
      <Text style={styles.location}>Retrieve from: {item.donatorLocation}</Text>
      <Text style={styles.location}>Deliver to: {item.receiverLocation}</Text>
    </TouchableOpacity>
  );

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
  bookingContainer: { 
    marginBottom: 10, 
    padding: 15, 
    backgroundColor: '#e0f7fa', 
    borderRadius: 8 
  },
  reservedContainer: {backgroundColor: '#c8e6c9'}, // Highlight reserved orders
  foodShareShift: { fontSize: 18, fontWeight: 'bold' },
  time: { fontSize: 16 },
  location: { fontSize: 16, color: 'gray' },
});

export default RiderHomeScreen;
