import { View } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { Link } from '@react-navigation/native';
// components
import AuthResetPasswordForm from './AuthResetPasswordForm';
import { useTheme } from '../../theme';

// ----------------------------------------------------------------------

export default function ResetPasswordScreen() {
  const { palette } = useTheme();
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
      }}
    >
      <AuthResetPasswordForm />

      <View style={{
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>Remembered your password? </Text>
        <Link
          to={{ screen: 'Login' }}
          style={{
            color: palette.primary.main,
          }}
        >
          Login
        </Link>
      </View>
    </View>
  );
}
