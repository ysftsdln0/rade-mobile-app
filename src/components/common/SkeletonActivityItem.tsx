import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonText, SkeletonCircle } from './SkeletonCard';
import { colors, spacing, semanticSpacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';

interface SkeletonActivityItemProps {
  style?: any;
}

/**
 * Skeleton loading state for Activity timeline items
 * Used in Dashboard recent activity section
 */
export const SkeletonActivityItem: React.FC<SkeletonActivityItemProps> = ({ style }) => {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Icon */}
      <SkeletonCircle size={36} style={styles.icon} />

      {/* Content */}
      <View style={styles.content}>
        <SkeletonText width="80%" height={16} style={styles.title} />
        <SkeletonText width="60%" height={12} style={styles.subtitle} />
      </View>

      {/* Time */}
      <SkeletonText width={50} height={12} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: semanticSpacing.padding.sm,
  },
  icon: {
    marginRight: semanticSpacing.margin.md,
  },
  content: {
    flex: 1,
    marginRight: semanticSpacing.margin.sm,
  },
  title: {
    marginBottom: semanticSpacing.margin.xs,
  },
  subtitle: {
    // No additional margin
  },
});
