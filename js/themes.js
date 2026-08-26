/**
 * UtilPro — Multi-Theme System — v2 FIXED
 * 8 Themes: Light, Dark, Ocean, Forest, Sunset, Purple Night, Desert, High Contrast
 */

const THEMES = {
  light: {
    name:'Light', icon:'☀️',
    '--primary':'#1a73e8','--primary-dark':'#1557b0','--primary-light':'#e8f0fe',
    '--secondary':'#34a853','--text-dark':'#1a1a2e','--text-mid':'#444c60',
    '--text-light':'#6b7a99','--bg-white':'#ffffff','--bg-light':'#f8f9fc',
    '--bg-card':'#ffffff','--border':'#e2e8f0','--border-hover':'#b8c7e0',
    '--hero-gradient':'linear-gradient(135deg,#1a73e8 0%,#0d47a1 60%,#1a237e 100%)',
  },
  dark: {
    name:'Dark', icon:'🌙',
    '--primary':'#60a5fa','--primary-dark':'#3b82f6','--primary-light':'#1e3a5f',
    '--secondary':'#4ade80','--text-dark':'#f1f5f9','--text-mid':'#94a3b8',
    '--text-light':'#64748b','--bg-white':'#0f172a','--bg-light':'#1e293b',
    '--bg-card':'#1e293b','--border':'#334155','--border-hover':'#475569',
    '--hero-gradient':'linear-gradient(135deg,#1e293b 0%,#0f172a 100%)',
  },
  ocean: {
    name:'Ocean', icon:'🌊',
    '--primary':'#0891b2','--primary-dark':'#0e7490','--primary-light':'#cffafe',
    '--secondary':'#06b6d4','--text-dark':'#0c1a2e','--text-mid':'#1e4060',
    '--text-light':'#4a7090','--bg-white':'#f0f9ff','--bg-light':'#e0f7fa',
    '--bg-card':'#f0f9ff','--border':'#b3e5fc','--border-hover':'#81d4fa',
    '--hero-gradient':'linear-gradient(135deg,#0891b2 0%,#0e4f6e 60%,#083344 100%)',
  },
  forest: {
    name:'Forest', icon:'🌿',
    '--primary':'#16a34a','--primary-dark':'#15803d','--primary-light':'#dcfce7',
    '--secondary':'#22c55e','--text-dark':'#0a1a0f','--text-mid':'#1a3d22',
    '--text-light':'#4a7a52','--bg-white':'#f0fdf4','--bg-light':'#dcfce7',
    '--bg-card':'#f0fdf4','--border':'#bbf7d0','--border-hover':'#86efac',
    '--hero-gradient':'linear-gradient(135deg,#16a34a 0%,#15803d 60%,#14532d 100%)',
  },
  sunset: {
    name:'Sunset', icon:'🌅',
    '--primary':'#ea580c','--primary-dark':'#c2410c','--primary-light':'#ffedd5',
    '--secondary':'#f97316','--text-dark':'#1c0a00','--text-mid':'#4a1a05',
    '--text-light':'#854d26','--bg-white':'#fffaf5','--bg-light':'#fff7ed',
    '--bg-card':'#fffaf5','--border':'#fed7aa','--border-hover':'#fdba74',
    '--hero-gradient':'linear-gradient(135deg,#ea580c 0%,#dc2626 50%,#9f1239 100%)',
  },
  purple: {
    name:'Purple Night', icon:'🔮',
    '--primary':'#7c3aed','--primary-dark':'#6d28d9','--primary-light':'#ede9fe',
    '--secondary':'#a855f7','--text-dark':'#1a0a2e','--text-mid':'#3d1a6e',
    '--text-light':'#7c5aa0','--bg-white':'#fdf4ff','--bg-light':'#f3e8ff',
    '--bg-card':'#fdf4ff','--border':'#e9d5ff','--border-hover':'#d8b4fe',
    '--hero-gradient':'linear-gradient(135deg,#7c3aed 0%,#6d28d9 50%,#4c1d95 100%)',
  },
  desert: {
    name:'Desert', icon:'🏜️',
    '--primary':'#b45309','--primary-dark':'#92400e','--primary-light':'#fef3c7',
    '--secondary':'#d97706','--text-dark':'#1c0f00','--text-mid':'#4a2f0a',
    '--text-light':'#8a6430','--bg-white':'#fffbeb','--bg-light':'#fef9e7',
    '--bg-card':'#fffbeb','--border':'#fde68a','--border-hover':'#fcd34d',
    '--hero-gradient':'linear-gradient(135deg,#b45309 0%,#92400e 60%,#78350f 100%)',
  },
  contrast: {
    name:'High Contrast', icon:'⚡',
    '--primary':'#ffff00','--primary-dark':'#cccc00','--primary-light':'#333300',
    '--secondary':'#00ff88','--text-dark':'#ffffff','--text-mid':'#dddddd',
    '--text-light':'#aaaaaa','--bg-white':'#000000','--bg-light':'#111111',
    '--bg-card':'#0a0a0a','--border':'#444444','--border-hover':'#666666',
    '--hero-gradient':'linear-gradient(135deg,#111 0%,#000 100%)',
  },
};

