import { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
// auth
import { useAuth } from '../../context/AuthContext';
// components
import { useTheme } from '../../theme';

export default function LoginForm() {
  const { palette } = useTheme();
  const navigation = useNavigation();
  const { handleLogin } = useAuth();
  const [UserEmailAddress, setEmail] = useState('');
  const [UserPassword, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginAttempt = async () => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, UserEmailAddress, UserPassword);
      handleLogin();

    } catch (err) {
      console.error("Error during login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ padding: 20, margin: 10 }}>
      <Card.Title title="Login" />
      <Card.Content>
        <TextInput
          label="Email"
          value={UserEmailAddress}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
          style={{ marginBottom: 20 }}
        />
        <TextInput
          label="Password"
          value={UserPassword}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        <Button
          labelStyle={{ color: palette.disabled.main, fontSize: 12 }}
          mode="text"
          onPress={() => navigation.navigate('ResetPassword')}
          style={{ alignSelf: 'flex-end' }}
        >
          Forgot Password?
        </Button>

        {error && <Text style={{ color: palette.error.main, marginBottom: 20 }}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleLoginAttempt}
          loading={loading}
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          Login
        </Button>

        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Don't have an account? </Text>
          <Button onPress={() => navigation.navigate('Register')}>Sign Up</Button>
        </View>
      </Card.Content>
    </Card>
  );
}
