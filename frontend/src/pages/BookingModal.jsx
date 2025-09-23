// BookingModal Page
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const amenity = location.state?.amenity;

  if (!amenity) {
    return (
      <main className="bg-white min-h-screen p-6" style={{ marginLeft: '3rem' }}>
        <h2 className="text-xl font-bold">No amenity selected</h2>
        <button 
          onClick={() => navigate('/amenities')}
          className="mt-4 bg-[#40863A] text-white px-6 py-2 rounded-lg"
        >
          Back to Amenities
        </button>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen p-6" style={{ marginLeft: '3rem' }}>
      <h2 className="text-xl font-bold">Book {amenity.name}</h2>
      <p className="mt-4">Status: {amenity.status}</p>
      {/* Add your booking form content here */}
      <button 
        onClick={() => navigate('/amenities')}
        className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-lg mr-4"
      >
        Back to Amenities
      </button>
    </main>
  );
}