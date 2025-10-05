import { Router, Request, Response } from 'express';
import { authMiddleware } from './auth.js';
import {
  users,
  hostingPackages,
  hostingDetails,
  hostingUsage,
  activities,
  invoices,
  paymentMethods,
  supportTickets,
  domains,
  domainDnsRecords,
  servers,
} from './store.js';
import {
  ApiResponse,
  HostingDetail,
  HostingUsage,
  Invoice,
  PaymentMethod,
  SupportTicket,
  Domain,
  DnsRecord,
  Server,
} from './types.js';
import bcrypt from 'bcryptjs';

export function userRouter(): Router {
  const router = Router();

  // Match frontend: /api/user/profile
  router.get('/user/profile', authMiddleware, (req: Request, res: Response<ApiResponse<any>>) => {
    const userId = (req as any).userId as string;
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ success: false, data: null as any, message: 'User not found' });
    const { passwordHash, ...safe } = user as any;
    res.json({ success: true, data: safe });
  });

  // Update profile (firstName, lastName, company, phone)
  router.put('/user/profile', authMiddleware, (req: Request, res: Response<ApiResponse<any>>) => {
    const userId = (req as any).userId as string;
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ success: false, data: null as any, message: 'User not found' });
    const { firstName, lastName, company, phone } = req.body || {};
    if (typeof firstName === 'string') user.firstName = firstName.trim();
    if (typeof lastName === 'string') user.lastName = lastName.trim();
    if (typeof company === 'string' || company === undefined) user.company = company;
    if (typeof phone === 'string' || phone === undefined) user.phone = phone;
    const { passwordHash, ...safe } = user as any;
    return res.json({ success: true, data: safe });
  });

  // Change password
  router.put('/user/change-password', authMiddleware, (req: Request, res: Response<ApiResponse<any>>) => {
    const userId = (req as any).userId as string;
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ success: false, data: null as any, message: 'Kullanıcı Bulunamadı' });
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, data: null as any, message: 'Eksik alanlar' });
    }
    if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
      return res.status(401).json({ success: false, data: null as any, message: 'Mevcut şifre hatalı' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ success: false, data: null as any, message: 'Yeni şifre çok kısa' });
    }
    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    return res.json({ success: true, data: { ok: true } });
  });

  router.get('/hosting/packages', authMiddleware, (req: Request, res: Response<ApiResponse<any>>) => {
    const userId = (req as any).userId as string;
    const list = hostingPackages.filter(h => h.userId === userId);
    res.json({ success: true, data: list });
  });

  router.get('/hosting/packages/:id/detail', authMiddleware, (req: Request, res: Response<ApiResponse<HostingDetail | null>>) => {
    const userId = (req as any).userId as string;
    const id = req.params.id;
    const item = hostingDetails[id];
    if (!item || item.userId !== userId) {
      return res.status(404).json({ success: false, data: null, message: 'Hosting bulunamadı' });
    }
    res.json({ success: true, data: item });
  });

  router.get('/hosting/packages/:id/usage', authMiddleware, (req: Request, res: Response<ApiResponse<HostingUsage | null>>) => {
    const userId = (req as any).userId as string;
    const id = req.params.id;
    const pkg = hostingPackages.find(p => p.id === id && p.userId === userId);
    if (!pkg) {
      return res.status(404).json({ success: false, data: null, message: 'Hosting bulunamadı' });
    }
    const usage = hostingUsage[id];
    res.json({ success: true, data: usage ?? null });
  });

  router.get('/activity/recent', authMiddleware, (req: Request, res: Response<ApiResponse<any>>) => {
    const userId = (req as any).userId as string;
    const list = activities.filter(a => a.userId === userId).sort((a,b)=> b.createdAt.localeCompare(a.createdAt)).slice(0,10);
    res.json({ success: true, data: list });
  });

  router.get('/finance/invoices', authMiddleware, (req: Request, res: Response<ApiResponse<Invoice[]>>) => {
    const userId = (req as any).userId as string;
    const list = invoices.filter(inv => inv.userId === userId).sort((a, b) => b.date.localeCompare(a.date));
    res.json({ success: true, data: list });
  });

  router.get('/finance/payment-methods', authMiddleware, (req: Request, res: Response<ApiResponse<PaymentMethod[]>>) => {
    const userId = (req as any).userId as string;
    const list = paymentMethods.filter(pm => pm.userId === userId);
    res.json({ success: true, data: list });
  });

  router.get('/support/tickets', authMiddleware, (req: Request, res: Response<ApiResponse<SupportTicket[]>>) => {
    const userId = (req as any).userId as string;
    const list = supportTickets.filter(ticket => ticket.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ success: true, data: list });
  });

  router.get('/support/tickets/:id', authMiddleware, (req: Request, res: Response<ApiResponse<SupportTicket | null>>) => {
    const userId = (req as any).userId as string;
    const ticket = supportTickets.find(t => t.id === req.params.id && t.userId === userId);
    if (!ticket) {
      return res.status(404).json({ success: false, data: null, message: 'Talep bulunamadı' });
    }
    res.json({ success: true, data: ticket });
  });

  router.get('/domains', authMiddleware, (req: Request, res: Response<ApiResponse<Domain[]>>) => {
    const userId = (req as any).userId as string;
    const list = domains.filter(domain => domain.userId === userId).sort((a, b) => a.name.localeCompare(b.name));
    res.json({ success: true, data: list });
  });

  router.get('/domains/:id/dns-records', authMiddleware, (req: Request, res: Response<ApiResponse<DnsRecord[]>>) => {
    const userId = (req as any).userId as string;
    const domain = domains.find(d => d.id === req.params.id && d.userId === userId);
    if (!domain) {
      return res.status(404).json({ success: false, data: null as any, message: 'Domain bulunamadı' });
    }
    res.json({ success: true, data: domainDnsRecords[domain.id] ?? [] });
  });

  router.get('/servers', authMiddleware, (req: Request, res: Response<ApiResponse<Server[]>>) => {
    const userId = (req as any).userId as string;
    const list = servers.filter(server => server.userId === userId);
    res.json({ success: true, data: list });
  });

  return router;
}
