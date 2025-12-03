import React from "react";
import { Flag, Search, User, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import ReportIssueModal from "../ReportIssueModal";

export default function Navbar() {
    // Suggested search terms
    const SUGGESTED_TERMS = [
      "Pool",
      "Clubhouse",
      "Basketball Court",
      "Playground",
      "Maintenance",
      "Booking",
      "Announcement",
      "Reservation",
      "Security",
      "Sports"
    ];
    const [showSuggestions, setShowSuggestions] = React.useState(false);
  // Real authentication state
  const [isLoggedIn, setIsLoggedIn] = React.useState(authService.isAuthenticated());
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const profileBtnRef = React.useRef(null);
  const navigate = useNavigate();
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  // Handle search submit (on Enter)
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (term) => {
    setSearchQuery(term);
    setShowSuggestions(false);
    // Navigate based on suggestion type
    const amenityTerms = ["Pool", "Clubhouse", "Basketball Court", "Playground"];
    const bookingTerms = ["Booking", "Reservation"];
    if (amenityTerms.includes(term)) {
      navigate(`/amenities?q=${encodeURIComponent(term)}`);
    } else if (bookingTerms.includes(term)) {
      navigate(`/your-bookings?q=${encodeURIComponent(term)}`);
    } else {
      navigate(`/announcements?q=${encodeURIComponent(term)}`);
    }
  };

  // Update login state when auth changes
  React.useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoggedIn(authService.isAuthenticated());
    };
    
    // Check auth status periodically
    const interval = setInterval(checkAuthStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (profileBtnRef.current && !profileBtnRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-0 left-74 right-0 h-16 bg-white flex items-center justify-between px-6 z-40">
      {/* Search */}
      <div className="flex items-center gap-2 w-full max-w-xl">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            className="w-full rounded-full border border-[#D9D9D9] pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E5EBE0]"
            autoComplete="off"
          />
          {showSuggestions && searchQuery.trim() && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto">
              {SUGGESTED_TERMS.filter(term =>
                term.toLowerCase().includes(searchQuery.toLowerCase()) && term.toLowerCase() !== searchQuery.toLowerCase()
              ).slice(0, 5).map(term => (
                <div
                  key={term}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={() => handleSuggestionClick(term)}
                >
                  {term}
                </div>
              ))}
              {/* Show a message if no suggestions */}
              {SUGGESTED_TERMS.filter(term =>
                term.toLowerCase().includes(searchQuery.toLowerCase()) && term.toLowerCase() !== searchQuery.toLowerCase()
              ).length === 0 && (
                <div className="px-4 py-2 text-gray-400">No suggestions</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          aria-label="Report"
          className="h-10 w-10 rounded-full bg-[#E5EBE0] hover:bg-[#EFEFEF] flex items-center justify-center transition-colors cursor-pointer"
          onClick={() => setReportOpen(true)}
        >
          <Flag size={18} />
        </button>
  {/* Report Issue Modal */}
  <ReportIssueModal open={reportOpen} onClose={() => setReportOpen(false)} />

        {/* Profile button with dropdown */}
        <div className="relative" ref={profileBtnRef}>
          <button
            aria-label="Profile"
            className="h-10 w-10 rounded-full bg-[#E5EBE0] hover:bg-[#EFEFEF] flex items-center justify-center transition-colors cursor-pointer"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <User size={18} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 py-2 z-50">
              {isLoggedIn && (
                <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-[#1e1e1e] hover:bg-gray-50 transition-colors">
                  <User size={20} />
                  <span className="font-medium">Profile</span>
                </Link>
              )}
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-3 text-[#1e1e1e] hover:bg-gray-50 transition-colors w-full text-left">
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-3 px-5 py-3 text-[#1e1e1e] hover:bg-gray-50 transition-colors">
                  <LogIn size={20} />
                  <span className="font-medium">Login</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
