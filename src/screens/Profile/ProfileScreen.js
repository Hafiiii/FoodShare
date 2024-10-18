import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../../utils/firebase';  // Your Firebase setup
import { firestore } from '../../utils/firebase';  // Your Firestore setup
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [UserContactNo, setContactNo] = useState(''); // Initialize as an empty string
    const [UserEmailAddress, setEmail] = useState('');
    const [UserGender, setGender] = useState('');
    const [loading, setLoading] = useState(false);

    const user = auth.currentUser;

    // Function to save user profile
    const handleSaveProfile = async () => {
        if (!user) return;

        // Validation to ensure fields are not empty
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

            // Show success notification
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


    // Function to fetch user profile details
    const fetchUserProfile = async () => {
        if (!user) return;

        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setFirstName(data.FirstName || '');
            setLastName(data.LastName || '');
            setContactNo(data.UserContactNo || '');
            setEmail(data.UserEmailAddress || '');  // Ensure email is set
            setGender(data.UserGender || '');
        } else {
            console.log("No such document!");
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
                        editable={false} // Make this read-only since the user is already registered
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
                </Card.Content>
            </Card>
        </View>
    );
};

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
});

export default ProfileScreen;
