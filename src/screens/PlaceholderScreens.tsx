import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { useTheme } from '../utils/ThemeContext';

const PlaceholderScreen = ({ title }: { title: string }) => {
  const { colors: themeColors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Bu sayfa henüz geliştirilme aşamasında</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

// Hosting Screens
export const FileManagerScreen = () => <PlaceholderScreen title="Dosya Yöneticisi" />;
export const DatabaseManagerScreen = () => <PlaceholderScreen title="Veritabanı Yöneticisi" />;

// Domain Screens  
export const DomainListScreen = () => <PlaceholderScreen title="Domain Listesi" />;
export const DomainDetailsScreen = () => <PlaceholderScreen title="Domain Detayları" />;

// Server Screens
export const ServerListScreen = () => <PlaceholderScreen title="Sunucu Listesi" />;
export const ServerDetailsScreen = () => <PlaceholderScreen title="Sunucu Detayları" />;

// Support Screens
export const TicketDetailsScreen = () => <PlaceholderScreen title="Bilet Detayları" />;
export const CreateTicketScreen = () => <PlaceholderScreen title="Yeni Bilet Oluştur" />;

// Account Screens
export const AccountMainScreen = () => <PlaceholderScreen title="Hesap Yönetimi" />;
// ProfileScreen moved to src/screens/account/ProfileScreen.tsx
export const SecurityScreen = () => <PlaceholderScreen title="Güvenlik Ayarları" />;
export const NotificationSettingsScreen = () => <PlaceholderScreen title="Bildirim Ayarları" />;

// Finance Screens
export const FinanceScreen = () => <PlaceholderScreen title="Mali İşlemler" />;