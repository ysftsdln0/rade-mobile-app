/**
 * Haptic Feedback Utilities
 * Centralized haptic feedback management for consistent tactile feedback
 */

import * as Haptics from 'expo-haptics';

/**
 * Light impact feedback
 * Use for: Button taps, toggle switches, minor interactions
 */
export const lightImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Medium impact feedback
 * Use for: Card selections, filter changes, medium interactions
 */
export const mediumImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Heavy impact feedback
 * Use for: Confirmations, destructive actions, important interactions
 */
export const heavyImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Selection feedback
 * Use for: Scrolling through pickers, changing slider values, incremental changes
 */
export const selectionFeedback = () => {
  Haptics.selectionAsync();
};

/**
 * Success notification feedback
 * Use for: Successful actions, completions, positive outcomes
 */
export const successFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Warning notification feedback
 * Use for: Warnings, cautions, attention-needed actions
 */
export const warningFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

/**
 * Error notification feedback
 * Use for: Errors, failed actions, negative outcomes
 */
export const errorFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

// Convenience object for easier imports
export const haptics = {
  light: lightImpact,
  medium: mediumImpact,
  heavy: heavyImpact,
  selection: selectionFeedback,
  success: successFeedback,
  warning: warningFeedback,
  error: errorFeedback,
};

export default haptics;
