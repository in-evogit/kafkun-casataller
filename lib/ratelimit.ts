import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function makeRedis() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  )
    return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

function makeLimiter(requests: number, window: string) {
  const redis = makeRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as `${number} ${"s" | "m" | "h" | "d"}`),
    analytics: false,
  });
}

export const checkoutLimiter = makeLimiter(10, "1 h");
export const webhookLimiter = makeLimiter(100, "1 m");
export const contactLimiter = makeLimiter(5, "1 h");

export async function rateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ allowed: boolean }> {
  if (!limiter) return { allowed: true }; // sin Upstash → siempre permite (dev)
  const result = await limiter.limit(identifier);
  return { allowed: result.success };
}
