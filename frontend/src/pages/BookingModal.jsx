// BookingModal Page
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GeneralBookingConditions from "../components/GeneralBookingConditions";
import bookingService from "../services/bookingService.js";
import PaymentService from "../services/paymentService.js";
import { authService } from "../services/authService";

export default function BookingModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const amenity = location.state?.amenity;

  // Check authentication on component mount
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      alert('Please log in to make a booking');
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Get user data from auth service to auto-fill form
  const getUserData = () => {
    const user = authService.getUser();
    if (user) {
      return {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        email: user.email || '',
        contactNumber: user.phone || ''
      };
    }
    return null;
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    contactNumber: '',
    amenityToBook: amenity?.name || '',
    selectDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: '',
    additionalNotes: '',
    agreeToTerms: false
  });

  const [paymentMethod, setPaymentMethod] = useState('gcash');

  // Auto-fill user data when component mounts
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        address: userData.address || '',
        email: userData.email || '',
        contactNumber: userData.contactNumber || ''
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate booking amount based on amenity
  const calculateBookingAmount = () => {
    const description = amenity?.description || '';
    
    if (description.includes('₱1,000') && description.includes('₱2,000')) {
      return 1000;
    }
    if (description.includes('₱2,000') && description.includes('₱3,500')) {
      return 2000;
    }
    if (description.includes('₱150')) {
      const guests = parseInt(formData.attendees) || 1;
      return 150 * guests;
    }
    
    return 1000; // Default amount
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the general booking conditions');
      return;
    }
    
    // Check if amenity exists
    if (!amenity || !amenity.id) {
      alert('No amenity selected. Please go back and select an amenity.');
      return;
    }
    
    // Validate time range (8 AM - 6 PM)
    const startTime = formData.startTime;
    const endTime = formData.endTime;
    
    if (startTime < '08:00' || startTime > '18:00') {
      alert('Start time must be between 8:00 AM and 6:00 PM');
      return;
    }
    
    if (endTime < '08:00' || endTime > '18:00') {
      alert('End time must be between 8:00 AM and 6:00 PM');
      return;
    }
    
    if (endTime <= startTime) {
      alert('End time must be after start time');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create booking data (bookingService will normalize to guest_count)
      const bookingData = {
        amenity_id: amenity.id,  // Remove the ?. since we checked above
        booking_date: formData.selectDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        number_of_guests: parseInt(formData.attendees),
        notes: `Purpose: ${formData.purpose}\n${formData.additionalNotes}`,
        payment_status: 'pending',
        status: 'pending'
      };

      console.log('📤 Sending booking data:', JSON.stringify(bookingData, null, 2));
      console.log('Amenity object:', amenity);

      const booking = await bookingService.createBooking(bookingData);

      console.log('✅ Booking created:', booking);

      const amount = calculateBookingAmount();

      // Process payment
      if (paymentMethod === 'gcash') {
        // Redirect to manual GCash payment page
        navigate(`/payment/manual-gcash?bookingId=${booking.id}&amount=${amount}`);
      } else if (paymentMethod === 'in-person') {
        // In-person payment - booking created successfully
        alert('Booking created successfully! Please pay at the Augustine Grove office upon arrival.');
        navigate('/your-bookings');
      } else {
        alert('Please select a valid payment method.');
        setIsSubmitting(false);
      }
      
    } catch (error) {
      console.error('Booking submission error:', error);
      
      if (error.message.includes('token') || error.message.includes('Invalid') || error.message.includes('expired')) {
        alert('Your session has expired. Please log in again.');
        authService.logout();
        navigate('/login');
      } else {
        alert(`Failed to submit booking: ${error.message}`);
      }
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/amenities');
  };



  if (!amenity) {
    return (
      <div className="min-h-screen bg-white" style={{ marginLeft: '3rem', padding: '2rem' }}>
        <h2 className="text-xl font-bold">No amenity selected</h2>
        <button 
          onClick={() => navigate('/amenities')}
          className="mt-4 bg-[#40863A] text-white px-6 py-2 rounded-lg"
        >
          Back to Amenities
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ marginLeft: '3rem', padding: '2rem' }}>
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-2xl font-semibold">Booking Form</h1>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* First Name - Auto-filled from user account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                required
              />
              {formData.firstName && (
                <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
              )}
            </div>

            {/* Last Name - Auto-filled from user account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Smith"
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                required
              />
              {formData.lastName && (
                <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
              )}
            </div>
          </div>

          {/* Address - Auto-filled from user account */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address / Lot & Block Number
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Block 3, Lot 8, Phase 2"
              className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-gray-50"
              required
            />
            {formData.address && (
              <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Email - Auto-filled from user account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.smith@email.com"
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                required
              />
              {formData.email && (
                <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
              )}
            </div>

            {/* Contact Number - Auto-filled from user account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="0912 345 6789"
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                required
              />
              {formData.contactNumber && (
                <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Amenity to Book - Read-only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenity to book
              </label>
              <input
                type="text"
                name="amenityToBook"
                value={formData.amenityToBook}
                readOnly
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Select Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select date
              </label>
              <input
                type="date"
                name="selectDate"
                value={formData.selectDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Start Time - 8 AM to 6 PM only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                min="08:00"
                max="18:00"
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Available from 8:00 AM to 6:00 PM</p>
            </div>

            {/* End Time - 8 AM to 6 PM only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                min="08:00"
                max="18:00"
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Available from 8:00 AM to 6:00 PM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of booking (e.g., birthday)
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {/* Number of Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. of attendees
              </label>
              <input
                type="number"
                name="attendees"
                value={formData.attendees}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Payment Method - NEW FIELD */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="gcash">GCash</option>
              <option value="in-person">In-Person Payment</option>
            </select>
            {paymentMethod === 'gcash' && (
              <p className="text-sm text-blue-600 mt-2">
                ℹ️ You will transfer to our GCash account and upload proof of payment
              </p>
            )}
            {paymentMethod === 'in-person' && (
              <p className="text-sm text-blue-600 mt-2">
                ℹ️ Pay at the Augustine Grove office upon arrival
              </p>
            )}
          </div>

          {/* Booking Amount Display - NEW */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-1">Booking Amount:</p>
            <p className="text-2xl font-bold text-[#40863A]">₱{calculateBookingAmount().toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              {paymentMethod === 'gcash' 
                ? '* Pay via GCash transfer and upload proof of payment'
                : paymentMethod === 'in-person'
                ? '* Payment due upon arrival at the Augustine Grove office' 
                : '* You will be redirected to payment gateway'}
            </p>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional notes (optional)
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
              placeholder="Any additional information or special requests..."
            />
          </div>

          {/* Terms Checkbox */}
          <div className="mb-8">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-[#D9D9D9] rounded"
                required
              />
              <span className="text-sm text-gray-700">
                I have read and agree to general booking conditions
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#40863A] text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 focus:ring-1 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing Payment...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </form>

      {/* General Conditions - Same width as booking form */}
      <div className="max-w-4xl">
        <div className="mt-12">
          <GeneralBookingConditions />
        </div>
      </div>
    </div>
  );
}
