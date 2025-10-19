import { colors, semanticColors } from "../styles/colors";

export const APP_CONFIG = {
  APP_NAME: "RADE Mobile",
  VERSION: "1.0.0",
  COMPANY: "RADE Hosting",
  SUPPORT_EMAIL: "support@rade.com",
  WEBSITE: "https://rade.com",
};

export const API_CONFIG = {
  BASE_URL: __DEV__ ? "http://localhost:3000/api" : "https://api.rade.com",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "@rade_auth_token",
  REFRESH_TOKEN: "@rade_refresh_token",
  USER_DATA: "@rade_user_data",
  BIOMETRIC_ENABLED: "@rade_biometric_enabled",
  LANGUAGE: "@rade_language",
  FIRST_LAUNCH: "@rade_first_launch",
};

export const COLORS = {
  primary: {
    main: colors.primary[500],
    light: colors.primary[400],
    dark: colors.primary[600],
    gradient: [colors.accent.gradient_start, colors.accent.gradient_end],
  },
  secondary: {
    main: colors.accent.gradient_end,
    light: colors.primary[300],
    dark: colors.primary[700],
    gradient: [colors.accent.gradient_end, colors.primary[600]],
  },
  success: {
    main: colors.semantic.success,
    light: colors.semantic.success,
    dark: colors.semantic.success,
    bg: colors.semantic.success,
  },
  warning: {
    main: colors.semantic.warning,
    light: colors.semantic.warning,
    dark: colors.semantic.warning,
    bg: colors.semantic.warning,
  },
  error: {
    main: colors.semantic.error,
    light: colors.semantic.error,
    dark: colors.semantic.error,
    bg: colors.semantic.error,
  },
  info: {
    main: colors.primary[500],
    light: colors.primary[400],
    dark: colors.primary[600],
    bg: colors.primary[200],
  },
  hosting: {
    main: colors.primary[500],
    gradient: [colors.primary[500], colors.primary[600]],
  },
  domain: {
    main: colors.accent.gradient_end,
    gradient: [colors.accent.gradient_end, colors.primary[600]],
  },
  server: {
    main: colors.semantic.warning,
    gradient: [colors.semantic.warning, colors.semantic.warning],
  },
  support: {
    main: colors.neutral[500],
    gradient: [colors.neutral[500], colors.neutral[600]],
  },
  white: "#FFFFFF",
  black: "#000000",
  gray100: colors.neutral[100],
  gray200: colors.neutral[200],
  gray300: colors.neutral[300],
  gray400: colors.neutral[400],
  gray500: colors.neutral[500],
  gray600: colors.neutral[600],
  gray700: colors.neutral[700],
  gray800: colors.neutral[800],
  gray900: colors.neutral[900],
  background: colors.neutral[50],
  surface: "#FFFFFF",
  overlay: "rgba(0, 0, 0, 0.5)",
  textPrimary: semanticColors.text.primary,
  textSecondary: semanticColors.text.secondary,
  textDisabled: colors.neutral[300],
  textInverse: "#FFFFFF",
  online: colors.semantic.success,
  offline: colors.status.offline,
  pending: colors.semantic.pending,
  suspended: colors.neutral[300],
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
  h1: { fontSize: 32, fontWeight: "700" as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: "700" as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: "600" as const, lineHeight: 24 },
  body1: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: "600" as const, lineHeight: 24 },
};

export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const HOSTING_PACKAGE_TYPES = {
  SHARED: "shared",
  VPS: "vps",
  DEDICATED: "dedicated",
} as const;

export const HOSTING_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  EXPIRED: "expired",
  PENDING: "pending",
} as const;

export const SERVER_STATUS = {
  RUNNING: "running",
  STOPPED: "stopped",
  REBOOT: "reboot",
  RESCUE: "rescue",
} as const;

export const TICKET_STATUS = {
  OPEN: "open",
  PENDING: "pending",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

export const TICKET_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const INVOICE_STATUS = {
  PAID: "paid",
  UNPAID: "unpaid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
  PAYPAL: "paypal",
} as const;

export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

export const CHART_COLORS = [
  "#2196F3",
  "#FF9800",
  "#4CAF50",
  "#F44336",
  "#9C27B0",
  "#00BCD4",
  "#FFC107",
  "#795548",
];

export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  TRY: "₺",
  GBP: "£",
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
] as const;

export const FILE_TYPES = {
  IMAGE: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
  DOCUMENT: ["pdf", "doc", "docx", "txt", "rtf"],
  ARCHIVE: ["zip", "rar", "7z", "tar", "gz"],
  CODE: ["html", "css", "js", "ts", "jsx", "tsx", "php", "py", "java"],
  VIDEO: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
  AUDIO: ["mp3", "wav", "ogg", "aac", "flac"],
} as const;

export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024,
  DOCUMENT: 10 * 1024 * 1024,
  GENERAL: 50 * 1024 * 1024,
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const REFRESH_INTERVALS = {
  MONITORING: 30000,
  NOTIFICATIONS: 60000,
  DASHBOARD: 300000,
} as const;

export const FEATURE_FLAGS = {
  ENABLE_BIOMETRIC: true,
  ENABLE_PUSH_NOTIFICATIONS: false,
  ENABLE_DARK_MODE: false,
  ENABLE_OFFLINE_MODE: false,
};
