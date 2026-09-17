/* =====================================================
   PT HIPMI UNJ — About Page Animations
   about-animations.js — Scroll-triggered & parallax FX
   ===================================================== */
(function () {
  'use strict';



  /* ─── Inject CSS ──────────────────────────────────────── */
  function injectCSS(id, css) {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id; s.textContent = css;
    document.head.appendChild(s);
  }

  injectCSS('about-anim-css', `
    /* Building rises smoothly from below — extra smooth long duration */
    @keyframes buildingRiseUp {
      0%   { opacity: 0; transform: translateY(80px) scale(1.04); filter: blur(6px); }
      40%  { opacity: 0.6; }
      100% { opacity: 1;  transform: translateY(0)   scale(1);    filter: blur(0); }
    }

    /* Section 1: Text fade + slide from left */
    @keyframes aboutTextSlideIn {
      0%   { opacity: 0; transform: translateX(-48px); filter: blur(3px); }
      100% { opacity: 1; transform: translateX(0);    filter: blur(0); }
    }

    /* Section 1: Logo — same rise-from-below as building (wrapper handles centering) */
    @keyframes logoRiseUp {
      0%   { opacity: 0; transform: translateY(80px) scale(1.04); filter: blur(6px); }
      40%  { opacity: 0.6; }
      100% { opacity: 1;  transform: translateY(0)   scale(1);    filter: blur(0); }
    }

    /* Section 1: Brand name sweep reveal */
    @keyframes brandSweep {
      0%   { opacity: 0; transform: translateX(55px); letter-spacing: -0.08em; }
      100% { opacity: 1; transform: translateX(0);   letter-spacing: 0.02em; }
    }

    /* Section 2: Standard Emerge / Zoom-In from inside for VM Cards */
    @keyframes vmCardEmerge {
      0%   { opacity: 0; transform: scale(0.92) translateY(24px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* VM title smooth fade-down */
    @keyframes vmTitleFadeDown {
      0%   { opacity: 0; transform: translateY(-20px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Section 3: Team cards pop in with spring */
    @keyframes teamPop {
      0%   { opacity: 0; transform: scale(0.62) translateY(36px); }
      70%  { transform: scale(1.06) translateY(-4px); opacity: 1; }
      100% { transform: scale(1)    translateY(0);    opacity: 1; }
    }

    /* Section 3: Division items slot in from sides alternating */
    @keyframes divisionSlotLeft {
      0%   { opacity: 0; transform: translateX(-55px) rotate(-2.5deg); }
      100% { opacity: 1; transform: translateX(0)     rotate(0); }
    }
    @keyframes divisionSlotRight {
      0%   { opacity: 0; transform: translateX(55px) rotate(2.5deg); }
      100% { opacity: 1; transform: translateX(0)    rotate(0); }
    }

    /* Org header */
    @keyframes orgHeaderIn {
      0%   { opacity: 0; transform: translateY(28px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Join CTA */
    @keyframes ctaWipe {
      0%   { opacity: 0; transform: translateY(44px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0)    scale(1); }
    }

    /* Ready state */
    .a-ready { opacity: 0; }

    /* Building animate on hero ::before */
    .about-hero.building-animate::before {
      animation: buildingRiseUp 1.6s cubic-bezier(0.16,1,0.3,1) 0.15s both;
    }

    /* Triggered animation classes */
    .a-ready.a-text-slide.a-go    { animation: aboutTextSlideIn 0.78s cubic-bezier(0.22,1,0.36,1) forwards; }
    .a-ready.a-brand-sweep.a-go   { animation: brandSweep       0.78s cubic-bezier(0.22,1,0.36,1) forwards; }

    /* Logo: same smooth rise-up as building */
    .about-hero__logo.logo-revealed {
      animation: logoRiseUp 1.6s cubic-bezier(0.16,1,0.3,1) 0.25s both;
    }

    .a-ready.a-vm-title.a-go      { animation: vmTitleFadeDown 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
    .a-ready.a-vm-left.a-go       { animation: vmCardEmerge    0.75s cubic-bezier(0.22,1,0.36,1) forwards; }
    .a-ready.a-vm-right.a-go      { animation: vmCardEmerge    0.75s cubic-bezier(0.22,1,0.36,1) 0.15s forwards; }

    .a-ready.a-org-header.a-go    { animation: orgHeaderIn       0.70s cubic-bezier(0.22,1,0.36,1) forwards; }
    .a-ready.a-team-pop.a-go      { animation: teamPop           0.72s cubic-bezier(0.34,1.56,0.64,1) forwards; }

    .a-ready.a-div-left.a-go      { animation: divisionSlotLeft  0.62s cubic-bezier(0.22,1,0.36,1) forwards; }
    .a-ready.a-div-right.a-go     { animation: divisionSlotRight 0.62s cubic-bezier(0.22,1,0.36,1) forwards; }

    .a-ready.a-cta-wipe.a-go      { animation: ctaWipe           0.82s cubic-bezier(0.22,1,0.36,1) forwards; }
  `);

  /* ─── Helper: tag element with animation class ──────────── */
  function tag(el, animClass, delay) {
    if (!el) return;
    el.classList.add('a-ready', animClass);
    if (delay) el.style.animationDelay = delay;
  }

  /* ─── Shared observer helper ────────────────────────────── */
  function observe(els, threshold, callback) {
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => { el.style.opacity = '1'; });
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          callback(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: threshold, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => obs.observe(el));
  }

  /* ─── SECTION 1: ABOUT HERO ────────────────────────────── */
  function initSection1() {
    const heroSection = document.getElementById('tentang');
    if (!heroSection) return;

    // Building rises from bottom smoothly on page load
    const abouthero = document.querySelector('.about-light-flow .about-hero');
    if (abouthero) {
      setTimeout(() => abouthero.classList.add('building-animate'), 100);

      // Parallax: building moves at 0.25x scroll speed (gentler)
      let ticking = false;
      const handleParallax = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const heroH = heroSection.offsetHeight;
            if (scrolled < heroH * 1.5) {
              const offset = scrolled * 0.22;
              abouthero.style.setProperty('--parallax-y', `-${offset}px`);
            }
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // CSS var for parallax
    injectCSS('parallax-building', `
      .about-light-flow .about-hero::before {
        transform: translateY(var(--parallax-y, 0));
        will-change: transform;
      }
    `);

    // Text content: slide from left, staggered
    const subtitle = heroSection.querySelector('.about-hero__subtitle');
    const descs    = heroSection.querySelectorAll('.about-hero__desc');
    tag(subtitle, 'a-text-slide');
    descs.forEach((d, i) => {
      tag(d, 'a-text-slide');
      d.style.animationDelay = `${0.18 + i * 0.16}s`;
    });

    // Brand name sweeps from right
    const brandName = heroSection.querySelector('.about-hero__brand-name');
    tag(brandName, 'a-brand-sweep');
    if (brandName) brandName.style.animationDelay = '0.32s';

    // Logo: iris reveal via direct class (wrapper handles centering, no translateY needed in anim)
    const logo     = heroSection.querySelector('.about-hero__logo');
    const glowRing = heroSection.querySelector('.logo-glow-ring');

    // Fire all hero text elements on page load
    setTimeout(() => {
      [subtitle, ...descs, brandName].forEach(el => {
        if (el) el.classList.add('a-go');
      });

      // Logo + glow ring fire with cinematic sequence
      if (logo) logo.classList.add('logo-revealed');
      if (glowRing) glowRing.classList.add('ring-fired');
    }, 300);
  }

  /* ─── SECTION 2: VISI & MISI ────────────────────────────── */
  function initSection2() {
    const vmSection = document.getElementById('visi');
    if (!vmSection) return;

    const vmTitle = vmSection.querySelector('.vm-title');
    const vmCards = vmSection.querySelectorAll('.vm-card');

    tag(vmTitle, 'a-vm-title');
    vmCards.forEach((card, i) => {
      tag(card, i % 2 === 0 ? 'a-vm-left' : 'a-vm-right');
      card.style.animationDelay = `${0.12 * i}s`;
    });

    observe([vmTitle, ...vmCards].filter(Boolean), 0.15, el => el.classList.add('a-go'));
  }

  /* ─── SECTION 3: STRUKTUR ORGANISASI ────────────────────── */
  function initSection3() {
    const orgSection = document.getElementById('struktur');
    if (!orgSection) return;

    const orgHeader = orgSection.querySelector('.org-section__header');
    tag(orgHeader, 'a-org-header');
    observe([orgHeader].filter(Boolean), 0.1, el => el.classList.add('a-go'));

    const teamCards = orgSection.querySelectorAll('.team-card');
    teamCards.forEach((card, i) => {
      tag(card, 'a-team-pop');
      card.style.animationDelay = `${i * 0.08}s`;
    });
    observe([...teamCards], 0.08, el => el.classList.add('a-go'));

    const divItems = orgSection.querySelectorAll('.division-card-link');
    divItems.forEach((item, i) => {
      tag(item, i % 2 === 0 ? 'a-div-left' : 'a-div-right');
      item.style.animationDelay = `${i * 0.09}s`;
    });
    observe([...divItems], 0.08, el => el.classList.add('a-go'));
  }

  /* ─── JOIN CTA ──────────────────────────────────────────── */
  function initJoinCTA() {
    const joinSection = document.getElementById('join');
    if (!joinSection) return;

    const title   = joinSection.querySelector('.join-cta__title');
    const sub     = joinSection.querySelector('.join-cta__subtitle');
    const actions = joinSection.querySelector('.join-cta__actions');

    [title, sub, actions].forEach((el, i) => {
      if (!el) return;
      tag(el, 'a-cta-wipe');
      el.style.animationDelay = `${i * 0.15}s`;
    });

    observe([title, sub, actions].filter(Boolean), 0.12, el => el.classList.add('a-go'));
  }

  /* ─── SCROLL SPY FOR QUICK TABS (Wireframe Spec) ─────────── */
  function initScrollSpy() {
    const tabs = {
      'tentang': document.getElementById('tab-tentang'),
      'visi': document.getElementById('tab-visi'),
      'struktur': document.getElementById('tab-struktur')
    };

    const sections = {
      'tentang': document.getElementById('tentang'),
      'visi': document.getElementById('visi'),
      'struktur': document.getElementById('struktur')
    };

    if (!tabs.tentang || !sections.tentang) return;

    // Click behavior: smooth scroll to targets with offset
    Object.keys(tabs).forEach(key => {
      const tab = tabs[key];
      const section = sections[key];
      if (tab && section) {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const offsetTop = section.offsetTop - 120;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          // Update active state manually
          Object.values(tabs).forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        });
      }
    });

    // Scroll spy using IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '-150px 0px -60% 0px',
        threshold: 0
      };

      const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            Object.keys(tabs).forEach(key => {
              if (tabs[key]) {
                if (key === id) {
                  tabs[key].classList.add('active');
                } else {
                  tabs[key].classList.remove('active');
                }
              }
            });
          }
        });
      }, observerOptions);

      Object.values(sections).forEach(sec => {
        if (sec) spyObserver.observe(sec);
      });
    }
  }

  /* ─── Boot ──────────────────────────────────────────────── */
  function boot() {
    if (!document.getElementById('tentang')) return;
    initSection1();
    initSection2();
    initSection3();
    initJoinCTA();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
