import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { colors, spacing } from '../../styles';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerAsync } from '../../store/authThunks';
import { useTheme } from '../../utils/ThemeContext';
import { TextInput } from '../../components/common/TextInput';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../utils/LanguageContext';

const phoneRegex = /^\+?[0-9\s-]{7,}$/;

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Ad zorunlu.'),
    lastName: z.string().min(1, 'Soyad zorunlu.'),
    email: z.string().email('Geçerli bir e-posta girin.'),
    password: z
      .string()
      .min(8, 'Şifre en az 8 karakter olmalı.')
      .regex(/[A-Z]/, 'En az bir büyük harf içermeli.')
      .regex(/[a-z]/, 'En az bir küçük harf içermeli.')
      .regex(/[0-9]/, 'En az bir rakam içermeli.'),
    confirmPassword: z.string(),
    company: z.string().max(100).optional(),
    phone: z
      .string()
      .optional()
      .refine((value) => !value || phoneRegex.test(value ?? ''), {
        message: 'Geçerli bir telefon numarası girin.',
      }),
    acceptTerms: z
      .boolean()
      .refine((value) => value, 'Devam etmek için şartları kabul edin.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor.',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.auth);
  const { colors: themeColors, isDark } = useTheme();
  const { t } = useLanguage();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      phone: '',
      acceptTerms: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const passwordValue = watch('password');
  const acceptTerms = watch('acceptTerms');

  const passwordChecks = useMemo(
    () => [
      { 
        label: 'En az 8 karakter', 
        met: passwordValue.length >= 8,
        icon: 'text-outline' as const
      },
      { 
        label: 'En az bir büyük harf', 
        met: /[A-Z]/.test(passwordValue),
        icon: 'arrow-up-outline' as const
      },
      { 
        label: 'En az bir küçük harf', 
        met: /[a-z]/.test(passwordValue),
        icon: 'arrow-down-outline' as const
      },
      { 
        label: 'En az bir rakam', 
        met: /\d/.test(passwordValue),
        icon: 'keypad-outline' as const
      },
    ],
    [passwordValue]
  );

  const passwordStrength = useMemo(() => {
    const metCount = passwordChecks.filter((check) => check.met).length;
    if (!passwordValue) return { label: 'Şifre Gücü: -', color: colors.neutral[600] };
    if (metCount <= 1) return { label: 'Şifre Gücü: Zayıf', color: colors.semantic.error };
    if (metCount === 2 || metCount === 3) return { label: 'Şifre Gücü: Orta', color: colors.semantic.warning };
    return { label: 'Şifre Gücü: Güçlü', color: colors.semantic.success };
  }, [passwordChecks, passwordValue]);

  const onSubmit = async (values: RegisterFormValues) => {
    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      confirmPassword: values.confirmPassword,
      company: values.company?.trim() ? values.company.trim() : undefined,
      phone: values.phone?.trim() ? values.phone.trim() : undefined,
      acceptTerms: values.acceptTerms,
    };

    const result = await dispatch(registerAsync(payload));
    if (registerAsync.fulfilled.match(result)) {
      navigation.replace('Main');
    } else {
      Alert.alert('Kayıt Hatası', (result.payload as string) || 'Kayıt başarısız');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={themeColors.text} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../../assets/rade-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            
            <Text style={[styles.title, { color: themeColors.text }]}>Hesap Oluştur</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              Bilgilerinizi doldurun ve RADE ailesine katılın
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Fields Row */}
            <View style={styles.row}>
              <View style={[styles.halfInputGroup, { marginRight: spacing[2] }]}>
                <Text style={[styles.label, { color: themeColors.textSecondary }]}>AD</Text>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Ad"
                      autoCapitalize="words"
                      editable={!isLoading}
                      error={errors.firstName?.message}
                      icon={<Ionicons name="person-outline" size={20} color={themeColors.textSecondary} />}
                    />
                  )}
                />
              </View>
              
              <View style={styles.halfInputGroup}>
                <Text style={[styles.label, { color: themeColors.textSecondary }]}>SOYAD</Text>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Soyad"
                      autoCapitalize="words"
                      editable={!isLoading}
                      error={errors.lastName?.message}
                      icon={<Ionicons name="person-outline" size={20} color={themeColors.textSecondary} />}
                    />
                  )}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.textSecondary }]}>E-POSTA</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="ornek@mail.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    editable={!isLoading}
                    error={errors.email?.message}
                    icon={<Ionicons name="mail-outline" size={20} color={themeColors.textSecondary} />}
                  />
                )}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.textSecondary }]}>ŞİFRE</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Şifrenizi oluşturun"
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                      textContentType="newPassword"
                      editable={!isLoading}
                      error={errors.password?.message}
                      icon={<Ionicons name="lock-closed-outline" size={20} color={themeColors.textSecondary} />}
                      containerStyle={styles.passwordInputContainer}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword((p) => !p)}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={themeColors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              
              {/* Password Strength Indicator */}
              {passwordValue && (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.passwordStrengthBar}>
                    <View 
                      style={[
                        styles.passwordStrengthFill,
                        { 
                          width: `${(passwordChecks.filter(c => c.met).length / passwordChecks.length) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}

              {/* Password Requirements */}
              <View style={[styles.passwordRequirements, { backgroundColor: themeColors.surfaceAlt }]}>
                <Text style={[styles.requirementsTitle, { color: themeColors.textSecondary }]}>
                  Şifre Gereksinimleri:
                </Text>
                {passwordChecks.map((check) => (
                  <View key={check.label} style={styles.requirementRow}>
                    <Ionicons
                      name={check.met ? 'checkmark-circle' : 'ellipse-outline'}
                      size={18}
                      color={check.met ? colors.semantic.success : themeColors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.requirementText,
                        { color: check.met ? colors.semantic.success : themeColors.textSecondary },
                      ]}
                    >
                      {check.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.textSecondary }]}>ŞİFRE (TEKRAR)</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Şifrenizi tekrar girin"
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="password"
                      editable={!isLoading}
                      error={errors.confirmPassword?.message}
                      icon={<Ionicons name="lock-closed-outline" size={20} color={themeColors.textSecondary} />}
                      containerStyle={styles.passwordInputContainer}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowConfirmPassword((p) => !p)}
                      disabled={isLoading}
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
            </View>

            {/* Company (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.textSecondary }]}>
                ŞİRKET <Text style={styles.optionalLabel}>(opsiyonel)</Text>
              </Text>
              <Controller
                control={control}
                name="company"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Şirket adı"
                    autoCapitalize="words"
                    editable={!isLoading}
                    error={errors.company?.message}
                    icon={<Ionicons name="business-outline" size={20} color={themeColors.textSecondary} />}
                  />
                )}
              />
            </View>

            {/* Phone (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.textSecondary }]}>
                TELEFON <Text style={styles.optionalLabel}>(opsiyonel)</Text>
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="+90 5XX XXX XX XX"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    editable={!isLoading}
                    error={errors.phone?.message}
                    icon={<Ionicons name="call-outline" size={20} color={themeColors.textSecondary} />}
                  />
                )}
              />
            </View>

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setValue('acceptTerms', !acceptTerms, { shouldValidate: true })}
              disabled={isLoading}
            >
              <Ionicons
                name={acceptTerms ? "checkbox" : "square-outline"}
                size={24}
                color={acceptTerms ? themeColors.primary : themeColors.textSecondary}
              />
              <Text style={[styles.termsText, { color: themeColors.textSecondary }]}>
                <Text style={{ color: themeColors.primary, fontWeight: '600' }}>Kullanım Şartlarını</Text> ve{' '}
                <Text style={{ color: themeColors.primary, fontWeight: '600' }}>Gizlilik Politikasını</Text> kabul ediyorum
              </Text>
            </TouchableOpacity>
            {errors.acceptTerms && (
              <Text style={styles.errorText}>{errors.acceptTerms.message}</Text>
            )}

            {/* Register Button */}
            <Button
              label={isLoading ? 'Kayıt Yapılıyor...' : 'Hesap Oluştur'}
              variant="gradient"
              size="lg"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              loading={isLoading}
              fullWidth
              style={{ marginTop: spacing[6], marginBottom: spacing[5] }}
            />

            {/* Login Link */}
            <View style={styles.loginLinkRow}>
              <Text style={[styles.loginText, { color: themeColors.textSecondary }]}>
                Zaten hesabınız var mı?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
                <Text style={[styles.loginLink, { color: themeColors.primary }]}>Giriş Yapın</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContent: { 
    flexGrow: 1,
    paddingHorizontal: spacing[5], 
    paddingBottom: spacing[10] 
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing[6],
    paddingBottom: spacing[6],
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: spacing[6],
    padding: spacing[2],
    zIndex: 10,
  },
  logoContainer: {
    width: 140,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '700', 
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 15,
    marginBottom: spacing[2],
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
    paddingTop: spacing[4],
  },
  row: { 
    flexDirection: 'row',
    marginBottom: spacing[4],
  },
  halfInputGroup: {
    flex: 1,
  },
  inputGroup: { 
    marginBottom: spacing[4],
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing[2],
    letterSpacing: 0.8,
  },
  optionalLabel: {
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordInputContainer: {
    marginBottom: 0,
  },
  passwordToggle: {
    position: 'absolute',
    right: spacing[3],
    top: spacing[3],
    padding: spacing[2],
    zIndex: 10,
  },
  passwordStrengthContainer: {
    marginTop: spacing[2],
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: colors.neutral[200],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[1],
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  passwordRequirements: {
    marginTop: spacing[3],
    borderRadius: 12,
    padding: spacing[4],
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  requirementText: {
    fontSize: 13,
    marginLeft: spacing[2],
    fontWeight: '500',
  },
  termsRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: spacing[2],
    paddingHorizontal: spacing[1],
  },
  termsText: { 
    flex: 1, 
    fontSize: 14,
    marginLeft: spacing[3],
    lineHeight: 20,
  },
  loginLinkRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: spacing[2],
  },
  loginText: { 
    fontSize: 14,
  },
  loginLink: { 
    fontSize: 14, 
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: 12,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});

export default RegisterScreen;