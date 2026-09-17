/* =====================================================
   PT HIPMI UNJ — Premium Scroll-Triggered Animations
   animations.js — IntersectionObserver-based entrance FX
   ===================================================== */

(function () {
  'use strict';

  /* ─── Utility: add CSS keyframes once ──────────────────── */
  function injectCSS(id, css) {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }

  injectCSS('hipmi-anim-keyframes', `
    /* Hero entrance — always runs on page load */
    @keyframes heroEyebrowIn {
      0%   { opacity: 0; letter-spacing: 0.3em; transform: translateY(-18px); }
      100% { opacity: 1; letter-spacing: 0.12em; transform: translateY(0); }
    }
    @keyframes heroTitleIn {
      0%   { opacity: 0; transform: translateY(40px) skewY(2deg); }
      100% { opacity: 1; transform: translateY(0) skewY(0); }
    }
    @keyframes heroSubtitleIn {
      0%   { opacity: 0; transform: translateX(-32px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes heroActionsIn {
      0%   { opacity: 0; transform: translateY(24px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Scroll-triggered classes */
    .anim-ready { opacity: 0; }

    @keyframes fadeUp {
      0%   { opacity: 0; transform: translateY(48px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeDown {
      0%   { opacity: 0; transform: translateY(-36px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeLeft {
      0%   { opacity: 0; transform: translateX(56px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeRight {
      0%   { opacity: 0; transform: translateX(-56px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes zoomIn {
      0%   { opacity: 0; transform: scale(0.82); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes flipUp {
      0%   { opacity: 0; transform: perspective(600px) rotateX(20deg) translateY(32px); }
      100% { opacity: 1; transform: perspective(600px) rotateX(0deg) translateY(0); }
    }
    @keyframes slideReveal {
      0%   { opacity: 0; transform: translateY(64px) scaleY(0.92); }
      100% { opacity: 1; transform: translateY(0) scaleY(1); }
    }
    @keyframes goldLineGrow {
      0%   { width: 0; opacity: 0; }
      100% { width: 60px; opacity: 1; }
    }

    /* When IntersectionObserver fires: add .is-visible to trigger animation */
    .anim-fade-up.is-visible    { animation: fadeUp    0.72s cubic-bezier(0.22,1,0.36,1) forwards; }
    .anim-fade-down.is-visible  { animation: fadeDown  0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
    .anim-fade-left.is-visible  { animation: fadeLeft  0.72s cubic-bezier(0.22,1,0.36,1) forwards; }
    .anim-fade-right.is-visible { animation: fadeRight 0.72s cubic-bezier(0.22,1,0.36,1) forwards; }
    .anim-zoom-in.is-visible    { animation: zoomIn    0.65s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .anim-flip-up.is-visible    { animation: flipUp    0.80s cubic-bezier(0.22,1,0.36,1) forwards; }
    .anim-slide-reveal.is-visible { animation: slideReveal 0.75s cubic-bezier(0.22,1,0.36,1) forwards; }
  `);

  /* ─── Phase 1: HERO entrance animations (immediate on load) ─ */
  function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const eyebrow  = hero.querySelector('.hero__eyebrow');
    const titles   = hero.querySelectorAll('.hero__title');
    const subtitle = hero.querySelector('.hero__subtitle');
    const actions  = hero.querySelector('.hero__actions');

    function animate(el, animName, duration, delay, easing) {
      if (!el) return;
      el.style.opacity = '0';
      el.style.animation = 'none';
      // Force reflow
      void el.offsetWidth;
      el.style.animation = `${animName} ${duration} ${easing || 'cubic-bezier(0.22,1,0.36,1)'} ${delay} forwards`;
    }

    // Staggered hero entrance sequence
    animate(eyebrow,     'heroEyebrowIn', '0.7s', '0.1s');
    titles.forEach((t, i) => animate(t, 'heroTitleIn',    '0.9s', `${0.28 + i * 0.18}s`));
    animate(subtitle,   'heroSubtitleIn', '0.75s', '0.65s');
    animate(actions,    'heroActionsIn',  '0.65s', '0.90s');
  }

  /* ─── Phase 2: IntersectionObserver for below-fold sections ─ */
  function initScrollAnimations() {
    // Only run if IntersectionObserver is available
    if (!('IntersectionObserver' in window)) {
      // Fallback: just make everything visible
      document.querySelectorAll('.anim-ready').forEach(el => { el.style.opacity = '1'; });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Respect the delay attribute if set
            const delay = el.dataset.animDelay;
            if (delay) el.style.animationDelay = delay;
            el.classList.add('is-visible');
            
            // Clean up animation properties after completion to avoid hover conflicts
            el.addEventListener('animationend', () => {
              el.style.animation = '';
              el.style.animationDelay = '';
              el.style.opacity = '1';
              // Remove animation classes so standard hover transitions run cleanly
              el.classList.remove('anim-ready', 'anim-fade-up', 'anim-fade-down', 'anim-fade-left', 'anim-fade-right', 'anim-zoom-in', 'anim-flip-up', 'anim-slide-reveal', 'is-visible');
            }, { once: true });
            
            // Unobserve after firing (one-shot)
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12,        // Fire when 12% visible
        rootMargin: '0px 0px -40px 0px'  // Slight bottom buffer
      }
    );

    // Observe all pre-marked animation elements
    document.querySelectorAll('.anim-ready').forEach(el => observer.observe(el));
  }

  /* ─── Phase 3: Apply animation classes to home page elements ─ */
  function tagHomeElements() {
    const isHome = !!document.querySelector('.hero');
    if (!isHome) return;

    // --- Section 2 (Usaha Grid) ---
    const sectionUsaha = document.getElementById('usaha-grid');
    if (sectionUsaha) {
      // Section header text
      const secHeader = sectionUsaha.querySelector('.section-header');
      if (secHeader) tag(secHeader, 'anim-fade-right');

      const linkMore = sectionUsaha.querySelector('.link-more');
      if (linkMore) tag(linkMore, 'anim-fade-left', '0.15s');

      // Main left card (PT Bintang)
      const cardBintang = document.getElementById('card-pt-bintang');
      if (cardBintang) tag(cardBintang, 'anim-flip-up', '0.1s');

      // Right sub-cards
      const cardUmamiya = document.getElementById('card-umamiya');
      if (cardUmamiya) tag(cardUmamiya, 'anim-zoom-in', '0.2s');

      const cardMiChi = document.getElementById('card-mi-chi');
      if (cardMiChi) tag(cardMiChi, 'anim-zoom-in', '0.35s');

      const cardBeef = document.getElementById('card-fresh-beef');
      if (cardBeef) tag(cardBeef, 'anim-fade-up', '0.45s');
    }

    // --- Section 3 (Artikel) ---
    const sectionArtikel = document.getElementById('artikel');
    if (sectionArtikel) {
      const secHeader3 = sectionArtikel.querySelector('.section-header');
      if (secHeader3) tag(secHeader3, 'anim-fade-down');

      const featuredArticle = document.getElementById('article-featured');
      if (featuredArticle) tag(featuredArticle, 'anim-fade-right', '0.1s');

      const artSm1 = document.getElementById('article-sm-1');
      if (artSm1) tag(artSm1, 'anim-fade-left', '0.2s');

      const artSm2 = document.getElementById('article-sm-2');
      if (artSm2) tag(artSm2, 'anim-fade-left', '0.35s');

      const btnArtikel = document.getElementById('btn-semua-artikel');
      if (btnArtikel) tag(btnArtikel, 'anim-fade-up', '0.5s');
    }

    // --- Join CTA Section ---
    const joinSection = document.getElementById('join');
    if (joinSection) {
      const joinTitle = joinSection.querySelector('.join-cta__title');
      if (joinTitle) tag(joinTitle, 'anim-slide-reveal');

      const joinSub = joinSection.querySelector('.join-cta__subtitle');
      if (joinSub) tag(joinSub, 'anim-fade-up', '0.15s');

      const joinActions = joinSection.querySelector('.join-cta__actions');
      if (joinActions) tag(joinActions, 'anim-zoom-in', '0.3s');
    }
  }

  /* Helper: assign animation class + mark ready */
  function tag(el, animClass, delay) {
    el.classList.add('anim-ready', animClass);
    if (delay) el.dataset.animDelay = delay;
  }

  /* ─── Boot sequence ─────────────────────────────────────── */
  function boot() {
    // Tag elements BEFORE IntersectionObserver so they start invisible
    tagHomeElements();
    // Hero animates immediately (it's always in viewport)
    initHeroAnimations();
    // Scroll-triggered animations start observing
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
