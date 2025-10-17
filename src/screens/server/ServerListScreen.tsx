/**
 * ServerListScreen
 * 
 * Server management screen showing:
 * - Search bar for finding servers
 * - Filter chips by status
 * - List of all servers with status
 * - Performance metrics (CPU, Memory, Disk)
 * - Server management actions
 * - Status monitoring
 */
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  DashboardHeader,
  Card,
  DataRow,
  MetricCard,
  Button,
  AlertBanner,
  SearchBar,
  FilterTabs,
  FloatingActionButton,
} from '../../components/common';
import { colors, spacing } from '../../styles';

interface Server {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'maintenance';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: string;
  lastUpdate: string;
}

// Mock data
const mockServers: Server[] = [
  {
    id: 's1',
    name: 'Web Server 01',
    ip: '192.168.1.10',
    status: 'online',
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    uptime: '45d 12h 30m',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 's2',
    name: 'Database Server',
    ip: '192.168.1.20',
    status: 'online',
    cpuUsage: 22,
    memoryUsage: 85,
    diskUsage: 45,
    uptime: '120d 5h 15m',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 's3',
    name: 'Cache Server',
    ip: '192.168.1.30',
    status: 'maintenance',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 30,
    uptime: '0d',
    lastUpdate: new Date().toISOString(),
  },
];

const getMetricStatus = (usage: number) => {
  if (usage >= 80) return 'warning' as const;
  return 'online' as const;
};

const ServerListScreen = () => {
  const navigation = useNavigation<any>();
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'maintenance'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const servers = useMemo(() => {
    let filtered = mockServers;
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.ip.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [filterStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: mockServers.length,
      online: mockServers.filter((s) => s.status === 'online').length,
      offline: mockServers.filter((s) => s.status === 'offline').length,
      maintenance: mockServers.filter((s) => s.status === 'maintenance').length,
    };
  }, []);

  const statusConfig = {
    online: { color: 'online' as const, label: 'Online' },
    offline: { color: 'offline' as const, label: 'Offline' },
    maintenance: { color: 'warning' as const, label: 'Maintenance' },
  };

  const handleReboot = (server: Server) => {
    if (server.status !== 'online') {
      Alert.alert('Error', 'Cannot reboot a server that is not online');
      return;
    }

    Alert.alert(
      'Reboot Server',
      `Reboot ${server.name}?\n\nThis will temporarily disconnect the server.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reboot',
          onPress: () => {
            Alert.alert('Success', 'Reboot initiated successfully!');
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
          <Text style={styles.headerTitle}>My Servers</Text>
          <Text style={styles.headerSubtitle}>Manage your server infrastructure</Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search servers..."
        />

        {/* Filter Tabs */}
        <FilterTabs
          tabs={[
            { id: 'all', label: 'All', count: stats.total },
            { id: 'online', label: 'Running', count: stats.online },
            { id: 'offline', label: 'Stopped', count: stats.offline },
            { id: 'maintenance', label: 'Error', count: stats.maintenance },
          ]}
          activeTab={filterStatus}
          onTabChange={(tabId) => setFilterStatus(tabId as typeof filterStatus)}
        />

        {/* Stats */}
        <Card title="Status Overview" variant="elevated">
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.semantic.success }]}>
                {stats.online}
              </Text>
              <Text style={styles.statLabel}>Online</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.semantic.error }]}>
                {stats.offline}
              </Text>
              <Text style={styles.statLabel}>Offline</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.semantic.warning }]}>
                {stats.maintenance}
              </Text>
              <Text style={styles.statLabel}>Maintenance</Text>
            </View>
          </View>
        </Card>

        {/* Servers List */}
        {servers.length === 0 ? (
          <Card title="No Servers" variant="default">
            <AlertBanner
              type="info"
              title="No servers"
              message={`No ${filterStatus} servers found`}
              dismissible={false}
            />
          </Card>
        ) : (
          <>
            {servers.map((server) => {
              const status = statusConfig[server.status];
              const isOnline = server.status === 'online';

              return (
                <Card key={server.id} title={server.name} variant="default">
                  {/* Server Info */}
                  <DataRow
                    label="Status"
                    value={status.label}
                    status={status.color}
                    divider
                  />
                  <DataRow
                    label="IP Address"
                    value={server.ip}
                    status="neutral"
                    divider
                  />
                  <DataRow
                    label="Uptime"
                    value={server.uptime}
                    status="neutral"
                    divider={false}
                  />

                  {/* Metrics (only for online servers) */}
                  {isOnline && (
                    <>
                      <View style={styles.divider} />
                      <View style={styles.metricsGrid}>
                        <MetricCard
                          value={`${server.cpuUsage}`}
                          unit="%"
                          label="CPU"
                          status={getMetricStatus(server.cpuUsage)}
                        />
                        <MetricCard
                          value={`${server.memoryUsage}`}
                          unit="%"
                          label="Memory"
                          status={getMetricStatus(server.memoryUsage)}
                        />
                        <MetricCard
                          value={`${server.diskUsage}`}
                          unit="%"
                          label="Disk"
                          status={getMetricStatus(server.diskUsage)}
                        />
                      </View>
                    </>
                  )}

                  {/* Actions */}
                  <View style={styles.actionsContainer}>
                    <Button
                      label="Details"
                      variant="secondary"
                      size="sm"
                      onPress={() => {
                        // TODO: Navigate to server details
                      }}
                      style={styles.actionButton}
                    />
                    {isOnline && (
                      <Button
                        label="Reboot"
                        variant="secondary"
                        size="sm"
                        onPress={() => handleReboot(server)}
                        style={styles.actionButton}
                      />
                    )}
                    <Button
                      label="Console"
                      variant="ghost"
                      size="sm"
                      onPress={() => {
                        // TODO: Open console
                      }}
                      style={styles.actionButton}
                    />
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {/* Add Server CTA */}
        <Card title="Add Server" variant="default">
          <Button
            label="Deploy New Server"
            variant="primary"
            size="md"
            onPress={() => {
              // TODO: Navigate to server deployment
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
          // TODO: Navigate to add server
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
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: 12,
    color: colors.neutral[600],
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing[3],
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[2],
    marginBottom: spacing[3],
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

export default ServerListScreen;
