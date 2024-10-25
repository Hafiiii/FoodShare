import { useState, useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
// @react-navigation
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
// components
import Iconify from 'react-native-iconify';
// Screens
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPassword/ResetPasswordScreen';
import HomeScreen from '../screens/Home/DonatorHomeScreen';
import CategoriesScreen from '../screens/Categories/CategoriesScreen'; // Updated: Ensure correct path
import CategoriesScreenDetails from '../screens/CategoriesScreenDetails/CategoriesScreenDetails'; // Updated: Ensure correct path
import RecipesListScreen from '../screens/RecipesList/RecipesListScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
// import BookingPlannerScreen from '../screens/BookingPlanner/BookingPlannerScreen';

// ----------------------------------------------------------------------

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CategoriesStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Categories" component={CategoriesScreen} />
    <Stack.Screen name="CategoriesScreenDetail" component={CategoriesScreenDetails} />
  </Stack.Navigator>
);

const MainStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

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
    {/* Updated: Use the CategoriesStackNavigator to handle navigation between Categories and CategoryDetail */}
    <Tab.Screen
      name="Location"
      component={CategoriesStackNavigator}
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
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return () => unsubscribe();
  }, [initializing]);

  if (initializing) {
    return null;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        {user ? (
          <MainTabNavigator />
        ) : (
          <MainStackNavigator />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}