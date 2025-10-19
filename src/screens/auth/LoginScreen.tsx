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
import { useTheme } from "../../utils/ThemeContext";

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const { t, language } = useLanguage();
  const { colors: themeColors, isDark } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const demoLoginEnabled = process.env.EXPO_PUBLIC_ENABLE_DEMO_LOGIN !== "false";

  // Dynamic schema based on language - using hard-coded messages for Zod validation
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
          t.auth.loginError, 
          result.payload as string
        );
      }
    } catch (error) {
      Alert.alert(
        t.auth.error, 
        t.auth.errorOccurred
      );
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t.auth.biometricPrompt,
        fallbackLabel: t.auth.usePassword,
      });

      if (result.success) {
        const loadResult = await dispatch(loadUserFromStorageAsync());

        if (loadUserFromStorageAsync.fulfilled.match(loadResult)) {
          navigation.replace("Main");
        } else {
          Alert.alert(
            t.auth.sessionExpired, 
            t.auth.pleaseLoginAgain
          );
        }
      }
    } catch (error) {
      Alert.alert(
        t.auth.error, 
        t.auth.biometricFailed
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
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
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
            <Text style={[styles.welcomeText, { color: themeColors.text }]}>{t.auth.welcomeBack}</Text>
            <Text style={[styles.subtitleText, { color: themeColors.textSecondary }]}>
              {t.auth.loginSubtitle}
            </Text>
          </View>

          {demoLoginEnabled && (
            <View style={[styles.demoBox, { 
              backgroundColor: isDark ? `${colors.semantic.info}20` : `${colors.semantic.info}12`,
              borderColor: isDark ? `${colors.semantic.info}40` : `${colors.semantic.info}30`
            }]}>
              <View style={styles.demoHeader}>
                <Ionicons name="information-circle" size={20} color={colors.semantic.info} />
                <Text style={styles.demoTitle}>{t.auth.demoAccount}</Text>
              </View>
              <Text style={[styles.demoText, { color: themeColors.textSecondary }]}>
                {t.auth.email}: demo@rade.com
              </Text>
              <Text style={[styles.demoText, { color: themeColors.textSecondary }]}>
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
                      color={themeColors.textSecondary}
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
                        color={themeColors.textSecondary}
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
                      color={themeColors.textSecondary}
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
                  color={rememberMe ? themeColors.primary : themeColors.textSecondary}
                />
                <Text style={[styles.rememberMeText, { color: themeColors.textSecondary }]}>{t.auth.rememberMe}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: themeColors.primary }]}>{t.auth.forgotPassword}</Text>
              </TouchableOpacity>
            </View>

            <Button
              label={isLoading ? t.auth.loggingIn : t.auth.loginButton}
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
                style={[styles.biometricButton, { borderColor: themeColors.primary }]}
                onPress={handleBiometricLogin}
              >
                <Ionicons
                  name="finger-print"
                  size={24}
                  color={themeColors.primary}
                />
                <Text style={[styles.biometricText, { color: themeColors.primary }]}>
                  {t.auth.biometricLogin}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
              <Text style={[styles.dividerText, { color: themeColors.textSecondary }]}>
                {t.auth.orContinueWith}
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
            </View>

            <View style={styles.socialLoginContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { 
                  backgroundColor: themeColors.surfaceAlt,
                  borderColor: themeColors.border
                }]} 
                activeOpacity={0.7}
              >
                <Ionicons name="finger-print" size={32} color={themeColors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, { 
                  backgroundColor: themeColors.surfaceAlt,
                  borderColor: themeColors.border
                }]} 
                activeOpacity={0.7}
              >
                <Ionicons name="logo-apple" size={32} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: themeColors.textSecondary }]}>{t.auth.dontHaveAccount} </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={[styles.registerLink, { color: themeColors.primary }]}>{t.auth.signUpHere}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>© 2025 {APP_CONFIG.COMPANY}</Text>
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
    marginBottom: spacing[2],
  },
  subtitleText: {
    fontSize: 16,
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
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    marginBottom: spacing[6],
  },
  biometricText: {
    marginLeft: spacing[2],
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
  },
  dividerText: {
    marginHorizontal: spacing[3],
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: spacing[10],
    marginBottom: spacing[6],
  },
  footerText: {
    fontSize: 13,
  },
  versionText: {
    fontSize: 12,
    color: colors.neutral[500],
    marginTop: spacing[1],
  },
  demoBox: {
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[6],
    borderWidth: 1,
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
