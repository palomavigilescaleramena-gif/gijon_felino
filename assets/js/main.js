// ==========================================================================
// main.js · scroll suave, anclas, menú móvil y cabecera
// ==========================================================================
gsap.registerPlugin(ScrollTrigger);

const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll suave conectado a GSAP (no se activa si la persona pide menos movimiento)
let lenis = null;
if (!reducir) {
  lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Anclas internas con scroll suave
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const destino = document.querySelector(a.getAttribute('href'));
    if (!destino) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(destino, { offset: -80 }) : destino.scrollIntoView();
  });
});

// Menú móvil accesible
const boton = document.querySelector('.menu-boton');
const menu = document.getElementById('menu');
if (boton && menu) {
  const cerrar = () => {
    boton.setAttribute('aria-expanded', 'false');
    boton.textContent = 'Menú';
    menu.classList.remove('abierto');
    lenis?.start();
  };
  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    if (abierto) return cerrar();
    boton.setAttribute('aria-expanded', 'true');
    boton.textContent = 'Cerrar';
    menu.classList.add('abierto');
    lenis?.stop();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
}

// Cabecera: transparente sobre la noche del héroe, sólida al bajar
const cabecera = document.querySelector('.cabecera');
const hero = document.querySelector('.hero');
if (cabecera) {
  const pintarCabecera = () => {
    const y = window.scrollY;
    cabecera.classList.toggle('bajando', y > 40);
    cabecera.classList.toggle('solida', y > (hero ? hero.offsetHeight - 80 : 10));
  };
  pintarCabecera();
  window.addEventListener('scroll', pintarCabecera, { passive: true });
}

// Recalcular posiciones cuando cargan fuentes e imágenes
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
