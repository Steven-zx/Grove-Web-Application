// services/bookingService.js
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

console.log('🔗 Booking API configured:', API_URL);

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
    // Normalize to backend's strict create endpoint payload
    const payload = {
      amenity_id: data.amenity_id,
      booking_date: data.booking_date,
      start_time: data.start_time,
      end_time: data.end_time,
      guest_count: data.number_of_guests || data.guest_count || 1,
      purpose: data.notes || data.purpose || null
    };
    
    return apiRequest('/api/bookings/create', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  
  async getUserBookings() {
    return apiRequest('/api/bookings');
  },
  
  async cancelBooking(bookingId) {
    return apiRequest(`/api/bookings/${bookingId}/cancel`, { method: 'PUT' });
  }
};

export default bookingService;