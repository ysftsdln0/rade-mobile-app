/**
 * ServicesListScreen
 * 
 * Main services hub showing:
 * - Hosting packages
 * - Domain management
 * - Servers management
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../store';
import { apiService } from '../../services/api';
import {
  Card,
  DataRow,
  Button,
  AlertBanner,
} from '../../components/common';
import { colors, spacing } from '../../styles';
import { HostingPackage, Domain, Server } from '../../types';
import { useLanguage } from '../../utils/LanguageContext';

const ServicesListScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useLanguage();

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
        {/* Simple Header - No Blue Bar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.services.title}</Text>
        </View>

        {/* Compact Overview Cards */}
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>{t.services.hosting}</Text>
            <Text style={styles.overviewValue}>{stats.hosting}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>{t.services.domains}</Text>
            <Text style={styles.overviewValue}>{stats.domains}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>{t.servers.title}</Text>
            <Text style={styles.overviewValue}>{stats.servers}</Text>
          </View>
        </View>

        {/* Hosting Packages Section */}
        <Card title={t.services.hosting} variant="default" style={styles.compactCard}>
          {hostingQuery.isLoading && (
            <View style={styles.loadingContainer}>
              <AlertBanner
                type="info"
                title={t.common.loading}
                message="Fetching your hosting packages"
                dismissible={false}
              />
            </View>
          )}
          {hostingQuery.isError && (
            <AlertBanner
              type="error"
              title={t.common.error}
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
              secondary={`${hosting.packageType} - ${t.dashboard.expires}: ${new Date(hosting.expiryDate).toLocaleDateString()}`}
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
            size="md"
            onPress={() => navigation.navigate('Purchase')}
            fullWidth
          />
        </Card>

        {/* Domains Section */}
        <Card title={t.services.domains} variant="default" style={styles.compactCard}>
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
                size="md"
                onPress={() => navigation.navigate('Purchase')}
                fullWidth
              />
            </View>
          ) : (
            domainsQuery.data?.map((domain, index) => (
              <DataRow
                key={domain.id}
                label={domain.name}
                value={domain.status}
                status={domain.status === 'active' ? 'online' : 'offline'}
                secondary={`${t.dashboard.expires}: ${new Date(domain.expiryDate).toLocaleDateString()}`}
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
        <Card title={t.servers.title} variant="default" style={styles.compactCard}>
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
                size="md"
                onPress={() => navigation.navigate('Purchase')}
                fullWidth
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
    paddingTop: spacing[4],
    paddingBottom: spacing[5],
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.neutral[900],
    textAlign: 'center',
  },
  overviewGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing[3],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[600],
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary[500],
  },
  compactCard: {
    marginHorizontal: spacing[5],
    marginBottom: spacing[3],
  },
  statsRow: {
    gap: spacing[2],
  },
  loadingContainer: {
    paddingVertical: spacing[2],
  },
  emptyStateContainer: {
    paddingVertical: spacing[2],
    gap: spacing[3],
  },
  spacer: {
    height: spacing[4],
  },
});

export default ServicesListScreen;