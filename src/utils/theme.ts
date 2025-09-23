import { Theme } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants';

export const lightTheme: Theme = {
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.textPrimary,
    textSecondary: COLORS.textSecondary,
    border: COLORS.gray300,
    disabled: COLORS.textDisabled,
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  fontSize: FONT_SIZES,
};

export const darkTheme: Theme = {
  colors: {
    primary: '#64B5F6',
    secondary: '#FFB74D',
    success: '#81C784',
    warning: '#FFD54F',
    error: '#E57373',
    info: '#4DD0E1',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    disabled: '#666666',
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  fontSize: FONT_SIZES,
};