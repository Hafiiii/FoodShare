import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native'; // Add Image and Button to the import
import MapView, { Marker, Polyline } from 'react-native-maps'; // Import MapView, Marker and Polyline

const BookingDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

  // Set default coordinates for the donator and receiver
  const donatorLocation = {
    latitude: order.donatorLat || 1.5607, //Replace with real data later
    longitude: order.donatorLong || 110.3457, // Replace with real data later
  };

  const receiverLocation = {
    latitude: order.receiverLat || 1.5646, // Replace with real data later
    longitude: order.receiverLong || 110.3514, // Replace with real data later
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.time}>{order.startTime} - {order.endTime}</Text>
      <Text style={styles.location}>Location: {order.location}</Text>
      
      {/* Map Navigation */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (donatorLocation.latitude + receiverLocation.latitude) / 2, // Add latitude from order
          longitude: (donatorLocation.longitude + receiverLocation.longitude) / 2, // Add longitude from order
          latitudeDelta: Math.abs(donatorLocation.latitude - receiverLocation.latitude) + 0.01,
          longitudeDelta: Math.abs(donatorLocation.longitude - receiverLocation.longitude) + 0.01,
        }}
      >
        {/* Donator's Location Pin */}
        <Marker 
        coordinate={donatorLocation}
        title="Donator's Location"
        description='order.location' />

        {/* Receiver's Location Pin */}
        <Marker
        coordinate={receiverLocation}
        title="Receiver's Location"
        />
        {/* Route from Donator to Receiver */}
        <Polyline
        coordinates={[donatorLocation, receiverLocation]}
        strokeColor="#4287f5" // Change colour later
        strokeWidth={3}
        />
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
