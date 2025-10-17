/**
 * Professional Admin Dashboard Spacing System
 * 4px-based grid for consistent, scalable spacing
 * Enables harmony across all components and screens
 */

// Base Spacing Unit: 4px
// All spacing values are multiples of 4 for consistency
const BASE_UNIT = 4;

export const spacing = {
  // 0 - No spacing
  0: 0,

  // 1 - 4px (xs) - Tight internal spacing
  1: 1 * BASE_UNIT,    // 4px

  // 2 - 8px (sm) - Small spacing between elements
  2: 2 * BASE_UNIT,    // 8px

  // 3 - 12px (sm-md) - Small-medium spacing
  3: 3 * BASE_UNIT,    // 12px

  // 4 - 16px (md) - Base unit, most common
  4: 4 * BASE_UNIT,    // 16px

  // 5 - 20px (md-lg) - Medium spacing
  5: 5 * BASE_UNIT,    // 20px

  // 6 - 24px (lg) - Large spacing, common for sections
  6: 6 * BASE_UNIT,    // 24px

  // 8 - 32px (xl) - Extra large, section spacing
  8: 8 * BASE_UNIT,    // 32px

  // 10 - 40px (2xl) - Large section gaps
  10: 10 * BASE_UNIT,  // 40px

  // 12 - 48px (3xl) - Extra large, page margins
  12: 12 * BASE_UNIT,  // 48px

  // 16 - 64px (4xl) - Massive spacing, full page margins
  16: 16 * BASE_UNIT,  // 64px
};

// Semantic Spacing Aliases (for readability in components)
export const semanticSpacing = {
  // Padding
  padding: {
    xs: spacing[1],        // 4px
    sm: spacing[2],        // 8px
    md: spacing[4],        // 16px (default)
    lg: spacing[6],        // 24px
    xl: spacing[8],        // 32px
  },

  // Margin
  margin: {
    xs: spacing[1],        // 4px
    sm: spacing[2],        // 8px
    md: spacing[4],        // 16px
    lg: spacing[6],        // 24px
    xl: spacing[8],        // 32px
  },

  // Gap (for flexbox/grid)
  gap: {
    xs: spacing[1],        // 4px
    sm: spacing[2],        // 8px
    md: spacing[3],        // 12px (between items)
    lg: spacing[6],        // 24px (between sections)
  },

  // Border Radius related spacing
  radius: {
    xs: spacing[1],        // 4px
    sm: spacing[2],        // 8px
    md: spacing[3],        // 12px (default)
    lg: spacing[6],        // 24px
  },
};

// Component-Specific Spacing
export const componentSpacing = {
  // Card Component
  card: {
    padding: spacing[4],         // 16px
    gap: spacing[3],             // 12px (content spacing)
    margin: spacing[2],          // 8px (between cards)
  },

  // Button Component
  button: {
    padding: {
      sm: {
        horizontal: spacing[3],  // 12px
        vertical: spacing[2],    // 8px
      },
      md: {
        horizontal: spacing[4],  // 16px
        vertical: spacing[3],    // 12px
      },
      lg: {
        horizontal: spacing[5],  // 20px
        vertical: spacing[4],    // 16px
      },
    },
    iconSpacing: spacing[2],      // 8px between icon and text
  },

  // Input Component
  input: {
    padding: {
      horizontal: spacing[3],    // 12px
      vertical: spacing[3],      // 12px (11 for visual centering)
    },
    labelSpacing: spacing[2],     // 8px between label and input
    errorSpacing: spacing[1],     // 4px between input and error
  },

  // List/Row Component
  row: {
    padding: {
      horizontal: spacing[4],    // 16px
      vertical: spacing[3],      // 12px
    },
    margin: spacing[1],          // 4px between rows
  },

  // Header Component
  header: {
    padding: {
      horizontal: spacing[4],    // 16px
      vertical: spacing[3],      // 12px
    },
  },

  // Modal/Bottomsheet
  modal: {
    padding: spacing[6],         // 24px
    contentSpacing: spacing[4],  // 16px (between elements)
  },

  // Alert/Banner
  alert: {
    padding: spacing[3],         // 12px
    iconSpacing: spacing[2],     // 8px
  },

  // Page/Screen
  page: {
    horizontalPadding: spacing[6],     // 24px
    verticalPadding: spacing[8],       // 32px
    sectionSpacing: spacing[6],        // 24px
  },
};

// Responsive Spacing (for tablets/larger screens)
export const responsiveSpacing = {
  pageHorizontalPadding: {
    mobile: spacing[4],     // 16px
    tablet: spacing[6],     // 24px
    desktop: spacing[8],    // 32px
  },
  sectionGap: {
    mobile: spacing[4],     // 16px
    tablet: spacing[6],     // 24px
    desktop: spacing[8],    // 32px
  },
};

// Spacing for Common Patterns
export const patterns = {
  // Form field spacing
  formField: {
    marginBottom: spacing[4],   // 16px
  },

  // Form row spacing (side by side fields)
  formRow: {
    gap: spacing[4],            // 16px
  },

  // List item spacing
  listItem: {
    marginBottom: spacing[3],   // 12px (or borderBottom)
  },

  // Section spacing
  sectionContainer: {
    marginTop: spacing[6],      // 24px
    marginBottom: spacing[6],   // 24px
    paddingHorizontal: spacing[4], // 16px
  },

  // Modal spacing
  modalContent: {
    padding: spacing[6],        // 24px
  },

  // Badge/Chip spacing
  badge: {
    paddingHorizontal: spacing[2], // 8px
    paddingVertical: spacing[1],   // 4px
  },
};

// Helper function: Get spacing value
export const getSpacing = (multiplier: number): number => {
  return multiplier * BASE_UNIT;
};

// Helper function: Get padding object
export const getPadding = (top = 0, right = 0, bottom = 0, left = 0) => ({
  paddingTop: spacing[top as keyof typeof spacing] || 0,
  paddingRight: spacing[right as keyof typeof spacing] || 0,
  paddingBottom: spacing[bottom as keyof typeof spacing] || 0,
  paddingLeft: spacing[left as keyof typeof spacing] || 0,
});

// Helper function: Get margin object
export const getMargin = (top = 0, right = 0, bottom = 0, left = 0) => ({
  marginTop: spacing[top as keyof typeof spacing] || 0,
  marginRight: spacing[right as keyof typeof spacing] || 0,
  marginBottom: spacing[bottom as keyof typeof spacing] || 0,
  marginLeft: spacing[left as keyof typeof spacing] || 0,
});

// Export all as default
export default spacing;
