

import React from "react";
import MobileNavbar from "../components/layout/MobileNavbar";
import MobileSidebar from "../components/layout/MobileSidebar";
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

const initialImages = [
  { id: 1, url: entrance, category: "Others" },
  { id: 2, url: gate, category: "Others" },
  { id: 3, url: gate2, category: "Others" },
  { id: 4, url: gate3, category: "Others" },
  { id: 5, url: pool, category: "Swimming pool" },
  { id: 6, url: pool2, category: "Swimming pool" },
  { id: 7, url: pool3, category: "Swimming pool" },
  { id: 8, url: pool4, category: "Swimming pool" },
  { id: 9, url: basketball, category: "Basketball court" },
  { id: 10, url: guardhouse, category: "Others" },
  { id: 11, url: clubhouse, category: "Clubhouse" },
];

export default function GalleryMobile() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState(categories[0]);
  const [images, setImages] = React.useState(initialImages);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);

  React.useEffect(() => {
    let filtered = initialImages;
    if (activeCategory !== "All images") {
      filtered = filtered.filter(img => img.category === activeCategory);
    }
    setImages(filtered);
  }, [activeCategory]);

  function openModal(img) {
    setSelectedImage(img);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setSelectedImage(null);
  }

  return (
    <div className="flex flex-col w-full bg-white pb-8 pt-34">
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Category Tabs */}
        <nav className="fixed top-[7.5rem] z-30 bg-white flex flex-wrap justify-center gap-x-3 gap-y-1 mb-4 text-sm py-2">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pb-1 px-2 font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
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

        {/* Image Grid */}
        <section className="grid grid-cols-2 gap-2 px-2 pt-16">
          {images.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">No images found.</div>
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
              style={{ maxWidth: '95vw', maxHeight: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.category}
                className="shadow-2xl rounded-lg"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', background: '#222' }}
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center text-[#1e1e1e] bg-white rounded-full hover:bg-opacity-80 focus:outline-none border-2 border-white cursor-pointer"
                aria-label="Close"
                style={{ zIndex: 3 }}
              >
                <span className="text-xl">&#10005;</span>
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
