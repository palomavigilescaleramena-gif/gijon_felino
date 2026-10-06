// ==========================================================================
// animaciones.js · intensidad 2 (viva)
// Momentos memorables: 1) linterna del héroe  2) muro de retratos
// ==========================================================================
const mm = gsap.matchMedia();
const conRaton = window.matchMedia('(pointer: fine)').matches;

mm.add({
  escritorio: '(min-width: 992px) and (prefers-reduced-motion: no-preference)',
  movil: '(max-width: 991px) and (prefers-reduced-motion: no-preference)',
  reducir: '(prefers-reduced-motion: reduce)',
}, (ctx) => {
  const { escritorio, reducir } = ctx.conditions;
  if (reducir) { gsap.set('[data-reveal]', { opacity: 1 }); return; }

  // ---------- 1 · Linterna del héroe ----------
  const hero = document.querySelector('.hero');
  if (hero) {
    const luz = { x: hero.clientWidth * 0.7, y: hero.clientHeight * 0.32 };
    const pintar = () => {
      hero.style.setProperty('--x', `${luz.x}px`);
      hero.style.setProperty('--y', `${luz.y}px`);
    };
    const irX = gsap.quickTo(luz, 'x', { duration: 0.6, ease: 'power3', onUpdate: pintar });
    const irY = gsap.quickTo(luz, 'y', { duration: 0.6, ease: 'power3', onUpdate: pintar });

    // Mientras nadie la mueve, la linterna pasea sola por los ojos escondidos
    const pares = gsap.utils.toArray('.hero .par');
    const paseo = gsap.timeline({ repeat: -1, delay: 0.8 });
    gsap.utils.shuffle([...pares]).forEach((p) => {
      paseo.to(luz, {
        x: () => p.getBoundingClientRect().left - hero.getBoundingClientRect().left + p.clientWidth / 2,
        y: () => p.getBoundingClientRect().top - hero.getBoundingClientRect().top + p.clientHeight / 2,
        duration: 1.6, ease: 'power2.inOut', onUpdate: pintar,
      }).to({}, { duration: 0.7 });
    });

    let paseando = true;
    const seguir = (e) => {
      if (paseando) { paseo.pause(); paseando = false; }
      const r = hero.getBoundingClientRect();
      irX(e.clientX - r.left);
      irY(e.clientY - r.top);
    };
    hero.addEventListener('pointermove', seguir);
    hero.addEventListener('pointerdown', seguir);

    // Al bajar, la luz se abre hasta descubrirlos a todos
    gsap.fromTo(hero, { '--r': conRaton ? '150px' : '120px' }, {
      '--r': '160vmax', ease: 'power1.in',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });

    // Entrada del texto
    gsap.from('.hero .etiqueta, .hero .subtitulo, .hero .acciones, .hero .pista', {
      opacity: 0, y: 24, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.5,
    });

    ctx.add(() => () => paseo.kill());
  }

  // ---------- Titulares línea a línea ----------
  document.querySelectorAll('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    });
  });

  // ---------- 2 · Muro de retratos: se monta desde el centro y crece al bajar ----------
  const escena = document.querySelector('.muro-escena');
  if (escena) {
    const retratos = gsap.utils.toArray('.muro .retrato');
    gsap.from(retratos, {
      scale: 0, opacity: 0, duration: 1, ease: 'back.out(1.6)',
      stagger: { each: 0.06, from: 'center', grid: 'auto' },
      scrollTrigger: { trigger: escena, start: 'top 65%', once: true },
    });
    gsap.fromTo('.muro', { scale: escritorio ? 0.62 : 0.9 }, {
      scale: escritorio ? 1.12 : 1.05, ease: 'none',
      scrollTrigger: { trigger: escena, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from('.muro-texto', {
      y: 60, opacity: 0, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: escena, start: 'top 40%', once: true },
    });
  }

  // ---------- Entradas genéricas en lote ----------
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }),
    once: true,
  });

  // ---------- Cifras que cuentan (solo las que tienen dato real) ----------
  gsap.utils.toArray('[data-contar]').forEach((el) => {
    const fin = parseFloat(el.dataset.contar);
    if (!fin) return;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: fin, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('es-ES'); },
    });
  });
});

// ---------- Botones magnéticos (solo con ratón) ----------
if (conRaton && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.magnetico').forEach((b) => {
    const x = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3' });
    const y = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3' });
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.25);
      y((e.clientY - r.top - r.height / 2) * 0.25);
    });
    b.addEventListener('mouseleave', () => { x(0); y(0); });
  });
}
