import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import bgImg from "../assets/login-bg.png"; 

export default function SignUp() {
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
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		
		if (!formData.email) {
			newErrors.email = 'Email is required';
		}
		if (!formData.password) {
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

		// Backend-ready: Replace with actual API call
		// try {
		//   const response = await fetch('/api/auth/register', {
		//     method: 'POST',
		//     headers: {
		//       'Content-Type': 'application/json',
		//     },
		//     body: JSON.stringify({
		//       email: formData.email,
		//       password: formData.password
		//     }),
		//   });
		//   
		//   if (response.ok) {
		//     // Store temporary registration data for next step
		//     localStorage.setItem('tempRegistration', JSON.stringify({
		//       email: formData.email,
		//       registrationId: data.registrationId
		//     }));
		//     navigate('/signup-details');
		//   } else {
		//     const error = await response.json();
		//     setErrors({ general: error.message });
		//   }
		// } catch (error) {
		//   console.error('Registration error:', error);
		//   setErrors({ general: 'Registration failed. Please try again.' });
		// }

		// Placeholder - simulate registration
		setTimeout(() => {
			setIsLoading(false);
			localStorage.setItem('tempRegistration', JSON.stringify({
				email: formData.email,
				step: 'details'
			}));
			navigate("/signup-details");
		}, 1000);
	};

	const handleGoogleSignUp = async () => {
		// Backend-ready: Replace with actual Google OAuth
		// window.location.href = '/api/auth/google?mode=signup';
		console.log('Google signup initiated');
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
				<div className="relative w-full h-[700px] max-w-4xl flex items-center justify-center">
					{/* Background image */}
					<img src={bgImg} alt="Background" className="absolute inset-0 w-full h-full object-cover rounded-3xl" style={{ zIndex: 0 }} />
					{/* Card */}
					<div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg p-10 flex flex-col items-center">
						<h2 className="text-2xl font-bold mb-8 text-center">Join the community</h2>
						{/* Google button */}
						<button 
							type="button" 
							onClick={handleGoogleSignUp}
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
									<form className="w-full flex flex-col gap-4" onSubmit={handleContinue}>
										<input type="email" placeholder="Email Address" className="w-full rounded-xl border border-[#D9D9D9] p-4 text-base bg-white" />
										<input type="password" placeholder="Create a password" className="w-full rounded-xl border border-[#D9D9D9] p-4 text-base bg-white" />
										<input type="password" placeholder="Confirm password" className="w-full rounded-xl border border-[#D9D9D9] p-4 text-base bg-white" />
										<button type="submit" className="w-full rounded-full bg-[#40863A] text-white font-semibold py-3 mt-2 text-base hover:bg-[#35702c] transition-colors">Continue</button>
									</form>
						<div className="w-full flex flex-col items-center mt-6 text-sm">
							<span className="text-gray-400">Already have an account? <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link></span>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
