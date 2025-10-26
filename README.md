# RADE Mobile App 🚀

<div align="center">

![RADE Logo](./assets/icon.png)

**Profesyonel Hosting Yönetim Platformu**

Modern hosting sağlayıcıları için kapsamlı müşteri yönetim mobil uygulaması

[![Expo](https://img.shields.io/badge/Expo-54.0-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

</div>

---

## 📋 İçindekiler

- [Genel Bakış](#-genel-bakış)
- [Özellikler](#-özellikler)
- [Teknoloji Stack](#-teknoloji-stack)
- [Proje Mimarisi](#-proje-mimarisi)
- [Kurulum](#-kurulum)
- [Geliştirme](#-geliştirme)
- [Proje Yapısı](#-proje-yapısı)
- [Backend API](#-backend-api)
- [Veritabanı Şeması](#-veritabanı-şeması)
- [State Management](#-state-management)
- [Navigasyon](#-navigasyon)
- [Tema Sistemi](#-tema-sistemi)
- [Dil Desteği](#-dil-desteği)
- [Component Library](#-component-library)
- [API Entegrasyonu](#-api-entegrasyonu)
- [Güvenlik](#-güvenlik)
- [Deployment](#-deployment)
- [Katkıda Bulunma](#-katkıda-bulunma)

---

## 🎯 Genel Bakış

**RADE Mobile App**, hosting sağlayıcılarının müşterilerine sunacağı kapsamlı bir mobil yönetim platformudur. Müşteriler bu uygulama üzerinden hosting paketlerini, domain'lerini, VPS/Dedicated sunucularını yönetebilir, faturalarını görüntüleyebilir ve destek talepleri oluşturabilir.

### Temel Hedefler

- ✅ **Kullanıcı Dostu**: Modern, sezgisel ve Material Design 3 prensipleriyle tasarlanmış arayüz
- ✅ **Kapsamlı Yönetim**: Hosting, domain, server, fatura ve destek yönetimi
- ✅ **Gerçek Zamanlı İzleme**: Sunucu metrikleri ve kaynak kullanımı takibi
- ✅ **Çok Dilli**: Türkçe ve İngilizce dil desteği
- ✅ **Güvenli**: JWT token tabanlı kimlik doğrulama, refresh token rotation
- ✅ **Ölçeklenebilir**: Monorepo yapısı ile frontend ve backend entegrasyonu

---

## ✨ Özellikler

### 🏠 Dashboard
- Genel bakış ve hızlı erişim kartları
- Aktif hizmet sayıları (Hosting, Domain, Server)
- Son aktiviteler timeline'ı
- Yaklaşan fatura ve yenileme bildirimleri
- Kaynak kullanım özeti

### 🗄️ Hosting Yönetimi
- Hosting paketleri listesi (Shared, VPS, Dedicated)
- Detaylı paket görünümü ve kaynak kullanımı
- Disk ve bant genişliği kullanım grafikleri
- cPanel/Plesk entegrasyonu (Provider Pattern)
- Auto-renewal yönetimi
- Yükseltme ve downgrade işlemleri

### 🌐 Domain Yönetimi
- Domain listesi ve detay görünümü
- DNS kayıt yönetimi (A, AAAA, CNAME, MX, TXT)
- Nameserver güncelleme
- Domain transfer işlemleri
- WHOIS gizliliği yönetimi
- Auto-renewal ayarları

### 🖥️ Sunucu Yönetimi
- VPS ve Dedicated server listesi
- Gerçek zamanlı izleme (CPU, RAM, Disk, Network)
- Sunucu kontrolü (Start, Stop, Reboot, Rescue)
- İşletim sistemi bilgileri
- Grafik tabanlı metrik görüntüleme
- Alert sistemi (Provider Pattern)

### 💳 Fatura ve Ödeme
- Fatura listesi ve detay görünümü
- Ödeme geçmişi
- Ödeme yöntemi yönetimi (Kredi Kartı, Banka Transferi, PayPal)
- PDF fatura indirme
- Otomatik ödeme ayarları

### 🎫 Destek Sistemi
- Ticket oluşturma ve yönetimi
- Ticket geçmişi ve yanıtlar
- Öncelik seviyesi belirleme (Low, Medium, High, Urgent)
- Departman seçimi
- Bilgi bankası (FAQ)
- Canlı sohbet (Chatbot)

### 👤 Hesap Yönetimi
- Profil bilgileri güncelleme
- İki faktörlü kimlik doğrulama (2FA)
- Biyometrik giriş (Touch ID / Face ID)
- Bildirim tercihleri
- Dil ve tema ayarları
- Güvenlik ayarları

---

## 🛠 Teknoloji Stack

### Frontend (Mobile)

```json
{
  "platform": "Expo SDK 54",
  "runtime": "React Native 0.81.4",
  "language": "TypeScript 5.9",
  "navigation": "React Navigation 7.x (Stack + Tab + Drawer)",
  "state": "Redux Toolkit 2.9 + React Query 5.90",
  "ui": "React Native Paper 5.14 (Material Design 3)",
  "forms": "React Hook Form 7.53 + Zod",
  "http": "Axios 1.12",
  "storage": "Expo SecureStore + AsyncStorage",
  "auth": "JWT + Biometric (expo-local-authentication)",
  "animations": "Lottie React Native"
}
```

### Backend (API)

```json
{
  "runtime": "Node.js",
  "framework": "Express 4.19",
  "language": "TypeScript 5.4",
  "orm": "Prisma 6.17",
  "database": "PostgreSQL",
  "auth": "JWT (jsonwebtoken 9.0 + bcryptjs 2.4)",
  "validation": "Zod 3.23",
  "dev-tools": "tsx (dev), tsc (build)"
}
```

### DevOps & Tools

- **Package Manager**: npm
- **Monorepo**: Workspace yapısı (frontend + backend)
- **Linting**: ESLint 9.36
- **Formatting**: Prettier 3.6
- **Version Control**: Git

---

## 🏗 Proje Mimarisi

### Monorepo Yapısı

```
rade-mobile-app/
├── src/                    # Frontend (React Native)
│   ├── components/         # Reusable UI components
│   ├── screens/            # Screen components
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API & external services
│   ├── store/              # Redux store
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Theme & design tokens
│   ├── utils/              # Helpers & contexts
│   ├── types/              # TypeScript definitions
│   ├── locales/            # i18n translations
│   └── constants/          # App constants
│
├── backend/                # Backend (Express + Prisma)
│   ├── src/
│   │   ├── server.ts       # Express app entry
│   │   ├── auth.ts         # Auth routes & JWT logic
│   │   ├── user.ts         # User routes
│   │   ├── db.ts           # Prisma client
│   │   └── types.ts        # Backend types
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       ├── seed.ts         # Seed data
│       └── migrations/     # Database migrations
│
├── designs/                # HTML prototypes (design references)
├── docs/                   # Documentation
└── assets/                 # Static assets (images, fonts)
```

### Mimari Prensipler

1. **Separation of Concerns**: UI, Business Logic, API layer ayrımı
2. **Component Composition**: Atomic design prensibi ile component hiyerarşisi
3. **Provider Pattern**: External service entegrasyonları için interface-based approach
4. **Hooks Pattern**: React Query hooks ile data fetching
5. **Context API**: Theme ve Language global state yönetimi
6. **Type Safety**: Strict TypeScript, Zod validation

---

## 🚀 Kurulum

### Önkoşullar

```bash
# Node.js 18+ ve npm gereklidir
node --version  # v18.0.0+
npm --version   # v9.0.0+

# Expo CLI (global)
npm install -g expo-cli

# iOS geliştirme için (macOS)
# - Xcode 14+
# - CocoaPods

# Android geliştirme için
# - Android Studio
# - JDK 11+
```

### Proje Kurulumu

```bash
# Repository'yi klonlayın
git clone https://github.com/yourusername/rade-mobile-app.git
cd rade-mobile-app

# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install

# Prisma setup
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### Environment Variables

#### Frontend (.env)
```env
# API Configuration (otomatik olarak __DEV__ flag'ine göre ayarlanır)
# Development: http://localhost:3000/api
# Production: https://api.rade.com
```

#### Backend (backend/.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rade_db?schema=public"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"

# Server
PORT=3000
NODE_ENV=development
```

### PostgreSQL Database Setup

```bash
# PostgreSQL kurulumu (macOS)
brew install postgresql@15
brew services start postgresql@15

# Database oluşturma
createdb rade_db

# Prisma migration
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 💻 Geliştirme

### Frontend Çalıştırma

```bash
# Development server
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Web (Expo web)
npm run web
```

### Backend Çalıştırma

```bash
cd backend

# Development mode (hot reload)
npm run dev

# Build için
npm run build

# Production mode
npm start

# Prisma Studio (Database GUI)
npm run db:studio
```

### Geliştirme Workflow

1. **Feature Branch Oluşturma**
   ```bash
   git checkout -b feature/yeni-ozellik
   ```

2. **API Endpoint Ekleme**
   - `backend/prisma/schema.prisma` - Model tanımla
   - `backend/src/server.ts` - Route ekle
   - `src/services/api.ts` - Frontend method ekle
   - `src/types/index.ts` - TypeScript type tanımla

3. **Screen Oluşturma**
   - `src/screens/[domain]/` - Yeni screen component
   - `src/navigation/` - Route tanımlama
   - `src/hooks/` - React Query hook oluştur

4. **Component Ekleme**
   - `src/components/common/` - Reusable component
   - `src/components/common/index.ts` - Export ekle

### Development Tips

- **Hot Reload**: Frontend değişikliklerinde otomatik reload
- **Backend Watch**: `npm run dev` ile backend auto-restart
- **Type Safety**: `tsc --noEmit` ile type check
- **Prisma Studio**: Database'i GUI ile yönet
- **React Query DevTools**: Network isteklerini izle
- **Expo DevTools**: Debug menüsü için `Cmd+D` (iOS) / `Cmd+M` (Android)

---

## 📁 Proje Yapısı

### Frontend Detaylı Yapı

```
src/
├── components/
│   ├── common/                     # Reusable components
│   │   ├── Button.tsx              # Primary component (5 variants)
│   │   ├── Card.tsx                # Container component
│   │   ├── Badge.tsx               # Status badges
│   │   ├── StatusBadge.tsx         # Color-coded status
│   │   ├── Chip.tsx                # Selection chips
│   │   ├── TextInput.tsx           # Form input
│   │   ├── SearchBar.tsx           # Search functionality
│   │   ├── Avatar.tsx              # User avatars
│   │   ├── MetricCard.tsx          # Dashboard metrics
│   │   ├── ServiceCard.tsx         # Service listings
│   │   ├── ListItem.tsx            # List rows
│   │   ├── DataRow.tsx             # Key-value pairs
│   │   ├── Progress.tsx            # Progress bars
│   │   ├── AlertBanner.tsx         # Alerts/notifications
│   │   ├── EmptyState.tsx          # Empty list state
│   │   ├── LoadingState.tsx        # Loading indicators
│   │   ├── FilterTabs.tsx          # Tab filters
│   │   ├── Timeline.tsx            # Activity timeline
│   │   ├── Rating.tsx              # Star ratings
│   │   ├── DashboardHeader.tsx     # Page headers
│   │   ├── AppHeader.tsx           # Navigation header
│   │   ├── AppCard.tsx             # Feature cards
│   │   ├── FloatingActionButton.tsx # FAB
│   │   ├── ThemeToggleButton.tsx   # Dark mode toggle
│   │   └── index.ts                # Barrel export
│   ├── charts/                     # Chart components
│   ├── forms/                      # Form components
│   ├── modals/                     # Modal dialogs
│   └── ThemedStatusBar.tsx         # Status bar handler
│
├── screens/
│   ├── auth/                       # Authentication screens
│   │   ├── LoginScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── ResetPasswordScreen.tsx
│   │   └── TwoFactorScreen.tsx
│   ├── dashboard/                  # Main dashboard
│   │   └── DashboardScreen.tsx
│   ├── hosting/                    # Hosting management
│   │   ├── HostingListScreen.tsx
│   │   ├── HostingDetailScreen.tsx
│   │   └── HostingUpgradeScreen.tsx
│   ├── domain/                     # Domain management
│   │   ├── DomainListScreen.tsx
│   │   ├── DomainDetailScreen.tsx
│   │   └── DomainDNSScreen.tsx
│   ├── server/                     # Server management
│   │   ├── ServerListScreen.tsx
│   │   ├── ServerDetailScreen.tsx
│   │   └── ServerMonitoringScreen.tsx
│   ├── finance/                    # Billing & invoices
│   │   ├── InvoiceListScreen.tsx
│   │   ├── InvoiceDetailScreen.tsx
│   │   └── PaymentMethodsScreen.tsx
│   ├── support/                    # Support system
│   │   ├── TicketListScreen.tsx
│   │   ├── TicketDetailScreen.tsx
│   │   ├── CreateTicketScreen.tsx
│   │   └── KnowledgeBaseScreen.tsx
│   ├── account/                    # Account settings
│   │   ├── AccountMainScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SecurityScreen.tsx
│   │   ├── NotificationSettingsScreen.tsx
│   │   └── components/
│   ├── services/                   # Service overview
│   ├── purchase/                   # Purchase flows
│   ├── SplashScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── PlaceholderScreens.tsx
│   └── ComponentShowcaseScreen.tsx
│
├── navigation/
│   ├── RootNavigator.tsx           # Root stack (Splash, Auth, Main)
│   ├── AuthNavigator.tsx           # Auth flow stack
│   ├── ServicesNavigator.tsx       # Services tab stack
│   ├── SupportNavigator.tsx        # Support tab stack
│   └── AccountNavigator.tsx        # Account tab stack
│
├── services/
│   ├── api.ts                      # Axios client + all endpoints
│   ├── storage.ts                  # SecureStore wrapper
│   └── external/                   # Provider interfaces
│       ├── TwoFactorProvider.ts    # 2FA interface
│       ├── BillingProvider.ts      # Payment gateway interface
│       └── MonitoringProvider.ts   # Server monitoring interface
│
├── store/
│   ├── index.ts                    # Redux store config
│   ├── authSlice.ts                # Auth state slice
│   └── authThunks.ts               # Async auth actions
│
├── hooks/
│   ├── useInvoices.ts              # Invoice data hook
│   ├── useTwoFactor.ts             # 2FA hook
│   └── useServerMonitoring.ts      # Server metrics hook
│
├── styles/
│   ├── colors.ts                   # Color palette
│   ├── theme.ts                    # React Native Paper theme
│   ├── typography.ts               # Font styles
│   ├── spacing.ts                  # Spacing scale
│   ├── shadows.ts                  # Shadow definitions
│   └── index.ts                    # Barrel export
│
├── utils/
│   ├── ThemeContext.tsx            # Dark mode context
│   ├── LanguageContext.tsx         # i18n context
│   ├── ReactQueryProvider.tsx      # React Query setup
│   └── activityHelpers.ts          # Helper functions
│
├── types/
│   └── index.ts                    # All TypeScript types
│
├── locales/
│   ├── en.ts                       # English translations
│   ├── tr.ts                       # Turkish translations
│   └── index.ts                    # i18n config
│
└── constants/
    └── index.ts                    # App constants, config
```

### Backend Detaylı Yapı

```
backend/
├── src/
│   ├── server.ts                   # Express app + middleware
│   ├── auth.ts                     # Auth routes (login, register, refresh)
│   ├── user.ts                     # User routes (profile, 2FA)
│   ├── db.ts                       # Prisma client singleton
│   └── types.ts                    # Backend TypeScript types
│
├── prisma/
│   ├── schema.prisma               # Database models (15 models)
│   ├── seed.ts                     # Seed data generator
│   └── migrations/                 # Prisma migrations
│       ├── migration_lock.toml
│       └── 20251018152415_init/
│           └── migration.sql
│
├── package.json                    # Backend dependencies
└── tsconfig.json                   # TypeScript config
```

---

## 🌐 Backend API

### Authentication Endpoints

```typescript
POST   /api/auth/register          // Yeni kullanıcı kaydı
POST   /api/auth/login             // Giriş (JWT token döner)
POST   /api/auth/refresh           // Refresh token ile token yenileme
POST   /api/auth/logout            // Çıkış (refresh token iptal)
POST   /api/auth/forgot-password   // Şifre sıfırlama talebi
POST   /api/auth/reset-password    // Şifre sıfırlama
```

### User Endpoints

```typescript
GET    /api/me                     // Kullanıcı bilgileri
PATCH  /api/me                     // Profil güncelleme
GET    /api/me/hosting-packages    // Hosting paketleri
GET    /api/me/domains             // Domain listesi
GET    /api/me/servers             // Sunucu listesi
GET    /api/me/invoices            // Fatura listesi
GET    /api/me/support-tickets     // Destek talepleri
GET    /api/me/activities          // Aktivite geçmişi
```

### Hosting Endpoints

```typescript
GET    /api/hosting                // Tüm hosting paketleri
GET    /api/hosting/:id            // Tek hosting detayı
PATCH  /api/hosting/:id            // Hosting güncelleme
POST   /api/hosting/:id/upgrade    // Paket yükseltme
POST   /api/hosting/:id/renew      // Yenileme
```

### Domain Endpoints

```typescript
GET    /api/domains                // Tüm domainler
GET    /api/domains/:id            // Domain detayı
PATCH  /api/domains/:id            // Domain güncelleme
GET    /api/domains/:id/dns        // DNS kayıtları
POST   /api/domains/:id/dns        // DNS kaydı ekleme
PATCH  /api/domains/:id/dns/:dnsId // DNS kaydı güncelleme
DELETE /api/domains/:id/dns/:dnsId // DNS kaydı silme
```

### Server Endpoints

```typescript
GET    /api/servers                // Tüm sunucular
GET    /api/servers/:id            // Sunucu detayı
POST   /api/servers/:id/start      // Sunucu başlat
POST   /api/servers/:id/stop       // Sunucu durdur
POST   /api/servers/:id/reboot     // Sunucu yeniden başlat
GET    /api/servers/:id/metrics    // Sunucu metrikleri
```

### Invoice Endpoints

```typescript
GET    /api/invoices               // Tüm faturalar
GET    /api/invoices/:id           // Fatura detayı
POST   /api/invoices/:id/pay       // Fatura öde
GET    /api/invoices/:id/pdf       // PDF indir
```

### Support Endpoints

```typescript
GET    /api/tickets                // Tüm ticketlar
GET    /api/tickets/:id            // Ticket detayı
POST   /api/tickets                // Yeni ticket oluştur
POST   /api/tickets/:id/reply      // Ticket'a cevap
PATCH  /api/tickets/:id/status     // Status güncelle
```

### API Response Format

```typescript
// Başarılı response
{
  "success": true,
  "data": { /* data */ }
}

// Hata response
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### JWT Token Structure

```typescript
// Access Token (15 dakika)
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234568790
}

// Refresh Token (7 gün)
{
  "userId": "uuid",
  "tokenId": "uuid",
  "iat": 1234567890,
  "exp": 1235172690
}
```

---

## 🗄️ Veritabanı Şeması

### Core Models

#### User
```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  firstName     String
  lastName      String
  company       String?
  phone         String?
  isVerified    Boolean  @default(false)
  createdAt     DateTime @default(now())
  lastLogin     DateTime?
  
  // Relations
  hostingPackages  HostingPackage[]
  domains          Domain[]
  servers          Server[]
  invoices         Invoice[]
  supportTickets   SupportTicket[]
  paymentMethods   PaymentMethod[]
  activities       ActivityItem[]
  refreshTokens    RefreshToken[]
}
```

#### HostingPackage
```prisma
model HostingPackage {
  id              String   @id @default(uuid())
  userId          String
  name            String
  domain          String
  packageType     String   // 'shared' | 'vps' | 'dedicated'
  status          String   // 'active' | 'suspended' | 'expired' | 'pending'
  diskUsage       Int
  diskLimit       Int
  bandwidthUsage  Int
  bandwidthLimit  Int
  expiryDate      DateTime
  autoRenew       Boolean  @default(false)
  
  // Extended fields
  ipAddress       String?
  nameservers     String[]
  features        String[]
  diskUsed        Int?
  diskTotal       Int?
  bandwidthUsed   Int?
  bandwidthTotal  Int?
  databases       Int      @default(0)
  ftpAccounts     Int      @default(0)
  emailAccounts   Int      @default(0)
  backupsEnabled  Boolean  @default(false)
  
  user User @relation(fields: [userId], references: [id])
}
```

#### Domain
```prisma
model Domain {
  id                 String   @id @default(uuid())
  userId             String
  name               String   @unique
  status             String   // 'active' | 'expired' | 'pending' | 'transferred'
  registrationDate   DateTime
  expiryDate         DateTime
  autoRenew          Boolean  @default(false)
  nameservers        String[]
  isPrivacyProtected Boolean  @default(false)
  
  dnsRecords DnsRecord[]
  user       User        @relation(fields: [userId], references: [id])
}
```

#### Server
```prisma
model Server {
  id       String   @id @default(uuid())
  userId   String
  name     String
  type     String   // 'vps' | 'dedicated'
  status   String   // 'running' | 'stopped' | 'reboot' | 'rescue'
  os       String
  location String
  ip       String
  
  // Specs
  cpu     String
  ram     String
  disk    String
  network String
  
  // Monitoring
  cpuUsage    Int
  ramUsage    Int
  diskUsage   Int
  networkIn   Int
  networkOut  Int
  uptime      Int
  
  createdAt DateTime @default(now())
  user User @relation(fields: [userId], references: [id])
}
```

#### Invoice
```prisma
model Invoice {
  id       String   @id @default(uuid())
  userId   String
  number   String   @unique
  date     DateTime
  dueDate  DateTime
  amount   Float
  currency String   @default("USD")
  status   String   // 'paid' | 'unpaid' | 'overdue' | 'cancelled'
  
  items InvoiceItem[]
  user  User          @relation(fields: [userId], references: [id])
}
```

#### SupportTicket
```prisma
model SupportTicket {
  id         String   @id @default(uuid())
  userId     String
  subject    String
  status     String   // 'open' | 'pending' | 'resolved' | 'closed'
  priority   String   // 'low' | 'medium' | 'high' | 'urgent'
  department String
  createdAt  DateTime @default(now())
  lastReply  DateTime
  
  replies TicketReply[]
  user    User          @relation(fields: [userId], references: [id])
}
```

### Tüm Modeller (15)

1. **User** - Kullanıcı bilgileri
2. **RefreshToken** - JWT refresh token'lar
3. **HostingPackage** - Hosting paketleri
4. **Domain** - Domain kayıtları
5. **DnsRecord** - DNS kayıtları
6. **Server** - VPS/Dedicated sunucular
7. **Invoice** - Faturalar
8. **InvoiceItem** - Fatura kalemleri
9. **PaymentMethod** - Ödeme yöntemleri
10. **SupportTicket** - Destek talepleri
11. **TicketReply** - Ticket cevapları
12. **ActivityItem** - Aktivite logları

---

## 🔄 State Management

### Redux (Auth Only)

```typescript
// src/store/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Actions
- login()
- logout()
- refreshToken()
- updateProfile()
```

### React Query (API Data)

```typescript
// src/hooks/useInvoices.ts
export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => apiService.getInvoices(),
    staleTime: 30000,
  });
};

// Usage
const { data, isLoading, error } = useInvoices();
```

### Context API

#### ThemeContext
```typescript
const { colors, isDark, setThemeMode } = useTheme();

// colors: Light/dark mode renkler
// isDark: Dark mode aktif mi?
// setThemeMode: 'light' | 'dark' | 'system'
```

#### LanguageContext
```typescript
const { t, language, setLanguage } = useLanguage();

// t: Translation function
// language: 'tr' | 'en'
// setLanguage: Dil değiştir
```

---

## 🧭 Navigasyon

### Navigation Hierarchy (4 Level)

```
RootNavigator (Stack)
├─ Splash
├─ Onboarding
├─ Auth (Stack)
│  ├─ Login
│  ├─ ForgotPassword
│  └─ ResetPassword
│
└─ Main (Bottom Tabs)
   ├─ Dashboard (Single Screen)
   │
   ├─ Services (Stack) [Tab Label: "Hizmetler"]
   │  ├─ HostingList
   │  ├─ HostingDetail
   │  ├─ DomainList
   │  ├─ DomainDetail
   │  ├─ ServerList
   │  └─ ServerDetail
   │
   ├─ Support (Stack) [Tab Label: "Destek"]
   │  ├─ InvoiceList
   │  ├─ InvoiceDetail
   │  ├─ TicketList
   │  ├─ TicketDetail
   │  └─ CreateTicket
   │
   ├─ Chatbot (Single Screen)
   │
   └─ Account (Stack)
      ├─ AccountMain
      ├─ Profile
      ├─ Security
      └─ Settings
```

### Type-Safe Navigation

```typescript
// src/types/index.ts
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type ServicesStackParamList = {
  HostingList: undefined;
  HostingDetail: { id: string };
  DomainList: undefined;
  DomainDetail: { id: string };
};

// Usage
type ScreenNavigationProp = StackNavigationProp<
  ServicesStackParamList,
  'HostingDetail'
>;

navigation.navigate('HostingDetail', { id: '123' });
```

---

## 🎨 Tema Sistemi

### Color Palette

```typescript
// Primary Blue (#135bec)
colors.primary = {
  50: '#e6f0ff',
  100: '#b3d1ff',
  200: '#80b3ff',
  300: '#4d94ff',
  400: '#267aff',
  500: '#135bec',  // Main
  600: '#0f4bbd',
  700: '#0b3b8f',
  800: '#072b60',
  900: '#031b31',
};

// Semantic Colors
colors.semantic = {
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  pending: '#8b5cf6',
};
```

### Dark Mode (Hazır, Aktif Değil)

```typescript
// src/utils/ThemeContext.tsx
const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  isDark: false,
  setThemeMode: () => {},
});

// Usage
const MyComponent = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
};
```

### Design Tokens

```typescript
// Spacing Scale
spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

// Typography Scale
typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};

// Shadows
shadows = {
  sm: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08 },
  md: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12 },
  lg: { shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15 },
};
```

---

## 🌍 Dil Desteği

### Supported Languages

- 🇹🇷 **Türkçe** (tr)
- 🇺🇸 **English** (en)

### Translation Structure

```typescript
// src/locales/tr.ts
export default {
  common: {
    save: 'Kaydet',
    cancel: 'İptal',
    delete: 'Sil',
    edit: 'Düzenle',
  },
  auth: {
    login: 'Giriş Yap',
    logout: 'Çıkış Yap',
    email: 'E-posta',
    password: 'Şifre',
  },
  dashboard: {
    welcome: 'Hoş Geldiniz',
    overview: 'Genel Bakış',
  },
  // ... 100+ translations
};

// Usage
const { t } = useLanguage();
<Text>{t('auth.login')}</Text>
```

### Language Switching

```typescript
const { language, setLanguage } = useLanguage();

<Button onPress={() => setLanguage('en')} label="English" />
<Button onPress={() => setLanguage('tr')} label="Türkçe" />
```

---

## 🧩 Component Library

### Button Component (Signature)

```typescript
<Button 
  variant="primary"    // 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient'
  size="md"           // 'sm' | 'md' | 'lg'
  label="Action"
  onPress={handlePress}
  loading={isLoading}
  disabled={false}
  icon={<Icon name="check" />}
  fullWidth
/>
```

### Card Component

```typescript
<Card 
  title="Hosting Paketi"
  subtitle="example.com"
  status="active"
  onPress={handlePress}
>
  <Text>Content</Text>
</Card>
```

### MetricCard Component

```typescript
<MetricCard
  title="CPU Kullanımı"
  value="45%"
  icon="cpu-chip"
  color={colors.primary[500]}
  trend="+5%"
  trendUp={true}
/>
```

### StatusBadge Component

```typescript
<StatusBadge 
  status="active"    // 'active' | 'expired' | 'pending' | 'suspended'
  label="Aktif"
/>
```

### Tüm Componentler (25+)

- **Button** - Action buttons (5 variants)
- **Card** - Container cards
- **Badge** - Status badges
- **StatusBadge** - Color-coded status
- **Chip** - Selection chips
- **TextInput** - Form inputs
- **SearchBar** - Search functionality
- **Avatar** - User avatars
- **MetricCard** - Dashboard metrics
- **ServiceCard** - Service listings
- **ListItem** - List rows
- **DataRow** - Key-value pairs
- **Progress** - Progress bars
- **AlertBanner** - Alerts
- **EmptyState** - Empty list state
- **LoadingState** - Loading indicators
- **FilterTabs** - Tab filters
- **Timeline** - Activity timeline
- **Rating** - Star ratings
- **DashboardHeader** - Page headers
- **AppHeader** - Navigation header
- **AppCard** - Feature cards
- **FloatingActionButton** - FAB
- **ThemeToggleButton** - Dark mode toggle

---

## 🔌 API Entegrasyonu

### API Service Structure

```typescript
// src/services/api.ts
class ApiService {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });
    this.setupInterceptors();
  }
  
  // Auth endpoints
  async login(email: string, password: string) { }
  async register(data: RegisterData) { }
  async refreshToken(refreshToken: string) { }
  
  // User endpoints
  async getProfile() { }
  async updateProfile(data: ProfileData) { }
  
  // Hosting endpoints
  async getHostingPackages() { }
  async getHostingPackage(id: string) { }
  async upgradeHosting(id: string, newPlan: string) { }
  
  // Domain endpoints
  async getDomains() { }
  async getDomain(id: string) { }
  async updateDNS(domainId: string, records: DNSRecord[]) { }
  
  // Server endpoints
  async getServers() { }
  async getServerMetrics(id: string) { }
  async controlServer(id: string, action: string) { }
  
  // Invoice endpoints
  async getInvoices() { }
  async getInvoice(id: string) { }
  async payInvoice(id: string, paymentMethodId: string) { }
  
  // Ticket endpoints
  async getTickets() { }
  async createTicket(data: TicketData) { }
  async replyToTicket(id: string, message: string) { }
}

export const apiService = new ApiService();
```

### Request Interceptor (JWT)

```typescript
this.client.interceptors.request.use(async (config) => {
  const token = await storageService.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor (Refresh Token)

```typescript
this.client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await storageService.getRefreshToken();
      const { token, refreshToken: newRefreshToken } = 
        await this.refreshAuthToken(refreshToken);
      await storageService.setAuthTokens(token, newRefreshToken);
      return this.client(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

### Provider Pattern (External Services)

```typescript
// src/services/external/TwoFactorProvider.ts
export interface TwoFactorProvider {
  isEnabled(userId: string): Promise<boolean>;
  enable(userId: string): Promise<TwoFactorSetup>;
  verify(userId: string, code: string): Promise<boolean>;
  disable(userId: string): Promise<boolean>;
}

// Mock implementation
class MockTwoFactorProvider implements TwoFactorProvider {
  async isEnabled(userId: string): Promise<boolean> {
    return false;
  }
  // ... mock methods
}

// Real implementation (future)
class GoogleAuthenticatorProvider implements TwoFactorProvider {
  // ... real implementation
}

// Usage
const twoFactorProvider: TwoFactorProvider = new MockTwoFactorProvider();
```

---

## 🔐 Güvenlik

### Authentication Flow

1. **Login**: Email + Password → JWT Token + Refresh Token
2. **Token Storage**: Expo SecureStore (encrypted)
3. **API Requests**: Bearer token in Authorization header
4. **Token Expiry**: 15 dakika (access token), 7 gün (refresh token)
5. **Refresh Flow**: 401 error → refresh token → new access token → retry request

### Security Features

- ✅ **JWT Token**: RS256 asymmetric encryption
- ✅ **Refresh Token Rotation**: Her refresh'te yeni token
- ✅ **Password Hashing**: bcryptjs (12 rounds)
- ✅ **Secure Storage**: Expo SecureStore (iOS Keychain, Android Keystore)
- ✅ **2FA Support**: TOTP-based two-factor authentication
- ✅ **Biometric Auth**: Touch ID / Face ID support
- ✅ **Input Validation**: Zod schema validation (frontend + backend)
- ✅ **SQL Injection Protection**: Prisma ORM parameterized queries
- ✅ **CORS Protection**: Configurable CORS middleware
- ✅ **Rate Limiting**: (TODO) Express rate limit middleware

### Environment Security

```bash
# CRITICAL: Never commit these files
backend/.env
.env

# Store secrets in:
# - iOS: Keychain
# - Android: Keystore
# - Backend: Environment variables
```

---

## 🚀 Deployment

### Frontend (Expo EAS)

```bash
# EAS Build setup
npm install -g eas-cli
eas login
eas build:configure

# iOS build
eas build --platform ios

# Android build
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Backend (Node.js Server)

```bash
# Build
cd backend
npm run build

# Production start
NODE_ENV=production npm start

# PM2 Process Manager
npm install -g pm2
pm2 start dist/server.js --name rade-api
pm2 save
pm2 startup
```

### Database Migration

```bash
# Production migration
cd backend
npx prisma migrate deploy

# Rollback (if needed)
npx prisma migrate resolve --rolled-back [migration_name]
```

### Environment Variables (Production)

```bash
# Backend
DATABASE_URL="postgresql://user:pass@host:5432/rade_prod"
JWT_SECRET="complex-production-secret-key"
JWT_REFRESH_SECRET="complex-refresh-secret-key"
NODE_ENV="production"
PORT=3000
CORS_ORIGIN="https://app.rade.com"

# Frontend (app.json)
{
  "expo": {
    "extra": {
      "apiUrl": "https://api.rade.com"
    }
  }
}
```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile (Backend)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY prisma ./prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

## 📚 Dokümantasyon

### Mevcut Dokümantasyon

- **[Integration Providers](./docs/integration-providers.md)** - External service entegrasyonları
- **[Dark Mode Implementation](./docs/dark-mode-implementation.md)** - Dark mode implementasyon rehberi
- **[Language Support](./docs/language-support.md)** - i18n sistem dokümantasyonu
- **[Dark Mode Summary](./docs/DARK_MODE_SUMMARY.md)** - Dark mode özet
- **[Backend Types](./backend/TYPES_LIST.md)** - Backend tip tanımlamaları

### Design References

- `designs/rade_dashboard/` - Dashboard HTML prototipi
- `designs/rade_login/` - Login ekranı prototipi
- `designs/rade_server_management/` - Server monitoring prototipi
- `designs/rade_billing/` - Fatura sistemi prototipi

---

## 🤝 Katkıda Bulunma

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/rade-mobile-app.git
   ```

2. **Feature Branch**
   ```bash
   git checkout -b feature/yeni-ozellik
   ```

3. **Development**
   - Frontend değişiklikleri → `src/` dizini
   - Backend değişiklikleri → `backend/src/` dizini
   - Type tanımlamaları → `src/types/index.ts`

4. **Testing**
   - Component testleri (TODO)
   - API endpoint testleri (TODO)
   - E2E testleri (TODO)

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: yeni özellik eklendi"
   git push origin feature/yeni-ozellik
   ```

6. **Pull Request**
   - Clear description
   - Screenshots (UI changes)
   - Breaking changes note

### Code Style

- **TypeScript**: Strict mode, no `any`
- **Components**: Functional components, hooks
- **Imports**: Relative paths (absolute paths not configured)
- **Formatting**: Prettier (auto-format on save)
- **Linting**: ESLint rules

### Commit Convention

```
feat: Yeni özellik
fix: Bug fix
docs: Dokümantasyon güncelleme
style: Code formatting
refactor: Code refactoring
test: Test ekleme/güncelleme
chore: Dependency updates
```

---

## 📞 İletişim & Destek

### Proje Bilgileri

- **Proje Adı**: RADE Mobile App
- **Versiyon**: 1.0.0
- **Durum**: Development
- **Lisans**: Private

### Geliştirici

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: developer@rade.com

### Issue Reporting

Bug veya özellik önerileriniz için GitHub Issues kullanın:
- 🐛 **Bug Report**: Bug detayları, adımlar, beklenen davranış
- ✨ **Feature Request**: Özellik açıklaması, kullanım senaryosu
- 📖 **Documentation**: Dokümantasyon eksiklikleri

---

## 📄 Lisans

Bu proje özel (private) bir projedir. Tüm hakları saklıdır.

---

## 🎯 Roadmap

### v1.0.0 (Current)
- ✅ Authentication system
- ✅ Dashboard & overview
- ✅ Hosting management
- ✅ Domain management
- ✅ Server monitoring
- ✅ Invoice & billing
- ✅ Support ticket system
- ✅ Multi-language support

### v1.1.0 (Planned)
- ⏳ Dark mode activation
- ⏳ Push notifications
- ⏳ Offline mode
- ⏳ Biometric login
- ⏳ Advanced filtering
- ⏳ Export reports (PDF)

### v1.2.0 (Future)
- 📅 Real-time chat support
- 📅 Advanced analytics
- 📅 Payment gateway integration
- 📅 Auto-scaling recommendations
- 📅 Multi-account management
- 📅 API marketplace

### v2.0.0 (Vision)
- 🔮 AI-powered chatbot
- 🔮 Predictive analytics
- 🔮 Smart recommendations
- 🔮 Reseller management
- 🔮 White-label support

---

<div align="center">

**Made with ❤️ by RADE Team**

[Website](https://rade.com) • [Documentation](./docs/) • [Support](mailto:support@rade.com)

</div>
