import React from 'react';

export default function NoticeCard({ title = 'Notice', message = 'Amenities are available all-week long!', className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-5 ${className}`}>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
    </div>
  );
}
