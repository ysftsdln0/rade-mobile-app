import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../../components/common/AppCard';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../../constants';

type Props = {
  outstandingInvoices: string;
  paymentSummary: string;
  onPressInvoices: () => void;
  onPressPaymentMethods: () => void;
};

export const BillingSummaryCard: React.FC<Props> = ({
  outstandingInvoices,
  paymentSummary,
  onPressInvoices,
  onPressPaymentMethods,
}) => {
  return (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Faturalama Özeti</Text>
        <Text style={styles.cardSubtitle}>Ödemelerinizi takip edin</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{outstandingInvoices}</Text>
          <Text style={styles.summaryLabel}>Bekleyen Fatura</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValueSmall}>{paymentSummary}</Text>
          <Text style={styles.summaryLabel}>Varsayılan Ödeme</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.outlineButton, styles.buttonRowItem]}
          onPress={onPressInvoices}
        >
          <Ionicons name="card-outline" size={18} color={COLORS.primary.main} style={styles.buttonIcon} />
          <Text style={styles.outlineButtonText}>Faturaları Gör</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.outlineButton, styles.buttonRowItemLast]}
          onPress={onPressPaymentMethods}
        >
          <Ionicons name="wallet-outline" size={18} color={COLORS.primary.main} style={styles.buttonIcon} />
          <Text style={styles.outlineButtonText}>Ödeme Yöntemleri</Text>
        </TouchableOpacity>
      </View>
    </AppCard>
  );
};

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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  summaryItem: {
    flex: 1,
    marginRight: SPACING.md,
  },
  summaryValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  summaryValueSmall: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.md,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRowItem: {
    marginRight: SPACING.sm,
  },
  buttonRowItemLast: {
    marginRight: 0,
  },
  outlineButtonText: {
    color: COLORS.primary.main,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
});
