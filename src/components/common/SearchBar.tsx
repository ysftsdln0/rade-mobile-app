import React from "react";
import { View, TextInput, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "../../styles";
import { useTheme } from "../../utils/ThemeContext";

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
  placeholder = "Search...",
  value,
  onChangeText,
  onSubmit,
  containerStyle,
  testID,
}) => {
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.input,
          borderColor: themeColors.inputBorder,
        },
        containerStyle,
      ]}
      testID={testID}
    >
      <Ionicons
        name="search"
        size={20}
        color={themeColors.textTertiary}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: themeColors.text }]}
        placeholder={placeholder}
        placeholderTextColor={themeColors.textTertiary}
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
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    height: 48,
    borderWidth: 1,
  },
  icon: {
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
});
