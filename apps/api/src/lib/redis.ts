import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

const redis = new Redis(env.REDIS_URL ?? "redis://localhost:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  retryStrategy: () => null,
});

let warned = false;
redis.on("error", (err: Error) => {
  if (!warned) {
    logger.warn("Redis unavailable, falling back to in-memory cache/rate-limit", err.message);
    warned = true;
  }
});

redis.connect().catch(() => {
  /* handled by the 'error' listener above */
});

export { redis };

export async function cacheGet(key: string): Promise<string | null> {
  try {
    if (redis.status !== "ready") return null;
    return await redis.get(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  try {
    if (redis.status !== "ready") return;
    if (ttlSeconds) await redis.set(key, value, "EX", ttlSeconds);
    else await redis.set(key, value);
  } catch {
    /* best-effort cache */
  }
}
