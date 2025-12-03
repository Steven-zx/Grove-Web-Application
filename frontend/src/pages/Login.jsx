// User Login Page
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import GoogleSignInButton from "../components/GoogleSignInButton";
import logo from "../assets/logo.svg";
import bgImg from "../assets/login-bg.png";

export default function Login() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Clear errors when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
		if (errors.general) {
			setErrors(prev => ({
				...prev,
				general: ''
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		
		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address';
		}
		
		if (!formData.password.trim()) {
			newErrors.password = 'Password is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) return;

		setIsLoading(true);

		try {
			const result = await authService.login(formData);
			console.log('✅ Login successful:', result);
			navigate('/');
		} catch (error) {
			console.error('❌ Login error:', error);
			setErrors({ general: error.message || 'Login failed. Please try again.' });
		} finally {
			setIsLoading(false);
		}
	};

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

			{/* Main content */}
			<main className="flex-1 flex items-center justify-center">
				<div className="relative w-full h-[700px] md:max-w-4xl flex items-center justify-center">
					{/* Background image */}
					<img src={bgImg} alt="Background" className="absolute inset-0 w-full h-full object-cover rounded-3xl" style={{ zIndex: 0 }} />
					{/* Card */}
					<div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg p-10 flex flex-col items-center">
						<h2 className="text-2xl font-bold mb-8 text-center">Welcome back</h2>
						
						{/* Google Sign In Button */}
						<GoogleSignInButton 
							onError={(error) => setErrors({ general: error })}
						/>
						
						<div className="w-full flex items-center my-4 mb-6">
							<div className="flex-1 h-px bg-gray-200" />
							<span className="mx-3 text-gray-400 text-sm">or</span>
							<div className="flex-1 h-px bg-gray-200" />
						</div>
						{/* Form */}
						<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
							{errors.general && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
									{errors.general}
								</div>
							)}
							
							<div>
								<input 
									type="email" 
									name="email"
									placeholder="Email Address" 
									value={formData.email}
									onChange={handleInputChange}
									className={`w-full rounded-xl border p-4 text-base bg-white ${errors.email ? 'border-red-300' : 'border-[#D9D9D9]'}`}
								/>
								{errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
							</div>
							
							<div>
								<input 
									type="password" 
									name="password"
									placeholder="Password" 
									value={formData.password}
									onChange={handleInputChange}
									className={`w-full rounded-xl border p-4 text-base bg-white ${errors.password ? 'border-red-300' : 'border-[#D9D9D9]'}`}
								/>
								{errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
							</div>
							
							<button 
								type="submit" 
								disabled={isLoading}
								className="w-full rounded-full bg-[#40863A] text-white font-semibold py-3 mt-4 text-base hover:bg-[#35702c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? 'Logging in...' : 'Log in'}
							</button>
						</form>
						<div className="w-full flex flex-col items-center mt-6 text-sm">
							<Link to="/forgot-password" className="mb-2 hover:underline" style={{color: '#1E1E1E'}}>Forgot password?</Link>
							<span style={{color: '#1E1E1E'}}>Don’t have an account? <Link to="/signup" className="text-green-600 font-medium hover:underline">Sign up</Link></span>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
