import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../components/common/AppCard';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { apiService } from '../../services/api';
import { SupportTicket } from '../../types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants';
import { AppHeader } from '../../components/common/AppHeader';

const SupportMainScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const ticketsQuery = useQuery({
    queryKey: ['supportTickets'],
    queryFn: async () => {
      const response = await apiService.getTickets();
      return response.data as SupportTicket[];
    },
  });

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

  const tickets = ticketsQuery.data || [];

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'open').length;
    const pending = tickets.filter((t) => t.status === 'pending').length;
    const resolved = tickets.filter((t) => t.status === 'resolved').length;
    return { total: tickets.length, open, pending, resolved };
  }, [tickets]);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showLogo={true} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Destek Merkezi</Text>
            <Text style={styles.subtitle}>Sorularınızı hızlıca iletin, ekibimiz yardımcı olsun.</Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateTicket')}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.createButtonText}>Yeni Bilet</Text>
          </TouchableOpacity>
        </View>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Durum Özeti</Text>
        <View style={styles.statsRow}>
          <StatBox label="Toplam" value={stats.total} color={COLORS.primary} />
          <StatBox label="Açık" value={stats.open} color={COLORS.error} />
          <StatBox label="Beklemede" value={stats.pending} color={COLORS.warning} />
          <StatBox label="Çözüldü" value={stats.resolved} color={COLORS.success} />
        </View>
      </AppCard>

      <AppCard style={styles.card} onPress={() => navigation.navigate('TicketList')}>
        <View style={styles.linkRow}>
          <View>
            <Text style={styles.linkTitle}>Bilet Listesi</Text>
            <Text style={styles.linkSubtitle}>Tüm destek taleplerinizi görüntüleyin</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.gray500} />
        </View>
      </AppCard>

      <AppCard style={styles.card} onPress={() => navigation.navigate('Chatbot')}>
        <View style={styles.linkRow}>
          <View>
            <Text style={styles.linkTitle}>Canlı Destek</Text>
            <Text style={styles.linkSubtitle}>Müşteri temsilcimizle anında sohbet edin</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.gray500} />
        </View>
      </AppCard>
    </ScrollView>
    </View>
  );
};

const StatBox: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <View style={[styles.statBox, { backgroundColor: `${color}15` }]}> 
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

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
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 24,
  },
  createButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZES.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  statLabel: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  linkSubtitle: {
    marginTop: 4,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});

export default SupportMainScreen;
