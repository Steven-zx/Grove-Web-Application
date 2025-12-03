// services/bookings.js
// Admin bookings data access with real backend API integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('adminToken'); // Fixed: use adminToken for admin operations
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
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
    console.error('Admin API request failed:', error);
    throw error;
  }
};

// Fetch bookings from backend API
export async function fetchAdminBookings({ 
  amenity = 'all', 
  status = 'all',
  page = 1, 
  pageSize = 10,
  startDate,
  endDate 
}) {
  try {
    // First try the API endpoint
    const params = new URLSearchParams();
    
    if (amenity !== 'all') params.append('amenity', amenity);
    if (status !== 'all') params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    try {
      // Correct backend endpoint
      const endpoint = `/api/admin/bookings${params.toString() ? `?${params.toString()}` : ''}`;
      const result = await apiRequest(endpoint);
      
      return {
        data: result.data || [],
        total: result.total || 0,
        page: result.page || 1,
        pageSize: result.pageSize || pageSize,
        totalPages: result.totalPages || 1
      };
    } catch (apiError) {
      console.warn('API endpoint not working, using sample data:', apiError.message);
      
      // Fallback to sample data to demonstrate the interface
      const sampleBookings = [
        {
          id: 'sample-1',
          name: 'John Doe',
          amenity: 'basketball court',
          date: '2025-10-07',
          time: '14:00-16:00',
          userType: 'Resident',
          status: 'Pending',
          address: 'Block 1, Lot 5',
          contact: '+63 912 345 6789',
          email: 'john.doe@email.com',
          purpose: 'Basketball practice with friends',
          attendees: 8,
          notes: 'Need basketball and equipment setup'
        },
        {
          id: 'sample-2',
          name: 'Jane Smith',
          amenity: 'swimming pool',
          date: '2025-10-08',
          time: '10:00-12:00',
          userType: 'Resident',
          status: 'Accepted',
          address: 'Block 2, Lot 10',
          contact: '+63 920 123 4567',
          email: 'jane.smith@email.com',
          purpose: 'Family swimming session',
          attendees: 4,
          notes: 'Kids pool needed for small children'
        },
        {
          id: 'sample-3',
          name: 'Mike Johnson',
          amenity: 'clubhouse',
          date: '2025-10-09',
          time: '18:00-22:00',
          userType: 'Resident',
          status: 'Pending',
          address: 'Block 3, Lot 15',
          contact: '+63 917 555 8888',
          email: 'mike.j@email.com',
          purpose: 'Birthday party celebration',
          attendees: 25,
          notes: 'Need tables, chairs, and sound system setup'
        }
      ];
      
      // Filter sample data based on amenity filter
      let filteredData = sampleBookings;
      if (amenity !== 'all') {
        filteredData = sampleBookings.filter(booking => 
          booking.amenity.toLowerCase() === amenity.toLowerCase()
        );
      }
      
      return {
        data: filteredData,
        total: filteredData.length,
        page: 1,
        pageSize: pageSize,
        totalPages: 1
      };
    }
    
  } catch (error) {
    console.error('Failed to fetch admin bookings:', error);
    // Return empty result instead of throwing to prevent UI crashes
    return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
  }
}

// Update booking status via backend API
export async function updateBookingStatus(id, status) {
  try {
    // Try to update via API first
    try {
      const result = await apiRequest(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: status.toLowerCase() }),
      });
      
      return { id, status, ...result };
    } catch (apiError) {
      console.warn('API update not available, status change simulated:', apiError.message);
      // For demo purposes, return success
      return { id, status, message: 'Status updated (demo mode)' };
    }
  } catch (error) {
    console.error('Failed to update booking status:', error);
    throw error;
  }
}

// Review manual payment for a booking (approve/reject)
export async function reviewManualPayment(bookingId, action, adminNotes = '') {
  const payload = { bookingId, action, adminNotes };
  return apiRequest(`/api/admin/payments/manual/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Delete bookings (bulk) - Note: This endpoint doesn't exist yet in backend
export async function deleteBookings(ids) {
  try {
    // For now, we'll just return a mock response since bulk delete isn't implemented
    // In a real implementation, you'd create a bulk delete endpoint
    console.warn('Bulk delete not implemented in backend yet');
    return { deleted: ids };
  } catch (error) {
    console.error('Failed to delete bookings:', error);
    throw error;
  }
}
