import AppNavigation from './src/navigations/AppNavigation';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
// context
import { AuthProvider } from './src/context/AuthContext';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './src/theme';



const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
  },
};

// ----------------------------------------------------------------------

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigation />
          <Toast />
        </ThemeProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
