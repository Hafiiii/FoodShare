import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GOOGLE_MAPS_API_KEY } from '@env';
import palette from '../../theme/palette';

const RiderHomeScreen = () => {
  const navigation = useNavigation();
  const [reservedItems, setReservedItems] = useState([]);
  const [reservedOrders, setReservedOrders] = useState({}); // Track reserved orders
  // const [orderLocations, setOrderLocations] = useState({}); // Store both donator and receiver locations in string
  const [addresses, setAddresses] = useState({}); // Keep track of addresses for each order

  useEffect(() => {
    const fetchReservedItems = async () => {
      try {
        console.log("Fetching reserved items...");
        const reservedItemsCollection = collection(firestore, 'reservedItems');
        const reservedItemsSnapshot = await getDocs(reservedItemsCollection);
        const reservedItemsList = reservedItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        const itemsWithLocations = await Promise.all(
          reservedItemsList.map(async (item) => {
            if (item.itemId) {
              try {
                const itemDocRef = doc(firestore, 'items', item.itemId);
                const itemDocSnapshot = await getDoc(itemDocRef);
  
                if (itemDocSnapshot.exists()) {
                  const itemData = itemDocSnapshot.data();
                  return {
                    ...item,
                    itemName: itemData.name,
                    description: itemData.description,
                    imageUrl: itemData.imageUrl,
                    donatorLocation: itemData.location,
                    receiverLocation: null, // Placeholder since there’s no location for receiver yet
                    startTime: new Date(item.reservedAt), // Using ISO format
                    endTime: new Date(new Date(item.reservedAt).getTime() + 2 * 60 * 60 * 1000), // Add 2 hours
                  };
                } else {
                  console.warn(`No document found for item ID: ${item.itemId}`);
                }
              } catch (innerError) {
                console.error(`Error fetching item document for item ID: ${item.itemId}`, innerError);
              }
            }
            return item; // Return the item as-is if itemRef or document is missing
          })
        );
  
        setReservedItems(itemsWithLocations);
      } catch (error) {
        console.error("Error fetching reserved items or item locations:", error);
      }
    };
  
    fetchReservedItems();
  
    // Use navigation.addListener to detect when the screen comes back into focus
    const unsubscribe = navigation.addListener('focus', fetchReservedItems);
  
    // Clean up listener on component unmount
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  // Helper function to convert Firestore Timestamp to readable time
  const convertTimestampToTime = (timestamp) => {
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp); // Parse ISO string
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return 'No time available';
  };
  

   // Reverse Geocoding: Convert GeoPoint to address using Google Maps API
   const getAddressFromGeoPoint = async (locationArray, itemId) => {
    if (Array.isArray(locationArray) && locationArray.length === 2) {
      const [lat, lng] = locationArray;
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setAddresses((prev) => ({ ...prev, [itemId]: address }));
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    }
  };
  

  // Fetch addresses for items when component mounts or items are updated
  useEffect(() => {
    reservedItems.forEach((item) => {
      if (item.donatorLocation && !addresses[item.id]) {
        getAddressFromGeoPoint(item.donatorLocation, item.id);
      }
    });
  }, [reservedItems]);


  const renderItem = ({ item }) => {
    const isReserved = reservedOrders[item.id]; // Check if item is reserved
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
          <Text>Donator Location: {addresses[item.id] ? addresses[item.id] : 'Loading...'}</Text>
          <Text>Receiver Location: Not available yet</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const navigateToProfile = () => {
    navigation.navigate('ProfileHome');
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Booking Planner</Text>
        <FlatList
          data={reservedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Floating Button */}
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
  title: { fontSize: 30, fontWeight: 'bold', marginTop: 40, marginBottom: 10 },
  orderContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#D4D4D4',
    borderRadius: 8
  },
  reservedContainer: { backgroundColor: palette.primary.light }, // Highlight reserved items in green
  foodShareShift: { fontSize: 18, fontWeight: 'bold' },
  time: { fontSize: 16 },
  donatorLocation: { fontSize: 16, color: 'gray' },
  receiverLocation: { fontSize: 16, color: 'gray' },
});

export default RiderHomeScreen;