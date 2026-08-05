import type { NextFunction, Request, Response } from "express";
import { HttpError } from "./error.middleware.js";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Simple in-memory sliding-window limiter, keyed by IP + route. Good enough for a single API instance in dev/small deployments. */
export function rateLimit(options: { windowMs: number; max: number }) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    const effectiveMax = process.env.NODE_ENV === "development" ? Math.max(options.max, 100) : options.max;
    if (bucket.count >= effectiveMax) {
      return next(new HttpError(429, "Too many requests, please try again later"));
    }

    bucket.count += 1;
    next();
  };
}

