// SpeedyTyper — Whop Billing Integration
// ─────────────────────────────────────────────────────────────────────────────
// SETUP: Fill in the value below after creating your product on Whop.
//
//   1. Go to whop.com/sell → create "SpeedyTyper Pro" product
//   2. Set your price (e.g. $4.99/mo or $19 one-time)
//   3. Copy the checkout URL (looks like https://whop.com/checkout/plan_xxx/)
//   4. Paste it as WHOP_CHECKOUT_URL below.
//   5. In Whop dashboard → set the success redirect URL to:
//      https://speedytyper.com/lessons.html?pro=activated
// ─────────────────────────────────────────────────────────────────────────────

// Create product at whop.com/sell → copy checkout URL → paste here
const WHOP_CHECKOUT_URL = 'REPLACE_WITH_WHOP_URL';

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
    transactionId: transactionId || 'whop'
  }));
}

function clearPro() {
  localStorage.removeItem('typeflow-pro');
}

// ─────────────────────────────────────────────────────────────────────────────
// Open Whop checkout
// ─────────────────────────────────────────────────────────────────────────────

function openProCheckout() {
  if (!WHOP_CHECKOUT_URL || WHOP_CHECKOUT_URL === 'REPLACE_WITH_WHOP_URL') {
    alert('Pro checkout coming soon! Check back shortly.');
    return;
  }
  window.location.href = WHOP_CHECKOUT_URL;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handle Whop success redirect
// Whop sends users back to: /lessons.html?pro=activated
// ─────────────────────────────────────────────────────────────────────────────

function checkWhopReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('pro') === 'activated') {
    setProActive('whop');
    history.replaceState({}, '', window.location.pathname);
    showProSuccessMessage();
    updateNavForPro();
    hideAdsForPro();
    if (window.lessonsManager) {
      window.lessonsManager.renderLessons();
    }
  }
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
  msg.textContent = 'SpeedyTyper Pro activated! All lessons unlocked.';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
}

function updateNavForPro() {
  const btn = document.getElementById('navProBtn');
  if (!btn) return;
  if (isProUser()) {
    btn.textContent = 'Pro Active';
    btn.classList.add('nav-pro-active');
    btn.onclick = null;
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
  checkWhopReturn();
  updateNavForPro();
  hideAdsForPro();
});
