import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { TabView, TabBar } from 'react-native-tab-view';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../theme';

// ----------------------------------------------------------------------

const locations = [
    { id: 1, label: 'Serian' },
    { id: 2, label: 'Bau' },
    { id: 3, label: 'Pandawan' },
    { id: 4, label: 'Lundu' },
    { id: 5, label: 'Kampung Bako' },
];

// ----------------------------------------------------------------------

export default function LocationTab() {
    const { palette } = useTheme();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'all', title: 'All', icon: 'book-open-outline' },
        ...locations.map(data => ({
            key: data.id.toString(),
            title: data.label,
            icon: 'map-marker-outline' || 'book-open-outline',
        })),
    ]);

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
            {/* Additional content for the location can be placed here */}
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
                        fontWeight: focused ? 700 : 400,
                    }}>
                        {route.title}
                    </Text>
                </View>
            )}
        />
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: 400 }}
            renderTabBar={renderTabBar}
        />
    );
}
