// Interacción del portafolio: trazador de rumbo, cámara que sigue al scroll, avances de video
// y la sala de video. El contenido ya está en el HTML; esto solo lo hace andar.
import { PROYECTOS, OTROS, HABILIDADES } from './datos.js';

const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ahorro = navigator.connection?.saveData === true;
const $ = (s, raiz = document) => raiz.querySelector(s);
const $$ = (s, raiz = document) => [...raiz.querySelectorAll(s)];

const TODAS = [...PROYECTOS, ...OTROS];
let carta = null;
let poseActual = 'inicio';
let ladoActual = 'izq';

// ------------------------------------------------------------------ carta 3D
import('./carta3d.js')
  .then(({ iniciarCarta }) =>
    iniciarCarta({
      lienzo: $('#carta'),
      capa: $('#senales'),
      proyectos: PROYECTOS,
      otros: OTROS,
      reducido,
      alSenal: (def) => irADestino(def.destino),
    }),
  )
  .then((c) => {
    carta = c;
    carta.irA(poseActual, ladoActual);
    if (rumboPendiente) trazar(rumboPendiente.ids, rumboPendiente.nombre);
  })
  .catch((error) => {
    console.warn('La carta 3D no cargó; el portafolio sigue completo sin ella.', error);
    document.body.classList.add('sin-carta');
  });

function irADestino(selector) {
  const destino = $(selector);
  if (!destino) return;
  destino.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: selector.startsWith('#luz-') ? 'center' : 'start' });
  if (selector.startsWith('#luz-')) {
    destino.classList.add('en-rumbo');
    setTimeout(() => destino.classList.remove('en-rumbo'), 2400);
  }
}

// ------------------------------------------------------------------ poses al hacer scroll
const observadorPoses = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      poseActual = e.target.dataset.pose;
      ladoActual = e.target.dataset.lado || 'izq';
      carta?.irA(poseActual, ladoActual);
    }
  },
  { rootMargin: '-48% 0px -48% 0px' },
);
$$('[data-pose]').forEach((el) => observadorPoses.observe(el));

// Menú: marca la sección en la que estás.
const enlacesMenu = $$('.menu a');
const observadorMenu = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      // La lista de luces es parte de Proyectos; la portada y la Leyenda no tienen entrada en el menú.
      const id = e.target.id === 'mas-proyectos' ? 'proyectos' : e.target.id;
      enlacesMenu.forEach((a) => {
        if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
  },
  { rootMargin: '-40% 0px -55% 0px' },
);
['inicio', 'proyectos', 'mas-proyectos', 'experiencia', 'certificados', 'habilidades', 'contacto'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) observadorMenu.observe(el);
});

// ------------------------------------------------------------------ trazador de rumbo
const normalizar = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

const fichas = $('#fichas');
const salida = $('#trazador-salida');
const campo = $('#rumbo-libre');
let rumboPendiente = null;
let habilidadActiva = null;

for (const h of HABILIDADES.filter((h) => h.ficha)) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'ficha-habilidad';
  b.textContent = h.nombre;
  b.dataset.h = h.id;
  b.setAttribute('aria-pressed', 'false');
  b.addEventListener('click', () => {
    if (habilidadActiva === h.id) limpiarRumbo();
    else trazarHabilidad(h.id);
  });
  fichas.append(b);
}

/** Busca las habilidades que nombra un texto libre, por palabra o por frase. */
function habilidadesDe(texto) {
  const t = normalizar(texto);
  if (!t) return [];
  const palabras = t.split(/[\s,;/+]+/).filter(Boolean);
  return HABILIDADES.filter((h) =>
    h.claves.some((c) => {
      const clave = normalizar(c);
      return clave.includes(' ') ? t.includes(clave) : palabras.includes(clave);
    }),
  ).map((h) => h.id);
}

function trazarHabilidad(id) {
  const h = HABILIDADES.find((x) => x.id === id);
  const ids = TODAS.filter((p) => p.habilidades.includes(id))
    .sort((a, b) => a.fecha - b.fecha)
    .map((p) => p.id);
  habilidadActiva = id;
  marcarFichas(id);
  trazar(ids, h.nombre);
}

