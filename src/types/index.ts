// Global TypeScript definitions for RADE Mobile App

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  phone?: string;
  acceptTerms: boolean;
}

// Hosting related types
export interface HostingPackage {
  id: string;
  name: string;
  domain: string;
  packageType: 'shared' | 'vps' | 'dedicated';
  status: 'active' | 'suspended' | 'expired' | 'pending';
  diskUsage: number;
  diskLimit: number;
  bandwidthUsage: number;
  bandwidthLimit: number;
  expiryDate: string;
  autoRenew: boolean;
}

export interface Domain {
  id: string;
  name: string;
  status: 'active' | 'expired' | 'pending' | 'transferred';
  registrationDate: string;
  expiryDate: string;
  autoRenew: boolean;
  nameservers: string[];
  isPrivacyProtected: boolean;
}

export interface DatabaseInfo {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql';
  size: number;
  users: DatabaseUser[];
  createdAt: string;
}

export interface DatabaseUser {
  id: string;
  username: string;
  permissions: string[];
  host: string;
}

// Server related types
export interface Server {
  id: string;
  name: string;
  type: 'vps' | 'dedicated';
  status: 'running' | 'stopped' | 'reboot' | 'rescue';
  os: string;
  location: string;
  ip: string;
  specs: ServerSpecs;
  monitoring: ServerMonitoring;
}

export interface ServerSpecs {
  cpu: string;
  ram: string;
  disk: string;
  network: string;
}

export interface ServerMonitoring {
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  uptime: number;
}

// Financial types
export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'paypal';
  isDefault: boolean;
  lastFour?: string;
  expiryDate?: string;
  cardType?: string;
}

// Support types
export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  createdAt: string;
  lastReply: string;
  replies: TicketReply[];
}

export interface TicketReply {
  id: string;
  message: string;
  isFromSupport: boolean;
  createdAt: string;
  attachments?: string[];
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  TwoFactor: { email: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Services: undefined;
  Support: undefined;
  Account: undefined;
};

export type ServicesStackParamList = {
  ServicesList: undefined;
  HostingList: undefined;
  HostingDetails: { hostingId: string };
  FileManager: { hostingId: string };
  DatabaseManager: { hostingId: string };
  DomainList: undefined;
  DomainDetails: { domainId: string };
  ServerList: undefined;
  ServerDetails: { serverId: string };
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  disabled: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}