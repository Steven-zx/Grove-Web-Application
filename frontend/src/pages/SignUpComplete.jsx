import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Bell, Heart } from "lucide-react";

export default function SignUpComplete() {
  const navigate = useNavigate();
  function handleContinue(e) {
    e.preventDefault();
    navigate("/");
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10" />
          <span className="text-xl font-bold text-[#40863A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            AUGUSTINE GROVE
          </span>
        </div>
        <Link to="/" className="font-semibold text-[#1e1e1e]">Go home</Link>
      </header>
      <main className="flex-1 flex flex-col items-center px-4">
        <div className="w-full max-w-3xl mt-8">
          {/* Progress bar and back arrow */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/signup-details" className="text-[#1e1e1e]">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <div className="flex-1 h-1 bg-black rounded-full" style={{ maxWidth: '100%' }} />
          </div>
          <h2 className="text-2xl font-bold mb-8 text-[#1e1e1e]">All done! Welcome to the Augustine Grove online community.</h2>
          <div className="flex flex-col gap-8 mb-12">
            <div className="flex items-start gap-4">
              <Bell size={28} className="mt-1 text-[#1e1e1e]" />
              <div>
                <div className="font-semibold text-lg text-[#1e1e1e]">Watch out for announcements</div>
                <div className="text-gray-400 text-base">Stay updated with posts from the Homeowner’s association.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Heart size={28} className="mt-1 text-[#1e1e1e]" />
              <div>
                <div className="font-semibold text-lg text-[#1e1e1e]">Be helpful</div>
                <div className="text-gray-400 text-base">Report any problems you might notice within the residential village.</div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button onClick={handleContinue} className="rounded-full bg-[#40863A] text-white font-semibold px-10 py-3 text-base hover:bg-[#35702c] transition-colors">Continue</button>
          </div>
        </div>
      </main>
    </div>
  );
}
