import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon = 'layers-outline',
  actionLabel,
  onAction 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={48} color={COLORS.gray400} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  actionText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
});
