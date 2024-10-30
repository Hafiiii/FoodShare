import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { doc, getDoc, DocumentReference, updateDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import palette from '../../theme/palette';

const BookingDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  // const [isReserved, setIsReserved] = useState(false); // Tracks if slot is reserved
  const [showCompleteButton, setShowCompleteButton] = useState(false); // Tracks if "Complete Delivery" should be shown
  const [addresses, setAddresses] = useState({}); // Keep track of addresses for each order

  useEffect(() => {
    // Fetch order data from reservedItems collection
    const fetchOrder = async () => {
      try {
        console.log("Fetching reserved item...");
      
        const orderDoc = await getDoc(doc(firestore, 'reservedItems', orderId));
        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          console.log("Order data:", orderData);
      
          // Fetch item data from 'items' collection
          const itemRef = doc(firestore, 'items', orderData.itemId);
          const itemDoc = await getDoc(itemRef);
  
          // Fetch user data from 'users' collection
          const userRef = doc(firestore, 'users', orderData.userId);
          const userDoc = await getDoc(userRef);
  
          if (itemDoc.exists() && userDoc.exists()) {
            const itemData = itemDoc.data();
            const userData = userDoc.data();
  
            console.log("Item data:", itemData);
            console.log("User data:", userData);
  
            const reservedAt = new Date(orderData.reservedAt);
            const startTime = reservedAt;
            const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
      
            setOrder({
              ...orderData,
              foodImage: itemData.imageUrl || null,
              foodName: itemData.itemName || 'No name available',
              description: itemData.description || 'No description available',
              donatorLocation: itemData.location || { latitude: 0, longitude: 0 },
              receiverLocation: { latitude: 0, longitude: 0 },
              userName: userData.name || 'No user name available',
              startTime,
              endTime,
            });
      
            setShowCompleteButton(orderData.isReserved || false);
          } else {
            console.log('Error: Item or User document does not exist.');
          }
        } else {
          console.log('Error: Reserved item document does not exist.');
        }
      } catch (error) {
        console.error("Error fetching reserved item:", error);
      }
    };
    
    // Call fetchOrder within useEffect
    fetchOrder();
  }, []);
  

  if (!order) {
    return <Text>Loading...</Text>;
  }

  // Helper function to convert ISO timestamp to readable time
  const convertTimestampToTime = (timestamp) => {
  if (timestamp) {
    const date = new Date(timestamp); // Parse the ISO string
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time as HH:MM
  }
    return 'No time available';
  };

  // Reserve Slot function for reservedItems collection
  const reserveSlot = async () => {
    try {
      await updateDoc(doc(firestore, 'reservedItems', orderId), { isReserved: true });
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

  // Complete Delivery function for reservedItems collection
  const completeDelivery = async () => {
    try {
      await updateDoc(doc(firestore, 'reservedItems', orderId), { isCompleted: true });
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

  // Render Food Image placeholder if imageUrl is empty
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
      {/*<Text>Donator's Location: {addresses[item.id] ? addresses[item.id] : 'Loading...'}</Text>
      <Text>Receiver's Location: Not available yet</Text>*/}

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: order.donatorLocation.latitude,
          longitude: order.donatorLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Donator's Location Marker */}
        <Marker coordinate={order.donatorLocation} title="Donator's Location" />

        {/* Receiver's Location Marker (Placeholder) */}
        <Marker coordinate={order.receiverLocation} title="Receiver's Location (Placeholder)" />

        {/* Route from Donator to Receiver */}
        <Polyline
          coordinates={[
            order.donatorLocation,
            order.receiverLocation
          ]}
          strokeColor={palette.primary.main} // Custom color for the route
          strokeWidth={3}
        />
      </MapView>

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
    backgroundColor: palette.primary.main,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
});

export default BookingDetailScreen;