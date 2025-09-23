const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Debug: Check if environment variables are loaded
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:');
  console.error('SUPABASE_URL:', supabaseUrl ? 'Found' : 'Missing');
  console.error('SUPABASE_KEY:', supabaseKey ? 'Found' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'], // Add your frontend URLs
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes

// Authentication Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, address } = req.body;
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Store additional user data (you might want to create a profiles table)
    // For now, we'll just return the auth data
    res.json({ 
      message: 'User created successfully', 
      user: authData.user,
      session: authData.session
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Login successful', 
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Announcements API
app.get('/api/announcements', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, sort = 'desc' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('announcements')
      .select('*');
    
    if (category && category !== 'All categories') {
      query = query.eq('category', category);
    }
    
    query = query
      .order('created_at', { ascending: sort === 'asc' })
      .range(offset, offset + limit - 1);
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/announcements', async (req, res) => {
  try {
    const { title, description, category, importance, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('announcements')
      .insert([
        {
          title,
          description,
          category: category || 'General',
          importance: importance || 'Medium',
          image_url,
          date: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Announcement created successfully', data });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Visitor Registration API
app.post('/api/visitors', async (req, res) => {
  try {
    const { 
      resident_name, 
      full_name, 
      visit_date, 
      visit_purpose, 
      mobile_number,
      vehicle_info,
      residence_address,
      num_visitors 
    } = req.body;
    
    // Generate QR code data
    const qr_code = `VISITOR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          resident_name,
          full_name,
          visit_date,
          visit_purpose,
          mobile_number,
          qr_code,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ 
      message: 'Visitor registered successfully', 
      data: data[0],
      qr_code 
    });
  } catch (error) {
    console.error('Register visitor error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Concerns/Issues API
app.post('/api/concerns', async (req, res) => {
  try {
    const { name, location, issue_type, email, description, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('concerns')
      .insert([
        {
          name,
          location,
          issue_type,
          email,
          description,
          image_url,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Concern submitted successfully', data });
  } catch (error) {
    console.error('Submit concern error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bookings API (for amenities)
app.post('/api/bookings', async (req, res) => {
  try {
    const { 
      user_id, 
      amenity_type, 
      booking_date, 
      start_time, 
      end_time, 
      resident_name, 
      purpose, 
      mobile_number 
    } = req.body;
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id,
          amenity_type,
          booking_date,
          start_time,
          end_time,
          resident_name,
          purpose,
          mobile_number,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Booking created successfully', data });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Grove Backend API is running!', timestamp: new Date().toISOString() });
});

// Serve the frontend for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🌳 Grove Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});