// Simple smoke test for gallery upload/list/delete
// Requires backend server running and ADMIN_EMAIL/PASSWORD set

const BASE = 'http://localhost:3000/api';

async function adminLogin() {
  const res = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
  });
  if (!res.ok) throw new Error(`Admin login failed ${res.status}`);
  const json = await res.json();
  return json.token;
}

async function listGallery() {
  const res = await fetch(`${BASE}/gallery`);
  if (!res.ok) throw new Error(`List gallery failed ${res.status}`);
  return await res.json();
}

async function uploadImage(token) {
  const url = `${BASE}/admin/gallery/upload`;
  const form = new FormData();
  // Create a small blob as a PNG-like content
  const blob = new Blob([Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,0])], { type: 'image/png' });
  form.append('file', blob, 'test-smoke.png');
  const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
  if (!res.ok) throw new Error(`Upload failed ${res.status}`);
  return await res.json();
}

async function deleteImage(token, id) {
  const res = await fetch(`${BASE}/admin/gallery/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Delete failed ${res.status}`);
  return await res.json();
}

(async () => {
  try {
    const token = await adminLogin();
    const before = await listGallery();
    const uploaded = await uploadImage(token);
    const listAfter = await listGallery();
    const found = listAfter.find(x => x.id === uploaded.item.id);
    if (!found) throw new Error('Uploaded item not in list');
    await deleteImage(token, uploaded.item.id);
    const listFinal = await listGallery();
    const stillThere = listFinal.find(x => x.id === uploaded.item.id);
    if (stillThere) throw new Error('Item still present after delete');
    console.log('✅ Gallery smoke OK. Counts:', { before: before.length, after: listAfter.length, final: listFinal.length });
  } catch (e) {
    console.error('❌ Gallery smoke failed:', e);
    process.exit(1);
  }
})();
