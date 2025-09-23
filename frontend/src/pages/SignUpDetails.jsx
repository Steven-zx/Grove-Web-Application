
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function SignUpDetails() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if we have signup data from previous step
    const signupData = localStorage.getItem('signupData');
    if (!signupData) {
      navigate('/signup');
    }
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError("");
  }

  async function handleContinue(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');
      
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...signupData,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          address: form.address
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store user session
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('session', JSON.stringify(data.session));
      
      // Clean up temporary signup data
      localStorage.removeItem('signupData');
      
      navigate("/signup-complete");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            <Link to="/signup" className="text-[#1e1e1e]">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <div className="flex-1 h-1 bg-black rounded-full" style={{ maxWidth: '40%' }} />
            <div className="flex-1 h-1 bg-gray-200 rounded-full" />
          </div>
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-8" onSubmit={handleContinue}>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#1e1e1e]">Hi, neighbor! What's your name?</h2>
              <div className="flex gap-6">
                <input 
                  type="text" 
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name" 
                  className="w-full rounded-2xl border border-gray-300 p-5 text-base bg-white" 
                  required 
                />
                <input 
                  type="text" 
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name" 
                  className="w-full rounded-2xl border border-gray-300 p-5 text-base bg-white" 
                  required 
                />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#1e1e1e]">What's your contact number?</h2>
              <input 
                type="text" 
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Mobile number (e.g. 09123456789)" 
                className="w-full rounded-2xl border border-gray-300 p-5 text-base bg-white" 
                required 
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#1e1e1e]">What's your complete address?</h2>
              <input 
                type="text" 
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address (e.g. Block 3, Lot 8, Phase 2)" 
                className="w-full rounded-2xl border border-gray-300 p-5 text-base bg-white" 
                required 
              />
            </div>
            <div className="flex justify-end mt-8">
              <button 
                type="submit" 
                disabled={loading}
                className="rounded-full bg-[#40863A] text-white font-semibold px-10 py-3 text-base hover:bg-[#35702c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
