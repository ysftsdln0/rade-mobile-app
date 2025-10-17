/**
 * Professional Admin Dashboard Typography System
 * Clear hierarchy for data-heavy admin interfaces
 * Font: Inter (modern tech companies, professional, clean)
 */

import { TextStyle } from 'react-native';
import { colors } from './colors';

// Typography Scale
export const typography = {
  // ========== Page/Screen Titles ==========
  // Large, command attention, section openers
  pageTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 1.2,
    letterSpacing: -0.5,
    color: colors.neutral[900],
  } as TextStyle,

  // ========== Section Headers ==========
  // Subsection titles, card headers
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 1.4,
    letterSpacing: -0.2,
    color: colors.neutral[900],
  } as TextStyle,

  // ========== Card Titles ==========
  // Card-level titles, component headers
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 1.4,
    letterSpacing: -0.1,
    color: colors.neutral[800],
  } as TextStyle,

  // ========== Body Text ==========
  // Main content, descriptions, paragraphs
  body: {
    lg: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.6,
      letterSpacing: 0,
      color: colors.neutral[700],
    } as TextStyle,

    md: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
      color: colors.neutral[600],
    } as TextStyle,

    sm: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 1.5,
      letterSpacing: 0.2,
      color: colors.neutral[600],
    } as TextStyle,
  },

  // ========== Data/Values ==========
  // Numbers, metrics, important data points
  // Used for dashboard metrics, amounts, status numbers
  data: {
    lg: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
      color: colors.neutral[900],
    } as TextStyle,

    md: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 1.2,
      letterSpacing: -0.3,
      color: colors.neutral[800],
    } as TextStyle,

    sm: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.4,
      letterSpacing: -0.1,
      color: colors.neutral[700],
    } as TextStyle,
  },

  // ========== Labels ==========
  // Form labels, metadata labels, uppercase labels
  // Professional, structured appearance
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 1.4,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    color: colors.neutral[600],
  } as TextStyle,

  // ========== Caption ==========
  // Small info, timestamps, helper text, hints
  // Muted appearance for secondary information
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 1.3,
    letterSpacing: 0.3,
    color: colors.neutral[500],
  } as TextStyle,

  // ========== Button Text ==========
  // Buttons with different sizes
  button: {
    lg: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    } as TextStyle,

    md: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    } as TextStyle,

    sm: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 1.5,
      letterSpacing: 0.2,
    } as TextStyle,
  },

  // ========== Badge/Chip ==========
  // Status badges, tags, pills
  badge: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 1.4,
    letterSpacing: 0.2,
    color: colors.neutral[700],
  } as TextStyle,

  // ========== Input Placeholder ==========
  // Placeholder text in inputs
  placeholder: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 1.5,
    color: colors.neutral[400],
  } as TextStyle,

  // ========== Error Message ==========
  // Error text, validation messages
  error: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 1.4,
    color: colors.semantic.error,
  } as TextStyle,

  // ========== Helper Text ==========
  // Form field helper text, hints
  helper: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 1.4,
    color: colors.neutral[500],
  } as TextStyle,
};

// Font Family Configuration
export const fontFamily = {
  // Primary font: Inter
  // Modern, clean, professional
  default: 'Inter',

  // Monospace for code/technical data (optional)
  monospace: 'Menlo', // iOS fallback: Courier New

  // Weights mapping to actual font names if needed
  // For iOS: you'd typically use platform system fonts
  // For Android: use font family with weights
  regular: 'Inter',
  medium: 'Inter',
  semibold: 'Inter',
  bold: 'Inter',
};

// Font Weight Mapping
export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

// Line Height Multipliers (used in some design systems)
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.6,
  loose: 1.8,
} as const;

// Letter Spacing Values
export const letterSpacings = {
  tighter: -0.5,
  tight: -0.2,
  normal: 0,
  wide: 0.2,
  wider: 0.5,
  widest: 1,
} as const;

// Predefined Text Style Combinations
export const textVariants = {
  // Headings
  h1: typography.pageTitle,
  h2: typography.sectionTitle,
  h3: typography.cardTitle,

  // Body
  bodyLarge: typography.body.lg,
  bodyMedium: typography.body.md,
  bodySmall: typography.body.sm,

  // Data
  dataLarge: typography.data.lg,
  dataMedium: typography.data.md,
  dataSmall: typography.data.sm,

  // UI
  label: typography.label,
  caption: typography.caption,
  button: typography.button.md,
  badge: typography.badge,

  // Form
  placeholder: typography.placeholder,
  error: typography.error,
  helper: typography.helper,
};

// Responsive Typography (if needed for larger screens)
export const responsiveTypography = {
  pageTitle: {
    mobile: typography.pageTitle,
    tablet: {
      ...typography.pageTitle,
      fontSize: 32,
    },
    desktop: {
      ...typography.pageTitle,
      fontSize: 36,
    },
  },
  sectionTitle: {
    mobile: typography.sectionTitle,
    tablet: {
      ...typography.sectionTitle,
      fontSize: 22,
    },
    desktop: {
      ...typography.sectionTitle,
      fontSize: 24,
    },
  },
};

export default typography;
