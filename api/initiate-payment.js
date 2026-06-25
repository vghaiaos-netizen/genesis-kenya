// api/initiate-payment.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, amount, ref } = req.body;

    if (!phone || !amount || !ref) {
      return res.status(400).json({ error: 'Missing required fields: phone, amount, ref' });
    }

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
      return res.status(401).json({ error: 'Tuma authentication failed', details: authData.message });
    }

    const token = authData.data.token;

    // Initiate STK Push
    const callbackUrl = `https://${req.headers.host}/api/payment-callback`;
    const stkRes = await fetch('https://api.tuma.co.ke/payment/stk-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        phone,
        description: `Genesis Application Fee - Ref: ${ref}`,
        callback_url: callbackUrl,
      }),
    });

    const stkData = await stkRes.json();
    if (!stkData.success) {
      return res.status(400).json({ error: 'STK Push failed', details: stkData.message });
    }

    return res.status(200).json({
      success: true,
      payment_id: stkData.data.payment_id,
      merchant_request_id: stkData.data.merchant_request_id,
      checkout_request_id: stkData.data.checkout_request_id,
      message: 'M-Pesa prompt sent to your phone. Enter your PIN to complete payment.',
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
