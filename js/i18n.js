/**
 * UtilPro — Multi-Language System (i18n) — v2 FIXED
 * Languages: English, Urdu, Arabic, Hindi, French, Chinese
 */

// ── TRANSLATIONS ──────────────────────────────────
const TRANSLATIONS = {
  en: {
    nav_home:'Home', nav_tools:'Tools', nav_guides:'Guides',
    nav_mobile:'Mobile Fix', nav_govt:'Govt Services', nav_edu:'Education', nav_tech:'Tech Fix',
    hero_badge:'✨ 100% Free — No Login Required',
    hero_title:'Your All-in-One Online Utility Hub',
    hero_desc:'Free calculators, converters, and step-by-step guides for everyday problems.',
    hero_btn_tools:'🔧 Explore Tools', hero_btn_guides:'📖 Read Guides',
    stat_tools:'Free Tools', stat_guides:'Expert Guides', stat_signup:'Signups Needed',
    search_placeholder:'Search tools or guides...', search_btn:'Search',
    browse_cat:'Browse by Category', whats_looking:'What Are You Looking For?',
    free_tools_section:'Free Online Tools', calc_conv_sub:'Instant results — no signup, no ads popup.',
    view_all_tools:'View All Tools →', view_all_guides:'View All 20 Guides →',
    tool_age:'Age Calculator', tool_emi:'Loan EMI Calculator', tool_bmi:'BMI Calculator',
    tool_percent:'Percentage Calculator', tool_timezone:'Time Zone Converter',
    tool_password:'Password Generator', tool_unit:'Unit Converter',
    tool_date:'Date Difference', tool_currency:'Currency Converter', tool_pdf:'PDF Tools',
    cat_tools:'Free Tools', cat_mobile:'Mobile Fix', cat_govt:'Govt Services',
    cat_edu:'Education', cat_tech:'Tech Fix',
    expert_guides:'Expert Guides', howto_articles:'Step-by-Step How-To Articles',
    quick_calc:'Need a Quick Calculation?', open_tools:'Open Free Tools →',
    footer_tagline:'Free tools and expert guides for everyday problems.',
    footer_copy:'© 2026 UtilPro. All rights reserved.',
    calculate:'Calculate', result:'Result', copy:'Copy', copied:'✓ Copied!',
    share:'Share', reset:'Reset', generate:'Generate', convert:'Convert',
    amount:'Amount', swap:'⇄ Swap', error_fill:'Please fill in all required fields.',
    toc:'Table of Contents', share_article:'Share This Guide',
    updated:'Updated', verified:'Verified Solution',
  },
  ur: {
    nav_home:'ہوم', nav_tools:'ٹولز', nav_guides:'گائیڈز',
    nav_mobile:'موبائل فکس', nav_govt:'سرکاری خدمات', nav_edu:'تعلیم', nav_tech:'ٹیک فکس',
    hero_badge:'✨ 100% مفت — لاگ ان کی ضرورت نہیں',
    hero_title:'آپ کا آل-ان-ون آن لائن یوٹیلیٹی ہب',
    hero_desc:'روزمرہ مسائل کے لیے مفت کیلکولیٹر، کنورٹر اور گائیڈز۔',
    hero_btn_tools:'🔧 ٹولز دیکھیں', hero_btn_guides:'📖 گائیڈز پڑھیں',
    stat_tools:'مفت ٹولز', stat_guides:'ماہر گائیڈز', stat_signup:'سائن اپ ضروری',
    search_placeholder:'ٹولز یا گائیڈز تلاش کریں...', search_btn:'تلاش',
    browse_cat:'زمرہ کے مطابق براؤز کریں', whats_looking:'آپ کیا تلاش کر رہے ہیں؟',
    free_tools_section:'مفت آن لائن ٹولز', calc_conv_sub:'فوری نتائج — سائن اپ نہیں، کوئی پاپ اپ نہیں۔',
    view_all_tools:'تمام ٹولز دیکھیں →', view_all_guides:'تمام 20 گائیڈز دیکھیں →',
    tool_age:'عمر کیلکولیٹر', tool_emi:'قرض EMI کیلکولیٹر', tool_bmi:'BMI کیلکولیٹر',
    tool_percent:'فیصد کیلکولیٹر', tool_timezone:'ٹائم زون کنورٹر',
    tool_password:'پاس ورڈ جنریٹر', tool_unit:'یونٹ کنورٹر',
    tool_date:'تاریخ کا فرق', tool_currency:'کرنسی کنورٹر', tool_pdf:'PDF ٹولز',
    cat_tools:'مفت ٹولز', cat_mobile:'موبائل فکس', cat_govt:'سرکاری خدمات',
    cat_edu:'تعلیم', cat_tech:'ٹیک فکس',
    expert_guides:'ماہرانہ گائیڈز', howto_articles:'مرحلہ وار گائیڈز',
    quick_calc:'فوری حساب چاہیے؟', open_tools:'مفت ٹولز کھولیں →',
    footer_tagline:'روزمرہ مسائل کے لیے مفت ٹولز اور گائیڈز۔',
    footer_copy:'© 2026 یوٹیل پرو۔ تمام حقوق محفوظ ہیں۔',
    calculate:'حساب کریں', result:'نتیجہ', copy:'کاپی کریں', copied:'✓ کاپی!',
    share:'شیئر کریں', reset:'ری سیٹ', generate:'بنائیں', convert:'کنورٹ کریں',
    amount:'مقدار', swap:'⇄ تبدیل کریں', error_fill:'براہ کرم تمام ضروری خانے بھریں۔',
    toc:'فہرست مضامین', share_article:'یہ گائیڈ شیئر کریں',
    updated:'اپڈیٹ', verified:'تصدیق شدہ حل',
  },
  ar: {
    nav_home:'الرئيسية', nav_tools:'الأدوات', nav_guides:'الأدلة',
    nav_mobile:'إصلاح الجوال', nav_govt:'الخدمات الحكومية', nav_edu:'التعليم', nav_tech:'إصلاح التقنية',
    hero_badge:'✨ 100% مجاني — لا تسجيل مطلوب',
    hero_title:'مركزك الشامل للأدوات الإلكترونية',
    hero_desc:'أدوات حاسبة مجانية وأدلة للمشاكل اليومية.',
    hero_btn_tools:'🔧 استعرض الأدوات', hero_btn_guides:'📖 اقرأ الأدلة',
    stat_tools:'أدوات مجانية', stat_guides:'أدلة الخبراء', stat_signup:'تسجيلات مطلوبة',
    search_placeholder:'ابحث عن أدوات أو أدلة...', search_btn:'بحث',
    browse_cat:'تصفح حسب الفئة', whats_looking:'ماذا تبحث عن؟',
    free_tools_section:'أدوات مجانية عبر الإنترنت', calc_conv_sub:'نتائج فورية — بدون تسجيل.',
    view_all_tools:'عرض جميع الأدوات →', view_all_guides:'عرض جميع الأدلة →',
    tool_age:'حاسبة العمر', tool_emi:'حاسبة قسط القرض', tool_bmi:'حاسبة مؤشر كتلة الجسم',
    tool_percent:'حاسبة النسبة المئوية', tool_timezone:'محول المنطقة الزمنية',
    tool_password:'مولد كلمات المرور', tool_unit:'محول الوحدات',
    tool_date:'فرق التاريخ', tool_currency:'محول العملات', tool_pdf:'أدوات PDF',
    cat_tools:'أدوات مجانية', cat_mobile:'إصلاح الجوال', cat_govt:'خدمات حكومية',
    cat_edu:'التعليم', cat_tech:'إصلاح التقنية',
    expert_guides:'أدلة الخبراء', howto_articles:'مقالات خطوة بخطوة',
    quick_calc:'تحتاج حساباً سريعاً؟', open_tools:'فتح الأدوات المجانية →',
    footer_tagline:'أدوات مجانية وأدلة متخصصة للمشاكل اليومية.',
    footer_copy:'© 2026 UtilPro. جميع الحقوق محفوظة.',
    calculate:'احسب', result:'النتيجة', copy:'نسخ', copied:'✓ تم النسخ!',
    share:'مشاركة', reset:'إعادة تعيين', generate:'توليد', convert:'تحويل',
    amount:'المبلغ', swap:'⇄ تبديل', error_fill:'يرجى ملء جميع الحقول المطلوبة.',
    toc:'جدول المحتويات', share_article:'شارك هذا الدليل',
    updated:'محدث', verified:'حل موثق',
  },
  hi: {
    nav_home:'होम', nav_tools:'टूल्स', nav_guides:'गाइड',
    nav_mobile:'मोबाइल फिक्स', nav_govt:'सरकारी सेवाएं', nav_edu:'शिक्षा', nav_tech:'टेक फिक्स',
    hero_badge:'✨ 100% मुफ्त — लॉगिन की जरूरत नहीं',
    hero_title:'आपका ऑल-इन-वन ऑनलाइन यूटिलिटी हब',
    hero_desc:'रोज़ की समस्याओं के लिए मुफ्त कैलकुलेटर, कन्वर्टर और गाइड।',
    hero_btn_tools:'🔧 टूल्स देखें', hero_btn_guides:'📖 गाइड पढ़ें',
    stat_tools:'मुफ्त टूल्स', stat_guides:'विशेषज्ञ गाइड', stat_signup:'साइनअप जरूरी',
    search_placeholder:'टूल्स या गाइड खोजें...', search_btn:'खोजें',
    browse_cat:'श्रेणी के अनुसार ब्राउज़ करें', whats_looking:'आप क्या ढूंढ रहे हैं?',
    free_tools_section:'मुफ्त ऑनलाइन टूल्स', calc_conv_sub:'तुरंत परिणाम — कोई साइनअप नहीं।',
    view_all_tools:'सभी टूल्स देखें →', view_all_guides:'सभी 20 गाइड देखें →',
    tool_age:'आयु कैलकुलेटर', tool_emi:'लोन EMI कैलकुलेटर', tool_bmi:'BMI कैलकुलेटर',
    tool_percent:'प्रतिशत कैलकुलेटर', tool_timezone:'टाइम ज़ोन कन्वर्टर',
    tool_password:'पासवर्ड जेनरेटर', tool_unit:'यूनिट कन्वर्टर',
    tool_date:'तारीख अंतर', tool_currency:'मुद्रा कन्वर्टर', tool_pdf:'PDF टूल्स',
    cat_tools:'मुफ्त टूल्स', cat_mobile:'मोबाइल फिक्स', cat_govt:'सरकारी सेवाएं',
    cat_edu:'शिक्षा', cat_tech:'टेक फिक्स',
    expert_guides:'विशेषज्ञ गाइड', howto_articles:'चरण-दर-चरण लेख',
    quick_calc:'त्वरित गणना चाहिए?', open_tools:'मुफ्त टूल खोलें →',
    footer_tagline:'रोज़ की समस्याओं के लिए मुफ्त टूल और गाइड।',
    footer_copy:'© 2026 UtilPro. सर्वाधिकार सुरक्षित।',
    calculate:'गणना करें', result:'परिणाम', copy:'कॉपी करें', copied:'✓ कॉपी!',
    share:'शेयर करें', reset:'रीसेट', generate:'जनरेट करें', convert:'परिवर्तित करें',
    amount:'राशि', swap:'⇄ स्वैप करें', error_fill:'कृपया सभी आवश्यक फ़ील्ड भरें।',
    toc:'विषय सूची', share_article:'यह गाइड शेयर करें',
    updated:'अपडेट', verified:'सत्यापित समाधान',
  },
  fr: {
    nav_home:'Accueil', nav_tools:'Outils', nav_guides:'Guides',
    nav_mobile:'Réparation Mobile', nav_govt:'Services Gouv.', nav_edu:'Éducation', nav_tech:'Tech Fix',
    hero_badge:'✨ 100% Gratuit — Sans inscription',
    hero_title:'Votre Hub Utilitaire Tout-en-Un',
    hero_desc:'Calculatrices gratuites, convertisseurs et guides étape par étape.',
    hero_btn_tools:'🔧 Voir les Outils', hero_btn_guides:'📖 Lire les Guides',
    stat_tools:'Outils Gratuits', stat_guides:'Guides Experts', stat_signup:'Inscriptions Requises',
    search_placeholder:'Rechercher des outils ou guides...', search_btn:'Chercher',
    browse_cat:'Parcourir par Catégorie', whats_looking:'Que Cherchez-Vous?',
    free_tools_section:'Outils Gratuits En Ligne', calc_conv_sub:'Résultats instantanés — sans inscription.',
    view_all_tools:'Voir Tous les Outils →', view_all_guides:'Voir les 20 Guides →',
    tool_age:"Calculateur d'Âge", tool_emi:'Calculateur EMI', tool_bmi:"Calculateur d'IMC",
    tool_percent:'Calculateur de %', tool_timezone:'Convertisseur de Fuseau',
    tool_password:'Générateur de Mot de Passe', tool_unit:"Convertisseur d'Unités",
    tool_date:'Différence de Date', tool_currency:'Convertisseur de Devise', tool_pdf:'Outils PDF',
    cat_tools:'Outils Gratuits', cat_mobile:'Réparation Mobile', cat_govt:'Services Gouv.',
    cat_edu:'Éducation', cat_tech:'Tech Fix',
    expert_guides:'Guides Experts', howto_articles:'Articles Étape par Étape',
    quick_calc:"Besoin d'un Calcul Rapide?", open_tools:'Ouvrir les Outils →',
    footer_tagline:'Outils gratuits et guides pour les problèmes quotidiens.',
    footer_copy:'© 2026 UtilPro. Tous droits réservés.',
    calculate:'Calculer', result:'Résultat', copy:'Copier', copied:'✓ Copié!',
    share:'Partager', reset:'Réinitialiser', generate:'Générer', convert:'Convertir',
    amount:'Montant', swap:'⇄ Échanger', error_fill:'Veuillez remplir tous les champs.',
    toc:'Table des Matières', share_article:'Partager ce Guide',
    updated:'Mis à jour', verified:'Solution Vérifiée',
  },
  zh: {
    nav_home:'首页', nav_tools:'工具', nav_guides:'指南',
    nav_mobile:'手机修复', nav_govt:'政府服务', nav_edu:'教育', nav_tech:'技术修复',
    hero_badge:'✨ 完全免费 — 无需登录',
    hero_title:'您的一站式在线工具中心',
    hero_desc:'解决日常问题的免费计算器、转换器和分步指南。',
    hero_btn_tools:'🔧 浏览工具', hero_btn_guides:'📖 阅读指南',
    stat_tools:'免费工具', stat_guides:'专家指南', stat_signup:'需要注册',
    search_placeholder:'搜索工具或指南...', search_btn:'搜索',
    browse_cat:'按类别浏览', whats_looking:'您在寻找什么？',
    free_tools_section:'免费在线工具', calc_conv_sub:'即时结果 — 无需注册，无弹窗。',
    view_all_tools:'查看所有工具 →', view_all_guides:'查看全部20篇指南 →',
    tool_age:'年龄计算器', tool_emi:'贷款EMI计算器', tool_bmi:'BMI计算器',
    tool_percent:'百分比计算器', tool_timezone:'时区转换器',
    tool_password:'密码生成器', tool_unit:'单位转换器',
    tool_date:'日期差计算器', tool_currency:'货币转换器', tool_pdf:'PDF工具',
    cat_tools:'免费工具', cat_mobile:'手机修复', cat_govt:'政府服务',
    cat_edu:'教育', cat_tech:'技术修复',
    expert_guides:'专家指南', howto_articles:'分步操作文章',
    quick_calc:'需要快速计算？', open_tools:'打开免费工具 →',
    footer_tagline:'解决日常问题的免费工具和专业指南。',
    footer_copy:'© 2026 UtilPro. 版权所有。',
    calculate:'计算', result:'结果', copy:'复制', copied:'✓ 已复制!',
    share:'分享', reset:'重置', generate:'生成', convert:'转换',
    amount:'数量', swap:'⇄ 交换', error_fill:'请填写所有必填字段。',
    toc:'目录', share_article:'分享这篇指南',
    updated:'更新', verified:'已验证方案',
  },
};

