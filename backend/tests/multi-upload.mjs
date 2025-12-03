// Test multi-file upload with category inference
const BASE = 'http://localhost:3000/api';

async function adminLogin() {
  const res = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: process.env.ADMIN_EMAIL || 'admin@augustinegrove.com', 
      password: process.env.ADMIN_PASSWORD || 'admin123' 
    })
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

async function uploadImageWithCategory(token, filename, category) {
  const url = `${BASE}/admin/gallery/upload`;
  const form = new FormData();
  const blob = new Blob([Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,0])], { type: 'image/png' });
  form.append('file', blob, filename);
  if (category) {
    form.append('category', category);
  }
  const res = await fetch(url, { 
    method: 'POST', 
    headers: { Authorization: `Bearer ${token}` }, 
    body: form 
  });
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
    console.log('🧪 Testing multi-file upload with categories...\n');
    
    const token = await adminLogin();
    console.log('✅ Admin login successful');
    
    const before = await listGallery();
    console.log(`📊 Initial gallery count: ${before.length}`);
    
    // Upload multiple files with different categories
    console.log('\n📤 Uploading 3 files with different categories...');
    const uploads = [];
    
    const file1 = await uploadImageWithCategory(token, 'basketball-test-1.png', 'Basketball court');
    uploads.push(file1.item);
    console.log(`  ✅ Uploaded: ${file1.item.name} → category: Basketball court`);
    
    const file2 = await uploadImageWithCategory(token, 'pool-test-1.png', 'Swimming pool');
    uploads.push(file2.item);
    console.log(`  ✅ Uploaded: ${file2.item.name} → category: Swimming pool`);
    
    const file3 = await uploadImageWithCategory(token, 'other-test-1.png', 'Others');
    uploads.push(file3.item);
    console.log(`  ✅ Uploaded: ${file3.item.name} → category: Others`);
    
    // Verify all files are in the list
    console.log('\n🔍 Verifying uploads in gallery list...');
    const after = await listGallery();
    console.log(`📊 Gallery count after upload: ${after.length} (expected ${before.length + 3})`);
    
    let allFound = true;
    for (const upload of uploads) {
      const found = after.find(x => x.id === upload.id);
      if (found) {
        console.log(`  ✅ Found: ${found.name} (category: ${found.category || 'N/A'})`);
        // Verify category is correct
        const expectedCategory = upload.id.includes('basketball') ? 'Basketball court' 
                               : upload.id.includes('pool') ? 'Swimming pool' 
                               : 'Others';
        if (found.category !== expectedCategory) {
          console.log(`    ⚠️  Category mismatch: expected "${expectedCategory}", got "${found.category}"`);
        }
      } else {
        console.log(`  ❌ NOT FOUND: ${upload.name}`);
        allFound = false;
      }
    }
    
    if (!allFound) {
      throw new Error('Some uploaded files not found in gallery list');
    }
    
    // Test category filtering by grouping
    console.log('\n📋 Testing category grouping...');
    const byCategory = after.reduce((acc, img) => {
      const cat = img.category || 'Unknown';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    console.log('  Categories:', byCategory);
    
    // Cleanup: delete test files
    console.log('\n🧹 Cleaning up test files...');
    for (const upload of uploads) {
      await deleteImage(token, upload.id);
      console.log(`  ✅ Deleted: ${upload.name}`);
    }
    
    const final = await listGallery();
    console.log(`📊 Final gallery count: ${final.length} (expected ${before.length})`);
    
    if (final.length !== before.length) {
      throw new Error(`Gallery count mismatch after cleanup: ${final.length} vs ${before.length}`);
    }
    
    console.log('\n✅ All tests passed!');
  } catch (e) {
    console.error('\n❌ Test failed:', e);
    process.exit(1);
  }
})();
