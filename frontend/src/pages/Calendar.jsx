import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralConditions from '../components/GeneralConditions';

export default function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 19)); // PLACEHOLDER: August 19, 2025
  const [selectedAmenity, setSelectedAmenity] = useState('Clubhouse');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 7, 19)); // PLACEHOLDER: Currently selected date for booking
  
  const today = new Date(2025, 7, 19); // PLACEHOLDER: Set today as August 19, 2025
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  // Backend-ready: These will be fetched from API
  const amenities = ['Clubhouse', 'Swimming Pool', 'Basketball Court']; // PLACEHOLDER data
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 10 }, (_, i) => 2024 + i); // 2024-2033
  
  // PLACEHOLDER: Sample booking conditions - replace with data from backend API
  const bookingConditions = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
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
  
  // PLACEHOLDER: Dynamic bookings - Backend-ready for API integration
  const bookings = [
    { 
      id: 1,
      date: new Date(2025, 7, 18), 
      startTime: '8:00 AM', 
      endTime: '12:00 PM',
      timeRange: '8:00 AM - 12:00 PM',
      status: 'confirmed', 
      amenity: 'Clubhouse',
      userId: 'user123',
      userName: 'John Doe'
    },
    { 
      id: 2,
      date: new Date(2025, 7, 20), 
      startTime: '1:00 PM', 
      endTime: '6:00 PM',
      timeRange: '1:00 PM - 6:00 PM',
      status: 'confirmed', 
      amenity: 'Swimming Pool',
      userId: 'user456',
      userName: 'Jane Smith'
    }
  ];

  // Backend-ready: Replace with actual API call
  // const fetchBookings = async (startDate, endDate) => {
  //   try {
  //     const response = await fetch(`/api/bookings?start=${startDate}&end=${endDate}&amenity=${selectedAmenity}`, {
  //       headers: { 'Authorization': `Bearer ${userToken}` }
  //     });
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching bookings:', error);
  //     return [];
  //   }
  // };
  
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

  const handleDateClick = (date, time = null) => {
    setSelectedDate(date);
    setCurrentDate(date);
    
    if (time) {
      const isAvailable = isTimeSlotAvailable(date, time, selectedAmenity);
      if (isAvailable) {
        console.log('Selected available time slot:', {
          date: date.toDateString(), 
          time,
          amenity: selectedAmenity
        });
        // TODO: Navigate to booking form or open booking modal
        // navigate('/book', { state: { date, time, amenity: selectedAmenity } });
      } else {
        console.log('Time slot not available');
        // TODO: Show user feedback that slot is not available
      }
    } else {
      console.log('Selected date for booking:', date.toDateString());
    }
  };
  
  const getBookingForDay = (date, amenity) => {
    return bookings.find(booking => 
      booking.date.getTime() === date.getTime() && 
      booking.amenity === amenity &&
      booking.status === 'confirmed' // Only show confirmed bookings
    );
  };

  const isTimeSlotAvailable = (date, time, amenity) => {
    const booking = getBookingForDay(date, amenity);
    if (!booking) return true;
    
    // Convert time to hours for comparison
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
    
    // Check if current time slot conflicts with booking
    return !(currentHour >= startHour && currentHour < endHour);
  };

  const isDateAvailable = (date) => {
    // Check if date has any bookings for the selected amenity
    const booking = getBookingForDay(date, selectedAmenity);
    return !booking; // Available if no confirmed booking exists for the whole day
  };
  
  const isToday = (date) => {
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="min-h-screen bg-white" style={{ marginLeft: '3rem', padding: '2rem' }}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/amenities')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
      </div>

      <div className="flex gap-8">
        {/* Main Calendar */}
        <div className="flex-1">
          {/* Calendar Header with Month/Year and Week Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            {/* Month/Year Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex items-center gap-3">
                <button
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg"
                >
                  <h2 className="text-xl font-semibold text-gray-900">{monthName} {year}</h2>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Month Dropdown */}
                {showMonthDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-80">
                    {/* Close X button */}
                    <button 
                      onClick={() => setShowMonthDropdown(false)}
                      className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Month Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                        <select 
                          value={currentDate.getMonth()}
                          onChange={(e) => navigateToDate(parseInt(e.target.value), currentDate.getFullYear())}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          {months.map((month, index) => (
                            <option key={index} value={index}>{month}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Year Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <select 
                          value={currentDate.getFullYear()}
                          onChange={(e) => navigateToDate(currentDate.getMonth(), parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Quick Navigation */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setCurrentDate(today); setShowMonthDropdown(false); }}
                        className="px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Go to Today
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Amenity Filter */}
              <div className="flex gap-2">
                {amenities.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => setSelectedAmenity(amenity)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedAmenity === amenity
                        ? 'bg-[#4CAF50] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Week Navigation */}
            <div className="flex items-center justify-end mb-4">
              <div className="text-sm font-medium text-gray-600 mr-4">
                Week of {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigateWeek(-1)} 
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button 
                  onClick={() => navigateWeek(1)} 
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Weekly Calendar Grid */}
            <div className="relative">
              <div className="grid grid-cols-8 border border-gray-200 rounded-lg overflow-hidden">
                {/* Time column header */}
                <div className="border-r border-gray-200 bg-gray-50 py-3 px-4">
                </div>
                
                {/* Day headers showing actual dates */}
                {weekDays.map((date, index) => {
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNumber = date.getDate();
                  const isCurrentDay = isToday(date);
                  
                  return (
                    <div key={index} className="py-3 px-4 border-r border-gray-200 bg-gray-50 last:border-r-0">
                      <div className="text-center">
                        <div className="text-xs text-gray-600 font-medium">{dayName}</div>
                        <div className={`text-sm font-semibold mt-1 ${
                          isCurrentDay ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {dayNumber}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Time slots */}
                {[
                  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
                ].map((time, timeIndex) => (
                  <React.Fragment key={time}>
                    {/* Time label */}
                    <div className="border-r border-b border-gray-200 px-4 py-3 bg-white text-sm text-gray-700 font-medium h-16 flex items-center whitespace-nowrap">
                      {time}
                    </div>
                    
                    {/* Day columns */}
                    {weekDays.map((date, dayIndex) => {
                      const isCurrentDay = isToday(date);
                      const isSlotAvailable = isTimeSlotAvailable(date, time, selectedAmenity);
                      
                      return (
                        <div 
                          key={dayIndex} 
                          className={`border-r border-b border-gray-200 h-16 relative last:border-r-0 transition-colors ${
                            isCurrentDay 
                              ? 'bg-green-50 hover:bg-green-100' 
                              : isSlotAvailable 
                                ? 'bg-white hover:bg-gray-50 cursor-pointer' 
                                : 'bg-gray-100 cursor-not-allowed'
                          }`}
                          onClick={() => isSlotAvailable && handleDateClick(date, time)}
                          title={
                            isSlotAvailable 
                              ? `Available`
                              : `Not available - ${time} on ${date.toLocaleDateString()} is already booked`
                          }
                        >
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Dynamic Booking overlays - Placeholder data, will be populated by backend */}
              {weekDays.map((date, dayIndex) => {
                const booking = getBookingForDay(date, selectedAmenity);
                if (!booking) return null;
                
                // Calculate time slot position based on booking times
                const timeToIndex = (timeStr) => {
                  const timeSlots = [
                    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
                  ];
                  return timeSlots.findIndex(slot => slot === timeStr);
                };
                
                const startIndex = timeToIndex(booking.startTime);
                const endIndex = timeToIndex(booking.endTime);
                const duration = Math.max(1, endIndex - startIndex);
                
                return (
                  <div 
                    key={`booking-${booking.id}-${dayIndex}`}
                    className="absolute bg-white border-1 border-[#4CAF50] rounded-lg shadow-sm z-10"
                    style={{
                      left: `${(100 / 8) * (dayIndex + 1) + 0.1}%`,
                      top: `${65 + (startIndex * 64)}px`,
                      width: `${(100 / 8) - 0.2}%`,
                      height: `${duration * 64 - 2}px`,
                    }}
                  >
                    <div className="p-3 h-full flex flex-col justify-between">
                      <div className="text-sm font-medium text-gray-800">
                        {booking.status === 'confirmed' ? 'Booked' : booking.status}
                      </div>
                      <div className="text-xs text-gray-600">{booking.timeRange}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <GeneralConditions conditions={bookingConditions} />
        </div>

        {/* Right Sidebar */}
        <div className="w-80">
          {/* Notice Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Notice</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
              labore et dolore magna aliqua.
            </p>
          </div>

          {/* Book Amenity Button */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Booking</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Ready to book an amenity? Click the button below to view available amenities and make your reservation.
            </p>
            <button
              onClick={() => navigate('/amenities')}
              className="w-full bg-[#4CAF50] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#45a049] transition-colors flex items-center justify-center gap-2"
            >
              Book Amenity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}