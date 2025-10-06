// services/bookings.js
// Admin bookings data access with real backend API integration
const API_BASE_URL = 'http://localhost:3000';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
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
    const params = new URLSearchParams();
    
    if (amenity !== 'all') params.append('amenity', amenity);
    if (status !== 'all') params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    const endpoint = `/api/admin/bookings${params.toString() ? `?${params.toString()}` : ''}`;
    const result = await apiRequest(endpoint);
    
    return {
      data: result.data || [],
      total: result.total || 0,
      page: result.page || 1,
      pageSize: result.pageSize || pageSize,
      totalPages: result.totalPages || 1
    };
  } catch (error) {
    console.error('Failed to fetch admin bookings:', error);
    // Return empty result instead of throwing to prevent UI crashes
    return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
  }
}

// Update booking status via backend API
export async function updateBookingStatus(id, status) {
  try {
    const result = await apiRequest(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: status.toLowerCase() }),
    });
    
    return { id, status, ...result };
  } catch (error) {
    console.error('Failed to update booking status:', error);
    throw error;
  }
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
