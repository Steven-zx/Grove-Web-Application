// Announcements Page
import React from "react";
import AnnouncementCard from "../components/AnnouncementCard";
import FiltersCard from "../components/shared/FiltersCard";
import announcement1 from "../assets/announcement1.png";
import announcement2 from "../assets/announcement2.png";

// Dummy data for now, replace with backend fetch later
const initialAnnouncements = [
  {
    id: 1,
    author: "Admin",
    date: "August 21 at 8:49 PM",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In placerat dui vitae ex blandit mattis. Curabitur purus felis, scelerisque in ...",
    image: announcement1,
  },
  {
    id: 2,
    author: "Admin",
    date: "August 21 at 1:49 PM",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In placerat dui vitae ex blandit mattis. Curabitur purus felis, scelerisque in ...",
    image: announcement2,
  },
];

const categories = ["All categories", "General", "Facilities", "Upgrade"];

export default function Announcements() {
  const [announcements, setAnnouncements] = React.useState(initialAnnouncements);
  const [filters, setFilters] = React.useState({
    category: "All categories",
    date: "",
    sort: "Newest First",
  });

  // Placeholder for backend fetch
  // React.useEffect(() => {
  //   fetchAnnouncements(filters).then(setAnnouncements);
  // }, [filters]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  }

  function handleFind(e) {
    e.preventDefault();
    // Future: fetch filtered announcements from backend
  }

  return (
  <div className="flex bg-white min-h-screen" style={{ justifyContent: 'flex-start' }}>
      {/* Main content */}
  <main className="flex-1 pl-8 pr-4 flex flex-col gap-6" style={{ maxWidth: '700px', minWidth: '350px', marginLeft: '3rem' }}>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">Community Updates</h2>
        </div>
        <div className="flex flex-col gap-8">
          {announcements.map(a => (
            <AnnouncementCard key={a.id} {...a} />
          ))}
        </div>
      </main>

      {/* Notice and Filters on right, fixed on scroll */}
  <aside className="w-80 px-2 py-0 flex flex-col gap-3 min-h-screen fixed" style={{ left: 'calc(650px + 23rem)', top: '4.5rem', height: 'calc(100vh - 4.5rem)', zIndex: 30, background: 'white' }}>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
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
      </aside>
    </div>
  );
}

