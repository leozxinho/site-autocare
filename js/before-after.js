/* before-after.js — slider drag reutilizável */

export function initBeforeAfter(root = document) {
  root.querySelectorAll('[data-ba]').forEach(wrap => {
    const handle = wrap.querySelector('.ba-handle');
    if (!handle) return;

    let pct = 50;

    function setPct(val) {
      pct = Math.max(2, Math.min(98, val));
      const p = `${pct}%`;
      wrap.style.setProperty('--ba', p);
    }

    function pctFromEvent(e) {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX ?? e.touches?.[0]?.clientX) - r.left;
      return (x / r.width) * 100;
    }

    // ── Pointer events (mouse + pen + touch) ────────────────
    let active = false;

    wrap.addEventListener('pointerdown', e => {
      // Só ativa se o toque começar sobre o handle ou perto da linha
      active = true;
      wrap.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    });

    wrap.addEventListener('pointermove', e => {
      if (!active) return;
      setPct(pctFromEvent(e));
    }, { passive: false });

    wrap.addEventListener('pointerup',     () => { active = false; });
    wrap.addEventListener('pointercancel', () => { active = false; });

    // ── Teclado ──────────────────────────────────────────────
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-valuenow', pct);
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.setAttribute('aria-label', 'Comparar antes e depois');

    handle.addEventListener('keydown', e => {
      const delta = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowRight') { setPct(pct + delta); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { setPct(pct - delta); e.preventDefault(); }
      handle.setAttribute('aria-valuenow', Math.round(pct));
    });

    // Init
    setPct(50);
  });
}
