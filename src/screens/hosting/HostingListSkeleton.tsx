import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../../utils/ThemeContext';
import { SkeletonServiceCard, SkeletonText } from '../../components/common';
import { semanticSpacing } from '../../styles';

/**
 * Skeleton loading screen for Hosting List
 * Shows placeholder cards while hosting packages are loading
 */
export const HostingListSkeleton: React.FC = () => {
  const { colors: themeColors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Filter tabs skeleton */}
        <View style={styles.filterContainer}>
          <SkeletonText width={60} height={36} style={styles.filterTab} />
          <SkeletonText width={60} height={36} style={styles.filterTab} />
          <SkeletonText width={80} height={36} style={styles.filterTab} />
        </View>

        {/* Hosting cards skeleton */}
        <SkeletonServiceCard />
        <SkeletonServiceCard />
        <SkeletonServiceCard />
        <SkeletonServiceCard />
        <SkeletonServiceCard />
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
    paddingTop: semanticSpacing.padding.md,
    paddingBottom: semanticSpacing.padding.xl,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: semanticSpacing.margin.md,
  },
  filterTab: {
    marginRight: semanticSpacing.margin.sm,
    borderRadius: 8,
  },
});
