import { View } from 'react-native';
// components
import ProfileForm from './ProfileForm';

// ----------------------------------------------------------------------

export default function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
      }}
    >
      <ProfileForm />
    </View>
  );
}
