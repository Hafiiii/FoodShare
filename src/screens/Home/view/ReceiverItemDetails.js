import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
// @react-navigation
import { useNavigation, useRoute } from '@react-navigation/native';
// components
import ItemDetailsComponent from './ItemDetailsComponent'

// ----------------------------------------------------------------------

export default function ReceiverItemDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  const handleReserveClick = () => {
    navigation.navigate('ReservedItemForm', { item });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ItemDetailsComponent item={item} />

      <View style={{ padding: 12 }}>
        <Button
          mode="contained"
          onPress={handleReserveClick}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: "white", fontWeight: '700', fontSize: 16 }}>Continue</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
