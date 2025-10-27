/**
 * Professional Admin Dashboard Theme System
 * Light/Dark mode support with React Native Paper integration
 */

import { useColorScheme } from 'react-native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';

// Theme Type Definition
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: 'light' | 'dark';
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  shadows: typeof shadows;
  // Paper theme integration
  paperColors?: any;
}

// React Native Paper Light Theme
export const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary[500],        // #135bec
    primaryContainer: colors.primary[100],
    secondary: colors.accent.gradient_end,
    secondaryContainer: colors.primary[100],
    tertiary: colors.accent.gradient_start,
    tertiaryContainer: colors.primary[100],
    success: colors.semantic.success,
    error: colors.semantic.error,
    warning: colors.semantic.warning,
    info: colors.semantic.info,
    background: colors.neutral[50],
    surface: '#FFFFFF',
    surfaceVariant: colors.neutral[100],
    outline: colors.neutral[300],
    outlineVariant: colors.neutral[200],
  },
};

// React Native Paper Dark Theme
export const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary[400],
    primaryContainer: colors.primary[700],
    secondary: colors.accent.gradient_end,
    secondaryContainer: colors.primary[700],
    tertiary: colors.accent.gradient_start,
    tertiaryContainer: colors.primary[700],
    success: colors.semantic.success,
    error: colors.semantic.error,
    warning: colors.semantic.warning,
    info: colors.semantic.info,
    background: colors.dark.bg,
    surface: colors.dark.surface,
    surfaceVariant: colors.dark.surfaceAlt,
    outline: colors.dark.border,
    outlineVariant: colors.neutral[700],
  },
};

// Light Theme
export const lightTheme: Theme = {
  mode: 'light',
  colors,
  typography,
  spacing,
  shadows,
  paperColors: paperLightTheme.colors,
};

// Dark Theme
export const darkTheme: Theme = {
  mode: 'dark',
  colors,
  typography,
  spacing,
  shadows,
  paperColors: paperDarkTheme.colors,
};

// Get theme based on system color scheme
// Note: This should be called from a React component context
export const useSystemTheme = (): 'light' | 'dark' => {
  const systemScheme = useColorScheme();
  return systemScheme === 'dark' ? 'dark' : 'light';
};

// Get theme object based on mode
export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

// Theme CSS-like API (for simpler component styling)
export const createThemedStyles = (isDark: boolean) => ({
  container: {
    backgroundColor: isDark ? colors.dark.bg : colors.neutral[50],
  },
  card: {
    backgroundColor: isDark ? colors.dark.surface : '#FFFFFF',
    borderColor: isDark ? colors.dark.border : colors.neutral[200],
  },
  text: {
    color: isDark ? colors.dark.text : colors.neutral[900],
  },
  textSecondary: {
    color: isDark ? colors.dark.textSecondary : colors.neutral[600],
  },
  border: {
    borderColor: isDark ? colors.dark.border : colors.neutral[200],
  },
  divider: {
    borderBottomColor: isDark ? colors.dark.border : colors.neutral[200],
  },
});

// Helper to get themed color
export const getThemedColor = (lightColor: string, darkColor: string, isDark: boolean): string => {
  return isDark ? darkColor : lightColor;
};

export default { lightTheme, darkTheme, getTheme, createThemedStyles };
