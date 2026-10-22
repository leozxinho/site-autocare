/* car-map.js — hotspots, gaveta (bottom sheet) e seletor carro/moto */

const WA = '5514997024535';

const SERVICES = [
  {
    id: 1, slug: 'restauracao-farol',
    name: 'Restauração de farol',
    desc: 'Recuperação da transparência e brilho dos faróis desgastados, devolvendo clareza à iluminação.',
    waText: 'Olá! Orçamento para Restauração de farol.',
    vehicles: ['car','moto'],
  },
  {
    id: 2, slug: 'troca-farol',
    name: 'Troca de farol',
    desc: 'Substituição de faróis danificados ou oxidados com ajuste correto para carro e moto.',
    waText: 'Olá! Orçamento para Troca de farol.',
    vehicles: ['car','moto'],
  },
  {
    id: 3, slug: 'para-choque',
    name: 'Para-choque',
    desc: 'Troca e reparo de para-choque dianteiro ou traseiro para recuperar a aparência do veículo.',
    waText: 'Olá! Orçamento para Para-choque.',
    vehicles: ['car'],
  },
  {
    id: 4, slug: 'retrovisor',
    name: 'Retrovisor',
    desc: 'Troca e ajuste de retrovisor externo para garantir segurança e visibilidade.',
    waText: 'Olá! Orçamento para Retrovisor.',
    vehicles: ['car','moto'],
  },
  {
    id: 5, slug: 'fechadura',
    name: 'Fechadura',
    desc: 'Reparo e manutenção de fechaduras e travas do veículo, internas e externas.',
    waText: 'Olá! Orçamento para Fechadura.',
    vehicles: ['car'],
  },
  {
    id: 6, slug: 'vidro-eletrico',
    name: 'Vidro elétrico',
    desc: 'Manutenção da máquina de vidro elétrico ou manual, devolvendo o funcionamento correto.',
    waText: 'Olá! Orçamento para Vidro elétrico.',
    vehicles: ['car'],
  },
  {
    id: 7, slug: 'macaneta',
    name: 'Maçaneta',
    desc: 'Troca e reparo de maçanetas internas e externas, originais ou similares.',
    waText: 'Olá! Orçamento para Maçaneta.',
    vehicles: ['car'],
  },
  {
    id: 8, slug: 'iluminacao',
    name: 'Iluminação',
    desc: 'Manutenção e reparo completo do sistema de iluminação: faróis, lanternas e luzes auxiliares.',
    waText: 'Olá! Orçamento para Iluminação.',
    vehicles: ['car','moto'],
  },
  {
    id: 9, slug: 'polimento',
    name: 'Polimento',
    desc: 'Polimento técnico para corrigir riscos, oxidação e revitalizar a pintura do veículo.',
    waText: 'Olá! Orçamento para Polimento.',
    vehicles: ['car','moto'],
  },
  {
    id: 10, slug: 'lavagem-banco',
    name: 'Lavagem de banco',
    desc: 'Lavagem e limpeza profunda dos bancos em tecido ou couro, eliminando manchas e odores.',
    waText: 'Olá! Orçamento para Lavagem de banco.',
    vehicles: ['car'],
  },
  {
    id: 11, slug: 'higienizacao-interna',
    name: 'Higienização interna',
    desc: 'Higienização interna completa — painel, carpetes, teto e todos os revestimentos — com atenção a cada detalhe.',
    waText: 'Olá! Orçamento para Higienização interna.',
    vehicles: ['car'],
  },
];

// Hotspots para CARRO — % do viewBox 800×300
const HOTSPOTS = [
  { label: 'Farol e iluminação dianteira', svcs: [1,2,8],   x: 10,  y: 76 },
  { label: 'Para-choque',                  svcs: [3],        x: 7,   y: 85 },
  { label: 'Retrovisor',                   svcs: [4],        x: 23,  y: 44 },
  { label: 'Fechadura e maçaneta',         svcs: [5,7],      x: 43,  y: 66 },
  { label: 'Vidro elétrico',               svcs: [6],        x: 55,  y: 36 },
  { label: 'Polimento e pintura',          svcs: [9],        x: 47,  y: 22 },
  { label: 'Interior do veículo',          svcs: [10,11],    x: 56,  y: 45 },
  { label: 'Farol traseiro',               svcs: [8],        x: 90,  y: 76 },
];

