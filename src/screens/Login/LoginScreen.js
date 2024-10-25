import { View } from 'react-native';
// components
import LoginForm from './LoginForm';

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
      <LoginForm />
    </View>
  );
}
