import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';

type Props = {
  navigation?: any;
};

const BillingMainScreen = ({ navigation }: Props) => {
  const paymentMethods = [
    {
      id: '1',
      type: 'Visa',
      last4: '1234',
      expiry: '06/25',
      icon: 'card' as const,
    },
    {
      id: '2',
      type: 'Mastercard',
      last4: '5678',
      expiry: '08/26',
      icon: 'card' as const,
    },
  ];

  const billingHistory = [
    {
      id: '1',
      month: 'November 2024',
      amount: '$25.00',
      status: 'Paid',
    },
    {
      id: '2',
      month: 'October 2024',
      amount: '$25.00',
      status: 'Paid',
    },
    {
      id: '3',
      month: 'September 2024',
      amount: '$25.00',
      status: 'Paid',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Billing</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Your Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Plan</Text>
          <LinearGradient
            colors={['#6A82FB', '#B472F9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.planCard}
          >
            <Text style={styles.planName}>Pro Plan</Text>
            <View style={styles.planPriceRow}>
              <Text style={styles.planPrice}>$25</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Next Payment */}
        <View style={styles.paymentDueCard}>
          <View style={styles.paymentDueContent}>
            <View style={styles.paymentDueInfo}>
              <Text style={styles.paymentDueTitle}>Next Payment</Text>
              <Text style={styles.paymentDueSubtitle}>$25 due on 24/12/2024</Text>
            </View>
            <TouchableOpacity style={styles.payNowButton}>
              <LinearGradient
                colors={['#6A82FB', '#B472F9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.payNowGradient}
              >
                <Text style={styles.payNowText}>Pay Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentIconContainer}>
            <View style={styles.paymentIconCircle}>
              <Ionicons name="card-outline" size={32} color={colors.primary[500]} />
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethodCard}>
              <View style={styles.paymentMethodInfo}>
                <Ionicons name={method.icon} size={32} color={colors.neutral[600]} />
                <View style={styles.paymentMethodText}>
                  <Text style={styles.paymentMethodName}>
                    {method.type} ending in {method.last4}
                  </Text>
                  <Text style={styles.paymentMethodExpiry}>Expires {method.expiry}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.neutral[500]} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addMethodButton}>
            <Ionicons name="add" size={20} color={colors.neutral[500]} />
            <Text style={styles.addMethodText}>Add New Method</Text>
          </TouchableOpacity>
        </View>

        {/* Billing History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing History</Text>
          {billingHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyInfo}>
                <View style={styles.historyIconContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#059669" />
                </View>
                <View>
                  <Text style={styles.historyMonth}>{item.month} Invoice</Text>
                  <Text style={styles.historyAmount}>
                    {item.amount} - {item.status}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="download-outline" size={20} color={colors.neutral[500]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.neutral[900],
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[10],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral[900],
    marginBottom: spacing[3],
  },
  planCard: {
    borderRadius: 16,
    padding: spacing[6],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing[2],
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planPeriod: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: spacing[1],
    marginBottom: spacing[1],
  },
  paymentDueCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[6],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentDueContent: {
    flex: 2,
  },
  paymentDueInfo: {
    marginBottom: spacing[4],
  },
  paymentDueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral[900],
    marginBottom: spacing[1],
  },
  paymentDueSubtitle: {
    fontSize: 14,
    color: colors.neutral[600],
  },
  payNowButton: {
    alignSelf: 'flex-start',
  },
  payNowGradient: {
    paddingHorizontal: spacing[4],
    paddingVertical: 10,
    borderRadius: 8,
  },
  payNowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paymentIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  paymentMethodText: {
    gap: spacing[1],
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  paymentMethodExpiry: {
    fontSize: 14,
    color: colors.neutral[600],
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.neutral[300],
    padding: spacing[4],
  },
  addMethodText: {
    fontSize: 16,
    color: colors.neutral[600],
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  historyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  historyAmount: {
    fontSize: 14,
    color: colors.neutral[600],
  },
});

export default BillingMainScreen;
