/**
 * SecurityScreen
 * 
 * Security settings matching ProfileScreen design:
 * - Password change
 * - Two-factor authentication
 * - Biometric login
 * - Login notifications
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';
import { useTwoFactor } from '../../hooks/useTwoFactor';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  iconColor?: string;
  iconBgColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  title, 
  subtitle,
  onPress, 
  showChevron = false,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  iconColor,
  iconBgColor,
}) => {
  const { colors: themeColors } = useTheme();
  
  const content = (
    <View style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor || themeColors.surfaceAlt }]}>
          <Ionicons name={icon as any} size={20} color={iconColor || themeColors.text} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuItemText, { color: themeColors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.menuItemSubtitle, { color: themeColors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={themeColors.textTertiary} />
      )}
      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.neutral[300], true: themeColors.primary }}
          thumbColor="#FFFFFF"
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const SecurityScreen = () => {
  const navigation = useNavigation<any>();
  const { colors: themeColors } = useTheme();
  const { enabled: twoFactorEnabled } = useTwoFactor();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);

  const handleChangePassword = () => {
    Alert.alert(
      'Şifre Değiştir',
      'Şifre değiştirme özelliği yakında eklenecek'
    );
  };

  const handleTwoFactorSetup = () => {
    Alert.alert(
      'İki Faktörlü Doğrulama',
      twoFactorEnabled 
        ? 'İki faktörlü doğrulama aktif. Devre dışı bırakmak ister misiniz?' 
        : 'İki faktörlü doğrulama kurulum sihirbazı yakında eklenecek'
    );
  };

  const handleViewSessions = () => {
    Alert.alert(
      'Aktif Oturumlar',
      'Oturum yönetimi özelliği yakında eklenecek'
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>Güvenlik</Text>
            <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
              Hesap güvenliğinizi yönetin
            </Text>
          </View>
        </View>

        {/* Authentication Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Kimlik Doğrulama</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <MenuItem
              icon="key-outline"
              title="Şifre Değiştir"
              subtitle="Hesap şifrenizi güncelleyin"
              onPress={handleChangePassword}
              showChevron
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <MenuItem
              icon="shield-checkmark-outline"
              title="İki Faktörlü Doğrulama"
              subtitle={twoFactorEnabled ? 'Aktif' : 'Devre dışı'}
              onPress={handleTwoFactorSetup}
              showChevron
              iconColor={twoFactorEnabled ? colors.semantic.success : themeColors.text}
              iconBgColor={twoFactorEnabled ? `${colors.semantic.success}15` : themeColors.surfaceAlt}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <MenuItem
              icon="finger-print-outline"
              title="Biyometrik Giriş"
              subtitle={biometricEnabled ? 'Açık' : 'Kapalı'}
              showSwitch
              switchValue={biometricEnabled}
              onSwitchChange={setBiometricEnabled}
            />
          </View>
        </View>

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Aktivite</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <MenuItem
              icon="time-outline"
              title="Aktif Oturumlar"
              subtitle="Bağlı cihazlarınızı görün"
              onPress={handleViewSessions}
              showChevron
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <MenuItem
              icon="notifications-outline"
              title="Giriş Bildirimleri"
              subtitle="Yeni girişlerden haberdar olun"
              showSwitch
              switchValue={loginNotifications}
              onSwitchChange={setLoginNotifications}
            />
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[10],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[6],
  },
  backButton: {
    padding: spacing[2],
    marginRight: spacing[2],
    marginLeft: -spacing[2],
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: 16,
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
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: spacing[4] + 40 + spacing[3],
  },
  spacer: {
    height: spacing[6],
  },
});

export default SecurityScreen;
