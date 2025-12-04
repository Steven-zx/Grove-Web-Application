// Admin Announcements Page

import React, { useState, useRef } from "react";
import AnnouncementPreview from "./AnnouncementPreview";
import ManageAnnouncements from "./ManageAnnouncements";
import FiltersCard from "../components/shared/FiltersCard";
import { Image, X } from "lucide-react";
import { announcementService, formatAnnouncementForBackend, galleryService } from "../services/api";
import announcement1 from "../assets/announcement1.png";

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
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

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
        if (files && files[0]) {
            const file = files[0];
            setForm(f => ({ ...f, [name]: file }));
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    }

    function handleFileDrop(e) {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setForm(f => ({ ...f, file }));
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);
        }
    }

    function handleFileClick() {
        fileInputRef.current.click();
    }

    function clearUploadedImage() {
        setForm(f => ({ ...f, file: null }));
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            console.log('📝 Submitting announcement:', form);
            setIsUploading(true);
            
            let imageUrl = announcement1; // Default placeholder
            
            // Upload image if provided
            if (form.file) {
                try {
                    console.log('📤 Uploading image...');
                    const uploadResponse = await galleryService.upload(form.file, { category: 'announcements' });
                    imageUrl = uploadResponse.item?.url || uploadResponse.url;
                    console.log('✅ Image uploaded:', imageUrl);
                } catch (uploadError) {
                    console.error('⚠️ Image upload failed, using placeholder:', uploadError);
                    // Continue with placeholder image if upload fails
                }
            }
            
            // Format the form data for backend
            const announcementData = formatAnnouncementForBackend(form);
            announcementData.image_url = imageUrl;
            
            // Submit to backend
            const response = await announcementService.create(announcementData);
            
            console.log('✅ Announcement created successfully:', response);
            
            // Clean up preview URL
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
                setImagePreviewUrl(null);
            }
            
            // Reset form
            setForm({
                title: "",
                category: "",
                details: "",
                file: null,
                date: "",
                visibility: "Public",
            });
            
            // Show success message
            alert("Announcement posted successfully!");
            
            // Switch to manage tab to see the new announcement
            setActiveTab("manage");
            
        } catch (error) {
            console.error('❌ Error creating announcement:', error);
            alert('Failed to create announcement. Please check your connection and try again.');
        } finally {
            setIsUploading(false);
        }
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
                            className={`px-6 py-2 rounded-xl font-semibold border border-[#D9D9D9] transition-colors duration-150 ${activeTab === "post" ? "text-[#FFFFFF] bg-[#40863A]" : "text-[#1E1E1E] bg-[#FFF]"} hover:cursor-pointer`}
                            onClick={() => setActiveTab("post")}
                        >
                            + Post Announcements
                        </button>
                        <button
                            className={`px-6 py-2 rounded-xl font-semibold border border-[#D9D9D9] transition-colors duration-150 ${activeTab === "manage" ? "text-[#FFFFFF] bg-[#40863A]" : "text-[#1E1E1E] bg-[#FFF]"} hover:cursor-pointer`}
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
                                    <label className="font-bold">Image <span className="text-gray-400 font-normal">(optional)</span></label>
                                    {!imagePreviewUrl ? (
                                        <div
                                            className="border border-gray-300 rounded-lg px-4 py-3 flex items-center gap-2 cursor-pointer bg-[#F9F9F9] hover:bg-[#F3F6F3]"
                                            onClick={handleFileClick}
                                            onDrop={handleFileDrop}
                                            onDragOver={e => e.preventDefault()}
                                        >
                                            <Image color="#40863A" size={22} />
                                            <span className="font-medium text-[#40863A]"><u>Upload image</u></span>
                                            <span className="text-gray-400"> or drag</span>
                                            <input
                                                type="file"
                                                name="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={imagePreviewUrl}
                                                alt="Preview"
                                                className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={clearUploadedImage}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-lg"
                                                title="Remove image"
                                            >
                                                <X size={16} />
                                            </button>
                                            <p className="text-xs text-gray-600 mt-1 truncate">{form.file?.name}</p>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">Placeholder used if none uploaded</p>
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
                                    className="px-6 py-2 rounded-lg font-semibold border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setPreviewMode(true)}
                                    disabled={isUploading}
                                >
                                    Preview
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg font-semibold bg-[#40863A] text-white hover:bg-[#32692C] disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isUploading}
                                >
                                    {isUploading ? 'Uploading...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Manage Announcements Tab */}
                    {activeTab === "manage" && (
                        <ManageAnnouncements />
                    )}
                </main>
                    {/* ...existing code... */}
            </div>
        );
}