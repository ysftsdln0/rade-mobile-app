/**
 * ServicesListScreen
 * 
 * Main services hub showing:
 * - Hosting packages
 * - Domain management
 * - Servers management
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../store';
import { apiService } from '../../services/api';
import {
  DashboardHeader,
  Card,
  DataRow,
  Button,
  AlertBanner,
} from '../../components/common';
import { colors, spacing } from '../../styles';
import { HostingPackage, Domain, Server } from '../../types';

const ServicesListScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector((state) => state.auth);

  // Fetch all services
  const hostingQuery = useQuery({
    queryKey: ['hostingPackages'],
    queryFn: async () => {
      const res = await apiService.getHostingPackages();
      return res.data as HostingPackage[];
    },
    enabled: !!user,
  });

  const domainsQuery = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      // This would be implemented in backend
      return [] as Domain[];
    },
    enabled: !!user,
  });

  const serversQuery = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      // This would be implemented in backend
      return [] as Server[];
    },
    enabled: !!user,
  });

  const stats = useMemo(() => ({
    hosting: hostingQuery.data?.length || 0,
    domains: domainsQuery.data?.length || 0,
    servers: serversQuery.data?.length || 0,
  }), [hostingQuery.data, domainsQuery.data, serversQuery.data]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Page Header */}
        <DashboardHeader
          title="Services"
          subtitle="Manage all your services in one place"
        />

        {/* Services Overview */}
        <Card title="Overview" variant="elevated">
          <View style={styles.statsRow}>
            <DataRow
              label="Hosting Packages"
              value={stats.hosting.toString()}
              divider
            />
            <DataRow
              label="Domains"
              value={stats.domains.toString()}
              divider
            />
            <DataRow
              label="Servers"
              value={stats.servers.toString()}
              divider={false}
            />
          </View>
        </Card>

        {/* Hosting Packages Section */}
        <Card title="Hosting Packages" variant="default">
          {hostingQuery.isLoading && (
            <View style={styles.loadingContainer}>
              <AlertBanner
                type="info"
                title="Loading..."
                message="Fetching your hosting packages"
                dismissible={false}
              />
            </View>
          )}
          {hostingQuery.isError && (
            <AlertBanner
              type="error"
              title="Error"
              message="Failed to load hosting packages"
              dismissible
            />
          )}
          {hostingQuery.data && hostingQuery.data.length === 0 && (
            <AlertBanner
              type="info"
              title="No Packages"
              message="You don't have any hosting packages yet"
              dismissible={false}
            />
          )}
          {hostingQuery.data && hostingQuery.data.map((hosting, index) => (
            <DataRow
              key={hosting.id}
              label={hosting.name}
              value={hosting.status}
              status={hosting.status === 'active' ? 'online' : 'offline'}
              secondary={`${hosting.packageType} - Expires: ${new Date(hosting.expiryDate).toLocaleDateString()}`}
              divider={index < (hostingQuery.data?.length ?? 0) - 1}
              onPress={() =>
                navigation.navigate('Services', {
                  screen: 'HostingDetails',
                  params: { packageId: hosting.id },
                })
              }
            />
          ))}
          <Button
            label="Browse Hosting Plans"
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('Purchase')}
          />
        </Card>

        {/* Domains Section */}
        <Card title="Domains" variant="default">
          {domainsQuery.data && domainsQuery.data.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <AlertBanner
                type="info"
                title="No Domains"
                message="Register or transfer a domain to get started"
                dismissible={false}
              />
              <Button
                label="Find a Domain"
                variant="primary"
                size="lg"
                onPress={() => navigation.navigate('Purchase')}
              />
            </View>
          ) : (
            domainsQuery.data?.map((domain, index) => (
              <DataRow
                key={domain.id}
                label={domain.name}
                value={domain.status}
                status={domain.status === 'active' ? 'online' : 'offline'}
                secondary={`Expires: ${new Date(domain.expiryDate).toLocaleDateString()}`}
                divider={index < (domainsQuery.data?.length ?? 0) - 1}
                onPress={() =>
                  navigation.navigate('Services', {
                    screen: 'DomainList',
                  })
                }
              />
            ))
          )}
        </Card>

        {/* Servers Section */}
        <Card title="Servers" variant="default">
          {serversQuery.data && serversQuery.data.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <AlertBanner
                type="info"
                title="No Servers"
                message="Deploy your first server or VPS"
                dismissible={false}
              />
              <Button
                label="Deploy Server"
                variant="primary"
                size="lg"
                onPress={() => navigation.navigate('Purchase')}
              />
            </View>
          ) : (
            serversQuery.data?.map((server, index) => (
              <DataRow
                key={server.id}
                label={server.name}
                value={server.status}
                secondary={`${server.os} - IP: ${server.ip}`}
                divider={index < (serversQuery.data?.length ?? 0) - 1}
                onPress={() =>
                  navigation.navigate('Services', {
                    screen: 'ServerList',
                  })
                }
              />
            ))
          )}
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
  statsRow: {
    gap: spacing[2],
  },
  loadingContainer: {
    paddingVertical: spacing[4],
  },
  emptyStateContainer: {
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  spacer: {
    height: spacing[6],
  },
});

export default ServicesListScreen;