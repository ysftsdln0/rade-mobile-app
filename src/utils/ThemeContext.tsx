/**
 * ThemeContext - Dark/Light Mode Management
 * Manages theme state and provides theme utilities to the app
 */

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceAlt: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Border colors
  border: string;
  borderLight: string;
  
  // Component colors
  card: string;
  cardBorder: string;
  input: string;
  inputBorder: string;
  
  // Status colors (same in both modes)
  primary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = '@rade_app_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getLightColors = (): ThemeColors => ({
  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceAlt: colors.neutral[50],
  
  // Text
  text: colors.neutral[900],
  textSecondary: colors.neutral[600],
  textTertiary: colors.neutral[500],
  
  // Borders
  border: colors.neutral[200],
  borderLight: colors.neutral[100],
  
  // Components
  card: '#FFFFFF',
  cardBorder: colors.neutral[200],
  input: '#FFFFFF',
  inputBorder: colors.neutral[200],
  
  // Status (same in both)
  primary: colors.primary[500],
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  error: colors.semantic.error,
  info: colors.semantic.info,
});

const getDarkColors = (): ThemeColors => ({
  // Backgrounds
  background: colors.dark.bg,        // #0F1419
  surface: colors.dark.surface,      // #1A1F26
  surfaceAlt: colors.dark.surfaceAlt, // #252D38
  
  // Text
  text: colors.dark.text,            // #E5E7EB
  textSecondary: colors.dark.textSecondary, // #9CA3AF
  textTertiary: colors.neutral[400],
  
  // Borders
  border: colors.dark.border,        // #334155
  borderLight: colors.neutral[700],
  
  // Components
  card: colors.dark.surface,
  cardBorder: colors.dark.border,
  input: colors.dark.surfaceAlt,
  inputBorder: colors.dark.border,
  
  // Status (same as light but slightly adjusted)
  primary: colors.primary[400],
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  error: colors.semantic.error,
  info: colors.semantic.info,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system'); // Default to system mode
  
  // Load theme preference from storage
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  const loadThemePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
        setMode(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };
  
  const setThemeMode = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
      setMode(newMode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  // Determine if dark mode is active
  const isDark = mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');
  
  // Get appropriate colors
  const themeColors = isDark ? getDarkColors() : getLightColors();
  
  const value: ThemeContextType = {
    mode,
    isDark,
    colors: themeColors,
    setThemeMode,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
