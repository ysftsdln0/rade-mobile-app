import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../styles";
import { useLanguage } from "../../utils/LanguageContext";
import { useTheme } from "../../utils/ThemeContext";

type Props = {
  navigation?: any;
};

const BillingMainScreen = ({ navigation: _navigation }: Props) => {
  const { t } = useLanguage();
  const { colors: themeColors, isDark } = useTheme();

  const paymentMethods = [
    {
      id: "1",
      type: "Visa",
      last4: "1234",
      expiry: "06/25",
      icon: "card" as const,
    },
    {
      id: "2",
      type: "Mastercard",
      last4: "5678",
      expiry: "08/26",
      icon: "card" as const,
    },
  ];

  const billingHistory = [
    {
      id: "1",
      month: "November 2024",
      amount: "$25.00",
      status: "Paid",
    },
    {
      id: "2",
      month: "October 2024",
      amount: "$25.00",
      status: "Paid",
    },
    {
      id: "3",
      month: "September 2024",
      amount: "$25.00",
      status: "Paid",
    },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
    >
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            {t.billing.title}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Your Plan */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {t.billing.yourPlan}
            </Text>
            <View
              style={[
                styles.planCard,
                { backgroundColor: themeColors.primary },
              ]}
            >
              <Text style={styles.planName}>{t.billing.proPlan}</Text>
              <View style={styles.planPriceRow}>
                <Text style={styles.planPrice}>$25</Text>
                <Text style={styles.planPeriod}>{t.billing.perMonth}</Text>
              </View>
            </View>
          </View>

          {/* Next Payment */}
          <View
            style={[
              styles.paymentDueCard,
              { backgroundColor: themeColors.surface },
            ]}
          >
            <View style={styles.paymentDueContent}>
              <View style={styles.paymentDueInfo}>
                <Text
                  style={[styles.paymentDueTitle, { color: themeColors.text }]}
                >
                  {t.billing.nextPayment}
                </Text>
                <Text
                  style={[
                    styles.paymentDueSubtitle,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {t.billing.dueOn
                    .replace("{amount}", "$25")
                    .replace("{date}", "24/12/2024")}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.payNowButton,
                  { backgroundColor: themeColors.primary },
                ]}
              >
                <View style={styles.payNowGradient}>
                  <Text style={styles.payNowText}>{t.invoices.payNow}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.paymentIconContainer}>
              <View
                style={[
                  styles.paymentIconCircle,
                  {
                    backgroundColor: isDark
                      ? themeColors.surfaceAlt
                      : "#E0F2FE",
                  },
                ]}
              >
                <Ionicons
                  name="card-outline"
                  size={32}
                  color={themeColors.primary}
                />
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {t.billing.paymentMethods}
            </Text>
            {paymentMethods.map((method) => (
              <View
                key={method.id}
                style={[
                  styles.paymentMethodCard,
                  { backgroundColor: themeColors.surface },
                ]}
              >
                <View style={styles.paymentMethodInfo}>
                  <Ionicons
                    name={method.icon}
                    size={32}
                    color={themeColors.textSecondary}
                  />
                  <View style={styles.paymentMethodText}>
                    <Text
                      style={[
                        styles.paymentMethodName,
                        { color: themeColors.text },
                      ]}
                    >
                      {t.billing.endingIn
                        .replace("{type}", method.type)
                        .replace("{last4}", method.last4)}
                    </Text>
                    <Text
                      style={[
                        styles.paymentMethodExpiry,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {t.billing.expires.replace("{expiry}", method.expiry)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color={themeColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={[
                styles.addMethodButton,
                { backgroundColor: themeColors.surface },
              ]}
            >
              <Ionicons
                name="add"
                size={20}
                color={themeColors.textSecondary}
              />
              <Text
                style={[
                  styles.addMethodText,
                  { color: themeColors.textSecondary },
                ]}
              >
                {t.billing.addNewMethod}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Billing History */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {t.billing.billingHistory}
            </Text>
            {billingHistory.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.historyCard,
                  { backgroundColor: themeColors.surface },
                ]}
              >
                <View style={styles.historyInfo}>
                  <View style={styles.historyIconContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#059669"
                    />
                  </View>
                  <View>
                    <Text
                      style={[styles.historyMonth, { color: themeColors.text }]}
                    >
                      {t.billing.invoice.replace("{month}", item.month)}
                    </Text>
                    <Text
                      style={[
                        styles.historyAmount,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {t.billing.paidStatus
                        .replace("{amount}", item.amount)
                        .replace("{status}", item.status)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name="download-outline"
                    size={20}
                    color={themeColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
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
    fontWeight: "700",
    marginBottom: spacing[3],
  },
  planCard: {
    borderRadius: 16,
    padding: spacing[6],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: spacing[2],
  },
  planPriceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  planPrice: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  planPeriod: {
    fontSize: 18,
    fontWeight: "500",
    color: "#FFFFFF",
    marginLeft: spacing[1],
    marginBottom: spacing[1],
  },
  paymentDueCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[6],
    shadowColor: "#000",
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
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  paymentDueSubtitle: {
    fontSize: 14,
  },
  payNowButton: {
    alignSelf: "flex-start",
  },
  payNowGradient: {
    paddingHorizontal: spacing[4],
    paddingVertical: 10,
    borderRadius: 8,
  },
  payNowText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  paymentIconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[3],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentMethodInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  paymentMethodText: {
    gap: spacing[1],
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: "600",
  },
  paymentMethodExpiry: {
    fontSize: 14,
  },
  addMethodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.neutral[300],
    padding: spacing[4],
  },
  addMethodText: {
    fontSize: 16,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[3],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  historyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  historyMonth: {
    fontSize: 16,
    fontWeight: "600",
  },
  historyAmount: {
    fontSize: 14,
  },
});

export default BillingMainScreen;
