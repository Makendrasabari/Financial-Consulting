/* STACKLY - Scroll Reveals & Graph Animations */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll reveal for elements (supporting standard, left, and right reveal variants)
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-on-scroll-left, .reveal-on-scroll-right');
  const graphCards = document.querySelectorAll('.results-graph-card');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Observer for live running of results graph card
    if (graphCards.length > 0) {
      const graphObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const path = card.querySelector('.graph-line-path');
            const dots = card.querySelectorAll('.graph-dot');
            if (path) path.classList.add('active');
            dots.forEach(dot => dot.classList.add('active'));
            observer.unobserve(card);
          }
        });
      }, {
        threshold: 0.2
      });
      graphCards.forEach(card => graphObserver.observe(card));
    }
  } else {
    // Fallback: reveal and activate all immediately
    revealElements.forEach(el => el.classList.add('revealed'));
    graphCards.forEach(card => {
      const path = card.querySelector('.graph-line-path');
      const dots = card.querySelectorAll('.graph-dot');
      if (path) path.classList.add('active');
      dots.forEach(dot => dot.classList.add('active'));
    });
  }

  // 2. SVG Line and Donut Graph triggers on scroll
  const svgPaths = document.querySelectorAll('.svg-animate-path, .svg-animate-donut');

  if ('IntersectionObserver' in window && svgPaths.length > 0) {
    const svgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    svgPaths.forEach(path => svgObserver.observe(path));
  } else {
    // Fallback
    svgPaths.forEach(path => path.classList.add('active'));
  }

  // 3. Premium Cinematic Image Reveal & Parallax Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const revealImages = document.querySelectorAll(
      '.featured-img, .hand-phone-img, .post-img-wrapper[class*="gradient-"], .contact-map-img, .leader-img, .cta-advisor-photo, .milestones-img'
    );

    revealImages.forEach(img => {
      // 1. Reveal Wipe (Bottom-left to Top-right) + Scale + Opacity
      gsap.fromTo(img, 
        {
          opacity: 0,
          scale: 1.08,
          clipPath: 'polygon(0% 100%, 0% 100%, 100% 100%, 100% 100%)'
        },
        {
          opacity: 1,
          scale: 1,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: img,
            start: 'top 85%',
            toggleActions: 'restart reset restart reset'
          }
        }
      );

      // 2. Subtle Parallax on Scroll (using parent wrapper as trigger to prevent self-feedback jitter)
      const triggerEl = img.parentElement || img;
      gsap.fromTo(img,
        { y: -15 },
        {
          y: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        }
      );
    });

    // 4. Subtle 3D Tilt Card & 360° Border Tracing Interaction for all .service-card elements globally
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
      serviceCards.forEach(card => {
        // Skip service cards inside the grid section of services.html to keep them static as requested
        if (card.closest('.services-grid-section')) return;

        // Dynamic injection of accent border element
        const accent = document.createElement('div');
        accent.className = 'service-card-accent';
        card.appendChild(accent);

        // Setup base styles & perspective
        gsap.set(card, { transformPerspective: 1000, transformStyle: 'preserve-3d' });
        gsap.set(accent, { left: 0, top: 0, right: 'auto', bottom: 'auto', width: 4, height: 0 });

        // Mouse Move (3D Tilt)
        card.addEventListener('mousemove', (e) => {
          const cardRect = card.getBoundingClientRect();
          const mouseX = e.clientX - cardRect.left;
          const mouseY = e.clientY - cardRect.top;
          
          const xPercent = (mouseX / cardRect.width) - 0.5;
          const yPercent = (mouseY / cardRect.height) - 0.5;
          
          const rotateY = xPercent * 8;
          const rotateX = -yPercent * 8;

          gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(10, 17, 36, 0.08)',
            borderColor: '#DFB15B',
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        });

        // Mouse Enter (Trigger 360° border tracing marquee)
        card.addEventListener('mouseenter', () => {
          const traceTl = gsap.timeline({ overwrite: 'auto' });
          card._traceTl = traceTl;

          traceTl
            // 1. Grow left border (height 0 to 100%)
            .set(accent, { left: 0, top: 0, right: 'auto', bottom: 'auto', width: 4, height: 0 })
            .to(accent, { height: '100%', duration: 0.2, ease: 'power2.out' })
            
            // 2. Trace Top (left -> right)
            .set(accent, { left: 0, top: 0, right: 'auto', bottom: 'auto' })
            .to(accent, { width: '100%', height: 4, duration: 0.25, ease: 'power3.inOut' })
            .set(accent, { left: 'auto', right: 0 })
            .to(accent, { width: 4, duration: 0.25, ease: 'power3.inOut' })

            // 3. Trace Right (top -> bottom)
            .set(accent, { left: 'auto', top: 0, right: 0, bottom: 'auto' })
            .to(accent, { height: '100%', width: 4, duration: 0.25, ease: 'power3.inOut' })
            .set(accent, { top: 'auto', bottom: 0 })
            .to(accent, { height: 4, duration: 0.25, ease: 'power3.inOut' })

            // 4. Trace Bottom (right -> left)
            .set(accent, { left: 'auto', top: 'auto', right: 0, bottom: 0 })
            .to(accent, { width: '100%', height: 4, duration: 0.25, ease: 'power3.inOut' })
            .set(accent, { right: 'auto', left: 0 })
            .to(accent, { width: 4, duration: 0.25, ease: 'power3.inOut' })

            // 5. Trace Left & Settle back at origin
            .set(accent, { left: 0, top: 'auto', right: 'auto', bottom: 0 })
            .to(accent, { height: '100%', width: 4, duration: 0.25, ease: 'power3.inOut' })
            .set(accent, { bottom: 'auto', top: 0 });
        });

        // Mouse Leave (Settle and reset)
        card.addEventListener('mouseleave', () => {
          if (card._traceTl) {
            card._traceTl.kill();
          }

          // Return accent line to left side, height 0
          gsap.to(accent, {
            left: 0,
            top: 0,
            right: 'auto',
            bottom: 'auto',
            width: 4,
            height: 0,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
          });

          // Reset card 3D tilt
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.01)',
            borderColor: '#E2E8F0',
            duration: 0.65,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        });
      });
    }

    // 5. Cinematic Text Entrance Animations (left-to-right heading, right-to-left description)
    const animSections = [
      { container: '.blog-hero', heading: '.blog-hero .hero-title', desc: '.blog-hero .hero-desc', label: '.blog-hero .label-gold' },
      { container: '.about-hero', heading: '.about-hero .hero-title', desc: '.about-hero .hero-desc', label: '.about-hero .label-gold' },
      { container: '.contact-hero', heading: '.contact-hero .hero-title', desc: '.contact-hero .hero-desc', label: '.contact-hero .label-gold' },
      { container: '.services-hero', heading: '.services-hero .hero-title', desc: '.services-hero .hero-desc', label: '.services-hero .label-gold' },
      { container: '.hero-section', heading: '.hero-section .hero-title', desc: '.hero-section .hero-desc', label: '.hero-section .label-gold' }
    ];

    animSections.forEach(section => {
      const container = document.querySelector(section.container);
      if (!container) return;

      const heading = container.querySelector(section.heading);
      const desc = container.querySelector(section.desc);
      const label = container.querySelector(section.label);

      if (heading && desc && typeof gsap !== 'undefined') {
        // Initial setup to prevent flash and ensure clear off-screen entrance
        gsap.set(heading, { x: -160, opacity: 0 });
        gsap.set(desc, { x: 160, opacity: 0 });
        if (label) gsap.set(label, { x: -80, opacity: 0 });

        // ScrollTrigger timeline that replays naturally when section enters viewport
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'restart reset restart reset'
          }
        });

        if (label) {
          heroTl.to(label, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'expo.out'
          }, 0);
        }

        // Bold heading slides in left -> right (duration 1.3s, expo.out easing)
        heroTl.to(heading, {
          x: 0,
          opacity: 1,
          duration: 1.3,
          ease: 'expo.out'
        }, label ? 0.15 : 0);

        // Light description text slides in right -> left (duration 1.1s, expo.out easing, staggered by 0.20s after heading)
        heroTl.to(desc, {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'expo.out'
        }, label ? 0.35 : 0.20);
      }
    });

    // 6. Subtle Premium Arrow Hover Effect for all .footer-link elements
    const footerLinks = document.querySelectorAll('.footer-link');
    if (footerLinks.length > 0) {
      footerLinks.forEach(link => {
        // Prepend inline SVG arrow (custom stroke color & positioning)
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        arrow.setAttribute('class', 'footer-link-arrow');
        arrow.setAttribute('width', '10');
        arrow.setAttribute('height', '10');
        arrow.setAttribute('viewBox', '0 0 24 24');
        arrow.setAttribute('fill', 'none');
        arrow.setAttribute('stroke', 'var(--primary-gold)');
        arrow.setAttribute('stroke-width', '4');
        arrow.setAttribute('stroke-linecap', 'round');
        arrow.setAttribute('stroke-linejoin', 'round');
        arrow.style.position = 'absolute';
        arrow.style.left = '-14px';
        arrow.style.top = '50%';
        arrow.style.transform = 'translateY(-50%)';
        arrow.style.opacity = '0';
        arrow.style.pointerEvents = 'none';

        arrow.innerHTML = `
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        `;

        link.appendChild(arrow);
        gsap.set(arrow, { x: -6 });

        // Hover events
        link.addEventListener('mouseenter', () => {
          gsap.to(arrow, {
            x: 0,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
          gsap.to(link, {
            x: 4,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        link.addEventListener('mouseleave', () => {
          gsap.to(arrow, {
            x: -6,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
          gsap.to(link, {
            x: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      });
    }

    // 7. Contact Section Split-Direction Entrance Animation
    const contactGrid = document.querySelector('.contact-grid');
    if (contactGrid) {
      const leftCard = contactGrid.querySelector('.contact-info-card');
      const rightCard = contactGrid.querySelector('.contact-form-card');

      if (leftCard && rightCard) {
        // Set initial states via GSAP (prevents flash & shifts)
        gsap.set(leftCard, { y: 100, scale: 0.98, opacity: 0 });
        gsap.set(rightCard, { y: -100, scale: 0.98, opacity: 0 });

        // ScrollTrigger timeline
        const contactTl = gsap.timeline({
          scrollTrigger: {
            trigger: contactGrid,
            start: 'top 80%',
            toggleActions: 'restart reset restart reset'
          }
        });

        // Left card bottom-up slide
        contactTl.to(leftCard, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out'
        }, 0);

        // Right card top-down slide
        contactTl.to(rightCard, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out'
        }, 0.15); // 0.15s stagger
      }
    }

    // 8. Financial Intelligence 4-Card Shuffle & Rearrange Animation
    const intelGrid = document.querySelector('.intel-stats-grid');
    if (intelGrid) {
      const cards = intelGrid.querySelectorAll('.intel-stat-card');
      if (cards.length === 4) {
        // Set initial shuffled/offset states (diagonally swapped) and opacity 0
        gsap.set(cards[0], { x: 120, y: 100, rotation: -6, opacity: 0, scale: 0.9 });
        gsap.set(cards[1], { x: -120, y: 100, rotation: 6, opacity: 0, scale: 0.9 });
        gsap.set(cards[2], { x: 120, y: -100, rotation: -4, opacity: 0, scale: 0.9 });
        gsap.set(cards[3], { x: -120, y: -100, rotation: 4, opacity: 0, scale: 0.9 });

        // ScrollTrigger timeline that plays when the cards grid becomes visible
        const intelTl = gsap.timeline({
          scrollTrigger: {
            trigger: intelGrid,
            start: 'top 85%',
            toggleActions: 'restart reset restart reset'
          }
        });

        // Smoothly animate each card into their final grid position one after another (staggered overlap)
        intelTl.to(cards[0], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' })
               .to(cards[1], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, '-=0.6')
               .to(cards[2], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, '-=0.6')
               .to(cards[3], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, '-=0.6');
      }
    }

    // 9. Revenue Growth Trend Chart Dashboard Animation (Rise & Converge)
    const dashboard = document.querySelector('.intel-dashboard');
    if (dashboard) {
      const header = dashboard.querySelector('.intel-dashboard-header');
      const chartWrapper = dashboard.querySelector('.chart-visual-wrapper');
      const donutGroup = dashboard.querySelector('.donut-info-group');
      const svgPaths = dashboard.querySelectorAll('.svg-animate-path');
      const donutCircle = dashboard.querySelector('.svg-animate-donut');

      // Set initial states for entrance animation (offset slightly below final positions)
      gsap.set(header, { y: 60, opacity: 0 });
      gsap.set(chartWrapper, { y: 90, opacity: 0 });
      gsap.set(donutGroup, { y: 120, opacity: 0 });
      
      if (svgPaths.length > 0) {
        gsap.set(svgPaths, { strokeDashoffset: 1000 });
      }
      if (donutCircle) {
        gsap.set(donutCircle, { strokeDashoffset: 100 });
      }

      const chartTl = gsap.timeline({
        scrollTrigger: {
          trigger: dashboard,
          start: 'top 80%',
          toggleActions: 'restart reset restart reset'
        }
      });

      // Coordinated rise, converge towards center, and settle layout sequence
      chartTl
        // 1. Header rises, converges slightly downward, and settles
        .to(header, { y: 15, opacity: 0.7, duration: 0.5, ease: 'power2.out' })
        .to(header, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.inOut' })

        // 2. Chart wrapper rises, converges in the middle, and settles
        .to(chartWrapper, { y: 20, opacity: 0.8, duration: 0.5, ease: 'power2.out' }, '-=0.6')
        .to(chartWrapper, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.inOut' })

        // 3. Donut group rises, converges slightly upward, and settles
        .to(donutGroup, { y: -15, opacity: 0.8, duration: 0.5, ease: 'power2.out' }, '-=0.6')
        .to(donutGroup, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.inOut' });

      // 4. Animate the SVG graph paths drawing (cyan and gold lines)
      if (svgPaths.length > 0) {
        chartTl.to(svgPaths, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.15
        }, '-=0.8');
      }

      // 5. Animate the donut chart progress arc
      if (donutCircle) {
        chartTl.to(donutCircle, {
          strokeDashoffset: 25,
          duration: 1.2,
          ease: 'power2.out'
        }, '-=1.2');
      }
    }

    // 10. Live Count-Up Animation for Stat Numbers (.stat-num) on Services page
    const statNums = document.querySelectorAll('.stat-num');
    if (statNums.length > 0) {
      statNums.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target')) || 0;
        const suffix = stat.getAttribute('data-suffix') || '';
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stat,
            start: 'top 90%',
            toggleActions: 'restart none none reset'
          },
          onUpdate: () => {
            stat.textContent = Math.floor(obj.val) + suffix;
          }
        });
      });
    }

    // 11. Custom staggered reveal (Image -> Title -> Description) for Deliverables Cards (.deliver-card)
    const deliverCards = document.querySelectorAll('.deliver-card');
    if (deliverCards.length > 0) {
      deliverCards.forEach(card => {
        const bg = card.querySelector('.deliver-card-bg');
        const title = card.querySelector('.deliver-card-content h3');
        const desc = card.querySelector('.deliver-card-content p');

        // Set initial states to prevent flashing
        gsap.set(bg, { 
          opacity: 0, 
          scale: 1.08, 
          clipPath: 'polygon(0% 100%, 0% 100%, 100% 100%, 100% 100%)' 
        });
        gsap.set(title, { opacity: 0, x: -30 });
        gsap.set(desc, { opacity: 0, y: 20 });

        // Coordinated animation timeline for this specific card
        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'restart reset restart reset'
          }
        });

        cardTl.to(bg, {
          opacity: 1,
          scale: 1,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.2,
          ease: 'power2.out'
        })
        .to(title, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.8')
        .to(desc, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.6');
      });
    }

    // 12. Custom staggered reveal for Method Steps (Center card first, then left/right simultaneously)
    const methodSection = document.querySelector('.services-method-section');
    const methodSteps = document.querySelectorAll('.method-step');
    if (methodSection && methodSteps.length === 3) {
      // Set initial states to prevent flashing
      gsap.set(methodSteps, { opacity: 0, y: 40 });

      const methodTl = gsap.timeline({
        scrollTrigger: {
          trigger: methodSection,
          start: 'top 75%',
          toggleActions: 'restart reset restart reset'
        }
      });

      // 1. Center card (index 1) animates up first
      methodTl.to(methodSteps[1], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      })
      // 2. Left (index 0) and Right (index 2) cards animate in simultaneously
      .to([methodSteps[0], methodSteps[2]], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '+=0.1');
    }

    // 13. Editor's Pick Animation (Image reveal + left-to-right slide, Content right-to-left staggered slide)
    const pickSection = document.querySelector('.blog-pick-section');
    if (pickSection) {
      const img = pickSection.querySelector('.blog-pick-img');
      const content = pickSection.querySelector('.pick-content');
      const contentItems = content ? content.children : [];

      // Set initial states to prevent flashing
      gsap.set(img, { 
        opacity: 0, 
        x: -60, 
        scale: 1.08, 
        clipPath: 'polygon(0% 100%, 0% 100%, 100% 100%, 100% 100%)' 
      });
      if (contentItems.length > 0) {
        gsap.set(contentItems, { opacity: 0, x: 60 });
      }

      const pickTl = gsap.timeline({
        scrollTrigger: {
          trigger: pickSection,
          start: 'top 75%',
          toggleActions: 'restart reset restart reset'
        }
      });

      // 1. Animate left-side image (reveal + slide left-to-right)
      pickTl.to(img, {
        opacity: 1,
        x: 0,
        scale: 1,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.2,
        ease: 'power2.out'
      })
      // 2. Animate right-side content items (slide right-to-left staggered)
      .to(contentItems, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1
      }, '-=0.8');
    }

    // 14. Fresh Perspectives Cards Shuffle Animation (Scattered -> Converge/Overlap -> Settle)
    const freshSection = document.querySelector('.blog-fresh-section');
    const freshCards = document.querySelectorAll('.fresh-card');
    if (freshSection && freshCards.length === 3) {
      // Set initial scattered/shuffled states
      gsap.set(freshCards[0], { x: 160, y: 30, rotation: -8, opacity: 0, scale: 0.9 });
      gsap.set(freshCards[1], { x: 0, y: 100, rotation: 5, opacity: 0, scale: 0.9 });
      gsap.set(freshCards[2], { x: -160, y: -30, rotation: -6, opacity: 0, scale: 0.9 });

      const shuffleTl = gsap.timeline({
        scrollTrigger: {
          trigger: freshSection,
          start: 'top 75%',
          toggleActions: 'restart reset restart reset'
        }
      });

      // Step 1: Converge close to center with subtle overlap
      shuffleTl.to(freshCards[0], { x: 30, y: 10, rotation: 2, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' })
               .to(freshCards[1], { x: 0, y: 20, rotation: -3, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' }, '-=0.7')
               .to(freshCards[2], { x: -30, y: -10, rotation: 4, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' }, '-=0.7')
               
      // Step 2: Shuffle and settle each card back to its exact grid layout position
               .to(freshCards[0], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.1)' }, '+=0.15')
               .to(freshCards[1], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.1)' }, '-=0.6')
               .to(freshCards[2], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.1)' }, '-=0.6');
    }

    // 15. Custom staggered reveal for About Core Values (Center card first, then left/right simultaneously)
    const mattersSec = document.querySelector('.about-matters-section');
    const mattersCards = document.querySelectorAll('.matter-card');
    if (mattersSec && mattersCards.length === 3) {
      // Set initial states to prevent flashing
      gsap.set(mattersCards, { opacity: 0, y: 40 });

      const mattersTl = gsap.timeline({
        scrollTrigger: {
          trigger: mattersSec,
          start: 'top 75%',
          toggleActions: 'restart reset restart reset'
        }
      });

      // 1. Center card (index 1, Resilience) animates up first
      mattersTl.to(mattersCards[1], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      })
      // 2. Left (index 0, Objectivity) and Right (index 2, Conviction) cards animate in simultaneously
      .to([mattersCards[0], mattersCards[2]], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '+=0.1');
    }

    // 16. Operating Principles Cards Shuffle Animation (Scattered -> Converge/Overlap -> Settle)
    const principlesSec = document.querySelector('.principles-section');
    const principleCards = document.querySelectorAll('.principle-card');
    if (principlesSec && principleCards.length === 8) {
      // Set initial scattered/shuffled states
      gsap.set(principleCards[0], { x: 200, y: 80, rotation: -6, opacity: 0, scale: 0.9 });
      gsap.set(principleCards[1], { x: 80, y: 120, rotation: 5, opacity: 0, scale: 0.9 });
      gsap.set(principleCards[2], { x: -80, y: 120, rotation: -4, opacity: 0, scale: 0.9 });
      gsap.set(principleCards[3], { x: -200, y: 80, rotation: 7, opacity: 0, scale: 0.9 });
      gsap.set(principleCards[4], { x: 200, y: -80, rotation: 4, opacity: 0, scale: 0.9 });
      gsap.set(principleCards[5], { x: 80, y: -120, rotation: -5, opacity: 0, scale: 0.9 });
      gsap.set(principleCards[6], { x: -80, y: -120, rotation: 3, opacity: 0, scale: 0.9 });
      gsap.set(principleCards[7], { x: -200, y: -80, rotation: -8, opacity: 0, scale: 0.9 });

      const principlesTl = gsap.timeline({
        scrollTrigger: {
          trigger: principlesSec,
          start: 'top 75%',
          toggleActions: 'restart reset restart reset'
        }
      });

      // Step 1: Converge close to center with subtle overlap
      principlesTl.to(principleCards[0], { x: 30, y: 10, rotation: 2, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' })
                  .to(principleCards[1], { x: 10, y: 15, rotation: -3, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' }, '-=0.7')
                  .to(principleCards[2], { x: -10, y: 15, rotation: 1, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' }, '-=0.7')
                  .to(principleCards[3], { x: -30, y: 10, rotation: -2, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' }, '-=0.7')
                  .to(principleCards[4], { x: 30, y: -10, rotation: 3, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' }, '-=0.7')
                  .to(principleCards[5], { x: 10, y: -15, rotation: -1, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' }, '-=0.7')
                  .to(principleCards[6], { x: -10, y: -15, rotation: 2, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' }, '-=0.7')
                  .to(principleCards[7], { x: -30, y: -10, rotation: -3, opacity: 0.8, scale: 0.95, duration: 0.7, ease: 'power2.out' }, '-=0.7')
                  
      // Step 2: Shuffle and settle each card back to its exact grid layout position
                  .to(principleCards, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'back.out(1.1)',
                    stagger: 0.08
                  }, '+=0.15');
    }

    // 17. Contact Page Let's Connect Animation (Content top-to-bottom, Image bottom-to-top + reveal)
    const connectSec = document.querySelector('.contact-connect-section');
    if (connectSec) {
      const content = connectSec.querySelector('.connect-content');
      const items = content ? content.children : [];
      const img = connectSec.querySelector('.contact-connect-img');

      // Set initial states to prevent flashing
      gsap.set(items, { opacity: 0, y: -40 });
      gsap.set(img, { 
        opacity: 0, 
        y: 60, 
        scale: 1.08, 
        clipPath: 'polygon(0% 100%, 0% 100%, 100% 100%, 100% 100%)' 
      });

      const connectTl = gsap.timeline({
        scrollTrigger: {
          trigger: connectSec,
          start: 'top 75%',
          toggleActions: 'restart reset restart reset'
        }
      });

      // 1. Animate left-side content (top to bottom staggered)
      connectTl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1
      })
      // 2. Animate right-side image (bottom to top + cinematic zoom reveal)
      .to(img, {
        opacity: 1,
        y: 0,
        scale: 1,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.6');
    }

    // 18. Contact Page Quick Contact Cards Animation (First/Last first, then middle two outward rotating slide)
    const quickSection = document.querySelector('.contact-quick-section');
    const quickCards = document.querySelectorAll('.quick-card');
    if (quickSection && quickCards.length === 4) {
      // Set initial states
      gsap.set([quickCards[0], quickCards[3]], { opacity: 0, y: 40 });
      gsap.set(quickCards[1], { x: 120, y: 0, rotation: -6, opacity: 0, scale: 0.9 });
      gsap.set(quickCards[2], { x: -120, y: 0, rotation: 6, opacity: 0, scale: 0.9 });

      const quickTl = gsap.timeline({
        scrollTrigger: {
          trigger: quickSection,
          start: 'top 80%',
          toggleActions: 'restart reset restart reset'
        }
      });

      // 1. Animate first and last cards smoothly into position
      quickTl.to([quickCards[0], quickCards[3]], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15
      })
      // 2. Animate the two middle cards outward from center, rotating and settling
      .to(quickCards[1], {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: 'power2.out'
      }, '+=0.1')
      .to(quickCards[2], {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: 'power2.out'
      }, '-=0.85');
    }

    // Refresh ScrollTrigger positions after page fully loads (handles image dimensions shifts)
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }
});
