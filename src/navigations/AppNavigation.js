import { useState, useEffect } from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
// @react-navigation
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// context
import { AuthProvider, useAuth } from '../context/AuthContext';
// firebase
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../utils/firebase';
// components
import Iconify from 'react-native-iconify';
// Screens
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPassword/ResetPasswordScreen';
import DonatorHomeScreen from '../screens/Home/DonatorHomeScreen';
import ReceiverHomeScreen from '../screens/Home/ReceiverHomeScreen';
import RiderHomeScreen from '../screens/Home/RiderHomeScreen';
import AddNewItemScreen from '../screens/AddItem/AddNewItemScreen';
import CategoriesScreen from '../screens/Categories/CategoriesScreen'; 
import CategoriesScreenDetails from '../screens/CategoriesScreenDetails/CategoriesScreenDetails'; 
import RecipesListScreen from '../screens/RecipesList/RecipesListScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import BookingDetailScreen from '../screens/Volunteer/BookingDetailScreen';
// ----------------------------------------------------------------------

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
  },
};

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

const MainTabNavigator = ({ component }) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Tab.Screen
      name="Home"
      component={component}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Iconify icon="mdi:home" size={size || 24} color={color || "#900"} />
        ),
      }}
    />
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
  </Tab.Navigator>
);

const DonatorStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DonatorHome" component={DonatorHomeScreen} />
    <Stack.Screen name="AddNewItem" component={AddNewItemScreen} />
  </Stack.Navigator>
);

const RiderStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="RiderHome" component={RiderHomeScreen} />
    <Stack.Screen name="BookingDetailScreen" component={BookingDetailScreen} />
  </Stack.Navigator>
);

export default function AppContainer() {
  const { user, initializing } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().UserRole);
        } else {
          console.log("No such document!");
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user && userRole ? (
          <Stack.Screen name="MainTabNavigator">
            {() => {
              if (userRole === 'Donator') {
                return <MainTabNavigator component={DonatorStackNavigator} />;
              } else if (userRole === 'Receiver') {
                return <MainTabNavigator component={ReceiverHomeScreen} />;
              } else if (userRole === 'Rider') {
                return <MainTabNavigator component={RiderStackNavigator} />;
              }
              return <ReceiverHomeScreen />;
            }}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="MainStackNavigator" component={MainStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
