import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
import { doc, getDoc, DocumentReference, updateDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';

const BookingDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  // const [isReserved, setIsReserved] = useState(false); // Tracks if slot is reserved
  const [showCompleteButton, setShowCompleteButton] = useState(false); // Tracks if "Complete Delivery" should be shown

  // Fetch order data from Firebase, including referenced items collection
  const fetchOrder = async () => {
    try {
      console.log("Fetching order...");
  
      // Fetch order document from the orders collection
      const orderDoc = await getDoc(doc(firestore, 'orders', orderId));
      if (orderDoc.exists()) {
        const orderData = orderDoc.data();
        console.log("Order data:", orderData);
  
        // Ensure itemId is correctly extracted as a DocumentReference
        const itemRef = orderData.itemId;
        if (itemRef) {
          // Fetch the referenced item document from the items collection
          const itemDoc = await getDoc(itemRef);
  
          if (itemDoc.exists()) {
            const itemData = itemDoc.data();
            console.log("Item data:", itemData);
  
            // Combine order and item data with null checks
            setOrder({
              ...orderData,
              foodImage: itemData.imageUrl || null,
              foodName: itemData.itemName || 'No name available',
              donatorLocation: itemData.location || 'Location not available',
              receiverLocation: orderData.receiverLocation || 'Receiver location not available'
            });
  
            // Set button visibility based on reservation status
            setShowCompleteButton(orderData.isReserved || false);
          } else {
            console.log('Error: Item document does not exist.');
          }
        } else {
          console.log('Error: itemId is missing or not a valid DocumentReference.');
        }
      } else {
        console.log('Error: Order document does not exist.');
      }
    } catch (error) {
      console.error("Error fetching order: ", error);
    }
  };


  useEffect(() => {
    fetchOrder();
  }, []);

  if (!order) {
    return <Text>Loading...</Text>;
  }

  // Helper function to convert Firestore Timestamp to readable time
  const convertTimestampToTime = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000); // Convert to milliseconds
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return 'No time available';
  };

  // Reserve Slot function
  const reserveSlot = async () => {
    try {
      await updateDoc(doc(firestore, 'orders', orderId), { isReserved: true });
      setShowCompleteButton(true);
      Alert.alert(
        "Slot Reserved",
        "A notification has been sent to the donator and receiver.",
        [
          { text: "Return to Booking Planner", onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error("Error reserving slot: ", error);
    }
  };

  // Complete Delivery function
  const completeDelivery = async () => {
    try {
      await updateDoc(doc(firestore, 'orders', orderId), { isCompleted: true });
      Alert.alert(
        "Delivery Completed",
        "A notification has been sent to the donator and receiver.",
        [
          { text: "Return to Booking Planner", onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error("Error completing delivery: ", error);
    }
  };

  // Helper function to display placeholder if image URL is empty
  const renderFoodImage = () => {
    return order.foodImage ? (
      <Image source={{ uri: order.foodImage }} style={styles.image} />
    ) : (
      <Text>No Image Available</Text>
    );
  };

  /* Retrieve coordinates from order data and handle null checks
  const donatorLocation = order.donatorLocation
    ? {
        latitude: order.donatorLocation.latitude,
        longitude: order.donatorLocation.longitude,
      }
    : { latitude: 0, longitude: 0 };

  const receiverLocation = order.receiverLocation
    ? {
        latitude: order.receiverLocation.latitude,
        longitude: order.receiverLocation.longitude,
      }
    : { latitude: 0, longitude: 0 };
  */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.FoodShareShift}>FoodShare Shift</Text>
      <Text style={styles.time}>{convertTimestampToTime(order.startTime)} - {convertTimestampToTime(order.endTime)}</Text>

      <Text style={styles.location}>Pick-up Location: {order.location}</Text>
      <Text style={styles.location}>Drop-off Location: {order.receiverLocation}</Text>

      {/*  
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (donatorLocation.latitude + receiverLocation.latitude) / 2,
          longitude: (donatorLocation.longitude + receiverLocation.longitude) / 2,
          latitudeDelta: Math.abs(donatorLocation.latitude - receiverLocation.latitude) + 0.01,
          longitudeDelta: Math.abs(donatorLocation.longitude - receiverLocation.longitude) + 0.01,
        }}
      >
        
        <Marker 
          coordinate={donatorLocation}
          title="Donator's Location"
          description={order.location}
        />

        
        <Marker
          coordinate={receiverLocation}
          title="Receiver's Location"
        />

        
        <Polyline
          coordinates={[donatorLocation, receiverLocation]}
          strokeColor="#4287f5"
          strokeWidth={3}
        />
      </MapView>
      */}

    <Text style={styles.orderDetails}>Order Details</Text>

    {/* Render Food Image */}
    {renderFoodImage()}

    <Text style={styles.foodName}>{order.foodName}</Text>
    <Text style={styles.description}>{order.description || 'No description available'}</Text>

   {!showCompleteButton ? (
    <TouchableOpacity style={styles.button} onPress={reserveSlot}>
      <Text style={styles.buttonText}>Reserve My Slot</Text>
    </TouchableOpacity>
    ) : (
    <TouchableOpacity style={styles.button} onPress={completeDelivery}>
      <Text style={styles.buttonText}>Complete Delivery</Text>
    </TouchableOpacity>
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', marginTop: 40 },
  FoodShareShift: { fontSize: 20, fontWeight: 'bold', marginTop: 5},
  time: { fontSize: 20, marginTop: 5 },
  location: { fontSize: 20, marginTop: 5},
  image: { width: '100%', height: 200, marginVertical: 15 },
  orderDetails: { fontSize: 25, fontWeight: 'bold', marginTop: 30},
  foodName: { fontSize: 20, marginTop: 10 },
  description: { fontSize: 20, marginTop: 5 },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
});

export default BookingDetailScreen;