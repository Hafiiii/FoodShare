import { useState, useEffect } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { Button, TextInput, Modal, Portal, IconButton, Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../utils/firebase';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// ----------------------------------------------------------------------

export default function ProfileForm() {
    const navigation = useNavigation();
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [UserContactNo, setContactNo] = useState('');
    const [UserEmailAddress, setEmail] = useState('');
    const [UserGender, setGender] = useState('');
    const [UserRole, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const genderOptions = ["Male", "Female", "Other"];

    const user = auth.currentUser;

    const renderGenderOption = ({ item }) => (
        <TouchableOpacity
            style={{ padding: 15 }}
            onPress={() => {
                setGender(item);
                setDropdownVisible(false);
            }}
        >
            <Text>{item}</Text>
        </TouchableOpacity>
    );

    const isValidPhoneNumber = (number) => phoneRegExp.test(number);

    const handleSaveProfile = async () => {
        if (!user) return;

        if (!FirstName || !LastName || !UserContactNo || !UserEmailAddress || !UserGender || !UserRole) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'All fields must be filled out.',
            });
            return;
        }

        if (!isValidPhoneNumber(UserContactNo)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Contact Number',
                text2: 'Please enter a valid contact number.',
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
                UserGender: UserGender || '',
                UserRole: UserRole || ''
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
            setRole(data.UserRole || '');
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
            navigation.navigate('Login');
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
        <View style={{ padding: 20 }}>
            <TextInput
                label="First Name"
                value={FirstName}
                onChangeText={text => setFirstName(text)}
                style={{ marginBottom: 20 }}
            />
            <TextInput
                label="Last Name"
                value={LastName}
                onChangeText={text => setLastName(text)}
                style={{ marginBottom: 20 }}
            />
            <TextInput
                label="Role"
                value={UserRole}
                onChangeText={text => setRole(text)}
                editable={false}
                style={{ marginBottom: 20 }}
            />
            <TextInput
                label="Email"
                value={UserEmailAddress}
                onChangeText={text => setEmail(text)}
                keyboardType="email-address"
                editable={false}
                style={{ marginBottom: 20 }}
            />
            <TextInput
                label="Contact Number"
                value={UserContactNo}
                onChangeText={text => setContactNo(text)}
                keyboardType="phone-pad"
                style={{ marginBottom: 20 }}
            />
            <TouchableOpacity
                style={{ marginBottom: 20 }}
                onPress={() => setDropdownVisible(true)}
            >
                <TextInput
                    label="Gender"
                    value={UserGender}
                    editable={false}
                />
                <IconButton
                    icon="chevron-down"
                    size={20}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 10,
                    }}
                />
            </TouchableOpacity>
            <Portal>
                <Modal
                    visible={dropdownVisible}
                    onDismiss={() => setDropdownVisible(false)}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 10,
                        marginHorizontal: 20,
                        borderRadius: 8,
                    }}
                >
                    <FlatList
                        data={genderOptions}
                        renderItem={renderGenderOption}
                        keyExtractor={(item) => item}
                    />
                </Modal>
            </Portal>

            <Button
                mode="contained"
                onPress={handleSaveProfile}
                loading={loading}
                disabled={loading}
                style={{ marginVertical: 20 }}
            >
                Save Profile
            </Button>
            <Button
                mode="outlined"
                onPress={handleLogout}
            >
                Logout
            </Button>
        </View>
    );
}