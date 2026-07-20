/* ==========================================================================
   LISTING-DETAILS.JS — gallery thumbnail swap, save/favorite toggle,
   live price calculation based on selected dates
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // === GALLERY THUMBNAIL SWAP ===
  const mainImg = document.getElementById('galleryMainImg');
  const thumbs = document.querySelectorAll('.ld-thumb');

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      const fullSrc = thumb.getAttribute('data-full');
      mainImg.style.opacity = '0';
      setTimeout(function () {
        mainImg.src = fullSrc;
        mainImg.style.opacity = '1';
      }, 150);

      thumbs.forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    });
  });

  // === FAVORITE / SAVE TOGGLE ===
  const favBtn = document.getElementById('ldFavBtn');
  if (favBtn) {
    favBtn.addEventListener('click', function () {
      favBtn.classList.toggle('active');
      const icon = favBtn.querySelector('i');
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
    });
  }

  // === LIVE PRICE CALCULATION ===
  const startDateInput = document.getElementById('ldStartDate');
  const endDateInput = document.getElementById('ldEndDate');
  const totalPriceEl = document.getElementById('ldTotalPrice');
  const dailyRate = 42;
  const serviceFee = 8;

  function updatePrice() {
    if (!startDateInput.value || !endDateInput.value) return;

    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);
    const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));

    if (end <= start) {
      totalPriceEl.textContent = '—';
      return;
    }

    const subtotal = diffDays * dailyRate;
    const total = subtotal + serviceFee;
    totalPriceEl.textContent = '$' + total;

    const priceLines = document.querySelectorAll('.ld-price-line span:first-child');
    if (priceLines[0]) priceLines[0].textContent = '$' + dailyRate + ' x ' + diffDays + ' day' + (diffDays > 1 ? 's' : '');
  }

  if (startDateInput && endDateInput) {
    startDateInput.addEventListener('change', updatePrice);
    endDateInput.addEventListener('change', updatePrice);
  }

  // === BOOKING FORM SUBMIT ===
  const bookingForm = document.getElementById('ldBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!startDateInput.value || !endDateInput.value) {
        alert('Please select both start and end dates.');
        return;
      }
      window.location.href = 'login.html';
    });
  }

  // === SIMILAR LISTINGS: favorite toggle (shared pattern) ===
  document.querySelectorAll('.listing-fav').forEach(function (icon) {
    icon.addEventListener('click', function (e) {
      e.preventDefault();
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
    });
  });

});