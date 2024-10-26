import AppNavigation from './src/navigations/AppNavigation';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './src/theme';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigation />
      <Toast />
    </ThemeProvider>
  );
}
