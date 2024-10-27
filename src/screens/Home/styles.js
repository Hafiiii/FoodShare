import { StyleSheet } from 'react-native';
import { RecipeCard } from '../../AppStyles';

const styles = StyleSheet.create({
  container: RecipeCard.container,
  photo: RecipeCard.photo,
  title: RecipeCard.title,
  category: RecipeCard.category,
  
  addCard: {
    alignItems: "center",
    margin: 50,
    padding: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "white",
  },

  addCardContainer: {
    alignItems: "center",
    paddingTop: 20, // Adjust spacing from top
  },

  addCardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

  addIcon: {
    marginTop: 10, // Additional margin to move the icon down within the container
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 50, // Adjust for spacing as needed
    color: "#4CAF50", // Matching primary theme color
  },
  
});

export default styles;
