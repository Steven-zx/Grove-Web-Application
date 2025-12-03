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

// Utility function to clear expired tokens on app load
export function clearExpiredTokens() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token && authService.isTokenExpired(token)) {
      console.warn('🧹 Clearing expired admin token');
      authService.logout();
      return true; // Token was expired and cleared
    }
  }
  return false; // Token was valid or not present
}

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

  // Always refresh token from localStorage before each request
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('adminToken');
  }
  
  if (authToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    console.log(`🔗 API Request: ${config.method || 'GET'} ${url}`);
    console.log(`🔐 Using token: ${authToken ? 'Present' : 'Missing'}`);
    console.log(`📋 Headers:`, config.headers);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error Response: ${response.status} - ${errorText}`);
      
      // If we get 401 or 403, the token might be invalid
      if (response.status === 401 || response.status === 403) {
        console.warn('🔒 Authentication failed, clearing stored token');
        authService.logout();
      }
      
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
    
    // Simple token expiry check - if token looks invalid, clear it
    if (authToken && this.isTokenExpired(authToken)) {
      console.warn('🕒 Token appears to be expired, clearing');
      this.logout();
      return false;
    }
    
    return present;
  },
  getToken() {
    if (typeof window !== 'undefined') {
      authToken = localStorage.getItem('adminToken');
    }
    return authToken;
  },
  
  isTokenExpired(token) {
    try {
      if (!token) return true;
      
      // Decode JWT payload (simple base64 decode, no verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired (with 5 minute buffer)
      return payload.exp && payload.exp < (currentTime + 300);
    } catch (error) {
      console.error('❌ Error checking token expiry:', error);
      return true; // If we can't parse it, consider it invalid
    }
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
    console.log('🗑️ Attempting to delete announcement:', id);
    
    if (!authService.isAuthenticated()) {
      console.error('❌ Not authenticated for delete operation');
      throw new Error('User not authenticated - please log in again');
    }
    
    console.log('✅ Authentication check passed, proceeding with delete');
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

  async upload(file, opts = {}) {
    initializeAuth();
    if (!authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    const url = `${API_BASE_URL}/admin/gallery/upload`;
    const formData = new FormData();
    formData.append('file', file);
    if (opts.category) {
      formData.append('category', opts.category);
    }

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
    // id must be URL-encoded; backend expects storage path
    return await apiRequest(`/admin/gallery/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};

// Concerns/Reports Services (admin)
export const concernsService = {
  async list(params = {}) {
    initializeAuth();
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/admin/concerns?${query}` : '/admin/concerns';
    return await apiRequest(endpoint);
  },
  async updateStatus(id, status) {
    initializeAuth();
    return await apiRequest(`/admin/concerns/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
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