// Admin Reports Page
import React, { useState, useEffect } from "react";
import ReportDetails from "./ReportDetails";
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
    const [openReportId, setOpenReportId] = useState(null);

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

    // Handler to mark selected reports as resolved
    function handleMarkResolved() {
        setReports(reports =>
            reports.map(report =>
                selectedIds.includes(report.id)
                    ? { ...report, status: "resolved" }
                    : report
            )
        );
    }

    // Handler to delete selected reports
    function handleDeleteSelected() {
        setReports(reports => reports.filter(report => !selectedIds.includes(report.id)));
        setSelectedIds([]);
    }

    // Handlers for details modal
    function handleOpenDetails(id) {
        setReports(reports =>
            reports.map(report =>
                report.id === id && report.status === "unread"
                    ? { ...report, status: "unresolved" }
                    : report
            )
        );
        setOpenReportId(id);
    }
    function handleCloseDetails() {
        setOpenReportId(null);
    }
    function handleResolveDetails(id, newStatus) {
        setReports(reports =>
            reports.map(report =>
                report.id === id
                    ? { ...report, status: newStatus || (report.status === "resolved" ? "unresolved" : "resolved") }
                    : report
            )
        );
    }
    function handleDeleteDetails(id) {
        setReports(reports => reports.filter(report => report.id !== id));
        setOpenReportId(null);
    }

    // Find the open report object
    const openReport = reports.find(r => r.id === openReportId);

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto">
            {/* Main content */}
            <main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-auto">
                {/* Show details modal if openReportId is set */}
                {openReportId ? (
                    <ReportDetails
                        report={openReport}
                        onBack={handleCloseDetails}
                        onDelete={handleDeleteDetails}
                        onResolve={handleResolveDetails}
                    />
                ) : (
                    <>
                        {/* Action bar above table when any checkbox is selected */}
                        {selectedIds.length > 0 && (
                            <div className="flex items-center gap-4 py-2">
                                {/* Check icon and text */}
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-[#1E1E1E] text-sm font-medium bg-transparent border-none p-0 cursor-pointer"
                                    style={{ background: "none", border: "none" }}
                                    onClick={handleMarkResolved}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 9.5L8 13.5L14 7.5" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    mark as resolved
                                </button>
                                {/* Trashcan icon for delete*/}
                                <button
                                    type="button"
                                    className="p-0 hover:opacity-70"
                                    title="Delete selected reports"
                                    onClick={handleDeleteSelected}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.5 7.5V13M9 7.5V13M11.5 7.5V13M3 5.5H15M13.5 5.5V14.5C13.5 15.0523 13.0523 15.5 12.5 15.5H5.5C4.94772 15.5 4.5 15.0523 4.5 14.5V5.5M7.5 5.5V4.5C7.5 3.94772 7.94772 3.5 8.5 3.5H9.5C10.0523 3.5 10.5 3.94772 10.5 4.5V5.5" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        )}
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
                                            className="border-t text-sm hover:bg-gray-50 transition cursor-pointer"
                                            style={{ borderTop: '1px solid #d9d9d9' }}
                                            onClick={() => handleOpenDetails(report.id)}
                                        >
                                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
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
                                                    <span className="px-3 py-1 rounded bg-[#EFEFEF] text-[#40863A] border border-[#40863A] text-xs font-medium">
                                                        Marked as resolved
                                                    </span>
                                                )}
                                                {report.status === "unresolved" && (
                                                    <span className="px-3 py-1 rounded bg-[#EFEFEF] text-[#D43131] border border-[#D43131] text-xs font-medium">
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
                    </>
                )}
            </main>

            {/* Responsive FiltersCard: only show when not in details view */}
            {!openReportId && (
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
            )}
        </div>
    );
}

export default Reports;
