export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface HostingPackage {
  id: string;
  userId: string;
  name: string;
  domain: string;
  packageType: 'shared' | 'vps' | 'dedicated';
  status: 'active' | 'suspended' | 'expired' | 'pending';
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  context?: string;
  createdAt: string; // ISO
}

export interface RefreshTokenRecord {
  token: string; // raw stored (demo); production'da hashlenmeli
  userId: string;
  expiresAt: number; // epoch ms
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface LoginResultData {
  user: Omit<User, 'passwordHash'>;
  token: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

// For refresh token rotation
export interface RefreshResultData {
  token: string;
  refreshToken: string;
}