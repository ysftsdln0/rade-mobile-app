import { Router, Response } from 'express';
import { prisma } from './db.js';
import { ApiResponse } from './types.js';
import bcrypt from 'bcryptjs';
import { authMiddleware, AuthRequest } from './middleware/auth.js';
import { AppError, asyncHandler } from './middleware/errorHandler.js';
import { validate, validateParams } from './validators/validate.js';
import { updateProfileSchema, changePasswordSchema, uuidSchema } from './validators/schemas.js';
import { z } from 'zod';
import { config } from './config.js';

function toPublicUser(user: any) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export function userRouter(): Router {
  const router = Router();

  // Get user profile
  router.get(
    '/user/profile',
    authMiddleware,
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      
      const user = await prisma.user.findUnique({ 
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          phone: true,
          isVerified: true,
          createdAt: true,
          lastLogin: true,
        },
      });
      
      if (!user) {
        throw new AppError(404, 'User not found');
      }
      
      res.json({ success: true, data: user });
    })
  );

  // Update user profile
  router.put(
    '/user/profile',
    authMiddleware,
    validate(updateProfileSchema),
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      const { firstName, lastName, company, phone } = req.body;
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName, company, phone },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          phone: true,
          isVerified: true,
          createdAt: true,
          lastLogin: true,
        },
      });
      
      res.json({ success: true, data: user });
    })
  );

  // Change password
  router.put(
    '/user/change-password',
    authMiddleware,
    validate(changePasswordSchema),
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      const { currentPassword, newPassword } = req.body;
      
      const user = await prisma.user.findUnique({ 
        where: { id: userId } 
      });
      
      if (!user) {
        throw new AppError(404, 'User not found');
      }
      
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        throw new AppError(401, 'Current password is incorrect');
      }
      
      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, config.BCRYPT_ROUNDS);
      
      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      });
      
      // Invalidate all refresh tokens for security
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
      
      res.json({ 
        success: true, 
        data: { message: 'Password changed successfully' } 
      });
    })
  );

  // Get hosting packages
  router.get(
    '/hosting/packages',
    authMiddleware,
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      
      const packages = await prisma.hostingPackage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      
      res.json({ success: true, data: packages });
    })
  );

  // Get hosting package detail
  router.get(
    '/hosting/packages/:id/detail',
    authMiddleware,
    validateParams(z.object({ id: uuidSchema })),
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      const { id } = req.params;
      
      const pkg = await prisma.hostingPackage.findFirst({
        where: { id, userId },
      });
      
      if (!pkg) {
        throw new AppError(404, 'Hosting package not found');
      }
      
      res.json({ success: true, data: pkg });
    })
  );

  // Get hosting package usage
  router.get(
    '/hosting/packages/:id/usage',
    authMiddleware,
    validateParams(z.object({ id: uuidSchema })),
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      const { id } = req.params;
      
      const pkg = await prisma.hostingPackage.findFirst({
        where: { id, userId },
      });
      
      if (!pkg) {
        throw new AppError(404, 'Hosting package not found');
      }
      
      const usage = {
        disk: { used: pkg.diskUsed || 0, total: pkg.diskTotal || 0 },
        bandwidth: { used: pkg.bandwidthUsed || 0, total: pkg.bandwidthTotal || 0 },
        databases: pkg.databases,
        ftpAccounts: pkg.ftpAccounts,
        emailAccounts: pkg.emailAccounts,
        backupsEnabled: pkg.backupsEnabled,
      };
      
      res.json({ success: true, data: usage });
    })
  );

  // Get recent activity
  router.get(
    '/activity/recent',
    authMiddleware,
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      
      const activities = await prisma.activityItem.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      
      res.json({ success: true, data: activities });
    })
  );

  // Get invoices
  router.get(
    '/finance/invoices',
    authMiddleware,
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      
      const invoices = await prisma.invoice.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { date: 'desc' },
      });
      
      res.json({ success: true, data: invoices });
    })
  );

  // Get payment methods
  router.get(
    '/finance/payment-methods',
    authMiddleware,
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      
      const methods = await prisma.paymentMethod.findMany({
        where: { userId },
      });
      
      res.json({ success: true, data: methods });
    })
  );

  // Get support tickets
  router.get(
    '/support/tickets',
    authMiddleware,
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      
      const tickets = await prisma.supportTicket.findMany({
        where: { userId },
        include: { replies: true },
        orderBy: { createdAt: 'desc' },
      });
      
      res.json({ success: true, data: tickets });
    })
  );

  // Get support ticket detail
  router.get(
    '/support/tickets/:id',
    authMiddleware,
    validateParams(z.object({ id: uuidSchema })),
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      const { id } = req.params;
      
      const ticket = await prisma.supportTicket.findFirst({
        where: { id, userId },
        include: { replies: true },
      });
      
      if (!ticket) {
        throw new AppError(404, 'Support ticket not found');
      }
      
      res.json({ success: true, data: ticket });
    })
  );

  // Get domains
  router.get(
    '/domains',
    authMiddleware,
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      
      const domains = await prisma.domain.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      });
      
      res.json({ success: true, data: domains });
    })
  );

  // Get DNS records
  router.get(
    '/domains/:id/dns-records',
    authMiddleware,
    validateParams(z.object({ id: uuidSchema })),
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      const { id } = req.params;
      
      const domain = await prisma.domain.findFirst({
        where: { id, userId },
        include: { dnsRecords: true },
      });
      
      if (!domain) {
        throw new AppError(404, 'Domain not found');
      }
      
      res.json({ success: true, data: domain.dnsRecords });
    })
  );

  // Get servers
  router.get(
    '/servers',
    authMiddleware,
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const userId = req.userId!;
      
      const servers = await prisma.server.findMany({
        where: { userId },
      });
      
      res.json({ success: true, data: servers });
    })
  );

  return router;
}
