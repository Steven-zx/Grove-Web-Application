import React from "react";
import { Flag, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-2 w-full max-w-xl">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            type="text"
            placeholder="Search…"
            className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          aria-label="Report"
          className="h-10 w-10 rounded-full border border-gray-300 bg-[#E5EBE0] hover:bg-[#EFEFEF] flex items-center justify-center transition-colors"
        >
          <Flag size={18} />
        </button>

        <button
          aria-label="Profile"
          className="h-10 w-10 rounded-full border border-gray-300 bg-[#E5EBE0] hover:bg-[#EFEFEF] flex items-center justify-center transition-colors"
        >
          <User size={18} />
        </button>
      </div>
    </nav>
  );
}
