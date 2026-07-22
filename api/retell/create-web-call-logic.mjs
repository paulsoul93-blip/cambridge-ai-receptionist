export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 5;
export const RATE_LIMIT_COOLDOWN_MS = 5 * 1000;

export function parseLanguage(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const keys = Object.keys(body);
  if (keys.length !== 1 || keys[0] !== 'language') return null;
  return body.language === 'en' || body.language === 'pl' ? body.language : null;
}

export function mapProviderStatus(status) {
  if (status === 402) return { status: 402, code: 'BILLING_UNAVAILABLE' };
  if (status === 429) return { status: 429, code: 'RATE_LIMITED' };
  if (status >= 500) return { status: 503, code: 'PROVIDER_UNAVAILABLE' };
  return { status: 502, code: 'PROVIDER_ERROR' };
}

export function isAllowedOrigin(origin, env = {}) {
  if (!origin) return true;

  let url;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }

  if (url.origin === 'https://cambridge-ai-receptionist.vercel.app') return true;

  const configuredHosts = [env.VERCEL_URL, env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter(Boolean)
    .map((value) => String(value).replace(/^https?:\/\//, '').replace(/\/$/, ''));

  if (url.protocol === 'https:' && configuredHosts.includes(url.host)) return true;
  if (
    url.protocol === 'https:' &&
    /^cambridge-ai-receptionist(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(url.hostname)
  ) {
    return true;
  }

  return env.NODE_ENV !== 'production' &&
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
}

export function createRateLimiter({
  windowMs = RATE_LIMIT_WINDOW_MS,
  maxRequests = RATE_LIMIT_MAX_REQUESTS,
  cooldownMs = RATE_LIMIT_COOLDOWN_MS,
  maxEntries = 5_000,
} = {}) {
  const entries = new Map();

  return function check(key, now = Date.now()) {
    if (entries.size > maxEntries) {
      for (const [entryKey, entry] of entries) {
        if (now - entry.windowStart >= windowMs) entries.delete(entryKey);
      }
      if (entries.size > maxEntries) entries.clear();
    }

    const current = entries.get(key);
    if (!current || now - current.windowStart >= windowMs) {
      entries.set(key, { windowStart: now, lastRequest: now, count: 1 });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    const cooldownRemaining = cooldownMs - (now - current.lastRequest);
    if (cooldownRemaining > 0) {
      return { allowed: false, retryAfterSeconds: Math.ceil(cooldownRemaining / 1000) };
    }

    if (current.count >= maxRequests) {
      const windowRemaining = windowMs - (now - current.windowStart);
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(windowRemaining / 1000)) };
    }

    current.count += 1;
    current.lastRequest = now;
    return { allowed: true, retryAfterSeconds: 0 };
  };
}
