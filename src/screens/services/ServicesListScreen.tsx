import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';

const ServicesListScreen = () => {
  const navigation = useNavigation<any>();

  const services = [
    {
      title: 'Hosting Paketleri',
      subtitle: 'Web hosting hizmetlerinizi yönetin',
      icon: 'server-outline',
      screen: 'HostingList',
    },
    {
      title: 'Domain Adları',
      subtitle: 'Domain yönetimi ve DNS ayarları',
      icon: 'globe-outline', 
      screen: 'DomainList',
    },
    {
      title: 'Sunucular',
      subtitle: 'VPS ve dedicated sunucu yönetimi',
      icon: 'hardware-chip-outline',
      screen: 'ServerList',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={styles.serviceItem}
            onPress={() => navigation.navigate(service.screen)}
          >
            <View style={styles.serviceIcon}>
              <Ionicons name={service.icon as any} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default ServicesListScreen;