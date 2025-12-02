// BookingModalMobile Page
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileNavbar from "../components/layout/MobileNavbar";
import MobileSidebar from "../components/layout/MobileSidebar";
import GeneralConditions from "../components/GeneralConditions";
import { bookingService } from "../services/bookingService";
import { authService } from "../services/authService";

export default function BookingModalMobile() {
  const location = useLocation();
  const navigate = useNavigate();
  const amenity = location.state?.amenity;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      alert('Please log in to make a booking');
      navigate('/login');
      return;
    }
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the general booking conditions');
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
      const bookingData = {
        amenityId: amenity?.id,
        amenityName: amenity?.name,
        ...formData
      };
      
      await bookingService.createBooking(bookingData);
      
      alert('Booking submitted successfully! Please wait for admin approval.');
      navigate('/your-bookings');
    } catch (error) {
      console.error('Booking submission error:', error);
      alert(`Failed to submit booking: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/amenities');
  };



  if (!amenity) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold mb-4">No amenity selected</h2>
        <button 
          onClick={() => navigate('/amenities')}
          className="bg-[#40863A] text-white px-6 py-2 rounded-lg"
        >
          Back to Amenities
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Navbar */}
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Mobile Sidebar */}
      {sidebarOpen && <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      {/* Back Navigation - Fixed below navbar */}
      <div className="fixed top-[120px] left-0 right-0 bg-white z-40 px-5 py-3 border-b border-gray-200">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-900"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Booking Form</span>
        </button>
      </div>

      {/* Scrollable Content with padding for navbar + back button */}
      <div className="pt-[200px] pb-6 px-4">
        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Booking Form</h2>
            
            {/* First Name */}
            <div className="mb-4">
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

            {/* Last Name */}
            <div className="mb-4">
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

            {/* Address */}
            <div className="mb-4">
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

            {/* Email */}
            <div className="mb-4">
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

            {/* Contact Number */}
            <div className="mb-4">
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

            {/* Amenity to Book */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenity to book
              </label>
              <input
                type="text"
                name="amenityToBook"
                value={formData.amenityToBook}
                readOnly
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg bg-gray-100 text-gray-700"
              />
            </div>

            {/* Select Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select date
              </label>
              <input
                type="date"
                name="selectDate"
                value={formData.selectDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {/* Start Time */}
            <div className="mb-4">
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

            {/* End Time */}
            <div className="mb-4">
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

            {/* Purpose */}
            <div className="mb-4">
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
            <div className="mb-4">
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
            <div className="mb-6">
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#40863A] text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Book Now'}
            </button>
          </div>
        </form>

        {/* General Conditions */}
        <div className="mb-6">
          <GeneralBookingConditions />
        </div>
      </div>
    </div>
  );
}
