// Admin Announcements Page

import React, { useState, useRef } from "react";
import AnnouncementPreview from "./AnnouncementPreview";
import FiltersCard from "../components/shared/FiltersCard";
import { Image } from "lucide-react";

const categories = ["General", "Facilities", "Upgrade"];
const filterCategories = ["All categories", "General", "Facilities", "Upgrade"];
const visibilities = ["Public", "Residents only"];



export default function Announcements() {
    const [activeTab, setActiveTab] = useState("post");
    const [form, setForm] = useState({
        title: "",
        category: "",
        details: "",
        file: null,
        date: "",
        visibility: "Public",
    });
    const [previewMode, setPreviewMode] = useState(false);
    const fileInputRef = useRef();
    const [filters, setFilters] = useState({
        category: "All categories",
        date: "",
        sort: "Newest First",
    });

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFilters(f => ({ ...f, [name]: value }));
    }

    function handleFind(e) {
        e.preventDefault();
        // TODO: backend
        console.log("Finding with filters:", filters);
    }

    function handleChange(e) {
        const { name, value, files } = e.target;
        setForm(f => ({
            ...f,
            [name]: files ? files[0] : value,
        }));
    }

    function handleFileDrop(e) {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setForm(f => ({ ...f, file: e.dataTransfer.files[0] }));
        }
    }

    function handleFileClick() {
        fileInputRef.current.click();
    }

    function handleSubmit(e) {
        e.preventDefault();
        // TODO: Submit to backend
        alert("Announcement posted!");
    }

        if (previewMode) {
            return <AnnouncementPreview form={form} onEdit={() => setPreviewMode(false)} />;
        }

    return (
            <div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto">
                {/* Main content */}
                <main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-auto">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            className={`px-6 py-2 rounded-lg font-semibold text-white bg-[#40863A] ${activeTab === "post" ? "" : "opacity-70"}`}
                            onClick={() => setActiveTab("post")}
                        >
                            + Post Announcements
                        </button>
                        <button
                            className={`px-6 py-2 rounded-lg font-semibold border border-gray-300 bg-white text-gray-800 ${activeTab === "manage" ? "" : "opacity-70"}`}
                            onClick={() => setActiveTab("manage")}
                        >
                            Manage Announcements
                        </button>
                    </div>

                    {/* Post Announcement Form */}
                    {activeTab === "post" && (
                        <form className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="title">Announcement Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Create a short, clear headline"
                                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40863A]"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="category">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40863A]"
                                        required
                                    >
                                        <option value="">Choose type</option>
                                        {categories.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-bold" htmlFor="details">Announcement Details</label>
                                <div className="flex gap-2 mb-2">
                                    <button
                                        type="button"
                                        className="p-1 rounded hover:bg-gray-100 font-bold text-lg"
                                        title="Bold"
                                        onClick={() => {
                                            const textarea = document.getElementById('details');
                                            if (!textarea) return;
                                            const start = textarea.selectionStart;
                                            const end = textarea.selectionEnd;
                                            const value = form.details;
                                            const selected = value.substring(start, end);
                                            const before = value.substring(0, start);
                                            const after = value.substring(end);
                                            // Wrap with ** for markdown bold
                                            const newValue = before + '**' + selected + '**' + after;
                                            setForm(f => ({ ...f, details: newValue }));
                                            // Restore selection
                                            setTimeout(() => {
                                                textarea.focus();
                                                textarea.setSelectionRange(start + 2, end + 2);
                                            }, 0);
                                        }}
                                    >
                                        B
                                    </button>
                                    <button
                                        type="button"
                                        className="p-1 rounded hover:bg-gray-100 font-bold text-lg"
                                        title="Italic"
                                        onClick={() => {
                                            const textarea = document.getElementById('details');
                                            if (!textarea) return;
                                            const start = textarea.selectionStart;
                                            const end = textarea.selectionEnd;
                                            const value = form.details;
                                            const selected = value.substring(start, end);
                                            const before = value.substring(0, start);
                                            const after = value.substring(end);
                                            // Wrap with * for markdown italic
                                            const newValue = before + '*' + selected + '*' + after;
                                            setForm(f => ({ ...f, details: newValue }));
                                            // Restore selection
                                            setTimeout(() => {
                                                textarea.focus();
                                                textarea.setSelectionRange(start + 1, end + 1);
                                            }, 0);
                                        }}
                                    >
                                        &#x1D456;
                                    </button>
                                </div>
                                <textarea
                                    id="details"
                                    name="details"
                                    value={form.details}
                                    onChange={handleChange}
                                    placeholder="Write the main details of your announcement here…"
                                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 min-h-[180px] focus:outline-none focus:ring-2 focus:ring-[#40863A]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                {/* Attachments */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold">Attachments <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <div
                                        className="border border-gray-300 rounded-lg px-4 py-3 flex items-center gap-2 cursor-pointer bg-[#F9F9F9] hover:bg-[#F3F6F3]"
                                        onClick={handleFileClick}
                                        onDrop={handleFileDrop}
                                        onDragOver={e => e.preventDefault()}
                                    >
                                        <Image color="#40863A" size={22} />
                                        <span className="font-medium text-[#40863A]"><u>Upload a file</u></span>
                                        <span className="text-gray-400"> or drag and drop</span>
                                        <input
                                            type="file"
                                            name="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {form.file && <span className="text-sm text-gray-600 mt-1">{form.file.name}</span>}
                                </div>

                                {/* Post Date & Time */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold">Post Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40863A]"
                                    />
                                </div>

                                {/* Visibility */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold">Visibility</label>
                                    <select
                                        name="visibility"
                                        value={form.visibility}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40863A]"
                                    >
                                        {visibilities.map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    className="px-6 py-2 rounded-lg font-semibold border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                                    onClick={() => setPreviewMode(true)}
                                >
                                    Preview
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg font-semibold bg-[#40863A] text-white hover:bg-[#32692C]"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Manage Announcements Tab (placeholder) */}
                    {activeTab === "manage" && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 mx-auto text-center text-gray-500">
                            <h2 className="text-xl font-bold mb-2">Manage Announcements</h2>
                            <p>Feature coming soon.</p>
                        </div>
                    )}
                </main>
                    {/* ...existing code... */}
            </div>
        );
}