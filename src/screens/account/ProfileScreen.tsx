/**
 * ProfileScreen
 * 
 * User profile screen matching Figma design:
 * - Large avatar with edit button
 * - Centered name and email
 * - Account section (Personal Info, Security, Billing)
 * - Preferences section (Notifications, Dark Mode)
 * - Log Out button
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../store';
import { logoutAsync } from '../../store/authThunks';
import { Avatar } from '../../components/common';
import { colors, spacing } from '../../styles';
import { useLanguage } from '../../utils/LanguageContext';
import { useTheme } from '../../utils/ThemeContext';
import { Language } from '../../locales';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  textColor?: string;
  iconColor?: string;
  iconBgColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  title, 
  subtitle,
  onPress, 
  showChevron = true,
  textColor,
  iconColor,
  iconBgColor,
}) => {
  const { colors: themeColors } = useTheme();
  
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor || themeColors.surfaceAlt }]}>
          <Ionicons name={icon as any} size={20} color={iconColor || themeColors.text} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuItemText, { color: textColor || themeColors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.menuItemSubtitle, { color: themeColors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={themeColors.textTertiary} />
      )}
    </TouchableOpacity>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { language, setLanguage, t } = useLanguage();
  const { mode, setThemeMode, colors: themeColors, isDark } = useTheme();

  const initials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Logout failed:', error);
      navigation.replace('Auth');
    }
  };

  const toggleLanguage = async () => {
    const newLanguage: Language = language === 'en' ? 'tr' : 'en';
    await setLanguage(newLanguage);
  };

  const toggleDarkMode = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with Avatar */}
        <View style={styles.header}>
          <Avatar
            size="xl"
            initials={initials}
            source={user?.avatar}
            showEditButton
            onEditPress={() => {}}
          />
          <Text style={[styles.userName, { color: themeColors.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>{user?.email}</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t.profile.account}</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <MenuItem
              icon="person-outline"
              title={t.profile.personalInformation}
              onPress={() => navigation.navigate('Account', { screen: 'Profile' })}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <MenuItem
              icon="lock-closed-outline"
              title={t.profile.security}
              onPress={() => navigation.navigate('Account', { screen: 'Security' })}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <MenuItem
              icon="card-outline"
              title={t.profile.billing}
              onPress={() => navigation.navigate('Account', { screen: 'InvoiceList' })}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t.profile.preferences}</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <MenuItem
              icon="notifications-outline"
              title={t.profile.notifications}
              onPress={() => navigation.navigate('Account', { screen: 'NotificationSettings' })}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: themeColors.surfaceAlt }]}>
                  <Ionicons name="moon-outline" size={20} color={themeColors.text} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuItemText, { color: themeColors.text }]}>{t.profile.darkMode}</Text>
                  <Text style={[styles.menuItemSubtitle, { color: themeColors.textSecondary }]}>
                    {isDark ? 'Dark' : 'Light'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.neutral[300], true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: themeColors.surfaceAlt }]}>
                  <Ionicons name="language-outline" size={20} color={themeColors.text} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuItemText, { color: themeColors.text }]}>{t.profile.language}</Text>
                  <Text style={[styles.menuItemSubtitle, { color: themeColors.textSecondary }]}>
                    {t.languages[language]}
                  </Text>
                </View>
              </View>
              <Switch
                value={language === 'tr'}
                onValueChange={toggleLanguage}
                trackColor={{ false: colors.neutral[300], true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Log Out */}
        <TouchableOpacity 
          style={[styles.logoutButton, { 
            backgroundColor: themeColors.card,
            borderColor: colors.semantic.error 
          }]} 
          onPress={handleLogout} 
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.semantic.error} />
          <Text style={styles.logoutText}>{t.profile.logout}</Text>
        </TouchableOpacity>

        {/* Spacer */}
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
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[5],
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: spacing[4],
  },
  userEmail: {
    fontSize: 16,
    marginTop: spacing[1],
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
    marginLeft: spacing[4] + 40 + spacing[3], // icon container width + margin
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: spacing[2],
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.semantic.error,
  },
  spacer: {
    height: spacing[6],
  },
});

export default ProfileScreen;
