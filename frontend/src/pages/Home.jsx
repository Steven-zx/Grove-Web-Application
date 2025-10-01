// Home Page

import React from "react";
import { NavLink } from "react-router-dom";
import hero1 from "../assets/hero1.webp";
import hero2 from "../assets/hero2.webp";
import hero3 from "../assets/hero3.webp";
import InfoCard from "../components/shared/InfoCard";
import Map from "../components/Map";
import { Shield, Bird, CheckCircle, QrCode } from "lucide-react";
import QrCodeModal from "../components/QrCode";

export default function Home() {
  const [qrOpen, setQrOpen] = React.useState(false);
  const heroImages = [hero1, hero2, hero3];
  const [heroIndex, setHeroIndex] = React.useState(0);
  const handlePrev = () => setHeroIndex((i) => (i === 0 ? heroImages.length - 1 : i - 1));
  const handleNext = () => setHeroIndex((i) => (i === heroImages.length - 1 ? 0 : i + 1));

  // Removed dynamic height logic

  return (
    <main className="p-6 bg-white" style={{ marginLeft: '3rem' }}>
      {/* Hero Section */}
      <section>
  <div className="relative rounded-2xl overflow-hidden inline-block w-full mb-4">
          <img
            src={heroImages[heroIndex]}
            alt={`Augustine Grove Hero ${heroIndex + 1}`}
            className="block w-full h-full rounded-2xl object-cover"
          />
          {/* left arrow */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white hover:bg-[#EFEFEF] shadow-lg rounded-full group focus:outline-none cursor-pointer transition-colors"
            aria-label="Previous hero image"
            style={{ zIndex: 2 }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16"/>
              <path d="M19 10L13 16L19 22" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* right arrow */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white hover:bg-[#EFEFEF] shadow-lg rounded-full group focus:outline-none cursor-pointer transition-colors"
            aria-label="Next hero image"
            style={{ zIndex: 2 }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" />
              <path d="M13 10L19 16L13 22" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left column: Overview, Explore, QR */}
        <div
          className="flex flex-col gap-5 h-full w-full max-w-xl mx-auto items-center text-lg lg:text-xl"
        >
          {/* Overview Card */}
          <InfoCard title={<span className="text-2xl lg:text-3xl font-medium">Overview</span>}>
            <span className="block text-sm md:text-base lg:text-lg mb-2">Augustine Grove is a premiere residential village nestled in Iloilo City, Western Visayas, Philippines, renowned for its quality and elegant living spaces designed for comfort, refinement, and convenience.</span>
            <div className="grid grid-cols-3 gap-10 mt-4 w-full max-w-[300px] mx-auto">
              {/* Icon containers */}
              {[
                { icon: <Shield className="text-gray-800 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" strokeWidth={1.5} />, label: "SECURE" },
                { icon: <Bird className="text-gray-800 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" strokeWidth={1.5} />, label: "PEACEFUL" },
                { icon: <CheckCircle className="text-gray-800 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" strokeWidth={1.5} />, label: "CONVENIENT" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className="bg-white border flex justify-center items-center w-[72px] h-[72px]"
                    style={{
                      borderColor: "#d9d9d9",
                      borderRadius: "0.75rem",
                    }}
                  >
                    {icon}
                  </div>
                  <span className="text-base mt-2 font-medium">{label}</span>
                </div>
              ))}
            </div>
            <NavLink to="/about" className="mt-4 text-sm md:text-base lg:text-lg text-gray-700 font-medium flex items-center justify-end gap-2 opacity-70 ml-auto">
              Learn more <span>&rarr;</span>
            </NavLink>
          </InfoCard>

          {/* Explore the area card */}
  <div className="rounded-2xl bg-white border border-gray-200 p-5 flex items-center justify-end text-right font-medium text-2xl w-full">
            <span className="w-full text-right">Explore the area with our map</span>
          </div>

          {/* QR code card */}
          <div className="rounded-2xl bg-white border border-gray-200 p-8 flex flex-col gap-4 text-lg lg:text-xl transition-colors duration-200 group hover:bg-[#EFEFEF] items-start w-full min-w-0  cursor-pointer">
            <button type="button" onClick={() => setQrOpen(true)} className="flex items-center gap-2 flex-nowrap w-full bg-transparent group-hover:bg-[#EFEFEF] rounded-xl p-0 border-0 transition-colors duration-200 text-left cursor-pointer">
              <QrCode size={36} className="transition-colors duration-200 group-hover:text-[#40863A] text-gray-800 shrink-0" />
              <span className="text-left text-lg lg:text-xl break-words">Generate QR code to register for entry</span>
            </button>
          </div>
          <QrCodeModal open={qrOpen} onClose={() => setQrOpen(false)} />
        </div>

        {/* Right: Map (spans 2 columns) */}
        <div className="lg:col-span-2 flex items-center justify-center h-full">
          <div className="rounded-2xl p-2 w-full flex items-center justify-center bg-[#EFEFEF] h-80 md:h-[400px] lg:h-[500px] xl:h-[645px]">
            <Map />
          </div>
        </div>
      </div>
    </main>
  );
}