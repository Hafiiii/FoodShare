import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { auth } from '../../utils/firebase'; // Make sure this path is correct

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to handle user registration
    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User registered:", userCredential.user);
            // Navigate to another screen after registration
            navigation.navigate('Home');
        } catch (error) {
            console.error("Error registering:", error.message);
            setError(error.message);
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
});

export default RegisterScreen;
