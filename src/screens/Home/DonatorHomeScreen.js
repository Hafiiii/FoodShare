import { useLayoutEffect, useState, useEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image, ActivityIndicator } from "react-native";
import styles from "./styles";
import { recipes } from "../../data/dataArrays";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryName } from "../../data/MockDataAPI";
import { Ionicons } from '@expo/vector-icons';

export default function DonatorHomeScreen(props) {
  const { navigation } = props;
  const [loading, setLoading] = useState(true);
  const [recipeData, setRecipeData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setRecipeData(recipes);
      setLoading(false);
    }, 1000);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, [navigation]);

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const onPressAddNew = () => {
    navigation.navigate("AddNewItem");
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo_url }} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
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

  return (
    <View style={styles.screen}>
      {/* Header Text */}
      <Text style={styles.headerText}>Donator Home</Text>
      
      <TouchableHighlight 
        style={styles.addCard}
        underlayColor="rgba(73,182,77,0.9)"
        onPress={onPressAddNew}
      >
        <View style={styles.addCardContainer}>
          <Ionicons name="add-circle" size={70} color="green" style={styles.addIcon} />
          <Text style={styles.addCardText}>Add New Item</Text>
        </View>
      </TouchableHighlight>
      
      <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={recipeData}
        renderItem={renderRecipes}
        keyExtractor={(item) => `${item.recipeId}`}
      />
    </View>
  );
}
