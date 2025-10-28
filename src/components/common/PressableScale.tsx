import React from "react";
import { Pressable, PressableProps, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { lightImpact, selectionFeedback } from "../../utils/haptics";

interface PressableScaleProps extends PressableProps {
  children: React.ReactNode;
  scaleValue?: number;
  hapticFeedback?: boolean;
  animationType?: "spring" | "timing";
  style?: ViewStyle | ViewStyle[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * PressableScale
 *
 * Enhanced Pressable with scale animation on press.
 * Provides visual feedback and optional haptic feedback.
 *
 * @example
 * ```tsx
 * <PressableScale
 *   onPress={handlePress}
 *   scaleValue={0.95}
 *   hapticFeedback
 * >
 *   <View style={styles.button}>
 *     <Text>Press Me</Text>
 *   </View>
 * </PressableScale>
 * ```
 */
export const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  scaleValue = 0.97,
  hapticFeedback = false,
  animationType = "spring",
  onPress,
  onPressIn,
  onPressOut,
  style,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (event: any) => {
    if (animationType === "spring") {
      scale.value = withSpring(scaleValue, {
        damping: 15,
        stiffness: 200,
      });
    } else {
      scale.value = withTiming(scaleValue, {
        duration: 100,
        easing: Easing.out(Easing.ease),
      });
    }

    if (hapticFeedback) {
      lightImpact();
    }

    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    if (animationType === "spring") {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
    } else {
      scale.value = withTiming(1, {
        duration: 100,
        easing: Easing.in(Easing.ease),
      });
    }

    onPressOut?.(event);
  };

  const handlePress = (event: any) => {
    if (hapticFeedback) {
      selectionFeedback();
    }
    onPress?.(event);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
};
