import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { auth } from '../../utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [UserEmailAddress, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!UserEmailAddress) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, UserEmailAddress);

      Toast.show({
        type: 'success',
        text1: 'Password Reset Email Sent',
        text2: `Please check your email to reset your password.`,
      });

      navigation.navigate('Login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Forgot Password" />
        <Card.Content>
          <TextInput
            label="Email"
            value={UserEmailAddress}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
            style={styles.input}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button
            mode="contained"
            onPress={handlePasswordReset}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Send Reset Email
          </Button>
        </Card.Content>
      </Card>
      
      <View style={styles.footer}>
        <Text>Remembered your password? </Text>
        <Button onPress={() => navigation.navigate('Login')}>Login</Button>
      </View>
    </View>
  );
}

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
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})