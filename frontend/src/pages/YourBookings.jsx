import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InfoCard from '../components/shared/InfoCard';
import CalendarWidget from '../components/CalendarWidget';
import GeneralBookingConditions from '../components/GeneralBookingConditions';
import bookingService from "../services/bookingService";
import PaymentService from "../services/paymentService";
import clubhouseImg from '../assets/clubhouse.png';
import poolImg from '../assets/pool.png';
import courtImg from '../assets/court.png';
import playgroundImg from '../assets/playground.png';

// PLACEHOLDER: Amenity images mapping - Backend-ready for API integration
const amenityImages = {
  1: clubhouseImg,
  2: poolImg, 
  3: courtImg,
  4: playgroundImg,
  'Clubhouse': clubhouseImg,
  'Swimming Pool': poolImg,
  'Basketball Court': courtImg,
  'Playground': playgroundImg
};

export default function YourBookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const userBookings = await bookingService.getUserBookings();
      
      // Transform API data to match UI expectations
      const transformedBookings = userBookings.map(booking => ({
        id: booking.id,
        amenityId: booking.amenity_id,
        amenityName: booking.amenity_type,
        firstName: booking.resident_name?.split(' ')[0] || '',
        lastName: booking.resident_name?.split(' ').slice(1).join(' ') || '',
        date: booking.booking_date,
        selectDate: booking.booking_date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        purpose: booking.purpose,
        attendees: booking.guest_count,
        status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
        createdAt: booking.created_at
      }));
      
      setBookings(transformedBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on query
  const filteredBookings = bookings.filter(b =>
    !query ||
    (b.amenityName || "").toLowerCase().includes(query.toLowerCase()) ||
    (b.purpose || "").toLowerCase().includes(query.toLowerCase())
  );

  const handlePayNow = async (booking) => {
    try {
      // Calculate amount based on amenity (you can improve this logic)
      const amount = booking.payment_amount || 1000;
      
      // Redirect to manual GCash payment page
      navigate(`/payment/manual-gcash?bookingId=${booking.id}&amount=${amount}`);
    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to initiate payment: ' + err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      // Refresh the bookings list
      await loadBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking: ' + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking record?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking deleted successfully');
      await loadBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    let date = typeof dateString === 'string' && dateString.includes('-') 
      ? new Date(dateString + 'T00:00:00') 
      : new Date(dateString);
    
    return isNaN(date.getTime()) ? 'No Date' : date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Invalid Time';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return 'Invalid Time';
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const getStatusMessage = (status) => {
    const messages = {
      'pending': 'Waiting for payment',
      'pending_approval': 'Payment submitted - Awaiting admin approval',
      'confirmed': 'Booking confirmed! You\'re all set ✨',
      'rejected': 'Payment was not approved 😔',
      'cancelled': 'Booking cancelled'
    };
    return messages[status?.toLowerCase()] || 'Status unknown';
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    const colors = {
      'confirmed': 'bg-emerald-50 border-emerald-200 text-emerald-700',
      'pending': 'bg-amber-50 border-amber-200 text-amber-700',
      'pending_approval': 'bg-blue-50 border-blue-200 text-blue-700',
      'rejected': 'bg-rose-50 border-rose-200 text-rose-700',
      'cancelled': 'bg-gray-50 border-gray-200 text-gray-700'
    };
    return colors[statusLower] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getStatusDot = (status) => {
    const statusLower = status?.toLowerCase();
    const dots = {
      'confirmed': 'bg-emerald-500',
      'pending': 'bg-amber-400',
      'pending_approval': 'bg-blue-500',
      'rejected': 'bg-rose-500',
      'cancelled': 'bg-gray-500'
    };
    return dots[statusLower] || 'bg-gray-500';
  };



  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {/* Main Content */}
      <div className="flex-1 ml-12 py-6 px-6">
        {/* Header Buttons */}
        <div className="flex justify-start gap-4 mb-8">
          <button
            onClick={() => navigate('/amenities')}
            className="bg-white text-black px-6 py-2 rounded-[10px] border border-[#D9D9D9] font-normal text-sm hover:bg-gray-50 transition-colors"
          >
            Book Amenity
          </button>
          <button className="bg-[#40863A] text-white px-6 py-2 rounded-[10px] font-medium text-sm">
            Your Bookings
          </button>
        </div>

        {/* Bookings Content */}
        <div className="max-w-[720px]">
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h3 className="text-xl font-semibold text-red-600 mb-3">Error Loading Bookings</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={loadBookings}
                className="bg-[#40863A] text-white px-6 py-2 rounded-xl font-medium text-sm"
              >
                Try Again
              </button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet...</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                You haven't made any amenity bookings yet. Browse available amenities and make your first booking!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                      <img 
                        src={amenityImages[booking.amenityId] || amenityImages[booking.amenityName] || clubhouseImg} 
                        alt={booking.amenityName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{booking.amenityName}</h3>

                      <div className={`px-3 py-2 rounded-full border ${getStatusColor(booking.status)} mb-4 text-center`}>
                        <div className="flex items-center justify-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusDot(booking.status)}`}></div>
                          <span className="text-xs font-medium capitalize">
                            {booking.status.toLowerCase() === 'pending_approval' ? 'Pending Approval' : booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-700 text-center">{getStatusMessage(booking.status)}</p>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {formatDate(booking.date)} • {formatTimeRange(booking.startTime, booking.endTime)}
                          </p>
                        </div>
                      </div>

                      {booking.status.toLowerCase() === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePayNow(booking)}
                            className="flex-1 bg-[#40863A] text-white text-sm font-medium py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span>Pay Now</span>
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="flex-1 text-rose-600 hover:text-rose-700 text-sm font-medium hover:bg-gray-50 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                      {(booking.status === 'Confirmed' || booking.status === 'Pending_approval') && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="w-full text-rose-600 hover:text-rose-700 text-sm font-medium hover:bg-gray-50 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-[720px] mt-8">
          <GeneralBookingConditions />
        </div>
      </div>

      <div className="fixed w-80 bg-white overflow-y-auto p-6" style={{ right: '100px', top: '54px', height: 'calc(100vh - 54px)' }}>
        <div className="mb-6 w-full max-w-xs">
          <InfoCard title="Notice" className="h-32">
            <p className="text-xs leading-relaxed">
              Amenities are available all-week long!
            </p>
          </InfoCard>
        </div>
        <CalendarWidget />
      </div>
    </div>
  );
}
