import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import MobileHome from "./pages/MobileHome";
import AnnouncementsMobile from "./pages/AnnouncementsMobile";
import AmenitiesMobile from "./pages/AmenitiesMobile";
import GalleryMobile from "./pages/GalleryMobile";
import AboutMobile from "./pages/AboutMobile";
import useIsMobile from "./hooks/useIsMobile";
import Announcements from "./pages/Announcements";
import Amenities from "./pages/Amenities";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SignUpDetails from "./pages/SignUpDetails";
import SignUpComplete from "./pages/SignUpComplete";
import About from "./pages/About";
import BookingModal from "./pages/BookingModal";
import YourBookings from "./pages/YourBookings";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function Logout() {
  // Placeholder logout page, replace with real logic
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
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-details" element={<SignUpDetails />} />
        <Route path="/signup-complete" element={<SignUpComplete />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            isMobile ? (
              <Routes>
                <Route path="/" element={<MobileHome />} />
                <Route path="/announcements" element={<AnnouncementsMobile />} />
                <Route path="/amenities" element={<AmenitiesMobile />} />
                <Route path="/gallery" element={<GalleryMobile />} />
                <Route path="/about" element={<AboutMobile />} />
              </Routes>
            ) : (
              <>
                <Sidebar />
                <div className="min-h-screen bg-white text-gray-900 flex flex-col flex-1 ml-64">
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
              </>
            )
          }
        />
      </Routes>
    </Router>
  );
}