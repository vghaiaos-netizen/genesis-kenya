// api/admin.js — Password-gated admin panel
import { getRows } from './db.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Shady868';

function loginPage(wrong) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Genesis — Admin</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0a;color:#e8e0d0;min-height:100vh;display:flex;align-items:center;justify-content:center}
  .card{background:#141414;border:1px solid #2a2a2a;border-radius:12px;padding:2.5rem;width:100%;max-width:360px}
  h1{font-size:1rem;font-weight:700;letter-spacing:0.12em;color:#c9a96e;margin-bottom:0.4rem}
  p{font-size:0.78rem;color:#888;margin-bottom:1.8rem}
  input{width:100%;padding:0.75rem 1rem;background:#0a0a0a;border:1px solid #2a2a2a;border-radius:8px;color:#e8e0d0;font-size:0.9rem;outline:none;margin-bottom:1rem}
  input:focus{border-color:#c9a96e}
  button{width:100%;padding:0.75rem;background:#c9a96e;color:#0a0a0a;font-weight:700;font-size:0.85rem;letter-spacing:0.08em;border:none;border-radius:8px;cursor:pointer}
  .err{font-size:0.78rem;color:#e05252;margin-bottom:1rem}
</style>
</head>
<body>
<div class="card">
  <h1>GENESIS ADMIN</h1>
  <p>Applications dashboard</p>
  ${wrong ? '<p class="err">Incorrect password.</p>' : ''}
  <form method="GET" action="/api/admin">
    <input type="password" name="p" placeholder="Enter password" autofocus/>
    <button type="submit">Access →</button>
  </form>
</div>
</body>
</html>`;
}

function dashboardPage(rows) {
  const cols = ['ref','first_name','last_name','email','phone','county','dob','source','mpesa_code','submitted_at','status'];
  const labels = ['Ref','First','Last','Email','Phone','County','DOB','Source','M-Pesa Code','Submitted','Status'];

  const tableRows = rows.length === 0
    ? `<tr><td colspan="${cols.length}" style="text-align:center;color:#555;padding:2rem">No applications yet.</td></tr>`
    : rows.map(row =>
        '<tr>' + cols.map(c => {
          let val = row[c] != null ? String(row[c]).replace(/</g,'&lt;') : '';
          if (c === 'submitted_at' && val) val = val.replace('T',' ').slice(0,19);
          if (c === 'status') return `<td><span class="pill pill-${val}">${val}</span></td>`;
          return `<td>${val}</td>`;
        }).join('') + '</tr>'
      ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Genesis Admin</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0a;color:#e8e0d0;padding:2rem 1rem;min-height:100vh}
  .top{display:flex;align-items:baseline;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap}
  h1{font-size:1rem;font-weight:700;letter-spacing:0.12em;color:#c9a96e}
  .count{font-size:0.78rem;color:#888}
  .search{margin-left:auto}
  .search input{padding:0.45rem 0.75rem;background:#141414;border:1px solid #2a2a2a;border-radius:6px;color:#e8e0d0;font-size:0.8rem;outline:none;width:200px}
  .search input:focus{border-color:#c9a96e}
  .wrap{overflow-x:auto;border:1px solid #1e1e1e;border-radius:10px}
  table{width:100%;border-collapse:collapse;font-size:0.78rem;min-width:900px}
  thead tr{background:#141414}
  th{padding:0.65rem 0.9rem;text-align:left;font-weight:600;letter-spacing:0.06em;color:#c9a96e;white-space:nowrap;border-bottom:1px solid #222}
  td{padding:0.6rem 0.9rem;border-bottom:1px solid #181818;color:#ccc;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:#111}
  .pill{display:inline-block;padding:0.2rem 0.6rem;border-radius:20px;font-size:0.7rem;font-weight:600}
  .pill-pending_verification{background:#2a1f00;color:#c9a96e}
  .pill-verified{background:#0a2a0a;color:#4caf50}
  .footer{margin-top:1rem;font-size:0.72rem;color:#444;text-align:right}
</style>
</head>
<body>
<div class="top">
  <h1>GENESIS ADMIN</h1>
  <span class="count">${rows.length} application${rows.length !== 1 ? 's' : ''}</span>
  <div class="search"><input type="text" id="q" placeholder="Filter…" oninput="filter(this.value)"/></div>
</div>
<div class="wrap">
  <table id="tbl">
    <thead><tr>${labels.map(l => `<th>${l}</th>`).join('')}</tr></thead>
    <tbody id="tbody">${tableRows}</tbody>
  </table>
</div>
<p class="footer">Genesis Kenya · Admin</p>
<script>
var rows=document.querySelectorAll('#tbody tr');
function filter(q){var s=q.toLowerCase();rows.forEach(function(r){r.style.display=r.textContent.toLowerCase().includes(s)?'':'none';});}
</script>
</body>
</html>`;
}

export default async function handler(req, res) {
  const password = req.query.p || '';

  if (password !== ADMIN_PASSWORD) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(loginPage(password.length > 0));
  }

  try {
    const rows = await getRows('applications');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(dashboardPage(rows));
  } catch (error) {
    console.error('Admin error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
