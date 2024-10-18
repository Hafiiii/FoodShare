import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../utils/firebase';
import { firestore } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
// components
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [UserEmailAddress, setEmail] = useState('');
    const [UserPassword, setPassword] = useState('');
    const [UserConfirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (UserPassword !== UserConfirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, UserEmailAddress, UserPassword);
            const user = userCredential.user;

            await setDoc(doc(firestore, "users", user.uid), {
                UserEmailAddress: UserEmailAddress,
                CreatedAt: new Date(),
            });

            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'You have successfully registered 🎉',
            });

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
                        value={UserEmailAddress}
                        onChangeText={text => setEmail(text)}
                        keyboardType="email-address"
                        style={styles.input}
                    />
                    <TextInput
                        label="Password"
                        value={UserPassword}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                        style={styles.input}
                    />
                    <TextInput
                        label="Confirm Password"
                        value={UserConfirmPassword}
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
})