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

  // Hero images and extended array with clones
  const heroImages = [hero1, hero2, hero3];
  const extendedImages = [
    heroImages[heroImages.length - 1], // last clone
    ...heroImages,
    heroImages[0], // first clone
  ];

  const [heroIndex, setHeroIndex] = React.useState(1); // start at first real slide
  const [isTransitioning, setIsTransitioning] = React.useState(true);

  const handlePrev = () => {
    setHeroIndex((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  const handleNext = () => {
    setHeroIndex((prev) =>
      prev >= heroImages.length + 1 ? heroImages.length + 1 : prev + 1
    );
  };

  // After transition, snap if on clone
  const handleTransitionEnd = () => {
    if (heroIndex === 0) {
      setIsTransitioning(false);
      setHeroIndex(heroImages.length);
    } else if (heroIndex === heroImages.length + 1) {
      setIsTransitioning(false);
      setHeroIndex(1);
    }
  };

  // Re-enable transition after snapping
  React.useEffect(() => {
    if (!isTransitioning) {
      const id = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(id);
    }
  }, [isTransitioning]);

  // Hero overlay texts
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
      backgroundColor: "rgba(30, 30, 30, 0.25)",
    },
    {
      lines: [
        <>Building <span className="italic">Roots,</span></>,
        "Sharing Futures.",
      ],
      color: "#ffffff",
    },
  ];

  // Calculate real text index (since heroIndex includes clones)
  const textIndex =
    heroIndex <= 0
      ? heroTexts.length - 1
      : heroIndex >= heroImages.length + 1
      ? 0
      : heroIndex - 1;

  return (
  <div className="flex flex-col md:flex-row bg-white min-h-screen md:justify-start md:items-start w-full md:max-w-[1400px] md:mx-auto">
    {/* Main content */}
    <main className="flex-1 px-2 md:px-8 flex flex-col gap-6 md:min-w-[350px] md:max-w-auto">
      {/* Hero Section */}
      <section>
        <div className="relative rounded-2xl overflow-hidden inline-block w-full mb-4">
          <div
            className={`flex ${
              isTransitioning ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{ transform: `translateX(-${heroIndex * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Hero ${i}`}
                className="block w-full h-full rounded-2xl object-cover flex-shrink-0"
              />
            ))}
          </div>

          {/* Overlayed text*/}
          <div className="absolute" style={{ top: "5rem", left: "5rem", zIndex: 3 }}>
            <div
              style={{
                backgroundColor: heroTexts[textIndex].backgroundColor || undefined,
                borderRadius: heroTexts[textIndex].backgroundColor ? "1rem" : undefined,
                padding: "1.5rem 2.5rem",
                display: "inline-block",
                maxWidth: "90vw",
                minHeight: "7.5rem",
              }}
            >
              <div
                className="text-2xl md:text-4xl lg:text-6xl font-regular mb-2"
                style={{ color: heroTexts[textIndex].color }}
              >
                {heroTexts[textIndex].lines[0]}
              </div>
              <div
                className="text-lg md:text-2xl lg:text-4xl font-regular"
                style={{ color: heroTexts[textIndex].color }}
              >
                {heroTexts[textIndex].lines[1]}
              </div>
            </div>
          </div>

          {/* left arrow */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white hover:bg-[#EFEFEF] shadow-lg rounded-full group focus:outline-none cursor-pointer transition-colors"
            aria-label="Previous hero image"
            style={{ zIndex: 2 }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" />
              <path
                d="M19 10L13 16L19 22"
                stroke="#222"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* right arrow */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white hover:bg-[#EFEFEF] shadow-lg rounded-full group focus:outline-none cursor-pointer transition-colors"
            aria-label="Next hero image"
            style={{ zIndex: 2 }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" />
              <path
                d="M13 10L19 16L13 22"
                stroke="#222"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left column: Overview, Explore, QR */}
        <div className="flex flex-col gap-5 h-full w-full max-w-xl mx-auto items-center text-lg lg:text-xl">
          {/* Overview Card */}
          <InfoCard
            title={<span className="text-2xl lg:text-3xl font-medium">Overview</span>}
          >
            <span className="block text-sm md:text-base lg:text-lg mb-2">
              Augustine Grove is a premiere residential village nestled in Iloilo
              City, Western Visayas, Philippines, renowned for its quality and
              elegant living spaces designed for comfort, refinement, and
              convenience.
            </span>
            <div className="grid grid-cols-3 gap-10 mt-4 w-full max-w-[300px] mx-auto">
              {[
                {
                  icon: (
                    <Shield
                      className="text-gray-800 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                      strokeWidth={1.5}
                    />
                  ),
                  label: "SECURE",
                },
                {
                  icon: (
                    <Bird
                      className="text-gray-800 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                      strokeWidth={1.5}
                    />
                  ),
                  label: "PEACEFUL",
                },
                {
                  icon: (
                    <CheckCircle
                      className="text-gray-800 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                      strokeWidth={1.5}
                    />
                  ),
                  label: "CONVENIENT",
                },
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
            <NavLink
              to="/about"
              className="mt-4 text-sm md:text-base lg:text-lg text-gray-700 font-medium flex items-center justify-end gap-2 opacity-70 ml-auto"
            >
              Learn more <span>&rarr;</span>
            </NavLink>
          </InfoCard>

          {/* Explore the area card */}
          <div className="rounded-2xl bg-white border border-gray-200 p-5 flex items-center justify-end text-right font-medium text-2xl w-full">
            <span className="w-full text-right">Explore the area with our map</span>
          </div>

          {/* QR code card */}
          <div className="rounded-2xl bg-white border border-gray-200 p-8 flex flex-col gap-4 text-lg lg:text-xl transition-colors duration-200 group hover:bg-[#EFEFEF] items-start w-full min-w-0  cursor-pointer">
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="flex items-center gap-2 flex-nowrap w-full bg-transparent group-hover:bg-[#EFEFEF] rounded-xl p-0 border-0 transition-colors duration-200 text-left cursor-pointer"
            >
              <QrCode
                size={36}
                className="transition-colors duration-200 group-hover:text-[#40863A] text-gray-800 shrink-0"
              />
              <span className="text-left text-base lg:text-lg break-words">
                Generate QR code to register for entry
              </span>
            </button>
          </div>
          <QrCodeModal open={qrOpen} onClose={() => setQrOpen(false)} />
        </div>

        {/* Right: Map (spans 2 columns) */}
        <div className="lg:col-span-2 flex items-center justify-center h-full">
          <div className="rounded-2xl p-2 w-full flex items-center justify-center bg-[#EFEFEF] h-80 md:h-[400px] lg:h-[500px] xl:h-[690px]">
            <Map />
          </div>
        </div>
      </div>
    </main>
  </div>
  );
}