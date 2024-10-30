import { useLayoutEffect, useState, useEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import styles from "./styles"; // Ensure styles are defined
import MenuImage from "../../components/MenuImage/MenuImage"; // Adjust path as necessary
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/firebase'; // Adjust the path as necessary
import palette from '../../theme/palette';
import { Card } from 'react-native-paper'; // Correctly importing Card component from react-native-paper

export default function DonatorHomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [recipeData, setRecipeData] = useState([]);
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "items"));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipeData(items);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = () => {
      const profile = { firstName: "Donator", lastName: "", email: "john.doe@example.com" };
      setUserProfile(profile);
    };

    fetchRecipes();
    fetchUserProfile();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage onPress={() => navigation.openDrawer()} />
      ),
      headerRight: () => <View />,
    });
  }, [navigation]);

  const onPressRecipe = (item) => {
    navigation.navigate("DonatorHSDetail", { item });
  };

  const onPressAddNew = () => {
    navigation.navigate("AddNewItem");
  };

  const renderRecipes = ({ item }) => (
    <View key={item.id} style={{ width: `${100 / 2}%`, padding: 8 }}>
      <TouchableOpacity onPress={() => onPressRecipe(item)}>
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
                  width: '100%',
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
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderHeader = () => (
    <View
      style={{
        marginTop: 45,
        paddingHorizontal: 30,
        paddingBottom: 20,
        paddingVertical: 20,
        backgroundColor: palette.primary.main,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        elevation: 8,
      }}
    >
      {userProfile.firstName ? (
        <Text style={{ fontSize: 19, marginBottom: 30, color: 'white' }}>
          Hi, {userProfile.firstName} {userProfile.lastName}
        </Text>
      ) : (
        <Text style={{ fontSize: 19, marginBottom: 20, color: 'white' }}>
          Hi, {userProfile.email || 'Guest'}
        </Text>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'column' }}>
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
  );

  const navigateToProfile = () => {
    navigation.navigate('ProfileHome');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={recipeData}
        renderItem={renderRecipes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />

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
    </View>
  );
}
