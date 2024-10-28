import { StyleSheet } from 'react-native';
import { RecipeCard } from '../../AppStyles';

const styles = StyleSheet.create({
  container: RecipeCard.container,
  photo: RecipeCard.photo,
  title: RecipeCard.title,
  category: RecipeCard.category,
  
  addCard: {
    alignItems: "center",
    margin: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "white",
  },

  addCardContainer: {
    alignItems: "center",
    paddingTop: 2, // Adjust spacing from top
  },

  addCardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

  addIcon: {
    marginTop: 1, // Additional margin to move the icon down within the container
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 50, // Adjust for spacing Donator Home needed
    color: "#4CAF50", // Matching primary theme color
  },
  
  container: {
    flex: 1,
    margin: 9,
    padding: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 5,
  },

  listContainer: {
    paddingBottom: 20, // Add some padding to the bottom of the FlatList
  },

  placeholderContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#f0f0f0', // Light grey for placeholder background
  },
  placeholderText: {
    color: '#999', // Light grey text color
    fontSize: 16,
  },
   title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default styles;
