import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonCard, SkeletonText, SkeletonCircle } from './SkeletonCard';
import { colors, spacing, semanticSpacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';

interface SkeletonMetricCardProps {
  style?: any;
}

/**
 * Skeleton loading state for MetricCard component
 * Matches the layout of the actual MetricCard
 */
export const SkeletonMetricCard: React.FC<SkeletonMetricCardProps> = ({ style }) => {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.dark.surface : '#FFFFFF',
        },
        style,
      ]}
    >
      {/* Icon circle */}
      <SkeletonCircle size={40} style={styles.icon} />

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <SkeletonText width={80} height={14} style={styles.title} />

        {/* Value */}
        <SkeletonText width={60} height={24} style={styles.value} />
      </View>

      {/* Trend indicator */}
      <SkeletonText width={50} height={20} style={styles.trend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: semanticSpacing.padding.md,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: semanticSpacing.margin.md,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: semanticSpacing.margin.xs,
  },
  value: {
    // No additional margin
  },
  trend: {
    marginLeft: semanticSpacing.margin.sm,
  },
});
