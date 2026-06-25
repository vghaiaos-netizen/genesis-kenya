// api/check-payment-status.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { payment_id } = req.query;

  if (!payment_id) {
    return res.status(400).json({ error: 'Missing payment_id' });
  }

  try {
    if (!process.env.TUMA_EMAIL || !process.env.TUMA_API_KEY) {
      return res.status(500).json({ error: 'Tuma credentials missing' });
    }

    // Authenticate with Tuma
    const authRes = await fetch('https://api.tuma.co.ke/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.TUMA_EMAIL,
        api_key: process.env.TUMA_API_KEY,
      }),
    });

    const authData = await authRes.json();
    if (!authData.success) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = authData.data.token;

    // Check payment status via Tuma
    const statusRes = await fetch(`https://api.tuma.co.ke/payment/${payment_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const statusData = await statusRes.json();

    return res.status(200).json({
      success: statusData.success,
      status: statusData.data?.status || 'unknown',
      details: statusData.data,
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
