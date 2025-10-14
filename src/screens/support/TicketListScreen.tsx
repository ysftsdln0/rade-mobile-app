import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../components/common/AppCard';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { apiService } from '../../services/api';
import { SupportTicket } from '../../types';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

const statusStyles = {
  open: { label: 'Açık', color: COLORS.error.main },
  pending: { label: 'Bekliyor', color: COLORS.warning.main },
  resolved: { label: 'Çözüldü', color: COLORS.success.main },
  closed: { label: 'Kapalı', color: COLORS.gray500 },
} as const;

const priorityColor = {
  low: '#4CAF50',
  medium: '#FFC107',
  high: '#FF7043',
  urgent: '#F44336',
} as const;

const TicketListScreen: React.FC = () => {
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
        title="Biletler alınamadı"
        description="Lütfen tekrar deneyin."
      />
    );
  }

  const tickets = ticketsQuery.data || [];

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon="help-circle-outline"
        title="Aktif destek kaydı bulunmuyor"
        description="Yeni bir destek talebi oluşturduğunuzda burada listelenecek."
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {tickets.map((ticket) => {
        const status = statusStyles[ticket.status];
        return (
          <AppCard
            key={ticket.id}
            style={styles.card}
            onPress={() => navigation.navigate('TicketDetails', { ticketId: ticket.id })}
          >
            <View style={styles.headerRow}>
              <View style={styles.titleRow}>
                <View style={[styles.priorityDot, { backgroundColor: priorityColor[ticket.priority] }]} />
                <Text style={styles.subject}>{ticket.subject}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: `${status.color}20` }]}>
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="briefcase-outline" size={16} color={COLORS.gray500} />
                <Text style={styles.metaValue}>{ticket.department}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={COLORS.gray500} />
                <Text style={styles.metaValue}>{formatRelative(ticket.createdAt)}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.gray500} />
                <Text style={styles.metaValue}>Son yanıt: {formatRelative(ticket.lastReply)}</Text>
              </View>
            </View>
          </AppCard>
        );
      })}
    </ScrollView>
  );
};

const formatRelative = (date: string) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return d.toLocaleDateString('tr-TR');
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  subject: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1,
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
});

export default TicketListScreen;
