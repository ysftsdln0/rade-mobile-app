import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppDispatch, useAppSelector } from '../../store';
import { loginAsync } from '../../store/authThunks';
import { storageService } from '../../services/storage';
import { COLORS, APP_CONFIG } from '../../constants';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı.'),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const demoLoginEnabled = process.env.EXPO_PUBLIC_ENABLE_DEMO_LOGIN !== 'false';

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  useEffect(() => {
    checkBiometricAvailability();
    loadSavedCredentials();
  }, []);

  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const biometricEnabled = await storageService.getBiometricEnabled();

    setBiometricAvailable(hasHardware && isEnrolled && biometricEnabled);
  };

  const loadSavedCredentials = async () => {
    const savedEmail = await storageService.getItem<string>('saved_email');
    if (savedEmail) {
      reset((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  };

  const onSubmit = async ({ email, password, rememberMe }: LoginFormValues) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (
      demoLoginEnabled &&
      normalizedEmail === 'demo@rade.com' &&
      password === 'demo123'
    ) {
      const demoUser = {
        id: 'demo-user-1',
        email: 'demo@rade.com',
        firstName: 'Demo',
        lastName: 'Kullanıcı',
        company: 'RADE Demo Şirket',
        phone: '+90 555 123 45 67',
        avatar: '',
        isVerified: true,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      await storageService.setAuthTokens('demo-token-123', 'demo-refresh-token-456');
      await storageService.setUserData(demoUser);

      dispatch({
        type: 'auth/loginSuccess',
        payload: {
          user: demoUser,
          token: 'demo-token-123',
          refreshToken: 'demo-refresh-token-456',
        },
      });

      if (rememberMe) {
        await storageService.setItem('saved_email', normalizedEmail);
      }

      navigation.replace('Main');
      return;
    }

    try {
      const result = await dispatch(
        loginAsync({
          email: normalizedEmail,
          password,
          rememberMe,
        })
      );

      if (loginAsync.fulfilled.match(result)) {
        if (rememberMe) {
          await storageService.setItem('saved_email', normalizedEmail);
        } else {
          await storageService.removeItem('saved_email');
        }

        navigation.replace('Main');
      } else {
        Alert.alert('Giriş Hatası', result.payload as string);
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Giriş yapmak için parmak izinizi kullanın',
        fallbackLabel: 'Şifre kullan',
      });

      if (result.success) {
        const token = await storageService.getAuthToken();
        if (token) {
          navigation.replace('Main');
        } else {
          Alert.alert(
            'Hata',
            'Kaydedilmiş oturum bulunamadı. Lütfen e-posta ve şifrenizle giriş yapın.'
          );
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Biyometrik kimlik doğrulama başarısız oldu.');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>RADE</Text>
            </View>
            <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
            <Text style={styles.subtitleText}>
              Hesabınıza giriş yapın ve hizmetlerinizi yönetin
            </Text>
          </View>

          {demoLoginEnabled && (
            <View style={styles.demoBox}>
              <View style={styles.demoHeader}>
                <Ionicons name="information-circle" size={20} color={COLORS.info.main} />
                <Text style={styles.demoTitle}>Demo Hesap</Text>
              </View>
              <Text style={styles.demoText}>E-posta: demo@rade.com</Text>
              <Text style={styles.demoText}>Şifre: demo123</Text>
              <TouchableOpacity
                style={styles.fillDemoButton}
                onPress={() => {
                  setValue('email', 'demo@rade.com');
                  setValue('password', 'demo123');
                  clearErrors(['email', 'password']);
                }}
              >
                <Text style={styles.fillDemoText}>Demo Bilgileri Doldur</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.gray500}
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="E-posta adresi"
                    placeholderTextColor={COLORS.gray400}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                  />
                )}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email.message}</Text> : null}

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.gray500}
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, { paddingRight: 50 }]}
                    placeholder="Şifre"
                    placeholderTextColor={COLORS.gray400}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                  />
                )}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.gray500}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password.message}</Text> : null}

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setValue('rememberMe', !rememberMe)}
              >
                <Ionicons
                  name={rememberMe ? 'checkbox' : 'checkbox-outline'}
                  size={20}
                  color={rememberMe ? COLORS.primary.main : COLORS.gray400}
                />
                <Text style={styles.rememberMeText}>Beni hatırla</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, (isLoading) && styles.loginButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Giriş yapılıyor...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            {biometricAvailable && (
              <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
                <Ionicons name="finger-print" size={24} color={COLORS.primary.main} />
                <Text style={styles.biometricText}>Parmak İzi ile Giriş</Text>
              </TouchableOpacity>
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Kayıt Olun</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 {APP_CONFIG.COMPANY}</Text>
            <Text style={styles.versionText}>v{APP_CONFIG.VERSION}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary.main,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
    paddingTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary.main,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary.main,
    borderRadius: 12,
    height: 50,
    marginBottom: 24,
  },
  biometricText: {
    marginLeft: 10,
    color: COLORS.primary.main,
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray200,
  },
  dividerText: {
    marginHorizontal: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    color: COLORS.primary.main,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 4,
  },
  demoBox: {
    backgroundColor: `${COLORS.info.main}12`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: `${COLORS.info.main}30`,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  demoTitle: {
    marginLeft: 8,
    fontWeight: '700',
    color: COLORS.info.main,
  },
  demoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  fillDemoButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: `${COLORS.info.main}20`,
  },
  fillDemoText: {
    color: COLORS.info.main,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error.main,
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
});

export default LoginScreen;