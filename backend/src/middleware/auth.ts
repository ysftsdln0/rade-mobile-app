import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { AppError } from "./errorHandler.js";

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

    console.log("// Auth Middleware:", req.method, req.path);
    console.log("// Authorization header:", header ? "Present" : "Missing");

    if (!header) {
      throw new AppError(401, "Authorization header required");
    }

    if (!header.startsWith("Bearer ")) {
      console.log("!! Invalid format:", header.substring(0, 20));
      throw new AppError(401, "Invalid authorization format");
    }

    const token = header.substring(7);

    if (!token) {
      throw new AppError(401, "Token required");
    }
    console.log("// Token received:", token.substring(0, 20) + "...");

    const payload = jwt.verify(token, config.JWT_SECRET) as any;
    console.log("// Token verified, userId:", payload.sub);

    req.userId = payload.sub;
    next();
  } catch (error) {
    console.log(
      "!! Auth error:",
      error instanceof Error ? error.message : error
    );

    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(401, "Token expired"));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid token"));
    } else {
      next(error);
    }
  }
}
