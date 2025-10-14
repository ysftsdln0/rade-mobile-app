import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useInvoices } from '../../hooks/useInvoices';
import AppCard from '../../components/common/AppCard';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

const statusMeta = {
  paid: { label: 'Ödendi', color: COLORS.success.main, background: '#E8F5E9' },
  unpaid: { label: 'Ödenmedi', color: COLORS.error.main, background: '#FDECEA' },
  overdue: { label: 'Son Tarih Geçti', color: COLORS.warning.main, background: '#FFF3E0' },
  cancelled: { label: 'İptal', color: COLORS.gray500, background: '#ECEFF1' },
} as const;

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

const formatDate = (date: string) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const InvoiceListScreen: React.FC = () => {
  const { invoicesQuery, payInvoice, paying, paymentMethodsQuery } = useInvoices();

  const defaultMethodId = useMemo(() => {
    const methods = paymentMethodsQuery.data || [];
    const defaultMethod = methods.find((m) => m.isDefault) ?? methods[0];
    return defaultMethod?.id;
  }, [paymentMethodsQuery.data]);

  const handlePay = async (invoiceId: string) => {
    if (!defaultMethodId) {
      Alert.alert('Ödeme Yöntemi Yok', 'Ödeme yapabilmek için önce bir ödeme yöntemi ekleyin.');
      return;
    }

    Alert.alert(
      'Ödemeyi Onayla',
      'Seçili faturayı varsayılan ödeme yöntemi ile ödemek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Öde',
          onPress: async () => {
            try {
              await payInvoice({ invoiceId, methodId: defaultMethodId });
              Alert.alert('Başarılı', 'Fatura ödemesi tamamlandı.');
            } catch (error: any) {
              Alert.alert('Hata', error?.message || 'Ödeme sırasında bir sorun oluştu.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (invoicesQuery.isLoading) {
    return <LoadingState message="Faturalar yükleniyor..." />;
  }

  if (invoicesQuery.isError) {
    return (
      <EmptyState
        icon="warning-outline"
        title="Faturalar alınamadı"
        description="Lütfen internet bağlantınızı kontrol ederek tekrar deneyin."
      />
    );
  }

  const invoices = invoicesQuery.data || [];

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon="receipt-outline"
        title="Gösterilecek fatura yok"
        description="Tamamlanan ödemeler veya bekleyen faturalar bu alanda görünecek."
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {invoices.map((invoice) => {
        const meta = statusMeta[invoice.status] ?? statusMeta.unpaid;
        return (
          <AppCard key={invoice.id} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.invoiceNumber}>{invoice.number}</Text>
              <View style={[styles.statusPill, { backgroundColor: meta.background }]}> 
                <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
              </View>
            </View>
            <Text style={styles.amount}>{formatCurrency(invoice.amount, invoice.currency)}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Fatura Tarihi</Text>
              <Text style={styles.value}>{formatDate(invoice.date)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Son Ödeme Tarihi</Text>
              <Text style={styles.value}>{formatDate(invoice.dueDate)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.payButton, (invoice.status === 'paid' || paying) && styles.payButtonDisabled]}
              onPress={() => handlePay(invoice.id)}
              disabled={invoice.status === 'paid' || paying}
            >
              <Text style={styles.payButtonText}>
                {invoice.status === 'paid' ? 'Ödeme Tamamlandı' : paying ? 'İşlem yapılıyor...' : 'Faturayı Öde'}
              </Text>
            </TouchableOpacity>
          </AppCard>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 24,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  amount: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.primary.main,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  payButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary.main,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
});

export default InvoiceListScreen;
