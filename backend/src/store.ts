import { User, HostingPackage, ActivityItem, RefreshTokenRecord } from './types.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// In-memory demo stores
export const users: User[] = [];
export const hostingPackages: HostingPackage[] = [];
export const activities: ActivityItem[] = [];
export const refreshTokens: RefreshTokenRecord[] = [];

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

  // Hosting packages
  for (let i = 1; i <= 3; i++) {
    hostingPackages.push({
      id: randomUUID(),
      userId: user.id,
      name: `Hosting Paket ${i}`,
      domain: `example${i}.com`,
      packageType: i === 1 ? 'shared' : 'vps',
      status: 'active',
      createdAt: new Date().toISOString(),
    });
  }

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
}
