import { useState, useCallback } from 'react';
import { View, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Searchbar, Text, Card } from 'react-native-paper';
import axios from 'axios';
// @react-navigation
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// firebase
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { auth, firestore, storage } from '../../utils/firebase';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LocationTab from './components/LocationTab';
import palette from '../../theme/palette';
import { GOOGLE_MAPS_API_KEY } from '@env';

// ----------------------------------------------------------------------

const { width } = Dimensions.get('window');
const SCREEN_WIDTH = width < 600 ? 2 : 4;

// ----------------------------------------------------------------------

export default function ReceiverHomeScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [userProfile, setUserProfile] = useState({ firstName: '', lastName: '', email: '' });
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [locations, setLocations] = useState([]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    const uid = auth.currentUser?.uid;

    if (uid) {
      try {
        const userDoc = doc(firestore, "users", uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserProfile({
            firstName: userData.FirstName || '',
            lastName: userData.LastName || '',
            email: userData.UserEmailAddress || '',
          });
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }
  };

  // Fetch item data
  const fetchUserItem = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "items"));
      const items = await Promise.all(querySnapshot.docs.map(async doc => {
        const itemData = doc.data();
        let imageUrl = itemData.imageUrl;

        if (imageUrl && imageUrl.startsWith("gs://")) {
          const storageRef = ref(storage, imageUrl);
          imageUrl = await getDownloadURL(storageRef);
        }

        const locationData = doc.data().location;
        let city = 'Unknown Location';

        if (locationData && locationData.latitude && locationData.longitude) {
          const { latitude, longitude } = locationData;
          city = await getCityFromCoordinates(latitude, longitude);
        } else {
          console.warn("Location data is missing latitude or longitude.");
        }

        return {
          id: doc.id,
          ...itemData,
          imageUrl,
          label: city,
        };
      }));

      setLocations([...new Set(items.map(item => item.label))]);
      setItemData(items);
      setFilteredData(items);
    } catch (error) {
      console.error("Error fetching user items: ", error);
    }
  };

  // Get city name from coordinates
  const getCityFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const addressComponents = response.data.results[0]?.address_components;
      if (!addressComponents) {
        console.warn("No address components found for the given coordinates.");
        return 'Unknown Location';
      }

      const cityComponent = addressComponents.find(component =>
        component.types.includes("locality") || component.types.includes("administrative_area_level_1")
      );

      return cityComponent ? cityComponent.long_name : 'Unknown Location';

    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return 'Unknown Location';
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
      fetchUserItem();
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterItems(query, selectedLocation);
  };

  const filterItems = (query, location) => {
    const filtered = itemData.filter(item => {
      const matchesSearch =
        (item.itemName && item.itemName.toLowerCase().includes(query.toLowerCase())) ||
        (item.label && item.label.toLowerCase().includes(query.toLowerCase()));

      const matchesLocation = location === 'All' || (item.label && item.label === location);

      return matchesSearch && matchesLocation;
    });

    setFilteredData(filtered);
  };

  // New function to handle location change from LocationTab
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    filterItems(searchQuery, location);
  };

  // Navigate to item details screen when clicked the card
  const navigateToDetails = (item) => {
    navigation.navigate('ReceiverItemDetails', { item });
  };

  const navigateToProfile = () => {
    navigation.navigate('ProfileHome');
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            marginTop: 25,
            paddingHorizontal: 34,
            paddingBottom: 60,
            paddingVertical: 30,
            backgroundColor: palette.primary.main,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            elevation: 8,
          }}
        >
          {userProfile.firstName ? (
            <Text style={{ fontSize: 19, marginBottom: 20, color: 'white' }}>
              Hi, {userProfile.firstName} {userProfile.lastName}
            </Text>
          ) : (
            <Text style={{ fontSize: 19, marginBottom: 20, color: 'white' }}>
              Hi, {userProfile.email}
            </Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ fontSize: 24, color: 'white' }}>
                Your <Text style={{ fontWeight: '800', fontSize: 25, color: 'white' }}>Next Meal</Text> is
              </Text>
              <Text style={{ fontSize: 24, color: 'white' }}>
                Just a <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Tap Away </Text>
              </Text>
            </View>
            <Icon name='food' size={60} color="white" />
          </View>
        </View>

        {/* Display tabs of locations as filtering */}
        <View style={{ marginTop: 30, marginLeft: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: '800' }}>Locations</Text>
          <LocationTab
            locations={locations}
            selectedLocation={selectedLocation}
            handleLocationChange={handleLocationChange}
          />
        </View>

        <View style={{ padding: 16 }}>
          <Searchbar
            placeholder="Search"
            onChangeText={handleSearch}
            value={searchQuery}
            style={{ marginBottom: 16 }}
          />

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <View key={item.id} style={{ width: `${100 / SCREEN_WIDTH}%`, padding: 8 }}>
                  <TouchableOpacity onPress={() => navigateToDetails(item)}>
                    <Card style={{
                      padding: 8,
                      elevation: 2,
                      borderRadius: 18,
                      backgroundColor: '#fff',
                    }}>
                      <View style={{ flexDirection: 'column' }}>
                        {item.imageUrl ? (
                          <Image
                            style={{
                              width: `${200 / SCREEN_WIDTH}%`,
                              height: 120,
                              borderRadius: 16,
                            }}
                            source={{ uri: item.imageUrl }}
                            resizeMode="cover"
                            onError={() => console.log("Failed to load image: ", item.imageUrl)}
                          />
                        ) : (
                          <Image
                            style={{
                              width: '100%',
                              height: 120,
                              borderTopLeftRadius: 8,
                              borderTopRightRadius: 8,
                            }}
                            source={require("../../../assets/icons/heart.png")}
                            resizeMode="cover"
                          />
                        )}
                        <View style={{ padding: 10, paddingVertical: 6 }}>
                          <Text style={{ fontSize: 16, fontWeight: '800', paddingLeft: 3 }}>{item.itemName}</Text>
                          <Text
                            style={{
                              fontSize: 12,
                              backgroundColor: palette.primary.light,
                              paddingHorizontal: 5,
                              paddingVertical: 3,
                              borderRadius: 5,
                              marginVertical: 7,
                              alignSelf: 'flex-start',
                            }}
                          >
                            {item.label}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>No items found for the selected location.</Text>
            )}
          </View>
        </View>
      </ScrollView>

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
}
