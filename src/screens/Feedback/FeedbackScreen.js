import { useState, useEffect } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// firebase
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../utils/firebase';
// components
import Toast from 'react-native-toast-message';
import StarRating from './StarRating';
import palette from '../../theme/palette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ----------------------------------------------------------------------

const FeedbackSchema = Yup.object().shape({
    name: Yup.string().when('isAnonymous', { is: false, then: Yup.string().required('Name is required'), }),
    email: Yup.string().when('isAnonymous', { is: false, then: Yup.string().required('Email is required').email('Invalid email format'), }),
    feedback: Yup.string().required('Feedback is required').min(10, 'Feedback must be at least 10 characters'),
    rating: Yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    userRole: Yup.string().required('User role is required'),
});

// ----------------------------------------------------------------------

export default function FeedbackForm() {
    const navigation = useNavigation();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [userProfile, setUserProfile] = useState({ firstName: '', lastName: '', email: '', userRole: '' });

    const { control, handleSubmit, setError: setFieldError, formState: { errors }, getValues, reset, setValue } = useForm({
        resolver: yupResolver(FeedbackSchema),
        defaultValues: {
            feedback: '',
            name: '',
            email: '',
            isAnonymous: false,
            userRole: '',
        },
    });

    const fetchUserProfile = async () => {
        const uid = auth.currentUser?.uid;

        if (uid) {
            try {
                const userDoc = doc(firestore, "users", uid);
                const userSnapshot = await getDoc(userDoc);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setUserProfile({
                        firstName: userData.FirstName || '',
                        lastName: userData.LastName || '',
                        email: userData.UserEmailAddress || '',
                        userRole: userData.UserRole || '',
                    });
                    setValue('email', userData.UserEmailAddress || '');
                    setValue('name', userData.FirstName || '');
                    setValue('userRole', userData.UserRole || '');
                }
            } catch (error) {
                console.error("Error fetching user profile: ", error);
            }
        }
    };

    const handleFeedbackSubmit = async () => {
        setLoading(true);
        const { feedback, name, email, userRole } = getValues();

        if (rating === 0) {
            setFieldError('rating', { type: 'manual', message: 'Rating is required' });
            setLoading(false);
            return;
        }

        const feedbackData = {
            feedback: feedback || '',
            name: isAnonymous ? 'Anonymous' : name || '',
            email: isAnonymous ? '' : email || '',
            userRole: userRole || '',
            rating,
            timestamp: new Date(),
        };

        try {
            await setDoc(doc(firestore, "feedback", new Date().getTime().toString()), feedbackData);

            Toast.show({
                type: 'success',
                text1: 'Feedback Submitted',
                text2: 'Thank you for your feedback!',
            });

            setRating(0);
            setIsAnonymous(false);
            reset();
        } catch (error) {
            console.error("Error saving feedback: ", error);
            Toast.show({
                type: 'error',
                text1: 'Submission Failed',
                text2: 'An error occurred while submitting your feedback.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <ScrollView style={{ padding: 30, marginTop: 60 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={palette.primary.main} style={{ marginRight: 5 }} />
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Image
                    source={require("../../../assets/icons/light.png")}
                    style={{ width: 75, height: 75, marginBottom: 15 }}
                />
                <Text style={{ fontSize: 22, fontWeight: 800, color: palette.primary.main, marginBottom: 5 }}>
                    We Value Your Feedback
                </Text>
                <Text style={{ fontSize: 16, color: '#757575', textAlign: 'center' }}>
                    Share your thoughts and help us improve.
                </Text>
            </View>

            <StarRating rating={rating} setRating={setRating} />
            {errors.rating && <Text style={{ color: palette.error.main }}>{errors.rating.message}</Text>}

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>Want to remain anonymous?</Text>
                <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
            </View>

            {!isAnonymous && (
                <>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Name"
                                value={userProfile.firstName || value}
                                onChangeText={onChange}
                                editable={!userProfile.firstName}
                                error={!!errors.name}
                            />
                        )}
                    />
                    {errors.name && <Text style={{ color: palette.error.main }}>{errors.name.message}</Text>}

                    <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Email"
                                value={value}
                                onChangeText={onChange}
                                keyboardType="email-address"
                                editable={!userProfile.email}
                                error={!!errors.email}
                            />
                        )}
                    />
                    {errors.email && <Text style={{ color: palette.error.main }}>{errors.email.message}</Text>}
                </>
            )}

            <Controller
                name="userRole"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        label="User Role"
                        value={userProfile.userRole || value}
                        onChangeText={onChange}
                        error={!!errors.userRole}
                    />
                )}
            />
            {errors.userRole && <Text style={{ color: palette.error.main }}>{errors.userRole.message}</Text>}

            <Controller
                name="feedback"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        label="Feedback"
                        value={value}
                        onChangeText={onChange}
                        multiline
                        numberOfLines={4}
                        style={{ height: 80 }}
                        error={!!errors.feedback}
                    />
                )}
            />
            {errors.feedback && <Text style={{ color: palette.error.main }}>{errors.feedback.message}</Text>}

            {error && <Text style={{ color: palette.error.main, marginBottom: 10 }}>{error}</Text>}

            <Button
                mode="contained"
                onPress={handleFeedbackSubmit}
                loading={loading}
                disabled={loading}
                style={{ marginVertical: 20 }}
            >
                Submit Feedback
            </Button>
        </ScrollView>
    );
}
