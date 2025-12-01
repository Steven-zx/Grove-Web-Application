import { useState, useEffect } from 'react';
import api from '../services/api';

const PaymentReview = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/bookings?status=pending_approval');
      setPendingPayments(response.data.bookings || response.data);
    } catch (err) {
      console.error('Failed to fetch pending payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (bookingId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this payment?`)) {
      return;
    }

    setProcessing(true);
    try {
      await api.post('/api/admin/payments/manual/review', {
        bookingId,
        action,
        adminNotes: reviewNotes
      });

      alert(`Payment ${action}d successfully!`);
      setSelectedBooking(null);
      setReviewNotes('');
      fetchPendingPayments();
    } catch (err) {
      alert(err.response?.data?.error || `Failed to ${action} payment`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p>Loading pending payments...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manual Payment Review</h1>

      {pendingPayments.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No pending payments to review</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingPayments.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{booking.resident_name || 'Unknown User'}</h3>
                  <p className="text-sm text-gray-600">Booking ID: {booking.id.slice(0, 8)}...</p>
                  <p className="text-sm text-gray-600">Amenity: {booking.amenity_type}</p>
                  <p className="text-sm text-gray-600">Date: {booking.booking_date}</p>
                  <p className="text-sm text-gray-600">Time: {booking.start_time} - {booking.end_time}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">₱{booking.payment_amount?.toLocaleString() || 'N/A'}</p>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full mt-2">
                    Pending Review
                  </span>
                </div>
              </div>

              {booking.payment_proof_url && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Proof of Payment:</p>
                  <img 
                    src={booking.payment_proof_url} 
                    alt="Proof of payment" 
                    className="max-w-md h-auto rounded-lg border cursor-pointer hover:opacity-90"
                    onClick={() => window.open(booking.payment_proof_url, '_blank')}
                  />
                  <p className="text-xs text-gray-500 mt-1">Click to view full size</p>
                </div>
              )}

              {selectedBooking === booking.id ? (
                <div className="border-t pt-4 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                    rows="3"
                    placeholder="Add notes about this payment review..."
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(booking.id, 'approve')}
                      disabled={processing}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                      {processing ? 'Processing...' : 'Approve Payment'}
                    </button>
                    <button
                      onClick={() => handleReview(booking.id, 'reject')}
                      disabled={processing}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
                    >
                      {processing ? 'Processing...' : 'Reject Payment'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBooking(null);
                        setReviewNotes('');
                      }}
                      disabled={processing}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedBooking(booking.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
                >
                  Review Payment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentReview;
