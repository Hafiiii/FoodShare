import { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, Image } from 'react-native';
import { Searchbar, Text, Card } from 'react-native-paper';
// firebase
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { auth, firestore, storage } from '../../utils/firebase';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LocationTab from './components/LocationTab';
import palette from '../../theme/palette';

const { width } = Dimensions.get('window');
const SCREEN_WIDTH = width < 600 ? 2 : 4;

export default function ReceiverHomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [userProfile, setUserProfile] = useState({ firstName: '', lastName: '', email: '' });

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
      const items = await Promise.all(querySnapshot.docs.map(async doc => {
        const itemData = doc.data();
        let imageUrl = itemData.imageUrl;

        if (imageUrl && imageUrl.startsWith("gs://")) {
          const storageRef = ref(storage, imageUrl);
          imageUrl = await getDownloadURL(storageRef);
        }

        return { id: doc.id, ...itemData, imageUrl };
      }));

      setItemData(items);
      setFilteredData(items);
    } catch (error) {
      console.error("Error fetching user items: ", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserItem();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = userProfile.filter(user =>
        (user.itemName && user.itemName.toLowerCase().includes(query.toLowerCase())) ||
        (user.location && user.location.toLowerCase().includes(query.toLowerCase()))
        // (user.UserContactNo && user.UserContactNo.includes(query))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(itemData);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          marginTop: 40,
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

      {/* Location and Search Section */}
      <View style={{ marginTop: 30, marginLeft: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: '800' }}>Locations</Text>
        <LocationTab />
      </View>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Search by Name, Email, Contact, Gender, or Role"
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
              <View key={item.id} style={{ width: `${100 / SCREEN_WIDTH}%`, padding: 4 }}>
                <Card style={{
                  padding: 12,
                  elevation: 2,
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  marginBottom: 8,
                }}>
                  <Card.Content>
                    {item.imageUrl ? ( // Check if imageUrl exists
                      <Image style={{ width: 100, height: 100 }} source={{ uri: item.imageUrl }} onError={() => console.log("Failed to load image: ", item.imageUrl)} />
                    ) : (
                      <Image style={{ width: 100, height: 100 }} source={require("../../../assets/icons/heart.png")} />
                    )}
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.itemName}</Text>
                    <Text>{item.UserEmailAddress}</Text>
                    <Text>{item.UserContactNo}</Text>
                    <Text>Gender: {item.UserGender}</Text>
                    <Text>Role: {item.UserRole}</Text>
                  </Card.Content>
                </Card>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#888', fontSize: 16 }}>
              No item found
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

