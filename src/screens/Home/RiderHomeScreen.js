import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// import { auth } from '../utils/firebase';
// import { onAuthStateChanged } from 'firebase/auth';

const RiderHomeScreen = () => {
  const navigation = useNavigation();

  // Retain Firebase authentication observer
  /*
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.replace('Login');
      }
    });
    return () => unsubscribe();
  }, []); */

  // State for booking details
  const [recipientName, setRecipientName] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Booking Planner" />
        <Card.Content>
          <TextInput
            label="Recipient Name"
            value={recipientName}
            onChangeText={setRecipientName}
            style={styles.input}
          />
          <TextInput
            label="Time (12-hour format) & Date"
            value={time}
            onChangeText={setTime}
            placeholder="e.g., 08:00 PM - 09:00 PM"
            style={styles.input}
          />
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g., Kuching"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={() => navigation.navigate('BookingDetails', {
              recipientName, time, location
            })}
            style={styles.button}
          >
            Proceed to Booking Details
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
  input: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 20,
  },
});

export default RiderHomeScreen;
