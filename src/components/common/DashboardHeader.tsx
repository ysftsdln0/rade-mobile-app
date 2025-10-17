import React from 'react';
import { View, StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../styles';

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface DashboardHeaderAction {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: DashboardHeaderAction[];
  style?: ViewStyle;
  testID?: string;
}

/**
 * DashboardHeader Component
 * 
 * Professional page header for dashboard screens.
 * 
 * Features:
 * - Large page title
 * - Optional subtitle
 * - Breadcrumb navigation
 * - Action buttons
 * 
 * @example
 * <DashboardHeader
 *   title="Dashboard"
 *   subtitle="Welcome back, Admin"
 * />
 * 
 * @example
 * <DashboardHeader
 *   title="Servers"
 *   breadcrumbs={[
 *     { label: 'Home', onPress: () => navigate('Home') },
 *     { label: 'Infrastructure' },
 *     { label: 'Servers' }
 *   ]}
 *   actions={[
 *     { 
 *       label: 'Add Server', 
 *       icon: <PlusIcon size={20} />,
 *       onPress: () => navigate('AddServer') 
 *     }
 *   ]}
 * />
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  style,
  testID,
}) => {
  return (
    <View
      style={[styles.container, style]}
      testID={testID}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <View style={styles.breadcrumbContainer}>
          {breadcrumbs.map((crumb, index) => (
            <View key={index} style={styles.breadcrumbItem}>
              {crumb.onPress ? (
                <Pressable onPress={crumb.onPress}>
                  <Text style={styles.breadcrumbLinkText}>{crumb.label}</Text>
                </Pressable>
              ) : (
                <Text style={styles.breadcrumbCurrentText}>{crumb.label}</Text>
              )}
              {index < breadcrumbs.length - 1 && (
                <Text style={styles.breadcrumbSeparator}>/</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Header with title and actions */}
      <View style={styles.headerWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* Action buttons */}
        {actions && actions.length > 0 && (
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <Pressable
                key={index}
                onPress={action.onPress}
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed,
                ]}
              >
                {action.icon && (
                  <View style={styles.actionIcon}>
                    {action.icon}
                  </View>
                )}
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.neutral[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  breadcrumbLinkText: {
    fontSize: 12,
    color: colors.primary[500],
    fontWeight: '500',
  },
  breadcrumbCurrentText: {
    fontSize: 12,
    color: colors.neutral[600],
    fontWeight: '500',
  },
  breadcrumbSeparator: {
    fontSize: 12,
    color: colors.neutral[400],
    marginHorizontal: spacing[1],
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[4],
  },
  titleSection: {
    flex: 1,
    gap: spacing[1],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.neutral[900],
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral[600],
    fontWeight: '400',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.accent.main,
    borderRadius: 8,
  },
  actionButtonPressed: {
    opacity: 0.9,
  },
  actionIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[50],
  },
});
