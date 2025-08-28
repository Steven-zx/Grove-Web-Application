import React from 'react';
export default function GreenButton({ children }) {
  return (
    <button
      className="px-6 py-2 rounded-full font-semibold bg-[#40863A] text-white hover:bg-[#E5EAEE] hover:text-[#1e1e1e] transition-colors"
    >
      {children}
    </button>
  );
}
