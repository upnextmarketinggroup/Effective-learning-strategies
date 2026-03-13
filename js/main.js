/**
 * Effective Learning Strategies — main.js
 *
 * Features:
 *   1. initStickyHeader   — adds box-shadow when page is scrolled
 *   2. initMobileNav      — hamburger menu toggle with accessibility support
 *   3. initSmoothScroll   — smooth anchor scrolling with header offset
 *   4. initScrollAnimations — IntersectionObserver fade-in for .fade-in elements
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
        if (window.scrollY > 10) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load in case page is pre-scrolled
  onScroll();
}

/* ─────────────────────────────────────────────────────────
   2. MOBILE NAV — hamburger toggle
───────────────────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navList = document.getElementById('nav-list');

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

  function toggleNav() {
    const isOpen = nav.classList.contains('nav--open');
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  }

  // Hamburger click
  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleNav();
  });

  // Close when a nav link is clicked (especially anchor links)
  if (navList) {
    navList.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (link) {
        closeNav();
      }
    });
  }

  // Close on click outside nav
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('nav--open')) {
      const clickedInsideNav = nav.contains(e.target);
      const clickedHamburger = hamburger.contains(e.target);
      if (!clickedInsideNav && !clickedHamburger) {
        closeNav();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      closeNav();
      hamburger.focus();
    }
  });

  // Close if window resizes past mobile breakpoint
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) {
      closeNav();
    }
  });
}

/* ─────────────────────────────────────────────────────────
   3. SMOOTH SCROLL — offset for sticky header height
───────────────────────────────────────────────────────── */
function initSmoothScroll() {
  // Get header height from CSS variable, fallback to 72px
  const headerEl = document.getElementById('header');
  const OFFSET = headerEl ? headerEl.offsetHeight : 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');

      // Ignore empty or bare "#" hrefs
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - OFFSET - 12;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });

      // Update URL without triggering a jump
      if (history.pushState) {
        history.pushState(null, null, href);
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────
   4. SCROLL ANIMATIONS — fade-in on enter viewport
───────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  // If IntersectionObserver is not supported, show all elements immediately
  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animate once only
        }
      });
    },
    {
      threshold: 0.12,       // Trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px'  // Slight bottom offset for cleaner feel
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

/* ─────────────────────────────────────────────────────────
   BOOT — run all init functions after DOM is ready
───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
});
