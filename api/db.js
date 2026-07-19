// api/db.js — Supabase REST client (no SDK needed)

function headers() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return { url, key };
}

export async function insertRow(table, data) {
  const { url, key } = headers();
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DB insert failed: ${text}`);
  }
  return { success: true };
}

export async function getRows(table) {
  const { url, key } = headers();
  const res = await fetch(`${url}/rest/v1/${table}?select=*&order=submitted_at.desc`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DB query failed: ${text}`);
  }
  return res.json();
}
