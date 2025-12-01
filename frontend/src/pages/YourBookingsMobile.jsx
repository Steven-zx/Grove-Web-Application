import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { bookingService } from '../services/bookingService';
import MobileNavbar from "../components/layout/MobileNavbar";
import MobileSidebar from "../components/layout/MobileSidebar";
import NoticeCard from '../components/shared/NoticeCard';
import CalendarWidget from '../components/CalendarWidget';
import GeneralConditions from '../components/GeneralConditions';
import { Calendar } from "lucide-react";

// Import amenity images
import clubhouseImg from '../assets/clubhouse.png';
import poolImg from '../assets/pool.png';
import courtImg from '../assets/court.png';
import playgroundImg from '../assets/playground.png';

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

export default function YourBookingsMobile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const userBookings = await bookingService.getUserBookings();
      
      // Transform API data
      const transformedBookings = userBookings.map(booking => ({
        id: booking.id,
        amenityId: booking.amenity_id,
        amenityName: booking.amenity_type,
        date: booking.booking_date,
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
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled');
      await loadBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Delete this booking record?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking deleted');
      await loadBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking');
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

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-emerald-50 border-emerald-200 text-emerald-700',
      'Pending': 'bg-yellow-50 border-yellow-200 text-yellow-700',
      'Rejected': 'bg-rose-50 border-rose-200 text-rose-700',
      'Cancelled': 'bg-gray-50 border-gray-200 text-gray-700'
    };
    return colors[status] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getStatusDot = (status) => {
    const dots = {
      'Confirmed': 'bg-emerald-500',
      'Pending': 'bg-yellow-500',
      'Rejected': 'bg-rose-500',
      'Cancelled': 'bg-gray-500'
    };
    return dots[status] || 'bg-gray-500';
  };

  // Display all bookings
  const displayedBookings = bookings;

  const generalConditions = [
    'Eligibility: Only residents with good standing (no outstanding HOA dues) may book amenities',
    'Booking Limits: Each household may book the clubhouse a maximum of twice per month and reserve the pool for exclusive use once per month.',
    'Cancellation Policy: Cancellations must be made at least 48 hours in advance for a full refund. Later cancellations forfeit 50% of the booking fee.',
    'Damages: The booking resident is responsible for any damages incurred during their reservation period.',
    'Noise Restrictions: All events must observe quiet hours from 10PM to 6AM.',
    'Cleaning: Facilities must be cleaned and returned to their original condition after use.'
  ];

  return (
    <div className="flex flex-col w-full bg-white h-screen overflow-hidden">
      {/* Mobile Navbar */}
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Mobile Sidebar */}
      {sidebarOpen && <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      {/* Fixed Header Section */}
      <div className="pt-36 px-4 pb-4 bg-white">
        {/* Header Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => navigate('/amenities')}
            className="bg-white text-black px-5 py-2.5 rounded-lg border border-[#D9D9D9] font-normal text-sm flex-1"
          >
            Book Amenity
          </button>
          <button className="bg-[#40863A] text-white px-5 py-2.5 rounded-lg font-medium text-sm flex-1">
            Your Bookings
          </button>
        </div>

        {/* Notice + Calendar Containers */}
        <div className="flex gap-3 mb-2">
          <NoticeCard className="flex-1 p-4" />
          <button
            type="button"
            onClick={() => setShowCalendar(v => !v)}
            aria-label="Toggle calendar"
            className="bg-white rounded-2xl border border-gray-200 w-16 flex items-center justify-center hover:border-[#40863A] transition-colors"
          >
            <Calendar size={24} className={showCalendar ? 'text-[#40863A]' : 'text-gray-500'} />
          </button>
        </div>
        {showCalendar && (
          <div className="mb-4 animate-fade-in">
            <CalendarWidget />
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Bookings Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={loadBookings}
              className="bg-[#40863A] text-white px-6 py-2 rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        ) : displayedBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet...</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              You haven't made any amenity bookings yet. Browse available amenities and make your first booking!
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {displayedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                    <img 
                      src={amenityImages[booking.amenityId] || amenityImages[booking.amenityName] || clubhouseImg} 
                      alt={booking.amenityName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate">
                      {booking.amenityName}
                    </h3>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-2 ${getStatusColor(booking.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(booking.status)}`}></div>
                      <span>{booking.status}</span>
                    </div>

                    {/* Date & Time */}
                    <p className="text-xs text-gray-600 mb-1">
                      {formatDate(booking.date)}
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      {formatTimeRange(booking.startTime, booking.endTime)}
                    </p>

                    {/* Action Buttons */}
                    {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-rose-600 text-xs font-medium hover:text-rose-700 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {(booking.status === 'Cancelled' || booking.status === 'Rejected') && (
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-gray-600 text-xs font-medium hover:text-gray-800 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* General Conditions */}
        <div className="mb-6">
          <GeneralConditions conditions={generalConditions} />
        </div>
      </div>
    </div>
  );
}
