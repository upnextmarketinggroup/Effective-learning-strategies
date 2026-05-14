/**
 * Effective Learning Strategies — main.js
 *
 * Features:
 *   1. initStickyHeader      — adds box-shadow when page is scrolled
 *   2. initMobileNav         — hamburger menu toggle with accessibility support
 *   3. initSmoothScroll      — smooth anchor scrolling with header offset
 *   4. initScrollAnimations  — IntersectionObserver fade-in for .fade-in elements
 *   5. initScrollProgress    — animated scroll progress bar at top of page
 *   6. initParticles         — floating educational symbol particles in hero
 *   7. initCounters          — count-up animation for .counter elements
 *   8. initCardTilt          — 3D perspective tilt on .tilt-card elements
 *   9. initTimelineLine      — animates the How It Works connecting line
 */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. STICKY HEADER — adds shadow class on scroll
───────────────────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        header.classList.toggle('header--scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─────────────────────────────────────────────────────────
   2. MOBILE NAV — hamburger toggle
───────────────────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  const navList   = document.getElementById('nav-list');

  if (!hamburger || !nav) return;

  function openNav() {
    nav.classList.add('nav--open');
    hamburger.classList.add('hamburger--active');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    nav.classList.remove('nav--open');
    hamburger.classList.remove('hamburger--active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    nav.classList.contains('nav--open') ? closeNav() : openNav();
  });

  if (navList) {
    navList.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
  }

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('nav--open') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      closeNav();
      hamburger.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) closeNav();
  });
}

/* ─────────────────────────────────────────────────────────
   3. SMOOTH SCROLL — offset for sticky header height
───────────────────────────────────────────────────────── */
function initSmoothScroll() {
  const headerEl = document.getElementById('header');
  const OFFSET   = headerEl ? headerEl.offsetHeight : 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET - 12;

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

      if (history.pushState) history.pushState(null, null, href);
    });
  });
}

/* ─────────────────────────────────────────────────────────
   4. SCROLL ANIMATIONS — fade-in (and directional) on enter
───────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .logo-anim');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
}

/* ─────────────────────────────────────────────────────────
   5. SCROLL PROGRESS BAR
───────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let ticking = false;

  function update() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width  = progress + '%';
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─────────────────────────────────────────────────────────
   6. EDUCATIONAL PARTICLES — floating symbols in hero
───────────────────────────────────────────────────────── */
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const symbols = ['📚', '✏️', '⭐', '💡', '🎓', '🔬', '📐', '📝', '🏆', '🌱', '🔭', '🧮'];
  const count   = window.innerWidth < 768 ? 8 : 14;

  for (var i = 0; i < count; i++) {
    var p = document.createElement('span');
    p.className   = 'edu-particle';
    p.textContent = symbols[i % symbols.length];
    p.setAttribute('aria-hidden', 'true');

    var leftPct  = (Math.random() * 92 + 2).toFixed(1) + '%';
    var topPct   = (Math.random() * 75 + 10).toFixed(1) + '%';
    var dur      = (Math.random() * 7 + 7).toFixed(1) + 's';
    var delay    = (Math.random() * -12).toFixed(1) + 's';
    var size     = (Math.random() * 0.7 + 1.0).toFixed(2) + 'rem';

    p.style.left     = leftPct;
    p.style.top      = topPct;
    p.style.fontSize = size;
    p.style.setProperty('--dur',   dur);
    p.style.setProperty('--delay', delay);

    container.appendChild(p);
  }
}

/* ─────────────────────────────────────────────────────────
   7. COUNTER ANIMATION — count up to data-target value
───────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (el) { el.textContent = el.dataset.target; });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el       = entry.target;
      var target   = parseInt(el.dataset.target, 10);
      var duration = 1800;
      var start    = performance.now();

      function tick(now) {
        var elapsed  = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) {
    el.textContent = '0';
    observer.observe(el);
  });
}

/* ─────────────────────────────────────────────────────────
   8. CARD TILT — 3D perspective tilt on hover
───────────────────────────────────────────────────────── */
function initCardTilt() {
  var cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect    = card.getBoundingClientRect();
      var x       = e.clientX - rect.left;
      var y       = e.clientY - rect.top;
      var cx      = rect.width  / 2;
      var cy      = rect.height / 2;
      var rotateX = ((y - cy) / cy) * -5;
      var rotateY = ((x - cx) / cx) *  5;

      card.style.transform =
        'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
}

/* ─────────────────────────────────────────────────────────
   9. TIMELINE LINE — animate How It Works connector
───────────────────────────────────────────────────────── */
function initTimelineLine() {
  var stepsEl = document.querySelector('.how-steps');
  if (!stepsEl) return;
  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        stepsEl.classList.add('timeline-visible');
        observer.unobserve(stepsEl);
      }
    });
  }, { threshold: 0.35 });

  observer.observe(stepsEl);
}

/* ─────────────────────────────────────────────────────────
   SCHEDULE GRADE FILTER — Classes page
───────────────────────────────────────────────────────── */
function initScheduleFilter() {
  var buttons = document.querySelectorAll('.schedule-filter-btn');
  var table = document.querySelector('.schedule-table');
  if (!buttons.length || !table) return;

  var cells = table.querySelectorAll('tbody td[data-grade]');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-grade-filter');

      buttons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      if (target === 'all') {
        table.classList.remove('is-filtering');
        cells.forEach(function (c) { c.classList.remove('is-highlight'); });
        return;
      }

      table.classList.add('is-filtering');
      cells.forEach(function (c) {
        c.classList.toggle('is-highlight', c.getAttribute('data-grade') === target);
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────
   PROGRAMS CAROUSEL — auto-demo scroll on first reveal
───────────────────────────────────────────────────────── */
function initProgramsCarousel() {
  var carousels = document.querySelectorAll('.programs-grid');
  if (!carousels.length || !('IntersectionObserver' in window)) return;

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  carousels.forEach(function (carousel) {
    var done = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || done) return;
        done = true;
        observer.unobserve(carousel);
        if (prefersReduced) return;

        var firstCard = carousel.querySelector('.program-card');
        if (!firstCard) return;
        var peek = Math.round(firstCard.offsetWidth * 0.55);

        setTimeout(function () {
          carousel.scrollTo({ left: peek, behavior: 'smooth' });
          setTimeout(function () {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
          }, 950);
        }, 450);
      });
    }, { threshold: 0.35 });

    observer.observe(carousel);
  });
}

/* ─────────────────────────────────────────────────────────
   BOOT — run all after DOM is ready
───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initScrollProgress();
  initParticles();
  initCounters();
  initCardTilt();
  initTimelineLine();
  initScheduleFilter();
  initProgramsCarousel();
});
