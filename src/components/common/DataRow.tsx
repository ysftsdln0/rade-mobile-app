import React from 'react';
import { View, StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import { colors, spacing } from '../../styles';

interface DataRowProps {
  label: string;
  value: string | number;
  secondary?: string;
  icon?: React.ReactNode;
  divider?: boolean;
  onPress?: () => void;
  status?: 'online' | 'offline' | 'warning' | 'neutral';
  style?: ViewStyle;
  testID?: string;
}

/**
 * DataRow Component
 * 
 * Table/list row component for displaying data in rows.
 * Used for lists of items, settings, or data tables.
 * 
 * Features:
 * - Label and value display
 * - Optional secondary text
 * - Status indicator (online, offline, warning)
 * - Optional icon
 * - Divider support
 * - Press handler for interactive rows
 * 
 * @example
 * <DataRow
 *   label="Email"
 *   value="user@example.com"
 * />
 * 
 * @example
 * <DataRow
 *   label="Server"
 *   value="prod-01"
 *   status="online"
 *   icon={<ServerIcon size={16} />}
 *   divider
 *   onPress={() => navigate('ServerDetails')}
 * />
 */
export const DataRow: React.FC<DataRowProps> = ({
  label,
  value,
  secondary,
  icon: Icon,
  divider = false,
  onPress,
  status,
  style,
  testID,
}) => {
  const content = (
    <>
      {/* Left side: icon and label */}
      <View style={styles.leftSection}>
        {Icon && (
          <View style={styles.iconContainer}>
            {Icon}
          </View>
        )}
        <View style={styles.labelSection}>
          <Text style={styles.label}>{label}</Text>
          {secondary && <Text style={styles.secondary}>{secondary}</Text>}
        </View>
      </View>

      {/* Right side: status and value */}
      <View style={styles.rightSection}>
        {status && (
          <View style={[styles.statusBadge, styles[`status_${status}`]]} />
        )}
        <Text style={styles.value}>{value}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.rowContainer,
          divider && styles.withDivider,
          pressed && styles.rowPressed,
          style,
        ]}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.rowContainer,
        divider && styles.withDivider,
        style,
      ]}
      testID={testID}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.neutral[50],
  },
  withDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  rowPressed: {
    backgroundColor: colors.neutral[100],
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelSection: {
    flex: 1,
    gap: spacing[1],
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  secondary: {
    fontSize: 12,
    color: colors.neutral[600],
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginLeft: spacing[3],
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status_online: {
    backgroundColor: colors.status.online,
  },
  status_offline: {
    backgroundColor: colors.status.offline,
  },
  status_warning: {
    backgroundColor: colors.status.warning,
  },
  status_neutral: {
    backgroundColor: colors.neutral[300],
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[700],
    minWidth: 60,
    textAlign: 'right',
  },
});
