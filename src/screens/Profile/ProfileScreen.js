import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// components
import ProfileForm from './ProfileForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import palette from '../../theme/palette';
import BackButton from '../../components/BackButton/BackButton';

// ----------------------------------------------------------------------

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
        marginTop: 40,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BackButton />

          <Text style={{ fontSize: 24, fontWeight: 800 }}>Profile</Text>
        </View>


        <TouchableOpacity onPress={() => navigation.navigate('FeedbackHome')}>
          <Icons name="feedback" size={24} color={palette.primary.main} />
        </TouchableOpacity>
      </View>

      <ProfileForm />

    </ScrollView>
  );
}
