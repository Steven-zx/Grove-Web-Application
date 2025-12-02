import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PaymentService from '../services/paymentService';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('Verifying payment...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const sourceId = params.get('source_id') || params.get('id') || localStorage.getItem('pending_payment_source_id');
    if (!sourceId) {
      setError('Missing payment reference.');
      return;
    }

    (async () => {
      try {
        const res = await PaymentService.verifyPayment(sourceId);
        setStatus(`Payment status: ${res?.status || 'unknown'}`);
      } catch (e) {
        setError(e.message || 'Verification failed');
      }
    })();
  }, [params]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-4">Payment Successful</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-green-700">{status}</p>
      )}
      <div className="mt-6">
        <Link to="/your-bookings" className="bg-[#40863A] text-white px-6 py-2 rounded-lg">Go to Your Bookings</Link>
      </div>
    </div>
  );
}
