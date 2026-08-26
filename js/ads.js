/**
 * UtilPro — Google AdSense Configuration
 * ========================================
 * SETUP: Replace YOUR_PUB_ID with your actual AdSense Publisher ID
 * Format: ca-pub-XXXXXXXXXXXXXXXX (16 digits)
 *
 * HOW TO GET YOUR PUBLISHER ID:
 * 1. Sign in at adsense.google.com
 * 2. Click Account → Account information
 * 3. Copy your Publisher ID (starts with ca-pub-)
 */

// ============================================================
// 🔧 CONFIGURATION — EDIT THESE VALUES
// ============================================================
const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',   // ← Replace with your Publisher ID

  // Ad Unit IDs — create these in AdSense > Ads > By ad unit
  adUnits: {
    leaderboard:  'XXXXXXXXXX',  // 728x90  — top of page
    rectangle:    'XXXXXXXXXX',  // 300x250 — sidebar / mid-content
    largeRect:    'XXXXXXXXXX',  // 336x280 — in-article
    halfPage:     'XXXXXXXXXX',  // 300x600 — sidebar
    mobileBanner: 'XXXXXXXXXX',  // 320x50  — mobile top
    inArticle:    'XXXXXXXXXX',  // Auto    — in-article native
    autoRelax:    'XXXXXXXXXX',  // Auto    — auto-relaxed
  },

  // Feature flags
  lazyLoad:         true,    // Load ads only when near viewport (better CWV scores)
  autoAds:          true,    // Let Google place additional ads automatically
  demoMode:         true,    // Set false after AdSense approval — removes placeholder UI
  respectDNT:       false,   // Set true to respect Do Not Track headers
};

// ============================================================
// AUTO-ADS SCRIPT INJECTION
// Adds the main AdSense script to <head> automatically
// ============================================================
(function injectAdSense() {
  if (ADSENSE_CONFIG.demoMode) return; // Skip in demo mode

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);

  if (ADSENSE_CONFIG.autoAds) {
    script.addEventListener('load', () => {
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: ADSENSE_CONFIG.publisherId,
        enable_page_level_ads: true,
      });
    });
  }
})();

// ============================================================
// AD SLOT RENDERER
// Replaces .ad-slot placeholder divs with real AdSense units
// ============================================================
function renderAdSlots() {
  if (ADSENSE_CONFIG.demoMode) {
    renderDemoAds();
    return;
  }

  document.querySelectorAll('[data-ad-slot]').forEach(container => {
    const slotType = container.dataset.adSlot;
    const unitId = ADSENSE_CONFIG.adUnits[slotType] || ADSENSE_CONFIG.adUnits.rectangle;

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.dataset.adClient = ADSENSE_CONFIG.publisherId;
    ins.dataset.adSlot = unitId;
    ins.dataset.adFormat = slotType === 'leaderboard' ? 'horizontal' : 'auto';
    ins.dataset.fullWidthResponsive = 'true';

    container.innerHTML = '';
    container.appendChild(ins);

    if (ADSENSE_CONFIG.lazyLoad) {
      // Use IntersectionObserver for lazy loading
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });
      observer.observe(container);
    } else {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  });
}

// ============================================================
// DEMO MODE — Shows styled placeholder ads before approval
// ============================================================
function renderDemoAds() {
  document.querySelectorAll('.ad-slot').forEach(el => {
    const isHorizontal = el.classList.contains('ad-slot-horizontal') || el.classList.contains('ad-slot-banner');
    const isSidebar = el.style.height === '250px' || el.style.height === '300px';

    el.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f8f9fc 0%, #e8edf5 100%);
      border: 1.5px dashed #b8c7e0;
      border-radius: 8px;
      width: 100%;
      min-height: ${isHorizontal ? '90px' : isSidebar ? '250px' : '90px'};
      margin: 16px 0;
      position: relative;
      overflow: hidden;
    `;

    el.innerHTML = `
      <div style="text-align:center; padding:12px;">
        <div style="font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; color:#94a3b8; font-weight:600; margin-bottom:4px;">Advertisement</div>
        <div style="font-size:0.75rem; color:#cbd5e1;">Your ad will appear here</div>
        ${!isHorizontal ? '<div style="font-size:0.65rem; color:#e2e8f0; margin-top:6px;">300 × 250</div>' : ''}
      </div>
    `;
  });
}

// ============================================================
// CONSENT BANNER (GDPR / Pakistan visitors)
// Shows a simple cookie consent notice
// ============================================================
function initConsentBanner() {
  if (localStorage.getItem('consent_given')) return;

  const banner = document.createElement('div');
  banner.id = 'consent-banner';
  banner.innerHTML = `
    <div style="
      position:fixed; bottom:0; left:0; right:0; z-index:9999;
      background:#1a1a2e; color:#fff; padding:14px 20px;
      display:flex; align-items:center; justify-content:space-between;
      flex-wrap:wrap; gap:12px; font-size:0.85rem;
      box-shadow:0 -4px 20px rgba(0,0,0,0.3);
    ">
      <span style="flex:1; min-width:200px; color:rgba(255,255,255,0.85);">
        🍪 We use cookies for analytics and personalized ads.
        <a href="/privacy.html" style="color:#60a5fa; margin-left:4px;">Learn more</a>
      </span>
      <div style="display:flex; gap:10px; flex-shrink:0;">
        <button onclick="denyConsent()" style="
          background:transparent; border:1px solid rgba(255,255,255,0.3);
          color:rgba(255,255,255,0.7); padding:7px 16px; border-radius:6px;
          cursor:pointer; font-size:0.82rem;
        ">Decline</button>
        <button onclick="giveConsent()" style="
          background:#1a73e8; border:none; color:#fff;
          padding:7px 20px; border-radius:6px; cursor:pointer;
          font-size:0.82rem; font-weight:600;
        ">Accept</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
}

function giveConsent() {
  localStorage.setItem('consent_given', 'true');
  localStorage.setItem('consent_type', 'full');
  document.getElementById('consent-banner')?.remove();
}

function denyConsent() {
  localStorage.setItem('consent_given', 'true');
  localStorage.setItem('consent_type', 'minimal');
  document.getElementById('consent-banner')?.remove();
}

// ============================================================
// AD PERFORMANCE TRACKER (Basic - no external dependencies)
// ============================================================
const AdTracker = {
  pageViews: 0,
  adImpressions: 0,

  init() {
    this.pageViews = parseInt(localStorage.getItem('up_pv') || '0') + 1;
    localStorage.setItem('up_pv', this.pageViews);
  },

  trackImpression(slotId) {
    this.adImpressions++;
    // In production: send to your analytics endpoint
  }
};

// ============================================================
// INIT — Run everything on DOM ready
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderAdSlots();
  initConsentBanner();
  AdTracker.init();
});
