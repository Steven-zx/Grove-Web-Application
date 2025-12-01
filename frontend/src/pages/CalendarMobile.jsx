import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileNavbar from "../components/layout/MobileNavbar";
import MobileSidebar from "../components/layout/MobileSidebar";
import NoticeCard from '../components/shared/NoticeCard';
import GeneralConditions from '../components/GeneralConditions';

export default function CalendarMobile() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAmenity, setSelectedAmenity] = useState('Clubhouse');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  
  const today = new Date();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
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
  
  const amenities = ['Clubhouse', 'Swimming Pool', 'Basketball Court'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 10 }, (_, i) => 2024 + i);
  
  const bookingConditions = [
    'Eligibility: Only residents with good standing (no outstanding HOA dues) may book amenities',
    'Booking Limits: Each household may book the clubhouse a maximum of twice per month and reserve the pool for exclusive use once per month.',
    'Cancellation Policy: Cancellations must be made at least 48 hours in advance for a full refund. Later cancellations forfeit 50% of the booking fee.',
    'Damages: The booking resident is responsible for any damages incurred during their reservation period.',
    'Noise Restrictions: All events must observe quiet hours from 10PM to 6AM.',
    'Cleaning: Facilities must be cleaned and returned to their original condition after use.'
  ];
  
  // TODO: Replace with real bookings from backend/API
  const bookings = [];
  
  // Calculate current 4-day window (instead of 7-day week)
  const startOfWindow = new Date(currentDate);
  const weekDays = [];
  for (let i = 0; i < 4; i++) {
    const day = new Date(startOfWindow);
    day.setDate(startOfWindow.getDate() + i);
    weekDays.push(day);
  }
  
  // Move by 4 days instead of 7
  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 4));
    setCurrentDate(newDate);
  };

  const navigateToDate = (month, year) => {
    const newDate = new Date(year, month, 1);
    setCurrentDate(newDate);
    setShowMonthDropdown(false);
  };
  
  const getBookingForDay = (date, amenity) => {
    // Compare only year, month, and date (ignore time)
    return bookings.find(booking => {
      const bookingDate = new Date(booking.date.getFullYear(), booking.date.getMonth(), booking.date.getDate());
      const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return bookingDate.getTime() === checkDate.getTime() &&
        booking.amenity === amenity &&
        booking.status === 'confirmed';
    });
  };

  const isTimeSlotAvailable = (date, time, amenity) => {
    const booking = getBookingForDay(date, amenity);
    if (!booking) return true;
    
    const timeToHours = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours;
    };
    
    const currentHour = timeToHours(time);
    const startHour = timeToHours(booking.startTime);
    const endHour = timeToHours(booking.endTime);
    
    return !(currentHour >= startHour && currentHour < endHour);
  };
  
  const isToday = (date) => {
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Navbar */}
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Mobile Sidebar */}
      {sidebarOpen && <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      {/* Scrollable Content */}
      <div className="pt-36 pb-6 px-4">
        {/* Notice Card */}
        <div className="mb-4">
          <NoticeCard />
        </div>

        {/* Quick Booking Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <h3 className="font-bold mb-2">Quick Booking</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Ready to book an amenity? Click the button below to view available amenities and make your reservation.
          </p>
          <button
            onClick={() => navigate('/amenities')}
            className="w-full bg-[#40863A] text-white py-2.5 px-4 rounded-lg font-medium"
          >
            Book Amenity
          </button>
        </div>

        {/* Month/Year and Amenity Dropdowns */}
        <div className="flex items-center gap-2 mb-4">
          {/* Month Dropdown */}
          <div className="flex-1">
            <select
              value={currentDate.getMonth()}
              onChange={e => navigateToDate(parseInt(e.target.value), currentDate.getFullYear())}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
          </div>
          {/* Year Dropdown */}
          <div className="w-28">
            <select
              value={currentDate.getFullYear()}
              onChange={e => navigateToDate(currentDate.getMonth(), parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {/* Amenity Dropdown */}
          <div className="flex-1">
            <select
              value={selectedAmenity}
              onChange={e => setSelectedAmenity(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {amenities.map(amenity => (
                <option key={amenity} value={amenity}>{amenity}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between px-2 pt-4 mb-2">
            <button 
              onClick={() => navigateWeek(-1)} 
              className="p-2 hover:bg-gray-100 rounded-full border border-gray-300 bg-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="text-xs text-gray-700 font-medium">
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[weekDays.length-1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <button 
              onClick={() => navigateWeek(1)} 
              className="p-2 hover:bg-gray-100 rounded-full border border-gray-300 bg-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Calendar Grid - 4 columns, fill width, with spacing */}
          <div className="flex w-full">
            {/* Time Column */}
            <div className="flex flex-col border-r border-gray-300 bg-white w-16 flex-shrink-0">
              <div className="h-12 border-b border-gray-300"></div>
              {timeSlots.map((time) => (
                <div key={time} className="h-12 border-b border-gray-300 flex items-center justify-center text-xs text-gray-700 px-2">
                  {time}
                </div>
              ))}
            </div>
            {/* Day Columns */}
            {weekDays.map((date, dayIndex) => {
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNumber = date.getDate();
              const isCurrentDay = isToday(date);
              return (
                <div
                  key={dayIndex}
                  className={`flex flex-col bg-white w-full ${dayIndex !== weekDays.length - 1 ? 'mr-2 border-r border-gray-300' : ''}`}
                  style={{ minWidth: 0 }}
                >
                  {/* Day Header */}
                  <div className="h-12 border-b border-gray-300 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-700 font-normal">{dayName}</div>
                    {isCurrentDay ? (
                      <div className="min-w-[24px] w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-medium">{dayNumber}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-700 font-normal mt-1">{dayNumber}</span>
                    )}
                  </div>
                  {/* Time Slots */}
                  <div className="relative">
                    {timeSlots.map((time, timeIndex) => {
                      const isSlotAvailable = isTimeSlotAvailable(date, time, selectedAmenity);
                      return (
                        <div
                          key={timeIndex}
                          className={`h-12 border-b border-gray-300 ${
                            isCurrentDay
                              ? 'bg-green-50'
                              : isSlotAvailable
                                ? 'bg-white'
                                : 'bg-gray-100'
                          }`}
                        />
                      );
                    })}
                    {/* Booking Overlay */}
                    {(() => {
                      const booking = getBookingForDay(date, selectedAmenity);
                      if (!booking) return null;
                      const timeToIndex = (timeStr) => timeSlots.findIndex(slot => slot === timeStr);
                      const startIndex = timeToIndex(booking.startTime);
                      const endIndex = timeToIndex(booking.endTime);
                      // Overlay should include the end slot fully, so add 1 to duration
                      const duration = Math.max(1, endIndex - startIndex + 1);
                      return (
                        <div
                          className="absolute left-1 right-1 bg-white border border-[#4CAF50] rounded-lg shadow-sm z-10 p-1"
                          style={{
                            top: `${(startIndex * 48)}px`,
                            height: `${duration * 48 - 4}px`,
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <div className="text-[10px] font-medium text-gray-800">Booked</div>
                            <div className="text-[10px] text-gray-600 mt-1">{booking.startTime} - {booking.endTime}</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* General Booking Conditions */}
        <GeneralConditions conditions={bookingConditions} />
      </div>
    </div>
  );
}
