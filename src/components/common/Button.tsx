import React from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';

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
  const { colors: themeColors, isDark } = useTheme();

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
        variant === 'primary' && { backgroundColor: themeColors.primary },
        variant === 'secondary' && { backgroundColor: themeColors.surfaceAlt },
        variant === 'danger' && { backgroundColor: themeColors.error },
        variant === 'ghost' && { 
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: themeColors.border
        },
        pressed && !isDisabledOrLoading && styles.buttonPressed,
      ]}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? themeColors.primary : colors.neutral[50]}
          size="small"
        />
      ) : (
        <View style={styles.buttonContent}>
          {Icon && Icon}
          <Text style={[
            styles.buttonText,
            variant === 'primary' && { color: '#FFFFFF' },
            variant === 'secondary' && { color: themeColors.text },
            variant === 'danger' && { color: '#FFFFFF' },
            variant === 'ghost' && { color: themeColors.primary },
          ]}>{label}</Text>
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
