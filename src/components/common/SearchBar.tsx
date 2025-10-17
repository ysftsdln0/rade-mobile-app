import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}

/**
 * SearchBar Component
 * 
 * Professional search input with icon.
 * 
 * Features:
 * - Search icon (left-aligned)
 * - Clean, minimal design
 * - Rounded corners
 * - Light background
 * 
 * @example
 * <SearchBar 
 *   placeholder="Search servers..."
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 * />
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSubmit,
  containerStyle,
  testID,
}) => {
  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <Ionicons name="search" size={20} color={colors.neutral[400]} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[400]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    height: 48,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  icon: {
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.neutral[900],
  },
});
