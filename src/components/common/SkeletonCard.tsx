import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../../utils/ThemeContext";
import { colors, spacing } from "../../styles";

interface SkeletonCardProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

/**
 * Skeleton placeholder with shimmer animation effect
 * Used for loading states to improve perceived performance
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = "100%",
  height = 80,
  borderRadius = 12,
  style,
}) => {
  const { colors: themeColors, isDark } = useTheme();
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    // Continuous shimmer animation with standard easing
    shimmerValue.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease), // Standard easing curve
      }),
      -1, // Infinite repeat
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerValue.value, [0, 1], [-300, 300]);

    return {
      transform: [{ translateX }],
    };
  });

  const backgroundColor = isDark ? colors.dark.surface : colors.neutral[100];
  const shimmerColor = isDark ? colors.dark.surfaceAlt : colors.neutral[200];

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          shimmerStyle,
          {
            backgroundColor: shimmerColor,
            opacity: 0.5,
          },
        ]}
      />
    </View>
  );
};

interface SkeletonTextProps {
  width?: number | string;
  height?: number;
  style?: any;
}

/**
 * Skeleton text placeholder
 * Used for single line text loading states
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  width = "100%",
  height = 16,
  style,
}) => {
  return (
    <SkeletonCard
      width={width}
      height={height}
      borderRadius={8}
      style={style}
    />
  );
};

interface SkeletonCircleProps {
  size?: number;
  style?: any;
}

/**
 * Skeleton circle placeholder
 * Used for avatar/icon loading states
 */
export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 40,
  style,
}) => {
  return (
    <SkeletonCard
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // Base styles handled by props
  },
});
