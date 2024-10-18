import { useState, useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import Iconify from 'react-native-iconify';

// Import your screens
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPassword/ResetPasswordScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import RecipesListScreen from '../screens/RecipesList/RecipesListScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Stack Navigator for Authentication
const MainStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        flex: 1,
      },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator for Home and other features
const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Iconify icon="mdi:home" size={size || 24} color={color || "#900"} />
        ),
      }}
    />
    <Tab.Screen
      name="Categories"
      component={CategoriesScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Iconify icon="mdi:heart" size={size || 24} color={color || "#900"} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Iconify icon="mdi:account" size={size || 24} color={color || "#900"} />
        ),
      }}
    />
    {/* <Tab.Screen name="RecipesList" component={RecipesListScreen} /> */}
  </Tab.Navigator>
);

export default function AppContainer() {
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        {user ? (
          // If user is logged in, show the main app with bottom tabs
          <>
            <MainTabNavigator />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarButton: (props) => (
                  <LoginButton {...props} />
                ),
              }}
            />
          </>
        ) : (
          // If user is not logged in, show the authentication stack
          <MainStackNavigator />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}
