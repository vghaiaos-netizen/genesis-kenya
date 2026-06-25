# Genesis Kenya — Backend Setup Guide

Complete setup instructions for deploying Genesis to Vercel with full M-Pesa payment processing, Google Sheets logging, and Groq AI chatbot integration.

## 📋 Prerequisites Checklist

Before starting, gather these accounts:
- [ ] GitHub account with SSH key configured
- [ ] Google Cloud account with credit card on file
- [ ] Vercel account (free tier)
- [ ] Tuma (M-Pesa) business account
- [ ] Groq console account

---

## 1. Google Cloud Setup (8 Clicks)

This creates a service account that allows Genesis to write to your Google Sheet.

### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Click the dropdown at the top (next to "Google Cloud")
3. Click "NEW PROJECT"
4. Name it "Genesis Kenya"
5. Click "CREATE"
6. **Wait** for project to be created (~2 mins)

### Step 2: Enable Google Sheets API
7. In the left sidebar, click "APIs & Services" → "Enable APIs and Services"
8. Search for "Google Sheets API"
9. Click the result
10. Click "ENABLE"

### Step 3: Create Service Account
11. Go to "APIs & Services" → "Credentials" (left sidebar)
12. Click "CREATE CREDENTIALS" → "Service Account"
13. Fill in:
    - **Service account name**: `genesis-sheets-writer`
    - **Service account ID**: (auto-filled)
    - Click "CREATE AND CONTINUE"
14. **Grant roles** (next screen):
    - Search for and select `Editor` role
    - Click "CONTINUE"
15. Click "CREATE KEY" → "JSON"
16. A file downloads. **Keep this safe** — you'll paste its contents into Vercel.

