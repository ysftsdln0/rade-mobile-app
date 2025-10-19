import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppDispatch, useAppSelector } from "../../store";
import { loginAsync, loadUserFromStorageAsync } from "../../store/authThunks";
import { storageService } from "../../services/storage";
import { colors, spacing } from "../../styles";
import { APP_CONFIG } from "../../constants";
import { TextInput } from "../../components/common/TextInput";
import { Button } from "../../components/common/Button";
import { useLanguage } from "../../utils/LanguageContext";

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const { t, language } = useLanguage();

  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const demoLoginEnabled = process.env.EXPO_PUBLIC_ENABLE_DEMO_LOGIN !== "false";

  // Dynamic schema based on language
  const loginSchema = useMemo(() => z.object({
    email: z.string().email(
      language === 'tr' 
        ? 'Geçerli bir e-posta adresi girin.' 
        : 'Enter a valid email address.'
    ),
    password: z.string().min(6, 
      language === 'tr' 
        ? 'Şifre en az 6 karakter olmalı.' 
        : 'Password must be at least 6 characters.'
    ),
    rememberMe: z.boolean(),
  }), [language]);

  type LoginFormValues = z.infer<typeof loginSchema>;

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
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

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
    const savedEmail = await storageService.getItem<string>("saved_email");
    if (savedEmail) {
      reset((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  };

  const onSubmit = async ({ email, password, rememberMe }: LoginFormValues) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (demoLoginEnabled && normalizedEmail === "demo@rade.com" && password === "demo123") {
      const demoUser = {
        id: "demo-user-1",
        email: "demo@rade.com",
        firstName: "Demo",
        lastName: "Kullanıcı",
        company: "RADE Demo Şirket",
        phone: "+90 555 123 45 67",
        avatar: "",
        isVerified: true,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      await storageService.setAuthTokens("demo-token-123", "demo-refresh-token-456");
      await storageService.setUserData(demoUser);

      dispatch({
        type: "auth/loginSuccess",
        payload: {
          user: demoUser,
          token: "demo-token-123",
          refreshToken: "demo-refresh-token-456",
        },
      });

      if (rememberMe) {
        await storageService.setItem("saved_email", normalizedEmail);
      }

      navigation.replace("Main");
      return;
    }

    try {
      const result = await dispatch(loginAsync({
        email: normalizedEmail,
        password,
        rememberMe,
      }));

      if (loginAsync.fulfilled.match(result)) {
        if (rememberMe) {
          await storageService.setItem("saved_email", normalizedEmail);
        } else {
          await storageService.removeItem("saved_email");
        }
        navigation.replace("Main");
      } else {
        Alert.alert(
          language === 'tr' ? "Giriş Hatası" : "Login Error", 
          result.payload as string
        );
      }
    } catch (error) {
      Alert.alert(
        language === 'tr' ? "Hata" : "Error", 
        language === 'tr' 
          ? "Bir hata oluştu. Lütfen tekrar deneyin." 
          : "An error occurred. Please try again."
      );
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: language === 'tr' 
          ? "Giriş yapmak için parmak izinizi kullanın" 
          : "Use your fingerprint to login",
        fallbackLabel: language === 'tr' ? "Şifre kullan" : "Use password",
      });

      if (result.success) {
        const loadResult = await dispatch(loadUserFromStorageAsync());

        if (loadUserFromStorageAsync.fulfilled.match(loadResult)) {
          navigation.replace("Main");
        } else {
          Alert.alert(
            language === 'tr' ? "Oturum Süresi Doldu" : "Session Expired", 
            language === 'tr' 
              ? "Lütfen e-posta ve şifrenizle tekrar giriş yapın." 
              : "Please login again with your email and password."
          );
        }
      }
    } catch (error) {
      Alert.alert(
        language === 'tr' ? "Hata" : "Error", 
        language === 'tr' 
          ? "Biyometrik kimlik doğrulama başarısız oldu." 
          : "Biometric authentication failed."
      );
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../../assets/rade-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.welcomeText}>{t.auth.welcomeBack}</Text>
            <Text style={styles.subtitleText}>
              {t.auth.loginSubtitle}
            </Text>
          </View>

          {demoLoginEnabled && (
            <View style={styles.demoBox}>
              <View style={styles.demoHeader}>
                <Ionicons name="information-circle" size={20} color={colors.semantic.info} />
                <Text style={styles.demoTitle}>{t.auth.demoAccount}</Text>
              </View>
              <Text style={styles.demoText}>
                {t.auth.email}: demo@rade.com
              </Text>
              <Text style={styles.demoText}>
                {t.auth.password}: demo123
              </Text>
              <TouchableOpacity
                style={styles.fillDemoButton}
                onPress={() => {
                  setValue("email", "demo@rade.com");
                  setValue("password", "demo123");
                  clearErrors(["email", "password"]);
                }}
              >
                <Text style={styles.fillDemoText}>{t.auth.fillDemoCredentials}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder={t.auth.emailPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!isLoading}
                  error={errors.email?.message}
                  icon={
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.neutral[500]}
                    />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordWrapper}>
                  <TextInput
                    placeholder={t.auth.passwordPlaceholder}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                    editable={!isLoading}
                    error={errors.password?.message}
                    icon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.neutral[500]}
                      />
                    }
                    containerStyle={styles.passwordInputContainer}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={colors.neutral[500]}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setValue("rememberMe", !rememberMe)}
                disabled={isLoading}
              >
                <Ionicons
                  name={rememberMe ? "checkbox" : "checkbox-outline"}
                  size={20}
                  color={rememberMe ? colors.primary[500] : colors.neutral[400]}
                />
                <Text style={styles.rememberMeText}>{t.auth.rememberMe}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>{t.auth.forgotPassword}</Text>
              </TouchableOpacity>
            </View>

            <Button
              label={isLoading 
                ? (language === 'tr' ? 'Giriş yapılıyor...' : 'Logging in...') 
                : t.auth.loginButton}
              variant="gradient"
              size="lg"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              loading={isLoading}
              fullWidth
              style={{ marginBottom: spacing[4] }}
            />

            {biometricAvailable && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
              >
                <Ionicons
                  name="finger-print"
                  size={24}
                  color={colors.primary[500]}
                />
                <Text style={styles.biometricText}>
                  {language === 'tr' ? 'Biyometrik Giriş' : 'Biometric Login'}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>
                {language === 'tr' ? 'Veya şununla devam et' : 'Or continue with'}
              </Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialLoginContainer}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Ionicons name="finger-print" size={32} color={colors.neutral[700]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Ionicons name="logo-apple" size={32} color={colors.neutral[700]} />
              </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{t.auth.dontHaveAccount} </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>{t.auth.signUpHere}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 {APP_CONFIG.COMPANY}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
  },
  header: {
    alignItems: "center",
    paddingTop: spacing[10],
    paddingBottom: spacing[8],
  },
  logoContainer: {
    width: 200,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing[6],
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.neutral[900],
    marginBottom: spacing[2],
  },
  subtitleText: {
    fontSize: 16,
    color: colors.neutral[600],
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    flex: 1,
    paddingTop: spacing[5],
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInputContainer: {
    marginBottom: 0,
  },
  passwordToggle: {
    position: "absolute",
    right: spacing[3],
    top: spacing[3],
    padding: spacing[2],
    zIndex: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[6],
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    marginLeft: spacing[2],
    fontSize: 14,
    color: colors.neutral[600],
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: "600",
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary[500],
    borderRadius: 12,
    height: 50,
    marginBottom: spacing[6],
  },
  biometricText: {
    marginLeft: spacing[2],
    color: colors.primary[500],
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[6],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
  dividerText: {
    marginHorizontal: spacing[3],
    color: colors.neutral[600],
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: colors.neutral[600],
  },
  registerLink: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: spacing[10],
    marginBottom: spacing[6],
  },
  footerText: {
    fontSize: 13,
    color: colors.neutral[600],
  },
  versionText: {
    fontSize: 12,
    color: colors.neutral[500],
    marginTop: spacing[1],
  },
  demoBox: {
    backgroundColor: `${colors.semantic.info}12`,
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: `${colors.semantic.info}30`,
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  demoTitle: {
    marginLeft: spacing[2],
    fontWeight: "700",
    color: colors.semantic.info,
  },
  demoText: {
    fontSize: 14,
    color: colors.neutral[600],
  },
  fillDemoButton: {
    marginTop: spacing[3],
    alignSelf: "flex-start",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 8,
    backgroundColor: `${colors.semantic.info}20`,
  },
  fillDemoText: {
    color: colors.semantic.info,
    fontWeight: "600",
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: 12,
    marginBottom: spacing[3],
    marginLeft: spacing[1],
  },
});

export default LoginScreen;
