import React from 'react';
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
  <div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto">
    {/* Main Content */}
    <main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-[850px]">
      {/* Header Buttons */}
      <div className="flex justify-start gap-4 mb-8">
        <button className="bg-[#40863A] text-white px-6 py-2 rounded-lg font-medium text-sm">
          Book Amenity
        </button>
        <button
          onClick={() => navigate('/your-bookings')}
          className="bg-white text-black px-6 py-2 rounded-lg border border-[#D9D9D9] font-normal text-sm"
        >
          Your Bookings
        </button>
      </div>

      {/* Mobile: Notice + Calendar above grid */}
      <div className="md:hidden w-full px-2 py-3 flex flex-col gap-3">
        <InfoCard title="Notice" className="h-32">
          <p className="text-xs leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
            labore et dolore magna aliqua.
          </p>
        </InfoCard>
        <CalendarWidget />
      </div>

      {/* Amenities Grid */}
      <div className="max-w-3xl w-full">
        <div className="grid grid-cols-2 gap-4">
          {amenities.map((amenity) => (
            <AmenityCard key={amenity.id} amenity={amenity} onBook={handleBook} />
          ))}
        </div>
      </div>


      {/* General Conditions */}
      <div className="mt-12">
        <GeneralConditions conditions={generalConditions} />
      </div>
    </main>

    {/* Desktop Sidebar */}
    <aside className="hidden md:flex w-80 px-2 py-0 flex-col gap-3 min-h-screen">
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-bold mb-2">Notice</h3>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua.
        </p>
      </div>
      <CalendarWidget />
    </aside>
    </div>
  );
}
