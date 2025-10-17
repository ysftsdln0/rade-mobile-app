/**
 * HostingDetailsScreen
 * 
 * Hosting package details view showing:
 * - Package information and status
 * - Resource usage (disk, bandwidth, CPU)
 * - Expiry date and renewal options
 * - Management actions
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  DashboardHeader,
  Card,
  MetricCard,
  DataRow,
  Button,
  AlertBanner,
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

const formatBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const getUsageStatus = (used: number, total: number) => {
  const percentage = (used / total) * 100;
  if (percentage >= 90) return 'warning' as const;
  if (percentage >= 70) return 'warning' as const;
  return 'online' as const;
};

interface HostingPackage {
  id: string;
  name: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  diskUsed: number;
  diskTotal: number;
  bandwidthUsed: number;
  bandwidthTotal: number;
  cpuUsed: number;
  cpuTotal: number;
  expiryDate: string;
  autoRenewal: boolean;
  price: number;
  currency: string;
}

// Mock data - in real app, this would come from route params or API
const mockHostingPackage: HostingPackage = {
  id: 'h1',
  name: 'Premium Hosting',
  plan: 'hosting.pro',
  status: 'active',
  diskUsed: 450,
  diskTotal: 1000,
  bandwidthUsed: 85,
  bandwidthTotal: 250,
  cpuUsed: 45,
  cpuTotal: 100,
  expiryDate: '2025-12-17',
  autoRenewal: true,
  price: 99.99,
  currency: 'USD',
};

const HostingDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
  const hosting = route.params?.hosting || mockHostingPackage;

  const statusColor: { [key in 'active' | 'inactive' | 'suspended']: 'online' | 'offline' | 'warning' } = {
    active: 'online' as const,
    inactive: 'offline' as const,
    suspended: 'warning' as const,
  };

  const daysUntilExpiry = useMemo(() => {
    const expiry = new Date(hosting.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [hosting.expiryDate]);

  const expiryStatus = useMemo(() => {
    if (daysUntilExpiry <= 0) return 'expired' as const;
    if (daysUntilExpiry <= 30) return 'warning' as const;
    return 'ok' as const;
  }, [daysUntilExpiry]);

  const handleRenewal = () => {
    Alert.alert(
      'Renew Hosting',
      `Renew this hosting package for another year?\n\nCost: $${hosting.price.toFixed(2)} ${hosting.currency}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Renew',
          onPress: () => {
            Alert.alert('Success', 'Hosting package renewed successfully!');
          },
        },
      ]
    );
  };

  const handleToggleAutoRenewal = () => {
    Alert.alert(
      'Auto-Renewal',
      hosting.autoRenewal
        ? 'Disable auto-renewal? You will need to manually renew before expiry.'
        : 'Enable auto-renewal? Your hosting will automatically renew before expiry.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Auto-renewal setting updated!');
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
        <DashboardHeader
          title={hosting.name}
          subtitle={hosting.plan}
        />

        {/* Status Alert */}
        {expiryStatus === 'warning' && (
          <Card title="Expiry Alert" variant="default">
            <AlertBanner
              type="warning"
              title="Expiring Soon"
              message={`Your hosting expires in ${daysUntilExpiry} days`}
              action={{
                label: 'Renew Now',
                onPress: handleRenewal,
              }}
              dismissible
            />
          </Card>
        )}

        {expiryStatus === 'expired' && (
          <Card title="Expired" variant="default">
            <AlertBanner
              type="error"
              title="Hosting Expired"
              message="Your hosting package has expired. Please renew to continue service."
              action={{
                label: 'Renew Now',
                onPress: handleRenewal,
              }}
              dismissible={false}
            />
          </Card>
        )}

        {/* Package Info */}
        <Card title="Package Information" variant="default">
          <DataRow
            label="Status"
            value={hosting.status.charAt(0).toUpperCase() + hosting.status.slice(1)}
            status={statusColor[hosting.status as keyof typeof statusColor]}
            divider
          />
          <DataRow
            label="Plan"
            value={hosting.plan}
            status="neutral"
            divider
          />
          <DataRow
            label="Price"
            value={`$${hosting.price.toFixed(2)}/${hosting.currency}`}
            status="neutral"
            divider={false}
          />
        </Card>

        {/* Resource Usage */}
        <Card title="Resource Usage" variant="default">
          <View style={styles.metricsGrid}>
            <MetricCard
              value={`${(hosting.diskUsed / 1024).toFixed(2)}`}
              unit="GB"
              label="Disk Usage"
              status={getUsageStatus(hosting.diskUsed, hosting.diskTotal)}
            />
            <MetricCard
              value={`${(hosting.bandwidthUsed).toFixed(0)}`}
              unit="GB"
              label="Bandwidth"
              status={getUsageStatus(hosting.bandwidthUsed, hosting.bandwidthTotal)}
            />
            <MetricCard
              value={`${hosting.cpuUsed}`}
              unit="%"
              label="CPU Usage"
              status={getUsageStatus(hosting.cpuUsed, hosting.cpuTotal)}
            />
          </View>
        </Card>

        {/* Detailed Specs */}
        <Card title="Specifications" variant="default">
          <DataRow
            label="Total Disk"
            value={`${hosting.diskTotal} GB`}
            status="neutral"
            divider
          />
          <DataRow
            label="Total Bandwidth"
            value={`${hosting.bandwidthTotal} GB/month`}
            status="neutral"
            divider
          />
          <DataRow
            label="CPU Cores"
            value={`${hosting.cpuTotal}`}
            status="neutral"
            divider={false}
          />
        </Card>

        {/* Renewal Settings */}
        <Card title="Renewal Settings" variant="default">
          <DataRow
            label="Expiry Date"
            value={formatDate(hosting.expiryDate)}
            secondary={`${daysUntilExpiry} days remaining`}
            status={expiryStatus === 'ok' ? 'online' : 'warning'}
            divider
          />
          <View style={styles.autoRenewalRow}>
            <View style={styles.autoRenewalLabel}>
              <Text style={styles.autoRenewalLabelText}>Auto-Renewal</Text>
              <Text style={styles.autoRenewalDescription}>
                Automatically renew before expiry
              </Text>
            </View>
            <View
              style={[
                styles.autoRenewalToggle,
                { backgroundColor: hosting.autoRenewal ? colors.semantic.success : colors.neutral[300] },
              ]}
            >
              <Text style={styles.autoRenewalToggleText}>
                {hosting.autoRenewal ? 'ON' : 'OFF'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <Card title="Actions" variant="default">
          <View style={styles.actionsContainer}>
            <Button
              label="Renew Package"
              variant="primary"
              size="md"
              onPress={handleRenewal}
              style={styles.actionButton}
            />
            <Button
              label={hosting.autoRenewal ? 'Disable Auto-Renewal' : 'Enable Auto-Renewal'}
              variant="secondary"
              size="md"
              onPress={handleToggleAutoRenewal}
              style={styles.actionButton}
            />
            <Button
              label="Manage Files"
              variant="secondary"
              size="md"
              onPress={() => {
                // TODO: Navigate to file manager
              }}
              style={styles.actionButton}
            />
            <Button
              label="Support"
              variant="ghost"
              size="md"
              onPress={() => navigation.navigate('Support')}
              style={styles.actionButton}
            />
          </View>
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
    backgroundColor: colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[6],
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  autoRenewalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  autoRenewalLabel: {
    flex: 1,
  },
  autoRenewalLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing[1],
  },
  autoRenewalDescription: {
    fontSize: 12,
    color: colors.neutral[600],
  },
  autoRenewalToggle: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
  },
  autoRenewalToggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.neutral[50],
  },
  actionsContainer: {
    gap: spacing[2],
  },
  actionButton: {
    width: '100%',
  },
  spacer: {
    height: spacing[6],
  },
});

export default HostingDetailsScreen;
