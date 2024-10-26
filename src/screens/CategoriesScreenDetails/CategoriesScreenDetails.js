import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CategoriesScreenDetails({ route }) {
  // Retrieve the passed category and title via route.params
  const { category, title } = route.params;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        {title}
      </Text>
      <Text>Category ID: {category.id}</Text>
      <Text>More details about the category can go here.</Text>
    </View>
  );
}
