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
    // Split hero title into word spans for staggered reveal
    const words = heroTitle.textContent.trim().split(' ');
    heroTitle.innerHTML = words
      .map(function (word) {
        return '<span class="gsap-word" style="margin-right:0.3em;">' + word + '</span>';
      })
      .join(' ');

    // preserve the amber highlight span if present
    const amberSpan = heroTitle.querySelector('.text-amber');

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