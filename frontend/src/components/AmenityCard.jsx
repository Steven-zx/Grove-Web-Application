import React from 'react';

const AmenityCard = ({ amenity, onBook }) => {
  return (
  <div className="bg-white rounded-2xl overflow-hidden flex flex-col border border-[#D9D9D9] w-full max-w-xs md:max-w-sm lg:max-w-md h-auto min-h-[400px] md:min-h-[480px]">
  <img src={amenity.image} alt={amenity.name} className="w-full h-40 md:h-48 object-cover" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">{amenity.name}</h2>
          <span 
            className="text-xs font-medium bg-white rounded-full flex items-center justify-center text-black whitespace-nowrap"
            style={{ 
              width: '100px', 
              height: '22px', 
              border: '1px solid #D9D9D9',
              backgroundColor: '#FFFFFF'
            }}
          >
            {amenity.status}
          </span>
        </div>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-1">{amenity.description}</p>
        <button
          onClick={() => onBook(amenity)}
          disabled={amenity.status === 'Not Available'}
          className={`w-full py-2.5 rounded-full font-normal text-sm mt-auto ${
            amenity.status === 'Not Available'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-[#D9D9D9] text-black hover:bg-gray-50'
          }`}
        >
          {amenity.status === 'Not Available' ? 'Coming Soon' : 'Book'}
        </button>
      </div>
    </div>
  );
};

export default AmenityCard;