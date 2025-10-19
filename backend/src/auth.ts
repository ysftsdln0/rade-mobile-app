import { Request, Response, NextFunction, Router } from 'express';
import { prisma } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { ApiResponse, LoginResultData } from './types.js';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function signAccessToken(user: { id: string; email: string }) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
}

async function signRefreshToken(userId: string) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });
  return token;
}

function toPublicUser(user: any) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export function authRouter(): Router {
  const router = Router();

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().optional(),
    phone: z.string().optional(),
  });

  router.post('/register', async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          success: false, 
          data: null as any, 
          message: 'Validation error', 
          errors: parsed.error.errors.map(e => e.message) 
        });
      }
      
      const { email, password, firstName, lastName, company, phone } = parsed.data;
      const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      
      if (existing) {
        return res.status(409).json({ success: false, data: null as any, message: 'Email already registered' });
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          firstName,
          lastName,
          company,
          phone,
          isVerified: true,
        },
      });
      
      const token = signAccessToken(user);
      const refreshToken = await signRefreshToken(user.id);
      
      res.status(201).json({ 
        success: true, 
        data: {
          user: toPublicUser(user),
          token,
          refreshToken,
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  const loginSchema = z.object({ 
    email: z.string().email(), 
    password: z.string().min(1) 
  });
  
  router.post('/login', async (req: Request, res: Response<ApiResponse<LoginResultData>>) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          success: false, 
          data: null as any, 
          message: 'Validation error', 
          errors: parsed.error.errors.map(e => e.message) 
        });
      }
      
      const { email, password } = parsed.data;
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      
      if (!user) {
        return res.status(401).json({ success: false, data: null as any, message: 'Invalid credentials' });
      }
      
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ success: false, data: null as any, message: 'Invalid credentials' });
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
      
      const token = signAccessToken(user);
      const refreshToken = await signRefreshToken(user.id);
      
      res.json({ 
        success: true, 
        data: { 
          user: toPublicUser(user), 
          token, 
          refreshToken 
        } 
      });
    } catch (error) {
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  router.post('/logout', async (req: Request, res: Response<ApiResponse<null>>) => {
    try {
      const { refreshToken } = req.body || {};
      if (refreshToken) {
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
      }
      res.json({ success: true, data: null, message: 'Logged out' });
    } catch (error) {
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.post('/refresh', async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const { refreshToken } = req.body || {};
      if (!refreshToken) {
        return res.status(400).json({ success: false, data: null as any, message: 'Missing refresh token' });
      }
      
      const record = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      if (!record) {
        return res.status(401).json({ success: false, data: null as any, message: 'Invalid refresh token' });
      }
      
      if (record.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { id: record.id } });
        return res.status(401).json({ success: false, data: null as any, message: 'Expired refresh token' });
      }
      
      const user = await prisma.user.findUnique({ where: { id: record.userId } });
      if (!user) {
        await prisma.refreshToken.delete({ where: { id: record.id } });
        return res.status(401).json({ success: false, data: null as any, message: 'User not found' });
      }
      
      await prisma.refreshToken.delete({ where: { id: record.id } });
      const newRefreshToken = await signRefreshToken(user.id);
      const token = signAccessToken(user);
      
      res.json({ success: true, data: { token, refreshToken: newRefreshToken } });
    } catch (error) {
      res.status(500).json({ success: false, data: null as any, message: 'Internal server error' });
    }
  });

  return router;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ success: false, data: null, message: 'No auth header' });
  }
  
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ success: false, data: null, message: 'Invalid token' });
  }
}
