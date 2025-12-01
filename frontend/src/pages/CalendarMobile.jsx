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
  
  // Sample bookings
  const bookings = [
    { 
      id: 1,
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
      startTime: '8:00 AM', 
      endTime: '12:00 PM',
      status: 'confirmed', 
      amenity: 'Clubhouse'
    },
    { 
      id: 2,
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2),
      startTime: '1:00 PM', 
      endTime: '6:00 PM',
      status: 'confirmed', 
      amenity: 'Swimming Pool'
    }
  ];
  
  // Calculate current week days
  const startOfWeek = new Date(currentDate);
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }
  
  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateToDate = (month, year) => {
    const newDate = new Date(year, month, 1);
    setCurrentDate(newDate);
    setShowMonthDropdown(false);
  };
  
  const getBookingForDay = (date, amenity) => {
    return bookings.find(booking => 
      booking.date.getTime() === date.getTime() && 
      booking.amenity === amenity &&
      booking.status === 'confirmed'
    );
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

        {/* Month and Amenity Dropdowns */}
        <div className="mb-4">
          <div className="flex gap-3 mb-3">
            {/* Month Dropdown */}
            <div className="flex-1 relative">
              <button
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg bg-white"
              >
                <span className="text-sm font-medium">{monthName} {year}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Month Dropdown Panel */}
              {showMonthDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                  <button 
                    onClick={() => setShowMonthDropdown(false)}
                    className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                    <select 
                      value={currentDate.getMonth()}
                      onChange={(e) => navigateToDate(parseInt(e.target.value), currentDate.getFullYear())}
                      className="w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm"
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <select 
                      value={currentDate.getFullYear()}
                      onChange={(e) => navigateToDate(currentDate.getMonth(), parseInt(e.target.value))}
                      className="w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => { setCurrentDate(today); setShowMonthDropdown(false); }}
                    className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Go to Today
                  </button>
                </div>
              )}
            </div>

            {/* Amenity Dropdown */}
            <div className="flex-1">
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm font-medium"
              >
                {amenities.map((amenity) => (
                  <option key={amenity} value={amenity}>{amenity}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          {/* Week Navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <button 
              onClick={() => navigateWeek(-1)} 
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="text-sm font-medium text-gray-600">
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            
            <button 
              onClick={() => navigateWeek(1)} 
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Calendar Grid - Horizontal Scroll */}
          <div className="overflow-x-auto hide-scrollbar">
            <div className="inline-flex min-w-full">
              {/* Time Column */}
              <div className="flex flex-col border-r border-gray-200 bg-gray-50" style={{minWidth: '80px'}}>
                <div className="h-12 border-b border-gray-200"></div>
                {timeSlots.map((time) => (
                  <div key={time} className="h-16 border-b border-gray-200 flex items-center justify-center text-xs text-gray-700 px-2">
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
                  <div key={dayIndex} className="flex flex-col border-r border-gray-200 last:border-r-0" style={{minWidth: '80px'}}>
                    {/* Day Header */}
                    <div className="h-12 border-b border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
                      <div className="text-xs text-gray-600 font-medium">{dayName}</div>
                      <div className={`text-sm font-semibold mt-0.5 ${isCurrentDay ? 'text-green-600' : 'text-gray-900'}`}>
                        {dayNumber}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="relative">
                      {timeSlots.map((time, timeIndex) => {
                        const isSlotAvailable = isTimeSlotAvailable(date, time, selectedAmenity);
                        
                        return (
                          <div 
                            key={timeIndex}
                            className={`h-16 border-b border-gray-200 ${
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
                        const duration = Math.max(1, endIndex - startIndex);
                        
                        return (
                          <div 
                            className="absolute left-1 right-1 bg-white border border-[#40863A] rounded-lg shadow-sm z-10 p-2"
                            style={{
                              top: `${48 + (startIndex * 64)}px`,
                              height: `${duration * 64 - 4}px`,
                            }}
                          >
                            <div className="text-xs font-medium text-gray-800">Booked</div>
                            <div className="text-xs text-gray-600 mt-1">{booking.startTime} - {booking.endTime}</div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* General Booking Conditions */}
        <GeneralConditions conditions={bookingConditions} />
      </div>
    </div>
  );
}
