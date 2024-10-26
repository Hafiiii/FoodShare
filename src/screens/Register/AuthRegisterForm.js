import { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput, RadioButton, IconButton } from 'react-native-paper';
// @react-navigation
import { useNavigation, Link } from '@react-navigation/native';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../utils/firebase';
import { firestore } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
// auth
import { useAuth } from '../../context/AuthContext';
// components
import Toast from 'react-native-toast-message';
import { useTheme } from '../../theme';

// ----------------------------------------------------------------------

const RegisterSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Invalid email format'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match').required('Confirm Password is required'),
    role: Yup.string().required('Role is required'),
});

// ----------------------------------------------------------------------

export default function AuthRegisterForm() {
    const { palette } = useTheme();
    const { handleRegister } = useAuth();
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(RegisterSchema),
    });

    const handleRegisterAttempt = async (data) => {
        const { email, password, role } = data;

        setLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(firestore, "users", user.uid), {
                UserEmailAddress: email,
                UserRole: role,
                CreatedAt: new Date(),
                Verified: false,
            });

            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
            });

            handleRegister();
            navigation.navigate('Login'); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 20, margin: 10 }}>
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: palette.primary.main,
                    textAlign: 'center',
                    marginBottom: 20,
                }}
            >
                Join Our FoodShare Community
            </Text>

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label="Email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="email-address"
                        error={!!errors.email}
                    />
                )}
            />
            {errors.email && <Text style={{ color: palette.error.main }}>{errors.email.message}</Text>}

            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <TextInput
                            label="Password"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={!showPassword}
                            style={{ flex: 1 }}
                            error={!!errors.password}
                        />
                        <IconButton
                            icon={showPassword ? 'eye-off' : 'eye'}
                            onPress={() => setShowPassword(!showPassword)}
                            size={24}
                            style={{ marginLeft: -45 }}
                        />
                    </View>
                )}
            />
            {errors.password && <Text style={{ color: palette.error.main }}>{errors.password.message}</Text>}

            <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <TextInput
                            label="Confirm Password"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={!showPassword}
                            style={{ flex: 1 }}
                            error={!!errors.confirmPassword}
                        />
                        <IconButton
                            icon={showPassword ? 'eye-off' : 'eye'}
                            onPress={() => setShowPassword(!showPassword)}
                            size={24}
                            style={{ marginLeft: -45 }}
                        />
                    </View>
                )}
            />
            {errors.confirmPassword && <Text style={{ color: palette.error.main }}>{errors.confirmPassword.message}</Text>}

            <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                    <RadioButton.Group onValueChange={onChange} value={value}>
                        <RadioButton.Item label="Donator" value="Donator" />
                        <RadioButton.Item label="Rider" value="Rider" />
                        <RadioButton.Item label="Receiver" value="Receiver" />
                    </RadioButton.Group>
                )}
            />
            {errors.role && <Text style={{ color: palette.error.main }}>{errors.role.message}</Text>}

            {error && <Text style={{ color: palette.error.main }}>{error}</Text>}

            <Button
                mode="contained"
                onPress={handleSubmit(handleRegisterAttempt)}
                loading={loading}
                disabled={loading}
                style={{ marginTop: 20 }}
            >
                Register
            </Button>
        </View>
    );
}