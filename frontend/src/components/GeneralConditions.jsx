import React from 'react';

// Backend-ready component: conditions array will be fetched from API
const GeneralConditions = ({ conditions }) => {
  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">General Booking Conditions</h2>
        <div className="space-y-0">
          {conditions.map((condition, index) => (
            <div key={index}>
              <p className="text-gray-600 text-sm py-4 px-2">{condition}</p>
              {index < conditions.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralConditions;