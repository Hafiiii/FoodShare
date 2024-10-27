import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Button } from 'react-native'; // Add Image and Button to the import
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker
import { useNavigation } from '@react-navigation/native';
import { dummyOrder } from '../Volunteer/dummyData'; 

const BookingDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.time}>{order.startTime} - {order.endTime}</Text>
      <Text style={styles.location}>Location: {order.location}</Text>
      
      {/* Static Map Display */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: order.latitude, // Add latitude from order
          longitude: order.longitude, // Add longitude from order
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={{ latitude: order.latitude, longitude: order.longitude }} />
      </MapView>

      {/* Image Display */}
      <Image source={{ uri: order.foodImage }} style={styles.image} />
      <Text style={styles.orderDetails}>Order Details</Text>
      <Text style={styles.foodName}>{order.foodName}</Text>
      <Text style={styles.quantity}>Qty: {order.quantity}</Text>
      
      {/* Return to Booking Planner Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Return to Booking Planner</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  time: { fontSize: 16, marginTop: 10 },
  location: { fontSize: 16, marginVertical: 10 },
  map: { width: '100%', height: 200, marginVertical: 15 }, // Style for the map
  image: { width: '100%', height: 200, marginVertical: 15 },
  orderDetails: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  foodName: { fontSize: 16 },
  quantity: { fontSize: 16 },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BookingDetailScreen;
