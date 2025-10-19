/**
 * ServicesListScreen
 * 
 * Main services hub showing:
 * - Hosting packages
 * - Domain management
 * - Servers management
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { apiService } from '../../services/api';
import {
  Button,
  AlertBanner,
} from '../../components/common';
import { colors, spacing } from '../../styles';
import { HostingPackage, Domain, Server } from '../../types';
import { useLanguage } from '../../utils/LanguageContext';
import { useTheme } from '../../utils/ThemeContext';

const ServicesListScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useLanguage();
  const { colors: themeColors, isDark } = useTheme();

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>{t.services.title}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Statistics Overview */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: themeColors.primary }]}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="server-outline" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statValue}>{stats.hosting}</Text>
                <Text style={styles.statLabel}>{t.services.hosting}</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: themeColors.primary }]}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="globe-outline" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statValue}>{stats.domains}</Text>
                <Text style={styles.statLabel}>{t.services.domains}</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: themeColors.primary }]}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="hardware-chip-outline" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statValue}>{stats.servers}</Text>
                <Text style={styles.statLabel}>{t.servers.title}</Text>
              </View>
            </View>
          </View>

          {/* Hosting Packages Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t.services.hosting}</Text>
            {hostingQuery.isLoading && (
              <View style={[styles.emptyCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
                <AlertBanner
                  type="info"
                  title={t.common.loading}
                  message="Fetching your hosting packages"
                  dismissible={false}
                />
              </View>
            )}
            {hostingQuery.isError && (
              <View style={[styles.emptyCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
                <AlertBanner
                  type="error"
                  title={t.common.error}
                  message="Failed to load hosting packages"
                  dismissible
                />
              </View>
            )}
            {hostingQuery.data && hostingQuery.data.length === 0 && (
              <View style={[styles.emptyCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
                <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? themeColors.surfaceAlt : colors.neutral[50] }]}>
                  <Ionicons name="server-outline" size={48} color={themeColors.textTertiary} />
                </View>
                <Text style={[styles.emptyTitle, { color: themeColors.text }]}>No Hosting Packages</Text>
                <Text style={[styles.emptyMessage, { color: themeColors.textSecondary }]}>You don't have any hosting packages yet</Text>
              </View>
            )}
            {hostingQuery.data && hostingQuery.data.map((hosting) => (
              <TouchableOpacity
                key={hosting.id}
                style={[styles.serviceCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}
                onPress={() =>
                  navigation.navigate('Services', {
                    screen: 'HostingDetails',
                    params: { packageId: hosting.id },
                  })
                }
              >
                <View style={styles.serviceCardHeader}>
                  <View style={[styles.serviceIconContainer, { backgroundColor: isDark ? themeColors.surfaceAlt : '#F0F5FF' }]}>
                    <Ionicons name="server" size={24} color={themeColors.primary} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={[styles.serviceName, { color: themeColors.text }]}>{hosting.name}</Text>
                    <Text style={[styles.serviceType, { color: themeColors.textSecondary }]}>{hosting.packageType}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: hosting.status === 'active' ? '#D1FAE5' : '#FEE2E2' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: hosting.status === 'active' ? '#059669' : '#DC2626' }
                    ]}>
                      {hosting.status}
                    </Text>
                  </View>
                </View>
                <View style={[styles.serviceCardFooter, { borderTopColor: themeColors.border }]}>
                  <Text style={[styles.expiryText, { color: themeColors.textSecondary }]}>
                    {t.dashboard.expires}: {new Date(hosting.expiryDate).toLocaleDateString()}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={themeColors.textTertiary} />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Purchase')}>
              <View style={[styles.addButtonGradient, { backgroundColor: themeColors.primary }]}>
                <Text style={styles.addButtonText}>Browse Hosting Plans</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Domains Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.services.domains}</Text>
            {domainsQuery.data && domainsQuery.data.length === 0 ? (
              <>
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="globe-outline" size={48} color={colors.neutral[400]} />
                  </View>
                  <Text style={styles.emptyTitle}>No Domains</Text>
                  <Text style={styles.emptyMessage}>Register or transfer a domain to get started</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Purchase')}>
                  <View style={styles.addButtonGradient}>
                    <Text style={styles.addButtonText}>Find a Domain</Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {domainsQuery.data?.map((domain) => (
                  <TouchableOpacity
                    key={domain.id}
                    style={styles.serviceCard}
                    onPress={() =>
                      navigation.navigate('Services', {
                        screen: 'DomainList',
                      })
                    }
                  >
                    <View style={styles.serviceCardHeader}>
                      <View style={styles.serviceIconContainer}>
                        <Ionicons name="globe" size={24} color={colors.primary[500]} />
                      </View>
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{domain.name}</Text>
                        <Text style={styles.serviceType}>Domain</Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: domain.status === 'active' ? '#D1FAE5' : '#FEE2E2' }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          { color: domain.status === 'active' ? '#059669' : '#DC2626' }
                        ]}>
                          {domain.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.serviceCardFooter}>
                      <Text style={styles.expiryText}>
                        {t.dashboard.expires}: {new Date(domain.expiryDate).toLocaleDateString()}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>

          {/* Servers Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.servers.title}</Text>
            {serversQuery.data && serversQuery.data.length === 0 ? (
              <>
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="hardware-chip-outline" size={48} color={colors.neutral[400]} />
                  </View>
                  <Text style={styles.emptyTitle}>No Servers</Text>
                  <Text style={styles.emptyMessage}>Deploy your first server or VPS</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Purchase')}>
                  <View style={styles.addButtonGradient}>
                    <Text style={styles.addButtonText}>Deploy Server</Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {serversQuery.data?.map((server) => (
                  <TouchableOpacity
                    key={server.id}
                    style={styles.serviceCard}
                    onPress={() =>
                      navigation.navigate('Services', {
                        screen: 'ServerList',
                      })
                    }
                  >
                    <View style={styles.serviceCardHeader}>
                      <View style={styles.serviceIconContainer}>
                        <Ionicons name="hardware-chip" size={24} color={colors.primary[500]} />
                      </View>
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{server.name}</Text>
                        <Text style={styles.serviceType}>{server.os} - IP: {server.ip}</Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: server.status === 'running' ? '#D1FAE5' : '#FEE2E2' }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          { color: server.status === 'running' ? '#059669' : '#DC2626' }
                        ]}>
                          {server.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.serviceCardFooter}>
                      <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[6],
  },
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing[3],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statCard: {
    flex: 1,
    padding: spacing[4],
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  statIconContainer: {
    marginBottom: spacing[2],
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  serviceCard: {
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  serviceCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[3],
    borderTopWidth: 1,
  },
  expiryText: {
    fontSize: 13,
  },
  emptyCard: {
    borderRadius: 16,
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ServicesListScreen;