// services/bookingService.js
const API_URL = 'http://localhost:3000';

function getAuthToken() {
  const token = localStorage.getItem('token');
  console.log('🔑 Getting auth token:', token ? 'Found' : 'Not found');
  return token;
}

async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  console.log('🌐 API Request:', endpoint, 'Token:', token ? 'Present' : 'Missing');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Parse the body if it's a string to log it
  if (options.body) {
    try {
      const bodyData = JSON.parse(options.body);
      console.log('📦 Request body being sent:', bodyData);
    } catch (e) {
      console.log('📦 Request body (raw):', options.body);
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('Invalid or expired token');
  }

  if (!res.ok) {
    let msg = 'Request failed';
    try { 
      const errorData = await res.json();
      console.error('❌ API Error:', errorData);
      msg = errorData.error || msg; 
    } catch {}
    throw new Error(msg);
  }
  
  return res.json();
}

const bookingService = {
  async getAmenities() {
    return apiRequest('/api/amenities');
  },
  
  async createBooking(data) {
    console.log('🎯 bookingService.createBooking called with:', data);
    
    // Ensure amenity_id is included
    if (!data.amenity_id) {
      console.error('❌ amenity_id is missing from booking data!');
      throw new Error('Amenity ID is required');
    }
    
    return apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async getUserBookings() {
    return apiRequest('/api/bookings/user');
  },
  
  async cancelBooking(bookingId) {
    return apiRequest(`/api/bookings/${bookingId}/cancel`, { method: 'PUT' });
  }
};

export default bookingService;