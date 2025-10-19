import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, spacing, shadows } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: React.ReactNode;
  status?: 'online' | 'offline' | 'warning' | 'neutral';
  style?: ViewStyle;
  testID?: string;
}

/**
 * MetricCard Component
 * 
 * Dashboard metric card displaying key performance indicators with:
 * - Large numeric value with optional unit
 * - Trend indicator (percentage change)
 * - Status indicator bar
 * - Optional icon
 * 
 * Status colors:
 * - online: Green (#10B981)
 * - offline: Gray (#6B7280)
 * - warning: Amber (#F59E0B)
 * - neutral: Gray (#E5E7EB)
 * 
 * @example
 * <MetricCard
 *   label="Total Users"
 *   value={1242}
 *   change={12}
 *   status="online"
 *   icon={<UsersIcon size={20} />}
 * />
 * 
 * @example
 * <MetricCard
 *   label="CPU Usage"
 *   value={67}
 *   unit="%"
 *   change={-5}
 *   status="neutral"
 * />
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  change,
  icon: Icon,
  status = 'neutral',
  style,
  testID,
}) => {
  const isPositive = change !== undefined && change > 0;
  const changeText = change !== undefined ? `${isPositive ? '↑' : '↓'} ${Math.abs(change)}%` : '';
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.metricCard,
        { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.cardBorder
        },
        shadows.subtle,
        style,
      ]}
      testID={testID}
    >
      {/* Status indicator bar */}
      <View style={[styles.statusBar, styles[`status_${status}`]]} />

      {/* Header with label and icon */}
      <View style={styles.metricHeader}>
        <Text style={[styles.metricLabel, { color: themeColors.textSecondary }]}>{label}</Text>
        {Icon && (
          <View style={[styles.iconContainer, { backgroundColor: themeColors.surfaceAlt }]}>
            {Icon}
          </View>
        )}
      </View>

      {/* Main metric value */}
      <View style={styles.metricValue}>
        <Text style={[styles.value, { color: themeColors.text }]}>{value}</Text>
        {unit && <Text style={[styles.unit, { color: themeColors.textSecondary }]}>{unit}</Text>}
      </View>

      {/* Change indicator */}
      {change !== undefined && (
        <Text
          style={[
            styles.change,
            isPositive ? styles.positive : styles.negative,
          ]}
        >
          {changeText} from last month
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  metricCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing[4],
    position: 'relative',
    overflow: 'hidden',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  status_online: {
    backgroundColor: colors.status.online,
  },
  status_offline: {
    backgroundColor: colors.status.offline,
  },
  status_warning: {
    backgroundColor: colors.status.warning,
  },
  status_neutral: {
    backgroundColor: colors.neutral[300],
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
    marginTop: spacing[1],
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
  },
  change: {
    fontSize: 12,
    fontWeight: '500',
  },
  positive: {
    color: colors.semantic.success,
  },
  negative: {
    color: colors.semantic.error,
  },
});
