import React from "react";
import { Flag, Search, User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import ReportIssueModal from "../ReportIssueModal";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
  const profileBtnRef = React.useRef(null);

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
            className="w-full rounded-full border border-gray-300 pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E5EBE0]"
          />
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
              <Link to="/login" className="flex items-center gap-3 px-5 py-3 text-[#1e1e1e] hover:bg-gray-50 transition-colors">
                <LogIn size={20} />
                <span className="font-medium">Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
