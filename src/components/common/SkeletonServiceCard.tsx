import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonCard, SkeletonText } from './SkeletonCard';
import { colors, spacing, semanticSpacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';

interface SkeletonServiceCardProps {
  style?: any;
}

/**
 * Skeleton loading state for ServiceCard component
 * Used in hosting/domain/server lists
 */
export const SkeletonServiceCard: React.FC<SkeletonServiceCardProps> = ({ style }) => {
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SkeletonText width={120} height={18} style={styles.title} />
          <SkeletonText width={80} height={14} style={styles.subtitle} />
        </View>
        <SkeletonText width={60} height={24} />
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          {
            backgroundColor: isDark ? colors.dark.border : colors.neutral[200],
          },
        ]}
      />

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        {/* Row 1 */}
        <View style={styles.detailRow}>
          <SkeletonText width={60} height={12} />
          <SkeletonText width={80} height={14} />
        </View>

        {/* Row 2 */}
        <View style={styles.detailRow}>
          <SkeletonText width={60} height={12} />
          <SkeletonText width={80} height={14} />
        </View>

        {/* Row 3 */}
        <View style={styles.detailRow}>
          <SkeletonText width={60} height={12} />
          <SkeletonText width={80} height={14} />
        </View>

        {/* Row 4 */}
        <View style={styles.detailRow}>
          <SkeletonText width={60} height={12} />
          <SkeletonText width={80} height={14} />
        </View>
      </View>

      {/* Action Button */}
      <SkeletonCard width="100%" height={44} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: semanticSpacing.padding.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: semanticSpacing.margin.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: semanticSpacing.margin.md,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    marginBottom: semanticSpacing.margin.xs,
  },
  subtitle: {
    // No additional margin
  },
  divider: {
    height: 1,
    marginVertical: semanticSpacing.margin.md,
  },
  detailsGrid: {
    marginBottom: semanticSpacing.margin.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: semanticSpacing.margin.sm,
  },
  button: {
    marginTop: semanticSpacing.margin.sm,
  },
});
