// api/payment-callback.js
import SheetsHelper from './sheets-helper.js';

const paymentCache = new Map(); // Simple deduplication

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payment_id, merchant_request_id, checkout_request_id, status, mpesa_receipt_number, amount } = req.body;

    // Deduplication: prevent duplicate processing
    if (paymentCache.has(payment_id)) {
      return res.status(200).json({ success: true, message: 'Already processed' });
    }
    paymentCache.set(payment_id, true);

    const sheetsHelper = new SheetsHelper();
    await sheetsHelper.init();

    // Extract ref from description or use payment_id
    const ref = merchant_request_id || `PAY-${payment_id}`;

    const result = await sheetsHelper.appendRow('Payment Log', [
      ref,
      payment_id,
      amount,
      status,
      mpesa_receipt_number || 'N/A',
      new Date().toISOString(),
    ]);

    if (!result.success) {
      console.error('Sheets write failed:', result.error);
      return res.status(500).json({ error: 'Failed to log payment' });
    }

    return res.status(200).json({ success: true, message: 'Payment logged' });
  } catch (error) {
    console.error('Payment callback error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
