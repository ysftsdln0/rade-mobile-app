/**
 * InvoiceListScreen
 * 
 * Invoice management screen showing:
 * - List of all invoices with status
 * - Invoice amounts and due dates
 * - Payment actions
 * - Status filtering
 * - Search by invoice ID or customer
 */
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useInvoices } from '../../hooks/useInvoices';
import {
  DashboardHeader,
  Card,
  DataRow,
  Button,
  AlertBanner,
  Badge,
  Progress,
} from '../../components/common';
import { colors, spacing } from '../../styles';

const statusConfig = {
  paid: { label: 'Paid', color: 'online' as const },
  unpaid: { label: 'Unpaid', color: 'offline' as const },
  overdue: { label: 'Overdue', color: 'warning' as const },
  cancelled: { label: 'Cancelled', color: 'neutral' as const },
};

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
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
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const InvoiceListScreen = () => {
  const navigation = useNavigation<any>();
  const { invoicesQuery, payInvoice, paying, paymentMethodsQuery } = useInvoices();
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultMethodId = useMemo(() => {
    const methods = paymentMethodsQuery.data || [];
    const defaultMethod = methods.find((m) => m.isDefault) ?? methods[0];
    return defaultMethod?.id;
  }, [paymentMethodsQuery.data]);

  const invoices = useMemo(() => {
    let list = invoicesQuery.data || [];
    
    // Filter by status
    if (filterStatus !== 'all') {
      list = list.filter((inv) => inv.status === filterStatus);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.id.toLowerCase().includes(query)
      );
    }
    
    return list;
  }, [invoicesQuery.data, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const allInvoices = invoicesQuery.data || [];
    return {
      total: allInvoices.length,
      paid: allInvoices.filter((i) => i.status === 'paid').length,
      unpaid: allInvoices.filter((i) => i.status === 'unpaid' || i.status === 'overdue').length,
      pending: allInvoices.filter((i) => i.status === 'unpaid').length,
    };
  }, [invoicesQuery.data]);

  const handlePay = async (invoiceId: string, invoiceAmount: number) => {
    if (!defaultMethodId) {
      Alert.alert('No Payment Method', 'Please add a payment method before paying invoices.');
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Pay ${formatCurrency(invoiceAmount, 'USD')}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay',
          onPress: async () => {
            try {
              await payInvoice({ invoiceId, methodId: defaultMethodId });
              Alert.alert('Success', 'Invoice paid successfully.');
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Payment failed. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (invoicesQuery.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <DashboardHeader title="Invoices" subtitle="Loading..." />
          <Card title="Loading" variant="default">
            <AlertBanner
              type="info"
              title="Loading invoices..."
              message="Please wait"
              dismissible={false}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (invoicesQuery.isError) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <DashboardHeader title="Invoices" subtitle="Error loading" />
          <Card title="Error" variant="default">
            <AlertBanner
              type="error"
              title="Failed to load invoices"
              message="Please check your connection and try again"
              dismissible
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Page Header */}
        <DashboardHeader
          title="Invoices"
          subtitle={`${stats.total} invoices total`}
        />

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color={colors.neutral[500]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Fatura ara..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.neutral[400]}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.neutral[400]} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterChipsContainer}>
          {(['all', 'paid', 'unpaid', 'overdue'] as const).map((status) => (
            <Pressable
              key={status}
              style={[
                styles.filterChip,
                filterStatus === status && styles.filterChipActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterStatus === status && styles.filterChipTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Stats Overview */}
        <Card title="Summary" variant="elevated">
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statNumber, { backgroundColor: colors.semantic.success + '20' }]}>
                <Text style={[styles.statValue, { color: colors.semantic.success }]}>
                  {stats.paid}
                </Text>
              </View>
              <Text style={styles.statLabel}>Paid</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statNumber, { backgroundColor: colors.semantic.warning + '20' }]}>
                <Text style={[styles.statValue, { color: colors.semantic.warning }]}>
                  {stats.pending}
                </Text>
              </View>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statNumber, { backgroundColor: colors.semantic.error + '20' }]}>
                <Text style={[styles.statValue, { color: colors.semantic.error }]}>
                  {stats.unpaid - stats.pending}
                </Text>
              </View>
              <Text style={styles.statLabel}>Overdue</Text>
            </View>
          </View>
        </Card>

        {/* Filter Buttons */}
        <Card title="Filter" variant="default">
          <View style={styles.filterRow}>
            {(['all', 'paid', 'unpaid', 'overdue'] as const).map((status) => (
              <Button
                key={status}
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                variant={filterStatus === status ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setFilterStatus(status)}
                style={styles.filterButton}
              />
            ))}
          </View>
        </Card>

        {/* Invoices List */}
        {invoices.length === 0 ? (
          <Card title="No Invoices" variant="default">
            <AlertBanner
              type="info"
              title="No invoices"
              message={`No ${filterStatus} invoices found`}
              dismissible={false}
            />
          </Card>
        ) : (
          <Card title={`${invoices.length} Invoice${invoices.length !== 1 ? 's' : ''}`} variant="default">
            {invoices.map((invoice, index) => {
              const status = statusConfig[invoice.status] || statusConfig.unpaid;
              const isPaid = invoice.status === 'paid';
              
              const badgeVariant = 
                invoice.status === 'paid' ? 'success' :
                invoice.status === 'unpaid' ? 'warning' :
                invoice.status === 'overdue' ? 'error' :
                'default';
              
              return (
                <View key={invoice.id}>
                  <View style={styles.invoiceRow}>
                    <View style={styles.invoiceInfo}>
                      <DataRow
                        label={invoice.number}
                        value={formatCurrency(invoice.amount, invoice.currency)}
                        secondary={`Due: ${formatDate(invoice.dueDate)}`}
                        divider={false}
                      />
                    </View>
                    <Badge label={status.label} variant={badgeVariant} />
                  </View>
                  {index < invoices.length - 1 && <View style={styles.invoiceDivider} />}
                  {!isPaid && (
                    <View style={styles.invoiceActions}>
                      <Button
                        label={paying ? 'Processing...' : 'Pay Now'}
                        variant="primary"
                        size="sm"
                        loading={paying}
                        disabled={paying || isPaid}
                        onPress={() => handlePay(invoice.id, invoice.amount)}
                        style={styles.payButton}
                      />
                      <Button
                        label="Details"
                        variant="secondary"
                        size="sm"
                        onPress={() => {
                          // TODO: Navigate to invoice details
                        }}
                        style={styles.detailsButton}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </Card>
        )}

        {/* Payment Methods Info */}
        {invoices.some((i) => i.status !== 'paid') && (
          <Card title="Payment Method" variant="default">
            {defaultMethodId ? (
              <DataRow
                label="Default Payment Method"
                value="Configured"
                status="online"
                divider={false}
                onPress={() => navigation.navigate('Account', { screen: 'PaymentMethods' })}
              />
            ) : (
              <AlertBanner
                type="warning"
                title="No payment method"
                message="Add a payment method to pay invoices"
                action={{
                  label: 'Add Method',
                  onPress: () => navigation.navigate('Account', { screen: 'PaymentMethods' }),
                }}
                dismissible={false}
              />
            )}
          </Card>
        )}

        {/* Spacer */}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[6],
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    height: 50,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral[900],
    marginLeft: spacing[2],
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  filterChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    backgroundColor: colors.neutral[200],
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  filterChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[700],
  },
  filterChipTextActive: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing[3],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: colors.neutral[600],
    fontWeight: '600',
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  filterButton: {
    flex: 1,
    minWidth: 80,
  },
  invoiceActions: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[3],
    marginBottom: spacing[3],
    paddingHorizontal: spacing[2],
  },
  payButton: {
    flex: 1,
  },
  detailsButton: {
    flex: 1,
  },
  spacer: {
    height: spacing[6],
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing[2],
  },
});

export default InvoiceListScreen;
