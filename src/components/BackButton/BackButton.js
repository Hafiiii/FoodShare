import { TouchableOpacity } from 'react-native';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function BackButton() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={palette.primary.main} style={{ marginRight: 5 }} />
        </TouchableOpacity>
    );
}
