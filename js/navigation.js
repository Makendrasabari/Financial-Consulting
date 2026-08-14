/* STACKLY - Navigation & Header Logic */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinksWrapper = document.querySelector('.nav-links-wrapper');
  const navLinks = document.querySelectorAll('.nav-item');

  // 1. Header scroll effect
  const handleScroll = () => {
    if (!header) return;
    if (document.body.classList.contains('auth-page') || header.classList.contains('auth-header')) {
      header.classList.add('scrolled');
      return;
    }
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initially in case page is refreshed while scrolled

  // 2. Mobile menu toggle
  if (mobileMenuToggle && navLinksWrapper) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenuToggle.classList.toggle('active');
      navLinksWrapper.classList.toggle('active');
      // Prevent scrolling when mobile menu is open
      document.body.style.overflow = navLinksWrapper.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinksWrapper.classList.contains('active') && !navLinksWrapper.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navLinksWrapper.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navLinksWrapper.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Set active navigation link based on current page pathname
  const currentPath = window.location.pathname;
  let hasActive = false;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
      hasActive = true;
    } else {
      link.classList.remove('active');
    }
  });

  // Default to first nav-item (Home) if no match found (like root path "/" or "index.html")
  if (!hasActive && navLinks.length > 0) {
    // If we're on index or root, highlight home
    if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '') {
      navLinks[0].classList.add('active');
    }
  }
});
