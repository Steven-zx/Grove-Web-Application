
import React from "react";
import logo from "../../assets/logo.svg";
import { Menu, Search } from "lucide-react";

export default function MobileNavbar({ onMenuClick }) {
	// Search bar state and logic (copied from Navbar.jsx)
	const SUGGESTED_TERMS = [
		"Pool",
		"Clubhouse",
		"Basketball Court",
		"Playground",
		"Maintenance",
		"Booking",
		"Announcement",
		"Reservation",
		"Security",
		"Sports"
	];
	const [searchQuery, setSearchQuery] = React.useState("");
	const [showSuggestions, setShowSuggestions] = React.useState(false);

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
		setShowSuggestions(true);
	};
	const handleSearchKeyDown = (e) => {
		if (e.key === "Escape") setShowSuggestions(false);
	};
	const handleSuggestionClick = (term) => {
		setSearchQuery(term);
		setShowSuggestions(false);
		// Navigation logic can be added here if needed
	};

	 return (
	 	<nav className="fixed top-0 left-0 right-0 w-full bg-white px-4 pt-4 pb-2 flex flex-col items-center z-40">
			{/* Top: Hamburger + Logo + Text */}
			<div className="flex items-center justify-center w-full relative mb-4">
				{/* Hamburger icon left */}
				<button
					onClick={onMenuClick}
					aria-label="Open menu"
					className="absolute left-0 top-1/2 -translate-y-1/2 p-2"
				>
					<Menu size={28} className="text-gray-900" />
				</button>
				{/* Centered logo and text */}
				<div className="flex flex-col items-center mx-auto">
					<div className="flex items-center gap-2">
						<img src={logo} alt="Logo" className="h-10" />
						<h1 className="text-xl font-bold" style={{ color: '#40863A', fontFamily: 'Montserrat, sans-serif' }}>
							Augustine Grove
						</h1>
					</div>
				</div>
			</div>

			{/* Search bar */}
			<div className="w-full mb-2">
				<div className="relative">
					<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
					<input
						type="text"
						placeholder="Search…"
						value={searchQuery}
						onChange={handleSearchChange}
						onKeyDown={handleSearchKeyDown}
						onFocus={() => setShowSuggestions(true)}
						onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
						className="w-full rounded-full border border-[#D9D9D9] pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E5EBE0]"
						autoComplete="off"
					/>
					{showSuggestions && searchQuery.trim() && (
						<div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto">
							{SUGGESTED_TERMS.filter(term =>
								term.toLowerCase().includes(searchQuery.toLowerCase()) && term.toLowerCase() !== searchQuery.toLowerCase()
							).slice(0, 5).map(term => (
								<div
									key={term}
									className="px-4 py-2 cursor-pointer hover:bg-gray-100"
									onMouseDown={() => handleSuggestionClick(term)}
								>
									{term}
								</div>
							))}
							{SUGGESTED_TERMS.filter(term =>
								term.toLowerCase().includes(searchQuery.toLowerCase()) && term.toLowerCase() !== searchQuery.toLowerCase()
							).length === 0 && (
								<div className="px-4 py-2 text-gray-400">No suggestions</div>
							)}
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
