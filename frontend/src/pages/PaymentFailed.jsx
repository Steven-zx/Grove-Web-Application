import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentFailed() {
  const [params] = useSearchParams();
  const reason = params.get('reason') || 'Payment was not completed.';

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-4">Payment Failed</h1>
      <p className="text-gray-700">{reason}</p>
      <div className="mt-6">
        <Link to="/amenities" className="bg-gray-800 text-white px-6 py-2 rounded-lg">Try Again</Link>
      </div>
    </div>
  );
}
