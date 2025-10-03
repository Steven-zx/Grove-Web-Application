// AnnouncementPreview.jsx
import React from "react";
import AnnouncementCard from "../components/AnnouncementCard";
import ReactMarkdown from "react-markdown";
import FiltersCard from "../components/shared/FiltersCard";

export default function AnnouncementPreview({ form, onEdit }) {
  // Prepare props for AnnouncementCard
  const image = form.file ? URL.createObjectURL(form.file) : undefined;
  const author = "Admin";
  function formatDate(dateString) {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    const options = { month: "long", day: "numeric" };
    const monthDay = dateObj.toLocaleDateString(undefined, options);
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${monthDay} at ${hours}:${minutes} ${ampm}`;
  }
  const date = form.date ? formatDate(form.date) : "";
  const content = form.details;

  // Sidebar data (can be passed as props or hardcoded for preview)
  const categories = ["General", "Facilities", "Upgrade"];
  const filters = {
    category: "All categories",
    date: "",
    sort: "Newest First",
  };
  function handleFilterChange() {}
  function handleFind(e) { e.preventDefault(); }

  return (
    <div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto">
      <main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-[900px]">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">Community Updates</h2>
        </div>
        {/* Edit button */}
        <AnnouncementCard
          author={author}
          date={date}
          image={image}
          onEdit={onEdit}
          // Remove content prop, render markdown below
        />
        <div className="prose text-sm text-[#1e1e1e] w-full max-w-2xl">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="flex gap-2 text-xs text-gray-400">
          <span>Category: {form.category}</span>
          <span>Visibility: {form.visibility}</span>
          {form.file && <span>Attachment: {form.file.name}</span>}
        </div>
      </main>
      {/* Desktop: sticky sidebar for preview only */}
      <aside className="hidden md:flex w-80 px-2 py-0 flex-col gap-3 min-h-screen">
        <div className="sticky top-20 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold mb-2">Notice</h3>
            <p className="text-sm text-gray-600">There will be an increase in the monthly dues from ₱800 to ₱850.</p>
          </div>
          <FiltersCard
            title="Filters"
            fields={[{ label: "Category", name: "category", type: "select", options: categories },
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
    </div>
  );
}
