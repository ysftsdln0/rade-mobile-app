import React, { useEffect } from "react";
import { RefreshControl, RefreshControlProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { mediumImpact } from "../../utils/haptics";
import { colors } from "../../styles";

interface AnimatedRefreshControlProps
  extends Omit<RefreshControlProps, "refreshing" | "onRefresh"> {
  refreshing: boolean;
  onRefresh: () => void;
  tintColor?: string;
  title?: string;
  titleColor?: string;
  hapticFeedback?: boolean;
}

/**
 * AnimatedRefreshControl
 *
 * Enhanced RefreshControl with haptic feedback and customizable appearance.
 * Automatically triggers haptic feedback when refresh starts.
 *
 * @example
 * ```tsx
 * const [refreshing, setRefreshing] = useState(false);
 *
 * const handleRefresh = async () => {
 *   setRefreshing(true);
 *   await refetch();
 *   setRefreshing(false);
 * };
 *
 * <ScrollView
 *   refreshControl={
 *     <AnimatedRefreshControl
 *       refreshing={refreshing}
 *       onRefresh={handleRefresh}
 *       tintColor={colors.primary[500]}
 *     />
 *   }
 * >
 *   ...
 * </ScrollView>
 * ```
 */
export const AnimatedRefreshControl: React.FC<AnimatedRefreshControlProps> = ({
  refreshing,
  onRefresh,
  tintColor = colors.primary[500],
  title,
  titleColor = colors.neutral[600],
  hapticFeedback = true,
  ...props
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (refreshing) {
      // Trigger haptic feedback when refresh starts
      if (hapticFeedback) {
        mediumImpact();
      }

      // Pulse animation
      scale.value = withSpring(1.1, {
        damping: 10,
        stiffness: 100,
      });
      opacity.value = withTiming(0.8, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      // Reset animation
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [refreshing]);

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={tintColor}
      title={title}
      titleColor={titleColor}
      progressViewOffset={0}
      {...props}
    />
  );
};
