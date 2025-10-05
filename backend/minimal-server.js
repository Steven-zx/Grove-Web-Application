const http = require('http');
const path = require('path');
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
    if (req.url === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'OK', message: 'Server is working' }));
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
          description: announcement.content || announcement.description,
          category: announcement.category || 'General',
          importance: announcement.priority || announcement.importance || 'medium',
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