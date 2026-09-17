/* =====================================================
   PT HIPMI UNJ — Blog & Berita Interactive Animations
   js/blog-animations.js — Entrance, Filter Stagger & Micro-interactions
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

  injectCSS('blog-anim-styles', `
    /* Page Header Title Drop & Expand */
    @keyframes blogHeaderTitleIn {
      0%   { opacity: 0; transform: translateY(-24px) scale(0.97); filter: blur(4px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }

    /* Subtitle Fade Up */
    @keyframes blogHeaderSubIn {
      0%   { opacity: 0; transform: translateY(18px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Search Bar Expand */
    @keyframes blogSearchExpand {
      0%   { opacity: 0; transform: translateY(20px) scale(0.94); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Filter Chips Pop In */
    @keyframes chipPopIn {
      0%   { opacity: 0; transform: translateY(12px) scale(0.85); }
      70%  { transform: translateY(-2px) scale(1.04); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Article Card Stagger Cascade */
    @keyframes blogCardCascade {
      0%   { opacity: 0; transform: translateY(36px) scale(0.95); }
      60%  { opacity: 0.85; }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Header & Filter Initial Ready States */
    .page-header-wrapper .page-header h1 {
      animation: blogHeaderTitleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
    }
    .page-header-wrapper .page-header p {
      animation: blogHeaderSubIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
    }
    .page-header-wrapper .search-filter-bar {
      animation: blogSearchExpand 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
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

    /* Interactive hover effects on Article Cards */
    .card-article {
      will-change: transform, box-shadow;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), 
                  box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .card-article:hover {
      transform: translateY(-8px) scale(1.015) !important;
      box-shadow: 0 18px 36px -8px rgba(0, 10, 30, 0.16), 0 0 0 1px rgba(252, 212, 2, 0.35) !important;
    }
    .card-article:hover .card-article__image img {
      transform: scale(1.08) !important;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .card-article:hover .card-article__link {
      transform: translateX(4px) !important;
      transition: transform 0.3s ease !important;
    }

    /* Dynamic Card Cascade Class */
    .card-article-animate {
      opacity: 0;
      animation: blogCardCascade 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `);

  /* Trigger card stagger animation for visible cards */
  function animateVisibleBlogCards() {
    const cards = document.querySelectorAll('#blogGrid .card-article');
    let visibleIndex = 0;

    cards.forEach((card) => {
      if (card.style.display !== 'none') {
        card.classList.remove('card-article-animate');
        // Force reflow
        void card.offsetWidth;
        card.classList.add('card-article-animate');
        card.style.animationDelay = `${0.07 * visibleIndex + 0.1}s`;
        
        card.addEventListener('animationend', () => {
          card.style.animation = '';
          card.style.animationDelay = '';
          card.classList.remove('card-article-animate');
          card.style.opacity = '1';
        }, { once: true });
        
        visibleIndex++;
      }
    });
  }

  window.animateVisibleBlogCards = animateVisibleBlogCards;

  /* Initialize on DOM load */
  function bootBlog() {
    if (!document.getElementById('blogGrid')) return;

    // Trigger initial grid cascade
    animateVisibleBlogCards();

    // Hook existing main.js filterChips & searchInput triggers if available
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        setTimeout(animateVisibleBlogCards, 20);
      });
    }

    const chips = document.querySelectorAll('.filter-chips .chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        setTimeout(animateVisibleBlogCards, 20);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootBlog);
  } else {
    bootBlog();
  }

})();
