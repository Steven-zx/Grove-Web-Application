// Gallery Page

import React from "react";

const categories = [
  "All images",
  "Swimming pool",
  "Clubhouse",
  "Playground",
  "Basketball court",
  "Events",
  "Others",
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = React.useState(categories[0]);
  const [images, setImages] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [allImages, setAllImages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch images from API on mount
  React.useEffect(() => {
    let ignore = false;
    
    async function fetchGallery() {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE_URL}/api/gallery`);
        if (!response.ok) {
          throw new Error('Failed to fetch gallery');
        }
        const data = await response.json();
        
        if (ignore) return;
        
        // Filter out folders and map API data to local format
        const mappedImages = (data || [])
          .filter(item => !item.name.endsWith('/') && item.name !== 'payment-proofs')
          .map(item => ({
            id: item.id || item.name,
            url: item.url,
            category: "Others" // Backend doesn't have categories yet
          }));
        
        setAllImages(mappedImages);
        setImages(mappedImages);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
        // Show empty state on error instead of fallback images
        if (!ignore) {
          setAllImages([]);
          setImages([]);
          setLoading(false);
        }
      }
    }
    
    fetchGallery();
    
    return () => {
      ignore = true;
    };
  }, []);

  // Filter by category
  React.useEffect(() => {
    if (activeCategory === "All images") {
      setImages(allImages);
    } else {
      setImages(allImages.filter(img => img.category === activeCategory));
    }
  }, [activeCategory, allImages]);

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

  return (
  <div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto">
    {/* Main content */}
    <main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-auto">
      {/* Category Tabs - hide during loading to prevent flash */}
      {!loading && (
        <nav className="flex gap-4 mb-8 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pb-2 font-medium text-base border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "border-[#1e1e1e]"
                  : "border-transparent text-[#1e1e1e]/50 hover:text-[#1e1e1e]"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      )}

      {/* Image Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (
          // Loading skeleton - show placeholder boxes
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="bg-gray-200 animate-pulse rounded"
              style={{ aspectRatio: '3/4', width: '100%' }}
            />
          ))
        ) : images.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">No images found.</div>
        ) : (
          images.map(img => (
            <button
              key={img.id}
              className="overflow-hidden border border-gray-200 bg-white shadow-sm flex items-center justify-center focus:outline-none cursor-pointer"
              style={{ aspectRatio: '3/4', width: '100%' }}
              onClick={() => openModal(img)}
            >
              <img
                src={img.url}
                alt={img.category}
                className="w-full h-full object-cover"
                style={{ aspectRatio: '3/4', width: '100%', height: '100%' }}
                loading="lazy"
              />
            </button>
          ))
        )}
      </section>

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


