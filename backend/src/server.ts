import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './auth.js';
import { userRouter } from './user.js';
import { seed, users, hostingPackages, hostingDetails, hostingUsage, activities, refreshTokens, invoices, paymentMethods, supportTickets, domains, domainDnsRecords, servers } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
seed();

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
app.get('/api/admin/tables', (_req: Request, res: Response) => {
  const tables = {
    users: users.map(u => ({ ...u, passwordHash: '***HIDDEN***' })), // Hide password hashes
    hostingPackages: hostingPackages,
    hostingDetails: hostingDetails,
    hostingUsage: hostingUsage,
    activities: activities,
    refreshTokens: refreshTokens.map(rt => ({ ...rt, token: rt.token.substring(0, 20) + '...' })), // Truncate tokens
    invoices: invoices,
    paymentMethods: paymentMethods,
    supportTickets: supportTickets,
    domains: domains,
    domainDnsRecords: domainDnsRecords,
    servers: servers,
  };
  
  const summary = {
    users: users.length,
    hostingPackages: hostingPackages.length,
    hostingDetails: Object.keys(hostingDetails).length,
    hostingUsage: Object.keys(hostingUsage).length,
    activities: activities.length,
    refreshTokens: refreshTokens.length,
    invoices: invoices.length,
    paymentMethods: paymentMethods.length,
    supportTickets: supportTickets.length,
    domains: domains.length,
    domainDnsRecords: Object.keys(domainDnsRecords).length,
    servers: servers.length,
  };

  res.json({ summary, tables });
});

app.use('/api/auth', authRouter());
app.use('/api', userRouter());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
