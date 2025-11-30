import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { profileService } from "../../services/profileService";
import {
  Home,
  Bell,
  Image,
  Info,
  Flag,
  List,
} from "lucide-react";
import ReportIssueModal from "../ReportIssueModal";

export default function MobileSidebar({ open, onClose }) {
    const handleAuth = () => {
      if (user) {
        authService.logout();
        setUser(null);
        // Optionally, redirect to home or login page
        navigate("/");
      } else {
        navigate("/login");
      }
    };
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await profileService.getProfile?.();
        setUser(profile || null);
      } catch (e) {
        setUser(null);
      }
    }
    fetchProfile();
  }, []);

  const displayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'User' : 'Guest';
  const displayLetter = displayName ? displayName[0].toUpperCase() : 'G';
  const showViewProfile = !!user;

  // Drawer JSX with overlay
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(30,30,30,0.25)' }}
          onClick={onClose}
          aria-label="Close sidebar overlay"
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full bg-white w-[80%] max-w-[320px] shadow-xl z-50 transition-transform duration-300 rounded-r-3xl overflow-hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col gap-6">
          {/* Profile */}
          {showViewProfile ? (
            <NavLink to="/profile" className="flex items-center gap-4">
              <div className="bg-gray-200 h-14 w-14 rounded-full flex items-center justify-center">{displayLetter}</div>
              <div>
                <p className="font-semibold text-lg" style={{ color: '#40863A' }}>{displayName}</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
            </NavLink>
          ) : (
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 h-14 w-14 rounded-full flex items-center justify-center">{displayLetter}</div>
              <div>
                <p className="font-semibold text-lg" style={{ color: '#40863A' }}>{displayName}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 ${isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"}`
              }
            >
              <Home size={20} /> <span>Home</span>
            </NavLink>
            <NavLink
              to="/announcements"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 ${isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"}`
              }
            >
              <Bell size={20} /> <span>Announcements</span>
            </NavLink>
            <NavLink
              to="/amenities"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 ${isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"}`
              }
            >
              <List size={20} /> <span>Amenities</span>
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 ${isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"}`
              }
            >
              <Image size={20} /> <span>Gallery</span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 ${isActive ? "bg-[#E5EBE0] text-gray-900 rounded-xl" : "text-gray-800 hover:bg-[#EFEFEF]"}`
              }
            >
              <Info size={20} /> <span>About</span>
            </NavLink>
            {/* Report a problem as button to open modal */}
            <button
              type="button"
              className="flex items-center gap-3 p-3 text-gray-800 hover:bg-[#EFEFEF] w-full text-left rounded-xl"
              style={{ background: reportOpen ? '#E5EBE0' : undefined }}
              onClick={() => setReportOpen(true)}
            >
              <Flag size={20} /> <span>Report a problem</span>
            </button>
          </div>
          <button
            className="mt-4 text-white py-3 rounded-full w-full"
            style={{ backgroundColor: '#40863A' }}
            onClick={handleAuth}
          >
            {user ? 'Log out' : 'Log in'}
          </button>
          <div className="text-xs text-center mt-auto" style={{ color: '#1E1E1E' }}>
            © 2025 Augustine Grove by Aser’s Angels
          </div>
        </div>
      </div>
      {/* Report Issue Modal for mobile */}
      <ReportIssueModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
