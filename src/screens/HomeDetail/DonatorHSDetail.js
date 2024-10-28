import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DonatorHSDetail({ route }) {
  // Retrieve the passed category and title via route.params
  const { item, title } = route.params;

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
      <Text>Item Name: {item.itemName}</Text>
      <Text>Description: {item.description}</Text>
      <Text>Location: {item.location}</Text>
    </View>
  );
}
