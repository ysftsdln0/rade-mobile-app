import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants';
import { storageService } from './storage';
import { ApiResponse, ActivityItem } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await storageService.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await storageService.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshAuthToken(refreshToken);
              const { token, refreshToken: newRefreshToken } = response.data;
              
              await storageService.setAuthTokens(token, newRefreshToken);
              originalRequest.headers.Authorization = `Bearer ${token}`;
              
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await storageService.clearAuthTokens();
            // You can emit an event here or use a global state to handle logout
            console.log('Token refresh failed, user needs to login again');
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: any): Promise<ApiResponse<any>> {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async refreshAuthToken(refreshToken: string): Promise<ApiResponse<any>> {
    const response = await this.client.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      await storageService.clearAuthTokens();
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    const response = await this.client.post('/auth/forgot-password', { email });
    return response.data;
  }

  async verifyTwoFactor(token: string): Promise<ApiResponse<any>> {
    const response = await this.client.post('/auth/verify-2fa', { token });
    return response.data;
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/user/profile');
    return response.data;
  }

  async updateUserProfile(userData: any): Promise<ApiResponse<any>> {
    const response = await this.client.put('/user/profile', userData);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    const response = await this.client.put('/user/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  // Hosting endpoints
  async getHostingPackages(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/hosting/packages');
    return response.data;
  }

  async getHostingDetails(hostingId: string): Promise<ApiResponse<any>> {
    const response = await this.client.get(`/hosting/packages/${hostingId}`);
    return response.data;
  }

  async getHostingUsage(hostingId: string): Promise<ApiResponse<any>> {
    const response = await this.client.get(`/hosting/packages/${hostingId}/usage`);
    return response.data;
  }

  // File Manager endpoints
  async getFiles(hostingId: string, path: string = '/'): Promise<ApiResponse<any[]>> {
    const response = await this.client.get(`/hosting/${hostingId}/files`, {
      params: { path },
    });
    return response.data;
  }

  async uploadFile(hostingId: string, path: string, file: FormData): Promise<ApiResponse<any>> {
    const response = await this.client.post(`/hosting/${hostingId}/files/upload`, file, {
      params: { path },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteFile(hostingId: string, filePath: string): Promise<ApiResponse<any>> {
    const response = await this.client.delete(`/hosting/${hostingId}/files`, {
      data: { path: filePath },
    });
    return response.data;
  }

  // Database endpoints
  async getDatabases(hostingId: string): Promise<ApiResponse<any[]>> {
    const response = await this.client.get(`/hosting/${hostingId}/databases`);
    return response.data;
  }

  async createDatabase(hostingId: string, databaseData: any): Promise<ApiResponse<any>> {
    const response = await this.client.post(`/hosting/${hostingId}/databases`, databaseData);
    return response.data;
  }

  async deleteDatabase(hostingId: string, databaseId: string): Promise<ApiResponse<any>> {
    const response = await this.client.delete(`/hosting/${hostingId}/databases/${databaseId}`);
    return response.data;
  }

  // Domain endpoints
  async getDomains(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/domains');
    return response.data;
  }

  async getDomainDetails(domainId: string): Promise<ApiResponse<any>> {
    const response = await this.client.get(`/domains/${domainId}`);
    return response.data;
  }

  async getDnsRecords(domainId: string): Promise<ApiResponse<any[]>> {
    const response = await this.client.get(`/domains/${domainId}/dns`);
    return response.data;
  }

  async updateDnsRecord(domainId: string, recordData: any): Promise<ApiResponse<any>> {
    const response = await this.client.put(`/domains/${domainId}/dns`, recordData);
    return response.data;
  }

  // Server endpoints
  async getServers(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/servers');
    return response.data;
  }

  async getServerDetails(serverId: string): Promise<ApiResponse<any>> {
    const response = await this.client.get(`/servers/${serverId}`);
    return response.data;
  }

  async getServerMonitoring(serverId: string): Promise<ApiResponse<any>> {
    const response = await this.client.get(`/servers/${serverId}/monitoring`);
    return response.data;
  }

  async controlServer(serverId: string, action: string): Promise<ApiResponse<any>> {
    const response = await this.client.post(`/servers/${serverId}/control`, { action });
    return response.data;
  }

  // Financial endpoints
  async getInvoices(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/finance/invoices');
    return response.data;
  }

  async getInvoiceDetails(invoiceId: string): Promise<ApiResponse<any>> {
    const response = await this.client.get(`/finance/invoices/${invoiceId}`);
    return response.data;
  }

  async getPaymentMethods(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/finance/payment-methods');
    return response.data;
  }

  async makePayment(paymentData: any): Promise<ApiResponse<any>> {
    const response = await this.client.post('/finance/payments', paymentData);
    return response.data;
  }

  // Support endpoints
  async getTickets(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/support/tickets');
    return response.data;
  }

  async getTicketDetails(ticketId: string): Promise<ApiResponse<any>> {
    const response = await this.client.get(`/support/tickets/${ticketId}`);
    return response.data;
  }

  async createTicket(ticketData: any): Promise<ApiResponse<any>> {
    const response = await this.client.post('/support/tickets', ticketData);
    return response.data;
  }

  async replyToTicket(ticketId: string, message: string): Promise<ApiResponse<any>> {
    const response = await this.client.post(`/support/tickets/${ticketId}/replies`, { message });
    return response.data;
  }

  // Activity endpoints
  async getRecentActivities(): Promise<ApiResponse<ActivityItem[]>> {
    const response = await this.client.get('/activity/recent');
    return response.data;
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.request(config);
    return response.data;
  }
}

export const apiService = new ApiService();