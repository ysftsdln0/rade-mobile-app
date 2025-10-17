/**
 * Rating Component
 * Star-based rating display and selection
 */

import React from 'react';
import { View, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles';

interface RatingProps {
  value: number; // 0-5
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showLabel?: boolean;
  color?: string;
  style?: ViewStyle;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  size = 'md',
  interactive = false,
  showLabel = false,
  color = colors.semantic.warning,
  style,
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const starSize = sizeMap[size];
  const clampedValue = Math.max(0, Math.min(5, value));

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(clampedValue);
      const isHalf = i === Math.ceil(clampedValue) && clampedValue % 1 > 0;

      stars.push(
        <Pressable
          key={i}
          onPress={() => {
            if (interactive && onChange) {
              onChange(i);
            }
          }}
          disabled={!interactive}
          style={{ opacity: interactive ? 1 : 0.8 }}
        >
          <Ionicons
            name={isFilled ? 'star' : isHalf ? 'star-half' : 'star-outline'}
            size={starSize}
            color={isFilled || isHalf ? color : colors.neutral[300]}
          />
        </Pressable>
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>{renderStars()}</View>
      {showLabel && (
        <Text style={styles.label}>
          {clampedValue.toFixed(1)} / 5.0
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[600],
  },
});
