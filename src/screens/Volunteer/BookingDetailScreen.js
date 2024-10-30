import { useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// location
import MapView, { Marker } from 'react-native-maps';
// @react-navigation
import { useRoute, useNavigation } from '@react-navigation/native';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function DetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, addresses } = route.params;

  const donatorLocation = item.donatorLocation;
  const receiverLocation = item.receiverLocation;

  return (
    <ScrollView style={{
      flex: 1,
      padding: 20,
      marginVertical: 20,
    }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={palette.primary.main} style={{ marginRight: 5, marginBottom: 5 }} />
        </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{item.receiverName}</Text>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Location Details</Text>
      <Text style={{ fontSize: 18, marginVertical: 10 }}>Donator Location:</Text>
      <Text>{addresses[item.id]?.donator || 'Address not available'}</Text>
      <MapView
        style={{
          width: '100%',
          height: 200,
          marginBottom: 20
        }}
        initialRegion={{
          latitude: donatorLocation.latitude,
          longitude: donatorLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: donatorLocation.latitude,
            longitude: donatorLocation.longitude,
          }}
          title="Donator"
        />
      </MapView>

      <Text style={{ fontSize: 18, marginVertical: 10 }}>Receiver Location:</Text>
      <Text>{addresses[item.id]?.receiver || 'Address not available'}</Text>
      <MapView
        style={{
          width: '100%',
          height: 200,
          marginBottom: 20
        }}
        initialRegion={{
          latitude: receiverLocation.latitude,
          longitude: receiverLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: receiverLocation.latitude,
            longitude: receiverLocation.longitude,
          }}
          title="Receiver"
        />
      </MapView>
    </ScrollView>
  );
}
