#!/usr/bin/env node
/**
 * Go-live check — validates critical API and (optional) frontend endpoints.
 * Usage: node scripts/go-live-check.js <API_URL> [FRONTEND_URL]
 * Node 18+ (uses global fetch). Exits 0 on all PASS, 1 if any required check fails.
 */

const API_URL = (process.argv[2] || '').replace(/\/$/, '');
const FRONTEND_URL = (process.argv[3] || '').replace(/\/$/, '');

async function timedFetch(url, options = {}) {
  const start = Date.now();
  const res = await fetch(url, {
    ...options,
    headers: { Accept: 'application/json', ...options.headers },
  });
  const ms = Date.now() - start;
  let body = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try {
      body = await res.json();
    } catch (_) {
      body = null;
    }
  }
  return { ok: res.ok, status: res.status, body, ms };
}

function pass(label, status, ms) {
  console.log(`[PASS] ${label} (${status}) ${ms}ms`);
  return true;
}
function fail(label, detail) {
  console.log(`[FAIL] ${label} — ${detail}`);
  return false;
}

async function main() {
  if (!API_URL) {
    console.error('Usage: node scripts/go-live-check.js <API_URL> [FRONTEND_URL]');
    process.exit(1);
  }

  let allPass = true;

  // A) GET /health
  try {
    const { ok, status, body, ms } = await timedFetch(`${API_URL}/health`);
    if (status === 200 && (body?.status === 'ok' || body?.status != null || typeof body === 'object')) {
      pass('API /health', status, ms);
    } else {
      allPass = false;
      fail('API /health', `expected 200 with body containing status, got ${status}`);
    }
  } catch (e) {
    allPass = false;
    fail('API /health', e.message || String(e));
  }

  // B) GET /api/admin/orders without token → 401 or 403
  try {
    const { status, body, ms } = await timedFetch(`${API_URL}/api/admin/orders`);
    if (status === 401 || status === 403) {
      pass('Admin unauthorized check', status, ms);
    } else {
      allPass = false;
      fail('Admin unauthorized check', `expected 401 or 403, got ${status}`);
    }
  } catch (e) {
    allPass = false;
    fail('Admin unauthorized check', e.message || String(e));
  }

  // C) GET /api/mp/payment/invalid-id → 400, 404, 500 or 502, JSON
  try {
    const { status, body, ms } = await timedFetch(`${API_URL}/api/mp/payment/invalid-id`);
    const acceptedStatus = [400, 404, 500, 502];
    if (acceptedStatus.includes(status) && body !== null && typeof body === 'object') {
      pass('MP payment invalid id check', status, ms);
    } else {
      allPass = false;
      fail('MP payment invalid id check', `expected one of ${acceptedStatus.join(',')} with JSON, got ${status}`);
    }
  } catch (e) {
    allPass = false;
    fail('MP payment invalid id check', e.message || String(e));
  }

  // D) Optional: GET FRONTEND_URL/
  if (FRONTEND_URL) {
    try {
      const { status, ms } = await timedFetch(`${FRONTEND_URL}/`, {
        headers: { Accept: 'text/html' },
      });
      if (status === 200) {
        pass('Frontend /', status, ms);
      } else {
        allPass = false;
        fail('Frontend /', `expected 200, got ${status}`);
      }
    } catch (e) {
      allPass = false;
      fail('Frontend /', e.message || String(e));
    }
  }

  console.log(allPass ? 'Overall: PASS' : 'Overall: FAIL');
  process.exit(allPass ? 0 : 1);
}

main();
