document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initProgressBar();
  initScrollAnimations();
  initExpandables();
  initTabs();
  initMobileMenu();
  initNavHighlight();
  initCounterAnimations();
  initSkillBars();
  initResourceFilters();
  initCharts();
});

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateThemeIcon();
    if (window.chartInstances) {
      Object.values(window.chartInstances).forEach(chart => {
        updateChartTheme(chart);
      });
    }
  });

  updateThemeIcon();
}

function updateThemeIcon() {
  const toggle = document.getElementById('theme-toggle');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  toggle.innerHTML = isDark
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(scrolled / total) * 100}%`;
  }, { passive: true });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function initExpandables() {
  document.querySelectorAll('.expandable-header').forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.closest('.expandable');
      parent.classList.toggle('open');
    });
  });
}

function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.tab');
    const contentId = tabGroup.dataset.tabs;
    const contents = document.querySelectorAll(`[data-tab-group="${contentId}"] .tab-content`);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.target);
        if (target) target.classList.add('active');
      });
    });
  });
}

function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.innerHTML = links.classList.contains('open')
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    });
  });
}

function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
}

function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased * 10) / 10;

    if (Number.isInteger(target)) {
      el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
    } else {
      el.textContent = prefix + current.toFixed(1) + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

function getChartTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
}

function getChartGridColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
}

function updateChartTheme(chart) {
  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();

  if (chart.options.scales) {
    Object.values(chart.options.scales).forEach(scale => {
      if (scale.ticks) scale.ticks.color = textColor;
      if (scale.grid) scale.grid.color = gridColor;
      if (scale.pointLabels) scale.pointLabels.color = textColor;
    });
  }

  if (chart.options.plugins?.legend?.labels) {
    chart.options.plugins.legend.labels.color = textColor;
  }

  chart.update('none');
}

function initResourceFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.resource-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initCharts() {
  window.chartInstances = {};

  const aiRiskCtx = document.getElementById('chart-ai-risk');
  if (aiRiskCtx) {
    window.chartInstances.aiRisk = new Chart(aiRiskCtx, {
      type: 'bar',
      data: {
        labels: ['Computer Programmers', 'Junior Devs', 'QA / Testing', 'Frontend', 'Backend', 'DevOps', 'Security'],
        datasets: [{
          label: 'AI Task Exposure (%)',
          data: [74.5, 65, 55, 50, 40, 25, 20],
          backgroundColor: [
            '#DC2626', '#D97706', '#D97706', '#2563EB', '#2563EB', '#059669', '#059669'
          ],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.parsed.x}% of tasks exposed to AI`
            }
          }
        },
        scales: {
          x: {
            max: 100,
            grid: { color: getChartGridColor() },
            ticks: { color: getChartTextColor(), callback: v => v + '%' }
          },
          y: {
            grid: { display: false },
            ticks: { color: getChartTextColor() }
          }
        }
      }
    });
  }

  const skillsRadarCtx = document.getElementById('chart-skills-radar');
  if (skillsRadarCtx) {
    window.chartInstances.skillsRadar = new Chart(skillsRadarCtx, {
      type: 'radar',
      data: {
        labels: ['Technical Depth', 'Communication', 'Leadership', 'Empathy', 'Strategic Thinking', 'Networking', 'Creativity'],
        datasets: [
          {
            label: 'Traditional Engineer',
            data: [95, 30, 20, 25, 35, 15, 40],
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            borderColor: '#2563EB',
            pointBackgroundColor: '#2563EB',
            borderWidth: 2,
          },
          {
            label: 'Full-Stack Human',
            data: [80, 85, 75, 80, 85, 80, 75],
            backgroundColor: 'rgba(124, 58, 237, 0.15)',
            borderColor: '#7C3AED',
            pointBackgroundColor: '#7C3AED',
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: getChartTextColor(), padding: 20, usePointStyle: true }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { display: false },
            grid: { color: getChartGridColor() },
            pointLabels: {
              color: getChartTextColor(),
              font: { size: 12 }
            }
          }
        }
      }
    });
  }

  const careerCtx = document.getElementById('chart-career-salary');
  if (careerCtx) {
    window.chartInstances.career = new Chart(careerCtx, {
      type: 'bar',
      data: {
        labels: ['Junior Dev', 'Senior Dev', 'Staff Engineer', 'Principal', 'Eng Manager', 'Director', 'VP Engineering'],
        datasets: [
          {
            label: 'Technical Skills Weight (%)',
            data: [80, 70, 55, 45, 40, 30, 20],
            backgroundColor: '#2563EB',
            borderRadius: 6,
          },
          {
            label: 'Human Skills Weight (%)',
            data: [20, 30, 45, 55, 60, 70, 80],
            backgroundColor: '#7C3AED',
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: getChartTextColor(), padding: 20, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: getChartTextColor(), maxRotation: 45 },
            stacked: true,
          },
          y: {
            max: 100,
            grid: { color: getChartGridColor() },
            ticks: { color: getChartTextColor(), callback: v => v + '%' },
            stacked: true,
          }
        }
      }
    });
  }

  const jobMarketCtx = document.getElementById('chart-job-market');
  if (jobMarketCtx) {
    window.chartInstances.jobMarket = new Chart(jobMarketCtx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        datasets: [
          {
            label: 'AI/ML Engineer Demand',
            data: [30, 40, 55, 70, 95, 130, 170],
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
          },
          {
            label: 'Traditional Dev Demand',
            data: [100, 110, 115, 105, 95, 90, 92],
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
          },
          {
            label: 'Entry-Level Postings',
            data: [100, 105, 110, 90, 75, 65, 68],
            borderColor: '#DC2626',
            backgroundColor: 'rgba(220, 38, 38, 0.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: getChartTextColor(), padding: 20, usePointStyle: true }
          }
        },
        scales: {
          x: {
            grid: { color: getChartGridColor() },
            ticks: { color: getChartTextColor() }
          },
          y: {
            grid: { color: getChartGridColor() },
            ticks: { color: getChartTextColor() },
            title: {
              display: true,
              text: 'Index (2020 = 100)',
              color: getChartTextColor(),
            }
          }
        }
      }
    });
  }

  const networkCtx = document.getElementById('chart-network');
  if (networkCtx) {
    window.chartInstances.network = new Chart(networkCtx, {
      type: 'doughnut',
      data: {
        labels: ['Hidden Job Market (Never Posted)', 'Public Job Boards', 'Company Websites', 'Recruiting Agencies'],
        datasets: [{
          data: [70, 15, 10, 5],
          backgroundColor: ['#2563EB', '#7C3AED', '#059669', '#D97706'],
          borderColor: 'transparent',
          borderWidth: 0,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: getChartTextColor(), padding: 16, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      }
    });
  }
}