let currentTheme = localStorage.getItem('up_theme') || 'light';

function setTheme(key) {
  const theme = THEMES[key];
  if (!theme) return;
  currentTheme = key;
  localStorage.setItem('up_theme', key);

  // Apply all CSS variables to :root
  const root = document.documentElement;
  Object.entries(theme).forEach(([k, v]) => {
    if (k.startsWith('--')) root.style.setProperty(k, v);
  });
  root.setAttribute('data-theme', key);

  // Dark/contrast: set body bg
  if (key === 'dark' || key === 'contrast') {
    document.body.style.background = theme['--bg-light'];
    document.body.style.color = theme['--text-dark'];
  } else {
    document.body.style.background = '';
    document.body.style.color = '';
  }

  // Update hero gradient
  const hero = document.querySelector('.hero');
  if (hero) hero.style.background = theme['--hero-gradient'];

  // Update trigger icon
  const icon = document.querySelector('#theme-trigger .theme-icon');
  if (icon) icon.textContent = theme.icon;

  // Update active state in dropdown
  document.querySelectorAll('.theme-opt').forEach(btn => {
    const isActive = btn.dataset.theme === key;
    btn.style.background = isActive ? 'var(--primary-light)' : '';
    btn.style.color = isActive ? 'var(--primary)' : 'var(--text-mid)';
    btn.style.fontWeight = isActive ? '700' : '500';
    const check = btn.querySelector('.theme-check');
    if (check) check.style.display = isActive ? 'inline' : 'none';
  });

  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: key } }));
}

function buildThemeSwitcher() {
  const wrap = document.createElement('div');
  wrap.id = 'theme-switcher';
  wrap.style.cssText = 'position:relative; margin-left:4px;';

  wrap.innerHTML = `
    <button id="theme-trigger" aria-label="Change theme" title="Change Theme" style="
      display:flex; align-items:center; justify-content:center;
      width:38px; height:38px;
      background:var(--bg-light); border:1.5px solid var(--border);
      border-radius:8px; cursor:pointer; font-size:1.1rem;
      transition:all .2s;
    ">
      <span class="theme-icon">${THEMES[currentTheme].icon}</span>
    </button>
    <div id="theme-dropdown" style="
      position:absolute; top:calc(100% + 6px); right:0;
      background:var(--bg-card,#fff); border:1.5px solid var(--border);
      border-radius:14px; width:210px;
      box-shadow:0 8px 32px rgba(0,0,0,.18);
      z-index:3000; overflow:hidden; display:none;
    ">
      <div style="padding:10px 13px 6px; font-size:.7rem; font-weight:700;
        letter-spacing:.08em; text-transform:uppercase; color:var(--text-light);
        border-bottom:1px solid var(--border);">Choose Theme</div>
      <div style="padding:6px;">
        ${Object.entries(THEMES).map(([key, t]) => `
          <button class="theme-opt" data-theme="${key}"
            onclick="setTheme('${key}'); closeThemeDropdown();"
            style="
              display:flex; align-items:center; gap:10px; width:100%;
              padding:8px 9px; background:${key===currentTheme?'var(--primary-light)':'none'};
              border:none; border-radius:7px; cursor:pointer; font-size:.85rem;
              font-weight:${key===currentTheme?'700':'500'};
              color:${key===currentTheme?'var(--primary)':'var(--text-mid)'};
              transition:all .15s; text-align:left; margin-bottom:2px;
            ">
            <span style="
              width:18px; height:18px; border-radius:50%; flex-shrink:0;
              background:${t['--primary']};
              border:2px solid ${t['--border-hover']};
              display:inline-block;
            "></span>
            <span style="flex:1">${t.icon} ${t.name}</span>
            <span class="theme-check" style="color:var(--primary);font-weight:800;display:${key===currentTheme?'inline':'none'}">✓</span>
          </button>
        `).join('')}
      </div>
    </div>`;

  const trigger = wrap.querySelector('#theme-trigger');
  trigger.addEventListener('click', e => {
    e.stopPropagation();
    const dd = wrap.querySelector('#theme-dropdown');
    const isOpen = dd.style.display === 'block';
    closeAllDropdowns();
    dd.style.display = isOpen ? 'none' : 'block';
  });
  trigger.addEventListener('mouseenter', () => {
    trigger.style.borderColor = 'var(--primary)';
    trigger.style.background = 'var(--primary-light)';
    trigger.style.transform = 'rotate(15deg)';
  });
  trigger.addEventListener('mouseleave', () => {
    trigger.style.borderColor = 'var(--border)';
    trigger.style.background = 'var(--bg-light)';
    trigger.style.transform = '';
  });

  return wrap;
}

