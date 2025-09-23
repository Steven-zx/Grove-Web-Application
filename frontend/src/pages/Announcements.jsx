// Announcements Page
import React from "react";
import AnnouncementCard from "../components/AnnouncementCard";
import announcement1 from "../assets/announcement1.png";
import announcement2 from "../assets/announcement2.png";

// Fallback data for when backend is not available
const fallbackAnnouncements = [
  {
    id: 1,
    title: "Community Update",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In placerat dui vitae ex blandit mattis. Curabitur purus felis, scelerisque in ...",
    category: "General",
    importance: "Medium",
    date: "2025-01-21T20:49:00Z",
    image_url: announcement1,
  },
  {
    id: 2, 
    title: "Facilities Maintenance",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In placerat dui vitae ex blandit mattis. Curabitur purus felis, scelerisque in ...",
    category: "Facilities", 
    importance: "High",
    date: "2025-01-21T13:49:00Z",
    image_url: announcement2,
  },
];

const categories = ["All categories", "General", "Facilities", "Upgrade"];

export default function Announcements() {
  const [announcements, setAnnouncements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [filters, setFilters] = React.useState({
    category: "All categories",
    date: "",
    sort: "Newest First",
  });

  // Fetch announcements from backend
  React.useEffect(() => {
    fetchAnnouncements();
  }, [filters]);

  async function fetchAnnouncements() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category !== "All categories") {
        params.append('category', filters.category);
      }
      if (filters.date) {
        params.append('date', filters.date);
      }
      params.append('sort', filters.sort === "Newest First" ? 'desc' : 'asc');

      const response = await fetch(`/api/announcements?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const data = await response.json();
      
      // Transform backend data to match frontend format
      const transformedData = data.map(item => ({
        id: item.id,
        author: "Admin",
        date: new Date(item.date).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        content: item.description,
        image: item.image_url
      }));

      setAnnouncements(transformedData);
      setError("");
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError("Failed to load announcements. Showing fallback data.");
      
      // Use fallback data
      const transformedFallback = fallbackAnnouncements.map(item => ({
        id: item.id,
        author: "Admin", 
        date: new Date(item.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric', 
          hour: 'numeric',
          minute: '2-digit'
        }),
        content: item.description,
        image: item.image_url
      }));
      
      setAnnouncements(transformedFallback);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  }

  function handleFind(e) {
    e.preventDefault();
    fetchAnnouncements();
  }

  return (
  <div className="flex bg-white min-h-screen" style={{ justifyContent: 'flex-start' }}>
      {/* Main content */}
  <main className="flex-1 pl-8 pr-4 flex flex-col gap-6" style={{ maxWidth: '700px', minWidth: '350px', marginLeft: '3rem' }}>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">Community Updates</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading announcements...</div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {announcements.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No announcements found.
              </div>
            ) : (
              announcements.map(a => (
                <AnnouncementCard key={a.id} {...a} />
              ))
            )}
          </div>
        )}
      </main>

      {/* Notice and Filters on right, fixed on scroll */}
  <aside className="w-80 px-2 py-0 flex flex-col gap-3 min-h-screen fixed" style={{ left: 'calc(650px + 23rem)', top: '4.5rem', height: 'calc(100vh - 4.5rem)', zIndex: 30, background: 'white' }}>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="font-bold mb-2">Notice</h3>
          <p className="text-sm text-gray-600">There will be an increase in the monthly dues from ₱800 to ₱850.</p>
        </div>
        <form className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4" onSubmit={handleFind}>
          <h3 className="font-bold mb-2">Filters</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full rounded-lg border border-gray-300 p-2">
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full rounded-lg border border-gray-300 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort by</label>
            <select name="sort" value={filters.sort} onChange={handleFilterChange} className="w-full rounded-lg border border-gray-300 p-2">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
          <button type="submit" className="rounded-full bg-[#40863A] text-white font-semibold px-6 py-2 mt-2 hover:bg-[#35702c] transition-colors">Find</button>
        </form>
      </aside>
    </div>
  );
}

