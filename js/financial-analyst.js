/* STACKLY - Financial Analyst Dashboard Controller */

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

    // A. Revenue Performance - Line Chart (Teal & Gold)
    const revenueLineCtx = document.getElementById('revenuePerformanceChart');
    if (revenueLineCtx) {
      // Create gradients
      const ctx = revenueLineCtx.getContext('2d');
      const tealGradient = ctx.createLinearGradient(0, 0, 0, 300);
      tealGradient.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
      tealGradient.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

      new Chart(revenueLineCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Current Year (FY26)',
              data: [1.1, 1.25, 1.4, 1.35, 1.5, 1.62, 1.58, 1.7, 1.82, 1.75, 1.9, 2.1], // Cumulative approx 18.7M
              borderColor: '#00F2FE', // Accent Teal
              borderWidth: 2.5,
              backgroundColor: tealGradient,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: '#00F2FE',
              pointHoverRadius: 6
            },
            {
              label: 'Previous Year (FY25)',
              data: [0.8, 0.9, 0.95, 0.9, 1.05, 1.12, 1.08, 1.15, 1.22, 1.18, 1.25, 1.3], // approx 12.4M
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
                usePointStyle: false,
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

    // B. Asset Allocation - Doughnut Chart (Gold, Teal, Cyan, Deep Blue)
    const allocationCtx = document.getElementById('portfolioAllocationChart');
    if (allocationCtx) {
      new Chart(allocationCtx, {
        type: 'doughnut',
        data: {
          labels: ['Equities', 'Fixed Income', 'Alternatives', 'Cash'],
          datasets: [{
            data: [60, 25, 10, 5],
            backgroundColor: [
              '#DFB15B', // Gold
              '#00C6FF', // Cyan
              '#00F2FE', // Teal
              '#0E2A54'  // Dark Blue
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
                padding: 16
              }
            }
          }
        }
      });
    }

    // C. Quarterly Revenue Analysis - Bar Chart
    const revenueAnalysisCtx = document.getElementById('revenueAnalysisChart');
    if (revenueAnalysisCtx) {
      new Chart(revenueAnalysisCtx, {
        type: 'bar',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            {
              label: 'Current Year (FY26)',
              data: [3.75, 4.47, 5.10, 5.38],
              backgroundColor: 'rgba(0, 242, 254, 0.85)',
              borderColor: '#00F2FE',
              borderWidth: 1,
              borderRadius: 4
            },
            {
              label: 'Previous Year (FY25)',
              data: [2.65, 3.07, 3.45, 3.23],
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
                  return '$' + value + 'M';
                }
              }
            }
          }
        }
      });
    }
  }

  // 3. Risk Gauge Rotation Logic
  const riskGaugeVal = document.getElementById('risk-gauge-value');
  if (riskGaugeVal) {
    // Risk score is 35. Ratio: 35 / 100 = 0.35.
    // Full arc is 180 degrees (-45deg to 135deg).
    // Rotation mapping: ratio * 180 - 45.
    // 0.35 * 180 - 45 = 63 - 45 = 18deg.
    // Start at initial rotation and let animation trigger.
    setTimeout(() => {
      riskGaugeVal.style.transform = 'rotate(18deg)';
    }, 200);
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
      
      if (label.includes("Create Report")) {
        msg = "Generating financial report asset.";
      } else if (label.includes("Client Portfolios")) {
        msg = "Loading client portfolios.";
      } else if (label.includes("Revenue Analytics")) {
        msg = "Loading revenue data analytics.";
      } else if (label.includes("Export Dataset")) {
        msg = "Exporting active dataset to CSV.";
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
