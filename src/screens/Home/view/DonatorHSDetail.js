import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Card, Button } from "react-native-paper";
import { GOOGLE_MAPS_API_KEY } from '@env';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// import { firestore } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import palette from '../../../theme/palette';

export default function DonatorHSDetail() {
  const navigation = useNavigation();
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {item.imageUrl ? (
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            source={{ uri: item.imageUrl }}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            source={require("../../../../assets/icons/heart.png")}
            resizeMode="cover"
          />
        )}

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            minHeight: 260,
            paddingVertical: 40,
            paddingHorizontal: 24,
            backgroundColor: '#fff',
            borderTopLeftRadius: 56,
            borderTopRightRadius: 56,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={palette.primary.main} style={{ marginRight: 5, marginBottom: 5 }} />
          </TouchableOpacity>

          <Text style={{ fontSize: 19, fontWeight: '700' }}>
            {item.itemName}
          </Text>

          <View style={{ flexDirection: 'row', flex: 1, marginTop: 25 }}>
            {item.location && (
              <View style={{ width: 100, height: 100 }}>
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: item.location.latitude,
                      longitude: item.location.longitude,
                    }}
                    title={item.itemName}
                    description={address}
                  />
                </MapView>
              </View>
            )}

            <View style={{ flexDirection: 'column', flex: 1, marginLeft: 15 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                Address
              </Text>
              <Text>{address || item.address}</Text>
              <Text
                style={{
                  fontSize: 12,
                  backgroundColor: palette.primary.light,
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  borderRadius: 5,
                  marginVertical: 10,
                  marginLeft: -2,
                  alignSelf: 'flex-start',
                }}
              >
                {item.label}
              </Text>
            </View>
          </View>

          {item.description &&
            <View style={{ flexDirection: 'column', marginTop: 20 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                Description
              </Text>
              <Text>{item.description}</Text>
            </View>
          }
        </View>
      </ScrollView>

      <View style={{ padding: 12 }}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: "white", fontWeight: '700', fontSize: 16 }}>Back</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}