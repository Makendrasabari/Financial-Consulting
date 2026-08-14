/* STACKLY - Financial Page-Transition Preloader Logic */

(function () {
  'use strict';

  let preloader, currencyWrapper, logo, particlesContainer;
  let isNavigating = false;
  let navigationTimeout = null;

  // 1. Ensure Preloader Overlay DOM exists
  function initPreloaderDOM() {
    preloader = document.getElementById('stackly-preloader');
    if (!preloader) {
      preloader = document.createElement('div');
      preloader.id = 'stackly-preloader';
      preloader.className = 'stackly-preloader';
      preloader.innerHTML = `
        <div class="preloader-backdrop"></div>
        <div class="preloader-content">
          <div class="preloader-currency-wrapper">
            <svg class="currency-note-svg" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="240" height="120" rx="12" fill="url(#note-grad)" stroke="#DFB15B" stroke-width="2"/>
              <rect x="10" y="10" width="220" height="100" rx="8" stroke="rgba(223, 177, 91, 0.4)" stroke-width="1" stroke-dasharray="4 3"/>
              <circle cx="120" cy="60" r="28" fill="rgba(223, 177, 91, 0.15)" stroke="#DFB15B" stroke-width="1.5"/>
              <text x="120" y="67" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="800" fill="#DFB15B" text-anchor="middle">$</text>
              <text x="25" y="32" font-family="sans-serif" font-size="16" font-weight="700" fill="rgba(223, 177, 91, 0.6)">100</text>
              <text x="215" y="102" font-family="sans-serif" font-size="16" font-weight="700" fill="rgba(223, 177, 91, 0.6)" text-anchor="end">100</text>
              <path d="M40 60 C 60 40, 80 80, 100 60" stroke="rgba(223, 177, 91, 0.3)" stroke-width="2" fill="none"/>
              <path d="M140 60 C 160 40, 180 80, 200 60" stroke="rgba(223, 177, 91, 0.3)" stroke-width="2" fill="none"/>
              <defs>
                <linearGradient id="note-grad" x1="0" y1="0" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0A2540"/>
                  <stop offset="0.5" stop-color="#123B66"/>
                  <stop offset="1" stop-color="#051626"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="preloader-logo-container">
            <img src="assets/Logo23.webp" alt="Stackly Logo" class="preloader-logo">
          </div>
          <div class="preloader-particles-container" id="preloader-particles"></div>
        </div>
      `;
      document.body.appendChild(preloader);
    }

    currencyWrapper = preloader.querySelector('.preloader-currency-wrapper');
    logo = preloader.querySelector('.preloader-logo');
    particlesContainer = preloader.querySelector('#preloader-particles');
  }

  // 2. Hide and Reset Preloader (Crucial for Back/Forward Navigation & BFCache)
  function hideAndResetPreloader() {
    isNavigating = false;
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
      navigationTimeout = null;
    }

    if (!preloader) {
      preloader = document.getElementById('stackly-preloader');
    }

    if (preloader) {
      preloader.classList.remove('active');

      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf([preloader, currencyWrapper, logo]);
        if (particlesContainer) {
          gsap.killTweensOf(particlesContainer.querySelectorAll('.currency-particle'));
        }
        gsap.to(preloader, {
          duration: 0.25,
          opacity: 0,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(preloader, { visibility: 'hidden', pointerEvents: 'none' });
          }
        });
      } else {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.pointerEvents = 'none';
      }
    }
  }

  // 3. Generate Currency Particles
  const symbols = ['$', '€', '£', '¥', '$', '100', '50', '$'];
  function createParticles() {
    if (!particlesContainer) return;
    particlesContainer.innerHTML = '';
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      const typeRand = Math.random();
      if (typeRand < 0.5) {
        p.className = 'currency-particle symbol';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      } else if (typeRand < 0.75) {
        p.className = 'currency-particle coin';
      } else {
        p.className = 'currency-particle shard';
      }
      particlesContainer.appendChild(p);
    }
  }

  // 4. Trigger Transition Animation for Page Navigation
  function triggerPageTransition(targetUrl) {
    if (isNavigating) return;
    isNavigating = true;

    if (!preloader) initPreloaderDOM();

    createParticles();
    preloader.classList.add('active');

    // Navigation function
    const navigate = () => {
      window.location.href = targetUrl;
    };

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf([preloader, currencyWrapper, logo]);
      
      const tl = gsap.timeline({
        onComplete: navigate
      });

      // Reset initial state
      gsap.set(preloader, { opacity: 1, visibility: 'visible', pointerEvents: 'all' });
      gsap.set(currencyWrapper, { scale: 0.5, opacity: 0, x: 0, y: 0 });
      gsap.set(logo, { scale: 0.8, opacity: 0 });
      const particleEls = particlesContainer ? particlesContainer.querySelectorAll('.currency-particle') : [];
      gsap.set(particleEls, { opacity: 0, x: 0, y: 0, scale: 0.5, rotation: 0 });

      // Step A: Currency note moves toward logo
      tl.to(currencyWrapper, {
        duration: 0.28,
        scale: 1.1,
        opacity: 1,
        ease: 'power3.out'
      });

      // Step B: Stackly logo illuminates
      tl.to(logo, {
        duration: 0.2,
        scale: 1.05,
        opacity: 1,
        ease: 'back.out(1.7)'
      }, '-=0.15');

      // Step C: Currency note splits/breaks apart
      tl.to(currencyWrapper, {
        duration: 0.22,
        scale: 1.35,
        opacity: 0,
        ease: 'power2.in'
      });

      // Radial Particle Shatter Burst
      particleEls.forEach((p, idx) => {
        const angle = (idx / particleEls.length) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
        const distance = 80 + Math.random() * 110;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rot = (Math.random() - 0.5) * 360;

        tl.to(p, {
          duration: 0.35,
          x: tx,
          y: ty,
          scale: 0.8 + Math.random() * 0.6,
          rotation: rot,
          opacity: 1,
          ease: 'power3.out'
        }, '-=0.28');

        tl.to(p, {
          duration: 0.15,
          opacity: 0,
          scale: 0.2,
          ease: 'power1.in'
        }, '-=0.1');
      });

      // Logo final pulse exit
      tl.to(logo, {
        duration: 0.18,
        scale: 1.12,
        opacity: 0.8,
        ease: 'power2.out'
      }, '-=0.2');

      // Safety fallback timer to guarantee navigation
      navigationTimeout = setTimeout(navigate, 750);
    } else {
      navigationTimeout = setTimeout(navigate, 250);
    }

    // Secondary safety reset in case navigation gets cancelled/stuck
    setTimeout(() => {
      isNavigating = false;
    }, 2000);
  }

  // 5. Intercept Page Links for Smooth Page Transitions
  function setupLinkInterception() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      // Ignore external links, anchor fragments, javascript/mailto/tel URLs, or new tab links
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target === '_blank' ||
        e.ctrlKey || e.metaKey || e.shiftKey
      ) {
        return;
      }

      // Resolve target URL
      const url = new URL(href, window.location.href);

      // If staying on same page anchor or same exact URL, ignore
      if (url.pathname === window.location.pathname && (url.hash || url.href === window.location.href)) {
        return;
      }

      // Only trigger for internal HTML page transitions
      if (url.origin === window.location.origin && (href.endsWith('.html') || !href.includes('.'))) {
        e.preventDefault();
        triggerPageTransition(url.href);
      }
    });
  }

  // 6. INITIALIZATION & LIFECYCLE LISTENERS FOR BACK/FORWARD CACHE (BFCache)
  document.addEventListener('DOMContentLoaded', () => {
    initPreloaderDOM();
    setupLinkInterception();
    hideAndResetPreloader();
  });

  // Pageshow event catches both initial load AND restoration from BFCache (Back/Forward buttons)
  window.addEventListener('pageshow', (event) => {
    hideAndResetPreloader();
  });

  // Popstate event catches History Back/Forward navigation
  window.addEventListener('popstate', () => {
    hideAndResetPreloader();
  });

  // Visibilitychange catches tab switching / restored sessions
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      hideAndResetPreloader();
    }
  });

})();
