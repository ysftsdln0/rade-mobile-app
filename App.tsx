import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/store';
import { ReactQueryProvider } from './src/utils/ReactQueryProvider';
import { LanguageProvider } from './src/utils/LanguageContext';
import { ThemeProvider } from './src/utils/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemedStatusBar } from './src/components/ThemedStatusBar';

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <LanguageProvider>
            <ReactQueryProvider>
              <ThemedStatusBar />
              <RootNavigator />
            </ReactQueryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
