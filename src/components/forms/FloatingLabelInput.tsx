import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, semanticSpacing, typography } from "../../styles";
import { useTheme } from "../../utils/ThemeContext";

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  error?: string;
  /** Icon to display on the left */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  /** Icon to display on the right */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  /** Action when right icon is pressed */
  onRightIconPress?: () => void;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Required field indicator */
  required?: boolean;
}

/**
 * Floating label text input with smooth animations
 *
 * Material Design inspired input with:
 * - Label animates up when focused or has value
 * - Smooth color transitions for focus state
 * - Error state with message
 * - Optional left/right icons
 * - Required field indicator
 *
 * @example
 * <FloatingLabelInput
 *   label="Email"
 *   value={email}
 *   onChangeText={setEmail}
 *   keyboardType="email-address"
 *   autoCapitalize="none"
 *   leftIcon="mail-outline"
 * />
 *
 * @example
 * // Password with toggle visibility
 * <FloatingLabelInput
 *   label="Password"
 *   value={password}
 *   onChangeText={setPassword}
 *   secureTextEntry={!showPassword}
 *   leftIcon="lock-closed-outline"
 *   rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
 *   onRightIconPress={() => setShowPassword(!showPassword)}
 * />
 *
 * @example
 * // With error
 * <FloatingLabelInput
 *   label="Username"
 *   value={username}
 *   onChangeText={setUsername}
 *   error="Username is required"
 *   required
 * />
 */
export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  required = false,
  value,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const { colors: themeColors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  // Animation value: 0 = down (placeholder), 1 = up (label)
  const labelPosition = useSharedValue(value ? 1 : 0);
  const focusAnimation = useSharedValue(0);

  useEffect(() => {
    // Animate label position when value changes or focus changes
    const shouldFloat = isFocused || (value && value.length > 0);
    labelPosition.value = withTiming(shouldFloat ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
  }, [isFocused, value]);

  useEffect(() => {
    // Animate focus state (border color, label color)
    focusAnimation.value = withTiming(isFocused ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
  }, [isFocused]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Animated label style
  const animatedLabelStyle = useAnimatedStyle(() => {
    const translateY = interpolate(labelPosition.value, [0, 1], [0, -28]);
    const scale = interpolate(labelPosition.value, [0, 1], [1, 0.85]);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  // Get label color based on state
  const getLabelColor = () => {
    if (error) return colors.semantic.error;
    if (isFocused) return colors.primary[500];
    return themeColors.textSecondary;
  };

  // Animated border style
  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderWidth = interpolate(focusAnimation.value, [0, 1], [1, 2]);

    return {
      borderWidth,
    };
  });

  // Get border color based on state
  const getBorderColor = () => {
    if (error) return colors.semantic.error;
    if (isFocused) return colors.primary[500];
    return isDark ? colors.dark.border : colors.neutral[300];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Input container */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: themeColors.card,
            borderColor: getBorderColor(),
          },
          animatedBorderStyle,
        ]}
      >
        {/* Left icon */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={
              error
                ? colors.semantic.error
                : isFocused
                  ? colors.primary[500]
                  : themeColors.textSecondary
            }
            style={styles.leftIcon}
          />
        )}

        {/* Input wrapper for label positioning */}
        <View style={styles.inputWrapper}>
          {/* Floating label */}
          <Animated.Text
            style={[
              styles.label,
              { color: getLabelColor() },
              animatedLabelStyle,
            ]}
          >
            {label}
            {required && " *"}
          </Animated.Text>

          {/* Text input */}
          <TextInput
            style={[
              styles.input,
              { color: themeColors.text },
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
            ]}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={themeColors.textSecondary}
            {...textInputProps}
          />
        </View>

        {/* Right icon */}
        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={
                error
                  ? colors.semantic.error
                  : isFocused
                    ? colors.primary[500]
                    : themeColors.textSecondary
              }
            />
          </Pressable>
        )}
      </Animated.View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: semanticSpacing.margin.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 56,
    paddingHorizontal: semanticSpacing.padding.md,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    left: 0,
    fontSize: 16,
    fontWeight: "400",
    transformOrigin: "left center",
  },
  input: {
    fontSize: 16,
    fontWeight: "400",
    paddingVertical: 8,
    paddingTop: 20,
    paddingBottom: 4,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    marginRight: semanticSpacing.margin.sm,
  },
  rightIcon: {
    marginLeft: semanticSpacing.margin.sm,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.semantic.error,
    marginTop: 4,
    marginLeft: semanticSpacing.margin.md,
  },
});
