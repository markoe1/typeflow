# TypeFlow Admin Dashboard — Setup Guide for Command Center

This guide explains how to access TypeFlow earnings and verify AdSense/Analytics integration.

## For Command Center (User Access)

### 1. Access the Admin Dashboard

**URL:** `https://speedytyper.com/admin.html` (or `http://localhost/typeflow/admin.html` during dev)

### 2. Log In

- **Email:** `admin@speedytyper.com`
- **Password:** `speedytyper2024`

### 3. View Dashboard

Once logged in, you'll see:
- ✅ **Today's revenue** from AdSense
- ✅ **30-day earnings**
- ✅ **Site traffic** (visitors, page views)
- ✅ **Integration status** (AdSense & Analytics verification)

**Note:** Real data requires backend to be running and Google APIs configured (see below).

---

## For Developers (Backend Setup)

### Prerequisites

- Node.js 18+ installed
- Google Cloud account
- SpeedyTyper's AdSense account access
- Google Analytics 4 property for speedytyper.com

### Step 1: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project called "TypeFlow Admin"
3. Enable these APIs:
   - **AdSense Management API**
   - **Google Analytics Admin API**
   - **Google Analytics Data API**

### Step 2: Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `typeflow-admin`
4. Grant roles:
   - `roles/adsense.admin` (for AdSense access)
   - `roles/analytics.viewer` (for GA4 access)
5. Create a **JSON Key**
6. Download and save the JSON file

### Step 3: Configure Backend

1. Navigate to `/backend` directory
2. Copy `.env.example` to `.env`
3. Fill in values:
   ```env
   PORT=3001
   ADMIN_API_KEY=generate_with_node_-e_console.log_crypto_random
   ADSENSE_ACCOUNT_ID=ca-pub-3527398386713452
   GA4_PROPERTY_ID=properties/YOUR_GA4_PROPERTY_ID
   GOOGLE_SERVICE_ACCOUNT_JSON=<paste entire JSON here>
   ```

### Step 4: Run Backend Locally

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3001`

### Step 5: Test Endpoints

**Get Earnings:**
```bash
curl http://localhost:3001/api/earnings \
  -H "X-Admin-Key: YOUR_ADMIN_API_KEY"
```

**Get Analytics:**
```bash
curl http://localhost:3001/api/analytics \
  -H "X-Admin-Key: YOUR_ADMIN_API_KEY"
```

**Get Status:**
```bash
curl http://localhost:3001/api/status \
  -H "X-Admin-Key: YOUR_ADMIN_API_KEY"
```

### Step 6: Deploy to Production

Choose one:

**Vercel (Easiest):**
```bash
npm install -g vercel
vercel deploy
```
Set environment variables in Vercel dashboard.

**Railway:**
```bash
# Use Render CLI
render deploy
```

**Self-hosted (VPS):**
```bash
# On your VPS
cd /app/typeflow/backend
npm install
NODE_ENV=production npm start
```

### Step 7: Update Admin Dashboard

In `admin.html`, update the backend URL:

```javascript
// Line in loadDashboard()
const BACKEND_URL = 'https://your-deployed-backend.com';
```

---

## Troubleshooting

### Dashboard shows "Not configured"

1. Check backend is running: `curl http://localhost:3001/health`
2. Verify environment variables in `.env`
3. Check Google service account has correct roles

### "Unauthorized" error

- Verify `X-Admin-Key` header matches `ADMIN_API_KEY` in `.env`

### No earnings data

- Confirm service account email is added to AdSense with **Manager** role
- Wait 24-48 hours for AdSense to recognize the service account
- Check AdSense account ID is correct

### No analytics data

- Verify GA4 property ID is correct (format: `properties/123456789`)
- Check service account email can access the GA4 property
- Ensure GA4 property has received traffic

---

## Files

```
typeflow/
├── admin.html                 # Frontend dashboard (for Command Center)
├── ADMIN_SETUP.md            # This file
└── backend/
    ├── server.js             # Express backend
    ├── package.json          # Dependencies
    ├── .env.example          # Configuration template
    └── README.md             # Full technical documentation
```

---

## Security Notes

- ⚠️ Never commit `.env` file to git
- 🔐 Keep `ADMIN_API_KEY` secret
- 🔐 Keep Google service account JSON secret
- ✅ Use HTTPS in production
- ✅ Rotate API keys periodically

---

## Support

**For dashboard issues:** Check browser console (F12)

**For backend issues:** Check server logs and Google API errors in terminal

**For Google API setup:** See `backend/README.md` Troubleshooting section
