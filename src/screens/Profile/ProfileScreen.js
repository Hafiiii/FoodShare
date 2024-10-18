import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../utils/firebase';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [UserContactNo, setContactNo] = useState('');
    const [UserEmailAddress, setEmail] = useState('');
    const [UserGender, setGender] = useState('');
    const [loading, setLoading] = useState(false);

    const user = auth.currentUser;

    const handleSaveProfile = async () => {
        if (!user) return;

        if (!FirstName || !LastName || !UserContactNo || !UserEmailAddress || !UserGender) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'All fields must be filled out.',
            });
            return;
        }

        setLoading(true);
        try {
            await setDoc(doc(firestore, "users", user.uid), {
                FirstName: FirstName || '',
                LastName: LastName || '',
                UserContactNo: UserContactNo || '',
                UserEmailAddress: UserEmailAddress || '',
                UserGender: UserGender || ''
            });

            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your profile details have been saved successfully.',
            });
        } catch (error) {
            console.error("Error saving profile: ", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        if (!user) return;

        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setFirstName(data.FirstName || '');
            setLastName(data.LastName || '');
            setContactNo(data.UserContactNo || '');
            setEmail(data.UserEmailAddress || '');
            setGender(data.UserGender || '');
        } else {
            console.log("No such document!");
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();

            Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'You have been logged out successfully.',
            });
            navigation.navigate('Home');
        } catch (error) {
            console.error("Error logging out: ", error);

            Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: 'An error occurred while logging out.',
            });
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Profile" />
                <Card.Content>
                    <TextInput
                        label="First Name"
                        value={FirstName}
                        onChangeText={text => setFirstName(text)}
                        style={styles.input}
                    />
                    <TextInput
                        label="Last Name"
                        value={LastName}
                        onChangeText={text => setLastName(text)}
                        style={styles.input}
                    />
                    <TextInput
                        label="Contact Number"
                        value={UserContactNo}
                        onChangeText={text => setContactNo(text)}
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                    <TextInput
                        label="Email"
                        value={UserEmailAddress}
                        onChangeText={text => setEmail(text)}
                        keyboardType="email-address"
                        editable={false}
                        style={styles.input}
                    />
                    <TextInput
                        label="Gender"
                        value={UserGender}
                        onChangeText={text => setGender(text)}
                        style={styles.input}
                    />
                    <Button
                        mode="contained"
                        onPress={handleSaveProfile}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                    >
                        Save Profile
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        padding: 20,
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginVertical: 20,
    },
})