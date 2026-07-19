// api/submit-application.js
import SheetsHelper from './sheets-helper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, phone, county, dob, source, mpesaCode } = req.body;

    if (!firstName || !lastName || !email || !phone || !county || !mpesaCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const refNumber = `GEN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const sheetsHelper = new SheetsHelper();
    await sheetsHelper.init();

    const result = await sheetsHelper.appendRow('Applications', [
      refNumber,
      firstName,
      lastName,
      email,
      phone,
      county,
      dob || '',
      source || '',
      mpesaCode,
      new Date().toISOString(),
      'pending_verification',
    ]);

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to save application', details: result.error });
    }

    return res.status(200).json({
      success: true,
      refNumber,
      message: `Application submitted. Your reference is ${refNumber}. Our team will contact you within 3–5 business days.`,
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
