import { useState, useEffect } from 'react';
import { View, ScrollView, FlatList, Dimensions } from 'react-native';
import { Searchbar, Text, Card } from 'react-native-paper';
// firebase
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LocationTab from './components/LocationTab';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

const { width } = Dimensions.get('window');
const COLUMN_COUNT = width < 600 ? 2 : 4;

// ----------------------------------------------------------------------

export default function ReceiverHomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fetchUserProfiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "users"));
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setUserData(users);
      setFilteredData(users);

      if (users.length > 0) {
        setFirstName(users[0].FirstName);
        setLastName(users[0].LastName);
      }
    } catch (error) {
      console.error("Error fetching user profiles: ", error);
    }
  };

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = userData.filter(user =>
        (user.FirstName && user.FirstName.toLowerCase().includes(query.toLowerCase())) ||
        (user.LastName && user.LastName.toLowerCase().includes(query.toLowerCase())) ||
        (user.UserEmailAddress && user.UserEmailAddress.toLowerCase().includes(query.toLowerCase())) ||
        (user.UserContactNo && user.UserContactNo.includes(query)) ||
        (user.UserGender && user.UserGender.toLowerCase().includes(query.toLowerCase())) ||
        (user.UserRole && user.UserRole.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(userData);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={{
      marginVertical: 8,
      padding: 12,
      elevation: 2,
      borderRadius: 8,
      backgroundColor: '#fff',
      flex: 1,
      margin: 4,
    }}>
      <Card.Content>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.FirstName} {item.LastName}</Text>
        <Text>{item.UserEmailAddress}</Text>
        <Text>{item.UserContactNo}</Text>
        <Text>Gender: {item.UserGender}</Text>
        <Text>Role: {item.UserRole}</Text>
      </Card.Content>
    </Card>
  );

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
        <Text style={{ fontSize: 19, marginBottom: 20, color: 'white' }}>
          Hi, {firstName} {lastName}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 24, color: 'white' }}>
              Your <Text style={{ fontWeight: 800, fontSize: 25, color: 'white' }}>Next Meal</Text> is
            </Text>
            <Text style={{ fontSize: 24, color: 'white' }}>
              Just a <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Tap Away </Text>
            </Text>
          </View>
          <Icon name='food' size={60} color="white" />
        </View>
      </View>

      <View style={{ marginTop: 30, marginLeft: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: 800 }}>Locations</Text>
        <LocationTab />
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <Searchbar
          placeholder="Search by Name, Email, Contact, Gender, or Role"
          onChangeText={handleSearch}
          value={searchQuery}
          style={{ marginBottom: 16 }}
        />
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={COLUMN_COUNT}
          key={COLUMN_COUNT}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                color: '#888',
                fontSize: 16,
              }}
            >
              No user found
            </Text>
          }
        />
      </View>
    </ScrollView>
  );
}
