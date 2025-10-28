import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeInDown,
  FadeOutUp,
} from "react-native-reanimated";

interface AnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  style?: ViewStyle;
  /** Delay between each item (ms). Default: 100ms */
  staggerDelay?: number;
  /** Animation duration (ms). Default: 400ms */
  duration?: number;
  /** Enable entering animation. Default: true */
  entering?: boolean;
  /** Enable exiting animation. Default: true */
  exiting?: boolean;
}

/**
 * Animated list item with staggered FadeInDown effect
 *
 * Provides smooth entry/exit animations for list items with:
 * - Staggered delay based on index
 * - FadeInDown entering animation
 * - FadeOutUp exiting animation
 * - Customizable timing and duration
 *
 * @example
 * <FlatList
 *   data={items}
 *   renderItem={({ item, index }) => (
 *     <AnimatedListItem index={index}>
 *       <ItemCard item={item} />
 *     </AnimatedListItem>
 *   )}
 * />
 *
 * @example
 * // Custom stagger delay and duration
 * <AnimatedListItem index={0} staggerDelay={150} duration={500}>
 *   <Card />
 * </AnimatedListItem>
 */
export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  index,
  style,
  staggerDelay = 100,
  duration = 400,
  entering = true,
  exiting = true,
}) => {
  // Calculate delay based on index for stagger effect
  const delay = index * staggerDelay;

  return (
    <Animated.View
      entering={
        entering
          ? FadeInDown.duration(duration)
              .delay(delay)
              .easing(Easing.bezier(0.4, 0.0, 0.2, 1))
          : undefined
      }
      exiting={
        exiting
          ? FadeOutUp.duration(300).easing(Easing.bezier(0.4, 0.0, 0.2, 1))
          : undefined
      }
      style={style}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Simple fade-in animation wrapper (no stagger)
 * Useful for single items or when you want uniform timing
 */
export const FadeInView: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
  duration?: number;
  delay?: number;
}> = ({ children, style, duration = 400, delay = 0 }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(duration).delay(delay)}
      exiting={FadeOutUp.duration(300)}
      style={style}
    >
      {children}
    </Animated.View>
  );
};
