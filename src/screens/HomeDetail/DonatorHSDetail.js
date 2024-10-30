// DonatorHSDetail.js

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { GOOGLE_MAPS_API_KEY } from '@env';
import { firestore } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Add this line

export default function DonatorHSDetail({ navigation, route }) {
  const { item, title } = route.params;
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (item.location) {
      const { _lat: latitude, _long: longitude } = item.location;
      fetchAddressFromCoordinates(latitude, longitude);
    }
  }, [item]);

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Failed to retrieve address");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        {item.imageUrl ? (
          <Card.Cover source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <Card.Cover source={require("../../../assets/icons/heart.png")} style={styles.image} />
        )}
        <Card.Content>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.detail}>Item Name: {item.itemName}</Text>
          <Text style={styles.detail}>Description: {item.description}</Text>
          <Text style={styles.detail}>Address: {address}</Text>
        </Card.Content>
        {item.location && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: item.location._lat,
                longitude: item.location._long,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: item.location._lat,
                  longitude: item.location._long,
                }}
                title={item.itemName}
                description={address}
              />
            </MapView>
          </View>
        )}
      </Card>

      {/* Go Back Button */}
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#fff" />
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    marginTop: 15, // Add some space above the button
  },
  goBackText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
  card: {
    borderRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    height: 200,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  detail: {
    fontSize: 16,
    marginVertical: 2,
    color: "gray",
  },
  mapContainer: {
    height: 200,
    marginTop: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});
