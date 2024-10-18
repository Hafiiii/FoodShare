import React from 'react';
import AppContainer from './src/navigations/AppNavigation';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
      <AppContainer />
      <Toast />
    </>
  );
}
