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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
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
			alert('Login failed. Please check your credentials.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		// Backend-ready: Replace with actual Google OAuth
		// window.location.href = '/api/auth/google';
		console.log('Google login initiated');
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
						<h2 className="text-2xl font-bold mb-8 text-center">Admin Login</h2>
						{/* Google button */}
						<button 
							type="button" 
							onClick={handleGoogleLogin}
							className="w-full flex items-center justify-center gap-2 bg-gray-100 rounded-full py-3 mb-6 font-medium text-[#1e1e1e] border-none hover:bg-gray-200 transition-colors"
						>
							<img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
							Continue with Google
						</button>
						<div className="w-full flex items-center my-4">
							<div className="flex-1 h-px bg-gray-200" />
							<span className="mx-3 text-gray-400 text-sm">or</span>
							<div className="flex-1 h-px bg-gray-200" />
						</div>
						{/* Form */}
						<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
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
