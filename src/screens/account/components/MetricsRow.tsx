import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../../constants';

export type AccountMetric = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  caption?: string;
};

type Props = {
  metrics: AccountMetric[];
};

export const MetricsRow: React.FC<Props> = ({ metrics }) => (
  <View style={styles.metricsRow}>
    {metrics.map((item, index) => (
      <View
        key={item.id}
        style={[styles.metricCard, index === metrics.length - 1 && styles.metricCardLast]}
      >
        <View style={styles.metricIconCircle}>
          <Ionicons name={item.icon} size={18} color={COLORS.primary} />
        </View>
        <Text style={styles.metricValue}>{item.value}</Text>
        <Text style={styles.metricLabel}>{item.label}</Text>
        {item.caption ? <Text style={styles.metricCaption}>{item.caption}</Text> : null}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginRight: SPACING.sm,
  },
  metricCardLast: {
    marginRight: 0,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  metricValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metricCaption: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    marginTop: 4,
  },
});
