/**
 * Toast Component
 * Animated notification system for temporary messages
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  SlideInUp, 
  SlideOutUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';
import { haptics } from '../../utils/haptics';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

const getIcon = (type: ToastType): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'success':
      return 'checkmark-circle';
    case 'error':
      return 'close-circle';
    case 'warning':
      return 'warning';
    case 'info':
      return 'information-circle';
  }
};

const getColors = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        bg: colors.semantic.success,
        icon: '#FFFFFF',
        text: '#FFFFFF',
      };
    case 'error':
      return {
        bg: colors.semantic.error,
        icon: '#FFFFFF',
        text: '#FFFFFF',
      };
    case 'warning':
      return {
        bg: colors.semantic.warning,
        icon: '#FFFFFF',
        text: '#FFFFFF',
      };
    case 'info':
      return {
        bg: colors.semantic.info,
        icon: '#FFFFFF',
        text: '#FFFFFF',
      };
  }
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  visible,
  onDismiss,
  duration = 3000,
}) => {
  const scale = useSharedValue(1);
  const toastColors = getColors(type);

  useEffect(() => {
    if (visible) {
      // Haptic feedback based on type
      if (type === 'success') haptics.success();
      else if (type === 'error') haptics.error();
      else if (type === 'warning') haptics.warning();
      
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  if (!visible) return null;

  return (
    <Animated.View
      entering={SlideInUp.springify().damping(15)}
      exiting={SlideOutUp.springify().damping(15)}
      style={[styles.container]}
    >
      <Pressable
        onPress={onDismiss}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.toast,
            { backgroundColor: toastColors.bg },
            animatedStyle,
          ]}
        >
          <Ionicons 
            name={getIcon(type)} 
            size={24} 
            color={toastColors.icon} 
          />
          <Text style={[styles.message, { color: toastColors.text }]}>
            {message}
          </Text>
          <Pressable onPress={onDismiss} hitSlop={8}>
            <Ionicons name="close" size={20} color={toastColors.icon} />
          </Pressable>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing[4],
    right: spacing[4],
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
    gap: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
