
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import MobileNavbar from "../components/layout/MobileNavbar";
import MobileSidebar from "../components/layout/MobileSidebar";
import AnnouncementModal from "../components/AnnouncementModal";
import filterIcon from "../assets/filter.png";
import FiltersCard from "../components/shared/FiltersCard";


export default function AnnouncementsMobile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const noticeRef = useRef(null);
  const [filterHeight, setFilterHeight] = useState(undefined);
  const [filters, setFilters] = useState({ category: "All categories", date: "", sort: "Newest First" });
  const categories = ["All categories", "General", "Maintenance", "Sports", "Security", "Facilities"];
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useLayoutEffect(() => {
    if (noticeRef.current) {
      setFilterHeight(noticeRef.current.offsetHeight);
    }
  }, []);

  // Fetch announcements from backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.category && filters.category !== "All categories") {
          params.append("category", filters.category);
        }
        if (filters.sort === "Oldest First") {
          params.append("sort", "asc");
        }
        // Optionally add date filter if backend supports it
        // if (filters.date) params.append("date", filters.date);

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE_URL}/api/announcements?${params}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        // Format the data for display
        const formattedAnnouncements = data.map(announcement => ({
          id: announcement.id,
          author: "Admin",
          date: new Date(announcement.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          content: announcement.description,
          title: announcement.title,
          category: announcement.category,
          importance: announcement.importance,
          image: announcement.image_url,
        }));
        setAnnouncements(formattedAnnouncements);
        setError(null);
      } catch (err) {
        setError(`Failed to load announcements: ${err.message}. Please check if the backend server is running on localhost:3000.`);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [filters]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  }

  function handleFind(e) {
    e.preventDefault();
    setShowFilters(false);
    // fetchAnnouncements will be triggered by filters state change
  }

  return (
    <div className="flex flex-col w-full bg-white pb-8 pt-34 min-h-screen">
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 px-4">
        {/* Category Row */}
        <div className="flex items-center gap-2 mb-3">
          <button className="px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-medium text-[#1e1e1e]">Community Updates</button>
        </div>

        {/* Notice and Filter Card Row */}
        <div className="flex items-stretch gap-2 mb-4">
          <div className="flex-1 flex">
            <div ref={noticeRef} className="rounded-2xl border border-gray-200 bg-white p-4 flex-1 flex flex-col justify-center text-left">
              <h3 className="font-bold mb-1 text-sm text-[#1e1e1e]">Notice</h3>
              <p className="text-sm text-[#1e1e1e]">There will be an increase in the monthly dues from ₱900 to ₱950.</p>
            </div>
          </div>
          <div className="flex items-stretch">
            <button
              className="aspect-square w-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center"
              style={filterHeight ? { height: filterHeight } : { minHeight: 64, maxHeight: 80 }}
              onClick={() => setShowFilters(v => !v)}
              aria-label="Show filters"
            >
              <img src={filterIcon} alt="Filter" className="h-6 w-6 object-contain opacity-70" />
            </button>
          </div>
        </div>

        {/* Filters Dropdown */}
        <div className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          {showFilters && (
            <FiltersCard
              title="Filters"
              fields={[
                { label: "Category", name: "category", type: "select", options: categories },
                { label: "Date", name: "date", type: "date" },
                { label: "Sort by", name: "sort", type: "select", options: ["Newest First", "Oldest First"] },
              ]}
              values={filters}
              onChange={handleFilterChange}
              onSubmit={handleFind}
              submitText="Find"
            />
          )}
        </div>

        {/* Announcements List */}
        <div className="flex flex-col gap-4 mt-2">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading announcements...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-500">{error}</div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">No announcements found.</div>
            </div>
          ) : (
            announcements.map(a => (
              <div 
                key={a.id} 
                className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-2 cursor-pointer active:bg-gray-50"
                onClick={() => setSelectedAnnouncement(a)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#40863A]">A</div>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-[#1e1e1e] text-sm">{a.author}</span>
                      <span className="text-xs text-[#1e1e1e] opacity-60">{a.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {a.category && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                        {a.category}
                      </span>
                    )}
                  </div>
                </div>
                {a.title && (
                  <h3 className="font-bold text-base text-[#1e1e1e]">{a.title}</h3>
                )}
                <div className="text-sm text-[#1e1e1e] line-clamp-2">{a.content}</div>
                {a.image && (
                  <img src={a.image} alt="Announcement" className="rounded-xl w-full object-cover max-h-48" />
                )}
                <div className="text-sm text-[#40863A] font-medium mt-1">
                  Tap to read more →
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <AnnouncementModal 
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </div>
  );
}
