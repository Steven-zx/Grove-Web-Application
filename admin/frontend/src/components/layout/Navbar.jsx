import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-74 right-0 h-16 bg-white flex items-center justify-end px-6 z-40 gap-4">
      <button
        aria-label="Notifications"
        className="h-10 w-10 rounded-full bg-[#E5EBE0] hover:bg-[#EFEFEF] flex items-center justify-center transition-colors cursor-pointer"
      >
        <Bell size={20} />
      </button>
      <button
        onClick={handleLogout}
        className="h-10 px-4 text-gray-700 hover:text-[#40863A] font-semibold transition-colors cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
}