function marcarFichas(id) {
  $$('.ficha-habilidad').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.h === id)));
  $$('.leyenda-boton').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.h === id)));
}

function trazar(ids, nombre) {
  if (!carta) {
    rumboPendiente = { ids, nombre };
  } else {
    carta.trazarRumbo(ids);
  }
  $$('.luces tbody tr').forEach((tr) => tr.classList.toggle('en-rumbo', ids.includes(tr.dataset.luz)));

  salida.replaceChildren();
  const encabezado = document.createElement('span');
  encabezado.innerHTML = `Rumbo <b></b> · ${ids.length} ${ids.length === 1 ? 'luz' : 'luces'}: `;
  encabezado.querySelector('b').textContent = nombre;
  salida.append(encabezado);
  ids.forEach((id, i) => {
    const def = TODAS.find((p) => p.id === id);
    const a = document.createElement('a');
    a.href = def.destino;
    a.textContent = def.nombre;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      irADestino(def.destino);
    });
    salida.append(a);
    if (i < ids.length - 1) salida.append(' → ');
  });
}

function limpiarRumbo() {
  habilidadActiva = null;
  rumboPendiente = null;
  marcarFichas(null);
  carta?.borrarRumbo();
  carta?.irA(poseActual, ladoActual);
  $$('.luces tbody tr').forEach((tr) => tr.classList.remove('en-rumbo'));
  salida.replaceChildren();
}

$('#trazador').addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = campo.value;
  if (!texto.trim()) {
    limpiarRumbo();
    return;
  }
  const encontradas = habilidadesDe(texto);
  if (!encontradas.length) {
    habilidadActiva = null;
    marcarFichas(null);
    carta?.borrarRumbo();
    salida.textContent = `No encontré «${texto.trim()}» en la carta. Prueba con React, IA, Expo o Supabase.`;
    return;
  }
  // Si nombra varias, el rumbo pasa por los proyectos que las tienen todas; si ninguno, por los que tienen alguna.
  let ids = TODAS.filter((p) => encontradas.every((h) => p.habilidades.includes(h)));
  if (!ids.length) ids = TODAS.filter((p) => encontradas.some((h) => p.habilidades.includes(h)));
  ids = ids.sort((a, b) => a.fecha - b.fecha).map((p) => p.id);
  habilidadActiva = encontradas.length === 1 ? encontradas[0] : null;
  marcarFichas(habilidadActiva);
  trazar(ids, encontradas.map((id) => HABILIDADES.find((h) => h.id === id).nombre).join(' + '));
});

// La leyenda también traza rumbos.
for (const li of $$('#leyenda li[data-h]')) {
  const id = li.dataset.h;
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'leyenda-boton';
  b.dataset.h = id;
  b.setAttribute('aria-pressed', 'false');
  b.innerHTML = `<span></span><svg aria-hidden="true"><use href="#i-rumbo" /></svg>`;
  b.querySelector('span').textContent = li.textContent;
  b.setAttribute('aria-label', `${li.textContent}: trazar su rumbo en la carta`);
  b.addEventListener('click', () => {
    if (habilidadActiva === id) limpiarRumbo();
    else trazarHabilidad(id);
  });
  li.replaceChildren(b);
}

// ------------------------------------------------------------------ avances de video
// Cada plano muestra un avance mudo en bucle mientras está a la vista, como una pantalla de demostración.
const avances = $$('.avance');
const observadorVideo = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      const video = e.target;
      if (e.isIntersecting && !cineAbierto()) {
        if (!video.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  },
  { threshold: 0.45 },
);
if (!reducido && !ahorro) avances.forEach((v) => observadorVideo.observe(v));
avances.forEach((video) => {
  const barra = video.closest('.inserto')?.querySelector('.escala');
  video.addEventListener('timeupdate', () => {
    if (video.duration) barra?.style.setProperty('--avance', String(video.currentTime / video.duration));
  });
});

// ------------------------------------------------------------------ sala de video
const cine = $('#cine');
const cineVideo = $('#cine-video');
const botonPlay = $('#cine-play');
const botonGrande = $('#cine-grande');
const botonSonido = $('#cine-sonido');
const escala = $('#cine-escala');
const avance = $('#cine-avance');
const tiempo = $('#cine-tiempo');
let origen = null;

