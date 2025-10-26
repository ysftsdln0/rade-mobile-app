import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { AppError } from './errorHandler.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;
    
    if (!header) {
      throw new AppError(401, 'Authorization header required');
    }

    if (!header.startsWith('Bearer ')) {
      throw new AppError(401, 'Invalid authorization format');
    }

    const token = header.substring(7);
    
    if (!token) {
      throw new AppError(401, 'Token required');
    }

    const payload = jwt.verify(token, config.JWT_SECRET) as any;
    req.userId = payload.sub;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(401, 'Token expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
}
