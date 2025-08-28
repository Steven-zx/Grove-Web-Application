import React from "react";
import { NavLink } from "react-router-dom";
import heroImg from "../assets/hero.png";
import InfoCard from "../components/shared/InfoCard";
import Map from "../components/Map";
import { Shield, Bird, CheckCircle, QrCode } from "lucide-react";
import QrCodeModal from "../components/QrCode";

export default function Home() {
  const [qrOpen, setQrOpen] = React.useState(false);

  return (
  <main className="p-6 bg-white">
      {/* Hero Section */}
      <section>
        <div className="relative rounded-2xl overflow-hidden inline-block w-full mb-4 max-h-180">
          <img
            src={heroImg}
            alt="Augustine Grove Hero"
            className="block w-full h-auto rounded-2xl max-h-180 object-cover"
          />
        </div>
      </section>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-[650px]">
    {/* Left column: Overview, Explore, QR */}
  <div className="flex flex-col gap-6 h-full max-w-xs w-full ml-auto items-end">
          {/* Overview Card */}
          <InfoCard title="Overview">
            Augustine Grove is a premiere residential village nestled in Iloilo City, Western Visayas, Philippines, renowned for its quality and elegant living spaces designed for comfort, refinement, and convenience.
            <div className="flex gap-4 mt-4 justify-center">
              {/* Icon containers */}
              {[
                { icon: <Shield size={24} className="text-gray-800" />, label: "SECURE" },
                { icon: <Bird size={24} className="text-gray-800" />, label: "PEACEFUL" },
                { icon: <CheckCircle size={24} className="text-gray-800" />, label: "CONVENIENT" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className="bg-white border flex justify-center items-center"
                    style={{
                      borderColor: "#d9d9d9",
                      borderRadius: "0.75rem",
                      padding: "0.75rem",
                      minWidth: "60px",
                    }}
                  >
                    {icon}
                  </div>
                  <span className="text-xs mt-2 font-medium">{label}</span>
                </div>
              ))}
            </div>
              <NavLink to="/about" className="mt-4 text-gray-700 font-medium flex items-center justify-end gap-2 opacity-50 ml-auto">
                Learn more <span>&rarr;</span>
              </NavLink>
          </InfoCard>

          {/* Explore the area card */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5 flex items-center justify-end text-right font-medium text-2xl">
            <span className="w-full text-right">Explore the area<br />with our map</span>
          </div>

          {/* QR code card */}
          <div className="rounded-2xl bg-white border border-gray-200 p-5 flex flex-col gap-2 text-sm transition-colors duration-200 group hover:bg-[#EFEFEF] items-start">
            <button type="button" onClick={() => setQrOpen(true)} className="flex items-center gap-2 flex-nowrap w-full bg-transparent group-hover:bg-[#EFEFEF] rounded-xl p-0 border-0 transition-colors duration-200 text-left">
              <QrCode size={28} className="transition-colors duration-200 group-hover:text-[#40863A] text-gray-800" />
              <span className="whitespace-nowrap text-left">Generate QR code to register<br />for entry as visitor</span>
            </button>
          </div>
          <QrCodeModal open={qrOpen} onClose={() => setQrOpen(false)} />
        </div>

        {/* Right: Map (spans 2 columns) */}
        <div className="lg:col-span-2 flex items-center justify-center h-full">
        <div
          className="rounded-2xl p-2 w-full h-full flex items-center justify-center"
          style={{ backgroundColor: "#EFEFEF" }}
        >
          <Map />
        </div>
        </div>
      </div>
    </main>
  );
}