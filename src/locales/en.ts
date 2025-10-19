export const en = {
  // Common
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    retry: 'Retry',
    viewAll: 'View All',
    filter: 'Filter',
    apply: 'Apply',
    reset: 'Reset',
  },

  // Auth
  auth: {
    login: 'Login',
    register: 'Register',
    forgotPassword: 'Forgot Password',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    company: 'Company',
    phone: 'Phone',
    rememberMe: 'Remember Me',
    loginButton: 'Log In',
    registerButton: 'Sign Up',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signInHere: 'Sign In',
    signUpHere: 'Sign Up',
    twoFactorTitle: 'Two-Factor Authentication',
    twoFactorSubtitle: 'Enter the 6-digit code from your authenticator app',
    verifyCode: 'Verify Code',
    welcomeBack: 'Welcome Back',
    loginSubtitle: 'Login to manage your hosting',
    emailPlaceholder: 'Email address',
    passwordPlaceholder: 'Password',
    demoAccount: 'Demo Account',
    fillDemoCredentials: 'Fill Demo Credentials',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back',
    quickActions: 'Quick Actions',
    services: 'Services',
    activeServices: 'Active Services',
    recentActivity: 'Recent Activity',
    viewAllActivity: 'View All Activity',
  },

  // Services
  services: {
    title: 'Services',
    hosting: 'Hosting',
    domains: 'Domains',
    servers: 'Servers',
    active: 'Active',
    expired: 'Expired',
    suspended: 'Suspended',
    pending: 'Pending',
    autoRenew: 'Auto Renew',
    expiresOn: 'Expires on',
    diskUsage: 'Disk Usage',
    bandwidth: 'Bandwidth',
    manage: 'Manage',
  },

  // Profile
  profile: {
    title: 'Profile',
    account: 'Account',
    preferences: 'Preferences',
    personalInformation: 'Personal Information',
    security: 'Security',
    billing: 'Billing',
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    language: 'Language',
    logout: 'Log Out',
    editProfile: 'Edit Profile',
  },

  // Invoices
  invoices: {
    title: 'Invoices',
    paid: 'Paid',
    unpaid: 'Unpaid',
    overdue: 'Overdue',
    viewInvoice: 'View Invoice',
    downloadInvoice: 'Download Invoice',
    payNow: 'Pay Now',
    dueDate: 'Due Date',
    amount: 'Amount',
    status: 'Status',
  },

  // Support
  support: {
    title: 'Support',
    tickets: 'Tickets',
    createTicket: 'Create Ticket',
    subject: 'Subject',
    priority: 'Priority',
    status: 'Status',
    department: 'Department',
    message: 'Message',
    reply: 'Reply',
    open: 'Open',
    pending: 'Pending',
    resolved: 'Resolved',
    closed: 'Closed',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  },

  // Servers
  servers: {
    title: 'Servers',
    status: 'Status',
    running: 'Running',
    stopped: 'Stopped',
    reboot: 'Reboot',
    rescue: 'Rescue Mode',
    cpuUsage: 'CPU Usage',
    ramUsage: 'RAM Usage',
    diskUsage: 'Disk Usage',
    network: 'Network',
    uptime: 'Uptime',
    start: 'Start',
    stop: 'Stop',
    restart: 'Restart',
  },

  // Languages
  languages: {
    en: 'English',
    tr: 'Türkçe',
  },
};

export type TranslationKeys = typeof en;
