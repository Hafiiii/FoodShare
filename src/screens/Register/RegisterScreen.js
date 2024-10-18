import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { createUserWithEmailAndPassword } from "firebase/auth";  // Firebase import
import { auth } from '../../utils/firebase';  // Your Firebase setup
import Toast from 'react-native-toast-message';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to handle user registration
    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Firebase user registration
            await createUserWithEmailAndPassword(auth, email, password);

            // Show success notification
            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'You have successfully registered 🎉',
            });
            // Redirect to the login page after successful registration
            navigation.navigate('Login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Register" />
                <Card.Content>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType="email-address"
                        style={styles.input}
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                        style={styles.input}
                    />
                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={text => setConfirmPassword(text)}
                        secureTextEntry
                        style={styles.input}
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <Button
                        mode="contained"
                        onPress={handleRegister}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                    >
                        Register
                    </Button>
                </Card.Content>
            </Card>
            <View style={styles.footer}>
                <Text>Already have an account? </Text>
                <Button onPress={() => navigation.navigate('Login')}>Login</Button>
            </View>
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
    errorText: {
        color: 'red',
        marginBottom: 20,
    },
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RegisterScreen;
