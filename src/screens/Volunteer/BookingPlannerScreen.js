import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const BookingPlannerScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booking Planner</Text>
      {/* Button to navigate to booking details */}
      <Button
        title="Choose your shift"
        onPress={() => navigation.navigate('BookingDetails')}
      />
    </View>
  );
};