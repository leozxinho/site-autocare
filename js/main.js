/* main.js — inicialização global: header, reveal, tema, ação, giroscópio */

// ── Header stuck ──────────────────────────────────────────────
const hdr = document.getElementById('hdr');
function updateHeader() {
  hdr?.classList.toggle('stuck', window.scrollY > 40);
  const tt = document.getElementById('totop');
  tt?.classList.toggle('show', window.scrollY > 500);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

document.getElementById('totop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Smooth scroll com offset de header ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = hdr ? hdr.offsetHeight + 12 : 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Scroll reveal ──────────────────────────────────────────────
const revIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      revIO.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.rev').forEach(el => revIO.observe(el));

// ── Timeline acende no scroll ──────────────────────────────────
const tlIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('lit');
      tlIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.tl-item').forEach(el => tlIO.observe(el));

// ── Tema claro/escuro ──────────────────────────────────────────
const themeBtn = document.getElementById('theme-btn');
const saved = localStorage.getItem('theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);
updateThemeIcon();

function updateThemeIcon() {
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  themeBtn?.querySelector('.icon-moon')?.style.setProperty('display', light ? 'none'  : '');
  themeBtn?.querySelector('.icon-sun' )?.style.setProperty('display', light ? ''      : 'none');
  themeBtn?.setAttribute('aria-label', light ? 'Modo escuro' : 'Modo claro');
}

themeBtn?.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', '');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
  updateThemeIcon();
});

// ── Mapa lazy ──────────────────────────────────────────────────
document.querySelectorAll('.map-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const wrap = btn.nextElementSibling;
    if (!wrap) return;
    const open = wrap.classList.toggle('open');
    if (open) {
      const iframe = wrap.querySelector('iframe[data-src]');
      if (iframe) {
        iframe.src = iframe.dataset.src;
        delete iframe.dataset.src;
      }
    }
    const tn = [...btn.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (tn) tn.textContent = open ? ' Fechar mapa' : ' Mostrar mapa';
  });
});

// ── Pausa animações / vídeo quando aba oculta ──────────────────
document.addEventListener('visibilitychange', () => {
  const paused = document.hidden;
  document.querySelectorAll('video').forEach(v => {
    paused ? v.pause() : v.play().catch(() => {});
  });
});

// ── Reflexo especular via giroscópio (Android) ──────────────────
// e via mouse (desktop)
(function initSpecular() {
  const cards = document.querySelectorAll('.sv-card, .why-strip, .rv-card');
  if (!cards.length) return;

  // Mouse (desktop)
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 24;
      const y = ((e.clientY - r.top ) / r.height - .5) * 18;
      card.style.setProperty('--rx', `${y}deg`);
      card.style.setProperty('--ry', `${-x}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });

  // Giroscópio (Android — só escuta, não pede permissão)
  if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', e => {
      const beta  = Math.max(-20, Math.min(20, e.beta  ?? 0));
      const gamma = Math.max(-20, Math.min(20, e.gamma ?? 0));
      cards.forEach(card => {
        card.style.setProperty('--rx', `${beta * .4}deg`);
        card.style.setProperty('--ry', `${gamma * .4}deg`);
      });
    }, { passive: true });
  }
})();

// ── IntersectionObserver: pausa vídeos fora da tela ───────────
const vidIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const v = e.target.querySelector('video');
    if (!v) return;
    e.isIntersecting ? v.play().catch(() => {}) : v.pause();
  });
}, { threshold: 0.1 });

document.querySelectorAll('.hero').forEach(el => vidIO.observe(el));
