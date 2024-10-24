import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
// Firebase
import firebase from 'firebase/app';
import 'firebase/firestore';

const BookingDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { recipientName, time, location } = route.params;
  
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleReservation = async () => {
    setLoading(true);
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        // Store booking details in Firestore
        await firebase.firestore().collection('bookings').add({
          userId: user.uid,
          recipientName,
          time,
          location,
          foodName,
          quantity,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setError('');
        // Navigate to confirmation screen
        navigation.navigate('BookingConfirmation');
      } else {
        setError('You must be logged in to reserve a shift.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Booking Details" />
        <Card.Content>
          <Text style={styles.label}>Your Shift:</Text>
          <Text>{time}</Text>
          
          <Text style={styles.label}>Location:</Text>
          <Text>{location}</Text>
          
          <TextInput
            label="Food Name"
            value={foodName}
            onChangeText={setFoodName}
            placeholder="Enter food name"
            style={styles.input}
          />
          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Enter quantity"
            style={styles.input}
          />
          
          {/* Sample Image, replace this with actual food image upload logic */}
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.image}
          />
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button
            mode="contained"
            onPress={handleReservation}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Reserve My Slot
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
  },
  button: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

export default BookingDetailsScreen;
