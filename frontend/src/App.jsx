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
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import ManualGCashPayment from "./pages/ManualGCashPayment";
import Search from "./pages/Search";

// Mobile Pages
import HomeMobile from "./pages/HomeMobile";
import AnnouncementsMobile from "./pages/AnnouncementsMobile";
import AmenitiesMobile from "./pages/AmenitiesMobile";
import YourBookingsMobile from "./pages/YourBookingsMobile";
import BookingModalMobile from "./pages/BookingModalMobile";
import CalendarMobile from "./pages/CalendarMobile";
import GalleryMobile from "./pages/GalleryMobile";
import AboutMobile from "./pages/AboutMobile";
import LoginMobile from "./pages/LoginMobile";
import SignUpMobile from "./pages/SignUpMobile";
import SignUpDetailsMobile from "./pages/SignUpDetailsMobile";
import ProfileMobile from "./pages/ProfileMobile";
import SearchMobile from "./pages/SearchMobile";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

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
        <Route path="/login" element={isMobile ? <LoginMobile /> : <Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={isMobile ? <SignUpMobile /> : <SignUp />} />
        <Route path="/signup-details" element={isMobile ? <SignUpDetailsMobile /> : <SignUpDetails />} />
        <Route path="/signup-complete" element={<SignUpComplete />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
        <Route path="/payment/manual-gcash" element={<ManualGCashPayment />} />
        <Route path="/search" element={isMobile ? <SearchMobile /> : <Search />} />

        {/* Mobile Routes */}
        {isMobile && (
          <>
            <Route path="/" element={<HomeMobile />} />
            <Route path="/announcements" element={<AnnouncementsMobile />} />
            <Route path="/amenities" element={<AmenitiesMobile />} />
            <Route path="/your-bookings" element={<YourBookingsMobile />} />
            <Route path="/booking-modal" element={<BookingModalMobile />} />
            <Route path="/calendar" element={<CalendarMobile />} />
            <Route path="/gallery" element={<GalleryMobile />} />
            <Route path="/about" element={<AboutMobile />} />
            <Route path="/profile" element={<ProfileMobile />} />
          </>
        )}

        {/* Desktop Routes */}
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
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/search" element={<Search />} />
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
