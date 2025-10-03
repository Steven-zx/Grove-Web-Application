// Admin Amenities (Bookings Management) Page
// Cleaned: removed redundant client-side filtering/pagination (service already handles these)
// Replace service implementations with real API calls later.

import React, { useEffect, useState } from "react";
import { fetchAdminBookings, updateBookingStatus, deleteBookings } from "../services/bookings";

/* Data Loading Notes ---------------------------------------------------------
   We now source mock data via ../services/bookings instead of hardcoding here.
   To connect to the real backend later:
     1. Replace fetchAdminBookings implementation with actual fetch.
     2. On user-side booking creation, push (websocket/SSE) or re-call loadBookings().
     3. Use env var for base URL: import.meta.env.VITE_API_URL.
*/

/* ----------------------------- Helper Components ---------------------------- */
const AMENITY_FILTERS = [
    { key: "all", label: "All Bookings" },
    { key: "clubhouse", label: "Clubhouse" },
    { key: "swimming pool", label: "Swimming pool" },
    { key: "basketball court", label: "Basketball court" },
];

const statusStyles = {
    Accepted: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
};
const STATUSES = Object.keys(statusStyles);

function StatusBadge({ value, interactive = false, onChange }) {
    const cls = statusStyles[value] || "bg-gray-100 text-gray-800";
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (!open) return;
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    if (!interactive) return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium ${cls}`}>{value}</span>;

    function choose(status) {
        onChange?.(status);
        setOpen(false);
    }

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium focus:outline-none ${cls} w-full max-w-[150px] justify-between`}
            >
                {value}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="absolute z-20 bg-white rounded-md border border-gray-200 shadow-lg mt-1 w-36 py-1">
                    {STATUSES.map(s => (
                        <button
                            key={s}
                            onClick={(e) => { e.stopPropagation(); choose(s); }}
                            className={`w-full text-left text-xs px-3 py-2 hover:bg-gray-50 ${s === value ? 'font-semibold text-gray-900' : 'text-gray-600'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function Filters({ active, onChange }) {
    return (
        <div className="flex gap-3 flex-wrap">
            {AMENITY_FILTERS.map(f => {
                const isActive = active === f.key;
                return (
                    <button
                        key={f.key}
                        onClick={() => onChange(f.key)}
                        className={`rounded-[10px] px-4 py-2 text-sm font-medium border transition-colors ${
                            isActive
                                ? "bg-green-600 text-white border-green-600 shadow-sm"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        {f.label}
                    </button>
                );
            })}
        </div>
    );
}

function BookingDetails({ booking }) {
    if (!booking) {
        return (
            <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm text-sm text-gray-500">
                Select a booking to view details
            </div>
        );
    }
    return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-gray-800 leading-tight">{booking.name}</h2>
                <StatusBadge value={booking.status} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div className="space-y-1">
                    <p className="font-xs text-gray-400">Address / Lot & Block Number</p>
                    <p className="text-gray-800">{booking.address}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-xs text-gray-400">Contact Number</p>
                    <p className="text-gray-800">{booking.contact}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-xs text-gray-400">Email Address</p>
                    <p className="text-gray-800 break-all">{booking.email}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-xs text-gray-400">Amenity</p>
                    <p className="text-gray-800">{booking.amenity}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-xs text-gray-400">Date</p>
                    <p className="text-gray-800">{booking.date}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-xs text-gray-400">Time</p>
                    <p className="text-gray-800">{booking.time}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-xs text-gray-400">Purpose of Booking</p>
                    <p className="text-gray-800">{booking.purpose}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-xs text-gray-400">No. of Attendees</p>
                    <p className="text-gray-800">{booking.attendees}</p>
                </div>
                <div className="col-span-2 space-y-1">
                    <p className="font-xs text-gray-400">Additional Notes</p>
                    <p className="text-gray-800 whitespace-pre-line">{booking.notes || "--"}</p>
                </div>
            </div>
        </div>
    );
}

