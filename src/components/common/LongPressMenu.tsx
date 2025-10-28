import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { mediumImpact } from "../../utils/haptics";
import { colors } from "../../styles";
import { spacing } from "../../styles/spacing";

export interface MenuAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
  destructive?: boolean;
}

interface LongPressMenuProps {
  children: React.ReactNode;
  actions: MenuAction[];
  enabled?: boolean;
  delayLongPress?: number;
  hapticFeedback?: boolean;
}

/**
 * LongPressMenu
 *
 * Shows a context menu when user long-presses on the child component.
 * Features haptic feedback and smooth animations.
 *
 * @example
 * ```tsx
 * <LongPressMenu
 *   actions={[
 *     {
 *       icon: 'create-outline',
 *       label: 'Edit',
 *       onPress: handleEdit,
 *     },
 *     {
 *       icon: 'share-outline',
 *       label: 'Share',
 *       onPress: handleShare,
 *     },
 *     {
 *       icon: 'trash-outline',
 *       label: 'Delete',
 *       onPress: handleDelete,
 *       destructive: true,
 *     },
 *   ]}
 * >
 *   <Card>...</Card>
 * </LongPressMenu>
 * ```
 */
export const LongPressMenu: React.FC<LongPressMenuProps> = ({
  children,
  actions,
  enabled = true,
  delayLongPress = 500,
  hapticFeedback = true,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const showMenu = (x: number, y: number) => {
    if (hapticFeedback) {
      mediumImpact();
    }
    setMenuPosition({ x, y });
    setMenuVisible(true);
    opacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const hideMenu = () => {
    opacity.value = withTiming(0, {
      duration: 150,
      easing: Easing.in(Easing.ease),
    });
    setTimeout(() => {
      setMenuVisible(false);
    }, 150);
  };

  const handleAction = (action: MenuAction) => {
    hideMenu();
    setTimeout(() => {
      action.onPress();
    }, 200);
  };

  const longPressGesture = Gesture.LongPress()
    .enabled(enabled)
    .minDuration(delayLongPress)
    .onStart((event) => {
      "worklet";
      scale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 200,
      });
    })
    .onEnd((event) => {
      "worklet";
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
      runOnJS(showMenu)(event.absoluteX, event.absoluteY);
    })
    .onFinalize(() => {
      "worklet";
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      <GestureDetector gesture={longPressGesture}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>

      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={hideMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={hideMenu}>
          <Animated.View
            style={[
              styles.menuContainer,
              menuAnimatedStyle,
              {
                top: Math.min(menuPosition.y, 600),
                left: Math.max(menuPosition.x - 100, 20),
              },
            ]}
          >
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === 0 && styles.menuItemFirst,
                  index === actions.length - 1 && styles.menuItemLast,
                ]}
                onPress={() => handleAction(action)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={action.icon}
                  size={20}
                  color={
                    action.destructive
                      ? colors.semantic.error
                      : action.color || colors.neutral[700]
                  }
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    action.destructive && styles.menuLabelDestructive,
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 12,
    minWidth: 200,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  menuItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  menuIcon: {
    marginRight: spacing[3],
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.neutral[800],
  },
  menuLabelDestructive: {
    color: colors.semantic.error,
  },
});
