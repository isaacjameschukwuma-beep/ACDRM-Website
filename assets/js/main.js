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

  /* ── SILENT AUTOPLAY VIDEO ───────────────────────────────── */
  // Phones can refuse autoplay (e.g. iPhone Low Power Mode). Keep trying when
  // the video is on screen and on the visitor's first touch or scroll.
  document.querySelectorAll('.autoplay-video').forEach(video => {
    video.muted = true;
    const tryPlay = () => { if (video.paused) video.play().catch(() => {}); };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting ? tryPlay() : video.pause());
      }, { threshold: 0.25 }).observe(video);
    } else {
      tryPlay();
    }

    ['touchstart', 'scroll', 'click'].forEach(evt =>
      window.addEventListener(evt, tryPlay, { once: true, passive: true }));
  });

  /* ── NOTICES BELL (homepage) ─────────────────────────────── */
  // Floating bell listing General documents that carry a `notice`
  // (assets/js/general-docs.js). The badge shows how many there are; the
  // panel opens on page load until the visitor closes it.
  const bell = document.getElementById('notice-bell');
  const notices = (window.ACDRM_GENERAL_DOCS || []).filter(doc => doc.notice);

  if (bell && notices.length) {
    const count = notices.length;
    bell.innerHTML = `
      <div class="notice-panel" id="notice-panel" role="dialog" aria-label="Notices">
        <div class="notice-head">
          <span>${count === 1 ? 'New notice' : `${count} new notices`}</span>
          <button type="button" class="notice-close" aria-label="Close notices"><i class="bi bi-x-lg"></i></button>
        </div>
        ${notices.map(doc => `
          <a class="notice-item" href="pages/document.html?id=${doc.id}">
            <img class="notice-thumb" src="${doc.cover}" alt="" loading="lazy">
            <span class="notice-text">
              <strong>${doc.notice.headline}</strong>
              <span>${doc.notice.text}</span>
              <em>Read more <i class="bi bi-arrow-right"></i></em>
            </span>
          </a>
        `).join('')}
      </div>
      <button type="button" class="notice-btn" aria-controls="notice-panel" aria-expanded="false"
              aria-label="${count === 1 ? '1 new notice' : `${count} new notices`}">
        <i class="bi bi-bell-fill"></i>
        <span class="notice-count">${count > 9 ? '9+' : count}</span>
      </button>`;
    bell.hidden = false;

    const btn = bell.querySelector('.notice-btn');
    const setOpen = open => {
      bell.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    const remember = () => { try { sessionStorage.setItem('acdrm-notices-seen', '1'); } catch (e) { /* storage blocked */ } };

    btn.addEventListener('click', () => {
      const open = !bell.classList.contains('open');
      setOpen(open);
      if (!open) remember();
    });
    bell.querySelector('.notice-close').addEventListener('click', () => { setOpen(false); remember(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { setOpen(false); remember(); } });

    // Open as soon as the page loads, on every homepage visit, until the
    // visitor closes it (then it stays closed for the rest of their visit)
    let seen = false;
    try { seen = sessionStorage.getItem('acdrm-notices-seen') === '1'; } catch (e) { /* storage blocked */ }
    if (!seen) requestAnimationFrame(() => setOpen(true));
  }

  /* ── CMS COVER IMAGES ────────────────────────────────────── */
  // Cover URL for a CMS item. Cloudinary images are requested resized and
  // compressed (f_auto,q_auto,w_N) so large uploads stay fast on phones.
  // Falls back to a site image when the item has no cover.
  window.acdrmCover = function (url, width, fallback) {
    if (!url) return fallback;
    const marker = '/image/upload/';
    if (url.includes('res.cloudinary.com') && url.includes(marker)) {
      return url.replace(marker, `${marker}f_auto,q_auto,c_limit,w_${width}/`);
    }
    return url;
  };

  /* ── BACKEND FETCH WITH RETRY ────────────────────────────── */
  // The backend sleeps when idle and can take up to a minute to wake.
  // Retry network failures and "busy / waking" responses for about a minute
  // before giving up. Other responses (including 404) are returned as-is.
  const RETRY_DELAYS_MS = [3000, 5000, 8000, 10000, 10000, 12000, 12000];
  const RETRYABLE_STATUS = [429, 502, 503, 504];

  window.acdrmFetch = async function (url, options) {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!RETRYABLE_STATUS.includes(response.status) || attempt >= RETRY_DELAYS_MS.length) {
          return response;
        }
      } catch (error) {
        if (attempt >= RETRY_DELAYS_MS.length) throw error;
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }
  };

  window.ACDRM_LOADING_TEXT = 'Our research library is loading. This can take up to a minute, please wait…';
  window.ACDRM_UNAVAILABLE_TEXT = 'Our research library is temporarily unavailable. Please check back shortly.';

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

    const MAX_CARDS = 3;
    const detailPages = { ARTICLE: 'article.html', BLOG: 'blog.html' };

    // Homepage shows a short teaser; the full text lives on the item's page
    const teaser = (text, max = 150) => {
      if (!text || text.length <= max) return text || '';
      return text.slice(0, text.lastIndexOf(' ', max)).replace(/[,.;:]$/, '') + '…';
    };

    // General documents (assets/js/general-docs.js) come first and need no backend
    const generalCards = (window.ACDRM_GENERAL_DOCS || []).map(doc => ({
      title: doc.title,
      label: 'General',
      summary: doc.summary,
      cover: doc.cover,
      banner: true,
      date: doc.date,
      url: `pages/document.html?id=${doc.id}`,
    }));

    const backendCard = item => ({
      title: item.title,
      label: typeLabels[item.type] || item.type,
      summary: item.description,
      cover: window.acdrmCover(item.coverImage, 640, 'assets/img/hero/hero-1.jpg'),
      banner: false,
      date: item.publishedAt || item.createdAt,
      url: `pages/${detailPages[item.type] || 'publication.html'}?id=${item._id}`,
    });

    const renderCards = (cards, statusHtml = '') => {
      insightsGrid.innerHTML = cards.slice(0, MAX_CARDS).map((card, i) => `
          <div class="insight-card" data-aos="fade-up" data-aos-delay="${(i + 1) * 100}">
            <div class="insight-photo${card.banner ? ' is-banner' : ''}">
              <img src="${card.cover}" alt="${card.title}" loading="lazy">
            </div>
            <div class="insight-body">
              <span class="insight-tag">${card.label}</span>
              <h3>${card.title}</h3>
              <p>${teaser(card.summary)}</p>
              <div class="insight-meta">
                <span class="insight-date">
                  ${new Date(card.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}
                </span>
                <a href="${card.url}" class="insight-link">Read more <i class="bi bi-arrow-right"></i></a>
              </div>
            </div>
          </div>
        `).join('') + statusHtml;

      // Refresh AOS so animations fire on the new cards
      if (typeof AOS !== 'undefined') AOS.refresh();
    };

    const loadInsights = () => {
      if (generalCards.length) {
        renderCards(generalCards);
      } else {
        insightsGrid.innerHTML = `<p class="cms-status">${window.ACDRM_LOADING_TEXT}</p>`;
      }

      window.acdrmFetch(`${API_BASE}/content/latest`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(({ data }) => {
          const cards = generalCards.concat((data || []).map(backendCard));
          if (cards.length === 0) {
            insightsGrid.innerHTML = '<p>No insights available yet.</p>';
            return;
          }
          renderCards(cards);
        })
        .catch(err => {
          console.error('Failed to load insights:', err);
          // General documents stay visible; only show the notice when there is nothing else
          if (generalCards.length) return;
          insightsGrid.innerHTML = `
            <div class="cms-status">
              <p>${window.ACDRM_UNAVAILABLE_TEXT}</p>
              <button type="button" class="cms-retry">Try again</button>
            </div>`;
          insightsGrid.querySelector('.cms-retry').addEventListener('click', loadInsights);
        });
    };

    loadInsights();
  }

})();