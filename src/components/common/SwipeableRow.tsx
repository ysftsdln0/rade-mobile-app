import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, semanticSpacing } from "../../styles";
import { haptics } from "../../utils/haptics";
import { useTheme } from "../../utils/ThemeContext";

export interface SwipeAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

interface SwipeableRowProps {
  children: React.ReactNode;
  /** Left swipe actions (swipe right to reveal) */
  leftActions?: SwipeAction[];
  /** Right swipe actions (swipe left to reveal) */
  rightActions?: SwipeAction[];
  /** Threshold to trigger action (0-1). Default: 0.3 */
  actionThreshold?: number;
  /** Enable haptic feedback. Default: true */
  hapticFeedback?: boolean;
}

/**
 * Swipeable row component with customizable left/right actions
 *
 * Provides iOS-style swipe gestures for list items:
 * - Swipe left to reveal right actions (delete, archive, etc.)
 * - Swipe right to reveal left actions (mark read, flag, etc.)
 * - Haptic feedback on action trigger
 * - Spring-based physics for smooth animations
 *
 * @example
 * <SwipeableRow
 *   rightActions={[
 *     {
 *       icon: 'trash-outline',
 *       label: 'Delete',
 *       color: '#fff',
 *       backgroundColor: colors.semantic.error,
 *       onPress: handleDelete,
 *     },
 *   ]}
 * >
 *   <ListItem item={item} />
 * </SwipeableRow>
 *
 * @example
 * // Both left and right actions
 * <SwipeableRow
 *   leftActions={[
 *     {
 *       icon: 'checkmark-outline',
 *       label: 'Mark Read',
 *       color: '#fff',
 *       backgroundColor: colors.semantic.success,
 *       onPress: handleMarkRead,
 *     },
 *   ]}
 *   rightActions={[
 *     {
 *       icon: 'archive-outline',
 *       label: 'Archive',
 *       color: '#fff',
 *       backgroundColor: colors.neutral[600],
 *       onPress: handleArchive,
 *     },
 *     {
 *       icon: 'trash-outline',
 *       label: 'Delete',
 *       color: '#fff',
 *       backgroundColor: colors.semantic.error,
 *       onPress: handleDelete,
 *     },
 *   ]}
 * >
 *   <ListItem item={item} />
 * </SwipeableRow>
 */
export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  actionThreshold = 0.3,
  hapticFeedback = true,
}) => {
  const { colors: themeColors } = useTheme();
  const translateX = useSharedValue(0);
  const actionTriggered = useSharedValue(false);

  // Action width (each action takes 80px)
  const leftActionsWidth = leftActions.length * 80;
  const rightActionsWidth = rightActions.length * 80;

  const triggerHaptic = () => {
    if (hapticFeedback) {
      haptics.medium();
    }
  };

  const executeAction = (action: SwipeAction) => {
    action.onPress();
    // Reset position after action
    translateX.value = withSpring(0, {
      damping: 20,
      stiffness: 200,
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Allow swiping left (reveal right actions) or right (reveal left actions)
      if (event.translationX < 0 && rightActions.length > 0) {
        // Swipe left - show right actions
        translateX.value = Math.max(event.translationX, -rightActionsWidth);
      } else if (event.translationX > 0 && leftActions.length > 0) {
        // Swipe right - show left actions
        translateX.value = Math.min(event.translationX, leftActionsWidth);
      }

      // Trigger haptic at threshold
      const threshold =
        event.translationX < 0
          ? -rightActionsWidth * actionThreshold
          : leftActionsWidth * actionThreshold;
      const crossed =
        event.translationX < 0
          ? event.translationX < threshold
          : event.translationX > threshold;

      if (crossed && !actionTriggered.value) {
        actionTriggered.value = true;
        runOnJS(triggerHaptic)();
      } else if (!crossed && actionTriggered.value) {
        actionTriggered.value = false;
      }
    })
    .onEnd((event) => {
      const velocity = event.velocityX;

      // Determine if action should trigger
      if (event.translationX < 0 && rightActions.length > 0) {
        // Swipe left
        const threshold = -rightActionsWidth * actionThreshold;
        if (event.translationX < threshold || velocity < -500) {
          // Show actions fully
          translateX.value = withSpring(-rightActionsWidth, {
            damping: 20,
            stiffness: 200,
          });
        } else {
          // Reset
          translateX.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
          });
        }
      } else if (event.translationX > 0 && leftActions.length > 0) {
        // Swipe right
        const threshold = leftActionsWidth * actionThreshold;
        if (event.translationX > threshold || velocity > 500) {
          // Show actions fully
          translateX.value = withSpring(leftActionsWidth, {
            damping: 20,
            stiffness: 200,
          });
        } else {
          // Reset
          translateX.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
          });
        }
      }

      actionTriggered.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderActions = (actions: SwipeAction[], side: "left" | "right") => {
    if (actions.length === 0) return null;

    return (
      <View
        style={[
          styles.actionsContainer,
          side === "left" ? styles.leftActions : styles.rightActions,
        ]}
      >
        {actions.map((action, index) => (
          <Pressable
            key={index}
            style={[
              styles.actionButton,
              { backgroundColor: action.backgroundColor },
            ]}
            onPress={() => {
              if (hapticFeedback) haptics.medium();
              executeAction(action);
            }}
          >
            <Ionicons name={action.icon} size={24} color={action.color} />
            <Text style={[styles.actionLabel, { color: action.color }]}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Left actions (revealed by swiping right) */}
      {renderActions(leftActions, "left")}

      {/* Right actions (revealed by swiping left) */}
      {renderActions(rightActions, "right")}

      {/* Main content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "transparent",
  },
  actionsContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    flexDirection: "row",
  },
  leftActions: {
    left: 0,
  },
  rightActions: {
    right: 0,
  },
  actionButton: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: semanticSpacing.padding.sm,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
