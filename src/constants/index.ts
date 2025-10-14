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
  LANGUAGE: '@rade_language',
  FIRST_LAUNCH: '@rade_first_launch',
};

export const COLORS = {
  // Primary colors with shades
  primary: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    gradient: ['#2196F3', '#1976D2'],
  },
  secondary: {
    main: '#9C27B0',
    light: '#BA68C8',
    dark: '#7B1FA2',
    gradient: ['#9C27B0', '#7B1FA2'],
  },
  
  // Status colors with shades
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    bg: '#E8F5E9',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    bg: '#FFF3E0',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
    bg: '#FFEBEE',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    bg: '#E3F2FD',
  },
  
  // Service specific colors
  hosting: {
    main: '#2196F3',
    gradient: ['#2196F3', '#1565C0'],
  },
  domain: {
    main: '#9C27B0',
    gradient: ['#9C27B0', '#6A1B9A'],
  },
  server: {
    main: '#FF9800',
    gradient: ['#FF9800', '#E65100'],
  },
  support: {
    main: '#795548',
    gradient: ['#795548', '#4E342E'],
  },
  
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
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  textInverse: '#FFFFFF',
  
  // Status colors (for backward compatibility)
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
  xxxl: 32,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
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