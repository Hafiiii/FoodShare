import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { dummyOrder } from '../Volunteer/dummyData'; 

const RiderHomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Planner</Text>
      <TouchableOpacity
        style={styles.bookingContainer}
        onPress={() => navigation.navigate('BookingDetailScreen', { order: dummyOrder })}
      >
        <Text style={styles.foodShareShift}>FoodShare Shift</Text>
        <Text style={styles.time}>{dummyOrder.startTime} - {dummyOrder.endTime}</Text>
        <Text style={styles.location}>{dummyOrder.location}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  bookingContainer: { marginTop: 20, padding: 15, backgroundColor: '#e0f7fa', borderRadius: 8 },
  foodShareShift: { fontSize: 18, fontWeight: 'bold' },
  time: { fontSize: 16 },
  location: { fontSize: 16, color: 'gray' },
});

export default RiderHomeScreen;
