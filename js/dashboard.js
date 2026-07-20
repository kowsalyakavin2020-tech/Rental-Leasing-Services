/* ==========================================================================
   DASHBOARD.JS — Dynamic email display, sidebar toggle, section nav,
   shared between user-dashboard.html and admin-dashboard.html
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // === DYNAMIC EMAIL / NAME DISPLAY ===
  // Reads the email the user typed on login/signup (stored in sessionStorage)
  // and renders it dynamically wherever the dashboard shows account info.
  const storedEmail = sessionStorage.getItem('rentlease_email') || 'guest@rentlease.com';
  const storedName = sessionStorage.getItem('rentlease_name') || storedEmail.split('@')[0];

  const userNameDisplay = document.getElementById('userNameDisplay');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const settingsNameDisplay = document.getElementById('settingsNameDisplay');
  const settingsEmailDisplay = document.getElementById('settingsEmailDisplay');
  const adminNameDisplay = document.getElementById('adminNameDisplay');
  const adminEmailDisplay = document.getElementById('adminEmailDisplay');

  function formatDisplayName(raw) {
    return raw
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  if (userNameDisplay) userNameDisplay.textContent = formatDisplayName(storedName);
  if (userEmailDisplay) userEmailDisplay.textContent = storedEmail;
  if (settingsNameDisplay) settingsNameDisplay.textContent = formatDisplayName(storedName);
  if (settingsEmailDisplay) settingsEmailDisplay.textContent = storedEmail;
  if (adminNameDisplay) adminNameDisplay.textContent = formatDisplayName(storedName);
  if (adminEmailDisplay) adminEmailDisplay.textContent = storedEmail;

  // === SIDEBAR TOGGLE (mobile) ===
  const sidebar = document.getElementById('dashboardSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          sidebar.classList.remove('active');
        }
      }
    });
  }

  // === SIDEBAR NAV ACTIVE STATE (highlights link matching scroll position) ===
  const navLinks = document.querySelectorAll('.dash-nav-link');
  const sections = document.querySelectorAll('.dash-section');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
      if (window.innerWidth <= 992 && sidebar) {
        sidebar.classList.remove('active');
      }
    });
  });

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // === SAVED ITEMS: heart toggle ===
  document.querySelectorAll('.listing-fav').forEach(function (icon) {
    icon.addEventListener('click', function (e) {
      e.preventDefault();
      icon.classList.toggle('active');
      icon.closest('.listing-card').style.opacity = icon.classList.contains('active') ? '1' : '0.5';
    });
  });

  // === ADMIN: Approve / Reject buttons (demo interactivity) ===
  document.querySelectorAll('.approve-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const row = btn.closest('.approval-row');
      row.style.opacity = '0.4';
      row.style.pointerEvents = 'none';
      btn.textContent = 'Approved';
    });
  });

  document.querySelectorAll('.reject-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const row = btn.closest('.approval-row');
      row.style.opacity = '0.4';
      row.style.pointerEvents = 'none';
      btn.textContent = 'Rejected';
    });
  });

});