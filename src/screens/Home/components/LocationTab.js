import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { TabView, TabBar } from 'react-native-tab-view';
// firebase
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import palette from '../../../theme/palette';

// ----------------------------------------------------------------------

export default function LocationTab() {
    const [index, setIndex] = useState(0);
    const [locations, setLocations] = useState([]);
    const [routes, setRoutes] = useState([]);

    const fetchLocations = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'locations'));
            const fetchedLocations = querySnapshot.docs.map(doc => ({
                id: doc.id,
                label: doc.data().LocationName || 'Unknown Location',
            }));

            setLocations(fetchedLocations);

            const locationRoutes = [
                { key: 'all', title: 'All', icon: 'book-open-outline' },
                ...fetchedLocations.map(location => ({
                    key: location.id,
                    title: location.label,
                    icon: 'map-marker-outline',
                })),
            ];

            setRoutes(locationRoutes);
        } catch (error) {
            console.error("Error fetching locations: ", error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const renderScene = ({ route }) => (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
        >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{route.title}</Text>
        </View>
    );

    const renderTabBar = props => (
        <TabBar
            {...props}
            scrollEnabled
            style={{ backgroundColor: '#fff' }}
            indicatorStyle={{ display: 'none' }}
            pressColor='white'
            tabStyle={{ width: 'auto' }}
            renderLabel={({ route, focused }) => (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 15,
                        paddingHorizontal: 15,
                        paddingVertical: 20,
                        margin: 3,
                        elevation: focused ? 7 : 1,
                        backgroundColor: focused ? palette.primary.main : '#fff',
                    }}
                >
                    <Icon name={route.icon} size={20} color={focused ? '#fff' : palette.disabled.main} />
                    <Text style={{
                        marginLeft: 4,
                        fontSize: 14,
                        color: focused ? '#fff' : palette.disabled.main,
                        fontWeight: focused ? '700' : '400',
                    }}>
                        {route.title}
                    </Text>
                </View>
            )}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            {routes.length > 0 ? (
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: 400 }}
                    renderTabBar={renderTabBar}
                />
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading locations...</Text>
            )}
        </View>
    );
}
