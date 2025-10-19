import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './auth.js';
import { userRouter } from './user.js';
import { prisma } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

// Admin HTML viewer
app.get('/admin', (_req: Request, res: Response) => {
  const htmlPath = path.join(__dirname, 'admin.html');
  fs.readFile(htmlPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading admin page');
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
  });
});

// Admin endpoint to view all tables
app.get('/api/admin/tables', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    const hostingPackages = await prisma.hostingPackage.findMany();
    const activities = await prisma.activityItem.findMany();
    const refreshTokens = await prisma.refreshToken.findMany();
    const invoices = await prisma.invoice.findMany({ include: { items: true } });
    const paymentMethods = await prisma.paymentMethod.findMany();
    const supportTickets = await prisma.supportTicket.findMany({ include: { replies: true } });
    const domains = await prisma.domain.findMany({ include: { dnsRecords: true } });
    const servers = await prisma.server.findMany();

    const tables = {
      users: users.map(u => ({ ...u, passwordHash: '***HIDDEN***' })),
      hostingPackages,
      activities,
      refreshTokens: refreshTokens.map(rt => ({ ...rt, token: rt.token.substring(0, 20) + '...' })),
      invoices,
      paymentMethods,
      supportTickets,
      domains,
      servers,
    };
    
    const summary = {
      users: users.length,
      hostingPackages: hostingPackages.length,
      activities: activities.length,
      refreshTokens: refreshTokens.length,
      invoices: invoices.length,
      paymentMethods: paymentMethods.length,
      supportTickets: supportTickets.length,
      domains: domains.length,
      servers: servers.length,
    };

    res.json({ summary, tables });
  } catch (error) {
    console.error('Admin tables error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/auth', authRouter());
app.use('/api', userRouter());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