const cineAbierto = () => cine.open;
const reloj = (s) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};
const usar = (boton, icono, etiqueta) => {
  boton.querySelector('use').setAttribute('href', icono);
  boton.setAttribute('aria-label', etiqueta);
};

// El plano ampliado crece desde el video de su plano de detalle y vuelve a él al cerrarse.
const pantalla = $('.cine-pantalla');
const marcoCine = $('.cine-marco');
const SALIDA = 'cubic-bezier(0.23, 1, 0.32, 1)';

function desdeElPlano() {
  const caja = origen?.closest('.inserto-video')?.getBoundingClientRect();
  const destino = pantalla.getBoundingClientRect();
  if (!caja || !destino.width || caja.bottom < 0 || caja.top > innerHeight) return null;
  return `translate(${caja.left - destino.left}px, ${caja.top - destino.top}px) scale(${caja.width / destino.width}, ${caja.height / destino.height})`;
}

function abrirCine(boton) {
  origen = boton;
  const id = boton.dataset.video;
  $('#cine-titulo').textContent = boton.dataset.titulo;
  cineVideo.poster = `assets/img/${id}.jpg`;
  cineVideo.src = `assets/video/${id}.mp4`;
  cineVideo.muted = false;
  usar(botonSonido, '#i-sonido', 'Silenciar');
  avances.forEach((v) => v.pause());
  cine.showModal();
  if (!reducido) {
    const desde = desdeElPlano();
    if (desde) {
      pantalla.animate([{ transformOrigin: '0 0', transform: desde }, { transformOrigin: '0 0', transform: 'none' }], { duration: 560, easing: SALIDA });
      marcoCine.animate([{ backgroundColor: 'rgba(248,249,247,0)', borderColor: 'transparent', outlineColor: 'transparent' }, { offset: 0.45, backgroundColor: 'rgba(248,249,247,0)', borderColor: 'transparent', outlineColor: 'transparent' }, {}], { duration: 560, easing: 'ease-out' });
      $$('.cine-cabeza, .cine-controles, .cine-nota').forEach((el) => el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 0, offset: 0.4 }, { opacity: 1, transform: 'none' }], { duration: 620, easing: SALIDA }));
    } else {
      marcoCine.animate([{ opacity: 0, transform: 'translateY(16px) scale(0.97)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: SALIDA });
    }
  }
  cineVideo.play().catch(() => {
    botonGrande.hidden = false;
  });
}

let cerrando = false;
async function cerrarCine() {
  if (!cine.open || cerrando) return;
  cerrando = true;
  cineVideo.pause();
  const hacia = reducido ? null : desdeElPlano();
  if (hacia) {
    $$('.cine-cabeza, .cine-controles, .cine-nota').forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' }));
    marcoCine.animate([{}, { backgroundColor: 'rgba(248,249,247,0)', borderColor: 'transparent', outlineColor: 'transparent' }], { duration: 220, fill: 'forwards' });
    await pantalla.animate([{ transformOrigin: '0 0', transform: 'none' }, { transformOrigin: '0 0', transform: hacia }], { duration: 380, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', fill: 'forwards' }).finished.catch(() => {});
  }
  cine.close();
  [pantalla, marcoCine, ...$$('.cine-cabeza, .cine-controles, .cine-nota')].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
  cineVideo.removeAttribute('src');
  cineVideo.load();
  cerrando = false;
}

// Escape también cierra con la animación de regreso.
cine.addEventListener('cancel', (e) => {
  e.preventDefault();
  cerrarCine();
});

cine.addEventListener('close', () => {
  cineVideo.pause();
  origen?.focus({ preventScroll: true });
  avances.forEach((v) => {
    if (v.src && v.getBoundingClientRect().top < innerHeight && v.getBoundingClientRect().bottom > 0) v.play().catch(() => {});
  });
});

$$('.ver-video').forEach((b) => b.addEventListener('click', () => abrirCine(b)));
$('#cine-cerrar').addEventListener('click', cerrarCine);
cine.addEventListener('click', (e) => {
  if (e.target === cine) cerrarCine();
});

const alternar = () => (cineVideo.paused ? cineVideo.play() : cineVideo.pause());
botonPlay.addEventListener('click', alternar);
botonGrande.addEventListener('click', () => cineVideo.play());
cineVideo.addEventListener('click', alternar);
cineVideo.addEventListener('play', () => {
  botonGrande.hidden = true;
  usar(botonPlay, '#i-pausa', 'Pausar');
});
cineVideo.addEventListener('pause', () => {
  usar(botonPlay, '#i-play', 'Reproducir');
  if (!cineVideo.ended && cineVideo.currentTime < 0.2) botonGrande.hidden = false;
});
cineVideo.addEventListener('ended', () => {
  botonGrande.hidden = false;
  usar(botonPlay, '#i-play', 'Reproducir de nuevo');
});

function pintarAvance() {
  const d = cineVideo.duration || 0;
  const p = d ? cineVideo.currentTime / d : 0;
  avance.style.transform = `scaleX(${p})`;
  tiempo.textContent = `${reloj(cineVideo.currentTime)} / ${reloj(d)}`;
  escala.setAttribute('aria-valuenow', String(Math.round(p * 100)));
  escala.setAttribute('aria-valuetext', `${reloj(cineVideo.currentTime)} de ${reloj(d)}`);
}
cineVideo.addEventListener('timeupdate', pintarAvance);
cineVideo.addEventListener('loadedmetadata', pintarAvance);

function buscar(clientX) {
  const r = escala.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
  if (cineVideo.duration) cineVideo.currentTime = p * cineVideo.duration;
  pintarAvance();
}
escala.addEventListener('pointerdown', (e) => {
  escala.setPointerCapture(e.pointerId);
  buscar(e.clientX);
  const mover = (ev) => buscar(ev.clientX);
  const soltar = () => {
    escala.removeEventListener('pointermove', mover);
    escala.removeEventListener('pointerup', soltar);
  };
  escala.addEventListener('pointermove', mover);
  escala.addEventListener('pointerup', soltar);
});
escala.addEventListener('keydown', (e) => {
  const paso = e.shiftKey ? 15 : 5;
  if (e.key === 'ArrowRight') cineVideo.currentTime = Math.min(cineVideo.duration || 0, cineVideo.currentTime + paso);
  else if (e.key === 'ArrowLeft') cineVideo.currentTime = Math.max(0, cineVideo.currentTime - paso);
  else if (e.key === 'Home') cineVideo.currentTime = 0;
  else if (e.key === 'End') cineVideo.currentTime = cineVideo.duration || 0;
  else return;
  e.preventDefault();
  pintarAvance();
});

botonSonido.addEventListener('click', () => {
  cineVideo.muted = !cineVideo.muted;
  usar(botonSonido, cineVideo.muted ? '#i-mudo' : '#i-sonido', cineVideo.muted ? 'Activar el sonido' : 'Silenciar');
});

$('#cine-completa').addEventListener('click', () => {
  const pantalla = $('.cine-pantalla');
  if (document.fullscreenElement) document.exitFullscreen();
  else if (pantalla.requestFullscreen) pantalla.requestFullscreen();
  else if (cineVideo.webkitEnterFullscreen) cineVideo.webkitEnterFullscreen();
});

cine.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLButtonElement || e.target === escala) {
    if (e.key !== 'k') return;
  }
  if (e.key === ' ' || e.key === 'k') {
    e.preventDefault();
    alternar();
  } else if (e.key === 'm') {
    botonSonido.click();
  } else if (e.key === 'f') {
    $('#cine-completa').click();
  }
});

// ------------------------------------------------------------------ copiar el correo
const copiar = $('#copiar-correo');
copiar?.addEventListener('click', async () => {
  const etiqueta = copiar.querySelector('span');
  try {
    await navigator.clipboard.writeText(copiar.dataset.correo);
    etiqueta.textContent = 'Correo copiado';
  } catch {
    etiqueta.textContent = copiar.dataset.correo;
  }
  setTimeout(() => (etiqueta.textContent = 'Copiar el correo'), 2400);
});
