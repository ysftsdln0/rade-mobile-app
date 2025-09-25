import { Request, Response, NextFunction, Router } from 'express';
import { users, refreshTokens } from './store.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { ApiResponse, LoginResultData, User } from './types.js';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function signAccessToken(user: User) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
}

function signRefreshToken(user: User) {
  const token = randomUUID();
  refreshTokens.push({ token, userId: user.id, expiresAt: Date.now() + REFRESH_TTL_MS });
  return token;
}

function toPublicUser(user: User): Omit<User, 'passwordHash'> {
  // Destructure to remove passwordHash cleanly instead of spreading & overwriting
  // Ensures we satisfy Omit<User,'passwordHash'> without TS complaints
  const { passwordHash: _ph, ...rest } = user;
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

  router.post('/register', (req: Request, res: Response<ApiResponse<any>>) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, data: null as any, message: 'Validation error', errors: parsed.error.errors.map(e=>e.message) });
    }
    const { email, password, firstName, lastName, company, phone } = parsed.data;
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ success: false, data: null as any, message: 'Email already registered' });
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    const user: User = {
      id: randomUUID(),
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      company,
      phone,
      isVerified: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    users.push(user);
    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const data: LoginResultData = {
      user: toPublicUser(user),
      token,
      refreshToken,
    };
    res.status(201).json({ success: true, data });
  });

  const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
  router.post('/login', (req: Request, res: Response<ApiResponse<LoginResultData>>) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, data: null as any, message: 'Validation error', errors: parsed.error.errors.map(e=>e.message) });
    const { email, password } = parsed.data;
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) return res.status(401).json({ success: false, data: null as any, message: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.passwordHash)) return res.status(401).json({ success: false, data: null as any, message: 'Invalid credentials' });
    user.lastLogin = new Date().toISOString();
    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const data: LoginResultData = { user: toPublicUser(user), token, refreshToken };
    res.json({ success: true, data });
  });

  // Optional logout endpoint so frontend's apiService.logout() does not 404
  // Accepts an optional refreshToken to invalidate (best-effort for demo)
  router.post('/logout', (req: Request, res: Response<ApiResponse<null>>) => {
    const { refreshToken } = (req.body || {}) as { refreshToken?: string };
    if (refreshToken) {
      const idx = refreshTokens.findIndex(r => r.token === refreshToken);
      if (idx !== -1) refreshTokens.splice(idx, 1);
    }
    return res.json({ success: true, data: null, message: 'Logged out' });
  });

  router.post('/refresh', (req: Request, res: Response<ApiResponse<any>>) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ success: false, data: null as any, message: 'Missing refresh token' });
    const record = refreshTokens.find(r => r.token === refreshToken);
    if (!record) return res.status(401).json({ success: false, data: null as any, message: 'Invalid refresh token' });
    if (record.expiresAt < Date.now()) return res.status(401).json({ success: false, data: null as any, message: 'Expired refresh token' });
    const user = users.find(u => u.id === record.userId);
    if (!user) return res.status(401).json({ success: false, data: null as any, message: 'User not found' });
    const token = signAccessToken(user);
    res.json({ success: true, data: { token } });
  });

  return router;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, data: null, message: 'No auth header' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ success: false, data: null, message: 'Invalid token' });
  }
}
