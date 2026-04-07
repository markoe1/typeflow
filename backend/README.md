# TypeFlow Admin Backend

Real-time earnings & analytics dashboard for SpeedyTyper.com (TypeFlow).

## Features

- 📊 **AdSense Earnings** — Real-time revenue, impressions, CTR
- 📈 **Google Analytics** — Visitors, page views, bounce rate
- ✅ **Integration Status** — Verify AdSense & Analytics are connected
- 🔐 **Admin Authentication** — API key-based access control

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3001
ADMIN_API_KEY=your_strong_api_key_here
ADSENSE_ACCOUNT_ID=ca-pub-3527398386713452
GA4_PROPERTY_ID=properties/123456789
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

### 3. Set Up Google APIs

#### Step A: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (name it "TypeFlow Admin")
3. Enable these APIs:
   - **AdSense Management API** (for earnings)
   - **Google Analytics Admin API** (for configuration)
   - **Google Analytics Data API** (for traffic stats)

#### Step B: Create a Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name it "typeflow-admin"
4. Grant these roles:
   - `AdSense Read-only` (for earnings data)
   - `Analytics Viewer` (for traffic data)
5. Create a **JSON key** for the service account
6. Copy the entire JSON and paste into `GOOGLE_SERVICE_ACCOUNT_JSON` in `.env`

#### Step C: Link Your AdSense Account

1. Go to [AdSense Settings](https://adsense.google.com/u/0/account)
2. Navigate to **Account** → **Account Settings**
3. Go to **Users and permissions**
4. Add the service account email (found in the JSON key: `client_email`) as a user with **Manager** role
5. Wait for the invitation to be accepted

#### Step D: Get Your GA4 Property ID

1. Go to [Google Analytics 4](https://analytics.google.com)
2. Select your SpeedyTyper property
3. Go to **Admin** → **Property Settings**
4. Copy the **Property ID** (format: `123456789`)
5. In `.env`, set: `GA4_PROPERTY_ID=properties/123456789`

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on `http://localhost:3001`

## API Endpoints

### GET /api/paypal
Returns PayPal account info and recent AdSense payouts (requires `X-Admin-Key` header).

**Response:**
```json
{
  "account_email": "elliott@elegantsolarinc.com",
  "account_name": "Elliott Marko LLC",
  "total_received_30d": 245.67,
  "transaction_count": 8,
  "transactions": [
    {
      "date": "2026-03-15T12:34:56Z",
      "amount": 45.23,
      "currency": "USD",
      "status": "S",
      "type": "AdSense Monthly Payout"
    }
  ],
  "mode": "sandbox"
}
```

### GET /api/earnings
Returns AdSense earnings data (requires `X-Admin-Key` header).

**Headers:**
```
X-Admin-Key: YOUR_ADMIN_API_KEY
```

**Response:**
```json
{
  "earnings_today": 12.45,
  "earnings_month": 234.67,
  "impressions_month": 45000,
  "clicks_month": 1200,
  "pageviews_month": 12000,
  "ctr": "2.67",
  "account_id": "ca-pub-3527398386713452"
}
```

### GET /api/analytics
Returns Google Analytics traffic data (requires `X-Admin-Key` header).

**Headers:**
```
X-Admin-Key: YOUR_ADMIN_API_KEY
```

**Response:**
```json
{
  "visitors_today": 450,
  "pageviews_today": 1200,
  "bounce_rate_today": "42.3",
  "avg_session_duration_today": "120",

  "visitors_month": 8900,
  "pageviews_month": 25000,
  "bounce_rate_month": "38.5",

  "property_id": "123456789"
}
```

### GET /api/status
Returns integration status (requires `X-Admin-Key` header).

**Response:**
```json
{
  "adsense_configured": true,
  "analytics_configured": true,
  "google_auth_available": true,
  "account_id": "ca-pub-3527398386713452",
  "property_id": "properties/123456789"
}
```

## Frontend Integration

The admin dashboard (`admin.html`) calls these endpoints. Update the backend URL in the login function:

```javascript
const BACKEND_URL = 'https://your-backend.com'; // Production
// or
const BACKEND_URL = 'http://localhost:3001'; // Development
```

## Deployment

### Option 1: Vercel (Recommended)

```bash
vercel deploy
```

Set environment variables in Vercel dashboard.

### Option 2: Railway

```bash
railway up
```

### Option 3: Heroku

```bash
heroku create typeflow-admin
git push heroku main
```

### Option 4: VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone <repo> /app
cd /app/backend

# Install + start
npm install
PM2_HOME=/etc/pm2 sudo -E pm2 start server.js --name typeflow-admin

# Make PM2 persistent
sudo pm2 startup
sudo pm2 save
```

## Troubleshooting

### "Unauthorized" Error
- Check `X-Admin-Key` header is correct
- Verify `ADMIN_API_KEY` in `.env`

### "Google APIs not configured"
- Ensure `GOOGLE_SERVICE_ACCOUNT_JSON` is set
- Check service account has correct roles
- Verify service account email is added to AdSense & Analytics

### "AdSense account not found"
- Confirm account ID is correct (format: `ca-pub-XXXXX`)
- Verify service account has Manager role in AdSense

### "Analytics property not found"
- Check `GA4_PROPERTY_ID` format: `properties/123456789`
- Verify service account email can access the GA4 property

## Security

- 🔐 All endpoints require `X-Admin-Key` header
- Store API key securely (environment variable, not in code)
- Use strong key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- In production, use HTTPS only

## Support

For issues with Google APIs, check:
- [AdSense Management API docs](https://developers.google.com/adsense/management/overview)
- [Google Analytics Data API docs](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Cloud documentation](https://cloud.google.com/docs)
