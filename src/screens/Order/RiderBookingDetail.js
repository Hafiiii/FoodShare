import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// @react-navigation
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
// firebase
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
// components
import palette from '../../theme/palette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GOOGLE_MAPS_API_KEY } from '@env';

// ----------------------------------------------------------------------

export default function RiderBookingDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [donatorAddress, setDonatorAddress] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [showCompleteButton, setShowCompleteButton] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(firestore, 'reservedItems', orderId));

        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          setOrder(orderData);
          setShowCompleteButton(orderData.isReserved || false);

          if (orderData.donatorLocation) {
            fetchAddress(orderData.donatorLocation, setDonatorAddress);
          }
          if (orderData.receiverLocation) {
            fetchAddress(orderData.receiverLocation, setReceiverAddress);
          }
        } else {
          console.log('Error: Reserved item document does not exist.');
          setOrder(null);
        }
      } catch (error) {
        console.error("Error fetching reserved item:", error);
        setOrder(null);
      }
    };
    fetchOrder();

  }, [orderId]);

  const fetchAddress = async (location, setAddress) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_MAPS_API_KEY}`);
      const address = response.data.results[0]?.formatted_address || 'No address found';
      setAddress(address);
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress('Address not available');
    }
  };

  const convertTimestampToDateTime = (timestamp) => {
    if (!timestamp) return { start: null, end: null };

    const startTime = new Date(timestamp);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    return { start: startTime, end: endTime };
  };

  const renderTime = () => {
    if (!order || !order.reservedAt) {
      return <Text>No time available</Text>;
    }

    const { start, end } = convertTimestampToDateTime(order.reservedAt);

    return (
      <Text style={styles.time}>
        Time: {start ? start.toLocaleTimeString() : 'No time available'} - {end ? end.toLocaleTimeString() : 'No time available'}
      </Text>
    );
  };

  const reserveSlot = async () => {
    try {
      await updateDoc(doc(firestore, 'reservedItems', orderId), { isReserved: true });
      setShowCompleteButton(true);
      Alert.alert(
        "Slot Reserved",
        "A notification has been sent to the donator and receiver.",
        [{ text: "Return to Booking Planner", onPress: () => navigation.navigate('RiderHome') }]
      );
    } catch (error) {
      console.error("Error reserving slot: ", error);
    }
  };

  const completeDelivery = async () => {
    try {
      await updateDoc(doc(firestore, 'reservedItems', orderId), { isCompleted: true });
      Alert.alert(
        "Delivery Completed",
        "A notification has been sent to the donator and receiver.",
        [{ text: "Return to Booking Planner", onPress: () => navigation.navigate('RiderHome') }]
      );
    } catch (error) {
      console.error("Error completing delivery: ", error);
    }
  };

  const renderFoodImage = () => {
    return order?.itemImageUrl ? (
      <Image source={{ uri: order.itemImageUrl }} style={styles.image} />
    ) : (
      <Text>No Image Available</Text>
    );
  };

  const isValidCoordinate = (location) =>
    location && typeof location.latitude === 'number' && typeof location.longitude === 'number';

  const renderMap = () => {
    if (!isValidCoordinate(order?.donatorLocation) || !isValidCoordinate(order?.receiverLocation)) {
      return <Text>Map data not available</Text>;
    }

    return (
      <>
        <Text style={styles.location}>
          Donator's Location: {donatorAddress || 'Loading address...'}
        </Text>

        <MapView
          style={{ width: '100%', height: 200, marginBottom: 20, borderRadius: 10 }}
          initialRegion={{
            latitude: order.donatorLocation.latitude || 37.7749, // Default to a fallback latitude (e.g., San Francisco)
            longitude: order.donatorLocation.longitude || -122.4194, // Default to a fallback longitude
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker
            coordinate={{
              latitude: order.donatorLocation.latitude,
              longitude: order.donatorLocation.longitude,
            }}
            title="Donator"
          />
        </MapView>

        <Text style={styles.location}>
          Receiver's Location: {receiverAddress || 'Loading address...'}
        </Text>

        <MapView
          style={{ width: '100%', height: 200, marginBottom: 20, borderRadius: 10 }}
          initialRegion={{
            latitude: order.receiverLocation.latitude || 37.7749, // Default to a fallback latitude (e.g., San Francisco)
            longitude: order.receiverLocation.longitude || -122.4194, // Default to a fallback longitude
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >

          <Marker
            coordinate={{
              latitude: order.receiverLocation.latitude,
              longitude: order.receiverLocation.longitude,
            }}
            title="Receiver"
          />
        </MapView>
      </>
    );
  };

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 35 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={palette.primary.main} style={{ marginRight: 5 }} />
        </TouchableOpacity>

        <Text style={styles.title}>Booking Details</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.FoodShareShift}>FoodShare Shift</Text>

        {order ? (
          <>
            {renderTime()}
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Location Details</Text>

            {renderMap()}


            <Text style={styles.orderDetails}>Order Details</Text>
            <Text style={{ fontSize: 16 }}>Receiver's Name: {order.receiverName || 'No user name available'}</Text>
            {renderFoodImage()}
            <Text style={styles.foodName}>{order.itemName || 'No name available'}</Text>
            <Text style={styles.description}>{order.itemDescription || 'No description available'}</Text>

            {order && !showCompleteButton ? (
              <TouchableOpacity style={styles.button} onPress={reserveSlot}>
                <Text style={styles.buttonText}>Reserve My Slot</Text>
              </TouchableOpacity>
            ) : order && showCompleteButton ? (
              <TouchableOpacity style={styles.button} onPress={completeDelivery}>
                <Text style={styles.buttonText}>Complete Delivery</Text>
              </TouchableOpacity>
            ) : (
              <Text>Loading...</Text>
            )}
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30 },
  title: { fontSize: 30, fontWeight: 'bold' },
  FoodShareShift: { fontSize: 20, fontWeight: 'bold' },
  time: { fontSize: 16, marginTop: 5, marginBottom: 10 },
  location: { fontSize: 16, marginVertical: 5 },
  image: { width: '100%', height: 200, marginTop: 10, borderRadius: 10 },
  orderDetails: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  foodName: { fontSize: 16, marginTop: 10 },
  description: { fontSize: 16, marginTop: 5 },
  button: {
    marginTop: 20,
    marginBottom: 40,
    padding: 15,
    backgroundColor: palette.primary.main,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
});