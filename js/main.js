(function () {
  'use strict';

  // ---------- Theme toggle (follows system by default) ----------
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(prefersDark));
    }
  }

  function toggleTheme() {
    const isDark = html.classList.contains('dark');
    if (isDark) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(!isDark));
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme);
  applySystemTheme();

  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      menuBtn.setAttribute('aria-expanded', String(isHidden));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Speaker avatar initials ----------
  function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1 && /[a-zA-Z]/.test(parts[0][0])) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().charAt(0).toUpperCase();
  }

  function renderAvatars() {
    document.querySelectorAll('.speaker-avatar').forEach((el) => {
      const name = el.getAttribute('data-name') || '';
      const color = el.getAttribute('data-color') || 'from-slate-600 to-slate-400';
      el.style.background = '';
      el.className = `speaker-avatar ${el.className.replace(/from-\S+|to-\S+/g, '').trim()} bg-gradient-to-br ${color}`;
      el.textContent = getInitials(name);
    });
  }

  renderAvatars();

  // ---------- Highlight current / next seminar week + featured panel ----------
  function getFeaturedSession() {
    const sessions = Array.from(document.querySelectorAll('.speaker-session'));
    if (!sessions.length) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let currentIndex = 0;
    sessions.forEach((session, index) => {
      const dateAttr = session.getAttribute('data-date');
      if (!dateAttr) return;
      const sessionDate = new Date(dateAttr + 'T00:00:00');
      if (sessionDate <= now) {
        currentIndex = index;
      }
    });

    return sessions[currentIndex];
  }

  function formatDateLabel(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function renderFeaturedPanel(session) {
    if (!session) return;
    const container = document.getElementById('featured-seminar');
    if (!container) return;

    const imgEl = session.querySelector('img');
    const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
    const imgAlt = imgEl ? imgEl.getAttribute('alt') : 'Speaker';

    const dateAttr = session.getAttribute('data-date') || '';
    const dateLabel = formatDateLabel(dateAttr);

    // Speaker info is now in the left column
    const leftColumn = session.querySelector('.grid > div:first-child');
    const speakerNameEl = leftColumn ? leftColumn.querySelector('.font-serif') : null;
    const speakerAffilEl = leftColumn ? leftColumn.querySelector('.p-4 .text-slate-500') : null;
    const speakerName = speakerNameEl ? speakerNameEl.textContent.trim() : '';
    const speakerAffil = speakerAffilEl ? speakerAffilEl.textContent.trim() : '';

    // Talk details are in the right column
    const rightColumn = session.querySelector('.grid > div:last-child');
    const titleEl = rightColumn ? rightColumn.querySelector('p.text-lg.font-semibold') : null;
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    const tags = rightColumn
      ? Array.from(rightColumn.querySelectorAll('.rounded.bg-slate-100, .rounded.bg-blue-50')).map((t) => t.textContent.trim()).join(' · ')
      : '';

    let abstractText = '';
    if (rightColumn) {
      const abstractEl = Array.from(rightColumn.querySelectorAll('p > strong')).find((el) => el.textContent.includes('Abstract'));
      if (abstractEl) {
        abstractText = abstractEl.parentElement.textContent.replace(/^Abstract\.\s*/, '').trim();
        if (abstractText.length > 280) {
          abstractText = abstractText.slice(0, 280) + '…';
        }
      }
    }

    const zoomLink = 'https://hkust-gz-edu-cn.zoom.us/j/97777467473?pwd=PxC8FbxXlMDg1MYTObQY2aBadPqqoa.1';
    const placeholderInitials = speakerName.split('').filter((c) => /[A-Za-z一-龥]/.test(c)).slice(0, 2).join('').toUpperCase();

    container.innerHTML = `
      <article class="featured-layout overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm card-hover dark:border-slate-800 dark:bg-slate-950">
        <div class="relative h-60 bg-slate-100 lg:h-auto dark:bg-slate-800">
          <img src="${imgSrc}" alt="${speakerName || 'Speaker'}" class="h-full w-full object-cover" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
          <div class="hidden absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
            <span class="text-6xl font-semibold text-slate-500 dark:text-slate-400">${placeholderInitials}</span>
          </div>
          <div class="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-sm">Up Next</div>
        </div>
        <div class="flex flex-col justify-center p-6 lg:p-8">
          <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-4 w-4 flex-shrink-0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              ${dateLabel}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-4 w-4 flex-shrink-0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              11:00–11:50
            </span>
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-4 w-4 flex-shrink-0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Lecture Hall B
            </span>
          </div>
          <h3 class="mt-4 font-serif text-2xl font-semibold text-ink dark:text-white">${speakerName}</h3>
          ${speakerAffil ? `<p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">${speakerAffil}</p>` : ''}
          ${titleText ? `<p class="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">${titleText}</p>` : ''}
          ${tags ? `<p class="mt-3 text-sm text-slate-500 dark:text-slate-400">${tags}</p>` : ''}
          ${abstractText ? `<p class="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">${abstractText}</p>` : ''}
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a href="#week-1" class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700">
              View details
            </a>
            <a href="${zoomLink}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-medium text-white shadow-md shadow-slate-900/10 transition hover:bg-slate-800">
              Join on Zoom
              <svg class="h-4 w-4 flex-shrink-0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function highlightCurrentWeek() {
    const currentSession = getFeaturedSession();
    if (!currentSession) return;

    currentSession.classList.add('current-week');
    const badge = currentSession.querySelector('.week-badge');
    if (badge) {
      const dateAttr = currentSession.getAttribute('data-date') || '';
      const sessionDate = dateAttr ? new Date(dateAttr + 'T00:00:00') : null;
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const label = sessionDate && sessionDate > now ? 'Up Next' : 'This Week';
      badge.textContent = `${badge.textContent.split('·')[0].trim()} · ${label}`;
    }

    renderFeaturedPanel(currentSession);
  }

  highlightCurrentWeek();

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Active nav link on scroll ----------
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function onScroll() {
    const scrollPos = window.scrollY + 120;
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop;
      if (scrollPos >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('text-accent');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-accent');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