// ── LANGUAGE CONFIG ────────────────────────────────
const LANGS = {
  en: { name:'English',   flag:'🇬🇧', dir:'ltr' },
  ur: { name:'اردو',      flag:'🇵🇰', dir:'rtl' },
  ar: { name:'العربية',   flag:'🇸🇦', dir:'rtl' },
  hi: { name:'हिन्दी',    flag:'🇮🇳', dir:'ltr' },
  fr: { name:'Français',  flag:'🇫🇷', dir:'ltr' },
  zh: { name:'中文',       flag:'🇨🇳', dir:'ltr' },
};

// ── CORE FUNCTIONS ────────────────────────────────
let currentLang = localStorage.getItem('up_lang') || 'en';

function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;
}

function setLanguage(lang) {
  if (!LANGS[lang]) return;
  currentLang = lang;
  localStorage.setItem('up_lang', lang);
  applyLanguage(lang);
  showLangToast(lang);
}

function applyLanguage(lang) {
  const cfg = LANGS[lang];
  if (!cfg) return;

  // Set document direction & lang
  document.documentElement.lang = lang;
  document.documentElement.dir = cfg.dir;
  document.body.classList.toggle('rtl', cfg.dir === 'rtl');

  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });

  // Update lang switcher active state
  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update trigger display
  const trigger = document.querySelector('.lang-trigger-text');
  if (trigger) trigger.textContent = `${cfg.flag} ${cfg.name}`;
}

