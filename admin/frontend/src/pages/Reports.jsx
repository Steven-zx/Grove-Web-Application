// Admin Reports Page
import React, { useState, useEffect } from "react";
import FiltersCard from "../components/shared/FiltersCard";

// Dummy backend fetch function (replace with real API call)
async function fetchReports() {
    // Simulate API response
    return [
        {
            id: 1,
            date: "16 August 2025",
            type: "Maintenance",
            name: "John Smith",
            status: "resolved",
            unread: false,
        },
        {
            id: 2,
            date: "11 August 2025",
            type: "Noise",
            name: "John Smith",
            status: "unresolved",
            unread: false,
        },
        {
            id: 3,
            date: "10 August 2025",
            type: "Noise",
            name: "John Smith",
            status: "unread",
            unread: true,
        },
    ];
}

function Reports() {
    const [reports, setReports] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filters, setFilters] = useState({
        type: "All issue types",
        date: "",
        sort: "Newest First",
    });

    useEffect(() => {
        fetchReports().then(setReports);
    }, []);

    function toggleSelect(id) {
        setSelectedIds(ids =>
            ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
        );
    }

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFilters(f => ({ ...f, [name]: value }));
    }

    function handleFind(e) {
        e.preventDefault();
        // Future: fetch filtered reports from backend
    }

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full">
                {/* Main content and filters side by side */}
                    <main
                        className="flex-1 px-2 md:pl-8 md:pr-4 flex flex-col gap-6 md:min-w-[350px] md:ml-0"
                >
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-sm text-[#222]">
                                <th className="px-4 py-3 font-medium">
                                    <input
                                        type="checkbox"
                                        checked={reports.length > 0 && selectedIds.length === reports.length}
                                        onChange={e =>
                                            setSelectedIds(e.target.checked ? reports.map(r => r.id) : [])
                                        }
                                        style={{ accentColor: '#40863A' }}
                                    />
                                </th>
                                <th className="px-4 py-3 font-medium">Date reported</th>
                                <th className="px-4 py-3 font-medium">Issue type</th>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => (
                                <tr
                                    key={report.id}
                                    className="border-t text-sm hover:bg-gray-50 transition"
                                    style={{ borderTop: '1px solid #d9d9d9' }}
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(report.id)}
                                            onChange={() => toggleSelect(report.id)}
                                            style={{ accentColor: '#40863A' }}
                                        />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">{report.date}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{report.type}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{report.name}</td>
                                    <td className="px-4 py-3">
                                        {report.status === "resolved" && (
                                            <span className="px-3 py-1 rounded bg-green-50 text-green-700 border border-green-300 text-xs font-medium">
                                                Marked as resolved
                                            </span>
                                        )}
                                        {report.status === "unresolved" && (
                                            <span className="px-3 py-1 rounded bg-red-50 text-red-700 border border-red-300 text-xs font-medium">
                                                Not yet resolved
                                            </span>
                                        )}
                                        {report.status === "unread" && (
                                            <span className="font-semibold text-[#222]">Unread</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Responsive FiltersCard */}
            {/* Desktop: sidebar next to main content, not fixed */}
            <aside
                className="hidden md:flex w-80 px-2 py-0 flex-col gap-3 min-h-screen"
            >
                <FiltersCard
                    title="Filters"
                    fields={[
                        {
                            label: "Issue Type",
                            name: "type",
                            type: "select",
                            options: ["Noise", "Maintenance", "Safety", "Other"],
                        },
                        { label: "Date", name: "date", type: "date" },
                        {
                            label: "Sort by",
                            name: "sort",
                            type: "select",
                            options: ["Newest First", "Oldest First"],
                        },
                    ]}
                    values={filters}
                    onChange={handleFilterChange}
                    onSubmit={handleFind}
                    submitText="Find"
                />
            </aside>

            {/* Mobile: above table, full width */}
            <div className="md:hidden w-full px-2 py-3 flex flex-col gap-3">
                <FiltersCard
                    title="Filters"
                    fields={[
                        {
                            label: "Issue Type",
                            name: "type",
                            type: "select",
                            options: ["Noise", "Maintenance", "Safety", "Other"],
                        },
                        { label: "Date", name: "date", type: "date" },
                        {
                            label: "Sort by",
                            name: "sort",
                            type: "select",
                            options: ["Newest First", "Oldest First"],
                        },
                    ]}
                    values={filters}
                    onChange={handleFilterChange}
                    onSubmit={handleFind}
                    submitText="Find"
                />
            </div>
        </div>
    );
}

export default Reports;
