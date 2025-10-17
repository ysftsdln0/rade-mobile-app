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

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, showChevron = true }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={20} color={colors.neutral[700]} />
      </View>
      <Text style={styles.menuItemText}>{title}</Text>
    </View>
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
    )}
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <SafeAreaView style={styles.container}>
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
            onEditPress={() => {
              // TODO: Handle avatar edit
              console.log('Edit avatar');
            }}
          />
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <MenuItem
              icon="person-outline"
              title="Personal Information"
              onPress={() => navigation.navigate('Account', { screen: 'Profile' })}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="lock-closed-outline"
              title="Security"
              onPress={() => navigation.navigate('Account', { screen: 'Security' })}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="card-outline"
              title="Billing"
              onPress={() => navigation.navigate('Account', { screen: 'InvoiceList' })}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              onPress={() => navigation.navigate('Account', { screen: 'NotificationSettings' })}
            />
            <View style={styles.divider} />
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="moon-outline" size={20} color={colors.neutral[700]} />
                </View>
                <Text style={styles.menuItemText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={colors.semantic.error} />
          <Text style={styles.logoutText}>Log Out</Text>
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
    backgroundColor: '#FAFAFA',
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
    color: colors.neutral[900],
    marginTop: spacing[4],
  },
  userEmail: {
    fontSize: 16,
    color: colors.neutral[600],
    marginTop: spacing[1],
  },
  section: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[900],
    marginBottom: spacing[3],
  },
  card: {
    backgroundColor: '#FFFFFF',
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
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  menuItemText: {
    fontSize: 16,
    color: colors.neutral[900],
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginLeft: spacing[4] + 40 + spacing[3], // icon container width + margin
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing[5],
    paddingVertical: spacing[4],
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.semantic.error,
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
