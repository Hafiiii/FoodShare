import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const BookingDetailsScreen = ({ navigation }) => {
  const [foodDetails, setFoodDetails] = useState('');

  /* not confirmed
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Shift</Text>
      <Text style={styles.label}>Time: 8:00 PM - 9:00 PM</Text>
      <Text style={styles.label}>Location: Kuching</Text>

      <Text style={styles.label}>Food Details:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Food Name / Quantity"
        value={foodDetails}
        onChangeText={setFoodDetails}
      />

      {// Button to reserve the shift }
      <Button
        title="Reserve My Slot"
        onPress={() => navigation.navigate('Success')}
      />
    
    </View>
  );
  */
};
