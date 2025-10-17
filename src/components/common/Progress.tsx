/**
 * Progress Component
 * Visual representation of progress with multiple variants
 */

import React from 'react';
import { View, StyleSheet, Text, ViewStyle, Animated } from 'react-native';
import { colors } from '../../styles';

interface ProgressProps {
  progress: number; // 0-100
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  animated?: boolean;
  style?: ViewStyle;
}

export const Progress: React.FC<ProgressProps> = ({
  progress,
  variant = 'linear',
  size = 'md',
  color = colors.primary[500],
  showLabel = false,
  animated = true,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clampedProgress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [clampedProgress]);

  const sizeStyles = {
    sm: { height: 4, borderRadius: 2 },
    md: { height: 6, borderRadius: 3 },
    lg: { height: 8, borderRadius: 4 },
  };

  if (variant === 'linear') {
    return (
      <View style={[styles.linearContainer, style]}>
        <View
          style={[
            styles.linearTrack,
            sizeStyles[size],
            { backgroundColor: colors.neutral[200] },
          ]}
        >
          <Animated.View
            style={[
              styles.linearProgress,
              sizeStyles[size],
              {
                backgroundColor: color,
                width: `${clampedProgress}%`,
              },
            ]}
          />
        </View>
        {showLabel && (
          <Text style={styles.label}>{clampedProgress.toFixed(0)}%</Text>
        )}
      </View>
    );
  }

  // Circular variant
  return (
    <View style={[styles.circularContainer, style]}>
      <View
        style={[
          styles.circularBackground,
          {
            borderColor: colors.neutral[200],
            width: size === 'sm' ? 60 : size === 'md' ? 80 : 100,
            height: size === 'sm' ? 60 : size === 'md' ? 80 : 100,
            borderRadius: size === 'sm' ? 30 : size === 'md' ? 40 : 50,
          },
        ]}
      >
        <View
          style={[
            styles.circularProgress,
            {
              borderColor: color,
              borderTopColor: 'transparent',
              width: size === 'sm' ? 60 : size === 'md' ? 80 : 100,
              height: size === 'sm' ? 60 : size === 'md' ? 80 : 100,
              borderRadius: size === 'sm' ? 30 : size === 'md' ? 40 : 50,
              transform: [
                {
                  rotate: `${(clampedProgress / 100) * 360}deg`,
                },
              ],
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.circularLabel}>
          {clampedProgress.toFixed(0)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  linearContainer: {
    gap: 8,
  },
  linearTrack: {
    backgroundColor: colors.neutral[200],
    overflow: 'hidden',
  },
  linearProgress: {
    backgroundColor: colors.primary[500],
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[600],
    textAlign: 'right',
  },
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularBackground: {
    borderWidth: 4,
    borderColor: colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgress: {
    position: 'absolute',
    borderWidth: 4,
    borderTopColor: colors.primary[500],
  },
  circularLabel: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.neutral[900],
  },
});
