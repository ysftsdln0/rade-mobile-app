import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import { colors, spacing } from '../../styles';

interface AlertBannerProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
  testID?: string;
}

/**
 * AlertBanner Component
 * 
 * Professional alert/notification banner for displaying messages.
 * 
 * Types:
 * - success: Green (#10B981)
 * - warning: Amber (#F59E0B)
 * - error: Red (#EF4444)
 * - info: Blue (#3B82F6)
 * 
 * Features:
 * - Optional icon
 * - Title and message
 * - Dismissible option
 * - Optional action button
 * - Professional styling
 * 
 * @example
 * <AlertBanner
 *   type="success"
 *   title="Success"
 *   message="Your changes have been saved"
 *   icon={<CheckIcon size={20} />}
 *   dismissible
 * />
 * 
 * @example
 * <AlertBanner
 *   type="error"
 *   title="Error"
 *   message="Failed to update settings"
 *   action={{
 *     label: 'Retry',
 *     onPress: () => handleRetry()
 *   }}
 * />
 */
export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  message,
  icon: Icon,
  dismissible = false,
  onDismiss,
  action,
  style,
  testID,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <View
      style={[
        styles.banner,
        styles[`banner_${type}`],
        style,
      ]}
      testID={testID}
    >
      {/* Icon and Content */}
      <View style={styles.contentWrapper}>
        {Icon && (
          <View style={styles.iconContainer}>
            {Icon}
          </View>
        )}
        
        <View style={styles.textContent}>
          <Text style={[styles.title, styles[`title_${type}`]]}>{title}</Text>
          {message && (
            <Text style={[styles.message, styles[`message_${type}`]]}>{message}</Text>
          )}
        </View>
      </View>

      {/* Right side: Action + Dismiss */}
      <View style={styles.actionContainer}>
        {action && (
          <Pressable
            onPress={action.onPress}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
          >
            <Text style={[styles.actionText, styles[`action_${type}`]]}>
              {action.label}
            </Text>
          </Pressable>
        )}
        
        {dismissible && (
          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => [
              styles.dismissButton,
              pressed && styles.dismissButtonPressed,
            ]}
            hitSlop={8}
          >
            <Text style={styles.dismissIcon}>✕</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: spacing[3],
  },
  banner_success: {
    backgroundColor: colors.semantic.success,
    opacity: 0.1,
    borderLeftColor: colors.semantic.success,
  },
  banner_warning: {
    backgroundColor: colors.semantic.warning,
    opacity: 0.1,
    borderLeftColor: colors.semantic.warning,
  },
  banner_error: {
    backgroundColor: colors.semantic.error,
    opacity: 0.1,
    borderLeftColor: colors.semantic.error,
  },
  banner_info: {
    backgroundColor: colors.semantic.info,
    opacity: 0.1,
    borderLeftColor: colors.semantic.info,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  textContent: {
    flex: 1,
    gap: spacing[1],
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  title_success: {
    color: colors.semantic.success,
  },
  title_warning: {
    color: colors.semantic.warning,
  },
  title_error: {
    color: colors.semantic.error,
  },
  title_info: {
    color: colors.semantic.info,
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
  },
  message_success: {
    color: colors.neutral[700],
  },
  message_warning: {
    color: colors.neutral[700],
  },
  message_error: {
    color: colors.neutral[700],
  },
  message_info: {
    color: colors.neutral[700],
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginLeft: spacing[3],
  },
  actionButton: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  action_success: {
    color: colors.semantic.success,
  },
  action_warning: {
    color: colors.semantic.warning,
  },
  action_error: {
    color: colors.semantic.error,
  },
  action_info: {
    color: colors.semantic.info,
  },
  dismissButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissButtonPressed: {
    opacity: 0.6,
  },
  dismissIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[600],
  },
});
