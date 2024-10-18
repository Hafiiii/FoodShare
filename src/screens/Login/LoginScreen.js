import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { auth } from '../../utils/firebase'; // Ensure this path is correct
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import this function

const LoginScreen = ({ navigation }) => {
  const [UserEmailAddress, setEmail] = useState('');
  const [UserPassword, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle user login
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Firebase authentication using signInWithEmailAndPassword
      await signInWithEmailAndPassword(auth, UserEmailAddress, UserPassword);
      // Redirect to home screen after successful login
      navigation.navigate('Profile');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Login" />
        <Card.Content>
          <TextInput
            label="Email"
            value={UserEmailAddress}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
            style={styles.emailInput}
          />
          <TextInput
            label="Password"
            value={UserPassword}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            style={styles.passwordInput}
          />
          <Button
            labelStyle={{ color: 'grey' }}
            mode="text"
            onPress={() => navigation.navigate('ResetPassword')}
            style={styles.forgotPasswordButton}
          >
            Forgot Password?
          </Button>

          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Login
          </Button>
        </Card.Content>
      </Card>
      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <Button onPress={() => navigation.navigate('Register')}>Sign Up</Button>
      </View>
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
  emailInput: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
