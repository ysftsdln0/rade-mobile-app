import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.ticketReply.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.dnsRecord.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.server.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.activityItem.deleteMany();
  await prisma.hostingPackage.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@rade.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Kullanıcı',
      company: 'RADE Demo',
      phone: '+90 555 123 45 67',
      isVerified: true,
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create hosting packages
  const now = new Date();
  const hostingPackages = [
    {
      name: 'Starter Hosting',
      domain: 'example1.com',
      packageType: 'shared',
      status: 'active',
      diskLimit: 50,
      diskUsage: 18,
      bandwidthLimit: 500,
      bandwidthUsage: 120,
      expiryDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      ipAddress: '192.168.1.10',
      nameservers: ['ns1.example1.com', 'ns2.example1.com'],
      features: ['SSL Sertifikası', 'Günlük Yedekleme', '1 MySQL Veritabanı'],
      diskUsed: 18,
      diskTotal: 50,
      bandwidthUsed: 120,
      bandwidthTotal: 500,
      databases: 1,
      ftpAccounts: 2,
      emailAccounts: 5,
      backupsEnabled: true,
    },
    {
      name: 'Pro VPS',
      domain: 'example2.com',
      packageType: 'vps',
      status: 'active',
      diskLimit: 200,
      diskUsage: 95,
      bandwidthLimit: 2000,
      bandwidthUsage: 780,
      expiryDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      ipAddress: '192.168.1.11',
      nameservers: ['ns1.example2.com', 'ns2.example2.com'],
      features: ['Kök Erişimi', 'Anlık Snapshot', 'cPanel'],
      diskUsed: 95,
      diskTotal: 200,
      bandwidthUsed: 780,
      bandwidthTotal: 2000,
      databases: 3,
      ftpAccounts: 3,
      emailAccounts: 10,
      backupsEnabled: true,
    },
    {
      name: 'Kurumsal Hosting',
      domain: 'example3.com',
      packageType: 'shared',
      status: 'pending',
      diskLimit: 100,
      diskUsage: 5,
      bandwidthLimit: 1000,
      bandwidthUsage: 40,
      expiryDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      autoRenew: false,
      ipAddress: '192.168.1.12',
      nameservers: ['ns1.example3.com', 'ns2.example3.com'],
      features: ['Sınırsız E-posta', 'Özel IP', 'Gelişmiş Güvenlik'],
      diskUsed: 5,
      diskTotal: 100,
      bandwidthUsed: 40,
      bandwidthTotal: 1000,
      databases: 3,
      ftpAccounts: 4,
      emailAccounts: 15,
      backupsEnabled: false,
    },
  ];

  for (const pkg of hostingPackages) {
    await prisma.hostingPackage.create({
      data: {
        ...pkg,
        userId: user.id,
      },
    });
  }

  console.log(`✅ Created ${hostingPackages.length} hosting packages`);

  // Create activities
  const activities = [
    { type: 'ssl', title: 'SSL sertifikası yenilendi', context: 'example1.com' },
    { type: 'backup', title: 'Yedekleme tamamlandı', context: 'VPS-1' },
    { type: 'invoice', title: 'Ödeme hatırlatması', context: 'Fatura #12345' },
  ];

  for (const activity of activities) {
    await prisma.activityItem.create({
      data: {
        ...activity,
        userId: user.id,
      },
    });
  }

  console.log(`✅ Created ${activities.length} activities`);

  // Create invoices
  for (let i = 1; i <= 4; i++) {
    const status = i % 3 === 0 ? 'overdue' : i % 2 === 0 ? 'paid' : 'unpaid';
    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        number: `INV-2025-00${i}`,
        date: new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + i * 7 * 24 * 60 * 60 * 1000),
        amount: 99 * i,
        currency: 'USD',
        status,
        items: {
          create: [
            {
              description: `Hosting Paketi ${i}`,
              quantity: 1,
              unitPrice: 99 * i,
              total: 99 * i,
            },
          ],
        },
      },
    });
  }

  console.log('✅ Created 4 invoices');

  // Create payment methods
  await prisma.paymentMethod.createMany({
    data: [
      {
        userId: user.id,
        type: 'credit_card',
        isDefault: true,
        cardType: 'VISA',
        lastFour: '4242',
        expiryDate: '12/28',
      },
      {
        userId: user.id,
        type: 'paypal',
        isDefault: false,
      },
    ],
  });

  console.log('✅ Created 2 payment methods');

  // Create support tickets
  const tickets = [
    {
      subject: 'SSL sertifikası yenilenmiyor',
      status: 'open',
      priority: 'urgent',
      department: 'Güvenlik',
      replies: [
        { message: 'Merhaba, SSL yenilemesinde hata alıyorum', isFromSupport: false },
        { message: 'Destek ekibimiz talebinizi inceliyor.', isFromSupport: true },
      ],
    },
    {
      subject: 'Sunucu performansı hakkında',
      status: 'pending',
      priority: 'medium',
      department: 'Sunucu',
      replies: [
        { message: 'CPU kullanımı çok yüksek görünüyor', isFromSupport: false },
        { message: 'Monitoringe göre normal değerlerde, tekrar kontrol edebilir misiniz?', isFromSupport: true },
      ],
    },
    {
      subject: 'Yeni domain transfer süreci',
      status: 'resolved',
      priority: 'low',
      department: 'Domain',
      replies: [
        { message: 'Transfer kodunu nereden alabilirim?', isFromSupport: false },
        { message: 'Müşteri panelinizde Domain -> Transfer bölümünden ulaşabilirsiniz.', isFromSupport: true },
      ],
    },
  ];

  for (const ticket of tickets) {
    const { replies, ...ticketData } = ticket;
    await prisma.supportTicket.create({
      data: {
        ...ticketData,
        userId: user.id,
        lastReply: now,
        replies: {
          create: replies,
        },
      },
    });
  }

  console.log(`✅ Created ${tickets.length} support tickets`);

  // Create domains
  const domains = [
    {
      name: 'example1.com',
      status: 'active',
      registrationDate: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(now.getTime() + 165 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      nameservers: ['ns1.rade.com', 'ns2.rade.com'],
      isPrivacyProtected: true,
    },
    {
      name: 'example2.net',
      status: 'pending',
      registrationDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(now.getTime() + 345 * 24 * 60 * 60 * 1000),
      autoRenew: false,
      nameservers: ['ns1.provider.net', 'ns2.provider.net'],
      isPrivacyProtected: false,
    },
  ];

  for (const domain of domains) {
    await prisma.domain.create({
      data: {
        ...domain,
        userId: user.id,
        dnsRecords: {
          create: [
            { type: 'A', host: '@', value: '192.168.1.20', ttl: 3600 },
            { type: 'CNAME', host: 'www', value: '@', ttl: 3600 },
            { type: 'MX', host: '@', value: 'mail.rade.com', ttl: 3600, priority: 10 },
          ],
        },
      },
    });
  }

  console.log(`✅ Created ${domains.length} domains with DNS records`);

  // Create servers
  const servers = [
    {
      name: 'VPS-1',
      type: 'vps',
      status: 'running',
      os: 'Ubuntu 22.04',
      location: 'İstanbul',
      ip: '10.0.0.15',
      cpu: '4 vCPU',
      ram: '8 GB',
      disk: '160 GB SSD',
      network: '1 Gbps',
      cpuUsage: 42,
      ramUsage: 58,
      diskUsage: 63,
      networkIn: 120,
      networkOut: 98,
      uptime: 864000,
    },
    {
      name: 'Dedicated-TR',
      type: 'dedicated',
      status: 'running',
      os: 'AlmaLinux 9',
      location: 'Ankara',
      ip: '10.0.0.25',
      cpu: '8 Core Xeon',
      ram: '32 GB',
      disk: '2 TB NVMe',
      network: '1 Gbps',
      cpuUsage: 25,
      ramUsage: 46,
      diskUsage: 38,
      networkIn: 65,
      networkOut: 70,
      uptime: 2890000,
    },
  ];

  for (const server of servers) {
    await prisma.server.create({
      data: {
        ...server,
        userId: user.id,
      },
    });
  }

  console.log(`✅ Created ${servers.length} servers`);

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`   Users: 1`);
  console.log(`   Hosting Packages: ${hostingPackages.length}`);
  console.log(`   Activities: ${activities.length}`);
  console.log(`   Invoices: 4`);
  console.log(`   Payment Methods: 2`);
  console.log(`   Support Tickets: ${tickets.length}`);
  console.log(`   Domains: ${domains.length}`);
  console.log(`   Servers: ${servers.length}`);
  console.log('');
  console.log('🔐 Demo Login:');
  console.log('   Email: demo@rade.com');
  console.log('   Password: demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
