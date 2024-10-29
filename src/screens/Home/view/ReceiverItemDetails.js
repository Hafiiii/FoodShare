import { View, Image, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
// @react-navigation
import { useRoute } from '@react-navigation/native';
// Firebase
import { doc, setDoc } from 'firebase/firestore';
import { firestore, auth } from '../../../utils/firebase';
// components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ----------------------------------------------------------------------

export default function ReceiverItemDetails() {
  const route = useRoute();
  const { item } = route.params;

  const reserveItem = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (uid) {
        const docRef = doc(firestore, 'reservedItems', `${item.id}-${uid}`);
        await setDoc(docRef, {
          itemId: item.id,
          itemName: item.itemName,
          userId: uid,
          reservedAt: new Date().toISOString(),
        });
        alert('Item reserved successfully!');
      } else {
        alert('You must be logged in to reserve an item.');
      }
    } catch (error) {
      console.error('Error reserving item: ', error);
      alert('Failed to reserve item. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {item.imageUrl ? (
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            source={{ uri: item.imageUrl }}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            source={require("../../../../assets/icons/heart.png")}
            resizeMode="cover"
          />
        )}

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            minHeight: 260,
            paddingVertical: 40,
            paddingHorizontal: 24,
            backgroundColor: '#fff',
            borderTopLeftRadius: 56,
            borderTopRightRadius: 56,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {item.itemName}
          </Text>
        </View>
      </ScrollView>

      <View style={{ padding: 16 }}>
        <Button
          mode="contained"
          onPress={reserveItem}
          style={{ marginTop: 20 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="check" size={18} color="white" style={{ marginRight: 5, fontWeight: 800 }} />
            <Text style={{ color: "white", fontWeight: 700, fontSize: 16 }}>Reserve Item</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
