import { useLayoutEffect, useState, useEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image, ActivityIndicator } from "react-native";
import styles from "./styles"; // Ensure styles are defined
import MenuImage from "../../components/MenuImage/MenuImage"; // Adjust path as necessary
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/firebase'; // Adjust the path as necessary

export default function DonatorHomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [recipeData, setRecipeData] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "items")); // Change "items" to your collection name
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

    fetchRecipes();
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
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
      <View style={styles.container}>
        {item.imageUrl ? ( // Check if imageUrl exists
          <Image style={styles.photo} source={{ uri: item.imageUrl }} />
        ) : (
          <Image style={styles.photo} source={require("../../../assets/icons/heart.png")} />
        )}
        <Text style={styles.title}>{item.itemName}</Text>
        <Text style={styles.infoText}>{item.description}</Text>
      </View>
    </TouchableHighlight>
  );


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const navigateToProfile = () => {
    navigation.navigate('ProfileHome');
  };

  return (
    <>
      <View style={styles.screen}>
        <Text style={styles.headerText}>Donator Home</Text>

        <TouchableHighlight
          style={styles.addCard}
          underlayColor="rgba(73,182,77,0.9)"
          onPress={onPressAddNew}
        >
          <View style={styles.addCardContainer}>
            <Ionicons name="add-circle" size={50} color="green" style={styles.addIcon} />
            <Text style={styles.addCardText}>Add New Item</Text>
          </View>
        </TouchableHighlight>

        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={recipeData}
          renderItem={renderRecipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer} // Added style for the FlatList content
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
}
