const http = require('http');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
console.log('✅ Supabase connected');

// Admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@augustinegrove.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'grove_jwt_secret_key_2025';

// Helper function to parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Helper function to verify JWT token
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'OK', message: 'Server is working' }));
      
    } else if (pathname === '/api/admin/login' && req.method === 'POST') {
      try {
        const { email, password } = await parseBody(req);
        
        console.log('🔐 Admin login attempt:', email);
        
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const token = jwt.sign(
            { email: ADMIN_EMAIL, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          console.log('✅ Admin login successful');
          res.writeHead(200);
          res.end(JSON.stringify({ 
            success: true, 
            token, 
            message: 'Login successful',
            user: { email: ADMIN_EMAIL, role: 'admin' }
          }));
        } else {
          console.log('❌ Admin login failed: Invalid credentials');
          res.writeHead(401);
          res.end(JSON.stringify({ error: 'Invalid credentials' }));
        }
      } catch (err) {
        console.error('❌ Admin login error:', err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    } else if (req.url.startsWith('/api/announcements')) {
      try {
        console.log('🔍 Fetching announcements from Supabase...');
        
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Supabase error:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Failed to fetch announcements from database' }));
          return;
        }

        console.log(`✅ Found ${data ? data.length : 0} announcements in database`);
        
        // Transform the data to match frontend expectations
        const formattedAnnouncements = (data || []).map(announcement => ({
          id: announcement.id,
          title: announcement.title,
          description: announcement.description,
          category: announcement.category || 'General',
          importance: announcement.importance || 'Medium',
          image_url: announcement.image_url,
          created_at: announcement.created_at
        }));

        res.writeHead(200);
        res.end(JSON.stringify(formattedAnnouncements));
        
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Database connection failed' }));
      }
      
    } else if (pathname === '/api/admin/announcements' && req.method === 'POST') {
      try {
        const decoded = verifyToken(req.headers.authorization);
        if (!decoded) {
          res.writeHead(401);
          res.end(JSON.stringify({ error: 'Unauthorized' }));
          return;
        }

        const { title, description, category = 'General', importance = 'Medium', image_url } = await parseBody(req);
        
        if (!title || !description) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Title and description are required' }));
          return;
        }

        console.log('📝 Creating new announcement:', title);

        const { data, error } = await supabase
          .from('announcements')
          .insert([{
            title,
            description,
            category,
            importance,
            image_url: image_url || null
          }])
          .select();

        if (error) {
          console.error('❌ Error creating announcement:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Failed to create announcement' }));
          return;
        }

        console.log('✅ Announcement created successfully');
        res.writeHead(201);
        res.end(JSON.stringify({ success: true, data: data[0] }));

      } catch (err) {
        console.error('❌ Create announcement error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
      
    } else if (pathname.startsWith('/api/admin/announcements/') && req.method === 'DELETE') {
      try {
        const decoded = verifyToken(req.headers.authorization);
        if (!decoded) {
          res.writeHead(401);
          res.end(JSON.stringify({ error: 'Unauthorized' }));
          return;
        }

        const announcementId = pathname.split('/').pop();
        
        console.log('🗑️ Deleting announcement:', announcementId);

        const { error } = await supabase
          .from('announcements')
          .delete()
          .eq('id', announcementId);

        if (error) {
          console.error('❌ Error deleting announcement:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Failed to delete announcement' }));
          return;
        }

        console.log('✅ Announcement deleted successfully');
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Announcement deleted' }));

      } catch (err) {
        console.error('❌ Delete announcement error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
      
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (err) {
    console.error('Request error:', err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(3000, 'localhost', () => {
  console.log('🚀 Simple server running on http://localhost:3000');
  console.log('📊 Health: http://localhost:3000/api/health');
  console.log('📢 Announcements: http://localhost:3000/api/announcements');
});

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error('Port 3000 is already in use. Please kill existing processes.');
  }
});

server.on('connection', (socket) => {
  console.log('New connection established');
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});