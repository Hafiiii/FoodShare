import { View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// components
import palette from '../../../theme/palette';

// ----------------------------------------------------------------------

const { width } = Dimensions.get('window');
const SCREEN_WIDTH = width < 600 ? 2 : 4;

// ----------------------------------------------------------------------

export default function ReceiverHomeScreen({ filteredData, detailsScreen }) {
    const navigation = useNavigation();

    // Navigate to item details screen when clicked the card
    const navigateToDetails = (item) => {
        navigation.navigate(detailsScreen, { item });
    };

    return (
        <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        }}>
            {filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <View key={item.id} style={{ width: `${100 / SCREEN_WIDTH}%`, padding: 8 }}>
                        <TouchableOpacity onPress={() => navigateToDetails(item)}>
                            <Card style={{
                                padding: 8,
                                elevation: 2,
                                borderRadius: 18,
                                backgroundColor: '#fff',
                            }}>
                                <View style={{ flexDirection: 'column' }}>
                                    {item.imageUrl ? (
                                        <Image
                                            style={{
                                                width: `${200 / SCREEN_WIDTH}%`,
                                                height: 120,
                                                borderRadius: 16,
                                            }}
                                            source={{ uri: item.imageUrl }}
                                            resizeMode="cover"
                                            onError={() => console.log("Failed to load image: ", item.imageUrl)}
                                        />
                                    ) : (
                                        <Image
                                            style={{
                                                width: '100%',
                                                height: 120,
                                                borderTopLeftRadius: 8,
                                                borderTopRightRadius: 8,
                                            }}
                                            source={require("../../../../assets/icons/heart.png")}
                                            resizeMode="cover"
                                        />
                                    )}
                                    <View style={{ padding: 10, paddingVertical: 6 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '800', paddingLeft: 3 }}>{item.itemName}</Text>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                backgroundColor: palette.primary.light,
                                                paddingHorizontal: 5,
                                                paddingVertical: 3,
                                                borderRadius: 5,
                                                marginVertical: 7,
                                                alignSelf: 'flex-start',
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text>No items found for the selected location.</Text>
            )}
        </View>
    );
}
