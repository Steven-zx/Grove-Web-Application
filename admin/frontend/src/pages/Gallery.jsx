// Admin Gallery Page

import React from "react";
import ConfirmationPopUp from "../components/shared/ConfirmationPopUp";
import { galleryService } from "../services/api";
import entrance from "../assets/entrance.jpg";
import gate from "../assets/gate.jpg";
import gate2 from "../assets/gate2.jpg";
import gate3 from "../assets/gate3.jpg";
import pool from "../assets/pool.jpg";
import pool2 from "../assets/pool2.jpg";
import pool3 from "../assets/pool3.jpg";
import pool4 from "../assets/pool4.jpg";
import basketball from "../assets/basketball.jpg";
import guardhouse from "../assets/guardhouse.jpg";
import clubhouse from "../assets/clubhouse.jpg";

const categories = [
  "All images",
  "Swimming pool",
  "Clubhouse",
  "Playground",
  "Basketball court",
  "Events",
  "Others",
];

// SVG Plus Icon
function PlusIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M10 5V15" stroke="#1e1e1e" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M5 10H15" stroke="#1e1e1e" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

// SVG Trash Icon
function TrashIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M6 7V15C6 15.55 6.45 16 7 16H13C13.55 16 14 15.55 14 15V7" stroke="#1e1e1e" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M4 7H16" stroke="#1e1e1e" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M8 7V5C8 4.45 8.45 4 9 4H11C11.55 4 12 4.45 12 5V7" stroke="#1e1e1e" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

