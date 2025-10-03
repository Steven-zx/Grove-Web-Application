import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Announcements from "./pages/Announcements";
import Amenities from "./pages/Amenities";
import Gallery from "./pages/Gallery";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/announcements" replace />} />
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
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/amenities" element={<Amenities />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/reports" element={<Reports />} />
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