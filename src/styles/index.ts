/**
 * Styles Index
 * Central export point for all design system tokens and utilities
 */

// Color System
export * from './colors';
export { colors, componentColors, semanticColors } from './colors';

// Typography System
export * from './typography';
export { typography, fontFamily, fontWeights, lineHeights, letterSpacings, textVariants } from './typography';

// Spacing System
export * from './spacing';
export { spacing, semanticSpacing, componentSpacing, patterns } from './spacing';

// Shadows System
export * from './shadows';
export { shadows, semanticShadows, pressableShadows } from './shadows';

// Theme System
export * from './theme';
export { lightTheme, darkTheme, getTheme, createThemedStyles, getThemedColor } from './theme';

// Motion System
export * from './motion';
export { motion, animationPresets } from './motion';

// Re-export types
export type { Theme, ThemeMode } from './theme';
