import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
// @react-navigation
import { useRoute, useNavigation } from '@react-navigation/native';
// location
import MapView, { Marker, Polyline } from 'react-native-maps';
// firebase
import { doc, getDoc, DocumentReference, updateDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
// components
import palette from '../../theme/palette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackButton from '../../components/BackButton/BackButton';


// ----------------------------------------------------------------------

export default function BookingDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, addresses } = route.params;
  const [order, setOrder] = useState(null);

  // const [isReserved, setIsReserved] = useState(false); // Tracks if slot is reserved
  const [showCompleteButton, setShowCompleteButton] = useState(false); // Tracks if "Complete Delivery" should be shown
  const donatorLocation = item.donatorLocation;
  const receiverLocation = item.receiverLocation;

  // useEffect(() => {
  //   // Fetch order data from reservedItems collection
  //   const fetchOrder = async () => {
  //     try {
  //       console.log("Fetching reserved item...");

  //       const orderDoc = await getDoc(doc(firestore, 'reservedItems', orderId));
  //       if (orderDoc.exists()) {
  //         const orderData = orderDoc.data();
  //         console.log("Order data:", orderData);

  //         // Fetch item data from 'items' collection
  //         const itemRef = doc(firestore, 'items', orderData.itemId);
  //         const itemDoc = await getDoc(itemRef);

  //         // Fetch user data from 'users' collection
  //         const userRef = doc(firestore, 'users', orderData.userId);
  //         const userDoc = await getDoc(userRef);

  //         if (itemDoc.exists() && userDoc.exists()) {
  //           const itemData = itemDoc.data();
  //           const userData = userDoc.data();

  //           console.log("Item data:", itemData);
  //           console.log("User data:", userData);

  //           const reservedAt = new Date(orderData.reservedAt);
  //           const startTime = reservedAt;
  //           const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

  //           setOrder({
  //             ...orderData,
  //             foodImage: itemData.imageUrl || null,
  //             foodName: itemData.itemName || 'No name available',
  //             description: itemData.description || 'No description available',
  //             donatorLocation: itemData.location || { latitude: 0, longitude: 0 },
  //             receiverLocation: { latitude: 0, longitude: 0 },
  //             userName: userData.name || 'No user name available',
  //             startTime,
  //             endTime,
  //           });

  //           setShowCompleteButton(orderData.isReserved || false);
  //         } else {
  //           console.log('Error: Item or User document does not exist.');
  //         }
  //       } else {
  //         console.log('Error: Reserved item document does not exist.');
  //       }
  //     } catch (error) {
  //       console.error("Error fetching reserved item:", error);
  //     }
  //   };

  //   // Call fetchOrder within useEffect
  //   fetchOrder();
  // }, []);


  // if (!order) {
  //   return <Text>Loading...</Text>;
  // }

  // Helper function to convert ISO timestamp to readable time
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

  // // Render Food Image placeholder if imageUrl is empty
  // const renderFoodImage = () => {
  //   return order.foodImage ? (
  //     <Image source={{ uri: order.foodImage }} style={styles.image} />
  //   ) : (
  //     <Text>No Image Available</Text>
  //   );
  // };

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
    <ScrollView style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.FoodShareShift}>FoodShare Shift</Text>
      {/* <Text style={styles.time}>{convertTimestampToTime(order.startTime)} - {convertTimestampToTime(order.endTime)}</Text> */}
      {/*<Text>Donator's Location: {addresses[item.id] ? addresses[item.id] : 'Loading...'}</Text>
      <Text>Receiver's Location: Not available yet</Text>*/}

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{item.receiverName}</Text>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Location Details</Text>
      <Text style={{ fontSize: 18, marginVertical: 10 }}>Donator Location:</Text>
      <Text>{addresses[item.id]?.donator || 'Address not available'}</Text>
      <MapView
        style={{
          width: '100%',
          height: 200,
          marginBottom: 20
        }}
        initialRegion={{
          latitude: donatorLocation.latitude,
          longitude: donatorLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: donatorLocation.latitude,
            longitude: donatorLocation.longitude,
          }}
          title="Donator"
        />
      </MapView>

      <Text style={{ fontSize: 18, marginVertical: 10 }}>Receiver Location:</Text>
      <Text>{addresses[item.id]?.receiver || 'Address not available'}</Text>
      <MapView
        style={{
          width: '100%',
          height: 200,
          marginBottom: 20
        }}
        initialRegion={{
          latitude: receiverLocation.latitude,
          longitude: receiverLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: receiverLocation.latitude,
            longitude: receiverLocation.longitude,
          }}
          title="Receiver"
        />
      </MapView>

      <Text style={styles.orderDetails}>Order Details</Text>

      {/* Render Food Image */}
      {/* {renderFoodImage()} */}

      <Text style={styles.foodName}>{item.itemName}</Text>
      <Text style={styles.description}>{item.itemDescription || 'No description available'}</Text>

      {!showCompleteButton ? (
        <TouchableOpacity style={styles.button} onPress={reserveSlot}>
          <Text style={styles.buttonText}>Reserve My Slot</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={completeDelivery}>
          <Text style={styles.buttonText}>Complete Delivery</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', marginTop: 40 },
  FoodShareShift: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  time: { fontSize: 20, marginTop: 5 },
  location: { fontSize: 20, marginTop: 5 },
  image: { width: '100%', height: 200, marginVertical: 15 },
  orderDetails: { fontSize: 25, fontWeight: 'bold', marginTop: 30 },
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
