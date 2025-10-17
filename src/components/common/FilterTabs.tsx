import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { colors, spacing } from '../../styles';

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  containerStyle?: ViewStyle;
  testID?: string;
}

/**
 * FilterTabs Component
 * 
 * Horizontal scrollable tab filter for lists.
 * 
 * Features:
 * - Active/inactive states
 * - Optional count badges
 * - Smooth scrolling
 * - Clean pill design
 * 
 * @example
 * <FilterTabs
 *   tabs={[
 *     { id: 'all', label: 'All' },
 *     { id: 'running', label: 'Running', count: 3 },
 *     { id: 'stopped', label: 'Stopped', count: 1 },
 *   ]}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 * />
 */
export const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  containerStyle,
  testID,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, containerStyle]}
      testID={testID}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
              {tab.count !== undefined && ` (${tab.count})`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[700],
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
