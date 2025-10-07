// services/bookingService.js
const API_BASE_URL = 'http://localhost:3000';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('🔑 Getting auth token:', token ? 'Found' : 'Not found');
  return token;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🌐 API Request:', endpoint, 'Token:', token ? 'Present' : 'Missing');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Booking service functions
export const bookingService = {
  // Create a new booking
  async createBooking(bookingData) {
    return await apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        amenity_id: bookingData.amenityId,
        amenity_name: bookingData.amenityName,
        booking_date: bookingData.selectDate,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
        purpose: bookingData.purpose,
        guest_count: parseInt(bookingData.attendees) || 1,
        notes: bookingData.additionalNotes || null
      }),
    });
  },

  // Get user's bookings
  async getUserBookings(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.amenity) params.append('amenity', filters.amenity);
    
    const endpoint = `/api/bookings${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },

  // Cancel a booking
  async cancelBooking(bookingId) {
    return await apiRequest(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },

  // Get calendar bookings (public - no auth needed)
  async getCalendarBookings(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.amenity) params.append('amenity', filters.amenity);
    
    const endpoint = `/api/bookings/calendar${params.toString() ? `?${params.toString()}` : ''}`;
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Calendar bookings request failed:', error);
      throw error;
    }
  }
};

export default bookingService;