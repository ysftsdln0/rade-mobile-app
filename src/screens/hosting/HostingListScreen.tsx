import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AppCard from "../../components/common/AppCard";
import { LoadingState } from "../../components/common/LoadingState";
import { EmptyState } from "../../components/common/EmptyState";
import {
  AnimatedListItem,
  SwipeableRow,
  AnimatedRefreshControl,
  LongPressMenu,
  MenuAction,
} from "../../components/common";
import { HostingListSkeleton } from "./HostingListSkeleton";
import { apiService } from "../../services/api";
import { HostingPackage } from "../../types";
import { COLORS, FONT_SIZES, SPACING } from "../../constants";
import { useTheme } from "../../utils/ThemeContext";
import { useToast } from "../../utils/ToastContext";
import { useLanguage } from "../../utils/LanguageContext";
import { colors } from "../../styles";

const statusMeta = {
  active: { label: "Aktif", color: COLORS.success.main },
  suspended: { label: "Askıda", color: COLORS.warning.main },
  expired: { label: "Süresi Dolmuş", color: COLORS.error.main },
  pending: { label: "Beklemede", color: COLORS.info.main },
} as const;

const packageLabel = {
  shared: "Shared Hosting",
  vps: "VPS",
  dedicated: "Dedicated",
} as const;

const HostingListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors: themeColors } = useTheme();
  const { success, error: showError } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const hostingQuery = useQuery({
    queryKey: ["hostingPackages"],
    queryFn: async () => {
      const response = await apiService.getHostingPackages();
      return response.data as HostingPackage[];
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await hostingQuery.refetch();
    setRefreshing(false);
  };

  const handleRenew = (item: HostingPackage) => {
    Alert.alert("Renew Hosting", `Renew ${item.name} for another year?`, [
      { text: t.common.cancel, style: "cancel" },
      {
        text: "Renew",
        onPress: () => {
          // Simulate API call
          success(`${item.name} renewed successfully!`);
        },
      },
    ]);
  };

  const handleDelete = (item: HostingPackage) => {
    Alert.alert(
      "Delete Hosting",
      `Are you sure you want to delete ${item.name}? This action cannot be undone.`,
      [
        { text: t.common.cancel, style: "cancel" },
        {
          text: t.common.delete,
          style: "destructive",
          onPress: () => {
            // Simulate API call
            showError(`${item.name} deleted`);
            // Invalidate query to refresh list
            queryClient.invalidateQueries({ queryKey: ["hostingPackages"] });
          },
        },
      ]
    );
  };

  if (hostingQuery.isLoading) {
    return <HostingListSkeleton />;
  }

  if (hostingQuery.isError) {
    return (
      <EmptyState
        icon="warning-outline"
        title="Hosting paketleri alınamadı"
        description="Lütfen bağlantınızı kontrol ederek tekrar deneyin."
      />
    );
  }

  const packages = hostingQuery.data || [];

  if (packages.length === 0) {
    return (
      <EmptyState
        icon="server-outline"
        title="Henüz hosting paketiniz yok"
        description="Yeni bir paket satın aldıktan sonra bu alanda listelenecek."
      />
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <AnimatedRefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary[500]}
        />
      }
    >
      {packages.map((item, index) => {
        const status = statusMeta[item.status] ?? statusMeta.pending;

        // Long press menu actions
        const menuActions: MenuAction[] = [
          {
            icon: "information-circle-outline",
            label: "View Details",
            onPress: () =>
              navigation.navigate("HostingDetails", { hostingId: item.id }),
          },
          {
            icon: "refresh-outline",
            label: "Renew Package",
            onPress: () => handleRenew(item),
          },
          {
            icon: "settings-outline",
            label: "Manage",
            onPress: () => success("Manage feature coming soon!"),
          },
          {
            icon: "trash-outline",
            label: "Delete",
            onPress: () => handleDelete(item),
            destructive: true,
          },
        ];

        return (
          <AnimatedListItem key={item.id} index={index}>
            <LongPressMenu actions={menuActions}>
              <SwipeableRow
                rightActions={[
                  {
                    icon: "refresh-outline",
                    label: "Renew",
                    color: "#fff",
                    backgroundColor: colors.semantic.info,
                    onPress: () => handleRenew(item),
                  },
                  {
                    icon: "trash-outline",
                    label: "Delete",
                    color: "#fff",
                    backgroundColor: colors.semantic.error,
                    onPress: () => handleDelete(item),
                  },
                ]}
              >
                <AppCard
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("HostingDetails", {
                      hostingId: item.id,
                    })
                  }
                >
                  <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: themeColors.text }]}>
                      {item.name}
                    </Text>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: `${status.color}20` },
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.domain,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {item.domain}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text
                      style={[
                        styles.metaLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Paket Türü
                    </Text>
                    <Text
                      style={[styles.metaValue, { color: themeColors.text }]}
                    >
                      {packageLabel[item.packageType] ?? item.packageType}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text
                      style={[
                        styles.metaLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Disk Kullanımı
                    </Text>
                    <Text
                      style={[styles.metaValue, { color: themeColors.text }]}
                    >
                      {item.diskUsage} / {item.diskLimit} GB
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text
                      style={[
                        styles.metaLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Bant Genişliği
                    </Text>
                    <Text
                      style={[styles.metaValue, { color: themeColors.text }]}
                    >
                      {item.bandwidthUsage} / {item.bandwidthLimit} GB
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text
                      style={[
                        styles.metaLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Bitiş Tarihi
                    </Text>
                    <Text
                      style={[styles.metaValue, { color: themeColors.text }]}
                    >
                      {formatDate(item.expiryDate)}
                    </Text>
                  </View>
                </AppCard>
              </SwipeableRow>
            </LongPressMenu>
          </AnimatedListItem>
        );
      })}
    </ScrollView>
  );
};

const formatDate = (date: string) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
  },
  domain: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 24,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
  },
  metaLabel: {
    fontSize: FONT_SIZES.sm,
  },
  metaValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
  },
});

export default HostingListScreen;
