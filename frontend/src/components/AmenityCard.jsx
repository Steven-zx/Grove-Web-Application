import React from 'react';

const AmenityCard = ({ amenity, onBook }) => {
  return (
  <div className="bg-white rounded-2xl overflow-hidden flex flex-col border border-[#D9D9D9] w-full max-w-xs md:max-w-sm lg:max-w-md h-auto min-h-[400px] md:min-h-[480px]">
  <img src={amenity.image} alt={amenity.name} className="w-full h-40 md:h-48 object-cover" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6 gap-2">
          <h2 className="text-lg font-semibold flex-1 truncate">{amenity.name}</h2>
          {(() => {
            const status = amenity.status || 'Available';
            let colorClasses = 'bg-white text-black border border-[#D9D9D9]';
            if (status === 'Available') colorClasses = 'bg-white text-[#1e1e1e] border border-[#D9D9D9]';
            else if (status === 'Limited') colorClasses = 'bg-[#FFF7E6] text-[#A86800] border border-[#F2D091]';
            else if (status === 'Not Available') colorClasses = 'bg-[#F5F5F5] text-[#7A7A7A] border border-[#D9D9D9]';
            return (
              <span className={`px-3 h-6 min-w-[90px] text-center text-xs font-medium rounded-full flex items-center justify-center ${colorClasses}`}>
                {status}
              </span>
            );
          })()}
        </div>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-1">{amenity.description}</p>
        {amenity.status !== 'Not Available' && (
          <button
            onClick={() => onBook(amenity)}
            className="w-full py-2.5 rounded-full font-normal text-sm mt-auto bg-white border border-[#D9D9D9] text-black hover:bg-gray-50"
          >
            Book
          </button>
        )}
      </div>
    </div>
  );
};

export default AmenityCard;