# UtilPro — Deployment Guide

## 📁 Folder Structure

```
utilpro/
├── index.html              ← Homepage
├── sitemap.xml             ← SEO sitemap
├── robots.txt              ← Search engine rules
├── css/
│   └── style.css           ← Main stylesheet
├── js/
│   └── main.js             ← Main JavaScript
├── tools/
│   ├── index.html          ← All tools listing
│   ├── age-calculator.html
│   ├── emi-calculator.html
│   ├── bmi-calculator.html
│   ├── percentage-calculator.html
│   ├── timezone-converter.html
│   ├── password-generator.html
│   ├── unit-converter.html
│   ├── date-difference.html
│   ├── currency-converter.html
│   └── pdf-tools.html
└── blog/
    ├── index.html          ← All articles listing
    ├── mobile-fix/
    │   ├── index.html
    │   ├── whatsapp-otp-not-received.html
    │   ├── android-phone-slow-fix.html
    │   ├── mobile-data-not-working.html
    │   ├── instagram-login-problem.html
    │   └── facebook-account-locked.html
    ├── govt-services/
    │   ├── index.html
    │   ├── cnic-verification-nadra.html
    │   ├── bisp-payment-check.html
    │   ├── passport-tracking-pakistan.html
    │   ├── electricity-bill-online.html
    │   └── gas-bill-duplicate.html
    ├── education/
    │   ├── index.html
    │   ├── bise-result-check.html
    │   ├── class-9-past-papers.html
    │   ├── scholarship-list-pakistan-2026.html
    │   ├── university-admission-dates.html
    │   └── online-study-notes.html
    └── tech-fix/
        ├── index.html
        ├── laptop-slow-windows-11.html
        ├── app-not-opening-crash.html
        ├── whatsapp-backup-restore.html
        ├── wifi-connected-no-internet.html
        └── phone-overheating.html
```

---

## 🚀 Option 1: Deploy to Netlify (FREE — Recommended)

### Steps:
1. Create a free account at [netlify.com](https://netlify.com)
2. Go to **Sites → Add new site → Deploy manually**
3. Drag and drop the entire `utilpro/` folder
4. Done! You'll get a URL like `https://utilpro.netlify.app`

### Custom Domain:
1. Buy a domain (e.g., utilpro.net) from Namecheap or GoDaddy (~$10/year)
2. In Netlify → Site Settings → Domain Management → Add custom domain
3. Update DNS nameservers at your registrar to point to Netlify

### Enable HTTPS:
- Netlify auto-provisions SSL (Let's Encrypt) for free — no action needed.

---

## 🌐 Option 2: Deploy to cPanel Hosting

### Steps:
1. Log in to your cPanel (e.g., yourdomain.com/cpanel)
2. Go to **File Manager → public_html**
3. Click **Upload** and upload all files maintaining the folder structure
4. OR use FTP client (FileZilla) to upload:
   - Host: your domain or server IP
   - Username: your cPanel username
   - Password: your cPanel password
   - Port: 21
5. Upload all files to `public_html/`

### .htaccess (add for clean URLs and speed):
```apache
# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/png "access plus 1 year"
</IfModule>

# Custom 404
ErrorDocument 404 /index.html
```

---

## 📝 Option 3: GitHub Pages (FREE)

1. Create a GitHub account and new repository named `utilpro`
2. Upload all files to the repo
3. Go to **Settings → Pages → Source → main branch → / (root)**
4. Your site is live at `https://yourusername.github.io/utilpro/`

---

## 💰 Adding Google AdSense

### Step 1: Apply for AdSense
1. Visit [adsense.google.com](https://adsense.google.com)
2. Sign in with Google account
3. Enter your website URL and complete verification
4. Wait for approval (1–14 days)

### Step 2: Add AdSense Script
Add this in the `<head>` of every HTML page:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

### Step 3: Replace Ad Placeholder Divs
Find all `<div class="ad-slot ...">` elements and replace with AdSense ad units:
```html
<!-- Replace this: -->
<div class="ad-slot ad-slot-horizontal">
  <div>📢 Advertisement</div>
</div>

<!-- With this: -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

### Ad Placement Strategy (Already Built In):
- **Top banner** — Below header, above fold (best CTR)
- **Mid-content** — Between tool and info sections
- **Sidebar** — 300x250 on article pages
- **Footer area** — Before site footer

---

## 🔍 SEO Checklist After Deployment

- [ ] Submit sitemap to Google Search Console: [search.google.com/search-console](https://search.google.com/search-console)
- [ ] Submit sitemap URL: `https://yourdomain.com/sitemap.xml`
- [ ] Verify ownership via HTML meta tag or DNS
- [ ] Submit to Bing Webmaster Tools: [bing.com/webmasters](https://bing.com/webmasters)
- [ ] Set up Google Analytics (GA4) for traffic tracking
- [ ] Enable Core Web Vitals monitoring in Search Console
- [ ] Add Open Graph images for social sharing
- [ ] Test mobile responsiveness at [pagespeed.web.dev](https://pagespeed.web.dev)

---

## 🔄 Regular Maintenance

### Monthly:
- Update currency exchange rates in `currency-converter.html`
- Check and update any broken external links
- Add new blog articles (aim for 2-4 per month)

### Quarterly:
- Review Google Search Console for ranking opportunities
- Update article dates and content for freshness
- Add new tools based on user demand

### Yearly:
- Update all "2026" references to current year
- Review and refresh all SEO titles and meta descriptions
- Audit internal linking structure

---

## 📊 Recommended Free Tools

| Tool | Purpose | URL |
|------|---------|-----|
| Google Search Console | SEO monitoring | search.google.com/search-console |
| Google Analytics 4 | Traffic analytics | analytics.google.com |
| PageSpeed Insights | Speed testing | pagespeed.web.dev |
| Ahrefs Webmaster | Backlink tracking | ahrefs.com/webmaster-tools |
| Google AdSense | Monetization | adsense.google.com |

---

*Built with UtilPro — Pure HTML, CSS, JavaScript. No frameworks, no build tools, no dependencies.*
