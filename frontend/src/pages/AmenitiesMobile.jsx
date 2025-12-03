import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import AmenityCard from '../components/AmenityCard';
import GeneralBookingConditions from '../components/GeneralBookingConditions';
import CalendarWidget from '../components/CalendarWidget';
import NoticeCard from '../components/shared/NoticeCard';
import MobileNavbar from "../components/layout/MobileNavbar";
import MobileSidebar from "../components/layout/MobileSidebar";
import { Calendar } from "lucide-react";

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

export default function AmenitiesMobile() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prevent body scroll when sidebar is open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  // Fetch amenities from API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE_URL}/api/amenities`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Map database amenities to frontend format with images
        const mappedAmenities = data.map(amenity => ({
          id: amenity.id,
          name: amenity.name,
          status: amenity.status,
          image: amenityImages[amenity.name] || clubhouseImg,
          description: amenity.description
        }));

        // Mobile explicit order: Basketball Court, Clubhouse, Swimming Pool, Playground (last if present)
        const desiredOrder = ['Basketball Court', 'Clubhouse', 'Swimming Pool', 'Playground'];
        const orderedAmenities = mappedAmenities
          .slice()
          .sort((a, b) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name));

        setAmenities(orderedAmenities);
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
        setError('Failed to load amenities');
        // Fallback to hardcoded data if API fails
        setAmenities([
          { id: 'fallback-1', name: 'Clubhouse', status: 'Available', image: clubhouseImg, description: 'A versatile space designed for community gatherings, celebrations, and meetings. It serves as the heart of social activities within Augustine Grove, offering a comfortable venue for residents to connect and build stronger relationships.' },
          { id: 'fallback-2', name: 'Swimming Pool', status: 'Limited', image: poolImg, description: 'A refreshing space for relaxation and recreation. Perfect for families to enjoy quality time together while staying active.' },
          { id: 'fallback-3', name: 'Basketball Court', status: 'Available', image: courtImg, description: 'A full-sized court for sports enthusiasts. Great for friendly games and staying fit with neighbors.' },
          { id: 'fallback-4', name: 'Playground', status: 'Not Available', image: playgroundImg, description: 'A safe and fun area for children to play and socialize. Coming soon for your little ones!' }
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
    (a.description && a.description.toLowerCase().includes(query.toLowerCase()))
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



  return (
    <div className="flex flex-col w-full bg-white h-screen overflow-hidden">
      {/* Mobile Navbar */}
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Mobile Sidebar */}
      {sidebarOpen && <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      {/* Fixed Header Section */}
      <div className="pt-36 px-4 pb-4 bg-white">
        {/* Header Buttons */}
        <div className="flex gap-3 mb-4">
          <button className="bg-[#40863A] text-white px-5 py-2.5 rounded-lg font-medium text-sm flex-1">
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
            className="bg-white text-black px-5 py-2.5 rounded-lg border border-[#D9D9D9] font-normal text-sm flex-1"
          >
            Your Bookings
          </button>
        </div>

        {/* Notice + Calendar Containers */}
        <div className="flex gap-3 mb-2">
          <NoticeCard className="flex-1 p-4" />
          <button
            type="button"
            onClick={() => setShowCalendar(v => !v)}
            aria-label="Toggle calendar"
            className="bg-white rounded-2xl border border-gray-200 w-16 flex items-center justify-center hover:border-[#40863A] transition-colors"
          >
            <Calendar size={24} className={showCalendar ? 'text-[#40863A]' : 'text-gray-500'} />
          </button>
        </div>
        {showCalendar && (
          <div className="mb-4 animate-fade-in">
            <CalendarWidget />
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Amenities Carousel */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">Loading amenities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="mb-6">
            {/* Using horizontal scroll for mobile */}
            <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
              <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                {filteredAmenities.map((amenity) => (
                  <div key={amenity.id} className="flex-shrink-0" style={{ width: '85vw', maxWidth: '380px' }}>
                    <AmenityCard amenity={amenity} onBook={handleBook} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* General Conditions */}
        <div className="mb-6">
          <GeneralBookingConditions />
        </div>
      </div>
    </div>
  );
}
