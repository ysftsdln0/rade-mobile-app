import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { loadUserFromStorageAsync } from '../store/authThunks';
import { storageService } from '../services/storage';
import { APP_CONFIG, COLORS } from '../constants';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if this is the first launch
      const isFirstLaunch = await storageService.getFirstLaunch();
      
      if (isFirstLaunch) {
        // First time opening the app, show onboarding
        await storageService.setFirstLaunch(false);
        navigation.replace('Onboarding');
        return;
      }

      // Try to load user from storage
      const result = await dispatch(loadUserFromStorageAsync());
      
      if (loadUserFromStorageAsync.fulfilled.match(result)) {
        // User is authenticated, go to main app
        navigation.replace('Main');
      } else {
        // No valid session, go to auth
        navigation.replace('Auth');
      }
    } catch (error) {
      console.error('App initialization error:', error);
      // On error, go to auth
      navigation.replace('Auth');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>RADE</Text>
            </View>
            <Text style={styles.appName}>{APP_CONFIG.APP_NAME}</Text>
            <Text style={styles.tagline}>Hosting Yönetim Sistemi</Text>
          </View>

          {/* Loading Indicator */}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>

          {/* Version Info */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>
              v{APP_CONFIG.VERSION}
            </Text>
            <Text style={styles.companyText}>
              © 2025 {APP_CONFIG.COMPANY}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '300',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 5,
  },
  companyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SplashScreen;