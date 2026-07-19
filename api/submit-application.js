// api/submit-application.js
import { insertRow } from './db.js';

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

    await insertRow('applications', {
      ref: refNumber,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      county,
      dob: dob || null,
      source: source || null,
      mpesa_code: mpesaCode,
      status: 'pending_verification',
    });

    return res.status(200).json({
      success: true,
      refNumber,
      message: `Application submitted. Reference: ${refNumber}. Our team will contact you within 3–5 business days.`,
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
