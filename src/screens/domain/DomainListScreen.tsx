/**
 * DomainListScreen
 * 
 * Domain management screen showing:
 * - List of all domains with status
 * - Expiry dates and renewal options
 * - DNS settings access
 * - Domain management actions
 * - Search by domain name
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
  SearchBar,
  FilterTabs,
  FloatingActionButton,
} from '../../components/common';
import { colors, spacing } from '../../styles';

const formatDate = (date: string) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'expiring' | 'expired';
  expiryDate: string;
  registrar: string;
  autoRenewal: boolean;
  price: number;
  currency: string;
}

// Mock data
const mockDomains: Domain[] = [
  {
    id: 'd1',
    name: 'example.com',
    status: 'active',
    expiryDate: '2026-05-15',
    registrar: 'GoDaddy',
    autoRenewal: true,
    price: 12.99,
    currency: 'USD',
  },
  {
    id: 'd2',
    name: 'mysite.org',
    status: 'expiring',
    expiryDate: '2025-11-20',
    registrar: 'Namecheap',
    autoRenewal: false,
    price: 8.99,
    currency: 'USD',
  },
];

const DomainListScreen = () => {
  const navigation = useNavigation<any>();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const domains = useMemo(() => {
    let list = mockDomains;
    
    // Filter by status
    if (filterStatus !== 'all') {
      list = list.filter((d) => d.status === filterStatus);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(query)
      );
    }
    
    return list;
  }, [filterStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: mockDomains.length,
      active: mockDomains.filter((d) => d.status === 'active').length,
      expiring: mockDomains.filter((d) => d.status === 'expiring').length,
      expired: mockDomains.filter((d) => d.status === 'expired').length,
    };
  }, []);

  const statusConfig = {
    active: { color: 'online' as const, label: 'Active' },
    expiring: { color: 'warning' as const, label: 'Expiring' },
    expired: { color: 'offline' as const, label: 'Expired' },
  };

  const handleRenew = (domain: Domain) => {
    Alert.alert(
      'Renew Domain',
      `Renew ${domain.name} for another year?\n\nCost: $${domain.price.toFixed(2)} ${domain.currency}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Renew',
          onPress: () => {
            Alert.alert('Success', 'Domain renewed successfully!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Domains</Text>
          <Text style={styles.headerSubtitle}>Manage your domain portfolio</Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search domains..."
        />

        {/* Filter Tabs */}
        <FilterTabs
          tabs={[
            { id: 'all', label: 'All', count: stats.total },
            { id: 'active', label: 'Active', count: stats.active },
            { id: 'expiring', label: 'Expiring Soon', count: stats.expiring },
            { id: 'expired', label: 'Expired', count: stats.expired },
          ]}
          activeTab={filterStatus}
          onTabChange={(tabId) => setFilterStatus(tabId as typeof filterStatus)}
        />

        {/* Stats */}
        <Card title="Summary" variant="elevated">
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.active}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.semantic.warning }]}>
                {stats.expiring}
              </Text>
              <Text style={styles.statLabel}>Expiring</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.semantic.error }]}>
                {stats.expired}
              </Text>
              <Text style={styles.statLabel}>Expired</Text>
            </View>
          </View>
        </Card>

        {/* Domains List */}
        {domains.length === 0 ? (
          <Card title="No Domains" variant="default">
            <AlertBanner
              type="info"
              title="No domains"
              message={`No ${filterStatus} domains found`}
              dismissible={false}
            />
          </Card>
        ) : (
          <Card title={`${domains.length} Domain${domains.length !== 1 ? 's' : ''}`} variant="default">
            {domains.map((domain, index) => {
              const status = statusConfig[domain.status];
              return (
                <View key={domain.id}>
                  <DataRow
                    label={domain.name}
                    value={domain.registrar}
                    secondary={`Expires: ${formatDate(domain.expiryDate)}`}
                    status={status.color}
                    divider={index < domains.length - 1}
                    onPress={() => {
                    }}
                  />
                  {domain.status !== 'active' && (
                    <View style={styles.domainActions}>
                      <Button
                        label="Renew"
                        variant="primary"
                        size="sm"
                        onPress={() => handleRenew(domain)}
                        style={styles.actionButton}
                      />
                      <Button
                        label="Details"
                        variant="secondary"
                        size="sm"
                        onPress={() => {
                        }}
                        style={styles.actionButton}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </Card>
        )}

        {/* Add Domain CTA */}
        <Card title="Add Domain" variant="default">
          <Button
            label="Register New Domain"
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

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={() => {
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[10],
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
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.neutral[600],
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
    color: colors.semantic.success,
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: 12,
    color: colors.neutral[600],
    fontWeight: '600',
  },
  domainActions: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
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

export default DomainListScreen;
