import { createRateLimiter, isAllowedOrigin, mapProviderStatus, parseLanguage } from './create-web-call-logic.mjs';

type RequestLike = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } };
type ResponseLike = { status(code: number): ResponseLike; json(body: unknown): void; setHeader(name: string, value: string): void };

const checkRateLimit = createRateLimiter();

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function requestKey(req: RequestLike) {
  return first(req.headers['x-forwarded-for'])?.split(',')[0]?.trim() || first(req.headers['x-real-ip']) || req.socket?.remoteAddress || 'unknown';
}

function safeLog(event: string, detail = '') {
  console.info('[retell-web-call]', event, detail);
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  if (!isAllowedOrigin(first(req.headers.origin), process.env)) {
    safeLog('rejected_origin');
    return res.status(403).json({ error: 'ORIGIN_NOT_ALLOWED' });
  }

  const limit = checkRateLimit(requestKey(req));
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSeconds));
    safeLog('local_rate_limit');
    return res.status(429).json({ error: 'RATE_LIMITED' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'INVALID_REQUEST' }); }
  }
  const language = parseLanguage(body);
  if (!language) return res.status(400).json({ error: 'INVALID_REQUEST' });

  const apiKey = process.env.RETELL_API_KEY;
  const agentId = language === 'en' ? process.env.RETELL_AGENT_ID_EN : process.env.RETELL_AGENT_ID_PL;
  if (!apiKey || !agentId) {
    safeLog('missing_server_configuration', language);
    return res.status(503).json({ error: 'SERVICE_NOT_CONFIGURED' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9_000);
  try {
    const upstream = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId }),
      signal: controller.signal,
    });
    if (!upstream.ok) {
      const mapped = mapProviderStatus(upstream.status);
      safeLog('provider_rejected', String(upstream.status));
      return res.status(mapped.status).json({ error: mapped.code });
    }
    const result = await upstream.json() as { access_token?: unknown; call_id?: unknown };
    if (typeof result.access_token !== 'string') {
      safeLog('invalid_provider_response');
      return res.status(502).json({ error: 'PROVIDER_ERROR' });
    }
    safeLog('session_created', language);
    return res.status(200).json({ access_token: result.access_token, ...(typeof result.call_id === 'string' ? { call_id: result.call_id } : {}) });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      safeLog('provider_timeout');
      return res.status(504).json({ error: 'PROVIDER_TIMEOUT' });
    }
    safeLog('provider_network_failure');
    return res.status(503).json({ error: 'PROVIDER_UNAVAILABLE' });
  } finally {
    clearTimeout(timeout);
  }
}
