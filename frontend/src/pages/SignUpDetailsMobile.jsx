import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import authService from "../services/authService";

export default function SignUpDetailsMobile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/signup');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await authService.completeProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim()
      });
      navigate("/signup-complete");
    } catch (error) {
      setErrors({ general: error.message || 'Profile completion failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8" />
          <span className="text-lg font-bold text-[#40863A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            AUGUSTINE GROVE
          </span>
        </div>
        <Link to="/" className="font-medium text-[#1e1e1e] text-sm">Go home</Link>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 pt-2 pb-6">
        <form className="w-full max-w-md mx-auto flex flex-col gap-7" onSubmit={handleContinue}>
          {/* Progress bar and back arrow */}
          <div className="flex items-center gap-3 mt-4 mb-6">
            <Link to="/signup" className="text-[#1e1e1e]">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <div className="flex-1 h-1 bg-black rounded-full" style={{ maxWidth: '40%' }} />
            <div className="flex-1 h-1 bg-gray-200 rounded-full" />
          </div>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#1e1e1e]">Hi, neighbor! What's your name?</h2>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className={`w-full rounded-xl border p-4 text-base bg-white ${errors.firstName ? 'border-red-300' : 'border-[#D9D9D9]'}`}
                />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className={`w-full rounded-xl border p-4 text-base bg-white ${errors.lastName ? 'border-red-300' : 'border-[#D9D9D9]'}`}
                />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#1e1e1e]">What's your contact number?</h2>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Mobile number (e.g. 09123456789)"
              className={`w-full rounded-xl border p-4 text-base bg-white ${errors.phone ? 'border-red-300' : 'border-[#D9D9D9]'}`}
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#1e1e1e]">What's your complete address?</h2>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address (e.g. Block 3, Lot 8, Phase 2)"
              className={`w-full rounded-xl border p-4 text-base bg-white ${errors.address ? 'border-red-300' : 'border-[#D9D9D9]'}`}
            />
            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-[#40863A] text-white font-semibold px-8 py-3 text-base hover:bg-[#35702c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
