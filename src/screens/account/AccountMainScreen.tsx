import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import AppCard from '../../components/common/AppCard';
import { ListItem } from '../../components/common/ListItem';
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
  const paymentSummary = paymentMethodsQuery.isLoading
    ? 'Yükleniyor...'
    : describePaymentMethod(defaultPaymentMethod);

  const formattedLastLogin = useMemo(() => formatDateTime(user?.lastLogin), [user?.lastLogin]);
  const profileCompletion = useMemo(() => {
    const fields = [firstName, lastName, phone, company];
    const filled = fields.filter((field) => field && field.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [firstName, lastName, phone, company]);

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
      <LinearGradient
        colors={[COLORS.primary, '#001eff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerName}>{displayName}</Text>
          <Text style={styles.headerEmail}>{user.email}</Text>
          {formattedLastLogin ? (
            <Text style={styles.lastLoginText}>
              Son giriş: {formattedLastLogin.date} · {formattedLastLogin.time}
            </Text>
          ) : null}
        </View>
      </LinearGradient>

      <View style={styles.metricsRow}>
        {metrics.map((item, index) => (
          <View
            key={item.id}
            style={[styles.metricCard, index === metrics.length - 1 && styles.metricCardLast]}
          >
            <View style={styles.metricIconCircle}>
              <Ionicons name={item.icon} size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.metricValue}>{item.value}</Text>
            <Text style={styles.metricLabel}>{item.label}</Text>
            {item.caption ? <Text style={styles.metricCaption}>{item.caption}</Text> : null}
          </View>
        ))}
      </View>

      <AppCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Profil Bilgileri</Text>
            <Text style={styles.cardSubtitle}>Bilgilerinizi güncel tutun</Text>
          </View>
          <View style={styles.completionBadge}>
            <Ionicons name="sparkles-outline" size={16} color={COLORS.primary} />
            <Text style={styles.completionText}>{profileCompletion}%</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${profileCompletion}%` }]} />
        </View>

        <View style={styles.formField}>
          <Text style={styles.inputLabel}>E-posta</Text>
          <View style={styles.readonlyField}>
            <Ionicons name="mail-outline" size={18} color={COLORS.gray500} />
            <Text style={styles.readonlyValue}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.inputLabel}>Ad</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ad"
            placeholderTextColor={COLORS.textDisabled}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.inputLabel}>Soyad</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Soyad"
            placeholderTextColor={COLORS.textDisabled}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.inputLabel}>Şirket</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Şirket (opsiyonel)"
            placeholderTextColor={COLORS.textDisabled}
            value={company}
            onChangeText={setCompany}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.inputLabel}>Telefon</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Telefon"
            placeholderTextColor={COLORS.textDisabled}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, savingProfile && styles.buttonDisabled]}
          onPress={saveProfile}
          disabled={savingProfile}
        >
          {savingProfile ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Değişiklikleri Kaydet</Text>
            </>
          )}
        </TouchableOpacity>
      </AppCard>

      <AppCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Güvenlik</Text>
            <Text style={styles.cardSubtitle}>Hesabınızı güçlü tutun</Text>
          </View>
        </View>

        <View style={styles.securityRow}>
          <View style={styles.securityIcon}>
            <Ionicons name="finger-print" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>Biyometrik Giriş</Text>
            <Text style={styles.securityCaption}>Desteklenen cihazlarda hızlı giriş</Text>
          </View>
          <View style={styles.securityAction}>
            <View
              style={[
                styles.statusPill,
                bioSwitch ? styles.statusPillActive : styles.statusPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  bioSwitch ? styles.statusPillTextActive : styles.statusPillTextInactive,
                ]}
              >
                {bioSwitch ? 'Aktif' : 'Pasif'}
              </Text>
            </View>
            <Switch
              value={bioSwitch}
              onValueChange={toggleBiometric}
              thumbColor={bioSwitch ? COLORS.secondary : COLORS.gray300}
              trackColor={{ true: '#FFD18A', false: COLORS.gray300 }}
            />
          </View>
        </View>

        <View style={styles.securityRow}>
          <View style={styles.securityIcon}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>İki Adımlı Doğrulama</Text>
            <Text style={styles.securityCaption}>
              {twoFactorLoading
                ? 'Durum kontrol ediliyor...'
                : twoFactorEnabled
                ? 'Hesabınız ek güvenlik katmanıyla korunuyor'
                : 'Ek güvenlik için 2FA’yı etkinleştirin'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.securityButton}
            onPress={() => navigation.navigate('Security')}
          >
            <Text style={styles.securityButtonText}>{twoFactorEnabled ? 'Yönet' : 'Kur'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.collapseToggle} onPress={togglePasswordForm}>
          <View style={styles.securityIcon}>
            <Ionicons name="key-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>Şifreyi Güncelle</Text>
            <Text style={styles.securityCaption}>Güçlü bir şifre belirleyin</Text>
          </View>
          <Ionicons
            name={showPasswordForm ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORS.gray500}
          />
        </TouchableOpacity>

        {showPasswordForm ? (
          <View style={styles.passwordForm}>
            <TextInput
              style={styles.textInput}
              placeholder="Mevcut şifre"
              placeholderTextColor={COLORS.textDisabled}
              secureTextEntry
              value={currentPw}
              onChangeText={setCurrentPw}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Yeni şifre"
              placeholderTextColor={COLORS.textDisabled}
              secureTextEntry
              value={pw1}
              onChangeText={setPw1}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Yeni şifre (tekrar)"
              placeholderTextColor={COLORS.textDisabled}
              secureTextEntry
              value={pw2}
              onChangeText={setPw2}
            />
            <TouchableOpacity
              style={[styles.secondaryButton, changingPassword && styles.buttonDisabled]}
              onPress={changePassword}
              disabled={changingPassword}
            >
              {changingPassword ? (
                <ActivityIndicator color={COLORS.textPrimary} />
              ) : (
                <Text style={styles.secondaryButtonText}>Şifreyi Değiştir</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </AppCard>

      <AppCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Faturalama Özeti</Text>
            <Text style={styles.cardSubtitle}>Ödemelerinizi takip edin</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {invoicesQuery.isLoading ? '...' : outstandingInvoices}
            </Text>
            <Text style={styles.summaryLabel}>Bekleyen Fatura</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValueSmall}>{paymentSummary}</Text>
            <Text style={styles.summaryLabel}>Varsayılan Ödeme</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.outlineButton, styles.buttonRowItem]}
            onPress={() => navigation.navigate('InvoiceList')}
          >
            <Ionicons name="card-outline" size={18} color={COLORS.primary} style={styles.buttonIcon} />
            <Text style={styles.outlineButtonText}>Faturaları Gör</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.outlineButton, styles.buttonRowItem, styles.buttonRowItemLast]}
            onPress={() => navigation.navigate('PaymentMethods')}
          >
            <Ionicons name="wallet-outline" size={18} color={COLORS.primary} style={styles.buttonIcon} />
            <Text style={styles.outlineButtonText}>Ödeme Yöntemleri</Text>
          </TouchableOpacity>
        </View>
      </AppCard>

      <AppCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Hızlı İşlemler</Text>
            <Text style={styles.cardSubtitle}>Sık kullanılan sayfalara atlayın</Text>
          </View>
        </View>

        <ListItem
          title="Profil detaylarını görüntüle"
          subtitle="Ad, soyad ve iletişim bilgileri"
          icon="person-circle-outline"
          onPress={() => navigation.navigate('Profile')}
        />
        <ListItem
          title="Güvenlik ayarları"
          subtitle="2FA, cihaz yönetimi ve oturumlar"
          icon="shield-half-outline"
          onPress={() => navigation.navigate('Security')}
        />
        <ListItem
          title="Bildirim tercihleri"
          subtitle="Push, e-posta ve SMS ayarları"
          icon="notifications-outline"
          onPress={() => navigation.navigate('NotificationSettings')}
        />
        <ListItem
          title="Faturalar & ödemeler"
          subtitle="Fatura geçmişi ve kart yönetimi"
          icon="card-outline"
          onPress={() => navigation.navigate('InvoiceList')}
        />
      </AppCard>

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
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 22,
  },
  headerContent: {
    flex: 1,
  },
  headerName: {
    color: '#FFF',
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
  },
  headerEmail: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONT_SIZES.sm,
    marginTop: 4,
  },
  lastLoginText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZES.xs,
    marginTop: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginRight: SPACING.sm,
  },
  metricCardLast: {
    marginRight: 0,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  metricValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metricCaption: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    marginTop: 4,
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
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: 20,
  },
  completionText: {
    marginLeft: 6,
    color: COLORS.primary,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 4,
    backgroundColor: COLORS.gray200,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  formField: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  readonlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  readonlyValue: {
    marginLeft: SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  primaryButton: {
    marginTop: SPACING.md,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  securityIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  securityCaption: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  securityAction: {
    alignItems: 'flex-end',
  },
  statusPill: {
    borderRadius: 16,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    marginBottom: 6,
  },
  statusPillActive: {
    backgroundColor: `${COLORS.success}20`,
  },
  statusPillInactive: {
    backgroundColor: COLORS.gray100,
  },
  statusPillText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  statusPillTextActive: {
    color: COLORS.success,
  },
  statusPillTextInactive: {
    color: COLORS.gray500,
  },
  securityButton: {
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  securityButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  collapseToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  passwordForm: {
    marginTop: SPACING.sm,
  },
  secondaryButton: {
    marginTop: SPACING.md,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  summaryItem: {
    flex: 1,
    marginRight: SPACING.md,
  },
  summaryValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  summaryValueSmall: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRowItem: {
    marginRight: SPACING.sm,
  },
  buttonRowItemLast: {
    marginRight: 0,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
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
});

export default AccountMainScreen;
