import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import {
  Home,
  Bell,
  Image,
  Info,
  Flag,
  List,
} from "lucide-react";

export default function MobileSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-white w-[80%] max-w-[320px] shadow-xl z-50
        transition-transform duration-300 rounded-r-3xl overflow-hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex flex-col gap-6">

          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 h-14 w-14 rounded-full flex items-center justify-center">J</div>
            <div>
              <p className="font-semibold text-lg" style={{ color: '#40863A' }}>John Smith</p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">

              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 ${
                    isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"
                  }`
                }
              >
                <Home size={20} /> <span>Home</span>
              </NavLink>

              <NavLink
                to="/announcements"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 ${
                    isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"
                  }`
                }
              >
                <Bell size={20} /> <span>Announcements</span>
              </NavLink>

              <NavLink
                to="/amenities"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 ${
                    isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"
                  }`
                }
              >
                <List size={20} /> <span>Amenities</span>
              </NavLink>

              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 ${
                    isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"
                  }`
                }
              >
                <Image size={20} /> <span>Gallery</span>
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 ${
                    isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"
                  }`
                }
              >
                <Info size={20} /> <span>About</span>
              </NavLink>

              <NavLink
                to="/report"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 ${
                    isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"
                  }`
                }
              >
                <Flag size={20} /> <span>Report a problem</span>
              </NavLink>
          </div>

          <button
            className="mt-4 text-white py-3 rounded-full w-full"
            style={{ backgroundColor: '#40863A' }}
            onClick={handleLogout}
          >
            Log out
          </button>

          <div className="text-xs text-center mt-auto"
          style={{color: '#1E1E1E'}}
          >
            © 2025 Augustine Grove by Aser’s Angels
          </div>
        </div>
      </div>
    </>
  );
}
