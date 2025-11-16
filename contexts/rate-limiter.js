// Lightweight client-side rate limiter utility
// Not a React Context; simple module state is sufficient here

const DEFAULT_MIN_INTERVAL_MS = Number(
  process.env.NEXT_PUBLIC_REVIEW_MIN_INTERVAL_MS || 20000
);

const lastInvocationAtByKey = new Map();

export const rateLimiter = {
  ensureInterval(key) {
    const now = Date.now();
    const last = lastInvocationAtByKey.get(key) || 0;
    const elapsed = now - last;
    const remaining = DEFAULT_MIN_INTERVAL_MS - elapsed;
    if (remaining > 0) {
      const error = new Error("Too many requests. Please wait before retrying.");
      error.code = "RATE_LIMITED_CLIENT";
      error.retryAfterMs = remaining;
      throw error;
    }
    lastInvocationAtByKey.set(key, now);
  },
  reset(key) {
    lastInvocationAtByKey.delete(key);
  },
};


