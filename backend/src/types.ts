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
  diskUsage: number;
  diskLimit: number;
  bandwidthUsage: number;
  bandwidthLimit: number;
  expiryDate: string;
  autoRenew: boolean;
}

export interface HostingDetail extends HostingPackage {
  createdAt: string;
  ipAddress: string;
  nameservers: string[];
  features: string[];
}

export interface HostingUsage {
  disk: { used: number; total: number };
  bandwidth: { used: number; total: number };
  databases: number;
  ftpAccounts: number;
  emailAccounts: number;
  backupsEnabled: boolean;
}

export interface ActivityItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  context?: string;
  createdAt: string; // ISO
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  userId: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit_card' | 'bank_transfer' | 'paypal';
  isDefault: boolean;
  lastFour?: string;
  expiryDate?: string;
  cardType?: string;
}

export interface TicketReply {
  id: string;
  message: string;
  isFromSupport: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  createdAt: string;
  lastReply: string;
  replies: TicketReply[];
}

export interface Domain {
  id: string;
  userId: string;
  name: string;
  status: 'active' | 'expired' | 'pending' | 'transferred';
  registrationDate: string;
  expiryDate: string;
  autoRenew: boolean;
  nameservers: string[];
  isPrivacyProtected: boolean;
}

export interface DnsRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX';
  host: string;
  value: string;
  ttl: number;
  priority?: number;
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

export interface Server {
  id: string;
  userId: string;
  name: string;
  type: 'vps' | 'dedicated';
  status: 'running' | 'stopped' | 'reboot' | 'rescue';
  os: string;
  location: string;
  ip: string;
  specs: ServerSpecs;
  monitoring: ServerMonitoring;
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