/* ==========================================================================
   MAIN.JS — Shared across all pages
   Handles: AOS init, sticky header, mobile menu, counters, form basics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // === Initialize AOS (scroll animations) ===
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  // === Sticky header on scroll ===
  const header = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll);

  // === Mobile menu toggle ===
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function openMobileNav() {
    if (mainNav) mainNav.classList.add('active');
    if (header) header.classList.add('nav-open');
    // Prevent the page behind the mobile menu from scrolling
    document.body.classList.add('nav-open-lock');
  }

  function closeMobileNav() {
    if (mainNav) mainNav.classList.remove('active');
    if (header) header.classList.remove('nav-open');
    document.body.classList.remove('nav-open-lock');
  }

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', openMobileNav);

    // Close mobile menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // Close (X) button inside the slide-out menu — wired independently
  // so it works even if the toggle button setup above fails for any reason.
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', function (e) {
      e.preventDefault();
      closeMobileNav();
    });
  }

  // === Animated stat counters (hero + stats banner) ===
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  // === Hero search form ===
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = document.getElementById('heroSearchInput').value.trim();
      const category = document.getElementById('heroSearchCategory').value;
      let url = 'listings.html?';
      if (query) url += 'q=' + encodeURIComponent(query) + '&';
      if (category) url += 'cat=' + encodeURIComponent(category);
      window.location.href = url;
    });
  }

  // === Newsletter form ===
  // On valid email, redirect to 404.html (per current site flow).
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        emailInput.style.borderColor = '#d94f4f';
        return;
      }

      window.location.href = '404.html';
    });
  }

  // === Favorite (heart) toggle on listing cards ===
  document.querySelectorAll('.listing-fav').forEach(function (icon) {
    icon.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
    });
  });

});