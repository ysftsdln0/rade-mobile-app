import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";
import { storageService } from "../services/storage";
import { LoginCredentials, RegisterData } from "../types";

// Login thunk
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(
        credentials.email,
        credentials.password
      );

      if (response.success) {
        const { user, token, refreshToken } = response.data;

        // Store tokens and user data
        await storageService.setAuthTokens(token, refreshToken);
        await storageService.setUserData(user);

        return { user, token, refreshToken };
      } else {
        return rejectWithValue(response.message || "Login failed");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error occurred"
      );
    }
  }
);

// Register thunk (stores tokens & user like login)
export const registerAsync = createAsyncThunk(
  "auth/register",
  async (form: RegisterData, { rejectWithValue }) => {
    try {
      // Backend expects: email, password, firstName, lastName, company?, phone?
      // Strip client-only fields (confirmPassword, acceptTerms)
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        company: form.company?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
      };
      const response = await apiService.register(payload);
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        await storageService.setAuthTokens(token, refreshToken);
        await storageService.setUserData(user);
        return { user, token, refreshToken };
      }
      return rejectWithValue(response.message || "Registration failed");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error occurred"
      );
    }
  }
);

// Logout thunk
export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
      await storageService.clearAuthTokens();
      await storageService.clearUserData();
      return true;
    } catch (error: any) {
      // Clear local storage even if API call fails
      await storageService.clearAuthTokens();
      await storageService.clearUserData();
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// Load user from storage thunk
export const loadUserFromStorageAsync = createAsyncThunk(
  "auth/loadFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const [token, refreshToken, userData] = await Promise.all([
        storageService.getAuthToken(),
        storageService.getRefreshToken(),
        storageService.getUserData(),
      ]);

      if (token && refreshToken && userData) {
        return { user: userData, token, refreshToken };
      } else {
        return rejectWithValue("No stored authentication data");
      }
    } catch {
      return rejectWithValue("Failed to load stored authentication data");
    }
  }
);

// Forgot password thunk
export const forgotPasswordAsync = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiService.forgotPassword(email);

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Password reset failed");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error occurred"
      );
    }
  }
);

// Two-factor authentication thunk
export const verifyTwoFactorAsync = createAsyncThunk(
  "auth/verifyTwoFactor",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyTwoFactor(token);

      if (response.success) {
        const { user, token: authToken, refreshToken } = response.data;

        // Store tokens and user data
        await storageService.setAuthTokens(authToken, refreshToken);
        await storageService.setUserData(user);

        return { user, token: authToken, refreshToken };
      } else {
        return rejectWithValue(response.message || "2FA verification failed");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error occurred"
      );
    }
  }
);

// Update profile thunk
export const updateProfileAsync = createAsyncThunk(
  "auth/updateProfile",
  async (userData: Partial<any>, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserProfile(userData);

      if (response.success) {
        const updatedUser = response.data;
        await storageService.setUserData(updatedUser);
        return updatedUser;
      } else {
        return rejectWithValue(response.message || "Profile update failed");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error occurred"
      );
    }
  }
);
