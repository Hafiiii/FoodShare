import { View } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { Link } from '@react-navigation/native';
// components
import AuthLoginForm from './AuthLoginForm';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function LoginScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
      }}
    >
      <AuthLoginForm />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Don't have an account? </Text>
        <Link
          to={{ screen: 'Register' }}
          style={{
            color: palette.primary.main,
          }}
        >
          Sign Up
        </Link>
      </View>
    </View>
  );
}
