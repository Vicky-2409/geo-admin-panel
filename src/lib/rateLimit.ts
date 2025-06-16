'use server';

import { RateLimitData } from '@/types';

// In-memory store for rate limiting (for production, use Redis)
const rateLimitStore = new Map<string, RateLimitData>();

interface RateLimitInfo {
  allowed: boolean;
  resetTime?: number;
}

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_ATTEMPTS = 100; // Increased to 100 attempts per hour

const attempts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = async (ip: string): Promise<RateLimitInfo> => {
  const now = Date.now();
  const userAttempts = attempts.get(ip);

  if (!userAttempts || now > userAttempts.resetTime) {
    attempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (userAttempts.count >= MAX_ATTEMPTS) {
    return { allowed: false, resetTime: userAttempts.resetTime };
  }

  userAttempts.count++;
  attempts.set(ip, userAttempts);
  return { allowed: true };
};

export const getRemainingAttempts = async (ip: string): Promise<number> => {
  const userAttempts = attempts.get(ip);
  if (!userAttempts) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - userAttempts.count);
};

export const resetRateLimit = async (ip: string): Promise<void> => {
  attempts.delete(ip);
};

// Cleanup expired entries (run this periodically)
export const cleanupExpiredEntries = async (): Promise<void> => {
  const now = Date.now();

  for (const [ip, data] of attempts.entries()) {
    if (now > data.resetTime) {
      attempts.delete(ip);
    }
  }
};

// Run cleanup every 30 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    cleanupExpiredEntries().catch(console.error);
  }, 30 * 60 * 1000);
}