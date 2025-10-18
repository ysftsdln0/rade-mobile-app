# RADE Backend - Type Definitions Documentation

Complete reference for all TypeScript interfaces and types used in the RADE backend.

---

## Table of Contents

- [User Management](#user-management)
- [Hosting](#hosting)
- [Billing & Payments](#billing--payments)
- [Support System](#support-system)
- [Domains & DNS](#domains--dns)
- [Servers](#servers)
- [Activities](#activities)
- [API Response](#api-response)
- [Authentication](#authentication)

---

## User Management

### User

Main user account interface.

```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  company?: string;          // Optional
  phone?: string;            // Optional
  isVerified: boolean;
  createdAt: string;         // ISO 8601 date string
  lastLogin?: string;        // Optional, ISO 8601 date string
}
```

**Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "demo@rade.com",
  "passwordHash": "$2a$10$...",
  "firstName": "Demo",
  "lastName": "Kullanıcı",
  "company": "RADE Demo",
  "phone": "+90 555 123 45 67",
  "isVerified": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "lastLogin": "2025-10-18T14:22:00Z"
}
```

---

## Hosting

### HostingPackage

Core hosting package information.

```typescript
interface HostingPackage {
  id: string;
  userId: string;
  name: string;
  domain: string;
  packageType: 'shared' | 'vps' | 'dedicated';
  status: 'active' | 'suspended' | 'expired' | 'pending';
  diskUsage: number;         // GB
  diskLimit: number;         // GB
  bandwidthUsage: number;    // GB
  bandwidthLimit: number;    // GB
  expiryDate: string;        // ISO 8601 date string
  autoRenew: boolean;
}
```

**Package Types:**
- `shared` - Shared hosting
- `vps` - Virtual Private Server
- `dedicated` - Dedicated server

**Status Values:**
- `active` - Currently active and running
- `suspended` - Temporarily suspended
- `expired` - Expired package
- `pending` - Pending activation

**Example:**
```json
{
  "id": "pkg-001",
  "userId": "user-123",
  "name": "Starter Hosting",
  "domain": "example.com",
  "packageType": "shared",
  "status": "active",
  "diskUsage": 18,
  "diskLimit": 50,
  "bandwidthUsage": 120,
  "bandwidthLimit": 500,
  "expiryDate": "2026-01-15T00:00:00Z",
  "autoRenew": true
}
```

### HostingDetail

Extended hosting package with additional details (extends HostingPackage).

```typescript
interface HostingDetail extends HostingPackage {
  createdAt: string;         // ISO 8601 date string
  ipAddress: string;
  nameservers: string[];
  features: string[];
}
```

**Example:**
```json
{
  "id": "pkg-001",
  "userId": "user-123",
  "name": "Starter Hosting",
  "domain": "example.com",
  "packageType": "shared",
  "status": "active",
  "diskUsage": 18,
  "diskLimit": 50,
  "bandwidthUsage": 120,
  "bandwidthLimit": 500,
  "expiryDate": "2026-01-15T00:00:00Z",
  "autoRenew": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "ipAddress": "192.168.1.10",
  "nameservers": ["ns1.example.com", "ns2.example.com"],
  "features": ["SSL Sertifikası", "Günlük Yedekleme", "1 MySQL Veritabanı"]
}
```

### HostingUsage

Detailed usage statistics for a hosting package.

```typescript
interface HostingUsage {
  disk: { used: number; total: number };
  bandwidth: { used: number; total: number };
  databases: number;
  ftpAccounts: number;
  emailAccounts: number;
  backupsEnabled: boolean;
}
```

**Example:**
```json
{
  "disk": { "used": 18, "total": 50 },
  "bandwidth": { "used": 120, "total": 500 },
  "databases": 1,
  "ftpAccounts": 2,
  "emailAccounts": 5,
  "backupsEnabled": true
}
```

---

## Billing & Payments

### Invoice

Customer invoice.

```typescript
interface Invoice {
  id: string;
  userId: string;
  number: string;            // Invoice number (e.g., 'INV-2025-001')
  date: string;              // ISO 8601 date string
  dueDate: string;           // ISO 8601 date string
  amount: number;
  currency: string;          // ISO currency code (e.g., 'USD', 'EUR', 'TRY')
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}
```

**Status Values:**
- `paid` - Invoice has been paid
- `unpaid` - Invoice is unpaid but not overdue
- `overdue` - Invoice is past due date
- `cancelled` - Invoice has been cancelled

**Example:**
```json
{
  "id": "inv-1",
  "userId": "user-123",
  "number": "INV-2025-001",
  "date": "2025-10-01T00:00:00Z",
  "dueDate": "2025-10-15T00:00:00Z",
  "amount": 99,
  "currency": "USD",
  "status": "paid",
  "items": [
    {
      "id": "item-1",
      "description": "Hosting Paketi 1",
      "quantity": 1,
      "unitPrice": 99,
      "total": 99
    }
  ]
}
```

### InvoiceItem

Individual line item in an invoice.

```typescript
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
```

### PaymentMethod

Saved payment method for a user.

```typescript
interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit_card' | 'bank_transfer' | 'paypal';
  isDefault: boolean;
  lastFour?: string;         // Optional, last 4 digits of card
  expiryDate?: string;       // Optional, format: MM/YY
  cardType?: string;         // Optional, e.g., 'VISA', 'Mastercard', 'Amex'
}
```

**Payment Types:**
- `credit_card` - Credit or debit card
- `bank_transfer` - Bank transfer/wire
- `paypal` - PayPal account

**Example (Credit Card):**
```json
{
  "id": "pm-1",
  "userId": "user-123",
  "type": "credit_card",
  "isDefault": true,
  "cardType": "VISA",
  "lastFour": "4242",
  "expiryDate": "12/28"
}
```

**Example (PayPal):**
```json
{
  "id": "pm-2",
  "userId": "user-123",
  "type": "paypal",
  "isDefault": false
}
```

---

## Support System

### SupportTicket

Customer support ticket.

```typescript
interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  createdAt: string;         // ISO 8601 date string
  lastReply: string;         // ISO 8601 date string
  replies: TicketReply[];
}
```

**Status Values:**
- `open` - Ticket is open and awaiting response
- `pending` - Ticket is pending (waiting for customer)
- `resolved` - Ticket has been resolved
- `closed` - Ticket is closed

**Priority Levels:**
- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority
- `urgent` - Urgent, requires immediate attention

**Example:**
```json
{
  "id": "tick-1",
  "userId": "user-123",
  "subject": "SSL sertifikası yenilenmiyor",
  "status": "open",
  "priority": "urgent",
  "department": "Güvenlik",
  "createdAt": "2025-10-16T10:00:00Z",
  "lastReply": "2025-10-18T11:30:00Z",
  "replies": [
    {
      "id": "reply-1",
      "message": "Merhaba, SSL yenilemesinde hata alıyorum",
      "isFromSupport": false,
      "createdAt": "2025-10-16T10:00:00Z"
    },
    {
      "id": "reply-2",
      "message": "Destek ekibimiz talebinizi inceliyor.",
      "isFromSupport": true,
      "createdAt": "2025-10-18T11:30:00Z"
    }
  ]
}
```

### TicketReply

Individual reply in a support ticket conversation.

```typescript
interface TicketReply {
  id: string;
  message: string;
  isFromSupport: boolean;    // true if reply is from support team
  createdAt: string;         // ISO 8601 date string
}
```

---

## Domains & DNS

### Domain

Domain registration information.

```typescript
interface Domain {
  id: string;
  userId: string;
  name: string;              // Domain name (e.g., 'example.com')
  status: 'active' | 'expired' | 'pending' | 'transferred';
  registrationDate: string;  // ISO 8601 date string
  expiryDate: string;        // ISO 8601 date string
  autoRenew: boolean;
  nameservers: string[];
  isPrivacyProtected: boolean;
}
```

**Status Values:**
- `active` - Domain is active
- `expired` - Domain has expired
- `pending` - Domain registration/transfer pending
- `transferred` - Domain has been transferred

**Example:**
```json
{
  "id": "dom-1",
  "userId": "user-123",
  "name": "example.com",
  "status": "active",
  "registrationDate": "2024-05-01T00:00:00Z",
  "expiryDate": "2026-05-01T00:00:00Z",
  "autoRenew": true,
  "nameservers": ["ns1.rade.com", "ns2.rade.com"],
  "isPrivacyProtected": true
}
```

### DnsRecord

DNS record for a domain.

```typescript
interface DnsRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX';
  host: string;              // Hostname (e.g., '@', 'www', 'mail')
  value: string;             // Record value
  ttl: number;               // Time to live in seconds
  priority?: number;         // Optional, used for MX records
}
```

**DNS Record Types:**
- `A` - IPv4 address
- `AAAA` - IPv6 address
- `CNAME` - Canonical name (alias)
- `TXT` - Text record
- `MX` - Mail exchange record

**Example (A Record):**
```json
{
  "id": "dns-1",
  "type": "A",
  "host": "@",
  "value": "192.168.1.20",
  "ttl": 3600
}
```

**Example (MX Record):**
```json
{
  "id": "dns-2",
  "type": "MX",
  "host": "@",
  "value": "mail.rade.com",
  "ttl": 3600,
  "priority": 10
}
```

---

## Servers

### Server

Virtual or dedicated server.

```typescript
interface Server {
  id: string;
  userId: string;
  name: string;              // Server name (e.g., 'VPS-1')
  type: 'vps' | 'dedicated';
  status: 'running' | 'stopped' | 'reboot' | 'rescue';
  os: string;                // Operating system (e.g., 'Ubuntu 22.04')
  location: string;          // Data center location
  ip: string;                // Primary IP address
  specs: ServerSpecs;
  monitoring: ServerMonitoring;
}
```

**Server Types:**
- `vps` - Virtual Private Server
- `dedicated` - Dedicated server

**Status Values:**
- `running` - Server is running
- `stopped` - Server is stopped
- `reboot` - Server is rebooting
- `rescue` - Server is in rescue mode

**Example:**
```json
{
  "id": "srv-1",
  "userId": "user-123",
  "name": "VPS-1",
  "type": "vps",
  "status": "running",
  "os": "Ubuntu 22.04",
  "location": "İstanbul",
  "ip": "10.0.0.15",
  "specs": {
    "cpu": "4 vCPU",
    "ram": "8 GB",
    "disk": "160 GB SSD",
    "network": "1 Gbps"
  },
  "monitoring": {
    "cpuUsage": 42,
    "ramUsage": 58,
    "diskUsage": 63,
    "networkIn": 120,
    "networkOut": 98,
    "uptime": 864000
  }
}
```

### ServerSpecs

Server hardware specifications.

```typescript
interface ServerSpecs {
  cpu: string;               // CPU description (e.g., '4 vCPU', '8 Core Xeon')
  ram: string;               // RAM amount (e.g., '8 GB', '32 GB')
  disk: string;              // Disk capacity (e.g., '160 GB SSD', '2 TB NVMe')
  network: string;           // Network speed (e.g., '1 Gbps')
}
```

### ServerMonitoring

Real-time server monitoring data.

```typescript
interface ServerMonitoring {
  cpuUsage: number;          // CPU usage percentage (0-100)
  ramUsage: number;          // RAM usage percentage (0-100)
  diskUsage: number;         // Disk usage percentage (0-100)
  networkIn: number;         // Network incoming in Mbps
  networkOut: number;        // Network outgoing in Mbps
  uptime: number;            // Uptime in seconds
}
```

---

## Activities

### ActivityItem

User activity log entry.

```typescript
interface ActivityItem {
  id: string;
  userId: string;
  type: string;              // Activity type (e.g., 'ssl', 'backup', 'invoice')
  title: string;             // Human-readable title
  context?: string;          // Optional context/details
  createdAt: string;         // ISO 8601 date string
}
```

**Common Activity Types:**
- `ssl` - SSL certificate related
- `backup` - Backup related
- `invoice` - Invoice/billing related
- `server` - Server management
- `domain` - Domain management

**Example:**
```json
{
  "id": "act-1",
  "userId": "user-123",
  "type": "ssl",
  "title": "SSL sertifikası yenilendi",
  "context": "example.com",
  "createdAt": "2025-10-18T10:30:00Z"
}
```

---

## API Response

### ApiResponse

Generic API response wrapper.

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;          // Optional success/error message
  errors?: string[];         // Optional array of error messages
}
```

**Success Response Example:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "demo@rade.com"
    }
  }
}
```

**Error Response Example:**
```json
{
  "success": false,
  "data": null,
  "message": "Invalid credentials",
  "errors": ["Email or password is incorrect"]
}
```

---

## Authentication

### RefreshTokenRecord

Stored refresh token record.

```typescript
interface RefreshTokenRecord {
  token: string;             // UUID token (should be hashed in production)
  userId: string;
  expiresAt: number;         // Unix timestamp in milliseconds
}
```

**Example:**
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "expiresAt": 1729857600000
}
```

### LoginResultData

Response data after successful login.

```typescript
interface LoginResultData {
  user: Omit<User, 'passwordHash'>;  // User without password hash
  token: string;                      // JWT access token
  refreshToken: string;               // Refresh token UUID
}
```

**Example:**
```json
{
  "user": {
    "id": "user-123",
    "email": "demo@rade.com",
    "firstName": "Demo",
    "lastName": "Kullanıcı",
    "isVerified": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

### RefreshResultData

Response data after token refresh.

```typescript
interface RefreshResultData {
  token: string;             // New JWT access token
  refreshToken: string;      // New refresh token UUID
}
```

**Example:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "660f9500-f39c-52e5-b827-557766551111"
}
```

### TokenPayload

JWT token payload structure.

```typescript
interface TokenPayload {
  userId: string;
  iat: number;               // Issued at (Unix timestamp)
  exp: number;               // Expiration (Unix timestamp)
}
```

---

## Summary

### Total Type Definitions: 17 Interfaces

**User Management (3):**
- User
- LoginResultData
- RefreshTokenRecord

**Hosting (3):**
- HostingPackage
- HostingDetail
- HostingUsage

**Billing & Payments (3):**
- Invoice
- InvoiceItem
- PaymentMethod

**Support (2):**
- SupportTicket
- TicketReply

**Domains & DNS (2):**
- Domain
- DnsRecord

**Servers (3):**
- Server
- ServerSpecs
- ServerMonitoring

**Activities (1):**
- ActivityItem

**API (1):**
- ApiResponse

**Authentication (3):**
- RefreshTokenRecord
- LoginResultData
- RefreshResultData
- TokenPayload

---

## Notes

- All date/time fields use **ISO 8601** format strings (e.g., `2025-10-18T14:30:00Z`)
- All IDs are **UUIDs** or custom string identifiers
- Optional fields are marked with `?` in TypeScript
- All monetary amounts are stored as numbers (consider using cents for precision in production)
- Password hashes use **bcrypt** with salt rounds of 10
- JWT tokens expire after **15 minutes**
- Refresh tokens expire after **7 days**

---

**Generated:** October 18, 2025  
**Version:** 1.0.0  
**Project:** RADE Backend API
