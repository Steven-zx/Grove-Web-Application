import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

// Desktop Pages
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import Amenities from "./pages/Amenities";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SignUpDetails from "./pages/SignUpDetails";
import SignUpComplete from "./pages/SignUpComplete";
import BookingModal from "./pages/BookingModal";
import YourBookings from "./pages/YourBookings";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

// Mobile Pages
import HomeMobile from "./pages/HomeMobile";
import AnnouncementsMobile from "./pages/AnnouncementsMobile";
import AmenitiesMobile from "./pages/AmenitiesMobile";
import GalleryMobile from "./pages/GalleryMobile";
import AboutMobile from "./pages/AboutMobile";
import LoginMobile from "./pages/LoginMobile";
import SignUpMobile from "./pages/SignUpMobile";
import SignUpDetailsMobile from "./pages/SignUpDetailsMobile";

// Hooks
import useIsMobile from "./hooks/useIsMobile";

function Logout() {
  React.useEffect(() => {
    window.location.href = "/login";
  }, []);
  return <div className="p-8 text-center">Logging out...</div>;
}

export default function App() {
  const isMobile = useIsMobile();

  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={isMobile ? <SignUpMobile /> : <SignUp />} />
        <Route path="/signup-details" element={isMobile ? <SignUpDetailsMobile /> : <SignUpDetails />} />
        <Route path="/signup-complete" element={<SignUpComplete />} />
        <Route path="/admin" element={<Admin />} />

        {/* Mobile Routes */}
        {isMobile && (
          <>
            <Route path="/" element={<HomeMobile />} />
            <Route path="/login" element={<LoginMobile />} />
            <Route path="/announcements" element={<AnnouncementsMobile />} />
            <Route path="/amenities" element={<AmenitiesMobile />} />
            <Route path="/gallery" element={<GalleryMobile />} />
            <Route path="/about" element={<AboutMobile />} />
          </>
        )}

        {/* Desktop Routes */}
        {!isMobile && (
          <>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <div className="flex">
                  <Sidebar />
                  <div className="min-h-screen bg-white text-gray-900 flex-1 flex flex-col ml-64">
                    <header className="fixed top-0 left-64 right-0 z-40">
                      <Navbar />
                    </header>
                    <main className="p-6 pt-20">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/announcements" element={<Announcements />} />
                        <Route path="/amenities" element={<Amenities />} />
                        <Route path="/booking-modal" element={<BookingModal />} />
                        <Route path="/your-bookings" element={<YourBookings />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}
