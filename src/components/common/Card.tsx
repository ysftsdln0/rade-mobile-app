import React, { ReactNode } from 'react';
import { View, StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import { colors, spacing, shadows } from '../../styles';

interface CardProps {
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'elevated';
  action?: {
    onPress: () => void;
    icon: ReactNode;
  };
  status?: 'online' | 'offline' | 'pending';
  style?: ViewStyle;
  testID?: string;
}

/**
 * Card Component
 * 
 * Professional dashboard card component for data grouping and display.
 * Supports title, content, action buttons, and status indicators.
 * 
 * Variants:
 * - default: Subtle shadow, standard elevation
 * - elevated: Stronger shadow, higher visual prominence
 * 
 * @example
 * <Card title="Users" variant="default">
 *   <Text>Card content here</Text>
 * </Card>
 * 
 * @example
 * <Card 
 *   title="Server Status" 
 *   status="online"
 *   action={{ 
 *     onPress: () => console.log('Action'), 
 *     icon: <Icon name="more" /> 
 *   }}
 * >
 *   <Text>Server is running</Text>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  title,
  children,
  variant = 'default',
  action,
  status,
  style,
  testID,
}) => {
  return (
    <View
      style={[
        styles.card,
        styles[variant],
        style,
      ]}
      testID={testID}
    >
      {(title || action || status) && (
        <View style={styles.cardHeader}>
          <View style={styles.headerContent}>
            {title && <Text style={styles.cardTitle}>{title}</Text>}
            {status && (
              <View style={[styles.badge, styles[`badge_${status}`]]} />
            )}
          </View>
          {action && (
            <Pressable
              onPress={action.onPress}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}
              hitSlop={8}
            >
              {action.icon}
            </Pressable>
          )}
        </View>
      )}
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
  },
  default: {
    ...shadows.subtle,
  },
  elevated: {
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  cardContent: {
    padding: spacing[4],
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badge_online: {
    backgroundColor: colors.status.online,
  },
  badge_offline: {
    backgroundColor: colors.status.offline,
  },
  badge_pending: {
    backgroundColor: colors.status.warning,
  },
  actionButton: {
    padding: spacing[1],
    borderRadius: 6,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
});
