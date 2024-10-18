import { useEffect, useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomeScreen from '../../screens/Home/HomeScreen';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import LoginScreen from '../../screens/Login/LoginScreen';

const BottomNavigationBar = ({ isLoggedIn, navigation }) => {
    const [index, setIndex] = useState(0);

    // Define routes based on login status
    const routes = isLoggedIn
        ? [
            { key: 'home', title: 'Home', icon: 'home' },
            { key: 'profile', title: 'Profile', icon: 'account' },
        ]
        : [
            { key: 'home', title: 'Home', icon: 'home' },
            { key: 'login', title: 'Login', icon: 'login' },
        ];

    // Render scene for the selected tab
    const renderScene = BottomNavigation.SceneMap({
        home: () => <HomeScreen navigation={navigation} />,
        profile: () => <ProfileScreen navigation={navigation} />,
        login: () => <LoginScreen navigation={navigation} />,
    });

    // Navigate to the selected screen when the index changes
    useEffect(() => {
        const currentRoute = routes[index].key;
        if (currentRoute === 'profile' && !isLoggedIn) {
            // Navigate to Login if trying to access Profile when not logged in
            navigation.navigate('Login');
            setIndex(0); // Reset to Home
        } else if (currentRoute === 'login' && isLoggedIn) {
            // Navigate to Profile if trying to access Login when already logged in
            navigation.navigate('Profile');
            setIndex(1); // Set to Profile
        }
    }, [index, isLoggedIn, navigation, routes]);

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
};

export default BottomNavigationBar;
