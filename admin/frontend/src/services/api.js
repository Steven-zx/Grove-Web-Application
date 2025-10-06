// API Service for Admin Frontend

const API_BASE_URL = 'http://localhost:3000/api';

// Authentication
let authToken = null;

// Initialize auth token from localStorage
function initializeAuth() {
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('adminToken');
    console.log('🔐 Auth initialized, token present:', !!authToken);
  }
}

// Initialize on module load
initializeAuth();

// API request wrapper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Refresh token before each request
  if (!authToken && typeof window !== 'undefined') {
    authToken = localStorage.getItem('adminToken');
  }
  
  if (authToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    console.log(`🔗 API Request: ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ API Response:`, data);
    
    return data;
  } catch (error) {
    console.error(`❌ API Error for ${endpoint}:`, error);
    throw error;
  }
}

// Authentication Services
export const authService = {
  async login(credentials) {
    const response = await apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      authToken = response.token;
      localStorage.setItem('adminToken', authToken);
    }
    
    return response;
  },

  logout() {
    authToken = null;
    localStorage.removeItem('adminToken');
  },

  isAuthenticated() {
    // Always read from localStorage to avoid stale memory state after reload
    if (typeof window !== 'undefined') {
      authToken = localStorage.getItem('adminToken');
    }
    const present = !!authToken;
    console.log('🔍 Checking auth status, token present:', present);
    return present;
  },
  getToken() {
    if (typeof window !== 'undefined') {
      authToken = localStorage.getItem('adminToken');
    }
    return authToken;
  }
};

// Announcement Services
export const announcementService = {
  async getAll() {
    // Public read in main app; in admin we still attach token if present
    initializeAuth();
    return await apiRequest('/announcements');
  },

  async create(announcementData) {
    // Admin-only: must be authenticated
    initializeAuth();
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    return await apiRequest('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  },

  async update(id, announcementData) {
    return await apiRequest(`/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  },

  async delete(id) {
    // Admin-only: must be authenticated
    initializeAuth();
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    return await apiRequest(`/admin/announcements/${id}`, {
      method: 'DELETE',
    });
  },
};

// Gallery Services
export const galleryService = {
  async list() {
    return await apiRequest('/gallery');
  },

  async upload(file) {
    initializeAuth();
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    const url = `${API_BASE_URL}/admin/gallery/upload`;
    const formData = new FormData();
    formData.append('file', file);

    const headers = {};
    // Authorization header for multipart goes in fetch config, not on formData
    const token = authService.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return await res.json();
  },

  async remove(id) {
    initializeAuth();
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    return await apiRequest(`/admin/gallery/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};

// Utility function to format announcements for the admin UI
export function formatAnnouncementForAdmin(announcement) {
  return {
    id: announcement.id,
    title: announcement.title,
    author: 'Admin',
    date: announcement.created_at,
    details: announcement.description,
    category: announcement.category || 'General',
    importance: announcement.importance || 'Medium',
    image_url: announcement.image_url,
    status: '', // Can be used for scheduled posts
  };
}

// Utility function to format form data for backend
export function formatAnnouncementForBackend(formData) {
  return {
    title: formData.title,
    description: formData.details,
    category: formData.category || 'General',
    importance: 'Medium', // Default importance
    image_url: formData.image_url || null,
  };
}