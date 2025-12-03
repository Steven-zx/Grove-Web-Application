import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { fetchAdminBookings, reviewManualPayment } from '../services/bookings';

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

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const openFullScreen = (booking) => {
    console.log('Opening full screen for:', booking);
    setSelectedBooking(booking);
    setReviewNotes('');
  };

  const closeFullScreen = () => {
    setSelectedBooking(null);
    setReviewNotes('');
  };

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

  const handlePaymentReview = async (bookingId, action) => {
    try {
      setReviewLoading(true);
      const result = await reviewManualPayment(bookingId, action, reviewNotes);
      
      // Reload bookings to get updated data from server
      await loadBookings();
      
      // Update the selected booking with new status
      if (result.booking) {
        setSelectedBooking(result.booking);
      }
      
      // Clear review notes
      setReviewNotes('');
      
      // Close the modal
      closeFullScreen();
      
      alert(`Payment ${action}d successfully!`);
    } catch (err) {
      alert(err.message || `Failed to ${action} payment`);
      console.error('Payment review error:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              onClick={() => setFilters((prev) => ({ ...prev, status: 'pending_approval', page: 1 }))}
            >
              Pending Approval
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={() => setFilters((prev) => ({ ...prev, status: 'all', page: 1 }))}
            >
              Reset Status
            </button>
          </div>
        </div>
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
              <option value="pending_approval">Pending Approval</option>
              <option value="accepted">Accepted</option>
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
              <div
                key={booking.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-green-500"
                role="button"
                tabIndex={0}
                onClick={() => openFullScreen(booking)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFullScreen(booking); }}}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
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
                    {booking.payment_proof_url && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                          Payment Proof
                        </span>
                        <span className="text-gray-700">Amount: ₱{booking.payment_amount?.toLocaleString() || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex items-center text-gray-400">
                    <ChevronRight size={24} />
                  </div>
                </div>
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

      {/* Full Screen Overlay */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50" onClick={closeFullScreen}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="min-h-screen flex items-start justify-center p-4">
              <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full my-8">
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                      <p className="text-sm text-gray-600 mt-1">Click anywhere outside to close</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(selectedBooking.status)}
                      <button
                        type="button"
                        onClick={closeFullScreen}
                        className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">Amenity</div>
                      <div className="font-medium text-gray-900">{selectedBooking.amenity}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">Date</div>
                      <div className="font-medium text-gray-900">{formatDate(selectedBooking.date)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">Time</div>
                      <div className="font-medium text-gray-900">{selectedBooking.time}</div>
                    </div>
                  </div>

                  {/* Booker Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booker Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Name</div>
                        <div className="font-medium text-gray-900">{selectedBooking.name || '—'}</div>
                      </div>
                      <div className="bg-white border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Email</div>
                        <div className="font-medium text-gray-900">{selectedBooking.email || '—'}</div>
                      </div>
                      <div className="bg-white border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Contact</div>
                        <div className="font-medium text-gray-900">{selectedBooking.contact || '—'}</div>
                      </div>
                      <div className="bg-white border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Address</div>
                        <div className="font-medium text-gray-900">{selectedBooking.address || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Confirmation */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Payment Confirmation</h3>
                      <div className="text-sm text-gray-600">
                        Amount: <span className="font-semibold text-gray-900">₱{selectedBooking.payment_amount?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="border rounded-lg overflow-hidden bg-gray-50">
                          {selectedBooking.payment_proof_url ? (
                            <img
                              src={selectedBooking.payment_proof_url}
                              alt="Payment Proof"
                              className="w-full h-[420px] object-contain bg-white"
                            />
                          ) : (
                            <div className="h-[420px] flex items-center justify-center text-gray-500">
                              No payment proof uploaded
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <div className="bg-white border rounded-lg p-4">
                          <div className="text-sm text-gray-600 mb-2">Admin Notes</div>
                          <textarea
                            rows={6}
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="Optional notes about your decision"
                          />
                          {selectedBooking.status.toLowerCase() === 'pending_approval' ? (
                            <div className="mt-4 flex flex-col gap-2">
                              <button
                                type="button"
                                disabled={reviewLoading}
                                onClick={(e) => { e.stopPropagation(); handlePaymentReview(selectedBooking.id, 'approve'); }}
                                className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                              >
                                {reviewLoading ? 'Processing...' : 'Approve Payment'}
                              </button>
                              <button
                                type="button"
                                disabled={reviewLoading}
                                onClick={(e) => { e.stopPropagation(); handlePaymentReview(selectedBooking.id, 'reject'); }}
                                className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                              >
                                {reviewLoading ? 'Processing...' : 'Reject Payment'}
                              </button>
                            </div>
                          ) : (
                            <div className="mt-4 text-sm text-gray-600">
                              Payment review actions are available when status is <span className="font-medium">pending_approval</span>.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeFullScreen}
                      className="inline-flex items-center px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
