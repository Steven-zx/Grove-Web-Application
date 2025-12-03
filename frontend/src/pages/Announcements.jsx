// Announcements Page
import React from "react";
import { useLocation } from "react-router-dom";
import AnnouncementCard from "../components/AnnouncementCard";
import AnnouncementModal from "../components/AnnouncementModal";
import FiltersCard from "../components/shared/FiltersCard";

const categories = ["All categories", "General", "Maintenance", "Sports", "Security", "Facilities"];

export default function Announcements() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [announcements, setAnnouncements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);
  const [filters, setFilters] = React.useState({
    category: "All categories",
    date: "",
    sort: "Newest First",
  });

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== "All categories") {
        params.append('category', filters.category);
      }
      if (filters.sort === "Oldest First") {
        params.append('sort', 'asc');
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      console.log('Fetching announcements from:', `${API_BASE_URL}/api/announcements?${params}`);

      const response = await fetch(`${API_BASE_URL}/api/announcements?${params}`);      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched announcements:', data);
      
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
      console.error('Error fetching announcements:', err);
      setError(`Failed to load announcements: ${err.message}. Please check if the backend server is running on localhost:3000.`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnnouncements();
  }, [filters]);

  // Filter announcements based on query
  const filteredAnnouncements = announcements.filter(a =>
    !query ||
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.content.toLowerCase().includes(query.toLowerCase())
  );

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  }

  function handleFind(e) {
    e.preventDefault();
    fetchAnnouncements();
  }

  return (
    <div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto">
      {/* Main content */}
      <main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-[900px]">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">Community Updates</h2>
        </div>
        <div className="flex flex-col gap-8">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading announcements...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-500">{error}</div>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">No announcements found.</div>
            </div>
          ) : (
            filteredAnnouncements.map(a => (
              <AnnouncementCard 
                key={a.id} 
                {...a} 
                onClick={() => setSelectedAnnouncement(a)}
              />
            ))
          )}
        </div>
      </main>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden md:flex w-80 px-2 py-0 flex-col gap-3 min-h-screen">
        <div className="sticky top-20 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold mb-2">Notice</h3>
            <p className="text-sm text-gray-600">There will be an increase in the monthly dues from ₱800 to ₱850.</p>
          </div>
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
        </div>
      </aside>

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

