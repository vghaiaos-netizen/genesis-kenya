// api/tour-registration.js
import { insertRow } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, city } = req.body;

    if (!name || !email || !phone || !city) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await insertRow('tour_registrations', { name, email, phone, city });

    return res.status(200).json({
      success: true,
      message: `Tour registration for ${city} received. We'll send you details via WhatsApp soon.`,
    });
  } catch (error) {
    console.error('Tour registration error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
