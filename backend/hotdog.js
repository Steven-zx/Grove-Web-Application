const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const crypto = require('crypto');
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

// Debug: Verify service key is loaded
console.log('🔑 Service key loaded:', process.env.SUPABASE_SERVICE_KEY ? 'Yes' : 'No');
console.log('🔑 Service key length:', process.env.SUPABASE_SERVICE_KEY?.length || 0);

// Initialize amenities data
const initializeAmenities = async () => {
  try {
    // Check if amenities already exist
    const { data: existingAmenities, error: checkError } = await supabaseService
      .from('amenities')
      .select('*');

    console.log('🔍 Existing amenities check:', { 
      count: existingAmenities?.length || 0, 
      data: existingAmenities?.map(a => ({ id: a.id, name: a.name })),
      error: checkError?.message 
    });

    // Always ensure we have the correct 4 amenities
    const correctAmenities = [
      {
        name: 'Swimming Pool',
        description: 'Medium-sized pool with separate kids area. Max capacity: 25 people, ₱150 entrance fee per pax',
        capacity: 25,
        hourly_rate: 150,
        available_hours: '8:00 AM - 10:00 PM',
        image_url: '/src/assets/pool.jpg',
        is_active: true
      },
      {
        name: 'Basketball Court',
        description: 'A standard outdoor court with a mounted hoop, ideal for casual games or tournaments. Max capacity: 20 people, ₱1,000 (half day), ₱2,000 (full day)',
        capacity: 20,
        hourly_rate: 1000,
        available_hours: '8:00 AM - 10:00 PM',
        image_url: '/src/assets/basketball.jpg',
        is_active: true
      },
      {
        name: 'Clubhouse',
        description: 'Perfect for community events, parties, and gatherings. Max capacity: 50 people, ₱2,000 (half day), ₱3,500 (full day)',
        capacity: 50,
        hourly_rate: 2000,
        available_hours: '8:00 AM - 10:00 PM',
        image_url: '/src/assets/clubhouse.jpg',
        is_active: true
      },
      {
        name: 'Playground',
        description: 'Coming Soon.',
        capacity: 20,
        hourly_rate: 0,
        available_hours: 'Not Available',
        image_url: null,
        is_active: false
      }
    ];

    if (!existingAmenities || existingAmenities.length === 0) {
      // No amenities exist, add all
      console.log('🏗️ Adding all amenities...');
      const { error } = await supabaseService
        .from('amenities')
        .insert(correctAmenities);
      
      if (error) {
        console.error('❌ Failed to add amenities:', error.message);
      } else {
        console.log('✅ All amenities added successfully');
        correctAmenities.forEach(a => {
          console.log(`  ✅ ${a.name} (${a.is_active ? 'Available' : 'Not Available'})`);
        });
      }
    } else {
      // Amenities exist, force update with new descriptions
      console.log('🔄 Updating existing amenities with new descriptions...');
      
      // Delete all existing amenities
      await supabaseService
        .from('amenities')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert updated amenities
      const { error } = await supabaseService
        .from('amenities')
        .insert(correctAmenities);
      
      if (error) {
        console.error('❌ Failed to update amenities:', error.message);
      } else {
        console.log('✅ Amenities updated successfully with new descriptions');
        correctAmenities.forEach(a => {
          console.log(`  ✅ ${a.name}: ${a.description.substring(0, 50)}...`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Error managing amenities:', error);
  }
};

// Initialize database tables and relationships
const initializeTables = async () => {
  try {
    console.log('🔧 Checking database tables...');
    
    // Check if bookings table exists by trying to query it
    const { data: bookingsTest, error: bookingsError } = await supabaseService
      .from('bookings')
      .select('count', { count: 'exact', head: true });
    
    if (bookingsError) {
      console.log('📊 Bookings table needs to be created via Supabase dashboard');
      console.log('📋 Required table structure for bookings:');
      console.log(`
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id),
          amenity_id UUID REFERENCES amenities(id),
          amenity_type TEXT NOT NULL,
          booking_date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          purpose TEXT,
          attendees INTEGER DEFAULT 1,
          additional_notes TEXT,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      console.log('⚠️  Please create this table in your Supabase dashboard');
    } else {
      console.log('✅ Bookings table exists');
    }
    
  } catch (error) {
    console.error('❌ Error checking database tables:', error);
  }
};

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
      'http://localhost:5175',
      'http://localhost:5176'
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
  if (req.method === 'POST' && req.path === '/api/auth/register') {
    console.log('📝 Registration request received with body:', req.body);
  }
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

// ===== PAYMONGO HELPERS =====
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_MODE = (process.env.PAYMONGO_MODE || 'test').toLowerCase();
const PAYMONGO_API_BASE = 'https://api.paymongo.com/v1';

function basicAuthHeader(secretKey) {
  const token = Buffer.from(`${secretKey}:`).toString('base64');
  return `Basic ${token}`;
}

function cents(amount) {
  // PayMongo expects the smallest currency unit (centavos)
  if (typeof amount === 'string') amount = parseFloat(amount);
  return Math.round((amount || 0) * 100);
}

function getRedirectUrls() {
  const success = process.env.PAYMONGO_SUCCESS_URL || 'http://localhost:5173/payment/success';
  const failed = process.env.PAYMONGO_FAILED_URL || 'http://localhost:5173/payment/failed';
  return { success, failed };
}

async function paymongoCreateGCashSource({ amount, description, bookingId, userId }) {
  if (!PAYMONGO_SECRET_KEY) {
    throw new Error('PAYMONGO_SECRET_KEY is not configured');
  }
  const { success, failed } = getRedirectUrls();
  const payload = {
    data: {
      attributes: {
        amount: cents(amount),
        currency: 'PHP',
        type: 'gcash',
        redirect: { success, failed },
        metadata: {
          bookingId: String(bookingId || ''),
          userId: String(userId || ''),
          description: String(description || '')
        }
      }
    }
  };

  const res = await axios.post(`${PAYMONGO_API_BASE}/sources`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': basicAuthHeader(PAYMONGO_SECRET_KEY)
    }
  });
  return res.data;
}

async function paymongoGetSource(sourceId) {
  const res = await axios.get(`${PAYMONGO_API_BASE}/sources/${sourceId}`, {
    headers: { 'Authorization': basicAuthHeader(PAYMONGO_SECRET_KEY) }
  });
  return res.data;
}

async function paymongoCreatePaymentFromSource({ amount, sourceId, description }) {
  const payload = {
    data: {
      attributes: {
        amount: cents(amount),
        currency: 'PHP',
        source: { id: sourceId, type: 'source' },
        description: description || 'GCash Payment'
      }
    }
  };
  const res = await axios.post(`${PAYMONGO_API_BASE}/payments`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': basicAuthHeader(PAYMONGO_SECRET_KEY)
    }
  });
  return res.data;
}

// Validation helpers
const validateEmail = (email) => validator.isEmail(email);
const validatePassword = (password) => password && password.length >= 6;

// ===== FILE UPLOAD (GALLERY) HELPERS =====
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_UPLOAD_BYTES || '', 10) || 5 * 1024 * 1024 } // 5MB default
});

const GALLERY_BUCKET = process.env.GALLERY_BUCKET || 'gallery';

async function ensureGalleryBucket() {
  try {
    // Try to create bucket as public; ignore if already exists
    const { error } = await supabaseService.storage.createBucket(GALLERY_BUCKET, { public: true });
    if (error && !String(error.message || '').toLowerCase().includes('already exists')) {
      console.warn('Could not create bucket (may already exist):', error.message);
    }
  } catch (e) {
    // Non-fatal
    console.warn('ensureGalleryBucket warning:', e.message);
  }
}

function sanitizeFileName(name) {
  const base = name.replace(/[^A-Za-z0-9._-]+/g, '-').toLowerCase();
  return base.length ? base : `image-${Date.now()}.png`;
}

function makeObjectPath(originalName) {
  const safe = sanitizeFileName(originalName || 'upload.png');
  const rand = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(12).toString('hex');
  const ts = Date.now();
  return `${ts}_${rand}_${safe}`;
}

// ===== AUTHENTICATION ROUTES =====

// Step 1: Initial Registration (Email & Password only)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    console.log(`🔐 Registration attempt for: ${email}`);

    // Create user in Supabase Auth with auto-confirmation
    const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true  // Auto-confirm the email
    });

    console.log('Auth signup result:', { 
      success: !authError, 
      userId: authData?.user?.id,
      errorMessage: authError?.message 
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      // Handle case where user already exists
      if (authError.message.includes('already registered')) {
        return res.status(400).json({ error: 'An account with this email already exists. Please try logging in instead.' });
      }
      return res.status(400).json({ error: authError.message });
    }

    // Check if user profile already exists
    console.log(`🔍 Checking for existing profile for email: ${email}`);
    const { data: existingProfile, error: profileCheckError } = await supabaseService
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    console.log('Profile check result:', { 
      exists: !!existingProfile, 
      profileId: existingProfile?.id,
      checkError: profileCheckError?.message 
    });

    let userId = authData.user?.id;
    console.log(`📝 User ID from auth: ${userId}`);
    
    // If user exists but no profile, create it
    if (!existingProfile && userId) {
      console.log('🆕 Creating new user profile...');
      const { data: profileData, error: profileError } = await supabaseService
        .from('user_profiles')
        .insert([
          {
            id: userId,
            email: email,
            first_name: '', // Temporary empty value, will be filled in step 2
            last_name: '', // Temporary empty value, will be filled in step 2
            phone: '', // Temporary empty value, will be filled in step 2
            address: '', // Temporary empty value, will be filled in step 2
            created_at: new Date().toISOString()
          }
        ])
        .select();

      console.log('Profile creation result:', { 
        success: !profileError, 
        profileData: profileData?.[0],
        error: profileError 
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return res.status(500).json({ error: 'Failed to create user profile: ' + profileError.message });
      }
    } else if (existingProfile) {
      // Use existing profile
      console.log('📋 Using existing profile');
      userId = existingProfile.id;
    }

    const token = generateToken({ 
      userId: userId, 
      email: email, 
      isAdmin: false 
    });

    res.json({ 
      message: 'Registration successful', 
      user: {
        id: userId,
        email: email,
        profileCompleted: false
      },
      token: token
    });
  } catch (error) {
    console.error('❌ REGISTRATION ERROR:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Step 2: Complete Profile (Name, Phone, Address)
app.post('/api/auth/complete-profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    const userId = req.user.userId;
    
    // Validation
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    console.log('🔄 Completing profile for user:', userId);

    // First try to update the existing profile
    const { data: profileData, error: profileError } = await supabaseService
      .from('user_profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        address: address,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    console.log('Profile update result:', { success: !profileError, data: profileData, error: profileError });

    if (profileError) {
      console.error('Profile update error:', profileError);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    // Check if any data was returned (meaning the update was successful)
    if (!profileData || profileData.length === 0) {
      console.log('❌ No profile found to update');
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updatedProfile = profileData[0];

    res.json({ 
      message: 'Profile completed successfully', 
      user: {
        id: userId,
        email: req.user.email,
        firstName: updatedProfile.first_name,
        lastName: updatedProfile.last_name,
        phone: updatedProfile.phone,
        address: updatedProfile.address,
        profileCompleted: true
      }
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test endpoint for debugging registration issues
app.post('/api/auth/test-register', async (req, res) => {
  try {
    console.log('🧪 Test registration endpoint hit');
    console.log('Request body:', req.body);
    res.json({ message: 'Test endpoint working', body: req.body });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test endpoint error' });
  }
});

// Google OAuth Routes (Placeholder - requires Google OAuth setup)
app.get('/api/auth/google', (req, res) => {
  // TODO: Implement Google OAuth
  // For now, return a message indicating this feature is coming soon
  res.status(501).json({ 
    error: 'Google OAuth integration coming soon',
    message: 'Please use email/password registration for now' 
  });
});

app.get('/api/auth/google/callback', (req, res) => {
  // TODO: Implement Google OAuth callback
  res.status(501).json({ 
    error: 'Google OAuth integration coming soon' 
  });
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Simple bypass for email confirmation - get user directly from database
    console.log(`� Login attempt for: ${email}`);
    
    // Check if user exists in our profiles table (simpler approach)
    const { data: profile, error: profileError } = await supabaseService
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (!profile) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log(`✅ User profile found: ${profile.id}`);
    
    // Skip Supabase auth completely and just use profile data (bypasses email confirmation)
    const data = {
      user: {
        id: profile.id,
        email: profile.email
      }
    };

    // Profile is already loaded above

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
        address: profile?.address,
        profileCompleted: !!(profile?.first_name && profile?.last_name)
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

    // Normalize inputs and env (trim + email lowercase)
    const inputEmail = String(email || '').trim().toLowerCase();
    const inputPass = String(password || '').trim();
    const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminPass = String(process.env.ADMIN_PASSWORD || '').trim();

    // Check admin credentials (case-insensitive email, trimmed password)
    if (inputEmail === adminEmail && inputPass === adminPass) {
      const token = generateToken({ 
        userId: 'admin', 
        email: adminEmail, 
        isAdmin: true 
      });

      res.json({ 
        message: 'Admin login successful',
        admin: { email: adminEmail, role: 'admin' },
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
    console.log('👤 Fetching profile for user ID:', req.user.userId);
    
    // First, let's try to get the profile without .single() to see what we get
    const { data, error } = await supabaseService
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.userId);

    if (error) {
      console.error('❌ Profile fetch error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Profile query result:', { dataLength: data?.length, data });

    // Check if we have any data
    if (!data || data.length === 0) {
      console.log('❌ No profile found for user');
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Return the first profile found
    const profile = data[0];
    console.log('✅ Profile fetched successfully:', profile);
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update User Profile
app.put('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    
    const { data, error } = await supabaseService
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

// Change Password
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Get current user from auth.users
    const { data: userData, error: userError } = await supabaseService.auth.admin.getUserById(req.user.userId);
    
    if (userError) {
      return res.status(500).json({ error: 'Failed to get user data' });
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: currentPassword
    });

    if (signInError) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    const { error: updateError } = await supabaseService.auth.admin.updateUserById(req.user.userId, {
      password: newPassword
    });

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
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

// Setup Amenities (Manual endpoint)
app.post('/api/setup/amenities', async (req, res) => {
  try {
    // Clear existing amenities
    await supabaseService
      .from('amenities')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Add new amenities (without Gym, Function Hall, Tennis Court)
    const amenitiesData = [
      {
        name: 'Swimming Pool',
        description: 'Medium-sized pool with separate kids area. Max capacity: 25 people, ₱150 entrance fee per pax',
        capacity: 25,
        hourly_rate: 150,
        available_hours: '8:00 AM - 10:00 PM',
        image_url: '/src/assets/pool.jpg',
        is_active: true
      },
      {
        name: 'Basketball Court',
        description: 'A standard outdoor court with a mounted hoop, ideal for casual games or tournaments. Max capacity: 20 people, ₱1,000 (half day), ₱2,000 (full day)',
        capacity: 20,
        hourly_rate: 1000,
        available_hours: '8:00 AM - 10:00 PM',
        image_url: '/src/assets/basketball.jpg',
        is_active: true
      },
      {
        name: 'Clubhouse',
        description: 'Perfect for community events, parties, and gatherings. Max capacity: 50 people, ₱2,000 (half day), ₱3,500 (full day)',
        capacity: 50,
        hourly_rate: 2000,
        available_hours: '8:00 AM - 10:00 PM',
        image_url: '/src/assets/clubhouse.jpg',
        is_active: true
      },
      {
        name: 'Playground',
        description: 'Coming Soon.',
        capacity: 20,
        hourly_rate: 0,
        available_hours: 'Not Available',
        image_url: null,
        is_active: false
      }
    ];

    const { data, error } = await supabaseService
      .from('amenities')
      .insert(amenitiesData)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ 
      message: 'Amenities setup completed successfully', 
      count: data.length,
      amenities: data.map(a => `${a.name} (${a.is_active ? 'Available' : 'Not Available'})`)
    });
  } catch (error) {
    console.error('Setup amenities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Amenities
app.get('/api/amenities', async (req, res) => {
  try {
    console.log('🏢 Fetching amenities from database...');
    const { data, error } = await supabaseService
      .from('amenities')
      .select('*')
      .order('name');
    
    console.log('🏢 Amenities fetch result:', { 
      count: data?.length || 0, 
      data: data, 
      error: error?.message 
    });
    
    if (error) {
      console.error('❌ Amenities fetch error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get amenities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug: Check amenities in database
app.get('/api/debug/amenities', async (req, res) => {
  try {
    const { data, error } = await supabaseService
      .from('amenities')
      .select('*');
    
    console.log('🔍 Amenities in database:', data);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ amenities: data, count: data?.length || 0 });
  } catch (error) {
    console.error('Debug amenities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== BOOKINGS ROUTES =====

// Create Booking
app.post('/api/bookings', verifyToken, async (req, res) => {
  try {
    console.log('📥 Received booking request body:', JSON.stringify(req.body, null, 2));
    console.log('📥 User from token:', req.user);
    // Sanitize incoming body to avoid passing unsupported columns downstream
    try {
      delete req.body.number_of_guests;
      delete req.body.payment_status;
    } catch {}
    
    const {
      amenity_id,
      booking_date,
      start_time,
      end_time,
      // Accept legacy field name if present on the wire
      number_of_guests: legacy_guest_count,
      notes,
      status = 'pending'
    } = req.body;

    console.log('📋 Extracted fields:', {
      amenity_id,
      booking_date,
      start_time,
      end_time,
      number_of_guests: legacy_guest_count,
      notes,
      status,
      user_id: req.user.userId
    });

    // Check each field individually
    if (!amenity_id) {
      console.log('❌ Missing: amenity_id');
      return res.status(400).json({ error: 'Missing amenity_id' });
    }
    if (!booking_date) {
      console.log('❌ Missing: booking_date');
      return res.status(400).json({ error: 'Missing booking_date' });
    }
    if (!start_time) {
      console.log('❌ Missing: start_time');
      return res.status(400).json({ error: 'Missing start_time' });
    }
    if (!end_time) {
      console.log('❌ Missing: end_time');
      return res.status(400).json({ error: 'Missing end_time' });
    }
    // Derive amenity_type (name) from amenities table
    let amenity_type = 'Amenity';
    try {
      const { data: amenityData } = await supabaseService
        .from('amenities')
        .select('name')
        .eq('id', amenity_id)
        .single();
      if (amenityData?.name) amenity_type = amenityData.name;
    } catch {}

    // Derive resident name from user profile
    let resident_name = 'Resident';
    try {
      const { data: profile } = await supabaseService
        .from('user_profiles')
        .select('first_name,last_name,email')
        .eq('id', req.user.userId)
        .single();
      if (profile) {
        const fn = profile.first_name || '';
        const ln = profile.last_name || '';
        resident_name = (fn || ln) ? `${fn} ${ln}`.trim() : (profile.email || 'Resident');
      }
    } catch {}

    const insertPayload = {
      user_id: req.user.userId,
      amenity_id,
      amenity_type,
      booking_date,
      start_time,
      end_time,
      resident_name,
      purpose: notes?.slice(0, 255) || null,
      guest_count: Number(legacy_guest_count) || 1,
      status
    };
    console.log('🧾 Insert payload for bookings:', insertPayload);

    const { data: booking, error } = await supabaseService
      .from('bookings')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ Booking created successfully:', booking);
    res.status(201).json(booking);
  } catch (error) {
    console.error('❌ Create booking error:', error);
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
});

// Create Booking (new, strict payload) — avoids legacy fields entirely
app.post('/api/bookings/create', verifyToken, async (req, res) => {
  try {
    const { amenity_id, booking_date, start_time, end_time, guest_count = 1, purpose } = req.body || {};
    if (!amenity_id || !booking_date || !start_time || !end_time) {
      return res.status(400).json({ error: 'amenity_id, booking_date, start_time, end_time are required' });
    }

    // Resolve amenity name
    let amenity_type = 'Amenity';
    try {
      const { data: a } = await supabaseService.from('amenities').select('name').eq('id', amenity_id).single();
      if (a?.name) amenity_type = a.name;
    } catch {}

    // Resolve resident name
    let resident_name = 'Resident';
    try {
      const { data: p } = await supabaseService
        .from('user_profiles')
        .select('first_name,last_name,email')
        .eq('id', req.user.userId)
        .single();
      if (p) {
        const fn = p.first_name || '';
        const ln = p.last_name || '';
        resident_name = (fn || ln) ? `${fn} ${ln}`.trim() : (p.email || 'Resident');
      }
    } catch {}

    const payload = {
      user_id: req.user.userId,
      amenity_id,
      amenity_type,
      booking_date,
      start_time,
      end_time,
      resident_name,
      purpose: purpose || null,
      guest_count: Number(guest_count) || 1,
      status: 'pending'
    };

    console.log('🧾 [create] Insert payload:', payload);

    const { data, error } = await supabaseService
      .from('bookings')
      .insert(payload)
      .select()
      .single();
    if (error) {
      console.error('❌ [create] DB error:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (e) {
    console.error('❌ [create] exception:', e);
    res.status(500).json({ error: e.message || 'Failed to create booking' });
  }
});

// Get User Bookings
app.get('/api/bookings', verifyToken, async (req, res) => {
  try {
    const { status, amenity } = req.query;
    
    let query = supabaseService
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

// ===== PAYMENTS (GCash via PayMongo) =====
// Create GCash payment source and return checkout URL
app.post('/api/payments/gcash/create', verifyToken, async (req, res) => {
  try {
    const { amount, description, bookingId } = req.body || {};
    if (!amount || !bookingId) {
      return res.status(400).json({ error: 'amount and bookingId are required' });
    }

    const source = await paymongoCreateGCashSource({
      amount,
      description,
      bookingId,
      userId: req.user.userId
    });

    const sourceId = source?.data?.id;
    const checkoutUrl = source?.data?.attributes?.redirect?.checkout_url;
    const status = source?.data?.attributes?.status;

    return res.json({
      provider: 'paymongo',
      mode: PAYMONGO_MODE,
      sourceId,
      status,
      checkoutUrl
    });
  } catch (error) {
    console.error('Create GCash source error:', error?.response?.data || error.message);
    return res.status(500).json({ error: error?.response?.data?.errors?.[0]?.detail || 'Failed to create GCash payment' });
  }
});

// Verify payment status. If source is chargeable, attempt to create payment and mark booking paid
app.get('/api/payments/verify/:sourceId', verifyToken, async (req, res) => {
  try {
    const { sourceId } = req.params;
    if (!sourceId) return res.status(400).json({ error: 'sourceId is required' });

    const src = await paymongoGetSource(sourceId);
    const attr = src?.data?.attributes || {};
    const meta = attr?.metadata || {};
    const bookingId = meta.bookingId;
    const amount = attr.amount ? attr.amount / 100 : undefined;
    const description = meta.description || 'GCash Payment';

    // If chargeable, create a payment
    let paymentData = null;
    if (attr.status === 'chargeable') {
      try {
        paymentData = await paymongoCreatePaymentFromSource({ amount, sourceId, description });
      } catch (e) {
        // If already used/paid, ignore and proceed
        console.warn('Create payment warning:', e?.response?.data || e.message);
      }
    }

    // If we have bookingId and payment is successful (or already paid), update booking status
    const paidStatuses = ['paid', 'succeeded'];
    const paymentStatus = paymentData?.data?.attributes?.status || attr.status;
    if (bookingId && paidStatuses.includes(paymentStatus)) {
      try {
        await supabaseService
          .from('bookings')
          .update({ status: 'confirmed', updated_at: new Date().toISOString() })
          .eq('id', bookingId);
      } catch (dbErr) {
        console.warn('Booking payment_status update failed:', dbErr?.message || dbErr);
      }
    }

    return res.json({
      source: src?.data,
      payment: paymentData?.data || null,
      bookingId: bookingId || null,
      status: paymentStatus || attr.status
    });
  } catch (error) {
    console.error('Verify payment error:', error?.response?.data || error.message);
    return res.status(500).json({ error: error?.response?.data?.errors?.[0]?.detail || 'Failed to verify payment' });
  }
});

// ===== MANUAL GCASH PAYMENT =====
// Get GCash account details for manual payment
app.get('/api/payments/manual/gcash-info', verifyToken, async (req, res) => {
  try {
    const enabled = process.env.MANUAL_GCASH_ENABLED === 'true';
    if (!enabled) {
      return res.status(404).json({ error: 'Manual GCash payment not enabled' });
    }
    
    return res.json({
      accountName: process.env.GCASH_ACCOUNT_NAME || 'Grove Management',
      accountNumber: process.env.GCASH_ACCOUNT_NUMBER || '09123456789',
      instructions: [
        'Open your GCash app',
        'Select "Send Money"',
        'Enter the account number above',
        'Enter the payment amount',
        'Take a screenshot of the successful transaction',
        'Upload the screenshot below'
      ]
    });
  } catch (error) {
    console.error('Get GCash info error:', error);
    return res.status(500).json({ error: 'Failed to get GCash information' });
  }
});

// Upload proof of payment
app.post('/api/payments/manual/upload-proof', verifyToken, upload.single('proof'), async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const file = req.file;
    
    if (!bookingId || !amount || !file) {
      return res.status(400).json({ error: 'bookingId, amount, and proof image are required' });
    }

    // Upload to Supabase Storage
    const fileName = `payment-proofs/${bookingId}-${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabaseService.storage
      .from('gallery')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload proof of payment' });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseService.storage
      .from('gallery')
      .getPublicUrl(fileName);

    // Update booking with proof of payment
    const { data: booking, error: updateError } = await supabaseService
      .from('bookings')
      .update({ 
        payment_proof_url: publicUrl,
        payment_amount: Number(amount),
        status: 'pending_approval',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (updateError) {
      console.error('Update booking error:', updateError);
      return res.status(500).json({ error: 'Failed to update booking with proof' });
    }

    return res.json({
      success: true,
      booking,
      proofUrl: publicUrl,
      message: 'Proof of payment uploaded successfully. Waiting for admin approval.'
    });
  } catch (error) {
    console.error('Upload proof error:', error);
    return res.status(500).json({ error: 'Failed to process payment proof' });
  }
});

// Admin: Approve/Reject manual payment
app.post('/api/admin/payments/manual/review', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { bookingId, action, adminNotes } = req.body;
    
    if (!bookingId || !action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'bookingId and valid action (approve/reject) are required' });
    }

    const newStatus = action === 'approve' ? 'confirmed' : 'rejected';
    
    const { data, error } = await supabaseService
      .from('bookings')
      .update({ 
        status: newStatus,
        admin_notes: adminNotes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Review payment error:', error);
      return res.status(500).json({ error: 'Failed to review payment' });
    }

    return res.json({
      success: true,
      booking: data,
      message: `Payment ${action}d successfully`
    });
  } catch (error) {
    console.error('Review payment error:', error);
    return res.status(500).json({ error: 'Failed to review payment' });
  }
});

// Get All Bookings (Admin)
app.get('/api/admin/bookings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { 
      amenity = 'all', 
      status = 'all', 
      page = 1, 
      pageSize = 10,
      startDate,
      endDate 
    } = req.query;
    
    // Try to get bookings with user profile data
    // First attempt with foreign key, fallback to basic query if relationship doesn't exist
    let query = supabaseService
      .from('bookings')
      .select('*');
    
    // Filter by amenity
    if (amenity !== 'all') {
      query = query.eq('amenity_type', amenity);
    }
    
    // Filter by status
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    // Filter by date range
    if (startDate) {
      query = query.gte('booking_date', startDate);
    }
    if (endDate) {
      query = query.lte('booking_date', endDate);
    }
    
    // Get total count first
    const { count } = await supabaseService
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    // Apply pagination and ordering
    const offset = (page - 1) * pageSize;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Transform data to match admin UI expectations
    const transformedData = data.map(booking => ({
      id: booking.id,
      name: booking.resident_name || `User ${booking.user_id ? booking.user_id.slice(0, 8) : 'Unknown'}`,
      resident_name: booking.resident_name,
      amenity: booking.amenity_type,
      amenity_type: booking.amenity_type,
      date: booking.booking_date,
      booking_date: booking.booking_date,
      time: `${booking.start_time}-${booking.end_time}`,
      start_time: booking.start_time,
      end_time: booking.end_time,
      userType: 'Resident', // All users are residents in this system
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      address: booking.resident_address || 'N/A',
      contact: booking.mobile_number || 'N/A',
      email: booking.email || 'N/A',
      purpose: booking.purpose,
      attendees: booking.attendees || booking.guest_count,
      notes: booking.additional_notes || booking.notes || '--',
      payment_proof_url: booking.payment_proof_url,
      payment_amount: booking.payment_amount,
      admin_notes: booking.admin_notes,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }));
    
    res.json({
      data: transformedData,
      total: count || 0,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil((count || 0) / pageSize)
    });
  } catch (error) {
    console.error('Get admin bookings error:', error);
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
    
    const { data, error } = await supabaseService
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

// Simple bookings endpoint for admin amenities page  
app.get('/api/admin/amenities/bookings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching bookings for admin amenities page...');
    
    const { 
      amenity = 'all', 
      status = 'all', 
      page = 1, 
      pageSize = 10 
    } = req.query;
    
    // Simple query without foreign key relationships
    let query = supabaseService
      .from('bookings')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (amenity !== 'all') {
      query = query.eq('amenity_type', amenity);
    }
    
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    // Apply pagination and ordering
    const offset = (page - 1) * pageSize;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('❌ Admin amenities bookings error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    // Transform data for admin UI (simplified version)
    const transformedData = (data || []).map(booking => ({
      id: booking.id,
      name: booking.resident_name || 'Unknown User',
      amenity: booking.amenity_type || 'Unknown',
      date: booking.booking_date,
      time: booking.start_time && booking.end_time ? 
        `${booking.start_time}-${booking.end_time}` : 'TBD',
      userType: 'Resident',
      status: booking.status ? 
        booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending',
      address: booking.resident_address || 'N/A',
      contact: booking.mobile_number || 'N/A',
      email: booking.email || 'N/A',
      purpose: booking.purpose || 'General use',
      attendees: booking.attendees || booking.guest_count || 1,
      notes: booking.additional_notes || booking.notes || '--'
    }));
    
    console.log(`✅ Found ${count || 0} bookings, returning ${transformedData.length} on this page`);
    
    res.json({
      data: transformedData,
      total: count || 0,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil((count || 0) / pageSize)
    });
    
  } catch (error) {
    console.error('❌ Admin amenities bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// ===== GALLERY ROUTES =====

// Public: List gallery images
app.get('/api/gallery', async (req, res) => {
  try {
    await ensureGalleryBucket();

    const { data, error } = await supabaseService
      .storage
      .from(GALLERY_BUCKET)
      .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const items = (data || []).filter(f => f && f.name).map(f => {
      const pub = supabaseService.storage.from(GALLERY_BUCKET).getPublicUrl(f.name);
      return {
        id: f.name, // use storage path as id
        name: f.name,
        url: pub?.data?.publicUrl,
        created_at: f.created_at,
        updated_at: f.updated_at,
        metadata: f.metadata || null
      };
    });

    res.json(items);
  } catch (error) {
    console.error('List gallery error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Upload image to gallery (multipart/form-data; field: file)
app.post('/api/admin/gallery/upload', verifyToken, verifyAdmin, upload.single('file'), async (req, res) => {
  try {
    await ensureGalleryBucket();

    if (!req.file) {
      return res.status(400).json({ error: 'file is required' });
    }

    if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image uploads are allowed' });
    }

    const objectPath = makeObjectPath(req.file.originalname);

    const { data, error } = await supabaseService
      .storage
      .from(GALLERY_BUCKET)
      .upload(objectPath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const pub = supabaseService.storage.from(GALLERY_BUCKET).getPublicUrl(data.path);

    return res.json({
      message: 'Image uploaded successfully',
      item: {
        id: data.path,
        name: path.basename(data.path),
        url: pub?.data?.publicUrl
      }
    });
  } catch (error) {
    console.error('Upload gallery image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete image by id (id is the storage path; URL-encode when calling)
app.delete('/api/admin/gallery/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id || '');
    if (!id) {
      return res.status(400).json({ error: 'id (storage path) is required' });
    }

    const { data, error } = await supabaseService
      .storage
      .from(GALLERY_BUCKET)
      .remove([id]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Image deleted successfully', data });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

app.listen(PORT, async () => {
  console.log(`🌳 Grove Enhanced Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Admin login: Use ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
  
  // Initialize amenities data
  await initializeAmenities();
  
  // Initialize database tables
  await initializeTables();
});