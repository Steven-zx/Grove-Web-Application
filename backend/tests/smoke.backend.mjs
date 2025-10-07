// Simple backend smoke test (no external deps)
// Node 20+ required

const BASE = process.env.API_BASE || 'http://localhost:3000/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@augustinegrove.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERT: ' + msg);
}

async function main() {
  console.log('🌬️ Smoke: Health check');
  const health = await fetch(`${BASE}/health`);
  assert(health.ok, `Health not OK: ${health.status}`);
  const healthJson = await health.json();
  console.log('Health:', healthJson.message);

  console.log('🔐 Smoke: Admin login');
  const loginRes = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  });
  assert(loginRes.ok, `Login failed: ${loginRes.status}`);
  const loginJson = await loginRes.json();
  assert(loginJson.token, 'No token in login response');
  const token = loginJson.token;

  console.log('📑 Smoke: List announcements');
  const listRes = await fetch(`${BASE}/announcements`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(listRes.ok, `List announcements failed: ${listRes.status}`);
  const items = await listRes.json();
  assert(Array.isArray(items), 'Announcements not an array');
  console.log(`Found ${items.length} announcements`);

  console.log('✅ Smoke OK');
}

main().catch((e) => {
  console.error('❌ Smoke FAILED:', e.message);
  process.exit(1);
});
