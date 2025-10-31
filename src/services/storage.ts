import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants";

class StorageService {
  // Generic storage methods
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error saving to AsyncStorage:", error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const serializedValue = await AsyncStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error("Error reading from AsyncStorage:", error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from AsyncStorage:", error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
      throw error;
    }
  }

  // Auth specific methods
  async setAuthTokens(token: string, refreshToken: string): Promise<void> {
    console.log("💾 Storing auth tokens...");
    console.log("Token length:", token?.length || 0);
    console.log("RefreshToken length:", refreshToken?.length || 0);

    await Promise.all([
      this.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
      this.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);

    console.log("✅ Auth tokens stored");
  }

  async getAuthToken(): Promise<string | null> {
    const token = await this.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    console.log(
      "📖 Reading auth token:",
      token ? `Found (${token.length} chars)` : "Not found"
    );
    return token;
  }

  async getRefreshToken(): Promise<string | null> {
    const token = await this.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
    console.log(
      "📖 Reading refresh token:",
      token ? `Found (${token.length} chars)` : "Not found"
    );
    return token;
  }

  async clearAuthTokens(): Promise<void> {
    await Promise.all([
      this.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      this.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
  }

  // User data methods
  async setUserData(userData: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_DATA, userData);
  }

  async getUserData(): Promise<any> {
    return this.getItem(STORAGE_KEYS.USER_DATA);
  }

  async clearUserData(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Settings methods
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled);
  }

  async getBiometricEnabled(): Promise<boolean> {
    const enabled = await this.getItem<boolean>(STORAGE_KEYS.BIOMETRIC_ENABLED);
    return enabled ?? false;
  }

  async setLanguage(language: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  async getLanguage(): Promise<string> {
    const language = await this.getItem<string>(STORAGE_KEYS.LANGUAGE);
    return language ?? "tr";
  }

  async setFirstLaunch(isFirstLaunch: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.FIRST_LAUNCH, isFirstLaunch);
  }

  async getFirstLaunch(): Promise<boolean> {
    const isFirstLaunch = await this.getItem<boolean>(
      STORAGE_KEYS.FIRST_LAUNCH
    );
    return isFirstLaunch ?? true;
  }
}

export const storageService = new StorageService();
