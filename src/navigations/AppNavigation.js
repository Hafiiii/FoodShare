import { useState, useEffect } from 'react';
// @react-navigation
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// context
import { useAuth } from '../context/AuthContext';
// firebase
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
// Screens
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPassword/ResetPasswordScreen';
import DonatorHomeScreen from '../screens/Home/DonatorHomeScreen';
import ReceiverHomeScreen from '../screens/Home/ReceiverHomeScreen';
import RiderHomeScreen from '../screens/Home/RiderHomeScreen';
import AddNewItemScreen from '../screens/AddItem/AddNewItemScreen';
import DonatorHSDetail from '../screens/HomeDetail/DonatorHSDetail';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import FeedbackScreen from '../screens/Feedback/FeedbackScreen';
import BookingDetailScreen from '../screens/Volunteer/BookingDetailScreen';
import ReceiverItemDetails from '../screens/Home/view/ReceiverItemDetails';

// ----------------------------------------------------------------------

const Stack = createStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

const DonatorStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DonatorHome" component={DonatorHomeScreen} />
    <Stack.Screen name="AddNewItem" component={AddNewItemScreen} />
    <Stack.Screen name="DonatorHSDetail" component={DonatorHSDetail} />
    <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    <Stack.Screen name="FeedbackHome" component={FeedbackScreen} />
  </Stack.Navigator>
);

const RiderStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RiderHome" component={RiderHomeScreen} />
    <Stack.Screen name="BookingDetailScreen" component={BookingDetailScreen} />
    <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    <Stack.Screen name="FeedbackHome" component={FeedbackScreen} />
  </Stack.Navigator>
);

const ReceiverStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ReceiverHome" component={ReceiverHomeScreen} />
    <Stack.Screen name="ReceiverItemDetails" component={ReceiverItemDetails} />
    <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    <Stack.Screen name="FeedbackHome" component={FeedbackScreen} />
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
          <>
            {userRole === 'Donator' && <Stack.Screen name="DonatorStack" component={DonatorStackNavigator} />}
            {userRole === 'Receiver' && <Stack.Screen name="ReceiverStack" component={ReceiverStackNavigator} />}
            {userRole === 'Rider' && <Stack.Screen name="RiderStack" component={RiderStackNavigator} />}
          </>
        ) : (
          <Stack.Screen name="MainStackNavigator" component={MainStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
