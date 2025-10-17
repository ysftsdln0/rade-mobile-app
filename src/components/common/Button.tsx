import React from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../styles';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
  gradientColors?: [string, string, ...string[]];
}

/**
 * Button Component
 * 
 * Professional admin dashboard button with multiple variants and sizes.
 * 
 * Variants:
 * - primary: Professional blue action button (default)
 * - secondary: Light gray secondary button
 * - danger: Red destructive action button
 * - ghost: Transparent outline button
 * - gradient: Blue-to-Purple gradient button
 * 
 * Sizes:
 * - sm: Small (12x8 px padding)
 * - md: Medium (16x12 px padding) - default
 * - lg: Large (20x14 px padding)
 * 
 * @example
 * <Button label="Save" onPress={() => console.log('Save')} />
 * 
 * @example
 * <Button 
 *   label="Login" 
 *   variant="gradient"
 *   size="lg"
 *   onPress={() => handleLogin()}
 * />
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  icon: Icon,
  fullWidth = false,
  style,
  testID,
  gradientColors = [colors.primary[500], colors.accent.gradient_end],
}) => {
  const isDisabledOrLoading = disabled || loading;

  const baseStyles = [
    styles.button,
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    isDisabledOrLoading && styles.disabled,
    style,
  ];

  // Gradient variant uses LinearGradient
  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientContainer, fullWidth && { width: '100%' }]}
      >
        <Pressable
          onPress={onPress}
          disabled={isDisabledOrLoading}
          style={({ pressed }) => [
            styles.button,
            styles[`size_${size}`],
            isDisabledOrLoading && styles.disabled,
            pressed && !isDisabledOrLoading && styles.buttonPressed,
          ]}
          testID={testID}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.buttonContent}>
              {Icon && Icon}
              <Text style={[styles.buttonText, styles.text_gradient]}>{label}</Text>
            </View>
          )}
        </Pressable>
      </LinearGradient>
    );
  }

  // Other variants
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabledOrLoading}
      style={({ pressed }) => [
        ...baseStyles,
        styles[`button_${variant}`],
        pressed && !isDisabledOrLoading && styles.buttonPressed,
      ]}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? colors.primary[500] : colors.neutral[50]}
          size="small"
        />
      ) : (
        <View style={styles.buttonContent}>
          {Icon && Icon}
          <Text style={[styles.buttonText, styles[`text_${variant}`]]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
  },
  gradientContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  // Primary: Professional Blue (action color)
  button_primary: {
    backgroundColor: colors.primary[500],
  },
  // Secondary: Light gray
  button_secondary: {
    backgroundColor: colors.neutral[100],
  },
  // Danger: Red
  button_danger: {
    backgroundColor: colors.semantic.error,
  },
  // Ghost: Outline only
  button_ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  // Sizes
  size_sm: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  size_md: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  size_lg: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  fullWidth: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  text_primary: {
    color: colors.neutral[50],
  },
  text_secondary: {
    color: colors.neutral[900],
  },
  text_danger: {
    color: colors.neutral[50],
  },
  text_ghost: {
    color: colors.primary[500],
  },
  text_gradient: {
    color: colors.neutral[50],
  },
  disabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
