/**
 * Professional Admin Dashboard Shadow System
 * Elevation system for depth perception
 * Platform-specific (iOS shadowColor/shadowOpacity + Android elevation)
 */

import { ViewStyle } from 'react-native';

// Shadow/Elevation Levels
// Each level has iOS and Android variants
export const shadows = {
  // No shadow - flat
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  // Subtle - barely visible, for delicate separation
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,

  // Small - light shadow, for cards, inputs
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,

  // Medium - standard shadow, common for most components
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  // Large - prominent shadow, for important cards, modals
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,

  // Extra Large - heavy shadow, for modals, overlays
  extraLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,
};

// Semantic Shadow Aliases
export const semanticShadows = {
  // Component shadows
  card: shadows.small,
  button: shadows.subtle,
  input: shadows.subtle,
  badge: shadows.none,

  // Interactive shadows
  hover: shadows.medium,
  active: shadows.medium,
  pressed: shadows.small,

  // Overlay shadows
  modal: shadows.extraLarge,
  bottomsheet: shadows.large,
  popover: shadows.large,
  tooltip: shadows.medium,

  // Floating shadows
  floating: shadows.large,
  fab: shadows.large,
};

// Pressable shadow states (for interactive feedback)
export const pressableShadows = {
  default: shadows.small,
  pressed: shadows.subtle,
  disabled: shadows.none,
};

// Helper function to get shadow
export const getShadow = (level: 'subtle' | 'small' | 'medium' | 'large' | 'extraLarge' | 'none' = 'medium'): ViewStyle => {
  return shadows[level];
};

// Shadow combinations (for special effects)
export const shadowEffects = {
  // Depth layers for multiple shadows (not directly supported in React Native, but useful for reference)
  layered: {
    primary: shadows.medium,
    secondary: shadows.small,
  },

  // Inset shadow simulation (not directly supported, but useful for documentation)
  inset: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
};

// Export all as default
export default shadows;
