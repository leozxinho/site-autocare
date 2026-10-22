/* intro.js — animação LED DRL + guard sessionStorage */

export function initIntro() {
  // Uma vez por sessão
  if (sessionStorage.getItem('mb-intro-done')) {
    document.getElementById('intro')?.remove();
    return;
  }

  // Respeita prefers-reduced-motion
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    finishIntro(0);
    return;
  }

  const intro    = document.getElementById('intro');
  const skip     = document.getElementById('intro-skip');
  const leds1    = intro?.querySelectorAll('.intro-leds:first-of-type');
  const leds2    = intro?.querySelector('.intro-leds-2');
  const logoEl   = intro?.querySelector('.intro-logo');

  if (!intro) return;

  // Dispara a animação depois de um frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Acende LEDs
      intro.querySelectorAll('.intro-leds').forEach(row => {
        row.classList.add('light');
      });

      // Logo aparece depois
      setTimeout(() => {
        logoEl?.classList.add('show');
      }, 450);

      // Fecha automaticamente em 1.5s total
      setTimeout(() => finishIntro(550), 1500);
    });
  });

  skip?.addEventListener('click', () => finishIntro(0));

  function finishIntro(delay) {
    setTimeout(() => {
      intro.classList.add('done');
      sessionStorage.setItem('mb-intro-done', '1');
      // Remove do DOM depois da transição
      setTimeout(() => intro.remove(), 700);
    }, delay);
  }
}
