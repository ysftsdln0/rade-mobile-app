import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { AppHeader } from '../../components/common/AppHeader';
import { ServiceCard } from '../../components/common/ServiceCard';

const ServicesListScreen = () => {
  const navigation = useNavigation<any>();

  const services = [
    {
      title: 'Hosting Paketleri',
      subtitle: 'Web hosting hizmetlerinizi yönetin',
      icon: 'server-outline' as const,
      screen: 'HostingList',
      gradient: COLORS.hosting.gradient as [string, string],
    },
    {
      title: 'Domain Adları',
      subtitle: 'Domain yönetimi ve DNS ayarları',
      icon: 'globe-outline' as const,
      screen: 'DomainList',
      gradient: COLORS.domain.gradient as [string, string],
    },
    {
      title: 'Sunucular',
      subtitle: 'VPS ve dedicated sunucu yönetimi',
      icon: 'hardware-chip-outline' as const,
      screen: 'ServerList',
      gradient: COLORS.server.gradient as [string, string],
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader showLogo={true} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            subtitle={service.subtitle}
            icon={service.icon}
            gradient={service.gradient}
            onPress={() => navigation.navigate(service.screen)}
          />
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
});

export default ServicesListScreen;