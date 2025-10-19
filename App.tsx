import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/store';
import { ReactQueryProvider } from './src/utils/ReactQueryProvider';
import { LanguageProvider } from './src/utils/LanguageContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <LanguageProvider>
          <ReactQueryProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </ReactQueryProvider>
        </LanguageProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
