document.addEventListener('DOMContentLoaded', function () {
  const businessesData = window.businessesData || {};
  const blogsData = window.blogsData || {};

  function setText(root, selector, value) {
    const element = root.querySelector(selector);
    if (element && typeof value === 'string') {
      element.textContent = value;
    }
  }

  function setImage(root, selector, src, alt) {
    const image = root.querySelector(selector);
    if (image && src) {
      image.src = src;
      image.alt = alt || image.alt;
    }
  }

  function updateBusinessCard(cardId, businessId) {
    const card = document.getElementById(cardId);
    const business = businessesData[businessId];
    if (!card || !business) return;

    setImage(card, 'img', business.mainImage, business.title);
    setText(card, '.pill', business.category);

    if (cardId === 'card-pt-bintang') {
      setText(card, 'h3', business.title);
      const paragraphs = card.querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].textContent = business.shortDesc;
      if (paragraphs[1]) paragraphs[1].textContent = `By: ${business.ownerName} (${business.ownerRole})`;
    } else {
      const paragraphs = card.querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].textContent = business.title;
      if (paragraphs[1]) paragraphs[1].textContent = business.shortDesc;
    }

    const link = card.querySelector('a[href*="detail-usaha.html"]');
    if (link) {
      link.href = `detail-usaha.html?id=${businessId}`;
    }
  }

  function updateBlogCard(cardId, blogId) {
    const card = document.getElementById(cardId);
    const blog = blogsData[blogId];
    if (!card || !blog) return;

    setImage(card, 'img', blog.mainImage, blog.title);

    const paragraphs = card.querySelectorAll('p');
    if (paragraphs[0]) paragraphs[0].textContent = blog.category;
    if (cardId === 'article-featured') {
      const title = card.querySelector('h3');
      if (title) title.textContent = blog.title;
      if (paragraphs[1]) paragraphs[1].textContent = blog.paragraphs[0] || '';
    } else {
      const title = card.querySelector('h3');
      if (title) title.textContent = blog.title;
    }

    const link = card.querySelector('a[href*="detail-blog.html"]');
    if (link) {
      link.href = `detail-blog.html?id=${blogId}`;
    }
  }

  updateBusinessCard('card-pt-bintang', 'pt-bintang-tridaya-sukses');
  updateBusinessCard('card-umamiya', 'umamiya');
  updateBusinessCard('card-mi-chi', 'mi-chi');
  updateBusinessCard('card-fresh-beef', 'fresh-meat-supply');

  updateBlogCard('article-featured', 'pitching-day-2024');
  updateBlogCard('article-sm-1', 'memulai-bisnis');
  updateBlogCard('article-sm-2', 'wawancara-alumni');
});