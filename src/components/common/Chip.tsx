/**
 * Chip Component
 * Interactive selectable pill-shaped buttons
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'filled' | 'outlined' | 'elevated';
  icon?: keyof typeof Ionicons.glyphMap;
  onDelete?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  variant = 'outlined',
  icon,
  onDelete,
  style,
  disabled = false,
}) => {
  const getStyle = () => {
    if (variant === 'filled') {
      return {
        container: [
          styles.chip,
          {
            backgroundColor: selected ? colors.primary[500] : colors.neutral[100],
            borderColor: selected ? colors.primary[500] : colors.neutral[200],
          },
        ],
        text: { color: selected ? '#FFFFFF' : colors.neutral[900] },
      };
    }

    return {
      container: [
        styles.chip,
        {
          backgroundColor: selected ? `${colors.primary[500]}15` : 'transparent',
          borderColor: selected ? colors.primary[500] : colors.neutral[300],
        },
      ],
      text: { color: selected ? colors.primary[500] : colors.neutral[900] },
    };
  };

  const chipStyle = getStyle();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        chipStyle.container,
        pressed && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons
            name={icon}
            size={16}
            color={chipStyle.text.color}
            style={styles.icon}
          />
        )}
        <Text style={[styles.label, chipStyle.text]}>{label}</Text>
        {onDelete && (
          <Pressable onPress={onDelete} style={styles.deleteButton}>
            <Ionicons
              name="close-circle"
              size={16}
              color={chipStyle.text.color}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 4,
  },
  icon: {
    marginRight: 4,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
});
