import { Router, Request, Response } from 'express';
import { authMiddleware } from './auth.js';
import { users, hostingPackages, activities } from './store.js';
import { ApiResponse, User } from './types.js';
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

  router.get('/activity/recent', authMiddleware, (req: Request, res: Response<ApiResponse<any>>) => {
    const userId = (req as any).userId as string;
    const list = activities.filter(a => a.userId === userId).sort((a,b)=> b.createdAt.localeCompare(a.createdAt)).slice(0,10);
    res.json({ success: true, data: list });
  });

  return router;
}
