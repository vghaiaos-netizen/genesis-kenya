// api/admin.js — Password-gated admin panel (Vercel serverless)
import SheetsHelper from './sheets-helper.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Shady868';

function loginPage(error) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Genesis — Admin</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0a;color:#e8e0d0;min-height:100vh;display:flex;align-items:center;justify-content:center}
  .card{background:#141414;border:1px solid #2a2a2a;border-radius:12px;padding:2.5rem;width:100%;max-width:360px}
  h1{font-size:1.1rem;font-weight:600;letter-spacing:0.12em;color:#c9a96e;margin-bottom:0.4rem}
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
  ${error ? '<p class="err">Incorrect password.</p>' : ''}
  <form method="GET" action="/api/admin">
    <input type="password" name="p" placeholder="Enter password" autofocus/>
    <button type="submit">Access →</button>
  </form>
</div>
</body>
</html>`;
}

function dashboardPage(rows) {
  const headers = rows[0] || ['Ref','First','Last','Email','Phone','County','DOB','Source','MPesa Code','Submitted','Status'];
  const data = rows.slice(1);

  const tableRows = data.length === 0
    ? '<tr><td colspan="' + headers.length + '" style="text-align:center;color:#666;padding:2rem">No applications yet.</td></tr>'
    : data.map(function(row) {
        return '<tr>' + headers.map(function(_,i){
          return '<td>' + (row[i] != null ? String(row[i]).replace(/</g,'&lt;') : '') + '</td>';
        }).join('') + '</tr>';
      }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Genesis Admin — Applications</title>
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
  table{width:100%;border-collapse:collapse;font-size:0.78rem;min-width:700px}
  thead tr{background:#141414;position:sticky;top:0}
  th{padding:0.65rem 0.9rem;text-align:left;font-weight:600;letter-spacing:0.06em;color:#c9a96e;white-space:nowrap;border-bottom:1px solid #222}
  td{padding:0.6rem 0.9rem;border-bottom:1px solid #181818;color:#ccc;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:#111}
  .pill{display:inline-block;padding:0.2rem 0.55rem;border-radius:20px;font-size:0.7rem;font-weight:600;letter-spacing:0.04em}
  .pill-pending{background:#2a1f00;color:#c9a96e}
  .pill-verified{background:#0a2a0a;color:#4caf50}
  .footer{margin-top:1rem;font-size:0.72rem;color:#555;text-align:right}
</style>
</head>
<body>
<div class="top">
  <h1>GENESIS ADMIN</h1>
  <span class="count">${data.length} application${data.length !== 1 ? 's' : ''}</span>
  <div class="search"><input type="text" id="q" placeholder="Filter…" oninput="filter(this.value)"/></div>
</div>
<div class="wrap">
  <table id="tbl">
    <thead><tr>${headers.map(function(h){return '<th>'+String(h).replace(/</g,'&lt;')+'</th>';}).join('')}</tr></thead>
    <tbody id="tbody">${tableRows}</tbody>
  </table>
</div>
<p class="footer">Genesis Kenya · Admin · Data from Google Sheets</p>
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
    const sheetsHelper = new SheetsHelper();
    await sheetsHelper.init();
    const result = await sheetsHelper.getRows('Applications');

    if (!result.success) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(loginPage(false).replace('</body>', `<p style="color:#e05252;padding:1rem">Sheets error: ${result.error}</p></body>`));
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(dashboardPage(result.rows));
  } catch (error) {
    console.error('Admin panel error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