function closeThemeDropdown() {
  const dd = document.querySelector('#theme-dropdown');
  if (dd) dd.style.display = 'none';
}

// closeAllDropdowns is defined in i18n.js — use fallback if needed
if (typeof closeAllDropdowns === 'undefined') {
  window.closeAllDropdowns = function() {
    document.querySelectorAll('#lang-dropdown, #theme-dropdown')
      .forEach(d => d.style.display = 'none');
  };
  document.addEventListener('click', closeAllDropdowns);
}

// Extra theme CSS overrides
const themeStyle = document.createElement('style');
themeStyle.textContent = `
  [data-theme="dark"] body { background:#0f172a; color:#f1f5f9; }
  [data-theme="dark"] .header { background:#1e293b; border-color:#334155; }
  [data-theme="dark"] .tool-card,.tool-panel-card { background:#1e293b; }
  [data-theme="dark"] .sidebar-nav { background:#1e293b; }
  [data-theme="dark"] .form-group input,[data-theme="dark"] .form-group select { background:#0f172a; color:#f1f5f9; border-color:#334155; }
  [data-theme="dark"] .blog-card { background:#1e293b; }
  [data-theme="contrast"] body { background:#000 !important; color:#fff !important; }
  [data-theme="contrast"] .header { background:#111; border-color:#444; }
  [data-theme="contrast"] .btn-primary { background:#ffff00; color:#000; }
  [data-theme="contrast"] a { color:#ffff00; }
  [data-theme="contrast"] h1,[data-theme="contrast"] h2,[data-theme="contrast"] h3 { color:#fff; }
  [data-theme="contrast"] .form-group input,[data-theme="contrast"] .form-group select { background:#111; color:#fff; border-color:#666; }
  [data-theme="contrast"] .form-group input:focus { border-color:#ffff00; box-shadow:0 0 0 3px rgba(255,255,0,.2); }
  [data-theme="contrast"] .result-box { background:#111; border-color:#ffff00; }
  [data-theme="contrast"] .result-value { color:#ffff00; }
  [data-theme="contrast"] .scroll-top { background:#ffff00; color:#000; }
  [data-theme="forest"] .btn-primary { background:#16a34a; }
  [data-theme="forest"] .logo { color:#16a34a; }
  [data-theme="forest"] .logo-icon { background:#16a34a; }
  [data-theme="sunset"] .btn-primary { background:#ea580c; }
  [data-theme="sunset"] .logo { color:#ea580c; }
  [data-theme="sunset"] a { color:#ea580c; }
  [data-theme="purple"] .btn-primary { background:#7c3aed; }
  [data-theme="purple"] .logo { color:#7c3aed; }
  [data-theme="purple"] a { color:#7c3aed; }
  [data-theme="desert"] .btn-primary { background:#b45309; }
  [data-theme="desert"] a { color:#b45309; }
  [data-theme="ocean"] .btn-primary { background:#0891b2; }
  [data-theme="ocean"] a { color:#0891b2; }
  body, body * { transition: background-color .25s ease, color .2s ease, border-color .2s ease; }
  .btn, .scroll-top, .tool-card, .action-btn { transition: all .2s ease !important; }
`;
document.head.appendChild(themeStyle);

document.addEventListener('DOMContentLoaded', () => {
  // Remove any legacy theme toggle
  document.getElementById('theme-toggle')?.remove();

  // Build and insert theme switcher before lang switcher in nav
  const nav = document.querySelector('.nav');
  if (nav) nav.appendChild(buildThemeSwitcher());

  // Apply saved theme
  setTheme(currentTheme);
});
