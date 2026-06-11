(function () {
  'use strict';

  /* ── HEADER SCROLL BEHAVIOUR ─────────────────────────────── */
  const header = document.querySelector('.header');

  function toggleScrolled() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /* ── MOBILE NAV TOGGLE ───────────────────────────────────── */
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

  function toggleMobileNav() {
    document.body.classList.toggle('mobile-nav-active');
    if (mobileNavToggle) {
      mobileNavToggle.classList.toggle('bi-list');
      mobileNavToggle.classList.toggle('bi-x');
    }
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', toggleMobileNav);
  }

  // Close mobile nav on link click
  document.querySelectorAll('.navmenu a').forEach(link => {
    link.addEventListener('click', () => {
      if (document.body.classList.contains('mobile-nav-active')) {
        toggleMobileNav();
      }
    });
  });

  /* ── PRELOADER ───────────────────────────────────────────── */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 600);
      }, 300);
    });
  }

  /* ── SCROLL TO TOP ───────────────────────────────────────── */
  const scrollTopBtn = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 200) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('scroll', toggleScrollTop);
  window.addEventListener('load', toggleScrollTop);

  /* ── HERO IMAGE CAROUSEL ─────────────────────────────────── */
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;
  let carouselInterval;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  if (slides.length > 0) {
    showSlide(0);
    carouselInterval = setInterval(nextSlide, 4000);
  }

  /* ── STATS TICKER DUPLICATION ────────────────────────────── */
  // Duplicates ticker content for seamless infinite loop
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    const original = tickerTrack.innerHTML;
    tickerTrack.innerHTML = original + original;
  }

  /* ── AOS INIT ────────────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 650,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 80
    });
  }

  /* ── ACTIVE NAV LINK ON SCROLL ───────────────────────────── */
  const navLinks = document.querySelectorAll('.navmenu ul li a');

  function setActiveNav() {
    const scrollPos = window.scrollY + 100;
    navLinks.forEach(link => {
      if (!link.hash) return;
      const target = document.querySelector(link.hash);
      if (!target) return;
      if (scrollPos >= target.offsetTop && scrollPos < target.offsetTop + target.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  document.addEventListener('scroll', setActiveNav);

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(target).scrollMarginTop) || 72;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── FAQ ACCORDION ───────────────────────────────────────── */
  document.querySelectorAll('.faq-item .faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('faq-active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('faq-active'));
      if (!isActive) item.classList.add('faq-active');
    });
  });

  /* ── COUNTER ANIMATION (for floating hero card) ──────────── */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + '+';
      }
    }, 16);
  }

  // Trigger counters when hero stats card is in view
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.counter);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  /* ── LATEST INSIGHTS FROM API ────────────────────────────── */
  const insightsGrid = document.getElementById('insights-grid');

  if (insightsGrid) {
    const API_BASE = 'https://acdrm-backend.onrender.com/api/v1'; 

    const typeLabels = {
      BLOG: 'Blog',
      ARTICLE: 'Article',
      PUBLICATION: 'Publication',
      PDF: 'PDF',
    };

    fetch(`${API_BASE}/content/latest`)
      .then(res => res.json())
      .then(({ data }) => {
        if (!data || data.length === 0) {
          insightsGrid.innerHTML = '<p>No insights available yet.</p>';
          return;
        }

        insightsGrid.innerHTML = data.map((item, i) => `
          <div class="insight-card" data-aos="fade-up" data-aos-delay="${(i + 1) * 100}">
            <div class="insight-body">
              <span class="insight-tag">${typeLabels[item.type] || item.type}</span>
              <h3>${item.title}</h3>
              <p>${item.description}</p>
              <div class="insight-meta">
                <span class="insight-date">
                  ${new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}
                </span>
                <a href="#" class="insight-link">Read <i class="bi bi-arrow-right"></i></a>
              </div>
            </div>
          </div>
        `).join('');

        // Refresh AOS so animations fire on the new cards
        if (typeof AOS !== 'undefined') AOS.refresh();
      })
      .catch(err => {
        console.error('Failed to load insights:', err);
        insightsGrid.innerHTML = '<p>Could not load insights at this time.</p>';
      });
  }

})();