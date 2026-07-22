import assert from 'node:assert/strict';
import test from 'node:test';
import { createRateLimiter, isAllowedOrigin, mapProviderStatus, parseLanguage } from '../api/retell/create-web-call-logic.mjs';

test('accepts only exact EN/PL payloads', () => {
  assert.equal(parseLanguage({ language: 'en' }), 'en');
  assert.equal(parseLanguage({ language: 'pl' }), 'pl');
  assert.equal(parseLanguage({ language: 'de' }), null);
  assert.equal(parseLanguage({ language: 'en', extra: true }), null);
});

test('maps provider failures safely', () => {
  assert.deepEqual(mapProviderStatus(402), { status: 402, code: 'BILLING_UNAVAILABLE' });
  assert.deepEqual(mapProviderStatus(429), { status: 429, code: 'RATE_LIMITED' });
  assert.deepEqual(mapProviderStatus(503), { status: 503, code: 'PROVIDER_UNAVAILABLE' });
  assert.deepEqual(mapProviderStatus(401), { status: 502, code: 'PROVIDER_ERROR' });
});

test('allows only expected production and preview origins', () => {
  assert.equal(isAllowedOrigin('https://cambridge-ai-receptionist.vercel.app', { NODE_ENV: 'production' }), true);
  assert.equal(isAllowedOrigin('https://cambridge-ai-receptionist-git-main-team.vercel.app', { NODE_ENV: 'production' }), true);
  assert.equal(isAllowedOrigin('https://example.vercel.app', { NODE_ENV: 'production' }), false);
});

test('enforces cooldown and request cap', () => {
  const check = createRateLimiter({ windowMs: 10_000, maxRequests: 2, cooldownMs: 1_000 });
  assert.equal(check('visitor', 0).allowed, true);
  assert.equal(check('visitor', 100).allowed, false);
  assert.equal(check('visitor', 1_000).allowed, true);
  assert.equal(check('visitor', 2_000).allowed, false);
});
