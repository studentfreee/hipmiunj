/* =====================================================
   PT HIPMI UNJ — Katalog Usaha Interactive Animations
   js/usaha-animations.js — Entrance, Filter Stagger & Micro-interactions
   ===================================================== */

(function () {
  'use strict';

  /* ─── Inject Keyframe & Utility CSS ───────────────────── */
  function injectCSS(id, css) {
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  injectCSS('usaha-anim-styles', `
    /* Page Header Title Drop & Expand */
    @keyframes usahaHeaderTitleIn {
      0%   { opacity: 0; transform: translateY(-24px) scale(0.97); filter: blur(4px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }

    /* Subtitle Fade Up */
    @keyframes usahaHeaderSubIn {
      0%   { opacity: 0; transform: translateY(18px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Search Bar Expand */
    @keyframes usahaSearchExpand {
      0%   { opacity: 0; transform: translateY(20px) scale(0.94); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Filter Chips Pop In */
    @keyframes chipPopIn {
      0%   { opacity: 0; transform: translateY(12px) scale(0.85); }
      70%  { transform: translateY(-2px) scale(1.04); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Card Stagger Entrance (Smooth Emerge) */
    @keyframes usahaCardStaggerIn {
      0%   { opacity: 0; transform: translateY(32px) scale(0.94); }
      60%  { opacity: 0.85; }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Header & Filter Initial Ready States */
    .page-header h1 {
      animation: usahaHeaderTitleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
    }
    .page-header p {
      animation: usahaHeaderSubIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
    }
    .search-filter-bar {
      animation: usahaSearchExpand 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
    }

    /* Chip animation stagger */
    .filter-chips .chip {
      opacity: 0;
      animation: chipPopIn 0.55s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
    }
    .filter-chips .chip:nth-child(1) { animation-delay: 0.40s; }
    .filter-chips .chip:nth-child(2) { animation-delay: 0.46s; }
    .filter-chips .chip:nth-child(3) { animation-delay: 0.52s; }
    .filter-chips .chip:nth-child(4) { animation-delay: 0.58s; }
    .filter-chips .chip:nth-child(5) { animation-delay: 0.64s; }
    .filter-chips .chip:nth-child(6) { animation-delay: 0.70s; }

    /* Interactive hover effects on Usaha Cards */
    .card-usaha {
      will-change: transform, box-shadow;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), 
                  box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 0.3s ease !important;
    }
    .card-usaha:hover {
      transform: translateY(-8px) scale(1.015) !important;
      box-shadow: 0 16px 32px -8px rgba(0, 10, 30, 0.16), 0 0 0 1px rgba(252, 212, 2, 0.4) !important;
    }
    .card-usaha:hover .card-usaha__image img {
      transform: scale(1.08) !important;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    /* Card Stagger Class applied dynamically */
    .card-usaha-animate {
      opacity: 0;
      animation: usahaCardStaggerIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `);

  /* Global helper to trigger card stagger animation */
  window.animateUsahaGridCards = function () {
    const cards = document.querySelectorAll('#usahaGrid .card-usaha');
    cards.forEach((card, index) => {
      card.classList.remove('card-usaha-animate');
      // Force reflow
      void card.offsetWidth;
      card.classList.add('card-usaha-animate');
      card.style.animationDelay = `${0.06 * index + 0.1}s`;
      
      card.addEventListener('animationend', () => {
        card.style.animation = '';
        card.style.animationDelay = '';
        card.classList.remove('card-usaha-animate');
        card.style.opacity = '1';
      }, { once: true });
    });
  };

})();
