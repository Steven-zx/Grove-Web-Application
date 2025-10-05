const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
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

// Service role client for admin operations (bypasses RLS)
const supabaseService = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', 
      'http://localhost:4173',
      'http://localhost:5174',
      'http://localhost:5175'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Note: Static files will be served after API routes

// Helper Functions
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Validation helpers
const validateEmail = (email) => validator.isEmail(email);
const validatePassword = (password) => password && password.length >= 6;

// ===== AUTHENTICATION ROUTES =====

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, address } = req.body;
    
    // Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: authData.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          address: address,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    const token = generateToken({ 
      userId: authData.user.id, 
      email: email, 
      isAdmin: false 
    });

    res.json({ 
      message: 'User created successfully', 
      user: {
        id: authData.user.id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address
      },
      token: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const token = generateToken({ 
      userId: data.user.id, 
      email: data.user.email, 
      isAdmin: false 
    });

    res.json({ 
      message: 'Login successful', 
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        phone: profile?.phone,
        address: profile?.address
      },
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check admin credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = generateToken({ 
        userId: 'admin', 
        email: email, 
        isAdmin: true 
      });

      res.json({ 
        message: 'Admin login successful',
        admin: { email: email, role: 'admin' },
        token: token
      });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== USER PROFILE ROUTES =====

// Get User Profile
app.get('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update User Profile
app.put('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        address: address,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.userId)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Profile updated successfully', data });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== ANNOUNCEMENTS ROUTES =====

// Get Announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, sort = 'desc' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = supabaseService
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

// Create Sample Announcements (Quick Fix)
app.post('/api/admin/create-sample-announcements', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Create announcements using direct SQL to bypass RLS
    const announcements = [
      {
        title: 'Welcome to Grove Community!',
        description: 'Welcome to our beautiful residential community. We hope you enjoy all the amenities we have to offer, including our swimming pool, basketball court, and clubhouse.',
        category: 'General',
        importance: 'Medium'
      },
      {
        title: 'Pool Maintenance Schedule',
        description: 'The swimming pool will be undergoing routine maintenance every Sunday from 6:00 AM to 8:00 AM. Please plan your activities accordingly.',
        category: 'Maintenance',
        importance: 'High'
      },
      {
        title: 'New Basketball Court Rules',
        description: 'Please note the new rules for the basketball court: Maximum 2 hours per booking, clean up after use, and respect other residents.',
        category: 'Sports',
        importance: 'Medium'
      },
      {
        title: 'Security Update',
        description: 'New security measures have been implemented. All visitors must now register through the mobile app or at the security gate.',
        category: 'Security',
        importance: 'Urgent'
      }
    ];

    // Insert using raw SQL to bypass RLS
    const { data, error } = await supabase.rpc('create_announcements', {
      announcements_data: announcements
    });

    if (error) {
      console.log('RPC error, trying direct insert...');
      // Fallback: try direct insert
      const { data: insertData, error: insertError } = await supabase
        .from('announcements')
        .insert(announcements)
        .select();
      
      if (insertError) {
        console.error('Insert error:', insertError);
        return res.status(500).json({ error: insertError.message });
      }
      
      return res.json({ message: 'Sample announcements created successfully', data: insertData });
    }
    
    res.json({ message: 'Sample announcements created successfully', data });
  } catch (error) {
    console.error('Create sample announcements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Announcement (Admin)
app.post('/api/admin/announcements', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, category, importance, image_url } = req.body;
    
    // Use service role client for admin operations
    const { data, error } = await supabaseService
      .from('announcements')
      .insert([
        {
          title,
          description,
          category: category || 'General',
          importance: importance || 'Medium',
          image_url,
          created_at: new Date().toISOString()
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

// Update Announcement (Admin)
app.put('/api/admin/announcements/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, importance, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('announcements')
      .update({
        title,
        description,
        category,
        importance,
        image_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Announcement updated successfully', data });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Announcement (Admin)
app.delete('/api/admin/announcements/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== AMENITIES ROUTES =====

// Get Amenities
app.get('/api/amenities', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .order('name');
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get amenities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== BOOKINGS ROUTES =====

// Create Booking
app.post('/api/bookings', verifyToken, async (req, res) => {
  try {
    const { 
      amenity_id,
      amenity_name,
      booking_date, 
      start_time, 
      end_time, 
      purpose,
      guest_count
    } = req.body;
    
    // Get user profile for resident name
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, phone')
      .eq('id', req.user.userId)
      .single();
    
    const resident_name = profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown';
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: req.user.userId,
          amenity_id: amenity_id,
          amenity_type: amenity_name,
          booking_date,
          start_time,
          end_time,
          resident_name,
          purpose,
          mobile_number: profile?.phone,
          guest_count: guest_count || 1,
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

// Get User Bookings
app.get('/api/bookings', verifyToken, async (req, res) => {
  try {
    const { status, amenity } = req.query;
    
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('user_id', req.user.userId);
    
    if (status) {
      query = query.eq('status', status);
    }
    if (amenity) {
      query = query.eq('amenity_type', amenity);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Calendar Bookings
app.get('/api/bookings/calendar', async (req, res) => {
  try {
    const { start_date, end_date, amenity } = req.query;
    
    let query = supabase
      .from('bookings')
      .select('*')
      .gte('booking_date', start_date)
      .lte('booking_date', end_date)
      .in('status', ['confirmed', 'pending']);
    
    if (amenity) {
      query = query.eq('amenity_type', amenity);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get calendar bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Booking Status (Admin)
app.put('/api/admin/bookings/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Booking status updated successfully', data });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel Booking
app.delete('/api/bookings/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }
    
    res.json({ message: 'Booking cancelled successfully', data });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== VISITOR ROUTES =====

// Register Visitor & Generate QR Code
app.post('/api/visitors', verifyToken, async (req, res) => {
  try {
    const { 
      visitor_name,
      visit_date, 
      visit_purpose, 
      vehicle_info,
      residence_address,
      num_visitors 
    } = req.body;
    
    // Get user profile for resident name
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, phone')
      .eq('id', req.user.userId)
      .single();
    
    const resident_name = profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown';
    
    // Generate QR code data
    const qr_code = `VISITOR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          user_id: req.user.userId,
          resident_name,
          visitor_name,
          visit_date,
          visit_purpose,
          mobile_number: profile?.phone,
          vehicle_info,
          residence_address,
          num_visitors: num_visitors || 1,
          qr_code,
          status: 'active',
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

// Get User's Visitors
app.get('/api/visitors', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get visitors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== CONCERNS ROUTES =====

// Submit Concern/Issue Report
app.post('/api/concerns', verifyToken, async (req, res) => {
  try {
    const { location, issue_type, description, image_url } = req.body;
    
    // Get user profile for contact info
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, email, phone')
      .eq('id', req.user.userId)
      .single();
    
    const reporter_name = profile ? `${profile.first_name} ${profile.last_name}` : 'Anonymous';
    
    const { data, error } = await supabase
      .from('concerns')
      .insert([
        {
          user_id: req.user.userId,
          reporter_name,
          location,
          issue_type,
          email: profile?.email,
          phone: profile?.phone,
          description,
          image_url,
          status: 'unread',
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

// Get All Concerns (Admin)
app.get('/api/admin/concerns', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let query = supabase
      .from('concerns')
      .select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('issue_type', type);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get concerns error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Concern Status (Admin)
app.put('/api/admin/concerns/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('concerns')
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Concern status updated successfully', data });
  } catch (error) {
    console.error('Update concern error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== ADMIN DASHBOARD ROUTES =====

// Get Dashboard Stats
app.get('/api/admin/dashboard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Get counts for dashboard
    const [announcementsResult, bookingsResult, concernsResult, usersResult] = await Promise.all([
      supabase.from('announcements').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('concerns').select('id', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('id', { count: 'exact', head: true })
    ]);
    
    res.json({
      announcements: announcementsResult.count || 0,
      bookings: bookingsResult.count || 0,
      concerns: concernsResult.count || 0,
      users: usersResult.count || 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== DEBUG ENDPOINT =====
app.get('/api/debug/announcements', async (req, res) => {
  try {
    console.log('Debug: Testing Supabase connection...');
    const { data, error, count } = await supabase
      .from('announcements')
      .select('*', { count: 'exact' });
    
    console.log('Debug: Query result:', { data, error, count });
    
    res.json({
      success: !error,
      count: count,
      data: data,
      error: error?.message || null,
      supabase_url: process.env.SUPABASE_URL ? 'Set' : 'Missing',
      supabase_key: process.env.SUPABASE_KEY ? 'Set' : 'Missing'
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.json({ 
      success: false, 
      error: err.message,
      supabase_url: process.env.SUPABASE_URL ? 'Set' : 'Missing',
      supabase_key: process.env.SUPABASE_KEY ? 'Set' : 'Missing'
    });
  }
});

// ===== QUICK FIX: Add Sample Data =====
app.get('/api/debug/add-sample-data', async (req, res) => {
  try {
    console.log('Adding sample announcements using service role...');
    
    // Use service role client to bypass RLS
    const sampleAnnouncements = [
      {
        title: 'Welcome to Grove Community!',
        description: 'Welcome to our beautiful residential community. We hope you enjoy all the amenities we have to offer, including our swimming pool, basketball court, and clubhouse.',
        category: 'General',
        importance: 'Medium'
      },
      {
        title: 'Pool Maintenance Schedule', 
        description: 'The swimming pool will be undergoing routine maintenance every Sunday from 6:00 AM to 8:00 AM. Please plan your swimming activities accordingly.',
        category: 'Maintenance',
        importance: 'High'
      },
      {
        title: 'New Basketball Court Rules',
        description: 'Please note the new rules for the basketball court: Maximum 2 hours per booking, clean up after use, and respect other residents.',
        category: 'Sports', 
        importance: 'Medium'
      },
      {
        title: 'Security Update',
        description: 'New security measures have been implemented. All visitors must now register through the mobile app or at the security gate.',
        category: 'Security',
        importance: 'Urgent'
      }
    ];

    const { data, error } = await supabaseService
      .from('announcements')
      .insert(sampleAnnouncements)
      .select();
    
    console.log('Insert result:', { data, error });
    
    res.json({
      success: !error,
      message: error ? 'Failed to add sample data' : 'Sample data added successfully',
      data: data,
      error: error?.message || null,
      count: data ? data.length : 0
    });
  } catch (err) {
    console.error('Add sample data error:', err);
    res.json({ 
      success: false, 
      error: err.message
    });
  }
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '🌳 Grove Enhanced Backend API is running!', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: ['Authentication', 'Bookings', 'Announcements', 'Visitors', 'Concerns', 'Admin Panel']
  });
});

// Serve the frontend for non-API routes only
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  express.static(path.join(__dirname, '../frontend/dist'))(req, res, next);
});

// Serve the frontend for all other non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🌳 Grove Enhanced Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Admin login: Use ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
});