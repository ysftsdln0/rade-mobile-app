# RADE Dev Backend (In-Memory)

Lightweight Express + TypeScript backend used for local development & prototyping of the RADE mobile app. All data is stored in-memory (resets on restart).

## Features Implemented
- Auth: register, login, refresh, logout (demo) using JWT access tokens + UUID refresh tokens
- User profile endpoint
- Hosting packages list (seeded)
- Recent activity list (seeded)

## Endpoints (Base: `http://localhost:3000/api`)
| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Create new user & auto-login |
| POST | /auth/login | Login with email & password |
| POST | /auth/refresh | Get new access token via refresh token |
| POST | /auth/logout | Invalidate (best-effort) provided refresh token |
| GET | /user/profile | Current user profile |
| GET | /hosting/packages | User's hosting packages |
| GET | /activity/recent | 10 most recent activities |
| GET | /health | Health probe |

All authenticated routes require `Authorization: Bearer <accessToken>`.

## Quick Start

```bash
# From repository root
cd backend
npm install
npm run dev
```

Server runs on port 3000 by default. Adjust with `PORT` env var.

## Environment Variables
| Name | Default | Purpose |
|------|---------|---------|
| PORT | 3000 | Server port |
| JWT_SECRET | dev-secret | Access token signing secret |

## Auth Flow
1. Register/Login returns `{ user, token, refreshToken }`.
2. Use `token` for Authorization header.
3. When 401 due to expiry, frontend calls `/auth/refresh` with `refreshToken` to obtain new access token.
4. `/auth/logout` (optional) removes refresh token from memory.

## Data Model (Simplified)
```
User { id, email, passwordHash, firstName, lastName, company?, phone?, isVerified, createdAt, lastLogin? }
HostingPackage { id, userId, name, domain, packageType, status, createdAt }
ActivityItem { id, userId, type, title, context?, createdAt }
RefreshTokenRecord { token, userId, expiresAt }
```

## Notes & Next Steps
- Refresh tokens stored in plain text; hash before prod.
- No rate limiting / brute-force protection.
- Add password reset, 2FA real provider, billing, monitoring integrations later.
- Extend hosting model (usage/limits) when frontend needs real metrics.

## License
Development scaffold only; derive real backend with proper security for production.
