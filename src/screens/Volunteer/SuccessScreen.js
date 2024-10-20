import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.successMessage}>Successfully Reserved!</Text>
      {/* Button to go back to the planner */}
      <Button
        title="Go Back to Planner"
        onPress={() => navigation.navigate('BookingPlanner')}
      />
    </View>
  );
};