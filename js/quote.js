/* quote.js — formulário "orçamento em 3 toques" → WhatsApp */

export function initQuote() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const WA = '5514997024535';
  let step = 0;
  let state = { type: '', model: '', services: [], period: '' };

  const panels   = form.querySelectorAll('.quote-panel');
  const stepDots = form.querySelectorAll('.q-step');

  function showStep(n) {
    step = n;
    panels.forEach((p, i) => p.classList.toggle('active', i === n));
    stepDots.forEach((s, i) => {
      s.classList.toggle('active', i === n);
      s.classList.toggle('done', i < n);
    });
  }

  // ── Etapa 0: tipo de veículo + modelo ─────────────────────
  form.querySelectorAll('[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      form.querySelectorAll('[data-type]').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      state.type = btn.dataset.type;
    });
  });

  form.querySelector('#q-model')?.addEventListener('input', e => {
    state.model = e.target.value.trim();
  });

  // ── Etapa 1: serviços ─────────────────────────────────────
  form.querySelectorAll('[data-svc]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('sel');
      const svc = btn.dataset.svc;
      const idx = state.services.indexOf(svc);
      idx === -1 ? state.services.push(svc) : state.services.splice(idx, 1);
    });
  });

  // ── Etapa 2: período ─────────────────────────────────────
  form.querySelectorAll('[data-period]').forEach(btn => {
    btn.addEventListener('click', () => {
      form.querySelectorAll('[data-period]').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      state.period = btn.dataset.period;
    });
  });

  // ── Navegação ──────────────────────────────────────────────
  form.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (step === 0) {
        if (!state.type) { showToast('Escolha carro ou moto.'); return; }
        if (!state.model) { showToast('Informe o modelo do veículo.'); return; }
      }
      if (step === 1) {
        if (!state.services.length) { showToast('Selecione ao menos um serviço.'); return; }
      }
      if (step < panels.length - 1) showStep(step + 1);
    });
  });

  form.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => { if (step > 0) showStep(step - 1); });
  });

  // ── Envio → WhatsApp ──────────────────────────────────────
  form.querySelector('[data-submit]')?.addEventListener('click', () => {
    if (!state.period) { showToast('Escolha um período.'); return; }

    const lines = [
      `Olá! Gostaria de um orçamento na MB Garagem Automotiva.`,
      ``,
      `🚗 Veículo: ${state.type} — ${state.model}`,
      `🔧 Serviços: ${state.services.join(', ')}`,
      `📅 Período: ${state.period}`,
    ];
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WA}?text=${text}`, '_blank', 'noopener');
  });

  showStep(0);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'q-toast';
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
    background:var(--red);color:#fff;padding:10px 20px;border-radius:8px;
    font-size:13px;font-weight:600;z-index:999;white-space:nowrap;
    animation:q-toast-in .25s ease;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}