// SVG Check Icon
function CheckIcon({ size = 14, color = '#1e1e1e' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 7.5L6 10L10.5 4.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
// Fallback initial images (local assets) used before backend list loads
const initialImages = [
  { id: 'local-1', url: entrance, category: "Others" },
  { id: 'local-2', url: gate, category: "Others" },
  { id: 'local-3', url: gate2, category: "Others" },
  { id: 'local-4', url: gate3, category: "Others" },
  { id: 'local-5', url: pool, category: "Swimming pool" },
  { id: 'local-6', url: pool2, category: "Swimming pool" },
  { id: 'local-7', url: pool3, category: "Swimming pool" },
  { id: 'local-8', url: pool4, category: "Swimming pool" },
  { id: 'local-9', url: basketball, category: "Basketball court" },
  { id: 'local-10', url: guardhouse, category: "Others" },
  { id: 'local-11', url: clubhouse, category: "Clubhouse" },
];

export default function Gallery() {
  // Backend-ready: images and categories would be fetched
  const [activeCategory, setActiveCategory] = React.useState(categories[0]);
  const [images, setImages] = React.useState(initialImages);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [hoveredId, setHoveredId] = React.useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef();

  // Load gallery list from backend on mount
  React.useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const items = await galleryService.list();
        if (ignore) return;
        // Map to UI shape (no categories from backend yet)
        const mapped = (items || []).map(it => ({ id: it.id, url: it.url, category: 'Others' }));
        setImages(mapped.length ? mapped : initialImages);
      } catch (e) {
        console.warn('Failed to load gallery, using local seed:', e);
        setImages(initialImages);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Filter by category client-side (backend does not categorize yet)
  React.useEffect(() => {
    // No-op: categories are static placeholders; all backend images are "Others"
  }, [activeCategory]);

  // Modal keyboard navigation
  React.useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setModalOpen(false);
      if (!modalOpen || !selectedImage) return;
      const idx = images.findIndex(img => img.id === selectedImage.id);
      if (e.key === "ArrowRight") {
        const nextIdx = (idx + 1) % images.length;
        setSelectedImage(images[nextIdx]);
      }
      if (e.key === "ArrowLeft") {
        const prevIdx = (idx - 1 + images.length) % images.length;
        setSelectedImage(images[prevIdx]);
      }
    }
    if (modalOpen) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [modalOpen, selectedImage, images]);

  function openModal(img) {
    setSelectedImage(img);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setSelectedImage(null);
  }

  // Only trigger file input when plus icon is clicked
  function handleUploadClick() {
    if (fileInputRef.current) fileInputRef.current.click();
  }
  async function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    await uploadFile(file);
    e.target.value = "";
  }

  async function uploadFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    try {
      const res = await galleryService.upload(file);
      const newItem = res?.item;
      if (newItem) {
        setImages(prev => [{ id: newItem.id, url: newItem.url, category: 'Others' }, ...prev.filter(i => !String(i.id).startsWith('local-'))]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image: ' + (err?.message || 'Unknown error'));
    }
  }

  // Drag and drop handlers
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if we're leaving the drop zone entirely
    if (e.currentTarget && !e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      uploadFile(file);
    }
  }

  return (
  <div 
    className={`flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto transition-colors duration-200 ${
      isDragOver ? 'bg-blue-50' : ''
    }`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    {/* Drag overlay */}
    {isDragOver && (
      <div className="fixed inset-0 z-40 bg-blue-100 bg-opacity-90 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-dashed border-blue-400 text-center">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Drop your image here</h3>
          <p className="text-gray-600">Release to upload to gallery</p>
        </div>
      </div>
    )}
    
    {/* Main content */}
    <main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-auto">
      {/* Category Tabs */}
      <nav className="flex gap-4 mb-8 overflow-x-auto items-end">
        {categories.map(cat => (
          <div key={cat} className="flex items-end gap-1">
            <button
              className={`pb-2 font-medium text-base border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "border-[#1e1e1e]"
                  : "border-transparent text-[#1e1e1e]/50 hover:text-[#1e1e1e]"
              }`}
              onClick={() => setActiveCategory(cat)}
              style={{paddingBottom: '2px'}}
            >
              {cat}
            </button>
          </div>
        ))}
        {/* Action button: plus or trash */}
        {selectedIds.length === 0 ? (
          <button
            type="button"
            aria-label="Upload image to gallery"
            className="ml-2 p-0 border-none bg-transparent cursor-pointer flex items-center"
            style={{ lineHeight: 0, paddingBottom: '2px', verticalAlign: 'bottom', display: 'flex', alignItems: 'center', height: '32px' }}
            onClick={handleUploadClick}
          >
            <PlusIcon size={20} />
          </button>
        ) : (
          <>
            <button
              type="button"
              aria-label="Delete selected images"
              className="ml-2 p-0 border-none bg-transparent cursor-pointer flex items-center"
              style={{ lineHeight: 0, paddingBottom: '2px', verticalAlign: 'bottom', display: 'flex', alignItems: 'center', height: '32px' }}
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <TrashIcon size={20} />
            </button>
            <button
              type="button"
              aria-label="Cancel selection"
              className="ml-2 text-base font-medium text-[#1e1e1e] bg-transparent border-none cursor-pointer"
              style={{paddingBottom: '2px'}}
              onClick={() => setSelectedIds([])}
            >
              Cancel
            </button>
          </>
        )}
        {/* Hidden file input for upload */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </nav>

      {/* Image Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">No images found.</div>
        ) : (
          images.map(img => {
            const isSelected = selectedIds.includes(img.id);
            return (
              <div
                key={img.id}
                className="relative group"
                style={{ width: '100%' }}
                onMouseEnter={() => setHoveredId(img.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  className="overflow-hidden border border-gray-200 bg-white shadow-sm flex items-center justify-center focus:outline-none cursor-pointer"
                  style={{ aspectRatio: '3/4', width: '100%' }}
                  onClick={() => !selectedIds.length ? openModal(img) : setSelectedIds(ids => ids.includes(img.id) ? ids.filter(id => id !== img.id) : [...ids, img.id])}
                  tabIndex={0}
                >
                  <img
                    src={img.url}
                    alt={img.category}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '3/4', width: '100%', height: '100%' }}
                    loading="lazy"
                  />
                </button>
                {/* Select circle: show on hover or if selected */}
                {(hoveredId === img.id || isSelected || selectedIds.length > 0) && (
                  <button
                    type="button"
                    aria-label={isSelected ? "Deselect image" : "Select image"}
                    className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center rounded-full border-none shadow focus:outline-none cursor-pointer"
                    style={{ background: isSelected ? '#FFFFFF' : '#D9D9D9', transition: 'background 0.2s', zIndex: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedIds(ids => ids.includes(img.id) ? ids.filter(id => id !== img.id) : [...ids, img.id]);
                    }}
                  >
                    <CheckIcon size={16} color="#1e1e1e" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Confirmation PopUp for delete */}
      <ConfirmationPopUp
        open={confirmDeleteOpen}
        title={`Delete ${selectedIds.length} image${selectedIds.length !== 1 ? 's' : ''}?`}
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          try {
            // Delete backend items only (ignore local seed)
            for (const id of selectedIds) {
              if (!String(id).startsWith('local-')) {
                await galleryService.remove(id);
              }
            }
            setImages(prev => prev.filter(img => !selectedIds.includes(img.id)));
          } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete one or more images.');
          } finally {
            setSelectedIds([]);
            setConfirmDeleteOpen(false);
          }
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />

      {/* Modal/Lightbox */}
      {modalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(30, 32, 34, 0.35)', cursor: 'pointer', transition: 'background 0.2s' }}
          onClick={closeModal}
        >
          <div
            className="relative flex items-center justify-center"
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.category}
              className="shadow-2xl"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', background: '#222' }}
            />
            {/* Single round navigation button: shows next if not last, back if not first */}
            {(() => {
              const idx = images.findIndex(img => img.id === selectedImage.id);
              // Navigation buttons overlayed
              return (
                <>
                  {idx > 0 && (
                    <button
                      onClick={() => setSelectedImage(images[idx - 1])}
                      className="absolute top-1/2 left-8 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white shadow-lg rounded-full hover:bg-[#EFEFEF] focus:outline-none cursor-pointer"
                      style={{ zIndex: 2 }}
                      aria-label="Previous image"
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" />
                        <path d="M19 10L13 16L19 22" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      onClick={() => setSelectedImage(images[idx + 1])}
                      className="absolute top-1/2 right-8 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white shadow-lg rounded-full hover:bg-[#EFEFEF] focus:outline-none cursor-pointer"
                      style={{ zIndex: 2 }}
                      aria-label="Next image"
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" />
                        <path d="M13 10L19 16L13 22" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </>
              );
            })()}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-[#1e1e1e] bg-white rounded-full hover:bg-opacity-80 focus:outline-none border-2 border-white cursor-pointer"
              aria-label="Close"
              style={{ zIndex: 3 }}
            >
              <span className="text-xl">&#10005;</span>
            </button>
          </div>
        </div>
      )}
    </main>
  </div>
  );
}


