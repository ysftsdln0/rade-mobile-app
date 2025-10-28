/**
 * Badge Component
 * Small visual indicators for status, counts, and labels
 */

import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../styles";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "primary";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: colors.neutral[100], text: colors.neutral[900] },
  success: {
    bg: `${colors.semantic.success}15`,
    text: colors.semantic.success,
  },
  warning: {
    bg: `${colors.semantic.warning}15`,
    text: colors.semantic.warning,
  },
  error: { bg: `${colors.semantic.error}15`, text: colors.semantic.error },
  info: { bg: `${colors.primary[100]}`, text: colors.primary[700] },
  primary: { bg: colors.primary[500], text: "#FFFFFF" },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  size = "md",
  style,
}) => {
  const variantStyle = variantColors[variant];
  const sizeStyles = sizeMap[size];

  return (
    <View
      style={[
        styles.badge,
        sizeStyles.container,
        { backgroundColor: variantStyle.bg },
        style,
      ]}
    >
      <Text style={[sizeStyles.text, { color: variantStyle.text }]}>
        {label}
      </Text>
    </View>
  );
};

const sizeMap = {
  sm: {
    container: { paddingHorizontal: 8, paddingVertical: 4 },
    text: { fontSize: 11, fontWeight: "600" as const },
  },
  md: {
    container: { paddingHorizontal: 12, paddingVertical: 6 },
    text: { fontSize: 12, fontWeight: "600" as const },
  },
  lg: {
    container: { paddingHorizontal: 16, paddingVertical: 8 },
    text: { fontSize: 14, fontWeight: "600" as const },
  },
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    alignSelf: "flex-start",
  },
});
