import { View } from 'react-native';
// @react-navigation
import { useRoute } from '@react-navigation/native';
// components
import ItemDetailsComponent from './ItemDetailsComponent'

// ----------------------------------------------------------------------

export default function DonatorItemDetails() {
    const route = useRoute();
    const { item } = route.params;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ItemDetailsComponent item={item} />
        </View>
    );
}
