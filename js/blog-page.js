document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('blogGrid');
  const paginationNav = document.querySelector('.pagination');
  const searchInput = document.getElementById('searchInput');
  const chips = document.querySelectorAll('.filter-chips .chip');
  const blogsData = window.blogsData || {};

  if (!grid || !paginationNav || !blogsData) return;

  const blogItems = Object.entries(blogsData).map(([id, blog]) => ({ id, ...blog }));
  const itemsPerPage = 3;
  let currentFilter = 'semua';
  let currentQuery = '';
  let currentPage = 1;

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function getCategoryClass(category) {
    if (category === 'Berita') return 'pill-gold';
    return '';
  }

  function getFilteredItems() {
    return blogItems.filter(item => {
      const matchesCategory = currentFilter === 'semua' || item.category.toLowerCase() === currentFilter;
      const searchBlob = [item.title, item.category, item.date, ...(item.paragraphs || [])].join(' ').toLowerCase();
      const matchesQuery = !currentQuery || searchBlob.includes(currentQuery);
      return matchesCategory && matchesQuery;
    });
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      paginationNav.innerHTML = '';
      paginationNav.style.display = 'none';
      return;
    }

    paginationNav.style.display = 'flex';
    let html = '';

    html += `<button class="pagination__item nav-btn ${currentPage === 1 ? 'disabled' : ''}" id="prev-page" aria-label="Halaman sebelumnya">&lsaquo;</button>`;

    for (let page = 1; page <= totalPages; page++) {
      html += `<button class="pagination__item ${page === currentPage ? 'active' : ''}" id="page-${page}" ${page === currentPage ? 'aria-current="page"' : ''}>${page}</button>`;
    }

    html += `<button class="pagination__item nav-btn ${currentPage === totalPages ? 'disabled' : ''}" id="next-page" aria-label="Halaman berikutnya">&rsaquo;</button>`;

    paginationNav.innerHTML = html;

    paginationNav.querySelectorAll('.pagination__item').forEach(button => {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        if (button.classList.contains('disabled')) return;

        if (button.id === 'prev-page') {
          currentPage = Math.max(1, currentPage - 1);
        } else if (button.id === 'next-page') {
          currentPage = Math.min(totalPages, currentPage + 1);
        } else {
          currentPage = Number(button.textContent);
        }

        renderGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function renderGrid() {
    const filteredItems = getFilteredItems();
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 0;

    if (totalPages > 0 && currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    if (pageItems.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; color: var(--on-surface-variant);">
          <h3>Tidak ada artikel ditemukan</h3>
          <p>Coba gunakan kata kunci lain atau pilih filter lainnya.</p>
        </div>
      `;
      renderPagination(0);
      return;
    }

    grid.innerHTML = pageItems.map(item => {
      const categoryClass = getCategoryClass(item.category);
      const excerpt = item.paragraphs && item.paragraphs.length > 0 ? item.paragraphs[0] : '';
      const searchBlob = [item.title, item.category, item.date, ...(item.paragraphs || [])].join(' ');

      return `
        <article class="card-article" data-category="${escapeHtml(item.category.toLowerCase())}" data-search="${escapeHtml(searchBlob)}" id="blog-${escapeHtml(item.id)}">
          <div class="card-article__image">
            <img src="${escapeHtml(item.mainImage)}" alt="${escapeHtml(item.title)}" loading="lazy" />
            <div class="card-article__pill"><span class="pill ${categoryClass}">${escapeHtml(item.category)}</span></div>
          </div>
          <div class="card-article__body">
            <div class="card-article__date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${escapeHtml(item.date)}</span>
            </div>
            <h2 class="card-article__title">${escapeHtml(item.title)}</h2>
            <p class="card-article__excerpt">${escapeHtml(excerpt)}</p>
            <a href="detail-blog.html?id=${escapeHtml(item.id)}" class="card-article__link">Baca Selengkapnya &rarr;</a>
          </div>
        </article>
      `;
    }).join('');

    renderPagination(totalPages);

    if (typeof window.animateVisibleBlogCards === 'function') {
      window.animateVisibleBlogCards();
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      currentQuery = this.value.toLowerCase().trim();
      currentPage = 1;
      renderGrid();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', function () {
      chips.forEach(item => item.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = (chip.getAttribute('data-filter') || 'semua').toLowerCase();
      currentPage = 1;
      renderGrid();
    });
  });

  renderGrid();
});