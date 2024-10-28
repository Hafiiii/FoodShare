import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, firestore } from '../../utils/firebase';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

export default function AddNewItemScreen({ navigation }) {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const storage = getStorage();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.uri) {
      setImage(result.uri);
    }
  };

  const handleConfirm = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!itemName || !description || !location) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Item name, description and location are required.',
      });
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = '';

      if (image) {
        const imageRef = ref(storage, `items/${user.uid}/${Date.now()}`);
        const img = await fetch(image);
        const bytes = await img.blob();
        await uploadBytes(imageRef, bytes);
        uploadedImageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(firestore, "items"), {
        itemName,
        description,
        location,
        donatorId: user.uid,
        imageUrl: uploadedImageUrl,
        timestamp: new Date(),
      });

      Toast.show({
        type: 'success',
        text1: 'Item Added',
        text2: 'The item has been saved successfully.',
      });

      // Reset form fields
      setItemName('');
      setDescription('');
      setLocation('');
      setImage(null);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving item: ", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save the item.',
      });
    } finally {
      setLoading(false);
    }
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
      placeholder="Location"
      value={location}
      onChangeText={setLocation}
      multiline
    />
    
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'right', 
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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
