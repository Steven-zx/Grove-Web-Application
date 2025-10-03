import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  // For backend: fetch notifications here
  // const [notifications, setNotifications] = React.useState([]);
  // React.useEffect(() => { fetch('/api/notifications').then(...); }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('.notification-bell')) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-0 left-74 right-0 h-16 bg-white flex items-center justify-end px-6 z-40 gap-4">
      <div className="relative notification-bell">
        <button
          aria-label="Notifications"
          className="h-10 w-10 rounded-full bg-[#E5EBE0] hover:bg-[#EFEFEF] flex items-center justify-center transition-colors cursor-pointer"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <Bell size={20} />
        </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50" style={{ maxHeight: 400, height: 400, overflowY: 'auto' }}>
              <div className="p-4 text-center text-gray-400 text-sm">
                {/* Notifications will be rendered here from backend */}
              </div>
            </div>
          )}
      </div>
      <button
        onClick={handleLogout}
        className="h-10 px-4 text-gray-700 hover:text-[#40863A] font-semibold transition-colors cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
}
