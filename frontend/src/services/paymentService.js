const API_URL = 'http://localhost:3000/api';

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

    return response.json();
  },

  async verifyPayment(paymentId) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/payments/verify/${paymentId}`, {
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