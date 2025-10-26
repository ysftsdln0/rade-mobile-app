/**
 * SecurityScreen
 * 
 * Comprehensive security settings:
 * - Change password
 * - Two-factor authentication
 * - Active sessions
 * - Login history
 * - Security recommendations
 */
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { colors, spacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';
import { useLanguage } from '../../utils/LanguageContext';
import { 
  Card, 
  TextInput, 
  Button, 
  Badge,
  AlertBanner,
} from '../../components/common';
import { useTwoFactor } from '../../hooks/useTwoFactor';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gerekli'),
  newPassword: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/[A-Z]/, 'En az bir büyük harf içermeli')
    .regex(/[a-z]/, 'En az bir küçük harf içermeli')
    .regex(/[0-9]/, 'En az bir rakam içermeli')
    .regex(/[^a-zA-Z0-9]/, 'En az bir özel karakter içermeli'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface SecurityItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  status?: 'success' | 'warning' | 'danger';
  statusText?: string;
  showChevron?: boolean;
}

const SecurityItem: React.FC<SecurityItemProps> = ({ 
  icon, 
  title, 
  subtitle,
  onPress,
  status,
  statusText,
  showChevron = true,
}) => {
  const { colors: themeColors } = useTheme();
  
  const iconColors = {
    success: colors.semantic.success,
    warning: colors.semantic.warning,
    danger: colors.semantic.error,
  };

  return (
    <TouchableOpacity style={styles.securityItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.securityItemLeft}>
        <View style={[
          styles.securityIconContainer, 
          { backgroundColor: status ? `${iconColors[status]}15` : themeColors.surfaceAlt }
        ]}>
          <Ionicons 
            name={icon as any} 
            size={22} 
            color={status ? iconColors[status] : themeColors.primary} 
          />
        </View>
        <View style={styles.securityTextContainer}>
          <Text style={[styles.securityItemTitle, { color: themeColors.text }]}>{title}</Text>
          <Text style={[styles.securityItemSubtitle, { color: themeColors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={styles.securityItemRight}>
        {statusText && (
          <Badge 
            label={statusText} 
            variant={status === 'success' ? 'success' : status === 'warning' ? 'warning' : 'error'} 
          />
        )}
        {showChevron && (
          <Ionicons name="chevron-forward" size={20} color={themeColors.textTertiary} style={{ marginLeft: spacing[2] }} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SecurityScreen = () => {
  const navigation = useNavigation<any>();
  const { colors: themeColors, isDark } = useTheme();
  const { t } = useLanguage();
  
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);

  const { enabled: twoFactorEnabled, statusLoading: twoFactorLoading } = useTwoFactor();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitPassword = async (values: PasswordFormValues) => {
    try {
      // API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi');
      reset();
      setShowPasswordSection(false);
    } catch (error) {
      Alert.alert('Hata', 'Şifre değiştirme başarısız oldu');
    }
  };

  // Mock active sessions data
  const activeSessions = [
    { 
      id: '1', 
      device: 'iPhone 15 Pro', 
      location: 'Istanbul, Turkey',
      lastActive: '2 dk önce',
      current: true,
    },
    { 
      id: '2', 
      device: 'Chrome on MacBook', 
      location: 'Istanbul, Turkey',
      lastActive: '2 saat önce',
      current: false,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >

        {/* Security Status Alert */}
        <View style={styles.section}>
          <AlertBanner
            type="success"
            title="Güvenli"
            message="Hesabınız güvenli. Tüm güvenlik önerileri aktif."
            dismissible={false}
          />
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <Card title="Şifre" variant="elevated">
            {!showPasswordSection ? (
              <>
                <SecurityItem
                  icon="lock-closed"
                  title="Şifre Değiştir"
                  subtitle="Son değişiklik: 30 gün önce"
                  onPress={() => setShowPasswordSection(true)}
                  showChevron={false}
                />
                <Button
                  label="Şifremi Değiştir"
                  variant="primary"
                  size="sm"
                  onPress={() => setShowPasswordSection(true)}
                  fullWidth
                  style={{ marginTop: spacing[3] }}
                />
              </>
            ) : (
              <>
                <Controller
                  control={control}
                  name="currentPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        label="Mevcut Şifre"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Mevcut şifrenizi girin"
                        secureTextEntry={!showCurrentPassword}
                        error={errors.currentPassword?.message}
                        icon={<Ionicons name="lock-closed-outline" size={20} color={themeColors.textSecondary} />}
                        containerStyle={styles.passwordInputContainer}
                      />
                      <TouchableOpacity
                        style={styles.eyeToggle}
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        <Ionicons
                          name={showCurrentPassword ? "eye-outline" : "eye-off-outline"}
                          size={20}
                          color={themeColors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        label="Yeni Şifre"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Yeni şifrenizi oluşturun"
                        secureTextEntry={!showNewPassword}
                        error={errors.newPassword?.message}
                        icon={<Ionicons name="key-outline" size={20} color={themeColors.textSecondary} />}
                        containerStyle={styles.passwordInputContainer}
                      />
                      <TouchableOpacity
                        style={styles.eyeToggle}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Ionicons
                          name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                          size={20}
                          color={themeColors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        label="Şifre Tekrar"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Yeni şifrenizi tekrar girin"
                        secureTextEntry={!showConfirmPassword}
                        error={errors.confirmPassword?.message}
                        icon={<Ionicons name="key-outline" size={20} color={themeColors.textSecondary} />}
                        containerStyle={styles.passwordInputContainer}
                      />
                      <TouchableOpacity
                        style={styles.eyeToggle}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                          size={20}
                          color={themeColors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />

                <View style={styles.buttonRow}>
                  <Button
                    label="Kaydet"
                    variant="primary"
                    size="sm"
                    onPress={handleSubmit(onSubmitPassword)}
                    loading={isSubmitting}
                    style={{ flex: 1 }}
                  />
                  <Button
                    label="İptal"
                    variant="secondary"
                    size="sm"
                    onPress={() => {
                      reset();
                      setShowPasswordSection(false);
                    }}
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            )}
          </Card>
        </View>

        {/* Two-Factor Authentication */}
        <View style={styles.section}>
          <Card title="İki Faktörlü Doğrulama" variant="elevated">
            <SecurityItem
              icon="shield-checkmark"
              title="2FA"
              subtitle={twoFactorEnabled ? "Hesabınız ekstra güvende" : "Hesabınızı ekstra güvenceye alın"}
              onPress={() => navigation.navigate('TwoFactor')}
              status={twoFactorEnabled ? 'success' : 'warning'}
              statusText={twoFactorEnabled ? 'Aktif' : 'Pasif'}
            />
          </Card>
        </View>

        {/* Biometric & Login Alerts */}
        <View style={styles.section}>
          <Card title="Hızlı Giriş & Bildirimler" variant="elevated">
            <View style={styles.switchItem}>
              <View style={styles.switchItemLeft}>
                <Ionicons name="finger-print" size={24} color={themeColors.primary} />
                <View style={styles.switchTextContainer}>
                  <Text style={[styles.switchTitle, { color: themeColors.text }]}>
                    Biyometrik Giriş
                  </Text>
                  <Text style={[styles.switchSubtitle, { color: themeColors.textSecondary }]}>
                    Touch ID / Face ID ile giriş
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: colors.neutral[300], true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

            <View style={styles.switchItem}>
              <View style={styles.switchItemLeft}>
                <Ionicons name="notifications" size={24} color={themeColors.primary} />
                <View style={styles.switchTextContainer}>
                  <Text style={[styles.switchTitle, { color: themeColors.text }]}>
                    Giriş Bildirimleri
                  </Text>
                  <Text style={[styles.switchSubtitle, { color: themeColors.textSecondary }]}>
                    Yeni giriş yapıldığında bildirim al
                  </Text>
                </View>
              </View>
              <Switch
                value={loginNotifications}
                onValueChange={setLoginNotifications}
                trackColor={{ false: colors.neutral[300], true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>
        </View>

        {/* Active Sessions */}
        <View style={styles.section}>
          <Card title="Aktif Oturumlar" variant="elevated">
            {activeSessions.map((session, index) => (
              <View key={session.id}>
                {index > 0 && <View style={[styles.divider, { backgroundColor: themeColors.border }]} />}
                <View style={styles.sessionItem}>
                  <View style={styles.sessionIconContainer}>
                    <Ionicons 
                      name={session.device.includes('iPhone') ? 'phone-portrait' : 'desktop'} 
                      size={24} 
                      color={themeColors.text} 
                    />
                  </View>
                  <View style={styles.sessionInfo}>
                    <View style={styles.sessionHeader}>
                      <Text style={[styles.sessionDevice, { color: themeColors.text }]}>
                        {session.device}
                      </Text>
                      {session.current && (
                        <Badge label="Şu an" variant="success" />
                      )}
                    </View>
                    <Text style={[styles.sessionLocation, { color: themeColors.textSecondary }]}>
                      {session.location}
                    </Text>
                    <Text style={[styles.sessionTime, { color: themeColors.textTertiary }]}>
                      {session.lastActive}
                    </Text>
                  </View>
                  {!session.current && (
                    <TouchableOpacity 
                      onPress={() => Alert.alert('Oturumu Sonlandır', `${session.device} oturumunu sonlandırmak istediğinize emin misiniz?`)}
                    >
                      <Ionicons name="close-circle" size={24} color={colors.semantic.error} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Security Recommendations */}
        <View style={styles.section}>
          <Card title="Güvenlik Önerileri" variant="default">
            <View style={styles.recommendationItem}>
              <Ionicons name="checkmark-circle" size={24} color={colors.semantic.success} />
              <Text style={[styles.recommendationText, { color: themeColors.text }]}>
                Güçlü şifre kullanıyorsunuz
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <Ionicons name="checkmark-circle" size={24} color={colors.semantic.success} />
              <Text style={[styles.recommendationText, { color: themeColors.text }]}>
                2FA aktif
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <Ionicons name="alert-circle" size={24} color={colors.semantic.warning} />
              <Text style={[styles.recommendationText, { color: themeColors.text }]}>
                Şifrenizi 30 gün önce değiştirdiniz. 90 günde bir değiştirmeyi öneririz.
              </Text>
            </View>
          </Card>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  backButton: {
    padding: spacing[2],
    marginRight: spacing[2],
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
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[10],
  },
  section: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[4],
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  securityTextContainer: {
    flex: 1,
  },
  securityItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  securityItemSubtitle: {
    fontSize: 14,
  },
  securityItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInputWrapper: {
    position: 'relative',
    marginBottom: spacing[3],
  },
  passwordInputContainer: {
    marginBottom: 0,
  },
  eyeToggle: {
    position: 'absolute',
    right: spacing[3],
    top: 38,
    padding: spacing[2],
    zIndex: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
  },
  switchItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing[3],
  },
  switchTextContainer: {
    marginLeft: spacing[3],
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  switchSubtitle: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: spacing[2],
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  sessionIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: spacing[2],
  },
  sessionDevice: {
    fontSize: 16,
    fontWeight: '600',
  },
  sessionLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 13,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  spacer: {
    height: spacing[6],
  },
});

export default SecurityScreen;
