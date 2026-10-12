/* shared across every theme — reads config.js, no game-specific edits needed */

document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  setFavicon();
  setupNav();
  setupCopy();
  setupReveal();
});

function loadConfig() {
  if (typeof SITE === 'undefined') return;

  if (SITE.colors) {
    Object.entries(SITE.colors).forEach(([key, val]) => {
      const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.setProperty(cssVar, val);
    });
  }

  const map = {
    serverName: SITE.serverName,
    gameName: SITE.gameName,
    tagline: SITE.tagline,
    serverIP: SITE.serverIP,
    serverVersion: SITE.serverVersion,
    playersOnline: SITE.stats?.playersOnline,
    playersCap: SITE.stats?.playersCap,
    uptime: SITE.stats?.uptime,
    foundedYear: SITE.stats?.foundedYear
  };
  Object.entries(map).forEach(([key, val]) => {
    if (val === undefined) return;
    document.querySelectorAll(`[data-site="${key}"]`).forEach(el => el.textContent = val);
  });

  if (SITE.links) {
    Object.entries(SITE.links).forEach(([key, url]) => {
      document.querySelectorAll(`[data-href="${key}"]`).forEach(el => el.href = url);
    });
  }
}

// favicon dot in the accent color, no image file needed
function setFavicon() {
  if (typeof SITE === 'undefined' || !SITE.colors) return;
  const color = SITE.colors.accentPrimary || '#5b8a3a';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='${color}'/></svg>`;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function setupNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('nav.links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('nav-open'));
}

function setupCopy() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.copy);
      const text = target?.textContent?.trim();
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'COPIED';
        setTimeout(() => btn.textContent = original, 1500);
      });
    });
  });
}

// fade/slide-in on scroll
function setupReveal() {
  const selector = '.section-head, .card, .gallery-frame, .staff-card, .plan-card, .rules-block, .badge';
  const els = Array.from(document.querySelectorAll(selector));
  if (!els.length) return;
  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 70 + 'ms';
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
}
