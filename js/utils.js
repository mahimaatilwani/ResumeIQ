// utils.js — shared UI helpers

// ── Toast notifications ────────────────────────────────────────
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const colors = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--cyan)' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="color:${colors[type]};font-weight:600;font-size:0.9rem">${icons[type]}</span>
    <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Loading overlay ────────────────────────────────────────────
function showLoading(msg = 'Analyzing your resume…') {
  let el = document.getElementById('loading-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loading-overlay';
    el.innerHTML = `<div class="spinner" style="width:36px;height:36px"></div><p id="loading-msg"></p>`;
    document.body.appendChild(el);
  }
  el.querySelector('#loading-msg').textContent = msg;
  el.classList.remove('hidden');
}

function hideLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.classList.add('hidden');
}

// ── Score color ────────────────────────────────────────────────
function scoreColor(score) {
  if (score >= 80) return 'var(--success)';
  if (score >= 55) return 'var(--warning)';
  return 'var(--danger)';
}

function scoreBadgeClass(score) {
  if (score >= 80) return 'badge-success';
  if (score >= 55) return 'badge-warning';
  return 'badge-danger';
}

function scoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Needs Work';
}

// ── Score ring SVG ─────────────────────────────────────────────
function renderScoreRing(containerId, score, size = 120) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);

  el.innerHTML = `
    <div class="score-ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle class="score-ring-bg" cx="${size/2}" cy="${size/2}" r="${r}"/>
        <circle class="score-ring-fill" cx="${size/2}" cy="${size/2}" r="${r}"
          stroke="${color}"
          stroke-dasharray="${circ}"
          stroke-dashoffset="${circ}"
          id="${containerId}-fill"/>
      </svg>
      <div class="score-ring-number" style="color:${color}">${score}</div>
    </div>`;

  // animate
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const fill = document.getElementById(`${containerId}-fill`);
      if (fill) fill.style.strokeDashoffset = offset;
    });
  });
}

// ── Progress bar ───────────────────────────────────────────────
function renderProgressBars(containerId, breakdown) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const labels = {
    contact: 'Contact Info', education: 'Education', skills: 'Skills',
    experience: 'Experience', projects: 'Projects', certifications: 'Certifications',
    keywords: 'Keywords', formatting: 'Formatting'
  };

  el.innerHTML = Object.entries(breakdown).map(([key, { score, max }]) => {
    const pct = Math.round((score / max) * 100);
    const color = scoreColor(pct);
    return `
      <div class="progress-bar-wrap">
        <div class="progress-bar-label">
          <span>${labels[key] || key}</span>
          <span style="color:${color};font-weight:600">${score}/${max}</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:0%;background:${color}" data-target="${pct}"></div>
        </div>
      </div>`;
  }).join('');

  // animate bars
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.querySelectorAll('.progress-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    });
  });
}

// ── Section chips ──────────────────────────────────────────────
function renderSectionChips(containerId, sections) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const labels = {
    contact: 'Contact', education: 'Education', experience: 'Experience',
    skills: 'Skills', projects: 'Projects', certifications: 'Certifications',
    achievements: 'Achievements'
  };
  el.innerHTML = Object.entries(sections).map(([k, found]) =>
    `<span class="section-found ${found ? 'yes' : 'no'}">${found ? '✓' : '✕'} ${labels[k] || k}</span>`
  ).join('');
}

// ── Date format ────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── File reader ────────────────────────────────────────────────
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}

// ── Nav active link ────────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', path.includes(a.getAttribute('href')));
  });
}

// ── Inject nav ────────────────────────────────────────────────
function injectNav(isAdmin = false) {
  const session = JSON.parse(sessionStorage.getItem('resumeiq_session') || 'null');
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const adminLink = (session?.role === 'admin')
    ? `<li><a href="admin.html">Admin</a></li>` : '';

  nav.innerHTML = `
    <div class="nav-logo"><span>Resume</span>IQ</div>
    <ul class="nav-links">
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="upload.html">Upload</a></li>
      <li><a href="profile.html">Profile</a></li>
      ${adminLink}
    </ul>
    <div class="nav-actions">
      <span class="text-muted text-sm">Hi, ${session?.name?.split(' ')[0] || 'User'}</span>
      <button class="btn btn-outline btn-sm" onclick="Auth.logout()">Sign out</button>
    </div>`;

  setActiveNav();
}
