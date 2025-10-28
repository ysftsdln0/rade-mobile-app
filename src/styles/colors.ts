/**
 * RADE Admin Dashboard Color Palette
 * Based on design system from Stitch design
 * Primary: #135bec (Professional blue), Gradients, and semantic colors
 */

export const colors = {
  // Primary: Professional Blue (#135bec)
  // Used for headers, important elements, professional feel
  primary: {
    50: "#F0F7FF",
    100: "#E0EFFF",
    200: "#BAD9FF",
    300: "#7EBFFF",
    400: "#3B9EFF",
    500: "#135bec", // Main - Professional blue
    600: "#0D47B8",
    700: "#0A389B",
    800: "#072B7D",
    900: "#051E60",
  },

  // Accent: Gradient colors (Blue to Purple)
  // Used for primary CTAs, highlights
  accent: {
    main: "#135bec", // Primary action color
    gradient_start: "#3B82F6", // Gradient blue
    gradient_end: "#8B5CF6", // Gradient purple
    light: "#BFDBFE", // Light backgrounds
    dark: "#1E40AF", // Darker hover states
  },

  // Semantic Colors (Data visualization & status)
  semantic: {
    success: "#10B981", // Active, online, positive actions
    warning: "#F59E0B", // Warnings, pending state
    error: "#EF4444", // Errors, offline, destructive
    info: "#3B82F6", // Information, neutral
    pending: "#F97316", // Processing, pending, in-progress
  },

  // Neutral Gray Scale (Professional backgrounds & text)
  // Full range from white to almost black for flexibility
  neutral: {
    50: "#F9FAFB", // Almost white, backgrounds
    100: "#F3F4F6", // Light backgrounds
    200: "#E5E7EB", // Borders, dividers
    300: "#D1D5DB", // Disabled state
    400: "#9CA3AF", // Secondary text, muted
    500: "#6B7280", // Body text secondary
    600: "#4B5563", // Emphasis text
    700: "#374151", // Dark text
    800: "#1F2937", // Very dark text
    900: "#111827", // Almost black text
  },

  // Status Indicators (Dashboard specific)
  // Quick status recognition colors
  status: {
    online: "#10B981", // Green - active/online
    offline: "#6B7280", // Gray - inactive/offline
    warning: "#F59E0B", // Amber - warning/needs attention
    error: "#EF4444", // Red - error/critical
  },

  // Dark Mode Support
  // Complete dark theme palette
  dark: {
    bg: "#0F1419", // Main background
    surface: "#1A1F26", // Card/surface background
    surfaceAlt: "#252D38", // Alternative surface
    border: "#334155", // Borders in dark mode
    text: "#E5E7EB", // Primary text in dark
    textSecondary: "#9CA3AF", // Secondary text in dark
  },
};

// Semantic Color Aliases (for readability in components)
export const semanticColors = {
  // Text Colors
  text: {
    primary: colors.neutral[900], // Main text
    secondary: colors.neutral[600], // Secondary/muted text
    tertiary: colors.neutral[500], // Tertiary/hint text
    inverse: colors.neutral[50], // Text on dark backgrounds
  },

  // Background Colors
  background: {
    primary: "#FFFFFF", // Primary background
    secondary: colors.neutral[50], // Secondary background
    tertiary: colors.neutral[100], // Tertiary background
    dark: colors.dark.bg, // Dark mode background
  },

  // Border Colors
  border: {
    default: colors.neutral[200], // Default borders
    light: colors.neutral[100], // Light borders
    dark: colors.neutral[300], // Dark borders
  },

  // State Colors
  state: {
    default: colors.neutral[200],
    hover: colors.neutral[100],
    active: colors.accent.main,
    disabled: colors.neutral[300],
    error: colors.semantic.error,
  },
};

// Component-Specific Color Schemes
export const componentColors = {
  // Card Component
  card: {
    background: "#FFFFFF",
    border: colors.neutral[200],
    shadow: "rgba(0, 0, 0, 0.05)",
  },

  // Button Component
  button: {
    primary: {
      bg: colors.accent.main,
      text: "#FFFFFF",
      active: colors.accent.dark,
      disabled: colors.neutral[300],
    },
    secondary: {
      bg: colors.neutral[100],
      text: colors.neutral[700],
      active: colors.neutral[200],
      disabled: colors.neutral[200],
    },
    danger: {
      bg: colors.semantic.error,
      text: "#FFFFFF",
      active: "#DC2626",
      disabled: colors.neutral[300],
    },
    ghost: {
      bg: "transparent",
      border: colors.neutral[200],
      text: colors.neutral[700],
      active: colors.neutral[100],
      disabled: colors.neutral[200],
    },
  },

  // Input Component
  input: {
    background: "#FFFFFF",
    border: colors.neutral[200],
    borderFocused: colors.primary[500],
    text: colors.neutral[900],
    placeholder: colors.neutral[400],
    error: colors.semantic.error,
  },

  // Alert/Banner Component
  alert: {
    success: {
      bg: "#ECFDF5",
      border: colors.semantic.success,
      text: colors.semantic.success,
    },
    warning: {
      bg: "#FFFBEB",
      border: colors.semantic.warning,
      text: colors.semantic.warning,
    },
    error: {
      bg: "#FEF2F2",
      border: colors.semantic.error,
      text: colors.semantic.error,
    },
    info: {
      bg: "#F0F9FF",
      border: colors.semantic.info,
      text: colors.semantic.info,
    },
  },

  // Badge/Status Component
  badge: {
    success: {
      bg: "#ECFDF5",
      text: colors.semantic.success,
    },
    warning: {
      bg: "#FFFBEB",
      text: colors.semantic.warning,
    },
    error: {
      bg: "#FEF2F2",
      text: colors.semantic.error,
    },
    info: {
      bg: "#F0F9FF",
      text: colors.semantic.info,
    },
  },

  // Header Component
  header: {
    background: colors.primary[800],
    text: "#FFFFFF",
    border: colors.primary[700],
  },

  // Divider/Border
  divider: colors.neutral[200],

  // Loading/Skeleton
  skeleton: colors.neutral[200],
};

// Helper function to get color with opacity
export const withOpacity = (color: string, _opacity: number): string => {
  // This is a simplified version - in real app, use proper color parsing
  // For now, return the color as-is (React Native handles hex colors)
  return color;
};

// Export all as default for convenience
export default colors;
