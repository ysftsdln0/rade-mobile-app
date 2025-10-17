import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../../components/common/AppCard';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../../constants';
import { colors } from '../../../styles/colors';

type Props = {
  email: string;
  values: {
    firstName: string;
    lastName: string;
    company: string;
    phone: string;
  };
  onChange: (field: keyof Props['values'], value: string) => void;
  onSave: () => void;
  saving: boolean;
  completionPercent: number;
};

export const ProfileCard: React.FC<Props> = ({ email, values, onChange, onSave, saving, completionPercent }) => {
  return (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Profil Bilgileri</Text>
          <Text style={styles.cardSubtitle}>Bilgilerinizi güncel tutun</Text>
        </View>
        <View style={styles.completionBadge}>
          <Ionicons name="sparkles-outline" size={16} color={COLORS.primary.main} />
          <Text style={styles.completionText}>{completionPercent}%</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
      </View>

      <View style={styles.formField}>
        <Text style={styles.inputLabel}>E-posta</Text>
        <View style={styles.readonlyField}>
          <Ionicons name="mail-outline" size={18} color={COLORS.gray500} />
          <Text style={styles.readonlyValue}>{email}</Text>
        </View>
      </View>

      {renderInput('Ad', 'firstName', values.firstName, onChange)}
      {renderInput('Soyad', 'lastName', values.lastName, onChange)}
      {renderInput('Şirket', 'company', values.company, onChange, 'Şirket (opsiyonel)')}
      {renderInput('Telefon', 'phone', values.phone, onChange, 'Telefon', 'phone-pad')}

      <TouchableOpacity
        style={[styles.primaryButton, saving && styles.buttonDisabled]}
        onPress={onSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Ionicons name="save-outline" size={18} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Değişiklikleri Kaydet</Text>
          </>
        )}
      </TouchableOpacity>
    </AppCard>
  );
};

const renderInput = (
  label: string,
  field: keyof Props['values'],
  value: string,
  onChange: Props['onChange'],
  placeholder?: string,
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
) => (
  <View style={styles.formField} key={field}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.textInput}
      placeholder={placeholder ?? label}
      placeholderTextColor={COLORS.textDisabled}
      value={value}
      onChangeText={(text) => onChange(field, text)}
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
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
    backgroundColor: `${COLORS.primary.main}15`,
    borderRadius: 20,
  },
  completionText: {
    marginLeft: 6,
    color: COLORS.primary.main,
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
    backgroundColor: COLORS.primary.main,
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
    backgroundColor: COLORS.primary.main,
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
});
