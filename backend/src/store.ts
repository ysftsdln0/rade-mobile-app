import {
  User,
  HostingPackage,
  HostingDetail,
  HostingUsage,
  ActivityItem,
  RefreshTokenRecord,
  Invoice,
  PaymentMethod,
  SupportTicket,
  TicketReply,
  Domain,
  DnsRecord,
  Server,
} from './types.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// In-memory demo stores
export const users: User[] = [];
export const hostingPackages: HostingPackage[] = [];
export const hostingDetails: Record<string, HostingDetail> = {};
export const hostingUsage: Record<string, HostingUsage> = {};
export const activities: ActivityItem[] = [];
export const refreshTokens: RefreshTokenRecord[] = [];
export const invoices: Invoice[] = [];
export const paymentMethods: PaymentMethod[] = [];
export const supportTickets: SupportTicket[] = [];
export const domains: Domain[] = [];
export const domainDnsRecords: Record<string, DnsRecord[]> = {};
export const servers: Server[] = [];

// Seed demo user & data
export function seed() {
  if (users.length > 0) return;
  const passwordHash = bcrypt.hashSync('demo123', 10);
  const user: User = {
    id: randomUUID(),
    email: 'demo@rade.com',
    passwordHash,
    firstName: 'Demo',
    lastName: 'Kullanıcı',
    company: 'RADE Demo',
    phone: '+90 555 123 45 67',
    isVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  users.push(user);

  // Hosting packages + details + usage
  const now = Date.now();
  const hostingSeed = [
    {
      name: 'Starter Hosting',
      domain: 'example1.com',
      packageType: 'shared' as const,
      status: 'active' as const,
      diskLimit: 50,
      diskUsage: 18,
      bandwidthLimit: 500,
      bandwidthUsage: 120,
      autoRenew: true,
      features: ['SSL Sertifikası', 'Günlük Yedekleme', '1 MySQL Veritabanı'],
    },
    {
      name: 'Pro VPS',
      domain: 'example2.com',
      packageType: 'vps' as const,
      status: 'active' as const,
      diskLimit: 200,
      diskUsage: 95,
      bandwidthLimit: 2000,
      bandwidthUsage: 780,
      autoRenew: true,
      features: ['Kök Erişimi', 'Anlık Snapshot', 'cPanel'],
    },
    {
      name: 'Kurumsal Hosting',
      domain: 'example3.com',
      packageType: 'shared' as const,
      status: 'pending' as const,
      diskLimit: 100,
      diskUsage: 5,
      bandwidthLimit: 1000,
      bandwidthUsage: 40,
      autoRenew: false,
      features: ['Sınırsız E-posta', 'Özel IP', 'Gelişmiş Güvenlik'],
    },
  ];

  hostingSeed.forEach((item, index) => {
    const id = randomUUID();
    const expiryDate = new Date(now + (index + 1) * 30 * 24 * 60 * 60 * 1000).toISOString();
    const pkg: HostingPackage = {
      id,
      userId: user.id,
      name: item.name,
      domain: item.domain,
      packageType: item.packageType,
      status: item.status,
      diskLimit: item.diskLimit,
      diskUsage: item.diskUsage,
      bandwidthLimit: item.bandwidthLimit,
      bandwidthUsage: item.bandwidthUsage,
      expiryDate,
      autoRenew: item.autoRenew,
    };
    hostingPackages.push(pkg);
    hostingDetails[id] = {
      ...pkg,
      createdAt: new Date(now - index * 15 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: `192.168.1.${10 + index}`,
      nameservers: [`ns1.${item.domain}`, `ns2.${item.domain}`],
      features: item.features,
    };
    hostingUsage[id] = {
      disk: { used: item.diskUsage, total: item.diskLimit },
      bandwidth: { used: item.bandwidthUsage, total: item.bandwidthLimit },
      databases: index === 0 ? 1 : 3,
      ftpAccounts: index + 2,
      emailAccounts: 5 * (index + 1),
      backupsEnabled: index !== 2,
    };
  });

  // Activities
  const act = [
    { type: 'ssl', title: 'SSL sertifikası yenilendi', context: 'example1.com' },
    { type: 'backup', title: 'Yedekleme tamamlandı', context: 'VPS-1' },
    { type: 'invoice', title: 'Ödeme hatırlatması', context: 'Fatura #12345' },
  ];
  act.forEach(a => activities.push({
    id: randomUUID(),
    userId: user.id,
    type: a.type,
    title: a.title,
    context: a.context,
    createdAt: new Date(Date.now() - Math.floor(Math.random()* 1000*60*60*24)).toISOString(),
  }));

  // Invoices & payment methods
  for (let i = 1; i <= 4; i++) {
    invoices.push({
      id: `inv-${i}`,
      userId: user.id,
      number: `INV-2025-00${i}`,
      date: new Date(now - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 99 * i,
      currency: 'USD',
      status: (i % 3 === 0 ? 'overdue' : i % 2 === 0 ? 'paid' : 'unpaid'),
      items: [
        {
          id: randomUUID(),
          description: `Hosting Paketi ${i}`,
          quantity: 1,
          unitPrice: 99 * i,
          total: 99 * i,
        },
      ],
    });
  }

  paymentMethods.push(
    {
      id: 'pm-1',
      userId: user.id,
      type: 'credit_card',
      isDefault: true,
      cardType: 'VISA',
      lastFour: '4242',
      expiryDate: '12/28',
    },
    {
      id: 'pm-2',
      userId: user.id,
      type: 'paypal',
      isDefault: false,
    },
  );

  // Support tickets
  const makeReply = (message: string, isFromSupport = false): TicketReply => ({
    id: randomUUID(),
    message,
    isFromSupport,
    createdAt: new Date(now - Math.floor(Math.random() * 3600 * 1000)).toISOString(),
  });

  supportTickets.push(
    {
      id: 'tick-1',
      userId: user.id,
      subject: 'SSL sertifikası yenilenmiyor',
      status: 'open',
      priority: 'urgent',
      department: 'Güvenlik',
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastReply: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      replies: [makeReply('Merhaba, SSL yenilemesinde hata alıyorum'), makeReply('Destek ekibimiz talebinizi inceliyor.', true)],
    },
    {
      id: 'tick-2',
      userId: user.id,
      subject: 'Sunucu performansı hakkında',
      status: 'pending',
      priority: 'medium',
      department: 'Sunucu',
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastReply: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
      replies: [makeReply('CPU kullanımı çok yüksek görünüyor'), makeReply('Monitoringe göre normal değerlerde, tekrar kontrol edebilir misiniz?', true)],
    },
    {
      id: 'tick-3',
      userId: user.id,
      subject: 'Yeni domain transfer süreci',
      status: 'resolved',
      priority: 'low',
      department: 'Domain',
      createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(),
      lastReply: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(),
      replies: [makeReply('Transfer kodunu nereden alabilirim?'), makeReply('Müşteri panelinizde Domain -> Transfer bölümünden ulaşabilirsiniz.', true)],
    },
  );

  // Domains & DNS
  domains.push(
    {
      id: 'dom-1',
      userId: user.id,
      name: 'example1.com',
      status: 'active',
      registrationDate: new Date(now - 200 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(now + 165 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true,
      nameservers: ['ns1.rade.com', 'ns2.rade.com'],
      isPrivacyProtected: true,
    },
    {
      id: 'dom-2',
      userId: user.id,
      name: 'example2.net',
      status: 'pending',
      registrationDate: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(now + 345 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: false,
      nameservers: ['ns1.provider.net', 'ns2.provider.net'],
      isPrivacyProtected: false,
    },
  );

  domains.forEach((domain) => {
    domainDnsRecords[domain.id] = [
      { id: randomUUID(), type: 'A', host: '@', value: '192.168.1.20', ttl: 3600 },
      { id: randomUUID(), type: 'CNAME', host: 'www', value: '@', ttl: 3600 },
      { id: randomUUID(), type: 'MX', host: '@', value: 'mail.rade.com', ttl: 3600, priority: 10 },
    ];
  });

  // Servers
  servers.push(
    {
      id: 'srv-1',
      userId: user.id,
      name: 'VPS-1',
      type: 'vps',
      status: 'running',
      os: 'Ubuntu 22.04',
      location: 'İstanbul',
      ip: '10.0.0.15',
      specs: {
        cpu: '4 vCPU',
        ram: '8 GB',
        disk: '160 GB SSD',
        network: '1 Gbps',
      },
      monitoring: {
        cpuUsage: 42,
        ramUsage: 58,
        diskUsage: 63,
        networkIn: 120,
        networkOut: 98,
        uptime: 864000,
      },
    },
    {
      id: 'srv-2',
      userId: user.id,
      name: 'Dedicated-TR',
      type: 'dedicated',
      status: 'running',
      os: 'AlmaLinux 9',
      location: 'Ankara',
      ip: '10.0.0.25',
      specs: {
        cpu: '8 Core Xeon',
        ram: '32 GB',
        disk: '2 TB NVMe',
        network: '1 Gbps',
      },
      monitoring: {
        cpuUsage: 25,
        ramUsage: 46,
        diskUsage: 38,
        networkIn: 65,
        networkOut: 70,
        uptime: 2890000,
      },
    },
  );
}
