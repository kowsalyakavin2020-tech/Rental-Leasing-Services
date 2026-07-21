/* ==========================================================================
   LISTINGS.JS — Filter (on Apply click), sort, chips, view toggle, FAQ, load more
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const grid = document.getElementById('listingsGrid');

  // === FAQ Accordion ===
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      const isOpen = answer.classList.contains('open');

      faqItems.forEach(function (otherItem) {
        otherItem.querySelector('.faq-answer').classList.remove('open');
        otherItem.querySelector('.faq-question').classList.remove('active');
      });

      if (!isOpen) {
        answer.classList.add('open');
        question.classList.add('active');
      }
    });
  });

  if (!grid) return; // rest only runs on listings.html

  const cards = Array.from(grid.querySelectorAll('.listing-card'));
  const filterForm = document.getElementById('filterForm');
  const filterSearch = document.getElementById('filterSearch');
  const filterCategory = document.getElementById('filterCategory');
  const filterLocation = document.getElementById('filterLocation');
  const filterPrice = document.getElementById('filterPrice');
  const sortSelect = document.getElementById('sortSelect');
  const visibleCountEl = document.getElementById('visibleCount');
  const noResultsMessage = document.getElementById('noResultsMessage');
  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const chips = document.querySelectorAll('.chip[data-quick-cat]');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  // === Inject "View Details" hover button into every listing image ===
  cards.forEach(function (card) {
    const imgWrap = card.querySelector('.listing-img');
    if (imgWrap && !imgWrap.querySelector('.listing-view-btn')) {
      const viewBtn = document.createElement('a');
      viewBtn.href = '404.html';
      viewBtn.className = 'listing-view-btn';
      viewBtn.innerHTML = '<i class="fa-solid fa-eye"></i> View Details';
      imgWrap.appendChild(viewBtn);
    }
  });

  // === Pre-fill from URL (?cat=vehicle, ?q=...) ===
  const urlParams = new URLSearchParams(window.location.search);
  const catFromUrl = urlParams.get('cat');
  if (catFromUrl && filterCategory) {
    filterCategory.value = catFromUrl;
    setActiveChip(catFromUrl);
  }
  const searchFromUrl = urlParams.get('q');
  if (searchFromUrl && filterSearch) {
    filterSearch.value = searchFromUrl;
  }

  function setActiveChip(category) {
    chips.forEach(function (chip) {
      chip.classList.toggle('active', chip.getAttribute('data-quick-cat') === category);
    });
  }

  function applyFilters() {
    const searchTerm = filterSearch.value.trim().toLowerCase();
    const category = filterCategory.value;
    const location = filterLocation.value;
    const priceRange = filterPrice.value;

    let visibleCount = 0;

    cards.forEach(function (card) {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const cardCategory = card.getAttribute('data-category');
      const cardLocation = card.getAttribute('data-location');
      const cardPrice = parseFloat(card.getAttribute('data-price'));

      let matches = true;

      if (searchTerm && !title.includes(searchTerm)) matches = false;
      if (category && cardCategory !== category) matches = false;
      if (location && cardLocation !== location) matches = false;

      if (priceRange) {
        if (priceRange === '150+') {
          if (cardPrice < 150) matches = false;
        } else {
          const [min, max] = priceRange.split('-').map(Number);
          if (cardPrice < min || cardPrice > max) matches = false;
        }
      }

      card.classList.toggle('hidden-by-filter', !matches);
      if (matches) visibleCount++;
    });

    if (visibleCountEl) visibleCountEl.textContent = visibleCount;
    if (noResultsMessage) {
      noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  function applySort() {
    const sortBy = sortSelect.value;
    const sortedCards = [...cards];

    if (sortBy === 'price-low') {
      sortedCards.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    } else if (sortBy === 'price-high') {
      sortedCards.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    }

    sortedCards.forEach(function (card) {
      grid.appendChild(card);
    });
  }

  // === Quick filter chips (instant — separate from the manual Apply flow) ===
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const category = chip.getAttribute('data-quick-cat');
      setActiveChip(category);
      filterCategory.value = category;
      applyFilters();
    });
  });

  // === Filters only apply when "Apply" is clicked (form submit) ===
  if (filterForm) {
    filterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      setActiveChip(filterCategory.value);
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applySort);
  }

  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener('click', function () {
      grid.classList.remove('list-view');
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    });
    listViewBtn.addEventListener('click', function () {
      grid.classList.add('list-view');
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    });
  }

  // === Load More button ===
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      loadMoreBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> All Listings Loaded';
      loadMoreBtn.disabled = true;
    });
  }

  // Run once on load (in case URL params pre-filled a filter)
  applyFilters();

});