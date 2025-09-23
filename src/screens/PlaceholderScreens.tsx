import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>Bu sayfa henüz geliştirilme aşamasında</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

// Hosting Screens
export const HostingListScreen = () => <PlaceholderScreen title="Hosting Paketleri" />;
export const HostingDetailsScreen = () => <PlaceholderScreen title="Hosting Detayları" />;
export const FileManagerScreen = () => <PlaceholderScreen title="Dosya Yöneticisi" />;
export const DatabaseManagerScreen = () => <PlaceholderScreen title="Veritabanı Yöneticisi" />;

// Domain Screens  
export const DomainListScreen = () => <PlaceholderScreen title="Domain Listesi" />;
export const DomainDetailsScreen = () => <PlaceholderScreen title="Domain Detayları" />;

// Server Screens
export const ServerListScreen = () => <PlaceholderScreen title="Sunucu Listesi" />;
export const ServerDetailsScreen = () => <PlaceholderScreen title="Sunucu Detayları" />;

// Support Screens
export const SupportMainScreen = () => <PlaceholderScreen title="Destek Merkezi" />;
export const TicketListScreen = () => <PlaceholderScreen title="Destek Biletleri" />;
export const TicketDetailsScreen = () => <PlaceholderScreen title="Bilet Detayları" />;
export const CreateTicketScreen = () => <PlaceholderScreen title="Yeni Bilet Oluştur" />;
export const ChatbotScreen = () => <PlaceholderScreen title="Canlı Destek" />;

// Account Screens
export const AccountMainScreen = () => <PlaceholderScreen title="Hesap Yönetimi" />;
export const ProfileScreen = () => <PlaceholderScreen title="Profil Bilgileri" />;
export const SecurityScreen = () => <PlaceholderScreen title="Güvenlik Ayarları" />;
export const NotificationSettingsScreen = () => <PlaceholderScreen title="Bildirim Ayarları" />;

// Finance Screens
export const FinanceScreen = () => <PlaceholderScreen title="Mali İşlemler" />;
export const InvoiceListScreen = () => <PlaceholderScreen title="Faturalar" />;
export const PaymentMethodsScreen = () => <PlaceholderScreen title="Ödeme Yöntemleri" />;