import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../components/shared/InfoCard';
import CalendarWidget from '../components/CalendarWidget';
import AmenityCard from '../components/AmenityCard';
import GeneralConditions from '../components/GeneralConditions';

// Import amenity images
import clubhouseImg from '../assets/clubhouse.png';
import poolImg from '../assets/pool.png';
import courtImg from '../assets/court.png';
import playgroundImg from '../assets/playground.png';

// PLACEHOLDER: Amenity data - Backend-ready for API integration
const amenities = [
  { id: 1, name: 'Clubhouse', status: 'Available', image: clubhouseImg },
  { id: 2, name: 'Swimming Pool', status: 'Limited', image: poolImg },
  { id: 3, name: 'Basketball Court', status: 'Available', image: courtImg },
  { id: 4, name: 'Playground', status: 'Not Available', image: playgroundImg }
];



export default function Amenities() {
  const navigate = useNavigate();

  const handleBook = (amenity) => {
    if (amenity.status === 'Not Available') return;
    // Navigate to BookingModal page with amenity data
    navigate('/booking-modal', { state: { amenity } });
  };

  // PLACEHOLDER: General conditions - Backend-ready for API integration
  const generalConditions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {/* Main Content */}
      <div className="flex-1 ml-12 py-6 px-6">
        {/* Header Buttons */}
        <div className="flex justify-start gap-4 mb-8">
          <button className="bg-[#40863A] text-white px-6 py-2 rounded-lg font-medium text-sm">
            Book Amenity
          </button>
          <button
            onClick={() => navigate('/your-bookings')}
            className="bg-white text-black px-6 py-2 rounded-lg border border-gray-300 font-normal text-sm"
          >
            Your Bookings
          </button>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-[720px]">
          {amenities.map((amenity) => (
            <AmenityCard key={amenity.id} amenity={amenity} onBook={handleBook} />
          ))}
        </div>

        {/* General Conditions */}
        <div className="max-w-[720px]">
          <GeneralConditions conditions={generalConditions} />
        </div>
      </div>

      {/* Fixed Right Sidebar - Only adjust positioning */}
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
