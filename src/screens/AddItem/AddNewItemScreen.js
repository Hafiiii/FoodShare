import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';
import { addDoc, collection, GeoPoint } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth, firestore } from '../../utils/firebase';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

const GOOGLE_API_KEY = 'AIzaSyCRJGqmHnj66TuD0ak44IdsHd7pJZ7kRgw'; // Your Google API Key

export default function AddNewItemScreen({ navigation }) {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      console.log('Geocoding response:', data); // Log the response for debugging
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setLocation({
          latitude: location.lat,
          longitude: location.lng,
        });
        Toast.show({
          type: 'success',
          text1: 'Location Found',
          text2: 'Location set successfully.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Location Not Found',
          text2: 'Unable to find location from the address entered.',
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch location coordinates.',
      });
    }
  };

  const handleConfirm = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!itemName || !description || !location) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Item name, description, and location are required.',
      });
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = '';

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageName = `item_${user.uid}_${Date.now()}.jpg`;
        const imageRef = ref(storage, `items/${user.uid}/${imageName}`);

        await uploadBytes(imageRef, blob);
        uploadedImageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(firestore, "items"), {
        itemName,
        description,
        location: new GeoPoint(location.latitude, location.longitude), // Save GeoPoint
        address, // Save user-entered address
        donatorId: user.uid,
        imageUrl: uploadedImageUrl,
        timestamp: new Date(),
      });

      Toast.show({
        type: 'success',
        text1: 'Item Added',
        text2: 'The item has been saved successfully.',
      });

      // Reset the form
      setItemName('');
      setDescription('');
      setLocation(null);
      setImage(null);
      setAddress('');
      navigation.goBack();
    } catch (error) {
      console.error("Error saving item:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save the item.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Type Location Address"
        value={address}
        onChangeText={setAddress}
      />

      <Button mode="contained" onPress={() => fetchCoordinates(address)} style={{ marginVertical: 10 }}>
        Confirm Address
      </Button>

      <Text style={styles.label}>Location:</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.latitude : 1.5534, // Default latitude for Sarawak, Malaysia
          longitude: location ? location.longitude : 110.3591, // Default longitude for Sarawak, Malaysia
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {location && <Marker coordinate={location} />}
      </MapView>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text>{image ? 'Change Image' : 'Select an Image'}</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
        <Button
          title="Confirm"
          mode="contained"
          onPress={handleConfirm}
          disabled={loading}
          style={{ flex: 1, marginRight: 10 }}
        >
          Confirm
        </Button>

        <Button
          title="Back"
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={{ flex: 1, marginLeft: 10 }}
        >
          Back
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePicker: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 20,
  },
});
