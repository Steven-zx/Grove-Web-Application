// services/authService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Debug: Log the API URL configuration
console.log('🔗 User Auth API configured:', {
  baseUrl: API_BASE_URL,
  envVar: import.meta.env.VITE_API_BASE_URL,
  mode: import.meta.env.MODE
});

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async login(credentials) {
    try {
      console.log('🔐 Attempting login with:', credentials.email);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('📄 Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('✅ Token stored:', data.token ? 'Yes' : 'No');
      console.log('✅ User stored:', data.user ? 'Yes' : 'No');

      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      console.log('🔐 Attempting registration with:', userData.email);
      
      // First test connectivity with test endpoint
      console.log('🧪 Testing backend connectivity...');
      const testResponse = await fetch(`${API_BASE_URL}/api/auth/test-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const testData = await testResponse.json();
      console.log('🧪 Test response:', testData);
      
      // Now try actual registration
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('📄 Registration response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user data after initial registration
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('✅ Token stored after registration:', data.token ? 'Yes' : 'No');

      return data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  async completeProfile(profileData) {
    try {
      console.log('📝 Completing profile for user');
      const response = await fetch(`${API_BASE_URL}/api/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      console.log('📄 Profile completion response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Profile completion failed');
      }

      // Update stored user data
      this.user = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('✅ User profile updated');

      return data;
    } catch (error) {
      console.error('❌ Profile completion error:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  // Update user data (e.g., after profile updates)
  updateUser(userData) {
    this.user = { ...this.user, ...userData };
    localStorage.setItem('user', JSON.stringify(this.user));
  }
}

export const authService = new AuthService();
export default authService;