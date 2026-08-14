/* STACKLY - Unified Financial consulting Dashboard Controller */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. DYNAMIC THEME SELECTION & STORAGE RETRIEVAL
  const email = sessionStorage.getItem('user_email') || 'jordan.reyes@stackly.com';
  let defaultRole = 'analyst';
  if (window.location.pathname.includes('investment-advisor')) {
    defaultRole = 'advisor';
  }
  const role = sessionStorage.getItem('user_role') || defaultRole;
  
  // Set class on body for theme styling
  document.body.className = `section-dark ${role}-theme`;

  // 2. PARSE USER INFO FOR PROFILE DROPDOWN
  let fullName = 'Jordan Reyes';
  if (email) {
    const prefix = email.split('@')[0];
    const parts = prefix.split(/[._-]/);
    if (parts.length >= 2) {
      fullName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    } else if (parts.length === 1) {
      fullName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
  }

  // Get initials
  const nameParts = fullName.split(' ');
  let initials = 'JR';
  if (nameParts.length >= 2) {
    initials = nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  } else if (nameParts.length === 1) {
    initials = nameParts[0].slice(0, 2).toUpperCase();
  }

  const roleText = role === 'analyst' ? 'Financial Analyst' : 'Investment Advisor';

  // Update profile header elements if present
  const headerAvatar = document.getElementById('avatar-initials');
  const headerName = document.getElementById('avatar-fullname');
  const ddAvatar = document.getElementById('dropdown-initials');
  const ddName = document.getElementById('dropdown-fullname');
  const ddEmail = document.getElementById('dropdown-email');
  const ddRole = document.getElementById('dropdown-role');

  if (headerAvatar) headerAvatar.textContent = initials;
  if (headerName) headerName.textContent = fullName;
  if (ddAvatar) ddAvatar.textContent = initials;
  if (ddName) ddName.textContent = fullName;
  if (ddEmail) ddEmail.textContent = email;
  if (ddRole) ddRole.textContent = roleText;

  // 3. PROFILE DROPDOWN TOGGLE INTERACTION
  const profileMenu = document.getElementById('profile-menu');
  const profileDropdown = document.getElementById('profile-dropdown');

  if (profileMenu && profileDropdown) {
    profileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });

    // Close on click outside
    document.addEventListener('click', () => {
      profileDropdown.classList.remove('active');
    });
  }

  // 4. SIDEBAR ACTIVE HIGHLIGHTING & REDIRECTION
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  const sidebarLinks = role === 'analyst' ? {
    'financial-analyst-dashboard.html': 'Dashboard',
    'financial-analyst-overview.html': 'Financial Overview',
    'financial-analyst-revenue.html': 'Revenue Analysis',
    'financial-analyst-portfolio.html': 'Client Portfolio',
    'financial-analyst-insights.html': 'Market Insights'
  } : {
    'investment-advisor-dashboard.html': 'Advisory Terminal',
    'investment-advisor-overview.html': 'Wealth Audit',
    'investment-advisor-revenue.html': 'AUM fee Yields',
    'investment-advisor-portfolio.html': 'Client Holdings',
    'investment-advisor-insights.html': 'Arbitrage Spreads'
  };

  const sidebarItems = document.querySelectorAll('.sidebar-menu .sidebar-item');
  sidebarItems.forEach(item => {
    // Get text content of sidebar item
    const text = item.textContent.trim().replace(/\s+/g, ' ');
    
    // Check if item points to current page URL
    let isActive = false;
    for (const [url, title] of Object.entries(sidebarLinks)) {
      if (pageName === url && text.includes(title)) {
        isActive = true;
        break;
      }
    }

    if (isActive) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // 5. TOAST NOTIFICATION SETUP (REPLACES ALERTS)
  // Dynamically insert toast container if it doesn't exist
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  let toastTimeout;
  window.showToast = (message) => {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('active');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  };

  // Setup click handlers for all buttons with class .action-btn
  const actionButtons = document.querySelectorAll('.action-btn');
  actionButtons.forEach(button => {
    const label = button.querySelector('.action-label')?.textContent.trim() || 'Action';
    let msg = `Accessing ${label.toLowerCase()} console...`;

    // Map custom messages (no emojis!)
    if (label.includes("Review Portfolio")) msg = "Loading advisory review console.";
    else if (label.includes("Rebalance Model")) msg = "Initializing model rebalancer.";
    else if (label.includes("Generate Report")) msg = "Generating advisory performance statements.";
    else if (label.includes("View Strategy")) msg = "Loading model templates.";
    else if (label.includes("Create Report")) msg = "Generating financial report asset.";
    else if (label.includes("Client Portfolios")) msg = "Loading client portfolios.";
    else if (label.includes("Revenue Analytics")) msg = "Loading revenue data analytics.";
    else if (label.includes("Export Dataset") || label.includes("Export Data")) msg = "Exporting active dataset to CSV.";

    button.removeAttribute('onclick');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      window.showToast(msg);
    });
  });

  // 6. MOBILE SIDEBAR DRAWER TOGGLE
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarClose = document.getElementById('sidebar-close');

  if (sidebar && sidebarOverlay) {
    const toggleSidebar = () => {
      sidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    };

    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', toggleSidebar);
  }

  // 7. NOTIFICATION BELL REDIRECTS TO 404 PAGE
  const notificationBtns = document.querySelectorAll('.header-icon-btn');
  notificationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = '404.html';
    });
  });

  // 8. GLOBAL DASHBOARD ENTRANCE ANIMATIONS (GSAP + ScrollTrigger)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // A. Market Signal KPI Grid Animation (Center card first, then left/right simultaneously)
    const kpiGrids = document.querySelectorAll('.kpi-grid');
    kpiGrids.forEach(grid => {
      const cards = grid.querySelectorAll('.kpi-card');
      if (cards.length === 3) {
        const leftCard = cards[0];
        const centerCard = cards[1];
        const rightCard = cards[2];

        // Set initial state
        gsap.set([leftCard, centerCard, rightCard], { y: 45, opacity: 0 });

        // ScrollTrigger timeline
        const kpiTl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'restart reset restart reset'
          }
        });

        // 1. Center card slides up first
        kpiTl.to(centerCard, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out'
        })
        // 2. Left and right cards slide up simultaneously
        .to([leftCard, rightCard], {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out'
        }, '-=0.45');
      }
    });

    // B. Two Column Charts Split-Cross Entrance Animation
    const chartsGrids = document.querySelectorAll('.charts-grid');
    chartsGrids.forEach(grid => {
      const panels = grid.querySelectorAll('.chart-panel');
      if (panels.length === 2) {
        const leftPanel = panels[0];
        const rightPanel = panels[1];

        // Set initial states
        gsap.set(leftPanel, { x: -150, y: 50, opacity: 0 });
        gsap.set(rightPanel, { x: 150, y: 50, opacity: 0 });

        // ScrollTrigger timeline
        const chartsTl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'restart reset restart reset'
          }
        });

        // Left panel slides from bottom-left
        chartsTl.to(leftPanel, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out'
        }, 0);

        // Right panel slides from bottom-right (staggered by 0.15s)
        chartsTl.to(rightPanel, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out'
        }, 0.15);
      }
    });
  }
});
