import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useTheme } from '../../utils/ThemeContext';
import { useLanguage } from '../../utils/LanguageContext';
import {
  SkeletonMetricCard,
  SkeletonServiceCard,
  SkeletonActivityItem,
  SkeletonText,
} from '../../components/common';
import { colors, spacing, semanticSpacing } from '../../styles';

/**
 * Skeleton loading screen for Dashboard
 * Matches the layout of DashboardScreen for smooth transition
 */
export const DashboardSkeleton: React.FC = () => {
  const { colors: themeColors, isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Skeleton */}
        <View style={styles.header}>
          <SkeletonText width="60%" height={28} style={styles.greetingText} />
          <SkeletonText width="40%" height={16} style={styles.overviewText} />
        </View>

        {/* Metrics Row Skeleton */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricBox, { backgroundColor: themeColors.card }]}>
            <View style={styles.metricIcon} />
            <SkeletonText width={60} height={32} style={styles.metricValue} />
            <SkeletonText width={80} height={14} style={styles.metricLabel} />
          </View>

          <View style={[styles.metricBox, { backgroundColor: themeColors.card }]}>
            <View style={styles.metricIcon} />
            <SkeletonText width={60} height={32} style={styles.metricValue} />
            <SkeletonText width={80} height={14} style={styles.metricLabel} />
          </View>

          <View style={[styles.metricBox, { backgroundColor: themeColors.card }]}>
            <View style={styles.metricIcon} />
            <SkeletonText width={60} height={32} style={styles.metricValue} />
            <SkeletonText width={80} height={14} style={styles.metricLabel} />
          </View>
        </View>

        {/* Services Section Skeleton */}
        <View style={styles.servicesSection}>
          <SkeletonText width={140} height={20} style={styles.sectionTitle} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <SkeletonMetricCard style={styles.horizontalMetricCard} />
            <SkeletonMetricCard style={styles.horizontalMetricCard} />
            <SkeletonMetricCard style={styles.horizontalMetricCard} />
          </ScrollView>
        </View>

        {/* Quick Actions Skeleton */}
        <View style={styles.quickActionsSection}>
          <SkeletonText width={120} height={20} style={styles.sectionTitle} />

          <View style={styles.quickActionsGrid}>
            <View style={[styles.quickActionCard, { backgroundColor: themeColors.card }]}>
              <View style={styles.quickActionIcon} />
              <SkeletonText width={80} height={14} style={styles.quickActionText} />
            </View>
            <View style={[styles.quickActionCard, { backgroundColor: themeColors.card }]}>
              <View style={styles.quickActionIcon} />
              <SkeletonText width={80} height={14} style={styles.quickActionText} />
            </View>
            <View style={[styles.quickActionCard, { backgroundColor: themeColors.card }]}>
              <View style={styles.quickActionIcon} />
              <SkeletonText width={80} height={14} style={styles.quickActionText} />
            </View>
            <View style={[styles.quickActionCard, { backgroundColor: themeColors.card }]}>
              <View style={styles.quickActionIcon} />
              <SkeletonText width={80} height={14} style={styles.quickActionText} />
            </View>
          </View>
        </View>

        {/* Recent Activity Skeleton */}
        <View style={styles.activitySection}>
          <SkeletonText width={140} height={20} style={styles.sectionTitle} />

          <View style={[styles.activityCard, { backgroundColor: themeColors.card }]}>
            <SkeletonActivityItem />
            <SkeletonActivityItem />
            <SkeletonActivityItem />
            <SkeletonActivityItem />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: semanticSpacing.padding.md,
    paddingBottom: semanticSpacing.padding.xl,
  },
  header: {
    marginTop: semanticSpacing.margin.md,
    marginBottom: semanticSpacing.margin.lg,
  },
  greetingText: {
    marginBottom: semanticSpacing.margin.xs,
  },
  overviewText: {
    // No additional margin
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: semanticSpacing.margin.lg,
  },
  metricBox: {
    flex: 1,
    marginHorizontal: spacing[1],
    padding: semanticSpacing.padding.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral[100],
    marginBottom: semanticSpacing.margin.sm,
  },
  metricValue: {
    marginBottom: spacing[1],
  },
  metricLabel: {
    // No additional margin
  },
  servicesSection: {
    marginBottom: semanticSpacing.margin.lg,
  },
  sectionTitle: {
    marginBottom: semanticSpacing.margin.md,
  },
  horizontalScroll: {
    paddingRight: semanticSpacing.padding.md,
  },
  horizontalMetricCard: {
    width: 160,
    marginRight: semanticSpacing.margin.md,
  },
  quickActionsSection: {
    marginBottom: semanticSpacing.margin.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    padding: semanticSpacing.padding.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: semanticSpacing.margin.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    marginBottom: semanticSpacing.margin.sm,
  },
  quickActionText: {
    // No additional margin
  },
  activitySection: {
    marginBottom: semanticSpacing.margin.lg,
  },
  activityCard: {
    padding: semanticSpacing.padding.md,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
