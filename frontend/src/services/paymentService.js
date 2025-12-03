const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') + '/api';

const PaymentService = {
  async createGCashPayment(amount, description, bookingId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/payments/gcash/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount,
        description,
        bookingId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment');
    }

    const data = await response.json();
    // Normalize keys so callers can rely on sourceId/checkoutUrl
    return {
      sourceId: data.sourceId || data.source_id || data.id,
      checkoutUrl: data.checkoutUrl || data.checkout_url || data?.data?.attributes?.redirect?.checkout_url,
      raw: data
    };
  },

  async verifyPayment(sourceId) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/payments/verify/${sourceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to verify payment');
    }

    return response.json();
  }
};

export default PaymentService;