import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  gradientColors?: [string, string];
  containerStyle?: ViewStyle;
  testID?: string;
}

/**
 * FloatingActionButton (FAB)
 * 
 * Gradient floating action button with icon.
 * 
 * Features:
 * - Gradient background (blue-purple)
 * - Fixed bottom-right position
 * - Plus icon (default)
 * - Shadow elevation
 * 
 * @example
 * <FloatingActionButton 
 *   onPress={() => handleAddDomain()}
 * />
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'add',
  gradientColors = [colors.primary[500], colors.accent.gradient_end],
  containerStyle,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.8}
      testID={testID}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Ionicons name={icon as any} size={28} color="#FFFFFF" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing[4],
    bottom: spacing[6],
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
