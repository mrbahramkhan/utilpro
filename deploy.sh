#!/bin/bash
# ============================================================
# UtilPro — Auto Deploy Script
# Run this script ONCE on your local machine or server
# Usage: bash deploy.sh
# ============================================================

set -e  # Stop on any error

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║       UtilPro — Automatic Deploy Script              ║"
echo "║       Deploys to GitHub → Netlify (Free)             ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────
# STEP 1: COLLECT USER INFO
# ─────────────────────────────────────────
echo "📋 Please provide the following information:"
echo ""

read -p "  1. Your GitHub username: " GITHUB_USERNAME
read -p "  2. GitHub repo name (e.g. utilpro-site): " REPO_NAME
read -s -p "  3. GitHub Personal Access Token (github.com/settings/tokens): " GITHUB_TOKEN
echo ""
read -p "  4. Your site domain (or press Enter to use Netlify subdomain): " CUSTOM_DOMAIN
echo ""

if [ -z "$GITHUB_USERNAME" ] || [ -z "$REPO_NAME" ] || [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GitHub username, repo name, and token are required."
  exit 1
fi

echo ""
echo "🔧 Starting deployment..."
echo ""

# ─────────────────────────────────────────
# STEP 2: INIT GIT & PUSH TO GITHUB
# ─────────────────────────────────────────
echo "📁 Step 1/4: Initializing Git repository..."

cd "$(dirname "$0")"  # Move to script directory

# Remove old git if exists
rm -rf .git 2>/dev/null || true

git init
git config user.email "deploy@utilpro.net"
git config user.name "UtilPro Deploy"

# Update sitemap domain if user provided custom domain
if [ -n "$CUSTOM_DOMAIN" ]; then
  echo "🌐 Updating sitemap.xml with your domain: $CUSTOM_DOMAIN"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|https://utilpro.net|https://$CUSTOM_DOMAIN|g" sitemap.xml
  else
    sed -i "s|https://utilpro.net|https://$CUSTOM_DOMAIN|g" sitemap.xml
  fi
fi

git add -A
git commit -m "🚀 Initial UtilPro deployment - $(date '+%Y-%m-%d %H:%M')"

echo ""
echo "📤 Step 2/4: Creating GitHub repository and pushing..."

# Create GitHub repo via API
HTTP_STATUS=$(curl -s -o /tmp/gh_response.json -w "%{http_code}" \
  -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"UtilPro - Free Online Tools and Guides\",
    \"private\": false,
    \"auto_init\": false
  }" \
  "https://api.github.com/user/repos")

if [ "$HTTP_STATUS" = "201" ]; then
  echo "  ✅ GitHub repository created: github.com/$GITHUB_USERNAME/$REPO_NAME"
elif [ "$HTTP_STATUS" = "422" ]; then
  echo "  ℹ️  Repository already exists — will update it."
else
  echo "  ⚠️  GitHub API returned status $HTTP_STATUS"
  cat /tmp/gh_response.json
fi

# Push to GitHub
REMOTE_URL="https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git remote add origin "$REMOTE_URL" 2>/dev/null || git remote set-url origin "$REMOTE_URL"
git branch -M main
git push -u origin main --force

echo "  ✅ Code pushed to GitHub!"

# ─────────────────────────────────────────
# STEP 3: DEPLOY TO NETLIFY
# ─────────────────────────────────────────
echo ""
echo "🌐 Step 3/4: Deploying to Netlify..."

# Check if netlify CLI is available
if command -v netlify &> /dev/null; then
  echo "  ✅ Netlify CLI found — deploying..."
  netlify deploy --prod --dir="." --message="UtilPro Auto Deploy"
else
  # Try to install netlify CLI
  if command -v npm &> /dev/null; then
    echo "  📦 Installing Netlify CLI..."
    npm install -g netlify-cli --silent
    netlify deploy --prod --dir="." --message="UtilPro Auto Deploy"
  else
    echo "  ⚠️  Netlify CLI not available. Will provide manual instructions."
    NETLIFY_MANUAL=true
  fi
fi

# ─────────────────────────────────────────
# STEP 4: SUMMARY
# ─────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║          ✅ DEPLOYMENT COMPLETE!                     ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "📌 Your site is at:"
echo "   🔗 GitHub: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

if [ "$NETLIFY_MANUAL" = true ]; then
  echo "   ⚠️  Netlify deploy — complete manually (30 seconds):"
  echo ""
  echo "   1. Open: https://app.netlify.com/drop"
  echo "   2. Drag your project folder into the browser"
  echo "   3. Done! Your site is live instantly."
  echo ""
  echo "   OR connect GitHub for auto-deploy on every push:"
  echo "   1. Login at netlify.com"
  echo "   2. New site → Import from Git → GitHub"
  echo "   3. Select: $GITHUB_USERNAME/$REPO_NAME"
  echo "   4. Click Deploy — no build command needed"
  echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "  1. 🔍 Google Search Console:"
echo "     → search.google.com/search-console"
echo "     → Add property → Verify → Submit sitemap: /sitemap.xml"
echo ""
echo "  2. 📊 Google Analytics:"  
echo "     → analytics.google.com → Create GA4 property"
echo "     → Add GA4 script to js/performance.js (line marked)"
echo ""
echo "  3. 💰 Google AdSense:"
echo "     → adsense.google.com → Apply with your live site URL"
echo "     → Wait 1-14 days for approval"
echo "     → After approval: edit js/ads.js → update publisherId"
echo ""
echo "  4. 🌐 Custom Domain:"
if [ -n "$CUSTOM_DOMAIN" ]; then
  echo "     → Your domain: $CUSTOM_DOMAIN"
  echo "     → In Netlify: Site Settings → Domain Management → Add domain"
  echo "     → At your registrar: Add CNAME: www → your-site.netlify.app"
else
  echo "     → Buy a domain (namecheap.com, ~Rs.2000-3000/year)"
  echo "     → In Netlify: Site Settings → Domain Management → Add custom domain"
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📖 Full setup guide: open adsense-setup.html in your browser"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
