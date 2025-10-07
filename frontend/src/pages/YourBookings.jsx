import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../components/shared/InfoCard';
import CalendarWidget from '../components/CalendarWidget';
import GeneralConditions from '../components/GeneralConditions';
import { bookingService } from '../services/bookingService';
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
      'Pending': 'Waiting for admin approval',
      'Confirmed': 'Booking confirmed! You\'re all set ✨',
      'Rejected': 'Booking was not approved 😔',
      'Cancelled': 'Booking cancelled'
    };
    return messages[status] || 'Status unknown';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-emerald-50 border-emerald-200 text-emerald-700',
      'Pending': 'bg-gray-50 border-gray-200 text-gray-700',
      'Rejected': 'bg-rose-50 border-rose-200 text-rose-700',
      'Cancelled': 'bg-gray-50 border-gray-200 text-gray-700'
    };
    return colors[status] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getStatusDot = (status) => {
    const dots = {
      'Confirmed': 'bg-emerald-500',
      'Pending': 'bg-gray-400',
      'Rejected': 'bg-rose-500',
      'Cancelled': 'bg-gray-500'
    };
    return dots[status] || 'bg-gray-500';
  };

  // PLACEHOLDER: General conditions - Backend-ready for API integration
  const generalConditions = [
    'Bookings must be made at least 24 hours in advance',
    'All bookings are subject to availability and admin approval',
    'Cancellations must be made at least 4 hours before the booking time',
    'Late arrivals may result in booking cancellation without refund'
  ];

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
          ) : bookings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No bookings yet!</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
                Ready to make your first booking? Browse our amazing amenities and reserve your spot today!
              </p>
              <button
                onClick={() => navigate('/amenities')}
                className="bg-[#40863A] text-white px-8 py-3 rounded-xl font-medium text-sm"
              >
                Browse Amenities
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                    <img 
                      src={amenityImages[booking.amenityId] || amenityImages[booking.amenityName] || clubhouseImg} 
                      alt={booking.amenityName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{booking.amenityName}</h3>

                  <div className={`px-3 py-2 rounded-full border ${getStatusColor(booking.status)} mb-4 text-center`}>
                    <div className="flex items-center justify-center space-x-2">
                      {booking.status !== 'Pending' && (
                        <div className={`w-2 h-2 rounded-full ${getStatusDot(booking.status)}`}></div>
                      )}
                      <span className="text-xs font-medium">{booking.status}</span>
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

                  {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="w-full text-rose-600 hover:text-rose-700 text-sm font-medium hover:bg-gray-50 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-[720px]">
          <GeneralConditions conditions={generalConditions} />
        </div>
      </div>

      <div className="fixed w-80 bg-white overflow-y-auto p-6" style={{ right: '100px', top: '54px', height: 'calc(100vh - 54px)' }}>
        <div className="mb-6 w-full max-w-xs">
          <InfoCard title="Notice" className="h-32">
            <p className="text-xs leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
              labore et dolore magna aliqua.
            </p>
          </InfoCard>
        </div>
        <CalendarWidget />
      </div>
    </div>
  );
}
