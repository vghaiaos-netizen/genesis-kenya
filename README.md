# Genesis Kenya — Donor Programme Platform

Kenya's first certified, internationally-compliant sperm donor programme. Built on dignity, science, and your health.

## 📋 Project Structure

```
genesis-kenya/
├── index.html              # 100/100 frontend (enhanced v2)
├── api/                    # Serverless functions (Vercel)
│   ├── sheets-helper.js    # Google Sheets API wrapper
│   ├── submit-application.js
│   ├── initiate-payment.js
│   ├── payment-callback.js
│   ├── check-payment-status.js
│   ├── tour-registration.js
│   └── chat.js
├── vercel.json            # Deployment config
├── .env.example           # Environment variables template
├── SETUP.md               # Complete setup instructions
├── push.sh / push.bat     # Local push scripts
└── .gitignore             # Git config
```

## 🚀 Deployment Status

- **Frontend**: Vercel (static site + serverless functions)
- **Database**: Google Sheets
- **Payments**: Tuma M-Pesa API
- **AI Chatbot**: Groq (3-key rotation pool)
- **DNS**: Custom domain ready

## 📦 Features

- ✅ 100/100 responsive frontend (micro-interactions, parallax, animations)
- ✅ 5-step multi-form application with real-time validation
- ✅ M-Pesa STK Push payment processing
- ✅ Google Sheets automatic logging (Applications, Payment Log, Tour Registrations)
- ✅ AI chatbot powered by Groq
- ✅ WhatsApp & direct contact integrations
- ✅ KMPDC/ODPC/ART Bill 2022 compliance badges

## 🔐 Setup

**Before deployment, complete SETUP.md:**
1. Google Cloud service account creation (8 clicks)
2. Tuma M-Pesa business account + IPRS verification
3. Groq API keys (3 for rotation)
4. GitHub repo & Vercel import
5. Environment variables in Vercel dashboard

See `SETUP.md` for step-by-step instructions.

## 💻 Local Development

```bash
# Clone
git clone https://github.com/vghaiaos-netizen/genesis-kenya.git
cd genesis-kenya

# Create .env.local (copy from .env.example)
cp .env.example .env.local
# Fill in your actual values

# Run locally (if Node.js installed)
vercel dev

# Make changes to index.html or api/ files

# Push to GitHub (auto-deploys to Vercel)
# macOS/Linux:
./push.sh "Your commit message"

# Windows:
push.bat "Your commit message"
```

## 📡 API Endpoints

All endpoints deployed on Vercel:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/submit-application` | POST | Submit application → Google Sheets |
| `/api/initiate-payment` | POST | Start M-Pesa STK Push |
| `/api/payment-callback` | POST | Tuma webhook → Google Sheets |
| `/api/check-payment-status` | GET | Frontend polling |
| `/api/tour-registration` | POST | Tour registration → Sheets |
| `/api/chat` | POST | Groq AI chatbot |

## 🔑 Environment Variables

Required in Vercel (see SETUP.md for how to obtain):

```
GOOGLE_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
TUMA_EMAIL
TUMA_API_KEY
GROQ_API_KEY_1
GROQ_API_KEY_2
GROQ_API_KEY_3
```

**Never commit `.env` files.** Use `.env.example` as template.

## 📊 Monitoring

- **Frontend**: Vercel Analytics
- **Functions**: Vercel Functions dashboard
- **Payments**: Tuma merchant dashboard
- **Data**: Google Sheets (auto-updated)
- **Logs**: `vercel logs` (CLI)

## 🚢 Production Checklist

- [ ] Google Sheets with correct tabs created + shared with service account
- [ ] Tuma IPRS verified + API key generated
- [ ] Groq 3 keys generated
- [ ] GitHub repo created + code pushed
- [ ] Vercel project imported + all env vars added
- [ ] Custom domain configured (optional, genesis.co.ke)
- [ ] Tuma webhook callback URL set
- [ ] Test application submission + M-Pesa payment
- [ ] Verify Sheets auto-logging works

## 🔗 Live URLs

- **Frontend**: https://genesis-kenya.vercel.app
- **Custom domain**: https://genesis.co.ke (after DNS setup)
- **Vercel dashboard**: https://vercel.com/genesis-kenya
- **Tuma merchant**: https://merchant.tuma.co.ke
- **Google Sheets**: [Your Genesis Sheet]

## 📝 Commit Convention

When pushing local changes:

```bash
./push.sh "Add feature or fix description"
# Vercel auto-deploys on git push to main
```

Commits include "Assisted-By: Gordon" trailer (optional, informational).

## 📞 Support

- **Technical**: See SETUP.md troubleshooting section
- **Tuma support**: support@tuma.co.ke
- **Groq support**: https://console.groq.com
- **Vercel support**: https://vercel.com/support

## ⚖️ Compliance

- ✅ KMPDC Registered
- ✅ ART Bill 2022 Compliant
- ✅ ODPC Data Protection Certified
- ✅ Kenya Data Protection Act 2019
- ✅ Medical-grade confidentiality

---

**Built with:** Vercel, Google Sheets, Tuma M-Pesa, Groq AI, HTML/CSS/JS

**Latest deployment**: Check Vercel dashboard for real-time status

