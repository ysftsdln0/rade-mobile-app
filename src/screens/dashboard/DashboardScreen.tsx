import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../store";
import { apiService } from "../../services/api";
import { transformToTimelineEvents } from "../../utils/activityHelpers";
import { useLanguage } from "../../utils/LanguageContext";
import { useTheme } from "../../utils/ThemeContext";
import {
  DashboardHeader,
  Card,
  MetricCard,
  DataRow,
  AlertBanner,
  Timeline,
  Button,
  Badge,
  Progress,
} from "../../components/common";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { colors, spacing } from "../../styles";
import { HostingPackage, ActivityItem } from "../../types";

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector((state) => state.auth);
  const { t, language } = useLanguage();
  const { colors: themeColors, isDark } = useTheme();

  const hostingQuery = useQuery({
    queryKey: ["hostingPackages"],
    queryFn: async () => {
      const res = await apiService.getHostingPackages();
      return res.data as HostingPackage[];
    },
    enabled: !!user,
  });

  const activityQuery = useQuery({
    queryKey: ["recentActivities"],
    queryFn: async () => {
      const res = await apiService.getRecentActivities();
      return res.data as ActivityItem[];
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });

  const timelineEvents = useMemo(() => {
    return transformToTimelineEvents(activityQuery.data || []);
  }, [activityQuery.data]);

  const hostingCount = hostingQuery.data?.length || 0;
  const activeCount =
    hostingQuery.data?.filter((h) => h.status === "active").length || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.goodMorning;
    if (hour < 18) return t.dashboard.goodAfternoon;
    return t.dashboard.goodEvening;
  };

  // Show skeleton while loading
  if (hostingQuery.isLoading || activityQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Page Header - Figma Design */}
        <View style={styles.customHeader}>
          <Text style={[styles.greetingText, { color: themeColors.text }]}>
            {getGreeting()}, {user?.firstName || t.dashboard.user}!
          </Text>
          <Text
            style={[styles.overviewText, { color: themeColors.textSecondary }]}
          >
            {t.dashboard.accountOverview}
          </Text>
        </View>

        <View style={styles.metricsRow}>
          <View
            style={[styles.metricBox, { backgroundColor: themeColors.card }]}
          >
            <View
              style={[
                styles.metricIcon,
                {
                  backgroundColor: isDark
                    ? themeColors.surfaceAlt
                    : colors.primary[100],
                },
              ]}
            >
              <Ionicons
                name="globe-outline"
                size={24}
                color={themeColors.primary}
              />
            </View>
            <Text style={[styles.metricValue, { color: themeColors.text }]}>
              {hostingCount + 12}
            </Text>
            <Text
              style={[styles.metricLabel, { color: themeColors.textSecondary }]}
            >
              {t.dashboard.totalWebsites}
            </Text>
          </View>

          <View
            style={[styles.metricBox, { backgroundColor: themeColors.card }]}
          >
            <View
              style={[
                styles.metricIcon,
                {
                  backgroundColor: isDark ? themeColors.surfaceAlt : "#E8F5E9",
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={[styles.metricValue, { color: themeColors.text }]}>
              99.9%
            </Text>
            <Text
              style={[styles.metricLabel, { color: themeColors.textSecondary }]}
            >
              {t.dashboard.uptime}
            </Text>
          </View>

          <View
            style={[styles.metricBox, { backgroundColor: themeColors.card }]}
          >
            <View
              style={[
                styles.metricIcon,
                {
                  backgroundColor: isDark ? themeColors.surfaceAlt : "#FFF3E0",
                },
              ]}
            >
              <Ionicons name="help-circle-outline" size={24} color="#FF9800" />
            </View>
            <Text style={[styles.metricValue, { color: themeColors.text }]}>
              2
            </Text>
            <Text
              style={[styles.metricLabel, { color: themeColors.textSecondary }]}
            >
              {t.dashboard.supportTickets}
            </Text>
          </View>
        </View>

        {/* My Services Section */}
        <View style={styles.servicesSection}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            {t.dashboard.myServices}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <MetricCard
              label={t.dashboard.activePackages}
              value={activeCount}
              status={activeCount > 0 ? "online" : "offline"}
              style={styles.horizontalMetricCard}
            />
            <MetricCard
              label={t.dashboard.totalServices}
              value={hostingCount}
              change={hostingCount > 0 ? 5 : 0}
              style={styles.horizontalMetricCard}
            />
            <MetricCard
              label={t.dashboard.uptime}
              value="99.9%"
              status="online"
              style={styles.horizontalMetricCard}
            />
            <MetricCard
              label={t.dashboard.storageUsed}
              value="150 GB"
              change={12}
              style={styles.horizontalMetricCard}
            />
          </ScrollView>
        </View>

        {/* Quick Services Summary */}
        {hostingCount > 0 && (
          <Card title={t.dashboard.yourServices} variant="default">
            {hostingQuery.data?.slice(0, 3).map((hosting) => (
              <DataRow
                key={hosting.id}
                label={hosting.name}
                value={hosting.status}
                status={hosting.status === "active" ? "online" : "offline"}
                secondary={
                  hosting.expiryDate
                    ? `${t.dashboard.expires}: ${new Date(hosting.expiryDate).toLocaleDateString()}`
                    : ""
                }
                divider
                onPress={() =>
                  navigation.navigate("Services", { screen: "HostingDetails" })
                }
              />
            ))}
            {hostingCount > 3 && (
              <Button
                label={t.dashboard.viewAllServices.replace(
                  "{count}",
                  hostingCount.toString()
                )}
                variant="secondary"
                size="sm"
                onPress={() => navigation.navigate("Services")}
              />
            )}
          </Card>
        )}

        <View style={styles.systemHealthContainer}>
          <Card
            title={t.dashboard.systemHealth}
            variant="elevated"
            style={styles.compactCard}
          >
            <View style={styles.healthSection}>
              <View style={styles.healthRow}>
                <View style={styles.healthLabel}>
                  <Text
                    style={[
                      styles.healthText,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {t.dashboard.serverStatus}
                  </Text>
                </View>
                <Badge label={t.dashboard.operational} variant="success" />
              </View>
              <View style={styles.healthMetric}>
                <Text
                  style={[
                    styles.healthMetricLabel,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {t.dashboard.systemLoad}
                </Text>
                <Progress progress={65} showLabel variant="linear" />
              </View>
              <View style={styles.healthMetric}>
                <Text
                  style={[
                    styles.healthMetricLabel,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {t.dashboard.diskUsage}
                </Text>
                <Progress progress={45} showLabel variant="linear" />
              </View>
              <DataRow
                label={t.dashboard.servicesRunning}
                value={`${hostingCount + 2}`}
                secondary={t.dashboard.allServicesOperational}
                divider={false}
              />
            </View>
          </Card>
        </View>

        {timelineEvents.length > 0 && (
          <Card title={t.dashboard.recentActivity} variant="default">
            <Timeline events={timelineEvents.slice(0, 5)} />
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <View style={styles.buttonRow}>
            <Button
              label={t.dashboard.manageServices}
              variant="primary"
              onPress={() => navigation.navigate("Services")}
              fullWidth
            />
          </View>
          <View style={styles.buttonRow}>
            <Button
              label={t.dashboard.viewInvoices}
              variant="secondary"
              onPress={() =>
                navigation.navigate("Account", { screen: "InvoiceList" })
              }
              style={styles.halfButton}
            />
            <Button
              label={t.dashboard.support}
              variant="secondary"
              onPress={() => navigation.navigate("Support")}
              style={styles.halfButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[10],
  },
  customHeader: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  overviewText: {
    fontSize: 16,
  },
  metricsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing[5],
    gap: spacing[3],
    marginBottom: spacing[6],
    // Old style with marginRight instead of gap - keeping for older RN versions
    // marginRight: -spacing[3],
  },
  metricBox: {
    flex: 1,
    borderRadius: 16,
    padding: spacing[4],
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  metricLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  servicesSection: {
    paddingHorizontal: spacing[5],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing[4],
  },
  horizontalMetricsContainer: {
    marginVertical: spacing[3],
  },
  horizontalScroll: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  horizontalMetricCard: {
    minWidth: 160,
    marginRight: spacing[2],
  },
  metricsGrid: {
    flexDirection: "row",
    gap: spacing[3],
    marginHorizontal: -spacing[4],
  },
  actionsSection: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    marginTop: spacing[4],
    marginBottom: spacing[6],
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  halfButton: {
    flex: 1,
  },
  systemHealthContainer: {
    marginTop: spacing[5],
    paddingHorizontal: spacing[5],
  },
  healthSection: {
    gap: spacing[2],
  },
  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[1],
  },
  healthLabel: {
    flex: 1,
  },
  healthText: {
    fontSize: 12,
    fontWeight: "500",
  },
  healthMetric: {
    gap: spacing[1],
  },
  healthMetricLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  compactCard: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  // Unused styles - might need later
  // loadingContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
});

export default DashboardScreen;
