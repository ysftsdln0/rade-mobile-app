import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInvoices } from '../../hooks/useInvoices';
import AppCard from '../../components/common/AppCard';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';
import { PaymentMethod } from '../../types';

const methodIcon = {
  credit_card: 'card-outline',
  bank_transfer: 'business-outline',
  paypal: 'logo-paypal',
} as const;

const PaymentMethodsScreen: React.FC = () => {
  const { paymentMethodsQuery } = useInvoices();

  if (paymentMethodsQuery.isLoading) {
    return <LoadingState message="Ödeme yöntemleri yükleniyor..." />;
  }

  if (paymentMethodsQuery.isError) {
    return (
      <EmptyState
        icon="warning-outline"
        title="Ödeme yöntemleri alınamadı"
        description="Lütfen bağlantınızı kontrol ederek tekrar deneyin."
      />
    );
  }

  const methods = paymentMethodsQuery.data || [];

  if (methods.length === 0) {
    return (
      <EmptyState
        icon="card-outline"
        title="Kayıtlı ödeme yöntemi yok"
        description="Yeni bir ödeme yöntemi ekledikten sonra burada görüntülenecek."
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {methods.map((method) => (
        <AppCard key={method.id} style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={methodIcon[method.type] ?? 'card-outline'}
                  size={22}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.methodTitle}>{formatMethodTitle(method)}</Text>
            </View>
            {method.isDefault ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Varsayılan</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.methodSubtitle}>{formatMethodSubtitle(method)}</Text>
        </AppCard>
      ))}
    </ScrollView>
  );
};

const formatMethodTitle = (method: PaymentMethod) => {
  switch (method.type) {
    case 'credit_card':
      return `${method.cardType || 'Kart'} •••• ${method.lastFour || 'XXXX'}`;
    case 'bank_transfer':
      return 'Banka Havalesi';
    case 'paypal':
      return 'PayPal';
    default:
      return 'Ödeme Yöntemi';
  }
};

const formatMethodSubtitle = (method: PaymentMethod) => {
  switch (method.type) {
    case 'credit_card':
      return `Son Kullanma: ${method.expiryDate || '-'}`;
    case 'bank_transfer':
      return 'Havale / EFT ile ödeme';
    case 'paypal':
      return 'PayPal hesabınız ile ödeme';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  methodSubtitle: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  badge: {
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 24,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
});

export default PaymentMethodsScreen;
