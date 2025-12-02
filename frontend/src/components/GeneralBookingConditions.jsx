import React from 'react';

// Canonical general booking conditions (edit here to update everywhere)
const GENERAL_BOOKING_CONDITIONS = [
  'Eligibility: Only residents with good standing (no outstanding HOA dues) may book amenities.',
  'Booking Limits: Each household may book the clubhouse a maximum of twice per month and reserve the pool for exclusive use once per month.',
  'Cancellation Policy: Cancellations must be made at least 48 hours in advance for a full refund. Later cancellations forfeit 50% of the booking fee.',
  'Damages: The booking resident is responsible for any damages incurred during their reservation period.',
  'Noise Restrictions: All events must observe quiet hours from 10PM to 6AM.',
  'Cleaning: Facilities must be cleaned and returned to their original condition after use.'
];

export default function GeneralBookingConditions({ conditions }) {
  const list = conditions || GENERAL_BOOKING_CONDITIONS;
  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">General Booking Conditions</h2>
        <div className="space-y-0">
          {list.map((condition, index) => (
            <div key={index}>
              <p className="text-gray-600 text-sm py-4 px-2">{condition}</p>
              {index < list.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { GENERAL_BOOKING_CONDITIONS };
