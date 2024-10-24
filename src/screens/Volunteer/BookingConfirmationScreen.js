import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BookingConfirmationScreen = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Successfully reserved your spot!</Text>
      <Button
        title="OK"
        onPress={() => navigation.navigate('BookingPlanner')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default BookingConfirmationScreen;
