/* hero-polish.js — faixa de luz que revela hero-depois */

export function initHeroPolish() {
  const after = document.querySelector('.hero-img-after');
  const hint  = document.querySelector('.hero-polish-hint');
  if (!after) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let interacted = false;

  // Atualiza a variável CSS --polish (0% a 130%)
  function setPolish(pct) {
    after.style.setProperty('--polish', `${pct}%`);
  }

  // Esconde dica após interação
  function onInteract() {
    if (!interacted) {
      interacted = true;
      hint?.classList.add('hidden');
    }
  }

  // ── Desktop: mouse ──────────────────────────────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      onInteract();
      const r   = hero.getBoundingClientRect();
      const pct = ((e.clientX - r.left) / r.width) * 130;
      setPolish(pct);
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      if (interacted) setPolish(130);
    });
  }

  // ── Mobile: touch ───────────────────────────────────────────
  let touching = false;
  document.addEventListener('touchmove', e => {
    if (!hero?.contains(e.target)) return;
    onInteract();
    touching = true;
    const touch = e.touches[0];
    const r     = hero.getBoundingClientRect();
    const pct   = ((touch.clientX - r.left) / r.width) * 130;
    setPolish(Math.max(0, Math.min(130, pct)));
  }, { passive: true });

  document.addEventListener('touchend', () => { touching = false; }, { passive: true });

  // ── Auto-varredura (1x ao carregar, sem interação) ──────────
  if (!reduced) {
    setTimeout(() => {
      if (!interacted) autoSweep();
    }, 2000);
  }

  function autoSweep() {
    const duration = 2800;
    const start    = performance.now();
    setPolish(-20);

    function step(now) {
      if (interacted) return;
      const t   = Math.min((now - start) / duration, 1);
      const ease = t < .5 ? 2*t*t : -1+(4-2*t)*t; // ease in-out
      const pct  = -20 + ease * 155;
      setPolish(pct);
      if (t < 1) requestAnimationFrame(step);
      else setPolish(135);
    }
    requestAnimationFrame(step);
  }

  // ── Vídeo de fundo (carrega se conexão não for lenta) ───────
  const video = document.querySelector('.hero-video');
  if (video) {
    const conn = navigator.connection;
    const slow = conn && (conn.saveData || ['slow-2g','2g'].includes(conn.effectiveType));
    if (!slow) {
      const src = video.dataset.src;
      if (src) {
        video.src = src;
        video.load();
        video.addEventListener('canplaythrough', () => {
          video.classList.add('active');
        }, { once: true });
      }
    }
  }
}
