import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../components/common/AppCard";
import { LoadingState } from "../../components/common/LoadingState";
import { EmptyState } from "../../components/common/EmptyState";
import { apiService } from "../../services/api";
import { SupportTicket } from "../../types";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../../constants";
import { AppHeader } from "../../components/common/AppHeader";
import { useTheme } from "../../utils/ThemeContext";

const SupportMainScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors: themeColors } = useTheme();

  const ticketsQuery = useQuery({
    queryKey: ["supportTickets"],
    queryFn: async () => {
      const response = await apiService.getTickets();
      return response.data as SupportTicket[];
    },
  });

  const tickets = ticketsQuery.data || [];

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === "open").length;
    const pending = tickets.filter((t) => t.status === "pending").length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;
    return { total: tickets.length, open, pending, resolved };
  }, [tickets]);

  if (ticketsQuery.isLoading) {
    return <LoadingState message="Destek kayıtları yükleniyor..." />;
  }

  if (ticketsQuery.isError) {
    return (
      <EmptyState
        icon="warning-outline"
        title="Destek bilgileri alınamadı"
        description="Lütfen tekrar deneyin."
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <AppHeader showLogo={true} />
      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        contentContainerStyle={styles.content}
      >
        <AppCard style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.title, { color: themeColors.text }]}>
                Destek Merkezi
              </Text>
              <Text
                style={[styles.subtitle, { color: themeColors.textSecondary }]}
              >
                Sorularınızı hızlıca iletin, ekibimiz yardımcı olsun.
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.createButton,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={() => navigation.navigate("CreateTicket")}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Yeni Bilet</Text>
            </TouchableOpacity>
          </View>
        </AppCard>

        <AppCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Durum Özeti
          </Text>
          <View style={styles.statsRow}>
            <StatBox
              label="Toplam"
              value={stats.total}
              color={themeColors.primary}
            />
            <StatBox
              label="Açık"
              value={stats.open}
              color={COLORS.error.main}
            />
            <StatBox
              label="Beklemede"
              value={stats.pending}
              color={COLORS.warning.main}
            />
            <StatBox
              label="Çözüldü"
              value={stats.resolved}
              color={COLORS.success.main}
            />
          </View>
        </AppCard>

        <AppCard
          style={styles.card}
          onPress={() => navigation.navigate("TicketList")}
        >
          <View style={styles.linkRow}>
            <View>
              <Text style={[styles.linkTitle, { color: themeColors.text }]}>
                Bilet Listesi
              </Text>
              <Text
                style={[
                  styles.linkSubtitle,
                  { color: themeColors.textSecondary },
                ]}
              >
                Tüm destek taleplerinizi görüntüleyin
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={themeColors.textSecondary}
            />
          </View>
        </AppCard>

        <AppCard
          style={styles.card}
          onPress={() => navigation.navigate("Chatbot")}
        >
          <View style={styles.linkRow}>
            <View>
              <Text style={[styles.linkTitle, { color: themeColors.text }]}>
                Canlı Destek
              </Text>
              <Text
                style={[
                  styles.linkSubtitle,
                  { color: themeColors.textSecondary },
                ]}
              >
                Müşteri temsilcimizle anında sohbet edin
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={themeColors.textSecondary}
            />
          </View>
        </AppCard>
      </ScrollView>
    </View>
  );
};

const StatBox: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => {
  const { colors: themeColors } = useTheme();
  return (
    <View style={[styles.statBox, { backgroundColor: `${color}15` }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
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
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 24,
  },
  createButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: FONT_SIZES.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginHorizontal: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
  },
  statLabel: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZES.xs,
    textTransform: "uppercase",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  linkSubtitle: {
    marginTop: 4,
    fontSize: FONT_SIZES.sm,
  },
});

export default SupportMainScreen;
