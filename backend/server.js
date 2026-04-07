import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Configuration ──────────────────────────────────────────────────────────

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
const ADSENSE_ACCOUNT_ID = process.env.ADSENSE_ACCOUNT_ID || 'ca-pub-3527398386713452';
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '';
const GOOGLE_SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '';

// PayPal Configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || '';
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
const PAYPAL_API_URL = PAYPAL_MODE === 'sandbox'
  ? 'https://api.sandbox.paypal.com'
  : 'https://api.paypal.com';

// ── Middleware ─────────────────────────────────────────────────────────────

app.use(cors({
  origin: [
    'https://speedytyper.com',
    'http://localhost:5500',
    'http://localhost:8080',
    'http://localhost:3000'
  ]
}));

app.use(express.json());

// ── Auth Middleware ───────────────────────────────────────────────────────

function authenticateAdmin(req, res, next) {
  const apiKey = req.headers['x-admin-key'] || req.query.key;

  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized', code: 'INVALID_API_KEY' });
  }

  next();
}

// ── PayPal Helper ──────────────────────────────────────────────────────────

async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    return null;
  }

  try {
    const response = await axios.post(
      `${PAYPAL_API_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data.access_token;
  } catch (e) {
    console.error('Failed to get PayPal access token:', e.message);
    return null;
  }
}

// ── Google API Clients ─────────────────────────────────────────────────────

function getGoogleAuth() {
  if (!GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.warn('⚠️  GOOGLE_SERVICE_ACCOUNT_JSON not configured');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: [
        'https://www.googleapis.com/auth/adsense.readonly',
        'https://www.googleapis.com/auth/analytics.readonly'
      ]
    });
    return auth;
  } catch (e) {
    console.error('Failed to parse Google service account:', e.message);
    return null;
  }
}

// ── Routes ─────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    name: 'TypeFlow Admin API',
    version: '1.0.0',
    endpoints: {
      earnings: '/api/earnings',
      analytics: '/api/analytics',
      status: '/api/status'
    },
    note: 'All endpoints require X-Admin-Key header'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get AdSense earnings
app.get('/api/earnings', authenticateAdmin, async (req, res) => {
  try {
    const auth = getGoogleAuth();
    if (!auth) {
      return res.status(503).json({
        error: 'Google APIs not configured',
        earnings_today: null,
        earnings_month: null
      });
    }

    const adsense = google.adsense({ version: 'v2', auth });

    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const formatDate = (d) => d.toISOString().split('T')[0];

    const result = await adsense.accounts.reports.generate({
      account: `accounts/${ADSENSE_ACCOUNT_ID}`,
      requestBody: {
        dateRange: {
          startDate: { year: monthAgo.getFullYear(), month: monthAgo.getMonth() + 1, day: monthAgo.getDate() },
          endDate: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }
        },
        metrics: ['EARNINGS', 'AD_IMPRESSIONS', 'PAGE_VIEWS', 'CLICKS'],
        dimensions: ['DATE']
      }
    });

    const rows = result.data.rows || [];
    let earningsToday = 0;
    let earningsMonth = 0;
    let impressions = 0;
    let clicks = 0;
    let pageviews = 0;

    const todayStr = formatDate(today);

    rows.forEach(row => {
      const date = row.dimensionValues[0].value;
      const earnings = parseFloat(row.metricValues[0].value) || 0;
      const imps = parseInt(row.metricValues[1].value) || 0;
      const pvs = parseInt(row.metricValues[2].value) || 0;
      const clks = parseInt(row.metricValues[3].value) || 0;

      earningsMonth += earnings;
      impressions += imps;
      pageviews += pvs;
      clicks += clks;

      if (date === todayStr) {
        earningsToday = earnings;
      }
    });

    res.json({
      earnings_today: Math.round(earningsToday * 100) / 100,
      earnings_month: Math.round(earningsMonth * 100) / 100,
      impressions_month: impressions,
      clicks_month: clicks,
      pageviews_month: pageviews,
      ctr: impressions > 0 ? (clicks / impressions * 100).toFixed(2) : '0.00',
      account_id: ADSENSE_ACCOUNT_ID
    });
  } catch (error) {
    console.error('AdSense API error:', error.message);
    res.status(500).json({
      error: error.message,
      earnings_today: null,
      earnings_month: null
    });
  }
});

// Get Google Analytics data
app.get('/api/analytics', authenticateAdmin, async (req, res) => {
  try {
    const auth = getGoogleAuth();
    if (!auth || !GA4_PROPERTY_ID) {
      return res.status(503).json({
        error: 'Google Analytics not configured',
        visitors_today: null,
        visitors_month: null
      });
    }

    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });

    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const formatDate = (d) => d.toISOString().split('T')[0];

    // Fetch today's data
    const todayResult = await analyticsData.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{
          startDate: formatDate(today),
          endDate: formatDate(today)
        }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' }
        ]
      }
    });

    // Fetch month data
    const monthResult = await analyticsData.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{
          startDate: formatDate(monthAgo),
          endDate: formatDate(today)
        }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' }
        ]
      }
    });

    const todayRow = todayResult.data.rows?.[0]?.metricValues || [];
    const monthRow = monthResult.data.rows?.[0]?.metricValues || [];

    res.json({
      visitors_today: parseInt(todayRow[0]?.value || 0),
      pageviews_today: parseInt(todayRow[1]?.value || 0),
      bounce_rate_today: parseFloat(todayRow[2]?.value || 0).toFixed(1),
      avg_session_duration_today: parseFloat(todayRow[3]?.value || 0).toFixed(0),

      visitors_month: parseInt(monthRow[0]?.value || 0),
      pageviews_month: parseInt(monthRow[1]?.value || 0),
      bounce_rate_month: parseFloat(monthRow[2]?.value || 0).toFixed(1),

      property_id: GA4_PROPERTY_ID
    });
  } catch (error) {
    console.error('Analytics API error:', error.message);
    res.status(500).json({
      error: error.message,
      visitors_today: null,
      visitors_month: null
    });
  }
});

// Integration status
app.get('/api/status', authenticateAdmin, (req, res) => {
  const auth = getGoogleAuth();

  res.json({
    adsense_configured: !!GOOGLE_SERVICE_ACCOUNT_JSON && !!ADSENSE_ACCOUNT_ID,
    analytics_configured: !!GOOGLE_SERVICE_ACCOUNT_JSON && !!GA4_PROPERTY_ID,
    google_auth_available: !!auth,
    paypal_configured: !!PAYPAL_CLIENT_ID && !!PAYPAL_SECRET,
    account_id: ADSENSE_ACCOUNT_ID,
    property_id: GA4_PROPERTY_ID || 'not configured'
  });
});

// Get PayPal account balance & recent transactions
app.get('/api/paypal', authenticateAdmin, async (req, res) => {
  try {
    const token = await getPayPalAccessToken();
    if (!token) {
      return res.status(503).json({
        error: 'PayPal not configured',
        balance: null,
        transactions: []
      });
    }

    // Get account info (balance, name, email)
    const accountRes = await axios.get(
      `${PAYPAL_API_URL}/v1/identity/open-id-connect/userinfo`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          schema: 'paypaluser'
        }
      }
    );

    const account = accountRes.data;

    // Get recent transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    const transRes = await axios.get(
      `${PAYPAL_API_URL}/v1/reporting/transactions`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          start_date: startDate,
          end_date: new Date().toISOString().split('T')[0],
          fields: 'all',
          page_size: 20
        }
      }
    );

    const transactions = (transRes.data.transaction_details || [])
      .filter(t => t.transaction_subject && t.transaction_subject.includes('AdSense'))
      .map(t => ({
        date: t.transaction_initiation_date,
        amount: parseFloat(t.transaction_amount?.value || 0),
        currency: t.transaction_amount?.currency_code,
        status: t.transaction_status,
        type: t.transaction_subject
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); // Last 10 transactions

    const totalReceived = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    res.json({
      account_email: account.email,
      account_name: account.name,
      total_received_30d: Math.round(totalReceived * 100) / 100,
      transaction_count: transactions.length,
      transactions: transactions,
      mode: PAYPAL_MODE
    });
  } catch (error) {
    console.error('PayPal API error:', error.message);
    res.status(500).json({
      error: error.message,
      balance: null,
      transactions: []
    });
  }
});

// ── Error Handler ──────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: err.message || 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// ── Server Start ───────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🚀 TypeFlow Admin API                                 ║
╠════════════════════════════════════════════════════════╣
║  Server: http://localhost:${PORT}                         ║
║  Status: ${auth ? '✓ Google APIs configured' : '⚠ Google APIs not configured'}
║                                                        ║
║  Endpoints:                                            ║
║    GET /api/earnings  — AdSense earnings data        ║
║    GET /api/analytics — Google Analytics data        ║
║    GET /api/status    — Integration status           ║
║                                                        ║
║  All endpoints require: X-Admin-Key header            ║
╚════════════════════════════════════════════════════════╝
  `);
});

const auth = getGoogleAuth();
