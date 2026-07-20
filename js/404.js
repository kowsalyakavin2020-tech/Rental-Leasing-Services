/* ==========================================================================
   404.JS — Search redirect + Go Back on the "Page Not Found" screen
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Search redirect ---- */
  const searchForm = document.getElementById('error404SearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = document.getElementById('error404SearchInput').value.trim();
      const url = query ? 'listings.html?q=' + encodeURIComponent(query) : 'listings.html';
      window.location.href = url;
    });
  }

  /* ---- Go Back button ---- */
  const goBackBtn = document.getElementById('error404GoBack');
  if (goBackBtn) {
    goBackBtn.addEventListener('click', function () {
      // If there's history to go back to, use it. Otherwise fall back to home.
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }

});