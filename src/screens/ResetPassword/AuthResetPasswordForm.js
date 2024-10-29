import { useState } from 'react';
import { View, Image } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { auth } from '../../utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// components
import Toast from 'react-native-toast-message';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Invalid email format'),
});

// ----------------------------------------------------------------------

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, setError: setFieldError, formState: { errors } } = useForm({
        resolver: yupResolver(ResetPasswordSchema),
    });

    const handlePasswordReset = async (data) => {
        setLoading(true);
        setError(null);

        try {
            await sendPasswordResetEmail(auth, data.email);

            Toast.show({
                type: 'success',
                text1: 'Password Reset Email Sent',
                text2: `Please check your email to reset your password.`,
            });

            navigation.navigate('Login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 10 }}>
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <Image
                    source={require("../../../assets/icons/forget.png")}
                    style={{ width: 145, height: 125, marginBottom: 15 }}
                />
                <Text style={{ fontSize: 24, fontWeight: 800, color: palette.primary.main }}>Forgot Your Password?</Text>
            </View>

            <Card style={{ padding: 15 }}>
                <Card.Content>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Email"
                                value={value}
                                onChangeText={onChange}
                                keyboardType="email-address"
                                error={!!errors.email}
                            />
                        )}
                    />
                    {errors.email && <Text style={{ color: palette.error.main }}>{errors.email.message}</Text>}

                    <Button
                        mode="contained"
                        onPress={handleSubmit(handlePasswordReset)}
                        loading={loading}
                        disabled={loading}
                        style={{ marginVertical: 20 }}
                    >
                        Send Reset Email
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}