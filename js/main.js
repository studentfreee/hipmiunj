/* =====================================================
   PT HIPMI UNJ — Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const isUsahaPage = !!document.getElementById('usahaGrid');

  // =====================================================
  // NAVBAR: Glass effect on scroll
  // =====================================================
  const navbar = document.querySelector('.navbar');
  const mobileMenu = document.getElementById('mobileMenu');
  const navToggle = document.getElementById('navToggle');

  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      // Animate hamburger
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  // =====================================================
  // FILTER CHIPS: Active state toggling
  // =====================================================
  const filterGroups = document.querySelectorAll('.filter-chips');

  if (isUsahaPage) {
    filterGroups.forEach(group => {
      const chips = group.querySelectorAll('.chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');

          const filterValue = chip.getAttribute('data-filter');
          if (filterValue !== null) {
            filterCards(filterValue);
          }
        });
      });
    });
  }

  // =====================================================
  // CARD FILTERING (Usaha & Blog pages)
  // =====================================================
  function filterCards(category) {
    const cards = document.querySelectorAll('[data-category]');
    cards.forEach(card => {
      if (category === 'semua' || card.getAttribute('data-category') === category) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.3s ease';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // =====================================================
  // SEARCH INPUT: Live filter
  // =====================================================
  const searchInput = document.getElementById('searchInput');
  if (searchInput && isUsahaPage) {
    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const cards = document.querySelectorAll('[data-search]');
      cards.forEach(card => {
        const searchText = card.getAttribute('data-search').toLowerCase();
        if (searchText.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // =====================================================
  // PAGINATION: Simple UI interaction
  // =====================================================
  if (isUsahaPage) {
    const paginationItems = document.querySelectorAll('.pagination__item:not(.nav-btn)');
    paginationItems.forEach(item => {
      if (item.classList.contains('pagination__dots')) return;
      item.addEventListener('click', () => {
        paginationItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  // =====================================================
  // SMOOTH SCROLL for anchor links
  // =====================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // =====================================================
  // COPY LINK button (blog detail)
  // =====================================================
  const copyBtn = document.getElementById('copyLinkBtn');
  if (copyBtn) {
    const copyLabel = copyBtn.querySelector('.copy-link-label') || copyBtn;
    const originalLabel = copyLabel.textContent;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        copyLabel.textContent = 'Tersalin!';
        setTimeout(() => { copyLabel.textContent = originalLabel; }, 2000);
      }).catch(() => {
        copyLabel.textContent = 'Gagal menyalin';
        setTimeout(() => { copyLabel.textContent = originalLabel; }, 2000);
      });
    });
  }

  // =====================================================
  // CARD HOVER: add aria-label improvements
  // =====================================================
  document.querySelectorAll('.card-usaha, .card-article, .similar-card').forEach(card => {
    const link = card.querySelector('a');
    if (link) {
      card.addEventListener('click', () => link.click());
      card.style.cursor = 'pointer';
    }
  });

});

// CSS Keyframes injection
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