function MiniCalendar() {
    const [date, setDate] = useState(new Date());
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const today = new Date();

    const days = [];
    // pad start (weekday: 0=Sun)
    for (let i = 0; i < monthStart.getDay(); i++) days.push(null);
    for (let d = 1; d <= monthEnd.getDate(); d++) days.push(new Date(date.getFullYear(), date.getMonth(), d));

    function changeMonth(offset) {
        setDate(d => new Date(d.getFullYear(), d.getMonth() + offset, 1));
    }

    const monthLabel = date.toLocaleString(undefined, { month: "long" });

    return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 rounded hover:bg-gray-100"
                    aria-label="Previous month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="font-semibold text-sm">{monthLabel}</h3>
                <button
                    onClick={() => changeMonth(1)}
                    className="p-2 rounded hover:bg-gray-100"
                    aria-label="Next month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-500 mb-1">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-center py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs">
                {days.map((d, i) => {
                    if (!d) return <div key={i} className="py-2" />;
                    const isToday = d.toDateString() === today.toDateString();
                    return (
                        <div
                            key={i}
                            className={`text-center py-1.5 rounded cursor-default select-none ${
                                isToday ? "bg-green-600 text-white font-medium" : "hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                            {d.getDate()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ------------------------------- Main Component ------------------------------ */
export default function Amenities() {
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState([]); // page rows from service
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const pageSize = 10;

    const selectedBooking = rows.find(r => r.id === selectedId) || null;

    async function handleStatusChange(id, status) {
        // Optimistic update; rollback if backend (future) fails
        const prev = rows;
        setRows(prevRows => prevRows.map(r => (r.id === id ? { ...r, status } : r)));
        try {
            await updateBookingStatus(id, status); // placeholder mock now
        } catch (e) {
            console.error(e);
            setRows(prev); // rollback
        }
    }

    function toggleRowSelection(id) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }

    function toggleAllPage() {
        const pageIds = rows.map(r => r.id);
        const allSelected = pageIds.every(id => selectedIds.has(id));
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (allSelected) {
                pageIds.forEach(id => next.delete(id));
            } else {
                pageIds.forEach(id => next.add(id));
            }
            return next;
        });
    }

    async function deleteSelected() {
        if (selectedIds.size === 0) return;
        if (!window.confirm(`Delete ${selectedIds.size} booking(s)?`)) return;
        const ids = Array.from(selectedIds);
        const prev = rows;
        // Optimistic removal
        setRows(prevRows => prevRows.filter(r => !selectedIds.has(r.id)));
        if (selectedId && selectedIds.has(selectedId)) setSelectedId(null);
        setSelectedIds(new Set());
        try {
            await deleteBookings(ids); // mock now
        } catch (e) {
            console.error(e);
            setRows(prev); // rollback on failure
        }
    }

    // Pagination indicator calculations (mocked total count)
    const pageStart = (page - 1) * pageSize + 1;
    const pageEnd = Math.min(page * pageSize, total || 0);
    const lastPage = Math.max(1, Math.ceil((total || 0) / pageSize));

    useEffect(() => {
        setPage(1); // reset page on filter change
    }, [filter]);

    useEffect(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const { data, total } = await fetchAdminBookings({ amenity: filter, page, pageSize });
                if (!ignore) {
                    setRows(data);
                    setTotal(total);
                    if (!data.some(d => d.id === selectedId)) {
                        setSelectedId(data[0]?.id || null);
                    }
                }
            } catch (e) {
                if (!ignore) setError(e.message || 'Failed to load');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true; };
    }, [filter, page, pageSize]);

    return (
        <div className="flex flex-col bg-white h-screen overflow-hidden w-full md:max-w-[1400px] md:mx-auto px-4 md:px-8 py-4 gap-4">
            {/* Filters Row */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <Filters active={filter} onChange={setFilter} />
                <div className="flex items-center gap-4 text-sm text-gray-600 ml-auto">
                    <div>{loading ? 'Loading…' : `${Math.min(pageStart, total || 0)}-${Math.min(pageEnd, total || 0)} of ${total}`}</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Previous page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                            disabled={page === lastPage}
                            className="p-2 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {selectedIds.size > 0 && !loading && (
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-2 text-sm">
                    <span className="text-gray-700">{selectedIds.size} selected</span>
                    <button
                        onClick={deleteSelected}
                        className="text-red-600 hover:text-red-700 font-medium"
                    >Delete</button>
                </div>
            )}

            {/* Table + Sidebar Row */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-stretch flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col">
                        <table className="w-full text-sm border-collapse select-none">
                            <thead>
                                <tr className="text-s tracking-wide text-gray-600 bg-white">
                                    <th className="w-10 p-4 font-medium">
                                        <input
                                            type="checkbox"
                                            aria-label="Select page"
                                            onChange={toggleAllPage}
                                            ref={el => {
                                                if (!el) return;
                                                const pageIds = rows.map(r => r.id);
                                                const allSelected = pageIds.length>0 && pageIds.every(id => selectedIds.has(id));
                                                const someSelected = pageIds.some(id => selectedIds.has(id)) && !allSelected;
                                                el.checked = allSelected;
                                                el.indeterminate = someSelected;
                                            }}
                                        />
                                    </th>
                                    <th className="p-4 font-medium text-left">Name</th>
                                    <th className="p-4 font-medium text-left">Amenity</th>
                                    <th className="p-4 font-medium text-left">Date</th>
                                    <th className="p-4 font-medium text-left">Time</th>
                                    <th className="p-4 font-medium text-left">User type</th>
                                    <th className="p-4 font-medium text-left w-40">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {error && (
                                    <tr><td colSpan={7} className="p-6 text-center text-red-500 text-sm">{error}</td></tr>
                                )}
                                {loading && !error && (
                                    <tr><td colSpan={7} className="p-6 text-center text-gray-500 text-sm">Loading…</td></tr>
                                )}
                                {!loading && !error && rows.map(row => {
                                    const isSelected = row.id === selectedId;
                                    return (
                                        <tr
                                            key={row.id}
                                            onClick={() => setSelectedId(row.id)}
                                            className={`cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-gray-50" : ""}`}
                                        >
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    aria-label={`Select booking ${row.id}`}
                                                    checked={selectedIds.has(row.id)}
                                                    onChange={(e) => { e.stopPropagation(); toggleRowSelection(row.id); }}
                                                    onClick={(e)=> e.stopPropagation()}
                                                />
                                            </td>
                                            <td className="p-4 font-medium text-gray-800 whitespace-nowrap">{row.name}</td>
                                            <td className="p-4 text-gray-600 whitespace-nowrap">{row.amenity}</td>
                                            <td className="p-4 text-gray-600 whitespace-nowrap">{row.date}</td>
                                            <td className="p-4 text-gray-600 whitespace-nowrap">{row.time}</td>
                                            <td className="p-4 text-gray-600 whitespace-nowrap">{row.userType}</td>
                                            <td className="p-4 w-40">
                                                <StatusBadge
                                                    value={row.status}
                                                    interactive
                                                    onChange={(s) => handleStatusChange(row.id, s)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <aside className="w-full md:w-[380px] flex flex-col gap-6 self-stretch">
                    <div className="flex flex-col h-full gap-6">
                        <BookingDetails booking={selectedBooking} />
                        <MiniCalendar />
                    </div>
                </aside>
            </div>
        </div>
    );
}