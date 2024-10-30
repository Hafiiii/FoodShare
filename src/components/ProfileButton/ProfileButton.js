import { TouchableOpacity } from 'react-native';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function ProfileButton() {
    const navigation = useNavigation();

    const navigateToProfile = () => {
        navigation.navigate('ProfileHome');
    };

    return (
        <TouchableOpacity
            style={{
                position: 'absolute',
                bottom: 30,
                right: 30,
                width: 46,
                height: 46,
                borderRadius: 30,
                backgroundColor: palette.primary.main,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 5,
            }}
            onPress={navigateToProfile}
        >
            <Icon name="account" size={28} color="#fff" />
        </TouchableOpacity>
    );
}