### Step 4: Share Google Sheet with Service Account
17. Open the JSON file you just downloaded
18. Find the value for `"client_email"` — copy it (looks like: `genesis-sheets-writer@project-id.iam.gserviceaccount.com`)
19. Open your **Genesis Google Sheet** (create one at https://sheets.google.com if you don't have it yet)
20. Click "Share" (top right)
21. Paste the service account email
22. Give it **Editor** access
23. Uncheck "Notify people"
24. Click "Share"

**Your Google Sheet must have these tabs (create them if missing):**
- `Applications` — columns: `ref_number | first_name | last_name | email | phone | county | created_at | status`
- `Payment Log` — columns: `ref_number | payment_id | amount | status | mpesa_receipt | created_at`
- `Tour Registrations` — columns: `name | email | phone | city | created_at`

---

## 2. Tuma M-Pesa Setup

### Sign Up
1. Go to https://merchant.tuma.co.ke
2. Click "Sign Up"
3. Fill in: Full Name, Email, Phone, Password
4. Click "Sign Up"

### Identity Verification (IPRS)
5. Log in to your Tuma dashboard
6. Go to "Developer" section
7. Click "Verify Identity"
8. Enter your National ID number
9. System verifies with Kenya's IPRS database
10. **Wait** for approval (usually instant or within 24 hours)

### Create Business & Get API Key
11. Go to "Businesses" section
12. Click "Add New Business"
13. Fill in:
    - **Business Name**: Genesis Kenya
    - **Business Email**: (use a dedicated email, e.g., `api@genesis.co.ke`)
    - **Mobile Number**: Your Kenyan number
    - **Bank Details**: Select your bank, enter account number
14. Click "Save"
15. Go to "Developer" section
16. Select your business
17. Click "Generate API Key"
18. **Copy both:**
    - Business Email
    - API Key (keep secret)

---

## 3. Groq API Keys (Free Tier)

1. Go to https://console.groq.com
2. Sign up or log in
3. Go to "API Keys"
4. Click "Create New API Key" three times to generate 3 keys (free tier allows multiple)
5. Save all three keys — you'll add them to Vercel

---

## 4. GitHub Repo Setup

### Create Repository
1. Go to https://github.com/new
2. Name: `genesis-kenya`
3. Description: `Genesis — Kenya's First Certified Donor Programme`
4. **Private** (recommended)
5. Do NOT initialize with README
6. Click "Create repository"

### Push Code to GitHub
7. On your local machine, open terminal
8. Navigate to the `genesis-kenya/` folder:
   ```bash
   cd genesis-kenya
   git init
   git add .
   git commit -m "Initial commit: Genesis v2 frontend and backend"
   git branch -M main
   git remote add origin https://github.com/vghaiaos-netizen/genesis-kenya.git
   git push -u origin main
   ```
   (Replace `vghaiaos-netizen` with your GitHub username if different)

---

## 5. Vercel Deployment

### Import Project
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Paste: `https://github.com/vghaiaos-netizen/genesis-kenya.git`
4. Click "Import"

### Configure Environment Variables
5. You'll see the import screen. Before clicking "Deploy", add environment variables:
6. Click "Environment Variables"
7. Add these (get values from steps above):

| Variable Name | Value |
|---------------|-------|
| `GOOGLE_SHEET_ID` | (from your Google Sheet URL: `https://docs.google.com/spreadsheets/d/{ID}/edit`) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | (from JSON file: `client_email` value) |
| `GOOGLE_PRIVATE_KEY` | (from JSON file: `private_key` value — include quotes and `\n` characters) |
| `TUMA_EMAIL` | (your Tuma business email) |
| `TUMA_API_KEY` | (your Tuma API key) |
| `GROQ_API_KEY_1` | (first Groq key) |
| `GROQ_API_KEY_2` | (second Groq key) |
| `GROQ_API_KEY_3` | (third Groq key) |

8. Make sure all are set to "Production" environment
9. Click "Deploy"

### Vercel Deployment Complete
10. Vercel will build and deploy automatically
11. You'll get a URL like: `https://genesis-kenya.vercel.app`
12. **Test it**: open the URL in your browser

---

## 6. Connect Tuma Webhook

### Add Callback URL to Tuma
1. Log in to Tuma dashboard
2. Go to "Developer" → "Webhooks" (or similar)
3. Add callback URL: `https://genesis-kenya.vercel.app/api/payment-callback`
4. Save

### Test Payment Flow
5. Go to `https://genesis-kenya.vercel.app`
6. Fill in the form and attempt a small test payment (KES 10)
7. Complete M-Pesa prompt on your phone
8. Check that:
   - Payment Log sheet updates in Google Sheets
   - Success message appears on screen

---

## 7. Local Development & Pushing Updates

### Setup Local Development
1. Clone the repo locally:
   ```bash
   git clone https://github.com/vghaiaos-netizen/genesis-kenya.git
   cd genesis-kenya
   ```

2. Create `.env.local` with your keys (never commit this):
   ```
   GOOGLE_SHEET_ID=your-id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email
   GOOGLE_PRIVATE_KEY=your-key
   TUMA_EMAIL=your-email
   TUMA_API_KEY=your-key
   GROQ_API_KEY_1=key1
   GROQ_API_KEY_2=key2
   GROQ_API_KEY_3=key3
   ```

### Push Updates to Vercel
3. Make changes locally (edit `index.html`, API files, etc.)
4. Test locally (if you have Node.js, run `vercel dev`)
5. Push to GitHub:
   ```bash
   git add .
   git commit -m "Your descriptive message"
   git push origin main
   ```
6. Vercel automatically re-deploys on push
7. View deployment status at https://vercel.com/genesis-kenya

---

## 📞 API Endpoints (Live URLs)

Once deployed, these endpoints are live:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/submit-application` | POST | Submit application form → writes to Google Sheets |
| `/api/initiate-payment` | POST | Start M-Pesa STK Push payment via Tuma |
| `/api/payment-callback` | POST | Tuma sends payment updates here (webhook) |
| `/api/check-payment-status` | GET | Frontend polls for payment status |
| `/api/tour-registration` | POST | Register for a tour → writes to Sheets |
| `/api/chat` | POST | Send message to Groq chatbot |

---

## ✅ Verification Checklist

Before going live:

- [ ] Google Sheet created with correct tabs
- [ ] Service account added to Google Sheet as Editor
- [ ] Tuma business account approved and API key generated
- [ ] Groq keys generated (3 total)
- [ ] GitHub repo created and code pushed
- [ ] Vercel project imported and deployed
- [ ] All env vars added to Vercel
- [ ] Tuma webhook callback URL configured
- [ ] Test application submission → check Sheets updates
- [ ] Test M-Pesa payment → check Payment Log tab
- [ ] Chat widget works and calls Groq

---

## 🔐 Security Notes

1. **Never commit `.env` files** to GitHub
2. **Rotate Groq keys** monthly (if using multiple keys for rate limiting)
3. **Monitor Google Cloud billing** (free tier, but credit card required)
4. **Use HTTPS** for all Tuma callbacks (Vercel uses HTTPS by default)
5. **Store private keys securely** — only in Vercel env vars, never in code

---

## 🚀 Next Steps (Post-Deployment)

1. Configure custom domain (e.g., `genesis.co.ke`):
   - In Vercel: Project → Settings → Domains
   - Add your domain
   - Configure DNS records per Vercel instructions

2. Monitor logs:
   - Vercel: Project → Monitoring → Functions
   - Check for errors in `/api/submit-application`, `/api/initiate-payment`, etc.

3. Setup email notifications (optional):
   - Integrate SendGrid or Mailgun to email applicants upon submission
   - Verify payment alerts via Tuma's WhatsApp/Telegram notifications

---

**Deployed!** Your Genesis platform is now live at `https://genesis-kenya.vercel.app` and ready to accept applications and payments.

