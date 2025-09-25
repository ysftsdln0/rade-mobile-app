import { Router, Request, Response } from 'express';
import { authMiddleware } from './auth.js';
import { users, hostingPackages, activities } from './store.js';
import { ApiResponse } from './types.js';

export function userRouter(): Router {
  const router = Router();

  router.get('/profile', authMiddleware, (req: Request, res: Response<ApiResponse<any>>) => {
    const userId = (req as any).userId as string;
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ success: false, data: null as any, message: 'User not found' });
    const { passwordHash, ...safe } = user as any;
    res.json({ success: true, data: safe });
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
