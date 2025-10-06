import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Mail, Users } from 'lucide-react';
import { fetchAdminBookings, updateBookingStatus } from '../services/bookings';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    amenity: 'all',
    status: 'all',
    page: 1,
    pageSize: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  // Fetch bookings when component mounts or filters change
  useEffect(() => {
    loadBookings();
  }, [filters]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchAdminBookings(filters);
      setBookings(result.data);
      setTotalPages(result.totalPages || 0);
      setTotal(result.total || 0);
    } catch (err) {
      setError('Failed to load bookings: ' + err.message);
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Refresh the bookings list
      await loadBookings();
      alert('Booking status updated successfully!');
    } catch (err) {
      alert('Failed to update booking status: ' + err.message);
      console.error('Error updating booking status:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
        <div className="text-sm text-gray-600">
          Total Bookings: {total}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Amenity
            </label>
            <select
              value={filters.amenity}
              onChange={(e) => handleFilterChange('amenity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Amenities</option>
              <option value="Swimming Pool">Swimming Pool</option>
              <option value="Clubhouse">Clubhouse</option>
              <option value="Basketball Court">Basketball Court</option>
              <option value="Playground">Playground</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Results per page
            </label>
            <select
              value={filters.pageSize}
              onChange={(e) => handleFilterChange('pageSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={loadBookings}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No bookings found with the current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.name}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{booking.amenity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{booking.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{booking.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{booking.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Purpose:</span>
                      <span className="ml-2 text-gray-600">{booking.purpose}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span className="font-medium text-gray-700">Attendees:</span>
                      <span className="ml-1 text-gray-600">{booking.attendees}</span>
                    </div>
                  </div>
                  {booking.notes && booking.notes !== '--' && (
                    <div className="mt-3">
                      <span className="font-medium text-gray-700">Notes:</span>
                      <p className="mt-1 text-gray-600">{booking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {booking.status.toLowerCase() === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
                
                {booking.status.toLowerCase() === 'confirmed' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Page {filters.page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= totalPages}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}