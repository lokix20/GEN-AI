import type { NextFunction, Request, Response } from "express";
import type { Role } from "@haritha/shared-types";
import { verifyAccessToken } from "../lib/jwt.js";
import { HttpError } from "./error.middleware.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: { userId: string; role: Role };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing or invalid Authorization header"));
  }

  try {
    const payload = verifyAccessToken(header.slice("Bearer ".length));
    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired access token"));
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(new HttpError(401, "Not authenticated"));
    if (!roles.includes(req.auth.role)) return next(new HttpError(403, "Insufficient permissions"));
    next();
  };
}
