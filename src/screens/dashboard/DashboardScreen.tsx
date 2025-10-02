import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store';
import { COLORS } from '../../constants';
import { apiService } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { ActivityItem, HostingPackage } from '../../types';

const { width } = Dimensions.get('window');

interface ServiceCard {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  count?: number;
  status?: string;
  color: string;
  onPress: () => void;
}

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector((state) => state.auth);
  const insets = useSafeAreaInsets();

  // Queries
  const hostingQuery = useQuery({
    queryKey: ['hostingPackages'],
    queryFn: async () => {
      const res = await apiService.getHostingPackages();
      return res.data as HostingPackage[];
    },
    enabled: !!user,
  });

  const activityQuery = useQuery({
    queryKey: ['recentActivities'],
    queryFn: async () => {
      const res = await apiService.getRecentActivities();
      return res.data as ActivityItem[];
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1 dakika
  });

  const serviceCards: ServiceCard[] = useMemo(() => {
    const hostingCount = hostingQuery.data?.length || 0;
    return [
      {
        id: 'hosting',
        title: 'Hosting Paketleri',
        subtitle: hostingQuery.isLoading ? 'Yükleniyor...' : `${hostingCount} paket`,
        icon: 'server-outline',
        count: hostingCount,
        status: 'active',
        color: COLORS.primary,
        onPress: () => navigation.navigate('Services', { screen: 'HostingList' }),
      },
      {
        id: 'domains',
        title: 'Domain Adları',
        subtitle: 'Liste yakında',
        icon: 'globe-outline',
        color: '#9C27B0',
        onPress: () => navigation.navigate('Services', { screen: 'DomainList' }),
      },
      {
        id: 'servers',
        title: 'Sunucular',
        subtitle: 'Yakında',
        icon: 'hardware-chip-outline',
        color: '#FF9800',
        onPress: () => navigation.navigate('Services', { screen: 'ServerList' }),
      },
      {
        id: 'tickets',
        title: 'Destek Biletleri',
        subtitle: 'Yakında',
        icon: 'headset-outline',
        color: '#795548',
        onPress: () => navigation.navigate('Support', { screen: 'TicketList' }),
      },
    ];
  }, [hostingQuery.data, hostingQuery.isLoading, navigation]);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Yeni Domain',
      icon: 'add-circle-outline',
      onPress: () => {
        // Navigate to domain search/purchase
      },
    },
    {
      id: '2',
      title: 'Fatura Öde',
      icon: 'card-outline',
      onPress: () => navigation.navigate('Account', { screen: 'InvoiceList' }),
    },
    {
      id: '3',
      title: 'Destek Al',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Support', { screen: 'CreateTicket' }),
    },
    {
      id: '4',
      title: 'Canlı Chat',
      icon: 'chatbubble-outline',
      onPress: () => navigation.navigate('Support', { screen: 'Chatbot' }),
    },
  ];

  const handleLogout = () => {
    // dispatch(logoutAsync());
    navigation.replace('Auth');
  };

  const renderServiceCard = (item: ServiceCard) => (
    <TouchableOpacity
      key={item.id}
      style={styles.serviceCard}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[item.color, '#001eff']}
        style={styles.serviceCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.serviceCardHeader}>
          <Ionicons name={item.icon} size={28} color="#FFFFFF" />
          {item.count !== undefined && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{item.count}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.serviceCardTitle}>{item.title}</Text>
        <Text style={styles.serviceCardSubtitle}>{item.subtitle}</Text>
        
        <View style={styles.serviceCardFooter}>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderQuickAction = (item: QuickAction) => (
    <TouchableOpacity
      key={item.id}
      style={styles.quickActionItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons name={item.icon} size={24} color={COLORS.primary} />
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, '#001eff']}
          style={[styles.header, { paddingTop: insets.top }]}
        >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Merhaba,</Text>
            <Text style={styles.userName}>{user?.firstName || 'Kullanıcı'}</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <View style={styles.quickActions}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Service Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hizmetlerim</Text>
          <View style={styles.serviceCards}>
            {serviceCards.map(renderServiceCard)}
          </View>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sistem Durumu</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusIndicator} />
              <Text style={styles.statusTitle}>Tüm Sistemler Çalışıyor</Text>
            </View>
            <Text style={styles.statusSubtitle}>
              Son güncelleme: 2 dakika önce
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
          <View style={styles.activityList}>
            {activityQuery.isLoading && (
              <View style={styles.activityItem}>
                <Text style={styles.activityTitle}>Yükleniyor...</Text>
              </View>) }
            {activityQuery.isError && (
              <View style={styles.activityItem}>
                <Text style={styles.activityTitle}>Aktiviteler alınamadı</Text>
              </View>) }
            {!activityQuery.isLoading && activityQuery.data && activityQuery.data.length === 0 && (
              <View style={styles.activityItem}>
                <Text style={styles.activityTitle}>Kayıt yok</Text>
              </View>
            )}
            {activityQuery.data?.map(a => (
              <View key={a.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name={
                    a.type === 'ssl' ? 'checkmark-circle' :
                    a.type === 'backup' ? 'cloud-upload-outline' :
                    a.type === 'invoice' ? 'card-outline' : 'information-circle-outline'
                  } size={20} color={
                    a.type === 'ssl' ? COLORS.success :
                    a.type === 'backup' ? COLORS.info :
                    a.type === 'invoice' ? COLORS.warning : COLORS.primary
                  } />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{a.title}</Text>
                  <Text style={styles.activityTime}>{a.context || ''}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer Spacing */}
        <View style={{ height: Math.max(insets.bottom + 20, 40) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '300',
  },
  userName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickActionItem: {
    width: (width - 40) / 2,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  serviceCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  serviceCard: {
    width: (width - 40) / 2,
    height: 140,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceCardGradient: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  serviceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  serviceCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  serviceCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  serviceCardFooter: {
    alignItems: 'flex-end',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statusSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default DashboardScreen;