import React, { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import AnnouncementCard from "../components/AnnouncementCard";
import FiltersCard from "../components/shared/FiltersCard";
import ConfirmationPopUp from "../components/shared/ConfirmationPopUp";
import announcement1 from "../assets/announcement1.png";
import { announcementService, formatAnnouncementForAdmin } from "../services/api";

// Placeholder announcements data
const announcements = [
	{
		id: 1,
		author: "Admin",
		date: "2025-08-21T20:49:00",
		image: announcement1,
		details:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
		status: "",
	},
	{
		id: 2,
		author: "Admin",
		image: announcement1,
		details:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
		status: "Scheduled",
	},
	{
		id: 3,
		author: "Admin",
		date: "2025-08-21T20:49:00",
		image: announcement1,
		details:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
		status: "",
	},
	{
		id: 4,
		author: "Admin",
		image: announcement1,
		details:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
		status: "Scheduled",
	},
];

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

  // Sidebar data
  const categories = ["General", "Facilities", "Upgrade"];
  const filters = {
    category: "All categories",
    date: "",
    sort: "Newest First",
  };
  function handleFilterChange() {}
  function handleFind(e) { e.preventDefault(); }

export default function ManageAnnouncements() {
	const [editId, setEditId] = useState(null);
	const [announcementList, setAnnouncementList] = useState([]);
	const [confirmDeleteId, setConfirmDeleteId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);


	// Fetch announcements from backend
	useEffect(() => {
		fetchAnnouncements();
	}, []);

	async function fetchAnnouncements() {
		try {
			setLoading(true);
			setError(null);
			
			console.log('📊 Fetching announcements from backend...');
			
			const data = await announcementService.getAll();
			
			// Format announcements for admin UI
			const formattedAnnouncements = data.map(formatAnnouncementForAdmin);
			
			console.log('✅ Loaded announcements:', formattedAnnouncements);
			
			setAnnouncementList(formattedAnnouncements);
		} catch (err) {
			console.error('❌ Error fetching announcements:', err);
			setError('Failed to load announcements. Please try again.');
		} finally {
			setLoading(false);
		}
	}

	function handleEdit(id) {
		setEditId(id);
	}

	function handleDelete(id) {
		setConfirmDeleteId(id);
	}

	async function confirmDelete() {
		try {
			console.log('🗑️ Deleting announcement:', confirmDeleteId);
			
			await announcementService.delete(confirmDeleteId);
			
			console.log('✅ Announcement deleted successfully');
			
			// Remove from local list
			setAnnouncementList((list) => list.filter((a) => a.id !== confirmDeleteId));
			setConfirmDeleteId(null);
			
			// Refresh from server to confirm deletion
			fetchAnnouncements();
		} catch (err) {
			console.error('❌ Error deleting announcement:', err);
			
			if (err.message.includes('403') || err.message.includes('401') || err.message.includes('Invalid or expired token')) {
				alert('Your session has expired. Please log in again.');
				// Redirect to login
				window.location.href = '/login';
			} else {
				alert('Failed to delete announcement. Please try again.');
			}
		}
	}

	function cancelDelete() {
		setConfirmDeleteId(null);
	}

	const editing = announcementList.find((a) => a.id === editId);
	if (editing) {
		return (
			<div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto">
				<main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-[900px]">
					<form
						className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6"
						onSubmit={(e) => {
							e.preventDefault();
							setEditId(null);
						}}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="flex flex-col gap-2">
								<label className="font-bold" htmlFor="title">
									Announcement Title
								</label>
								<input
									type="text"
									id="title"
									name="title"
									value={editing.details}
									readOnly
									className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label className="font-bold" htmlFor="category">
									Category
								</label>
								<input
									type="text"
									id="category"
									name="category"
									value={editing.status || "General"}
									readOnly
									className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<label className="font-bold" htmlFor="details">
								Announcement Details
							</label>
							<textarea
								id="details"
								name="details"
								value={editing.details}
								readOnly
								className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 min-h-[180px]"
							/>
						</div>
						<div className="flex justify-end gap-4 mt-6">
							<button
								type="button"
								className="px-6 py-2 rounded-lg font-semibold border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
								onClick={() => setEditId(null)}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-6 py-2 rounded-lg font-semibold bg-[#40863A] text-white hover:bg-[#32692C]"
							>
								Save
							</button>
						</div>
					</form>
				</main>
			</div>
		);
	}
        // Sidebar data
        const categories = ["General", "Facilities", "Upgrade"];
        const filters = {
            category: "All categories",
            date: "",
            sort: "Newest First",
        };
        function handleFilterChange() {}
        function handleFind(e) { e.preventDefault(); }

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-lg text-gray-600">Loading announcements...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<div className="text-lg text-red-600">{error}</div>
				<button 
					onClick={fetchAnnouncements}
					className="px-4 py-2 bg-[#40863A] text-white rounded-lg hover:bg-[#32692C]"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto">
			<main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-[900px]">
				{/* Debug button removed */}
				{announcementList.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-lg text-gray-600 mb-4">No announcements found</div>
						<div className="text-sm text-gray-500">Create your first announcement using the "Post Announcements" tab.</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{announcementList.map((a) => (
							<div
								key={a.id}
								className="bg-white rounded-2xl border border-gray-200 p-0 overflow-hidden flex flex-col"
							>
								<img
									src={a.image_url || announcement1}
									alt="Announcement"
									className="w-full h-48 object-cover"
								/>
								<div className="px-5 pt-4 pb-2 flex justify-between items-center">
									<span className="font-bold">{a.author}</span>
									<span className="text-xs text-gray-500">
										{formatDate(a.date)}
									</span>
									{a.status && (
										<span className="ml-2 px-2 py-1 rounded bg-gray-100 text-xs text-gray-500 border border-gray-300">
											{a.status}
										</span>
									)}
								</div>
								<div className="px-5 pb-2 text-sm text-gray-700">
									<div className="font-semibold mb-1">{a.title}</div>
									<div>{a.details}</div>
									<span className="text-green-700 cursor-pointer ml-1">
										... see more
									</span>
								</div>
								<div className="px-5 pb-4 flex gap-2">
									<button
										className="flex items-center gap-1 px-4 py-2 rounded-lg border border-green-700 text-green-700 font-semibold bg-white hover:bg-green-50"
										onClick={() => handleEdit(a.id)}
									>
										<Pencil size={18} className="mr-1" />
										Edit
									</button>
									<button
										className="flex items-center gap-1 px-4 py-2 rounded-lg border border-red-500 text-red-500 font-semibold bg-white hover:bg-red-50"
										onClick={() => handleDelete(a.id)}
									>
										<Trash size={18} className="mr-1" />
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
				<ConfirmationPopUp
					open={!!confirmDeleteId}
					title="Delete Announcement?"
					description="This action cannot be undone. Are you sure you want to delete this announcement?"
					confirmText="Delete"
					cancelText="Cancel"
					onConfirm={confirmDelete}
					onCancel={cancelDelete}
				/>
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
