// ===== UTILPRO - MAIN JS =====

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// Scroll to top button
const scrollBtn = document.getElementById('scrollTop');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', () => {
    const q = searchInput.value.trim();
    if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
  });
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
  });
}

// Copy to clipboard utility
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.background = '#34a853';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  });
}

// Share page
function sharePage(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`
  };
  if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
}

// Format number with commas
function formatNum(n) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
