import { Router, Request, Response } from 'express';
import { authMiddleware } from './auth.js';
import { prisma } from './db.js';
import { ApiResponse } from './types.js';
import bcrypt from 'bcryptjs';

export function userRouter(): Router {
  const router = Router();

  router.get('/user/profile', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ success: false, data: null as any, message: 'User not found' });
      const { passwordHash, ...safe } = user;
      res.json({ success: true, data: safe });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.put('/user/profile', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const { firstName, lastName, company, phone } = req.body || {};
      const user = await prisma.user.update({ where: { id: userId }, data: { firstName, lastName, company, phone } });
      const { passwordHash, ...safe } = user;
      return res.json({ success: true, data: safe });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.put('/user/change-password', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const { currentPassword, newPassword } = req.body || {};
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ success: false, data: null as any, message: 'Kullanıcı Bulunamadı' });
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) return res.status(401).json({ success: false, data: null as any, message: 'Mevcut şifre hatalı' });
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
      return res.json({ success: true, data: { ok: true } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/hosting/packages', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const list = await prisma.hostingPackage.findMany({ where: { userId } });
      res.json({ success: true, data: list });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/hosting/packages/:id/detail', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const item = await prisma.hostingPackage.findFirst({ where: { id: req.params.id, userId } });
      if (!item) return res.status(404).json({ success: false, data: null, message: 'Hosting bulunamadı' });
      res.json({ success: true, data: item });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/hosting/packages/:id/usage', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const pkg = await prisma.hostingPackage.findFirst({ where: { id: req.params.id, userId } });
      if (!pkg) return res.status(404).json({ success: false, data: null, message: 'Hosting bulunamadı' });
      const usage = { disk: { used: pkg.diskUsed || 0, total: pkg.diskTotal || 0 }, bandwidth: { used: pkg.bandwidthUsed || 0, total: pkg.bandwidthTotal || 0 }, databases: pkg.databases, ftpAccounts: pkg.ftpAccounts, emailAccounts: pkg.emailAccounts, backupsEnabled: pkg.backupsEnabled };
      res.json({ success: true, data: usage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/activity/recent', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const list = await prisma.activityItem.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10 });
      res.json({ success: true, data: list });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/finance/invoices', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const list = await prisma.invoice.findMany({ where: { userId }, include: { items: true }, orderBy: { date: 'desc' } });
      res.json({ success: true, data: list });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/finance/payment-methods', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const list = await prisma.paymentMethod.findMany({ where: { userId } });
      res.json({ success: true, data: list });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/support/tickets', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const list = await prisma.supportTicket.findMany({ where: { userId }, include: { replies: true }, orderBy: { createdAt: 'desc' } });
      res.json({ success: true, data: list });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/support/tickets/:id', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const ticket = await prisma.supportTicket.findFirst({ where: { id: req.params.id, userId }, include: { replies: true } });
      if (!ticket) return res.status(404).json({ success: false, data: null, message: 'Talep bulunamadı' });
      res.json({ success: true, data: ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/domains', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const list = await prisma.domain.findMany({ where: { userId }, orderBy: { name: 'asc' } });
      res.json({ success: true, data: list });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/domains/:id/dns-records', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const domain = await prisma.domain.findFirst({ where: { id: req.params.id, userId }, include: { dnsRecords: true } });
      if (!domain) return res.status(404).json({ success: false, data: null as any, message: 'Domain bulunamadı' });
      res.json({ success: true, data: domain.dnsRecords });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.get('/servers', authMiddleware, async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = (req as any).userId as string;
      const list = await prisma.server.findMany({ where: { userId } });
      res.json({ success: true, data: list });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  return router;
}
