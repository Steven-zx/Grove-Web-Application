// Mobile Home Page

import React from "react";
import { NavLink } from "react-router-dom";
import hero1 from "../assets/hero1.webp";
import hero2 from "../assets/hero2.webp";
import hero3 from "../assets/hero3.webp";
import Map from "../components/Map";
import { Shield, Bird, CheckCircle, QrCode } from "lucide-react";
import MobileNavbar from "../components/layout/MobileNavbar";
import QrCodeModal from "../components/QrCode";
import MobileSidebar from "../components/layout/MobileSidebar";

export default function MobileHome() {
  const [qrOpen, setQrOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Prevent body scroll when sidebar is open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const heroImages = [hero1, hero2, hero3];
  const extendedImages = [
    heroImages[heroImages.length - 1],
    ...heroImages,
    heroImages[0],
  ];
  const [heroIndex, setHeroIndex] = React.useState(1);
  const [isTransitioning, setIsTransitioning] = React.useState(true);

  const handlePrev = () => setHeroIndex((p) => (p <= 0 ? 0 : p - 1));
  const handleNext = () =>
    setHeroIndex((p) => (p >= heroImages.length + 1 ? heroImages.length + 1 : p + 1));

  const handleTransitionEnd = () => {
    if (heroIndex === 0) {
      setIsTransitioning(false);
      setHeroIndex(heroImages.length);
    } else if (heroIndex === heroImages.length + 1) {
      setIsTransitioning(false);
      setHeroIndex(1);
    }
  };

  React.useEffect(() => {
    if (!isTransitioning) {
      const id = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(id);
    }
  }, [isTransitioning]);

  const heroTexts = [
    {
      lines: [
        <>Building <span className="italic">Homes,</span></>,
        "Strengthening Community.",
      ],
      color: "#1e1e1e",
    },
    {
      lines: [
        <>Safe <span className="italic">Spaces,</span></>,
        "Lasting Connections.",
      ],
      color: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.25)",
    },
    {
      lines: [
        <>Building <span className="italic">Roots,</span></>,
        "Sharing Futures.",
      ],
      color: "#ffffff",
    },
  ];

  const textIndex =
    heroIndex <= 0
      ? heroTexts.length - 1
      : heroIndex >= heroImages.length + 1
      ? 0
      : heroIndex - 1;

  // Add top padding to prevent content from being hidden behind the fixed MobileNavbar
  return (
    <div className="flex flex-col w-full bg-white pb-8 pt-34">


      {/* Mobile Navbar */}
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Mobile Sidebar (mounted only when open) */}
      {sidebarOpen && <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      {/* Hero Slider */}
      <div className="px-4 mb-6">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
          <div
            className={`flex h-full ${isTransitioning ? "transition-transform duration-700" : ""}`}
            style={{ transform: `translateX(-${heroIndex * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedImages.map((img, i) => (
              <img key={i} src={img} alt="" className="w-full h-full object-cover flex-shrink-0 rounded-xl" />
            ))}
          </div>

          {/* Overlay Text (upper-left) */}
          <div className="absolute top-4 left-4 z-10 text-left">
            <div
              className="px-4 py-3 rounded-xl inline-block"
              style={{ backgroundColor: heroTexts[textIndex].backgroundColor, borderRadius: heroTexts[textIndex].backgroundColor ? '1rem' : undefined }}
            >
              <div className="text-2xl font-medium mb-1" style={{ color: heroTexts[textIndex].color }}>{heroTexts[textIndex].lines[0]}</div>
              <div className="text-lg" style={{ color: heroTexts[textIndex].color }}>{heroTexts[textIndex].lines[1]}</div>
            </div>
          </div>

          {/* Arrows */}
          <button onClick={handlePrev} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow">
            <svg width="18" height="18" stroke="#222" fill="none" strokeWidth="2"><path d="M12 4L6 9L12 14" /></svg>
          </button>
          <button onClick={handleNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow">
            <svg width="18" height="18" stroke="#222" fill="none" strokeWidth="2"><path d="M6 4L12 9L6 14" /></svg>
          </button>
        </div>
      </div>

      {/* Card Grid Section */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Overview Card (left column, spans two rows) */}
          <div className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col justify-between row-span-2 min-h-[260px]">
            <div>
              <div className="text-base font-semibold mb-1">Overview</div>
              <div className="text-xs text-gray-600 mb-2">Augustine Grove is a premiere residential village nestled in Iloilo City, Western Visayas, Philippines, renowned for its quality and elegant living spaces designed for comfort, refinement, and convenience.</div>
            </div>
            <div className="flex justify-between items-center mt-2">
              {[{icon: <Shield size={20} />, label: "SECURE"}, {icon: <Bird size={20} />, label: "PEACEFUL"}, {icon: <CheckCircle size={20} />, label: "CONVENIENT"}].map(({icon, label}) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="border border-gray-300 rounded-lg w-8 h-8 flex items-center justify-center bg-white">{icon}</div>
                  <span className="text-[10px] mt-1 font-medium">{label}</span>
                </div>
              ))}
            </div>
            <NavLink to="/about" className="mt-2 text-xs text-gray-700 font-medium flex items-center justify-end opacity-70">Learn more →</NavLink>
          </div>

          {/* QR Card (right column, top) */}
          <div onClick={() => setQrOpen(true)} className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col items-center justify-center min-h-[120px] cursor-pointer hover:bg-gray-100 transition">
            <QrCode size={28} />
            <span className="text-xs text-center mt-2">Generate QR code to register for entry</span>
          </div>
          {/* Explore Card (right column, below QR) */}
          <div className="rounded-2xl bg-white border border-gray-200 p-4 flex flex-col items-center justify-center min-h-[120px] mt-0">
            <span className="text-xs font-medium text-center">Explore the area with our map</span>
          </div>
        </div>
        <QrCodeModal open={qrOpen} onClose={() => setQrOpen(false)} />
      </div>

      {/* Map */}
      <div className="px-4">
        <div className="rounded-2xl bg-[#EFEFEF] p-2 h-[300px] flex items-center justify-center">
          <Map />
        </div>
      </div>
    </div>
  );
}
