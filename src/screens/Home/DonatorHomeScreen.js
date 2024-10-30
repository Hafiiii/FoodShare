import { useState, useCallback } from 'react';
import { ScrollView, View, TouchableHighlight, ActivityIndicator } from "react-native";
import { Text } from 'react-native-paper';
import axios from 'axios';
// @react-navigation
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// firebase
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { auth, firestore, storage } from '../../utils/firebase';
// components
import palette from '../../theme/palette';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileButton from "../../components/ProfileButton/ProfileButton";
import ItemCardComponent from "./components/ItemCardComponent";
import { GOOGLE_MAPS_API_KEY } from '@env';

// ----------------------------------------------------------------------

export default function DonatorHomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState([]);
  const [userProfile, setUserProfile] = useState({ firstName: '', lastName: '', email: '' });

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

  const fetchUserItem = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "items"));
      const items = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const itemData = doc.data();
        let imageUrl = itemData.imageUrl;

        // Fetch image URL from Firebase Storage if it starts with "gs://"
        if (imageUrl && imageUrl.startsWith("gs://")) {
          const storageRef = ref(storage, imageUrl);
          imageUrl = await getDownloadURL(storageRef);
        }

        const locationData = itemData.location;
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

      setItemData(items);
    } catch (error) {
      console.error("Error fetching items: ", error);
    } finally {
      setLoading(false);
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

  const onPressAddNew = () => {
    navigation.navigate("AddNewItem");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            marginTop: 45,
            paddingHorizontal: 34,
            paddingBottom: 20,
            paddingVertical: 20,
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
            <View style={{ flexDirection: 'column', marginRight: 10 }}>
              <Text style={{ fontSize: 24, color: 'white' }}>
                Connect <Text style={{ fontWeight: '800', fontSize: 25, color: 'white' }}>People In Need</Text>
              </Text>
              <Text style={{ fontSize: 24, color: 'white' }}>
                With those who <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Can Help</Text>
              </Text>
            </View>
            <Icon name='food' size={60} color="white" />
          </View>

          <TouchableHighlight
            style={{
              marginTop: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 15,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            underlayColor="rgba(73,182,77,0.9)"
            onPress={onPressAddNew}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="add-circle" size={40} color="green" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 18, color: 'green' }}>Add New Item</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={{ padding: 16 }}>
          <ItemCardComponent filteredData={itemData} detailsScreen="DonatorItemDetails" />
        </View>
      </ScrollView>

      <ProfileButton />
    </>
  );
}
