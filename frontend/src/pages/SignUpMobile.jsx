import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import bgImg from "../assets/login-bg.png";
import { authService } from "../services/authService";

export default function SignUpMobile() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
		if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
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
		} else if (formData.password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleContinue = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		setIsLoading(true);
		try {
			const result = await authService.register(formData);
			navigate('/signup-details');
		} catch (error) {
			setErrors({ general: error.message || 'Registration failed. Please try again.' });
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignUp = async () => {
		console.log('Google signup initiated');
	};

	return (
		<div className="min-h-screen flex flex-col bg-white">
			{/* Header */}
			<header className="flex items-center justify-between px-4 pt-6 pb-2">
				<div className="flex items-center gap-2">
					<img src={logo} alt="Logo" className="h-8" />
					<span className="text-lg font-bold text-[#40863A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
						AUGUSTINE GROVE
					</span>
				</div>
				<Link to="/" className="font-semibold text-[#1e1e1e] text-sm">Go home</Link>
			</header>

			{/* Main content */}
			<main className="flex-1 px-4">
				<div className="relative w-full mt-4 rounded-3xl overflow-hidden min-h-[82vh] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[650px] aspect-[4/5]">
					
					{/* Background image */}
					<img
						src={bgImg}
						alt="Background"
						className="absolute inset-0 w-full h-full object-cover"
					/>

					{/* Floating Card */}
					<div className="relative z-10 bg-white rounded-3xl px-6 py-8 min-h-[420px] w-[95%] sm:w-[95%] max-w-sm mx-auto mt-8 shadow-lg">
						<h2 className="text-xl font-bold mb-10 text-center">Join the community</h2>

						{/* Google button */}
						<button
							type="button"
							onClick={handleGoogleSignUp}
							className="flex items-center justify-center gap-2 bg-gray-100 rounded-full py-3 mb-5 w-full font-medium text-[#1e1e1e] hover:bg-gray-200"
						>
							<img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
							Continue with Google
						</button>

						<div className="flex items-center my-2 w-full mb-5">
							<div className="flex-1 h-px bg-gray-200" />
							<span className="mx-2 text-gray-400 text-xs">or</span>
							<div className="flex-1 h-px bg-gray-200" />
						</div>

						{/* Form */}
						<form className="flex flex-col gap-3 mt-2" onSubmit={handleContinue}>
							{errors.general && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-2">
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
									className={`rounded-xl border p-4 text-base w-full bg-white ${errors.email ? "border-red-300" : "border-[#D9D9D9]"}`}
								/>
								{errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
							</div>

							<div>
								<input
									type="password"
									name="password"
									placeholder="Create a password"
									value={formData.password}
									onChange={handleInputChange}
									className={`rounded-xl border p-4 text-base w-full bg-white ${errors.password ? "border-red-300" : "border-[#D9D9D9]"}`}
								/>
								{errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
							</div>

							<div>
								<input
									type="password"
									name="confirmPassword"
									placeholder="Confirm password"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									className={`rounded-xl border p-4 text-base w-full bg-white ${errors.confirmPassword ? "border-red-300" : "border-[#D9D9D9]"}`}
								/>
								{errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="rounded-full bg-[#40863A] text-white font-semibold py-3 mt-3 hover:bg-[#35702c] disabled:opacity-50"
							>
								{isLoading ? "Creating Account..." : "Continue"}
							</button>
						</form>

						{/* Bottom links */}
						<div className="flex flex-col items-center mt-6 text-xs">
							<span style={{color: '#1E1E1E'}}>
								Already have an account?{" "}
								<Link to="/login" className="text-green-600 font-medium hover:underline">
									Sign in
								</Link>
							</span>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}