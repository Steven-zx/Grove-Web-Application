// Admin Login Page
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import bgImg from "../assets/login-bg.png";
import { authService } from "../services/api";

export default function Login() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Clear error when user types
		if (error) setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			console.log('🔐 Attempting admin login with:', formData.email);
			const response = await authService.login({
				email: formData.email,
				password: formData.password
			});
			// Persist any returned admin info (optional)
			if (response?.admin) {
				localStorage.setItem('adminData', JSON.stringify(response.admin));
			}
			console.log('✅ Login successful');
			navigate('/announcements');
		} catch (error) {
			console.error('❌ Login error:', error);
			
			// Provide specific error messages
			if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
				setError('Cannot connect to server. Please check if the backend is running and VITE_API_BASE_URL is configured correctly in Netlify.');
			} else if (error.message?.includes('401')) {
				setError('Invalid admin credentials. Please check your email and password.');
			} else {
				setError(error.message || 'Login failed. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
			<div className="min-h-screen flex flex-col bg-white">
				{/* Header */}
				<header className="flex items-center px-10 py-8">
					<div className="flex items-center gap-3">
						<img src={logo} alt="Logo" className="h-10" />
						<span className="text-xl font-bold text-[#40863A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
							AUGUSTINE GROVE
						</span>
					</div>
				</header>

			{/* Main content */}
			<main className="flex-1 flex items-center justify-center">
				<div className="relative w-full h-[700px] max-w-4xl flex items-center justify-center">
					{/* Background image */}
					<img src={bgImg} alt="Background" className="absolute inset-0 w-full h-full object-cover rounded-3xl" style={{ zIndex: 0 }} />
					{/* Card */}
					<div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg p-10 flex flex-col items-center">
						<div className="mb-8 text-center">
							<h2 className="text-2xl font-bold text-[#40863A]">Administrator Portal</h2>
							<p className="text-sm text-gray-600 mt-2">Please sign in with your admin credentials</p>
						</div>
						{/* Form */}
						<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
							{error && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
									{error}
								</div>
							)}
							<input 
								type="email" 
								name="email"
								placeholder="Email Address" 
								value={formData.email}
								onChange={handleInputChange}
								required
								className="w-full rounded-xl border border-gray-300 p-4 text-base bg-white" 
							/>
							<input 
								type="password" 
								name="password"
								placeholder="Password" 
								value={formData.password}
								onChange={handleInputChange}
								required
								className="w-full rounded-xl border border-gray-300 p-4 text-base bg-white" 
							/>
							<button 
								type="submit" 
								disabled={isLoading}
								className="w-full rounded-full bg-[#40863A] text-white font-semibold py-3 mt-2 text-base hover:bg-[#35702c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? 'Logging in...' : 'Log in'}
							</button>
						</form>
									{/* Optionally add admin password reset link here if needed */}
					</div>
				</div>
			</main>
		</div>
	);
}
