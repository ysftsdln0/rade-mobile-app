import React, { useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../store';
import { loginAsync } from '../../store/authThunks';
import { storageService } from '../../services/storage';
import { COLORS, APP_CONFIG } from '../../constants';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const demoLoginEnabled = process.env.EXPO_PUBLIC_ENABLE_DEMO_LOGIN !== 'false';

  React.useEffect(() => {
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
    // Load saved email if remember me was checked
    // This is a simple implementation - in production, you might want to use secure storage
    const savedEmail = await storageService.getItem<string>('saved_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }

  // Demo giriş kontrolü (ENV ile kapanabilir)
  // NOT: Backend tam hazır olduğunda bu blok kapatılabilir. Varsayılan olarak açık bırakılıyor.
    if (demoLoginEnabled && email.trim().toLowerCase() === 'demo@rade.com' && password === 'demo123') {
      // Demo kullanıcı bilgileri oluştur
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

      // Demo token'ları kaydet
      await storageService.setAuthTokens('demo-token-123', 'demo-refresh-token-456');
      await storageService.setUserData(demoUser);

      // Redux store'u güncelle
      dispatch({
        type: 'auth/loginSuccess',
        payload: {
          user: demoUser,
          token: 'demo-token-123',
          refreshToken: 'demo-refresh-token-456',
        }
      });

      // Save email if remember me is checked
      if (rememberMe) {
          await storageService.setItem('saved_email', email.trim().toLowerCase());
      }

      navigation.replace('Main');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    try {
      const result = await dispatch(loginAsync({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      }));

      if (loginAsync.fulfilled.match(result)) {
        // Save email if remember me is checked
        if (rememberMe) {
          await storageService.setItem('saved_email', email.trim().toLowerCase());
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
        // Load stored credentials and login
        const token = await storageService.getAuthToken();
        if (token) {
          navigation.replace('Main');
        } else {
          Alert.alert('Hata', 'Kaydedilmiş oturum bulunamadı. Lütfen e-posta ve şifrenizle giriş yapın.');
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Biyometrik kimlik doğrulama başarısız oldu.');
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>RADE</Text>
            </View>
            <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
            <Text style={styles.subtitleText}>
              Hesabınıza giriş yapın ve hizmetlerinizi yönetin
            </Text>
          </View>

          {/* Demo Info Box */}
          {demoLoginEnabled && (
            <View style={styles.demoBox}>
              <View style={styles.demoHeader}>
                <Ionicons name="information-circle" size={20} color={COLORS.info} />
                <Text style={styles.demoTitle}>Demo Hesap</Text>
              </View>
              <Text style={styles.demoText}>E-posta: demo@rade.com</Text>
              <Text style={styles.demoText}>Şifre: demo123</Text>
              <TouchableOpacity 
                style={styles.fillDemoButton}
                onPress={() => {
                  setEmail('demo@rade.com');
                  setPassword('demo123');
                }}
              >
                <Text style={styles.fillDemoText}>Demo Bilgileri Doldur</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Login Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gray500} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-posta adresi"
                placeholderTextColor={COLORS.gray400}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray500} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingRight: 50 }]}
                placeholder="Şifre"
                placeholderTextColor={COLORS.gray400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="password"
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.gray500}
                />
              </TouchableOpacity>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <Ionicons
                  name={rememberMe ? 'checkbox' : 'checkbox-outline'}
                  size={20}
                  color={rememberMe ? COLORS.primary : COLORS.gray400}
                />
                <Text style={styles.rememberMeText}>Beni hatırla</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Giriş yapılıyor...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            {/* Biometric Login */}
            {biometricAvailable && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
              >
                <Ionicons name="finger-print" size={24} color={COLORS.primary} />
                <Text style={styles.biometricText}>Parmak İzi ile Giriş</Text>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Kayıt Olun</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 {APP_CONFIG.COMPANY}
            </Text>
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
    backgroundColor: COLORS.primary,
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
    marginBottom: 16,
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
    color: COLORS.primary,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    height: 56,
    marginBottom: 24,
  },
  biometricText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.primary,
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
    backgroundColor: COLORS.gray300,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
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
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 11,
    color: COLORS.gray400,
  },
  demoBox: {
    backgroundColor: `${COLORS.info}15`,
    borderWidth: 1,
    borderColor: `${COLORS.info}30`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  demoTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.info,
  },
  demoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  fillDemoButton: {
    backgroundColor: COLORS.info,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  fillDemoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LoginScreen;