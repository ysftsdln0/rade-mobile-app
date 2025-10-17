import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../../components/common/AppCard';
import { FONT_SIZES, SPACING, BORDER_RADIUS } from '../../../constants';
import { colors } from '../../../styles/colors';

type PasswordFields = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type Props = {
  biometricEnabled: boolean;
  onToggleBiometric: (value: boolean) => void;
  twoFactorEnabled: boolean;
  twoFactorLoading: boolean;
  onPressTwoFactor: () => void;
  passwordFormVisible: boolean;
  onTogglePasswordForm: () => void;
  passwordFields: PasswordFields;
  onChangePasswordField: (field: keyof PasswordFields, value: string) => void;
  onSubmitPassword: () => void;
  submittingPassword: boolean;
};

export const SecurityCard: React.FC<Props> = ({
  biometricEnabled,
  onToggleBiometric,
  twoFactorEnabled,
  twoFactorLoading,
  onPressTwoFactor,
  passwordFormVisible,
  onTogglePasswordForm,
  passwordFields,
  onChangePasswordField,
  onSubmitPassword,
  submittingPassword,
}) => {
  return (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Güvenlik</Text>
        <Text style={styles.cardSubtitle}>Hesabınızı güçlü tutun</Text>
      </View>

      <View style={styles.securityRow}>
        <View style={styles.securityIcon}>
          <Ionicons name="finger-print" size={20} color={colors.primary[500]} />
        </View>
        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>Biyometrik Giriş</Text>
          <Text style={styles.securityCaption}>Desteklenen cihazlarda hızlı giriş</Text>
        </View>
        <View style={styles.securityAction}>
          <View
            style={[
              styles.statusPill,
              biometricEnabled ? styles.statusPillActive : styles.statusPillInactive,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                biometricEnabled ? styles.statusPillTextActive : styles.statusPillTextInactive,
              ]}
            >
              {biometricEnabled ? 'Aktif' : 'Pasif'}
            </Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={onToggleBiometric}
            thumbColor={biometricEnabled ? colors.accent.gradient_end : colors.neutral[300]}
            trackColor={{ true: '#FFD18A', false: colors.neutral[300] }}
          />
        </View>
      </View>

      <View style={styles.securityRow}>
        <View style={styles.securityIcon}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary[500]} />
        </View>
        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>İki Adımlı Doğrulama</Text>
          <Text style={styles.securityCaption}>
            {twoFactorLoading
              ? 'Durum kontrol ediliyor...'
              : twoFactorEnabled
              ? 'Hesabınız ek güvenlik katmanıyla korunuyor'
              : "Ek güvenlik için 2FA'yı etkinleştirin"}
          </Text>
        </View>
        <TouchableOpacity style={styles.securityButton} onPress={onPressTwoFactor}>
          <Text style={styles.securityButtonText}>{twoFactorEnabled ? 'Yönet' : 'Kur'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.collapseToggle} onPress={onTogglePasswordForm}>
        <View style={styles.securityIcon}>
          <Ionicons name="key-outline" size={20} color={colors.primary[500]} />
        </View>
        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>Şifreyi Güncelle</Text>
          <Text style={styles.securityCaption}>Güçlü bir şifre belirleyin</Text>
        </View>
        <Ionicons
          name={passwordFormVisible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.neutral[500]}
        />
      </TouchableOpacity>

          {passwordFormVisible ? (
        <View style={styles.passwordForm}>
          {renderPasswordInput('Mevcut şifre', 'currentPassword', passwordFields.currentPassword, onChangePasswordField)}
          {renderPasswordInput('Yeni şifre', 'newPassword', passwordFields.newPassword, onChangePasswordField)}
          {renderPasswordInput('Yeni şifre (tekrar)', 'confirmPassword', passwordFields.confirmPassword, onChangePasswordField)}
          <TouchableOpacity
            style={[styles.secondaryButton, submittingPassword && styles.buttonDisabled]}
            onPress={onSubmitPassword}
            disabled={submittingPassword}
          >
            {submittingPassword ? (
              <ActivityIndicator color={colors.neutral[900]} />
            ) : (
              <Text style={styles.secondaryButtonText}>Şifreyi Değiştir</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </AppCard>
  );
};

const renderPasswordInput = (
  placeholder: string,
  field: keyof PasswordFields,
  value: string,
  onChange: Props['onChangePasswordField'],
) => (
  <TextInput
    key={field}
    style={styles.textInput}
    placeholder={placeholder}
    placeholderTextColor={colors.neutral[300]}
    secureTextEntry
    value={value}
    onChangeText={(text) => onChange(field, text)}
  />
);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: colors.neutral[600],
    marginTop: 4,
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
    backgroundColor: `${colors.primary[500]}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: FONT_SIZES.md,
    color: colors.neutral[900],
    fontWeight: '600',
  },
  securityCaption: {
    fontSize: FONT_SIZES.xs,
    color: colors.neutral[600],
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
    backgroundColor: `${colors.semantic.success}20`,
  },
  statusPillInactive: {
    backgroundColor: colors.neutral[100],
  },
  statusPillText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  statusPillTextActive: {
    color: colors.semantic.success,
  },
  statusPillTextInactive: {
    color: colors.neutral[500],
  },
  securityButton: {
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  securityButtonText: {
    color: colors.primary[500],
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
  textInput: {
    backgroundColor: colors.neutral[100],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    color: colors.neutral[900],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: SPACING.sm,
  },
  secondaryButton: {
    marginTop: SPACING.md,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.neutral[900],
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
