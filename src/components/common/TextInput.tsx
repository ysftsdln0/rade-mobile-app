import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput as RNTextInput, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';

interface TextInputFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

/**
 * TextInput Component
 * 
 * Professional admin form input with label, error handling, and icon support.
 * Includes focus states, error styling, and professional typography.
 * 
 * Features:
 * - Optional label with uppercase styling
 * - Icon support (left-aligned)
 * - Error state with message display
 * - Focus state with primary color border
 * - Accessibility labels
 * 
 * @example
 * <TextInput
 *   label="Email"
 *   placeholder="you@example.com"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 * 
 * @example
 * <TextInput
 *   label="Username"
 *   placeholder="Enter username"
 *   value={username}
 *   onChangeText={setUsername}
 *   error="Username is required"
 *   icon={<UserIcon size={18} />}
 * />
 */
export const TextInput: React.FC<TextInputFieldProps> = ({
  label,
  error,
  icon: Icon,
  containerStyle,
  inputStyle,
  testID,
  onFocus,
  onBlur,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const { colors: themeColors, isDark } = useTheme();

  const handleFocus = (e: any) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {label && <Text style={[styles.label, { color: themeColors.textSecondary }]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          { 
            borderColor: themeColors.inputBorder,
            backgroundColor: themeColors.input
          },
          focused && { 
            borderColor: themeColors.primary,
            backgroundColor: isDark ? themeColors.surfaceAlt : `${colors.primary[500]}08`
          },
          error && styles.errorState,
        ]}
      >
        {Icon && (
          <View style={styles.iconContainer}>
            {Icon}
          </View>
        )}
        <RNTextInput
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            { color: themeColors.text },
            Icon ? styles.inputWithIcon : {},
            inputStyle,
          ]}
          placeholderTextColor={themeColors.textTertiary}
          accessibilityLabel={label || props.placeholder}
          accessibilityState={{ disabled: props.editable === false }}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: '600',
    marginBottom: spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderRadius: 8,
    borderWidth: 2,
  },
  focused: {
    // Handled dynamically in component
  },
  errorState: {
    borderColor: colors.semantic.error,
    backgroundColor: `${colors.semantic.error}08`,
  },
  iconContainer: {
    marginRight: spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  inputWithIcon: {
    marginLeft: spacing[1],
  },
  errorText: {
    marginTop: spacing[1],
    fontSize: 12,
    color: colors.semantic.error,
    fontWeight: '500',
  },
});
