import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!token || !userStr) {
          setStatus('Invalid authentication data. Redirecting...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update authService instance with new data
        authService.token = token;
        authService.user = user;
        
        setStatus('Success! Redirecting to home...');
        
        // Small delay for better UX
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Force reload to ensure auth state is updated
        }, 1000);

      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('Authentication error. Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-4">
          <svg
            className="animate-spin h-12 w-12 text-[#40863A] mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Sign In
        </h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
