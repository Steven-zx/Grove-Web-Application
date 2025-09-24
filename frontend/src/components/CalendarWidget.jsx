import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CalendarWidget = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);
  
  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigateMonth(-1)} className="text-gray-600 hover:text-gray-800 p-1">←</button>
        <h3 className="text-lg font-semibold">{monthName} {currentDate.getFullYear()}</h3>
        <button onClick={() => navigateMonth(1)} className="text-gray-600 hover:text-gray-800 p-1">→</button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs text-gray-500 font-medium p-2">{day}</div>
        ))}
        
        {days.map((day, index) => {
          const isToday = day && today.getDate() === day && 
                         today.getMonth() === currentDate.getMonth() && 
                         today.getFullYear() === currentDate.getFullYear();
          
          return (
            <div key={index} className={`w-8 h-8 flex items-center justify-center text-sm cursor-pointer rounded ${
              day ? (isToday ? 'bg-[#40863A] text-white' : 'text-gray-700 hover:bg-gray-100') : ''
            }`}>
              {day}
            </div>
          ); 
        })}
      </div>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => navigate('/calendar')}
          className="text-sm text-[#40863A] hover:underline"
        >
          View Calendar
        </button>
      </div>
    </div>
  );
};

export default CalendarWidget;