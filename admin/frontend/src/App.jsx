import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Announcements from "./pages/Announcements";
import Amenities from "./pages/Amenities";
import Gallery from "./pages/Gallery";
import Reports from "./pages/Reports";
import PaymentReview from "./pages/PaymentReview";
import Login from "./pages/Login";
import { authService, clearExpiredTokens } from "./services/api";

// Simple auth guard for protected routes
function RequireAuth({ children }) {
  const authed = authService.isAuthenticated();
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  // Clear any expired tokens on app load
  useEffect(() => {
    const wasExpired = clearExpiredTokens();
    if (wasExpired) {
      console.log('🔄 Expired token cleared, redirecting to login');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/announcements" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <RequireAuth>
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
                      <Route path="/payments" element={<PaymentReview />} />
                    </Routes>
                  </main>
                </div>
              </>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}