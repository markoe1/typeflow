// TypeFlow — Paddle Billing Integration
// ─────────────────────────────────────────────────────────────────────────────
// SETUP: Fill in the two values below from your Paddle dashboard.
//
//   1. Go to paddle.com → Developer → Authentication
//      Copy your "Client-side token" (starts with live_ or sandbox_)
//      Paste it as PADDLE_CLIENT_TOKEN below.
//
//   2. Go to Paddle → Catalog → Products → Create "TypeFlow Pro"
//      Set price: e.g. $4.99/month or $29/year (one-time)
//      Click the price → copy the Price ID (starts with pri_)
//      Paste it as PADDLE_PRICE_ID below.
//
//   3. For testing first: use a sandbox token (test_ prefix) and test price ID.
//      Change PADDLE_ENV to 'sandbox' while testing.
// ─────────────────────────────────────────────────────────────────────────────

const PADDLE_CLIENT_TOKEN = 'YOUR_CLIENT_SIDE_TOKEN'; // e.g. live_abc123...
const PADDLE_PRICE_ID     = 'YOUR_PRICE_ID';          // e.g. pri_abc123...
const PADDLE_ENV          = 'production';              // 'sandbox' or 'production'

// ─────────────────────────────────────────────────────────────────────────────
// Pro status helpers — stored in localStorage
// ─────────────────────────────────────────────────────────────────────────────

function isProUser() {
  try {
    const pro = JSON.parse(localStorage.getItem('typeflow-pro') || '{}');
    return pro.active === true;
  } catch (e) {
    return false;
  }
}

function setProActive(transactionId) {
  localStorage.setItem('typeflow-pro', JSON.stringify({
    active: true,
    activatedAt: new Date().toISOString(),
    transactionId: transactionId || 'manual'
  }));
}

function clearPro() {
  localStorage.removeItem('typeflow-pro');
}

// ─────────────────────────────────────────────────────────────────────────────
// Paddle initialization
// ─────────────────────────────────────────────────────────────────────────────

function initPaddle() {
  if (typeof Paddle === 'undefined') return;

  if (PADDLE_ENV === 'sandbox') {
    Paddle.Environment.set('sandbox');
  }

  Paddle.Initialize({
    token: PADDLE_CLIENT_TOKEN,
    eventCallback: function (data) {
      if (data.name === 'checkout.completed') {
        const txId = data.data && data.data.transaction_id;
        setProActive(txId);
        hidePaddleOverlay();
        showProSuccessMessage();
        updateNavForPro();
        // If on lessons page, refresh the lesson grid
        if (window.lessonsManager) {
          window.lessonsManager.renderLessons();
        }
        // Hide all ads for this session
        hideAdsForPro();
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Open checkout
// ─────────────────────────────────────────────────────────────────────────────

function openProCheckout() {
  if (typeof Paddle === 'undefined') {
    alert('Payment system loading. Please try again in a moment.');
    return;
  }
  Paddle.Checkout.open({
    items: [{ priceId: PADDLE_PRICE_ID, quantity: 1 }]
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────────────────────────────────────────

function hidePaddleOverlay() {
  const overlay = document.getElementById('proUpgradeOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function showProSuccessMessage() {
  const msg = document.createElement('div');
  msg.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    background: var(--correct, #00c853); color: #000;
    padding: 1rem 1.5rem; border-radius: 8px; font-weight: 700;
    font-size: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `;
  msg.textContent = 'TypeFlow Pro activated! All lessons unlocked.';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
}

function updateNavForPro() {
  const btn = document.getElementById('navProBtn');
  if (!btn) return;
  if (isProUser()) {
    btn.textContent = 'Pro Active';
    btn.classList.add('nav-pro-active');
    btn.removeEventListener('click', openProCheckout);
  }
}

function hideAdsForPro() {
  if (!isProUser()) return;
  document.querySelectorAll('.ad-unit').forEach(ad => {
    ad.style.display = 'none';
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Boot — runs on every page
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  initPaddle();
  updateNavForPro();
  hideAdsForPro();
});
