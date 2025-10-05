import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import AppCard from '../../components/common/AppCard';
import { useAppDispatch, useAppSelector } from '../../store';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants';
import { apiService } from '../../services/api';
import { HostingPackage, ActivityItem } from '../../types';
import { useInvoices } from '../../hooks/useInvoices';
import { useTwoFactor } from '../../hooks/useTwoFactor';
import { PaymentMethodSummary } from '../../services/external/BillingProvider';
import { updateProfileAsync, logoutAsync } from '../../store/authThunks';
import { storageService } from '../../services/storage';
import { setBiometricEnabled } from '../../store/authSlice';
import { AccountHeader } from './components/AccountHeader';
import { MetricsRow } from './components/MetricsRow';
import { ProfileCard } from './components/ProfileCard';
import { SecurityCard } from './components/SecurityCard';
import { BillingSummaryCard } from './components/BillingSummaryCard';
import { QuickActionsCard } from './components/QuickActionsCard';

const AccountMainScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { user, biometricEnabled } = useAppSelector((s) => s.auth);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [company, setCompany] = useState(user?.company || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [bioSwitch, setBioSwitch] = useState<boolean>(biometricEnabled);

  const hostingQuery = useQuery({
    queryKey: ['hostingPackages'],
    queryFn: async () => {
      const response = await apiService.getHostingPackages();
      return response.data as HostingPackage[];
    },
    enabled: !!user,
  });

  const activityQuery = useQuery({
    queryKey: ['recentActivities'],
    queryFn: async () => {
      const response = await apiService.getRecentActivities();
      return response.data as ActivityItem[];
    },
    enabled: !!user,
  });

  const { invoicesQuery, paymentMethodsQuery } = useInvoices();
  const { enabled: twoFactorEnabled, statusLoading: twoFactorLoading } = useTwoFactor();

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setCompany(user?.company || '');
    setPhone(user?.phone || '');
  }, [user]);

  const displayName = useMemo(() => {
    if (firstName || lastName) return `${firstName} ${lastName}`.trim();
    return user?.email?.split('@')[0] || 'Kullanıcı';
  }, [firstName, lastName, user?.email]);

  const initials = useMemo(() => {
    const fromNames = `${firstName} ${lastName}`.trim();
    if (fromNames) {
      return fromNames
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join('');
    }
    const emailName = user?.email?.split('@')[0] || '';
    return (emailName[0] || 'U').toUpperCase();
  }, [firstName, lastName, user?.email]);

  const hostingPackages = hostingQuery.data ?? [];
  const activeServiceCount = useMemo(
    () => hostingPackages.filter((item) => item.status === 'active').length,
    [hostingPackages]
  );

  const outstandingInvoices = useMemo(() => {
    const invoices = invoicesQuery.data ?? [];
    return invoices.filter((invoice) => invoice.status === 'unpaid' || invoice.status === 'overdue').length;
  }, [invoicesQuery.data]);

  const defaultPaymentMethod = paymentMethodsQuery.data?.find((method) => method.isDefault);
  const paymentSummaryText = paymentMethodsQuery.isLoading
    ? 'Yükleniyor...'
    : describePaymentMethod(defaultPaymentMethod);

  const formattedLastLogin = useMemo(() => formatDateTime(user?.lastLogin), [user?.lastLogin]);
  const profileCompletion = useMemo(() => {
    const fields = [firstName, lastName, phone, company];
    const filled = fields.filter((field) => field && field.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [firstName, lastName, phone, company]);

  const lastLoginText = useMemo(() => {
    if (!formattedLastLogin) return undefined;
    return `Son giriş: ${formattedLastLogin.date} · ${formattedLastLogin.time}`;
  }, [formattedLastLogin]);

  const outstandingInvoicesText = invoicesQuery.isLoading
    ? '...'
    : outstandingInvoices.toString();

  const metrics = useMemo(
    () => [
      {
        id: 'services',
        icon: 'server-outline' as keyof typeof Ionicons.glyphMap,
        label: 'Aktif Hizmet',
        value: hostingQuery.isLoading ? '...' : activeServiceCount.toString(),
        caption: hostingQuery.isLoading
          ? 'Yükleniyor'
          : `${hostingPackages.length} toplam hizmet`,
      },
      {
        id: 'invoices',
        icon: 'card-outline' as keyof typeof Ionicons.glyphMap,
        label: 'Bekleyen Fatura',
        value: invoicesQuery.isLoading ? '...' : outstandingInvoices.toString(),
        caption: invoicesQuery.isLoading
          ? 'Kontrol ediliyor'
          : outstandingInvoices > 0
          ? 'Ödeme bekleyen faturalar var'
          : 'Tüm ödemeler güncel',
      },
      {
        id: 'lastLogin',
        icon: 'time-outline' as keyof typeof Ionicons.glyphMap,
        label: 'Son Giriş',
        value: formattedLastLogin?.date ?? '—',
        caption: formattedLastLogin?.time ?? '',
      },
    ],
    [
      hostingQuery.isLoading,
      hostingPackages.length,
      activeServiceCount,
      invoicesQuery.isLoading,
      outstandingInvoices,
      formattedLastLogin,
    ]
  );

  const recentActivities = activityQuery.data ?? [];
  const topActivities = recentActivities.slice(0, 3);

  const quickActions = useMemo(
    () => [
      {
        title: 'Profil detaylarını görüntüle',
        subtitle: 'Ad, soyad ve iletişim bilgileri',
        icon: 'person-circle-outline',
        onPress: () => navigation.navigate('Profile'),
      },
      {
        title: 'Güvenlik ayarları',
        subtitle: '2FA, cihaz yönetimi ve oturumlar',
        icon: 'shield-half-outline',
        onPress: () => navigation.navigate('Security'),
      },
      {
        title: 'Bildirim tercihleri',
        subtitle: 'Push, e-posta ve SMS ayarları',
        icon: 'notifications-outline',
        onPress: () => navigation.navigate('NotificationSettings'),
      },
      {
        title: 'Faturalar & ödemeler',
        subtitle: 'Fatura geçmişi ve kart yönetimi',
        icon: 'card-outline',
        onPress: () => navigation.navigate('InvoiceList'),
      },
    ],
    [navigation]
  );

  const handleProfileFieldChange = useCallback(
    (field: 'firstName' | 'lastName' | 'company' | 'phone', value: string) => {
      switch (field) {
        case 'firstName':
          setFirstName(value);
          break;
        case 'lastName':
          setLastName(value);
          break;
        case 'company':
          setCompany(value);
          break;
        case 'phone':
          setPhone(value);
          break;
        default:
          break;
      }
    },
    []
  );

  const handlePasswordFieldChange = useCallback(
    (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => {
      switch (field) {
        case 'currentPassword':
          setCurrentPw(value);
          break;
        case 'newPassword':
          setPw1(value);
          break;
        case 'confirmPassword':
          setPw2(value);
          break;
        default:
          break;
      }
    },
    []
  );

  const saveProfile = async () => {
    try {
      setSavingProfile(true);
      const result = await dispatch(updateProfileAsync({ firstName, lastName, company, phone }));
      if (updateProfileAsync.fulfilled.match(result)) {
        Alert.alert('Başarılı', 'Profil bilgileri güncellendi.');
      } else {
        Alert.alert('Hata', (result.payload as string) || 'Profil güncellenemedi');
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (!currentPw || currentPw.length < 6) {
      Alert.alert('Hata', 'Mevcut şifre en az 6 karakter olmalı');
      return;
    }
    if (pw1.length < 6 || pw2.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalı');
      return;
    }
    if (pw1 !== pw2) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    try {
      setChangingPassword(true);
      const response = await apiService.changePassword(currentPw, pw2);
      if (response.success) {
        Alert.alert('Başarılı', 'Şifre değiştirildi.');
        setCurrentPw('');
        setPw1('');
        setPw2('');
        setShowPasswordForm(false);
      } else {
        Alert.alert('Hata', response.message || 'Şifre değiştirilemedi');
      }
    } catch (error: any) {
      Alert.alert('Hata', error?.response?.data?.message || 'Ağ hatası');
    } finally {
      setChangingPassword(false);
    }
  };

  const toggleBiometric = async (value: boolean) => {
    setBioSwitch(value);
    await storageService.setBiometricEnabled(value);
    dispatch(setBiometricEnabled(value));
  };

  const togglePasswordForm = () => {
    setShowPasswordForm((prev) => !prev);
  };

  const doLogout = async () => {
    await dispatch(logoutAsync());
  };

  if (!user) {
    return (
      <View style={[styles.loaderContainer, styles.centered]}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={styles.loaderText}>Kullanıcı bilgisi yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <AccountHeader
        displayName={displayName}
        email={user.email}
        initials={initials}
        lastLoginText={lastLoginText}
      />

      <MetricsRow metrics={metrics} />

      <ProfileCard
        email={user.email}
        values={{ firstName, lastName, company, phone }}
        onChange={handleProfileFieldChange}
        onSave={saveProfile}
        saving={savingProfile}
        completionPercent={profileCompletion}
      />

      <SecurityCard
        biometricEnabled={bioSwitch}
        onToggleBiometric={toggleBiometric}
        twoFactorEnabled={twoFactorEnabled}
        twoFactorLoading={twoFactorLoading}
        onPressTwoFactor={() => navigation.navigate('Security')}
        passwordFormVisible={showPasswordForm}
        onTogglePasswordForm={togglePasswordForm}
        passwordFields={{
          currentPassword: currentPw,
          newPassword: pw1,
          confirmPassword: pw2,
        }}
        onChangePasswordField={handlePasswordFieldChange}
        onSubmitPassword={changePassword}
        submittingPassword={changingPassword}
      />

      <BillingSummaryCard
        outstandingInvoices={outstandingInvoicesText}
        paymentSummary={paymentSummaryText}
        onPressInvoices={() => navigation.navigate('InvoiceList')}
        onPressPaymentMethods={() => navigation.navigate('PaymentMethods')}
      />

      <QuickActionsCard actions={quickActions} />

      <AppCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Son Aktiviteler</Text>
            <Text style={styles.cardSubtitle}>Hesabınızda gerçekleşen işlemler</Text>
          </View>
        </View>

        {activityQuery.isLoading ? (
          <View style={styles.inlineLoader}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loaderText}>Aktiviteler yükleniyor...</Text>
          </View>
        ) : topActivities.length > 0 ? (
          topActivities.map((activity) => {
            const meta = getActivityPresentation(activity.type);
            return (
              <View key={activity.id} style={styles.activityRow}>
                <View style={[styles.activityIcon, { backgroundColor: `${meta.color}20` }]}>
                  <Ionicons name={meta.icon} size={18} color={meta.color} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  {activity.context ? (
                    <Text style={styles.activitySubtitle}>{activity.context}</Text>
                  ) : null}
                  <Text style={styles.activityTime}>{formatRelativeTime(activity.createdAt)}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>Henüz aktivite bulunmuyor.</Text>
        )}
      </AppCard>

      <TouchableOpacity style={styles.logoutBtn} onPress={doLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FFF" style={styles.buttonIcon} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const describePaymentMethod = (method?: PaymentMethodSummary) => {
  if (!method) return 'Tanımlı değil';

  switch (method.type) {
    case 'credit_card':
      return `${method.cardType ?? 'Kart'} ···· ${method.lastFour ?? 'XXXX'}`;
    case 'paypal':
      return 'PayPal';
    case 'bank_transfer':
      return 'Banka Transferi';
    default:
      return method.type;
  }
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  return {
    date: date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

const formatRelativeTime = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Az önce';
  if (diffMinutes < 60) return `${diffMinutes} dk önce`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} sa önce`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} gün önce`;

  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getActivityPresentation = (type: string) => {
  switch (type) {
    case 'ssl':
      return { icon: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap, color: COLORS.success };
    case 'backup':
      return { icon: 'cloud-upload-outline' as keyof typeof Ionicons.glyphMap, color: COLORS.info };
    case 'invoice':
      return { icon: 'card-outline' as keyof typeof Ionicons.glyphMap, color: COLORS.warning };
    default:
      return {
        icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
        color: COLORS.primary,
      };
  }
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    paddingBottom: SPACING.xl,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: SPACING.sm,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  inlineLoader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  activityIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  activitySubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    marginTop: 4,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  logoutBtn: {
    marginTop: SPACING.md,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: FONT_SIZES.md,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default AccountMainScreen;
