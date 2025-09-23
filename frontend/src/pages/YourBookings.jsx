import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function YourBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
  }, []);

  const handleCancelBooking = (bookingToCancel) => {
    // Remove the booking from localStorage
    const updatedBookings = bookings.filter(
      booking => booking.amenityId !== bookingToCancel.amenityId || 
                 booking.date !== bookingToCancel.date
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Bookings</h1>
          <button
            onClick={() => navigate('/amenities')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Book New Amenity
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg text-gray-500 mb-4">You don't have any bookings yet</h3>
            <button
              onClick={() => navigate('/amenities')}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Book an Amenity
            </button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking, index) => (
                <li key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {booking.amenityName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
