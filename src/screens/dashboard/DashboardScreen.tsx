import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../store";
import { apiService } from "../../services/api";
import { transformToTimelineEvents } from "../../utils/activityHelpers";
import { useLanguage } from "../../utils/LanguageContext";
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
import { colors, spacing } from "../../styles";
import { HostingPackage, ActivityItem } from "../../types";

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector((state) => state.auth);
  const { t, language } = useLanguage();

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
    if (hour < 12) return language === 'tr' ? "Günaydın" : "Good Morning";
    if (hour < 18) return language === 'tr' ? "İyi Günler" : "Good Afternoon";
    return language === 'tr' ? "İyi Akşamlar" : "Good Evening";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Page Header - Figma Design */}
        <View style={styles.customHeader}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {user?.firstName || "User"}!
          </Text>
          <Text style={styles.overviewText}>
            {language === 'tr' 
              ? "Hesabınızın hızlı bir özeti." 
              : "Here's a quick overview of your account."}
          </Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <View
              style={[
                styles.metricIcon,
                { backgroundColor: colors.primary[100] },
              ]}
            >
              <Ionicons
                name="globe-outline"
                size={24}
                color={colors.primary[500]}
              />
            </View>
            <Text style={styles.metricValue}>{hostingCount + 12}</Text>
            <Text style={styles.metricLabel}>
              {language === 'tr' ? 'Toplam Web Siteleri' : 'Total Websites'}
            </Text>
          </View>

          <View style={styles.metricBox}>
            <View style={[styles.metricIcon, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.metricValue}>99.9%</Text>
            <Text style={styles.metricLabel}>
              {language === 'tr' ? 'Çalışma Süresi' : 'Uptime'}
            </Text>
          </View>

          <View style={styles.metricBox}>
            <View style={[styles.metricIcon, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="help-circle-outline" size={24} color="#FF9800" />
            </View>
            <Text style={styles.metricValue}>2</Text>
            <Text style={styles.metricLabel}>
              {language === 'tr' ? 'Destek Talepleri' : 'Support Tickets'}
            </Text>
          </View>
        </View>

        {/* My Services Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>
            {language === 'tr' ? 'Hizmetlerim' : 'My Services'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <MetricCard
              label={language === 'tr' ? 'Aktif Paketler' : 'Active Packages'}
              value={activeCount}
              status={activeCount > 0 ? "online" : "offline"}
              style={styles.horizontalMetricCard}
            />
            <MetricCard
              label={language === 'tr' ? 'Toplam Hizmetler' : 'Total Services'}
              value={hostingCount}
              change={hostingCount > 0 ? 5 : 0}
              style={styles.horizontalMetricCard}
            />
            <MetricCard
              label={language === 'tr' ? 'Çalışma Süresi' : 'Uptime'}
              value="99.9%"
              status="online"
              style={styles.horizontalMetricCard}
            />
            <MetricCard
              label={language === 'tr' ? 'Kullanılan Depolama' : 'Storage Used'}
              value="150 GB"
              change={12}
              style={styles.horizontalMetricCard}
            />
          </ScrollView>
        </View>

        {/* Quick Services Summary */}
        {hostingCount > 0 && (
          <Card title={language === 'tr' ? 'Hizmetleriniz' : 'Your Services'} variant="default">
            {hostingQuery.data?.slice(0, 3).map((hosting) => (
              <DataRow
                key={hosting.id}
                label={hosting.name}
                value={hosting.status}
                status={hosting.status === "active" ? "online" : "offline"}
                secondary={
                  hosting.expiryDate
                    ? `${language === 'tr' ? 'Bitiş' : 'Expires'}: ${new Date(hosting.expiryDate).toLocaleDateString()}`
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
                label={language === 'tr' 
                  ? `Tüm ${hostingCount} Hizmeti Görüntüle` 
                  : `View All ${hostingCount} Services`}
                variant="secondary"
                size="sm"
                onPress={() => navigation.navigate("Services")}
              />
            )}
          </Card>
        )}

        <Card title={language === 'tr' ? 'Sistem Durumu' : 'System Health'} variant="elevated">
          <View style={styles.healthSection}>
            <View style={styles.healthRow}>
              <View style={styles.healthLabel}>
                <Text style={styles.healthText}>
                  {language === 'tr' ? 'Sunucu Durumu' : 'Server Status'}
                </Text>
              </View>
              <Badge 
                label={language === 'tr' ? 'Çalışıyor' : 'Operational'} 
                variant="success" 
              />
            </View>
            <View style={styles.healthMetric}>
              <Text style={styles.healthMetricLabel}>
                {language === 'tr' ? 'Sistem Yükü' : 'System Load'}
              </Text>
              <Progress progress={65} showLabel variant="linear" />
            </View>
            <View style={styles.healthMetric}>
              <Text style={styles.healthMetricLabel}>
                {language === 'tr' ? 'Disk Kullanımı' : 'Disk Usage'}
              </Text>
              <Progress progress={45} showLabel variant="linear" />
            </View>
            <DataRow
              label={language === 'tr' ? 'Çalışan Hizmetler' : 'Services Running'}
              value={`${hostingCount + 2}`}
              secondary={language === 'tr' 
                ? 'Tüm hizmetler çalışıyor' 
                : 'All services operational'}
              divider={false}
            />
          </View>
        </Card>

        {timelineEvents.length > 0 && (
          <Card title={language === 'tr' ? 'Son Aktiviteler' : 'Recent Activity'} variant="default">
            <Timeline events={timelineEvents.slice(0, 5)} />
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <View style={styles.buttonRow}>
            <Button
              label={language === 'tr' ? 'Hizmetleri Yönet' : 'Manage Services'}
              variant="primary"
              onPress={() => navigation.navigate("Services")}
              fullWidth
            />
          </View>
          <View style={styles.buttonRow}>
            <Button
              label={language === 'tr' ? 'Faturaları Görüntüle' : 'View Invoices'}
              variant="secondary"
              onPress={() =>
                navigation.navigate("Account", { screen: "InvoiceList" })
              }
              style={styles.halfButton}
            />
            <Button
              label={language === 'tr' ? 'Destek' : 'Support'}
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
    backgroundColor: "#FAFAFA",
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
    color: colors.neutral[900],
    marginBottom: spacing[1],
  },
  overviewText: {
    fontSize: 16,
    color: colors.neutral[600],
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
    backgroundColor: "#FFFFFF",
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
    color: colors.neutral[900],
    marginBottom: spacing[1],
  },
  metricLabel: {
    fontSize: 12,
    color: colors.neutral[600],
    textAlign: "center",
  },
  servicesSection: {
    paddingHorizontal: spacing[5],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.neutral[900],
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
  healthSection: {
    gap: spacing[4],
  },
  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  healthLabel: {
    flex: 1,
  },
  healthText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.neutral[700],
  },
  healthMetric: {
    gap: spacing[2],
  },
  healthMetricLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.neutral[600],
  },
  // Unused styles - might need later
  // loadingContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
});

export default DashboardScreen;
