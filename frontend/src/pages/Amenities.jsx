import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import InfoCard from '../components/shared/InfoCard';
import CalendarWidget from '../components/CalendarWidget';
import AmenityCard from '../components/AmenityCard';
import GeneralConditions from '../components/GeneralConditions';

// Import amenity images
import clubhouseImg from '../assets/clubhouse.png';
import poolImg from '../assets/pool.png';
import courtImg from '../assets/court.png';
import playgroundImg from '../assets/playground.png';

// Image mapping for amenities
const amenityImages = {
  'Clubhouse': clubhouseImg,
  'Swimming Pool': poolImg,
  'Basketball Court': courtImg,
  'Playground': playgroundImg
};



export default function Amenities() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch amenities from API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/amenities');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Map database amenities to frontend format with images
        const mappedAmenities = data.map(amenity => ({
          id: amenity.id,
          name: amenity.name,
          status: amenity.status,
          image: amenityImages[amenity.name] || clubhouseImg, // Default image
          description: amenity.description
        }));
        
        setAmenities(mappedAmenities);
        console.log('🏢 Loaded amenities from database:', mappedAmenities);
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
        setError('Failed to load amenities');
        // Fallback to hardcoded data if API fails
        setAmenities([
          { id: 'fallback-1', name: 'Clubhouse', status: 'Available', image: clubhouseImg },
          { id: 'fallback-2', name: 'Swimming Pool', status: 'Limited', image: poolImg },
          { id: 'fallback-3', name: 'Basketball Court', status: 'Available', image: courtImg },
          { id: 'fallback-4', name: 'Playground', status: 'Not Available', image: playgroundImg }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  // Filter amenities based on query
  const filteredAmenities = amenities.filter(a =>
    !query ||
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleBook = (amenity) => {
    if (amenity.status === 'Not Available') return;
    
    // Check if user is logged in
    if (!authService.isAuthenticated()) {
      alert('Please log in to book an amenity');
      navigate('/login');
      return;
    }
    
    // Navigate to BookingModal page with amenity data
    navigate('/booking-modal', { state: { amenity } });
  };

  // PLACEHOLDER: General conditions - Backend-ready for API integration
  const generalConditions = [
    'Eligibility: Only residents with good standing (no outstanding HOA dues) may book amenities',
    'Booking Limits: Each household may book the clubhouse a maximum of twice per month and reserve the pool for exclusive use once per month.',
    'Cancellation Policy: Cancellations must be made at least 48 hours in advance for a full refund. Later cancellations forfeit 50% of the booking fee.',
    'Damages: The booking resident is responsible for any damages incurred during their reservation period.',
    'Noise Restrictions: All events must observe quiet hours from 10PM to 6AM.',
    'Cleaning: Facilities must be cleaned and returned to their original condition after use.'
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
          onClick={() => {
            if (!authService.isAuthenticated()) {
              alert('Please log in to view your bookings');
              navigate('/login');
              return;
            }
            navigate('/your-bookings');
          }}
          className="bg-white text-black px-6 py-2 rounded-lg border border-[#D9D9D9] font-normal text-sm"
        >
          Your Bookings
        </button>
      </div>

      {/* Amenities Grid */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading amenities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredAmenities.map((amenity) => (
              <AmenityCard key={amenity.id} amenity={amenity} onBook={handleBook} />
            ))}
          </div>
        )}
      </div>


      {/* General Conditions */}
      <div>
        <GeneralConditions conditions={generalConditions} />
      </div>
    </main>

    {/* Desktop Sidebar: sticky */}
    <aside className="hidden md:flex w-80 px-2 py-0 flex-col gap-3 min-h-screen">
      <div className="sticky top-20 flex flex-col gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-bold mb-2">Notice</h3>
          <p className="text-sm text-gray-600">
            Amenities are available all-week long!
          </p>
        </div>
        <CalendarWidget />
      </div>
    </aside>
    </div>
  );
}
