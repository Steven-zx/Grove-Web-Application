import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
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

export default function App() {
  return (
    <Router>
      {/* Only show Sidebar and Navbar if not on login/signup/signup-details/signup-complete */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-details" element={<SignUpDetails />} />
        <Route path="/signup-complete" element={<SignUpComplete />} />
        <Route
          path="*"
          element={
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
                  </Routes>
                </main>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}