// Hotspots para MOTO — % do viewBox 800×300 da moto SVG
const MOTO_HOTSPOTS = [
  { label: 'Farol dianteiro',     svcs: [1, 2, 8], x: 17, y: 70 },
  { label: 'Retrovisor',          svcs: [4],        x: 30, y: 32 },
  { label: 'Polimento e pintura', svcs: [9],        x: 50, y: 42 },
  { label: 'Farol traseiro',      svcs: [8],        x: 83, y: 62 },
];

export function initCarMap() {
  const section    = document.getElementById('servicos');
  if (!section) return;

  const hotspots   = section.querySelector('.car-hotspots');
  const carMapWrap = section.querySelector('.car-map-wrap');
  const overlay    = document.getElementById('sheet-overlay');
  const sheet      = document.getElementById('sheet');
  const vtBtns     = section.querySelectorAll('.vt-btn');

  let currentVehicle = 'car';
  let currentSvcs    = [];

  // ── Seletor carro / moto ─────────────────────────────────
  vtBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vtBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentVehicle = btn.dataset.vehicle;
      carMapWrap?.classList.toggle('show-moto', currentVehicle === 'moto');
      renderHotspots();
      renderChips();
    });
  });

  // ── Renderiza hotspots ────────────────────────────────────
  function renderHotspots() {
    if (!hotspots) return;
    hotspots.innerHTML = '';
    const hsData = currentVehicle === 'moto' ? MOTO_HOTSPOTS : HOTSPOTS;
    hsData.forEach(hs => {
      // Filtra pelos serviços do veículo atual
      const applicable = hs.svcs.filter(id => {
        const svc = SERVICES.find(s => s.id === id);
        return svc?.vehicles.includes(currentVehicle);
      });
      if (!applicable.length) return;

      const btn = document.createElement('button');
      btn.className = 'hs-btn';
      btn.style.left = `${hs.x}%`;
      btn.style.top  = `${hs.y}%`;
      btn.setAttribute('aria-label', hs.label);
      btn.setAttribute('type', 'button');
      btn.innerHTML = '<span class="hs-pulse" aria-hidden="true"></span>';

      btn.addEventListener('click', () => {
        navigator.vibrate?.(10);
        openSheet(applicable);
      });
      hotspots.appendChild(btn);
    });
  }

  // ── Renderiza fileira de chips ────────────────────────────
  function renderChips() {
    const row = section.querySelector('.sv-row');
    if (!row) return;
    row.innerHTML = '';
    const visible = SERVICES.filter(s => s.vehicles.includes(currentVehicle));
    visible.forEach(svc => {
      const chip = document.createElement('button');
      chip.className = 'sv-chip';
      chip.setAttribute('type', 'button');
      chip.setAttribute('aria-label', `Ver serviço: ${svc.name}`);
      chip.innerHTML = `
        <span class="sv-chip-num mono">${String(svc.id).padStart(2,'0')}</span>
        <span class="sv-chip-name">${svc.name}</span>
      `;
      chip.addEventListener('click', () => {
        navigator.vibrate?.(10);
        openSheet([svc.id]);
      });
      row.appendChild(chip);
    });
  }

  // ── Gaveta (bottom sheet) ─────────────────────────────────
  function openSheet(svcIds) {
    currentSvcs = svcIds;
    // Se múltiplos serviços no hotspot, abre o primeiro
    const svc = SERVICES.find(s => s.id === svcIds[0]);
    if (!svc || !sheet || !overlay) return;

    renderSheetContent(svc, svcIds);

    overlay.classList.add('open');
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    sheet.querySelector('.sheet-close')?.focus();
    trapFocus(sheet);
    document.body.style.overflow = 'hidden';
  }

  function closeSheet() {
    overlay?.classList.remove('open');
    sheet?.classList.remove('open');
    sheet?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    releaseFocus();
  }

  function renderSheetContent(svc, ids) {
    if (!sheet) return;

    // Se múltiplos serviços, lista todos
    const nameHTML = ids.length > 1
      ? ids.map(id => SERVICES.find(s => s.id===id)?.name).filter(Boolean).join(' + ')
      : svc.name;

    // Antes/depois (tenta servicos/NN-slug-antes.jpg)
    const baHtml = ids.length === 1
      ? `<div class="sheet-ba ba-wrap" data-ba>
           <div class="ba-before"><img src="assets/img/servicos/${String(svc.id).padStart(2,'0')}-${svc.slug}-antes.jpg" alt="Antes: ${svc.name}" width="560" height="315" loading="lazy" onerror="this.closest('.sheet-ba').style.display='none'"></div>
           <div class="ba-after"><img src="assets/img/servicos/${String(svc.id).padStart(2,'0')}-${svc.slug}-depois.jpg" alt="Depois: ${svc.name}" width="560" height="315" loading="lazy" onerror="this.closest('.sheet-ba').style.display='none'"></div>
           <div class="ba-line"></div>
           <button class="ba-handle" aria-label="Arrastar para comparar">
             <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/><path d="M9 18l6-6-6-6" transform="translate(6,0)"/></svg>
           </button>
           <div class="ba-labels"><span class="ba-lbl-before">Antes</span><span class="ba-lbl-after">Depois</span></div>
         </div>`
      : '';

    // WA link (usa o do primeiro serviço)
    const waText = encodeURIComponent(svc.waText);

    sheet.querySelector('.sheet-num').textContent   = `#${String(svc.id).padStart(2,'0')}`;
    sheet.querySelector('.sheet-title').textContent = nameHTML;
    sheet.querySelector('.sheet-desc').textContent  = ids.length > 1
      ? ids.map(id => SERVICES.find(s=>s.id===id)?.desc).filter(Boolean).join(' ')
      : svc.desc;
    sheet.querySelector('.sheet-ba-slot').innerHTML = baHtml;
    sheet.querySelector('.sheet-wa').href           = `https://wa.me/${WA}?text=${waText}`;

    // Inicia slider BA
    import('./before-after.js').then(m => m.initBeforeAfter(sheet));
  }

  // ── Fechar gaveta ─────────────────────────────────────────
  overlay?.addEventListener('click', closeSheet);
  sheet?.querySelector('.sheet-close')?.addEventListener('click', closeSheet);

  // Arrastar para fechar
  let dragStart = 0;
  sheet?.querySelector('.sheet-drag')?.addEventListener('pointerdown', e => {
    dragStart = e.clientY;
    const onMove = ev => {
      const dy = ev.clientY - dragStart;
      if (dy > 0) sheet.style.transform = `translateY(${dy}px)`;
    };
    const onUp = ev => {
      const dy = ev.clientY - dragStart;
      sheet.style.transform = '';
      if (dy > 80) closeSheet();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup',   onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup',   onUp);
  });

  // Esc fecha
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sheet?.classList.contains('open')) closeSheet();
  });

  // ── Focus trap ────────────────────────────────────────────
  let prevFocus = null;
  function trapFocus(el) {
    prevFocus = document.activeElement;
    const focusable = el.querySelectorAll(
      'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    el._trapHandler = e => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    };
    el.addEventListener('keydown', el._trapHandler);
    first?.focus();
  }
  function releaseFocus() {
    sheet?.removeEventListener('keydown', sheet._trapHandler);
    prevFocus?.focus();
  }

  // ── Init ──────────────────────────────────────────────────
  renderHotspots();
  renderChips();
}
