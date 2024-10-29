import { View } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { Link } from '@react-navigation/native';
// components
import AuthRegisterForm from './AuthRegisterForm';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function RegisterScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
      }}
    >
      <AuthRegisterForm />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Already have an account? </Text>
        <Link to={{ screen: 'Login' }} style={{ color: palette.primary.main, }}>
          Login
        </Link>
      </View>
    </View>
  );
}
