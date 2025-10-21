import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../utils/ThemeContext';

export const ThemedStatusBar = () => {
  const { isDark } = useTheme();
  
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
};
