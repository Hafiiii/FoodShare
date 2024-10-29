import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import palette from '../../../theme/palette';

// ----------------------------------------------------------------------

export default function LocationTab({ locations, selectedLocation, handleLocationChange }) {
    return (
        <View style={{ padding: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                    onPress={() => handleLocationChange('All')}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 20,
                        paddingHorizontal: 15,
                        backgroundColor: selectedLocation === 'All' ? palette.primary.main : '#f9f9f9',
                        elevation: selectedLocation === 'All' ? 3 : 0,
                        borderRadius: 15,
                        marginRight: 10,
                    }}
                >
                    <Icon
                        name="book-open-outline"
                        size={20}
                        color={selectedLocation === 'All' ? '#fff' : palette.disabled.main}
                        style={{ marginRight: 5 }}
                    />
                    <Text style={{ color: selectedLocation === 'All' ? '#fff' : palette.disabled.main }}>
                        All
                    </Text>
                </TouchableOpacity>

                {locations.map((location) => (
                    <TouchableOpacity
                        key={location}
                        onPress={() => handleLocationChange(location)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 20,
                            paddingHorizontal: 15,
                            backgroundColor: selectedLocation === location ? palette.primary.main : '#f9f9f9',
                            elevation: selectedLocation === location ? 3 : 0,
                            borderRadius: 15,
                            marginRight: 10,
                        }}
                    >
                        <Icon
                            name="map-marker-outline"
                            size={20}
                            color={selectedLocation === location ? '#fff' : palette.disabled.main}
                            style={{ marginRight: 5 }}
                        />
                        <Text style={{ color: selectedLocation === location ? '#fff' : palette.disabled.main }}>
                            {location}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
