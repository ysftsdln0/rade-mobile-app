/**
 * TicketListScreen
 * 
 * Support ticket management screen showing:
 * - List of all support tickets
 * - Ticket status and priority
 * - Created and updated dates
 * - Ticket management actions
 * - Search by ticket number or subject
 */
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  DashboardHeader,
  Card,
  DataRow,
  Button,
  AlertBanner,
} from '../../components/common';
import { colors, spacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';

const formatDate = (date: string) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface Ticket {
  id: string;
  number: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  category: string;
}

// Mock data
const mockTickets: Ticket[] = [
  {
    id: 't1',
    number: '#1001',
    subject: 'Website not loading properly',
    status: 'open',
    priority: 'high',
    createdAt: '2025-10-15T10:30:00Z',
    updatedAt: '2025-10-17T14:20:00Z',
    category: 'Technical Support',
  },
  {
    id: 't2',
    number: '#1000',
    subject: 'Billing inquiry',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2025-10-10T08:00:00Z',
    updatedAt: '2025-10-16T11:45:00Z',
    category: 'Billing',
  },
  {
    id: 't3',
    number: '#999',
    subject: 'Domain renewal question',
    status: 'resolved',
    priority: 'low',
    createdAt: '2025-10-08T15:30:00Z',
    updatedAt: '2025-10-12T09:15:00Z',
    category: 'Domain',
  },
  {
    id: 't4',
    number: '#998',
    subject: 'Server down - critical issue',
    status: 'closed',
    priority: 'critical',
    createdAt: '2025-10-05T22:00:00Z',
    updatedAt: '2025-10-06T08:30:00Z',
    category: 'Server',
  },
];

const TicketListScreen = () => {
  const _navigation = useNavigation<any>();
  const { colors: themeColors } = useTheme();
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tickets = useMemo(() => {
    let list = mockTickets;
    
    // Filter by status
    if (filterStatus !== 'all') {
      list = list.filter((t) => t.status === filterStatus);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.number.toLowerCase().includes(query) ||
          t.subject.toLowerCase().includes(query)
      );
    }
    
    return list;
  }, [filterStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: mockTickets.length,
      open: mockTickets.filter((t) => t.status === 'open').length,
      inProgress: mockTickets.filter((t) => t.status === 'in-progress').length,
      resolved: mockTickets.filter((t) => t.status === 'resolved').length,
      closed: mockTickets.filter((t) => t.status === 'closed').length,
    };
  }, []);

  const statusConfig = {
    open: { color: 'offline' as const, label: 'Open' },
    'in-progress': { color: 'warning' as const, label: 'In Progress' },
    resolved: { color: 'online' as const, label: 'Resolved' },
    closed: { color: 'neutral' as const, label: 'Closed' },
  };

  const priorityConfig = {
    low: { label: 'Low', color: colors.semantic.success },
    medium: { label: 'Medium', color: colors.semantic.warning },
    high: { label: 'High', color: colors.semantic.error },
    critical: { label: 'Critical', color: '#ff3333' },
  };

  const handleReply = (ticket: Ticket) => {
    Alert.alert(
      'Reply to Ticket',
      `Reply to ticket ${ticket.number}: ${ticket.subject}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View Ticket',
          onPress: () => {
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <DashboardHeader
          title="Support Tickets"
          subtitle={`${stats.total} tickets total`}
        />

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputWrapper, { backgroundColor: themeColors.input, borderColor: themeColors.inputBorder }]}>
            <Ionicons name="search" size={20} color={themeColors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholder="Ticket ara..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={themeColors.textTertiary}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={themeColors.textTertiary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterChipsContainer}>
          {(['all', 'open', 'in-progress', 'resolved'] as const).map((status) => (
            <Pressable
              key={status}
              style={[
                styles.filterChip,
                { backgroundColor: themeColors.surfaceAlt, borderColor: themeColors.border },
                filterStatus === status && { backgroundColor: themeColors.primary, borderColor: themeColors.primary },
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: themeColors.textSecondary },
                  filterStatus === status && { color: '#FFFFFF' },
                ]}
              >
                {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Stats */}
        <Card title="Status Overview" variant="elevated">
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.semantic.error }]}>
                {stats.open}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Open</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.semantic.warning }]}>
                {stats.inProgress}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>In Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.semantic.success }]}>
                {stats.resolved}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Resolved</Text>
            </View>
          </View>
        </Card>

        {/* Filter */}
        <Card title="Filter" variant="default">
          <View style={styles.filterRow}>
            {(['all', 'open', 'in-progress', 'resolved'] as const).map((status) => (
              <Button
                key={status}
                label={status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                variant={filterStatus === status ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setFilterStatus(status)}
                style={styles.filterButton}
              />
            ))}
          </View>
        </Card>

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <Card title="No Tickets" variant="default">
            <AlertBanner
              type="info"
              title="No tickets"
              message={`No ${filterStatus} tickets found`}
              dismissible={false}
            />
          </Card>
        ) : (
          <>
            {tickets.map((ticket, _index) => {
              const status = statusConfig[ticket.status];
              const priority = priorityConfig[ticket.priority];

              return (
                <Card key={ticket.id} title={ticket.number} variant="default">
                  {/* Subject */}
                  <Text style={styles.subject}>{ticket.subject}</Text>

                  {/* Category and Priority */}
                  <View style={styles.tagRow}>
                    <View
                      style={[styles.tag, { backgroundColor: colors.primary[100] }]}
                    >
                      <Text style={[styles.tagText, { color: colors.primary[700] }]}>
                        {ticket.category}
                      </Text>
                    </View>
                    <View
                      style={[styles.tag, { backgroundColor: priority.color + '20' }]}
                    >
                      <Text style={[styles.tagText, { color: priority.color }]}>
                        {priority.label}
                      </Text>
                    </View>
                  </View>

                  {/* Status and Dates */}
                  <DataRow
                    label="Status"
                    value={status.label}
                    status={status.color}
                    divider
                  />
                  <DataRow
                    label="Created"
                    value={formatDate(ticket.createdAt)}
                    status="neutral"
                    divider
                  />
                  <DataRow
                    label="Updated"
                    value={formatDate(ticket.updatedAt)}
                    status="neutral"
                    divider={false}
                  />

                  {/* Actions */}
                  <View style={styles.actionsContainer}>
                    {ticket.status !== 'closed' && (
                      <Button
                        label="Reply"
                        variant="primary"
                        size="sm"
                        onPress={() => handleReply(ticket)}
                        style={styles.actionButton}
                      />
                    )}
                    <Button
                      label="View"
                      variant="secondary"
                      size="sm"
                      onPress={() => {
                      }}
                      style={styles.actionButton}
                    />
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {/* Create Ticket CTA */}
        <Card title="New Ticket" variant="default">
          <Button
            label="Create Support Ticket"
            variant="primary"
            size="md"
            onPress={() => {
            }}
            style={styles.fullWidthButton}
          />
        </Card>

        {/* Spacer */}
        <View style={styles.spacer} />
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
    paddingBottom: spacing[6],
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    height: 50,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
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
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing[3],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  filterButton: {
    flex: 1,
    minWidth: 75,
  },
  subject: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing[2],
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[3],
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  actionButton: {
    flex: 1,
  },
  fullWidthButton: {
    width: '100%',
  },
  spacer: {
    height: spacing[6],
  },
});

export default TicketListScreen;
