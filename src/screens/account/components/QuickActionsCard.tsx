import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppCard from '../../../components/common/AppCard';
import { ListItem } from '../../../components/common/ListItem';
import { COLORS, FONT_SIZES, SPACING } from '../../../constants';

export type QuickAction = {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
};

type Props = {
  actions: QuickAction[];
};

export const QuickActionsCard: React.FC<Props> = ({ actions }) => (
  <AppCard style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>Hızlı İşlemler</Text>
      <Text style={styles.cardSubtitle}>Sık kullanılan sayfalara atlayın</Text>
    </View>
    {actions.map((action) => (
      <ListItem
        key={action.title}
        title={action.title}
        subtitle={action.subtitle}
        icon={action.icon as any}
        onPress={action.onPress}
      />
    ))}
  </AppCard>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
