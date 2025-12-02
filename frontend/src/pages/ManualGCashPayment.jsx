import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import gcashQR from '../assets/gcashQR.png';

const ManualGCashPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');

  const [gcashInfo, setGcashInfo] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGCashInfo = async () => {
      if (!bookingId || !amount) {
        setError('Missing booking information');
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get('/api/payments/manual/gcash-info');
        setGcashInfo(response.data);
        setError('');
      } catch (err) {
        console.error('Failed to load GCash info:', err);
        setError(err.response?.data?.error || 'Failed to load GCash information');
      } finally {
        setLoading(false);
      }
    };

    loadGCashInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, amount]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      setProofFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!proofFile) {
      setError('Please upload proof of payment');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('proof', proofFile);
      formData.append('bookingId', bookingId);
      formData.append('amount', amount);

      const response = await api.post('/api/payments/manual/upload-proof', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/your-bookings');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload proof of payment');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Proof Uploaded!</h2>
          <p className="text-gray-600 mb-4">
            Your proof of payment has been submitted successfully. Our admin will review and approve your booking shortly.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">GCash Payment</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-lg font-semibold text-gray-800">Amount to Pay: ₱{Number(amount || 0).toLocaleString()}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {gcashInfo && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Scan GCash QR Code to Pay</h2>
                
                {/* GCash QR Code */}
                <div className="flex justify-center mb-4">
                  <img 
                    src={gcashQR} 
                    alt="GCash QR Code" 
                    className="max-w-xs w-full h-auto rounded-lg shadow-md border-4 border-white"
                  />
                </div>

                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="text-sm text-gray-600 mb-2">Or send to:</p>
                  <p className="text-lg font-bold text-green-600">{gcashInfo.accountName}</p>
                  <p className="text-xl font-bold text-green-600">{gcashInfo.accountNumber}</p>
                </div>

                <p className="text-sm text-gray-600">
                  Scan this QR code using your GCash app to send ₱{Number(amount || 0).toLocaleString()}
                </p>
              </div>

              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-3">📱 How to Pay:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                  <li>Open your GCash app</li>
                  <li>Tap "Scan QR"</li>
                  <li>Scan the QR code above</li>
                  <li>Confirm the amount (₱{Number(amount || 0).toLocaleString()})</li>
                  <li>Complete the payment</li>
                  <li>Take a screenshot of the successful transaction</li>
                  <li>Upload the screenshot below</li>
                </ol>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Proof of Payment (Screenshot)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
                disabled={uploading}
              />
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img src={preview} alt="Proof of payment preview" className="max-w-full h-auto rounded-lg border" />
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                disabled={uploading || !proofFile}
              >
                {uploading ? 'Uploading...' : 'Submit Proof'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualGCashPayment;
