import { Response, Router } from "express";
import { prisma } from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { ApiResponse, LoginResultData } from "./types.js";
import { config } from "./config.js";
import { AppError, asyncHandler } from "./middleware/errorHandler.js";
import { validate } from "./validators/validate.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "./validators/schemas.js";
import { AuthRequest } from "./middleware/auth.js";

function signAccessToken(user: { id: string; email: string }) {
  return jwt.sign({ sub: user.id, email: user.email }, config.JWT_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

async function signRefreshToken(userId: string) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + ms(config.JWT_REFRESH_EXPIRES_IN));

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  return token;
}

// Helper function to convert time strings to milliseconds
function ms(timeStr: string): number {
  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const match = timeStr.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error("Invalid time format");

  const [, value, unit] = match;
  return parseInt(value) * units[unit];
}

function toPublicUser(user: any) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export function authRouter(): Router {
  const router = Router();

  // Register endpoint
  router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const { email, password, firstName, lastName, company, phone } = req.body;

      // Check if user exists
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        throw new AppError(409, "Email already registered");
      }

      // Hash password with configured rounds
      const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          company,
          phone,
          isVerified: true,
        },
      });

      // Generate tokens
      const token = signAccessToken(user);
      const refreshToken = await signRefreshToken(user.id);

      res.status(201).json({
        success: true,
        data: {
          user: toPublicUser(user),
          token,
          refreshToken,
        },
      });
    })
  );

  // Login endpoint
  router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(
      async (req: AuthRequest, res: Response<ApiResponse<LoginResultData>>) => {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new AppError(401, "Invalid credentials");
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          throw new AppError(401, "Invalid credentials");
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        // Generate tokens
        const token = signAccessToken(user);
        const refreshToken = await signRefreshToken(user.id);

        res.json({
          success: true,
          data: {
            user: toPublicUser(user),
            token,
            refreshToken,
          },
        });
      }
    )
  );

  // Logout endpoint
  router.post(
    "/logout",
    validate(logoutSchema),
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<null>>) => {
      const { refreshToken } = req.body;

      // Delete refresh token if provided
      if (refreshToken) {
        await prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }

      res.json({
        success: true,
        data: null,
        message: "Logged out successfully",
      });
    })
  );

  // Refresh token endpoint
  router.post(
    "/refresh",
    validate(refreshTokenSchema),
    asyncHandler(async (req: AuthRequest, res: Response<ApiResponse<any>>) => {
      const { refreshToken } = req.body;

      // Find refresh token
      const record = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!record) {
        throw new AppError(401, "Invalid refresh token");
      }

      // Check if expired
      if (record.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { id: record.id } });
        throw new AppError(401, "Refresh token expired");
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: record.userId },
      });

      if (!user) {
        await prisma.refreshToken.delete({ where: { id: record.id } });
        throw new AppError(401, "User not found");
      }

      // Rotate refresh token
      await prisma.refreshToken.delete({ where: { id: record.id } });
      const newRefreshToken = await signRefreshToken(user.id);
      const token = signAccessToken(user);

      res.json({
        success: true,
        data: {
          token,
          refreshToken: newRefreshToken,
        },
      });
    })
  );

  return router;
}
