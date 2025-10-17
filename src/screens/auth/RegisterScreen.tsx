import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { colors, spacing } from '../../styles';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerAsync } from '../../store/authThunks';

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
      { label: 'En az 8 karakter', met: passwordValue.length >= 8 },
      { label: 'En az bir büyük harf', met: /[A-Z]/.test(passwordValue) },
      { label: 'En az bir küçük harf', met: /[a-z]/.test(passwordValue) },
      { label: 'En az bir rakam', met: /\d/.test(passwordValue) },
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={styles.subtitle}>Bilgilerinizi doldurun ve hemen başlayın</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Ad</Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={styles.input}
                    placeholder="Ad"
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.firstName ? <Text style={styles.errorText}>{errors.firstName.message}</Text> : null}
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Soyad</Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={styles.input}
                    placeholder="Soyad"
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.lastName ? <Text style={styles.errorText}>{errors.lastName.message}</Text> : null}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-posta</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  placeholder="ornek@mail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              )}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email.message}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  placeholder="Şifre"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  textContentType="newPassword"
                />
              )}
            />
            <TouchableOpacity style={styles.toggle} onPress={() => setShowPassword((p) => !p)}>
              <Text style={styles.toggleText}>{showPassword ? 'Gizle' : 'Göster'}</Text>
            </TouchableOpacity>
            {errors.password ? <Text style={styles.errorText}>{errors.password.message}</Text> : null}
            <Text style={[styles.passwordStrength, { color: passwordStrength.color }]}>
              {passwordStrength.label}
            </Text>
            <View style={styles.passwordHints}>
              {passwordChecks.map((check) => (
                <View key={check.label} style={styles.requirementRow}>
                  <Ionicons
                    name={check.met ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={check.met ? colors.semantic.success : colors.neutral[400]}
                    style={{ marginRight: spacing[2] }}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      check.met && styles.requirementMet,
                    ]}
                  >
                    {check.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre (Tekrar)</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  placeholder="Şifreyi tekrar"
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password"
                />
              )}
            />
            <TouchableOpacity style={styles.toggle} onPress={() => setShowConfirmPassword((p) => !p)}>
              <Text style={styles.toggleText}>{showConfirmPassword ? 'Gizle' : 'Göster'}</Text>
            </TouchableOpacity>
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şirket (opsiyonel)</Text>
            <Controller
              control={control}
              name="company"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  placeholder="Şirket Adı"
                  autoCapitalize="words"
                />
              )}
            />
            {errors.company ? <Text style={styles.errorText}>{errors.company.message}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefon (opsiyonel)</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  placeholder="+90 ..."
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                />
              )}
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone.message}</Text> : null}
          </View>

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setValue('acceptTerms', !acceptTerms, { shouldValidate: true })}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]} />
            <Text style={styles.termsText}>Kullanım şartlarını kabul ediyorum</Text>
          </TouchableOpacity>
          {errors.acceptTerms ? <Text style={styles.errorText}>{errors.acceptTerms.message}</Text> : null}

          <TouchableOpacity
            disabled={isLoading || isSubmitting}
            onPress={handleSubmit(onSubmit)}
            style={[styles.registerButton, (isLoading || isSubmitting) && { opacity: 0.7 }]}
          >
            {isLoading || isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerButtonText}>Kayıt Ol</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginLinkRow}>
            <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { padding: spacing[5], paddingBottom: spacing[10] },
  title: { fontSize: 28, fontWeight: '700', color: colors.neutral[900], marginBottom: spacing[1] },
  subtitle: { fontSize: 14, color: colors.neutral[600], marginBottom: spacing[6] },
  inputGroup: { marginBottom: spacing[4], position: 'relative' },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral[600],
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.neutral[100],
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: colors.neutral[900],
  },
  toggle: { position: 'absolute', right: 12, top: 30, padding: spacing[1] },
  toggleText: { fontSize: 12, color: colors.primary[500], fontWeight: '600' },
  row: { flexDirection: 'row' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[2] },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.primary[500],
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: colors.primary[500] },
  termsText: { flex: 1, fontSize: 13, color: colors.neutral[600] },
  registerButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    marginTop: spacing[3],
  },
  registerButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  loginLinkRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 14, color: colors.neutral[600] },
  loginLink: { fontSize: 14, color: colors.primary[500], fontWeight: '600' },
  errorText: {
    color: colors.semantic.error,
    fontSize: 12,
    marginTop: spacing[1],
  },
  passwordHints: {
    marginTop: spacing[2],
    backgroundColor: colors.neutral[100],
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: spacing[3],
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 13,
    color: colors.neutral[600],
  },
  requirementMet: {
    color: colors.semantic.success,
    fontWeight: '600',
  },
  passwordStrength: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default RegisterScreen;