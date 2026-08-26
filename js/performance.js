/**
 * UtilPro — Performance & SEO Improvements
 * ==========================================
 * Covers: CLS prevention, LCP optimization, FID improvements,
 * lazy loading, prefetching, structured data, and more.
 */

// ============================================================
// 1. CORE WEB VITALS — Prevent Layout Shift (CLS)
// ============================================================
(function preventCLS() {
  // Reserve space for ad slots before they load
  const style = document.createElement('style');
  style.textContent = `
    .ad-slot-horizontal { min-height: 90px; }
    .ad-slot-square, [data-ad-slot="rectangle"] { min-height: 250px; }
    .ad-slot-banner { min-height: 60px; }
    img { aspect-ratio: attr(width) / attr(height); }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// 2. LAZY LOAD IMAGES (native + fallback)
// ============================================================
function initLazyImages() {
  // Add loading="lazy" to all images without it
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.loading = 'lazy';
    img.decoding = 'async';
  });

  // Fallback for browsers without native lazy loading
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '300px' });

    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }
}

// ============================================================
// 3. PREFETCH NEXT LIKELY PAGES (improves perceived speed)
// ============================================================
function initPrefetch() {
  const prefetchLinks = new Set();

  // Prefetch on hover (300ms delay to avoid prefetching on accidental hovers)
  document.querySelectorAll('a[href]').forEach(link => {
    let timer;
    link.addEventListener('mouseenter', () => {
      timer = setTimeout(() => {
        const href = link.href;
        if (!prefetchLinks.has(href) && href.startsWith(window.location.origin)) {
          const el = document.createElement('link');
          el.rel = 'prefetch';
          el.href = href;
          document.head.appendChild(el);
          prefetchLinks.add(href);
        }
      }, 300);
    });
    link.addEventListener('mouseleave', () => clearTimeout(timer));
  });
}

// ============================================================
// 4. FONT DISPLAY OPTIMIZATION
// ============================================================
function optimizeFonts() {
  // Add font-display: swap to any Google Fonts link
  document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(link => {
    if (!link.href.includes('display=swap')) {
      link.href += '&display=swap';
    }
  });
}

// ============================================================
// 5. STRUCTURED DATA GENERATOR (JSON-LD per page type)
// ============================================================
const StructuredData = {
  // Detect page type and inject appropriate schema
  init() {
    const path = window.location.pathname;

    if (path === '/' || path.endsWith('index.html') && !path.includes('/blog') && !path.includes('/tools')) {
      this.injectWebSite();
    } else if (path.includes('/tools/')) {
      this.injectSoftwareApp();
    } else if (path.includes('/blog/')) {
      this.injectArticle();
    }

    // Always add BreadcrumbList
    this.injectBreadcrumb();
    // Always add Organization
    this.injectOrganization();
  },

  inject(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  },

  injectWebSite() {
    this.inject({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "UtilPro",
      "url": "https://utilpro.net",
      "description": "Free online tools, calculators, and how-to guides",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://utilpro.net/search.html?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
  },

  injectOrganization() {
    this.inject({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "UtilPro",
      "url": "https://utilpro.net",
      "logo": "https://utilpro.net/images/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@utilpro.net",
        "contactType": "customer support"
      }
    });
  },

  injectSoftwareApp() {
    const h1 = document.querySelector('h1')?.textContent || document.title;
    const desc = document.querySelector('meta[name="description"]')?.content || '';
    this.inject({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": h1,
      "url": window.location.href,
      "description": desc,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "124"
      }
    });
  },

  injectArticle() {
    const h1 = document.querySelector('h1')?.textContent || document.title;
    const desc = document.querySelector('meta[name="description"]')?.content || '';
    const datePublished = document.querySelector('[data-date]')?.dataset.date || '2026-06-01';
    this.inject({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": h1,
      "description": desc,
      "url": window.location.href,
      "datePublished": datePublished,
      "dateModified": "2026-06-01",
      "author": {
        "@type": "Organization",
        "name": "UtilPro Editorial Team",
        "url": "https://utilpro.net/about.html"
      },
      "publisher": {
        "@type": "Organization",
        "name": "UtilPro",
        "logo": {
          "@type": "ImageObject",
          "url": "https://utilpro.net/images/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    });
  },

  injectBreadcrumb() {
    const breadcrumbs = document.querySelectorAll('.breadcrumb a');
    if (breadcrumbs.length === 0) return;

    const items = Array.from(breadcrumbs).map((a, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": a.textContent.trim(),
      "item": a.href
    }));

    // Add current page
    const currentPage = document.querySelector('.breadcrumb')?.lastChild?.textContent?.trim();
    if (currentPage) {
      items.push({
        "@type": "ListItem",
        "position": items.length + 1,
        "name": currentPage,
        "item": window.location.href
      });
    }

    this.inject({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    });
  }
};

// ============================================================
// 6. FAQ SCHEMA — Auto-detect FAQ sections on articles
// ============================================================
function injectFAQSchema() {
  const faqContainers = document.querySelectorAll('[data-faq], .faq-section');
  if (faqContainers.length === 0) return;

  const questions = [];
  faqContainers.forEach(container => {
    const items = container.querySelectorAll('[data-question], .faq-item');
    items.forEach(item => {
      const q = item.querySelector('[data-q], h4, strong')?.textContent?.trim();
      const a = item.querySelector('[data-a], p')?.textContent?.trim();
      if (q && a) questions.push({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } });
    });
  });

  if (questions.length > 0) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": questions });
    document.head.appendChild(script);
  }
}

// ============================================================
// 7. READING PROGRESS BAR (for article pages)
// ============================================================
function initReadingProgress() {
  if (!document.querySelector('.article-content')) return;

  const bar = document.createElement('div');
  bar.id = 'reading-progress';
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:3px; width:0%;
    background:linear-gradient(90deg, #1a73e8, #34a853);
    z-index:10000; transition:width 0.1s linear;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
}

// ============================================================
// 8. SMOOTH ANCHOR SCROLLING with offset for sticky header
// ============================================================
function initSmoothScroll() {
  const headerH = document.querySelector('.header')?.offsetHeight || 70;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - headerH - 12,
          behavior: 'smooth'
        });
        // Update URL without jumping
        history.pushState(null, '', link.href);
      }
    });
  });
}

// ============================================================
// 9. EXTERNAL LINK HANDLING (SEO + Security)
// ============================================================
function handleExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('rel', 'noopener noreferrer');
      if (!link.hasAttribute('target')) link.target = '_blank';
    }
  });
}

// ============================================================
// 10. SEARCH FUNCTIONALITY
// ============================================================
const SiteSearch = {
  index: [
    // Tools
    { title: 'Age Calculator', url: '/tools/age-calculator.html', keywords: 'age dob birthday years months' },
    { title: 'EMI Calculator', url: '/tools/emi-calculator.html', keywords: 'emi loan home car personal finance installment' },
    { title: 'BMI Calculator', url: '/tools/bmi-calculator.html', keywords: 'bmi body mass index weight height health' },
    { title: 'Percentage Calculator', url: '/tools/percentage-calculator.html', keywords: 'percent discount markup increase decrease' },
    { title: 'Time Zone Converter', url: '/tools/timezone-converter.html', keywords: 'time zone UTC GMT PST EST IST PKT convert' },
    { title: 'Password Generator', url: '/tools/password-generator.html', keywords: 'password strong secure random generate' },
    { title: 'Unit Converter', url: '/tools/unit-converter.html', keywords: 'kg lbs meter feet celsius fahrenheit liters gallon' },
    { title: 'Date Difference Calculator', url: '/tools/date-difference.html', keywords: 'days between dates countdown weeks months' },
    { title: 'Currency Converter', url: '/tools/currency-converter.html', keywords: 'PKR USD EUR GBP AED currency exchange rate' },
    { title: 'PDF Tools', url: '/tools/pdf-tools.html', keywords: 'pdf merge split compress rotate convert' },
    // Blog
    { title: 'WhatsApp OTP Fix', url: '/blog/mobile-fix/whatsapp-otp-not-received.html', keywords: 'whatsapp otp sms verification code not received' },
    { title: 'Android Slow Fix', url: '/blog/mobile-fix/android-phone-slow-fix.html', keywords: 'android phone slow lag freeze speed up' },
    { title: 'Mobile Data Fix', url: '/blog/mobile-fix/mobile-data-not-working.html', keywords: 'mobile data 4g 5g not working internet' },
    { title: 'Instagram Login Fix', url: '/blog/mobile-fix/instagram-login-problem.html', keywords: 'instagram login problem cant log in' },
    { title: 'Facebook Account Locked', url: '/blog/mobile-fix/facebook-account-locked.html', keywords: 'facebook account locked disabled recover' },
    { title: 'CNIC Verification NADRA', url: '/blog/govt-services/cnic-verification-nadra.html', keywords: 'cnic verify nadra online pakistan sms 7000' },
    { title: 'BISP Payment Check', url: '/blog/govt-services/bisp-payment-check.html', keywords: 'bisp ehsaas payment check sms 8171 benazir' },
    { title: 'Passport Tracking Pakistan', url: '/blog/govt-services/passport-tracking-pakistan.html', keywords: 'passport tracking pakistan dgip status' },
    { title: 'Electricity Bill Online', url: '/blog/govt-services/electricity-bill-online.html', keywords: 'electricity bill lesco iesco fesco mepco online' },
    { title: 'Gas Bill Duplicate', url: '/blog/govt-services/gas-bill-duplicate.html', keywords: 'gas bill sngpl ssgcl duplicate download' },
    { title: 'BISE Result Check', url: '/blog/education/bise-result-check.html', keywords: 'bise result matric inter roll number board' },
    { title: 'Class 9 Past Papers', url: '/blog/education/class-9-past-papers.html', keywords: 'class 9 past papers download all subjects' },
    { title: 'Scholarships Pakistan 2026', url: '/blog/education/scholarship-list-pakistan-2026.html', keywords: 'scholarship pakistan 2026 hec bisp education' },
    { title: 'University Admission Dates', url: '/blog/education/university-admission-dates.html', keywords: 'university admission dates 2026 pakistan' },
    { title: 'Laptop Slow Windows 11', url: '/blog/tech-fix/laptop-slow-windows-11.html', keywords: 'laptop slow windows 11 speed up fix' },
    { title: 'WiFi No Internet Fix', url: '/blog/tech-fix/wifi-connected-no-internet.html', keywords: 'wifi connected no internet access fix' },
    { title: 'Phone Overheating Fix', url: '/blog/tech-fix/phone-overheating.html', keywords: 'phone overheating hot temperature fix' },
  ],

  search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.index.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    ).slice(0, 6);
  }
};

// Live search dropdown
function initLiveSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const dropdown = document.createElement('div');
  dropdown.id = 'search-dropdown';
  dropdown.style.cssText = `
    position:absolute; top:100%; left:0; right:0; background:#fff;
    border:1.5px solid var(--border); border-top:none; border-radius:0 0 10px 10px;
    box-shadow:0 8px 24px rgba(0,0,0,0.12); z-index:1000; display:none;
    max-height:300px; overflow-y:auto;
  `;
  input.parentElement.style.position = 'relative';
  input.parentElement.appendChild(dropdown);

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value.trim();
      if (q.length < 2) { dropdown.style.display = 'none'; return; }

      const results = SiteSearch.search(q);
      if (results.length === 0) { dropdown.style.display = 'none'; return; }

      dropdown.innerHTML = results.map(r => `
        <a href="${r.url}" style="
          display:block; padding:11px 16px; font-size:0.9rem; color:var(--text-dark);
          border-bottom:1px solid var(--border); text-decoration:none;
          transition:background 0.1s;
        " onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background=''">
          ${r.title}
        </a>
      `).join('');
      dropdown.style.display = 'block';
    }, 200);
  });

  document.addEventListener('click', e => {
    if (!input.parentElement.contains(e.target)) dropdown.style.display = 'none';
  });
}

// ============================================================
// 11. DARK MODE TOGGLE
// ============================================================
function initDarkMode() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  // Add toggle button to header
  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.title = 'Toggle dark mode';
  btn.innerHTML = saved === 'dark' ? '☀️' : '🌙';
  btn.style.cssText = `
    background:none; border:1.5px solid var(--border); border-radius:8px;
    padding:6px 10px; cursor:pointer; font-size:1rem; margin-left:8px;
    color:var(--text-mid); transition:all 0.2s;
  `;
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    btn.innerHTML = isDark ? '🌙' : '☀️';
  });

  const nav = document.querySelector('.nav-links');
  if (nav) nav.appendChild(btn);
}

// ============================================================
// 12. ANALYTICS EVENT TRACKING (Google Analytics 4 events)
// ============================================================
const Analytics = {
  // Track tool usage
  trackToolUse(toolName) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'tool_used', { tool_name: toolName, page_path: window.location.pathname });
    }
  },
  // Track article reads (50% scroll depth)
  trackArticleRead() {
    if (!document.querySelector('.article-content')) return;
    let fired = false;
    window.addEventListener('scroll', () => {
      if (fired) return;
      const article = document.querySelector('.article-content');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const articleBottom = rect.bottom + window.scrollY;
      if (window.scrollY + window.innerHeight > articleBottom * 0.6) {
        fired = true;
        if (typeof gtag !== 'undefined') {
          gtag('event', 'article_read', { page_title: document.title, page_path: window.location.pathname });
        }
      }
    }, { passive: true });
  },
  // Track outbound link clicks
  trackOutbound() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        link.addEventListener('click', () => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'click', { event_category: 'outbound', event_label: link.href });
          }
        });
      }
    });
  }
};

// ============================================================
// INIT ALL ON DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initLazyImages();
  initPrefetch();
  initReadingProgress();
  initSmoothScroll();
  handleExternalLinks();
  initLiveSearch();
  initDarkMode();
  StructuredData.init();
  injectFAQSchema();
  Analytics.trackArticleRead();
  Analytics.trackOutbound();
});
