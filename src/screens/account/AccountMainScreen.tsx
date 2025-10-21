/**
 * AccountMainScreen
 * 
 * User account management screen showing:
 * - Profile information
 * - Billing & invoices summary
 * - Security settings
 * - Quick actions
 */
import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '../../store';
import { logoutAsync } from '../../store/authThunks';
import { apiService } from '../../services/api';
import {
  DashboardHeader,
  Card,
  DataRow,
  TextInput,
  Button,
  AlertBanner,
  Badge,
} from '../../components/common';
import { colors, spacing } from '../../styles';
import { HostingPackage, ActivityItem } from '../../types';
import { useInvoices } from '../../hooks/useInvoices';
import { useTwoFactor } from '../../hooks/useTwoFactor';
import { useTheme } from '../../utils/ThemeContext';

const AccountMainScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { colors: themeColors } = useTheme();
  
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [company, setCompany] = useState(user?.company || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Sync form state when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setCompany(user.company || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Queries
  const hostingQuery = useQuery({
    queryKey: ['hostingPackages'],
    queryFn: async () => {
      const res = await apiService.getHostingPackages();
      return res.data as HostingPackage[];
    },
    enabled: !!user,
  });

  const { invoicesQuery } = useInvoices();
  const { enabled: twoFactorEnabled } = useTwoFactor();

  // Calculate stats
  const stats = useMemo(() => {
    const hosting = hostingQuery.data ?? [];
    const active = hosting.filter((h) => h.status === 'active').length;
    const invoices = invoicesQuery.data ?? [];
    const unpaid = invoices.filter((i) => i.status === 'unpaid' || i.status === 'overdue').length;
    
    return { activeServices: active, unpaidInvoices: unpaid };
  }, [hostingQuery.data, invoicesQuery.data]);

  const handleSaveProfile = () => {
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    // Reset form to original user values
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setCompany(user.company || '');
      setPhone(user.phone || '');
    }
    setEditMode(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, navigate to auth
      navigation.replace('Auth');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Page Header */}
        <DashboardHeader
          title="My Account"
          subtitle={user?.email || 'Account Settings'}
        />

        {/* Profile Section */}
        <Card title="Profile Information" variant="elevated">
          {!editMode ? (
            <>
              <DataRow
                label="Name"
                value={`${user?.firstName} ${user?.lastName}`.trim()}
                divider
              />
              <DataRow
                label="Email"
                value={user?.email || ''}
                divider
              />
              <DataRow
                label="Company"
                value={user?.company || 'Not set'}
                divider
              />
              <DataRow
                label="Phone"
                value={user?.phone || 'Not set'}
                divider={false}
              />
              <Button
                label="Edit Profile"
                variant="secondary"
                size="sm"
                onPress={() => setEditMode(true)}
              />
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Company"
                  value={company}
                  onChangeText={setCompany}
                  placeholder="Enter company name (optional)"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Phone"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number (optional)"
                />
              </View>
              <View style={styles.buttonGroup}>
                <Button
                  label="Save"
                  variant="primary"
                  size="sm"
                  onPress={handleSaveProfile}
                />
                <Button
                  label="Cancel"
                  variant="secondary"
                  size="sm"
                  onPress={handleCancelEdit}
                />
              </View>
            </>
          )}
        </Card>

        {/* Account Summary */}
        <Card title="Account Summary" variant="default">
          <View style={styles.summaryRow}>
            <View>
              <DataRow
                label="Active Services"
                value={stats.activeServices.toString()}
                divider={false}
                onPress={() => navigation.navigate('Services')}
              />
            </View>
            <Badge label={stats.activeServices.toString()} variant="primary" />
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View>
              <DataRow
                label="Unpaid Invoices"
                value={stats.unpaidInvoices.toString()}
                divider={false}
                onPress={() => navigation.navigate('Account', { screen: 'InvoiceList' })}
              />
            </View>
            {stats.unpaidInvoices > 0 ? (
              <Badge label={stats.unpaidInvoices.toString()} variant="warning" />
            ) : (
              <Badge label="Paid" variant="success" />
            )}
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View style={{ flex: 1 }}>
              <DataRow
                label="Two-Factor Auth"
                value={twoFactorEnabled ? 'Enabled' : 'Disabled'}
                divider={false}
                onPress={() => navigation.navigate('Account', { screen: 'TwoFactor' })}
              />
            </View>
            <Badge label={twoFactorEnabled ? 'Active' : 'Disabled'} variant={twoFactorEnabled ? 'success' : 'default'} />
          </View>
        </Card>

        {/* Security Section */}
        <Card title="Security" variant="default">
          <DataRow
            label="Change Password"
            value="Update password"
            divider
            onPress={() => {
            }}
          />
          <DataRow
            label="Two-Factor Authentication"
            value={twoFactorEnabled ? 'Active' : 'Inactive'}
            status={twoFactorEnabled ? 'online' : 'offline'}
            divider={false}
            onPress={() => navigation.navigate('Account', { screen: 'TwoFactor' })}
          />
        </Card>

        {/* Billing Section */}
        <Card title="Billing" variant="default">
          <DataRow
            label="View Invoices"
            value={`${invoicesQuery.data?.length || 0} invoices`}
            divider
            onPress={() => navigation.navigate('Account', { screen: 'InvoiceList' })}
          />
          <DataRow
            label="Payment Methods"
            value="Manage payment"
            divider={false}
            onPress={() => navigation.navigate('Account', { screen: 'PaymentMethods' })}
          />
        </Card>

        {/* Danger Zone */}
        <Card title="Danger Zone" variant="default">
          <AlertBanner
            type="warning"
            title="Logout"
            message="End your current session"
            dismissible={false}
          />
          <View style={styles.dangerButtonContainer}>
            <Button
              label="Logout"
              variant="danger"
              size="sm"
              onPress={handleLogout}
            />
          </View>
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
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[6],
  },
  inputContainer: {
    marginBottom: spacing[3],
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  dangerButtonContainer: {
    marginTop: spacing[3],
  },
  spacer: {
    height: spacing[6],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing[2],
  },
});

export default AccountMainScreen;

