import { useState } from 'react';
import { View, Image } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
// auth
import { useAuth } from '../../context/AuthContext';
// components
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email format'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const navigation = useNavigation();
  const { handleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setError: setFieldError, formState: { errors } } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const handleLoginAttempt = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      handleLogin();

    } catch (err) {
      console.error("Error during login:", err);
      setError(err.message);
      setFieldError("afterSubmit", { message: "Incorrect email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, margin: 10 }}>
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Image
          source={require("../../../assets/icons/heart.png")}
          style={{ width: 90, height: 110, marginBottom: 15 }}
        />

        <Text style={{ fontSize: 24, fontWeight: 800, color: palette.primary.main, marginBottom: 10 }}>Welcome to FoodShare</Text>
        <Text style={{ fontSize: 16, color: '#757575', marginBottom: 20, textAlign: 'center' }}>
          Share food, reduce waste, and help those in need.
        </Text>
      </View>

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

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
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

      <Button
        labelStyle={{ color: palette.disabled.main, fontSize: 12 }}
        mode="text"
        onPress={() => navigation.navigate('ResetPassword')}
        style={{ alignSelf: 'flex-end' }}
      >
        Forgot Password?
      </Button>

      {error && <Text style={{ color: palette.error.main, marginBottom: 20 }}>{error}</Text>}

      <Button
        mode="contained"
        onPress={handleSubmit(handleLoginAttempt)}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        Login
      </Button>
    </View>
  );
}
