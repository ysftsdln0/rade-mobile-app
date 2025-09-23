// App constants and configuration

export const APP_CONFIG = {
  APP_NAME: 'RADE Mobile',
  VERSION: '1.0.0',
  COMPANY: 'RADE Hosting',
  SUPPORT_EMAIL: 'support@rade.com',
  WEBSITE: 'https://rade.com',
};

export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api' 
    : 'https://api.rade.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@rade_auth_token',
  REFRESH_TOKEN: '@rade_refresh_token',
  USER_DATA: '@rade_user_data',
  BIOMETRIC_ENABLED: '@rade_biometric_enabled',
  THEME_MODE: '@rade_theme_mode',
  LANGUAGE: '@rade_language',
  FIRST_LAUNCH: '@rade_first_launch',
};

export const COLORS = {
  primary: '#2196F3',
  secondary: '#FF9800',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#00BCD4',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Background colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  
  // Status colors
  online: '#4CAF50',
  offline: '#F44336',
  pending: '#FF9800',
  suspended: '#9E9E9E',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

export const HOSTING_PACKAGE_TYPES = {
  SHARED: 'shared',
  VPS: 'vps',
  DEDICATED: 'dedicated',
} as const;

export const HOSTING_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
  PENDING: 'pending',
} as const;

export const SERVER_STATUS = {
  RUNNING: 'running',
  STOPPED: 'stopped',
  REBOOT: 'reboot',
  RESCUE: 'rescue',
} as const;

export const TICKET_STATUS = {
  OPEN: 'open',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const INVOICE_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const CHART_COLORS = [
  '#2196F3', // Primary
  '#FF9800', // Secondary
  '#4CAF50', // Success
  '#F44336', // Error
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FFC107', // Amber
  '#795548', // Brown
];

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  TRY: '₺',
  GBP: '£',
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const;

export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
  CODE: ['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'php', 'py', 'java'],
  VIDEO: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
  AUDIO: ['mp3', 'wav', 'ogg', 'aac', 'flac'],
} as const;

export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  GENERAL: 50 * 1024 * 1024, // 50MB
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const REFRESH_INTERVALS = {
  MONITORING: 30000, // 30 seconds
  NOTIFICATIONS: 60000, // 1 minute
  DASHBOARD: 300000, // 5 minutes
} as const;