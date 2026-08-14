/* STACKLY - Investment Advisor Dashboard Controller */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Mobile Sidebar Navigation Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  if (menuToggle && sidebar && sidebarOverlay) {
    const toggleSidebar = () => {
      sidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Sidebar navigation active state toggle and smooth scroll
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Skip if it's the Logout link
        if (item.textContent.trim().toLowerCase() === 'logout') {
          location.href = 'login.html';
          return;
        }

        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const targetId = item.getAttribute('data-target');
        if (targetId) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }

        // Close sidebar drawer if on mobile
        if (window.innerWidth <= 1024) {
          toggleSidebar();
        }
      });
    });
  }

  // 2. Chart.js Global Default Styling (Stackly Color System)
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#94A3B8'; // Muted grey
    Chart.defaults.plugins.legend.labels.color = '#94A3B8';
    Chart.defaults.plugins.tooltip.backgroundColor = '#0B1528';
    Chart.defaults.plugins.tooltip.titleColor = '#FFFFFF';
    Chart.defaults.plugins.tooltip.bodyColor = '#FFFFFF';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.08)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 6;

    // A. Investment Performance - Area Chart (Teal & Gold)
    const investmentPerformanceCtx = document.getElementById('investmentPerformanceChart');
    if (investmentPerformanceCtx) {
      // Create gradients
      const ctx = investmentPerformanceCtx.getContext('2d');
      const tealGradient = ctx.createLinearGradient(0, 0, 0, 300);
      tealGradient.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
      tealGradient.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

      new Chart(investmentPerformanceCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Active Portfolio (AUM Base)',
              data: [500, 520, 555, 540, 570, 595, 580, 605, 620, 615, 628, 640.8], // AUM Growth up to 640M
              borderColor: '#00F2FE', // Teal
              borderWidth: 2.5,
              backgroundColor: tealGradient,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: '#00F2FE',
              pointHoverRadius: 6
            },
            {
              label: 'Previous Period Strategy',
              data: [420, 440, 475, 455, 480, 500, 490, 510, 530, 525, 538, 550], // Comparison baseline
              borderColor: '#DFB15B', // Gold
              borderWidth: 1.5,
              borderDash: [5, 5],
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.35,
              pointBackgroundColor: '#DFB15B',
              pointHoverRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                padding: 15
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.03)'
              },
              ticks: {
                padding: 8
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.03)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value + 'M';
                },
                padding: 8
              }
            }
          }
        }
      });
    }

    // B. Asset Allocation - Doughnut Chart (Cyan, Gold, Teal, Deep Navy, Gray)
    const assetAllocationCtx = document.getElementById('assetAllocationChart');
    if (assetAllocationCtx) {
      new Chart(assetAllocationCtx, {
        type: 'doughnut',
        data: {
          labels: ['Equities', 'Bonds', 'Real Estate', 'Alternatives', 'Cash'],
          datasets: [{
            data: [50, 30, 10, 7, 3],
            backgroundColor: [
              '#00C6FF', // Cyan
              '#DFB15B', // Gold
              '#00F2FE', // Teal
              '#0E2A54', // Dark Navy
              '#1E293B'  // Slate Slate Gray
            ],
            borderColor: '#050B14', // Match canvas background
            borderWidth: 3,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                boxHeight: 10,
                padding: 14
              }
            }
          }
        }
      });
    }

    // C. Investment Category - Bar Chart (Cyan and Gold)
    const categoryCtx = document.getElementById('investmentCategoryChart');
    if (categoryCtx) {
      new Chart(categoryCtx, {
        type: 'bar',
        data: {
          labels: ['Equities', 'Fixed Income', 'Real Estate', 'Alternatives'],
          datasets: [
            {
              label: 'Current Return %',
              data: [26.4, 12.8, 14.5, 18.2],
              backgroundColor: 'rgba(0, 242, 254, 0.85)',
              borderColor: '#00F2FE',
              borderWidth: 1,
              borderRadius: 4
            },
            {
              label: 'Model Target Return %',
              data: [20.0, 10.0, 12.0, 15.0],
              backgroundColor: 'rgba(223, 177, 91, 0.85)',
              borderColor: '#DFB15B',
              borderWidth: 1,
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                padding: 15
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.03)'
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.03)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }
  }

  // 4. Quick Actions Custom Notification Banner (replaces alert popups)
  const actionButtons = document.querySelectorAll('.actions-panel .action-btn');
  if (actionButtons.length > 0) {
    // Dynamically insert toast container if it doesn't exist
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }

    let toastTimeout;
    const showToast = (message) => {
      clearTimeout(toastTimeout);
      toast.textContent = message;
      toast.classList.add('active');
      toastTimeout = setTimeout(() => {
        toast.classList.remove('active');
      }, 3000);
    };

    actionButtons.forEach(button => {
      // Map customized clean messages (no emojis)
      const label = button.querySelector('.action-label')?.textContent.trim() || '';
      let msg = "Processing requested operation.";
      
      if (label.includes("Review Portfolio")) {
        msg = "Loading advisory review console.";
      } else if (label.includes("Rebalance Model")) {
        msg = "Initializing model rebalancer.";
      } else if (label.includes("Generate Report")) {
        msg = "Generating advisory performance statements.";
      } else if (label.includes("View Strategy")) {
        msg = "Loading model templates.";
      }

      // Remove inline onclick handler to avoid alert
      button.removeAttribute('onclick');
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        showToast(msg);
      });
    });
  }
});