function showLangToast(lang) {
  const cfg = LANGS[lang];
  const existing = document.getElementById('lang-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'lang-toast';
  toast.style.cssText = `
    position:fixed; top:80px; right:20px; z-index:9999;
    background:#1a1a2e; color:#fff; padding:12px 18px;
    border-radius:10px; font-size:14px; font-weight:500;
    box-shadow:0 4px 20px rgba(0,0,0,0.3);
    animation:slideInRight .3s ease; display:flex; align-items:center; gap:8px;
  `;
  toast.innerHTML = `${cfg.flag} Language changed to <strong>${cfg.name}</strong>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(20px)'; toast.style.transition='all .3s'; setTimeout(() => toast.remove(), 300); }, 2500);
}

// ── BUILD LANGUAGE SWITCHER ───────────────────────
function buildLangSwitcher() {
  const cfg = LANGS[currentLang];
  const wrap = document.createElement('div');
  wrap.id = 'lang-switcher';
  wrap.style.cssText = 'position:relative; margin-left:8px;';

  wrap.innerHTML = `
    <button id="lang-trigger" aria-label="Change language" style="
      display:flex; align-items:center; gap:6px; padding:7px 12px;
      background:var(--bg-light); border:1.5px solid var(--border);
      border-radius:8px; cursor:pointer; font-size:.84rem; font-weight:600;
      color:var(--text-mid); transition:all .2s; white-space:nowrap;
    ">
      <span class="lang-trigger-text">${cfg.flag} ${cfg.name}</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style="opacity:.5;flex-shrink:0"><path d="M5 7L0 2h10z"/></svg>
    </button>
    <div id="lang-dropdown" style="
      position:absolute; top:calc(100% + 6px); right:0;
      background:var(--bg-card,#fff); border:1.5px solid var(--border);
      border-radius:12px; min-width:170px; box-shadow:0 8px 28px rgba(0,0,0,.15);
      z-index:3000; overflow:hidden; display:none;
    ">
      ${Object.entries(LANGS).map(([code, data]) => `
        <button class="lang-opt ${code === currentLang ? 'active' : ''}"
          data-lang="${code}"
          onclick="setLanguage('${code}'); closeLangDropdown();"
          style="
            display:flex; align-items:center; gap:10px; width:100%;
            padding:10px 14px; background:none; border:none; border-bottom:1px solid var(--border);
            cursor:pointer; font-size:.86rem; font-weight:500; color:var(--text-mid);
            text-align:left; transition:background .15s;
            ${code === currentLang ? 'color:var(--primary);font-weight:700;background:var(--primary-light);' : ''}
          "
          onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary)'"
          onmouseout="this.style.background='${code===currentLang?'var(--primary-light)':''}'; this.style.color='${code===currentLang?'var(--primary)':'var(--text-mid)'}'">
          <span style="font-size:1.1rem">${data.flag}</span>
          <span>${data.name}</span>
          ${code === currentLang ? '<span style="margin-left:auto;color:var(--primary)">✓</span>' : ''}
        </button>
      `).join('')}
    </div>`;

  // Last item border
  setTimeout(() => {
    const btns = wrap.querySelectorAll('.lang-opt');
    if (btns.length) btns[btns.length-1].style.borderBottom = 'none';
  }, 0);

  // Toggle dropdown
  const trigger = wrap.querySelector('#lang-trigger');
  trigger.addEventListener('click', e => {
    e.stopPropagation();
    const dd = wrap.querySelector('#lang-dropdown');
    const isOpen = dd.style.display === 'block';
    closeAllDropdowns();
    dd.style.display = isOpen ? 'none' : 'block';
  });

  trigger.addEventListener('mouseenter', () => {
    trigger.style.borderColor = 'var(--primary)';
    trigger.style.color = 'var(--primary)';
    trigger.style.background = 'var(--primary-light)';
  });
  trigger.addEventListener('mouseleave', () => {
    trigger.style.borderColor = 'var(--border)';
    trigger.style.color = 'var(--text-mid)';
    trigger.style.background = 'var(--bg-light)';
  });

  return wrap;
}

function closeLangDropdown() {
  const dd = document.querySelector('#lang-dropdown');
  if (dd) dd.style.display = 'none';
}

function closeAllDropdowns() {
  document.querySelectorAll('#lang-dropdown, #theme-dropdown').forEach(d => d.style.display = 'none');
}

document.addEventListener('click', closeAllDropdowns);

// ── INJECT SLIDE-IN ANIMATION ─────────────────────
const langStyle = document.createElement('style');
langStyle.textContent = `
  @keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  body.rtl { direction: rtl; text-align: right; }
  body.rtl .nav { flex-direction: row-reverse; }
  body.rtl .nav-links { flex-direction: row-reverse; }
  body.rtl .hero-content { text-align: right; }
  body.rtl .hero-btns { flex-direction: row-reverse; justify-content: flex-start; }
  body.rtl .hero-stats { flex-direction: row-reverse; }
  body.rtl .breadcrumb { direction: rtl; }
  body.rtl .step-box { flex-direction: row-reverse; }
  body.rtl .step-content { text-align: right; }
  body.rtl .callout { border-left: none; border-right: 4px solid var(--primary); }
  body.rtl .toc ol { padding-right: 18px; padding-left: 0; }
  body.rtl .article-content ul, body.rtl .article-content ol { margin-right: 22px; margin-left: 0; }
  body.rtl .footer-grid { direction: rtl; }
  body.rtl .footer-bottom { flex-direction: row-reverse; }
  body.rtl #lang-dropdown { right: auto; left: 0; }
  body.rtl #theme-dropdown { right: auto; left: 0; }
  body[lang="ur"], body[lang="ar"] { font-size: 1.04rem; line-height: 1.9; }
`;
document.head.appendChild(langStyle);

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Build lang switcher and insert into nav
  const nav = document.querySelector('.nav');
  if (nav) nav.appendChild(buildLangSwitcher());

  // Apply saved language
  applyLanguage(currentLang);

  // Update mobile menu active states
  document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    const langCode = btn.getAttribute('onclick')?.match(/setLanguage\('(\w+)'\)/)?.[1];
    if (langCode === currentLang) btn.style.background = 'var(--primary-light)';
  });
});
