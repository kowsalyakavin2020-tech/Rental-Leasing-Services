/* ==========================================================================
   GSAP-ANIMATIONS.JS — Hero entrance timeline + scroll-triggered effects
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // === HERO ENTRANCE TIMELINE (runs once on page load) ===
  const heroTag = document.querySelector('.hero-tag');
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroSearch = document.querySelector('.hero-search');
  const heroStats = document.querySelector('.hero-stats');

  if (heroTag && heroTitle) {
    // ------------------------------------------------------------------
    // Word-by-word split, WITHOUT destroying existing markup (e.g. the
    // <span class="text-amber"> highlight inside the title).
    //
    // The previous version used heroTitle.textContent — that strips all
    // HTML tags, silently deleting the amber highlight span, and it also
    // added an inline margin-right on top of the normal space between
    // words. That extra spacing made the title noticeably wider than
    // its CSS-intended width, forcing extra line-wraps on mobile that
    // overlapped the tight line-height — which is what caused the
    // hero text to visually overlap on the landing page only (this is
    // the only page using this script's hero-title logic).
    //
    // Fix: walk the title's existing child nodes (text nodes AND the
    // amber span) and wrap only the *words inside each text node* in a
    // span, leaving the amber span itself completely untouched. No
    // extra margin is added — normal spaces are preserved as-is so the
    // title wraps exactly like it does with animations turned off.
    // ------------------------------------------------------------------
    const originalNodes = Array.from(heroTitle.childNodes);
    heroTitle.innerHTML = '';

    originalNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/); // keep whitespace tokens
        parts.forEach(function (part) {
          if (part === '') return;
          if (/^\s+$/.test(part)) {
            heroTitle.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement('span');
            span.className = 'gsap-word';
            span.textContent = part;
            heroTitle.appendChild(span);
          }
        });
      } else {
        // Element node (e.g. the amber <span>) — keep it exactly as-is,
        // just tag it so it participates in the same stagger reveal.
        node.classList.add('gsap-word');
        heroTitle.appendChild(node);
      }
    });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(heroTag, { opacity: 1, duration: 0.5, delay: 0.2 })
      .to(heroTitle.querySelectorAll('.gsap-word'), {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
      }, '-=0.2')
      .to(heroSubtitle, { opacity: 1, duration: 0.6 }, '-=0.3')
      .to(heroSearch, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .to(heroStats, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');

    gsap.set(heroTitle.querySelectorAll('.gsap-word'), { opacity: 0, y: 20, display: 'inline-block' });
    gsap.set([heroSubtitle, heroSearch, heroStats], { y: 20 });
  }

  // === SCROLL-TRIGGERED SECTION HEADER RISE (extra polish on top of AOS) ===
  gsap.utils.toArray('.section-header').forEach(function (header) {
    gsap.fromTo(
      header,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // === CATEGORY CARDS STAGGERED REVEAL ===
  const categoryCards = gsap.utils.toArray('.category-card');
  if (categoryCards.length) {
    gsap.fromTo(
      categoryCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.categories-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // === STATS BANNER NUMBER POP ===
  const statItems = gsap.utils.toArray('.stat-item');
  if (statItems.length) {
    gsap.fromTo(
      statItems,
      { opacity: 0, scale: 0.7 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.stats-banner',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // === HEADER SHRINK PARALLAX ON HERO SCROLL ===
  if (document.querySelector('.hero')) {
    gsap.to('.hero-bg-img', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

});