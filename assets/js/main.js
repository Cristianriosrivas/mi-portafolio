// Interacción del portafolio: mapa de habilidades, filtro por habilidad, avances de video y la
// sala de video. El contenido ya está en el HTML; esto solo lo hace andar.
import { PROYECTOS, HABILIDADES } from './datos.js';

const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ahorro = navigator.connection?.saveData === true;
const $ = (s, raiz = document) => raiz.querySelector(s);
const $$ = (s, raiz = document) => [...raiz.querySelectorAll(s)];

// Qué palabras de la pila de cada proyecto corresponden a cada habilidad (para resaltarlas).
const PALABRAS = {
  react: ['React', 'React Native'],
  typescript: ['TypeScript'],
  ia: ['LangGraph', 'Gemini', 'Groq', 'RAG', 'Web Speech API'],
  movil: ['React Native', 'Expo', 'PWA'],
  nextjs: ['Next.js'],
  python: ['FastAPI', 'pytest'],
  supabase: ['Supabase', 'PostgreSQL'],
  vue: ['Vue 3'],
};

let grafo = null;
let filtro = null;

// ------------------------------------------------------------------ mapa de habilidades
import('./grafo3d.js')
  .then(({ iniciarGrafo }) => {
    grafo = iniciarGrafo({
      lienzo: $('#grafo'),
      contenedor: $('#mapa-lienzo'),
      capa: $('#mapa-etiquetas'),
      proyectos: PROYECTOS,
      habilidades: HABILIDADES,
      reducido,
      alElegirProyecto: (p) => irA(p.destino),
      alElegirHabilidad: (id) => filtrar(filtro === id ? null : id),
    });
    if (filtro) grafo.resaltarHabilidad(filtro);
  })
  .catch((error) => {
    console.warn('El mapa 3D no cargó; el portafolio sigue completo sin él.', error);
    $('#mapa-lienzo')?.classList.add('sin-3d');
  });

function irA(selector) {
  const destino = $(selector);
  destino?.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: selector.startsWith('#otro-') ? 'center' : 'start' });
}

// ------------------------------------------------------------------ filtro por habilidad
const fichas = $('#fichas');
const salida = $('#filtro-salida');
const TEXTO_INICIAL = salida.textContent;

for (const h of HABILIDADES.filter((h) => h.ficha)) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'ficha-habilidad';
  b.textContent = h.nombre;
  b.dataset.h = h.id;
  b.setAttribute('aria-pressed', 'false');
  b.addEventListener('click', () => filtrar(filtro === h.id ? null : h.id));
  fichas.append(b);
}

function filtrar(id) {
  filtro = id;
  grafo?.resaltarHabilidad(id);
  $$('.ficha-habilidad').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.h === id)));

  const usan = id ? PROYECTOS.filter((p) => p.habilidades.includes(id)).sort((a, b) => b.fecha - a.fecha) : [];
  const palabras = id ? PALABRAS[id] ?? [] : [];
  $$('.pila li').forEach((li) => li.classList.toggle('coincide', palabras.includes(li.textContent.trim())));

  salida.replaceChildren();
  if (!id) {
    salida.textContent = TEXTO_INICIAL;
    return;
  }
  const h = HABILIDADES.find((x) => x.id === id);
  const fuerte = document.createElement('strong');
  fuerte.textContent = h.nombre;
  salida.append(fuerte, ` aparece en ${usan.length} ${usan.length === 1 ? 'proyecto' : 'proyectos'}: `);
  usan.forEach((p, i) => {
    const a = document.createElement('a');
    a.href = p.destino;
    a.textContent = p.nombre;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      irA(p.destino);
    });
    salida.append(a);
    if (i < usan.length - 1) salida.append(', ');
  });
  salida.append('.');
}

// ------------------------------------------------------------------ barra y menú
const barra = $('#barra');
const marcarBarra = () => barra.classList.toggle('con-borde', window.scrollY > 8);
window.addEventListener('scroll', marcarBarra, { passive: true });
marcarBarra();

const enlacesMenu = $$('.menu a');
const observadorMenu = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const id = e.target.id === 'otros' ? 'proyectos' : e.target.id;
      enlacesMenu.forEach((a) => {
        if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
  },
  { rootMargin: '-40% 0px -55% 0px' },
);
['inicio', 'proyectos', 'otros', 'experiencia', 'certificados', 'habilidades', 'contacto'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) observadorMenu.observe(el);
});

// ------------------------------------------------------------------ avances de video
// Cada proyecto muestra un avance mudo en bucle mientras está a la vista.
const avances = $$('.avance');
const observadorVideo = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      const video = e.target;
      if (e.isIntersecting && !cine.open) {
        if (!video.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  },
  { threshold: 0.5 },
);
if (!reducido && !ahorro) avances.forEach((v) => observadorVideo.observe(v));
avances.forEach((video) => {
  const linea = video.parentElement.querySelector('.medio-avance');
  video.addEventListener('timeupdate', () => {
    if (video.duration) linea?.style.setProperty('--avance', String(video.currentTime / video.duration));
  });
});

// ------------------------------------------------------------------ sala de video
const cine = $('#cine');
const cineVideo = $('#cine-video');
const pantalla = $('.cine-pantalla');
const marcoCine = $('.cine-marco');
const botonPlay = $('#cine-play');
const botonGrande = $('#cine-grande');
const botonSonido = $('#cine-sonido');
const escala = $('#cine-escala');
const avance = $('#cine-avance');
const tiempo = $('#cine-tiempo');
const SALIDA = 'cubic-bezier(0.23, 1, 0.32, 1)';
const piezasCine = () => $$('.cine-cabeza, .cine-controles, .cine-nota');
let origen = null;

const reloj = (s) => {
  if (!Number.isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};
const usar = (boton, icono, etiqueta) => {
  boton.querySelector('use').setAttribute('href', icono);
  boton.setAttribute('aria-label', etiqueta);
};

/** Transformación que lleva la pantalla de la sala al video de su tarjeta. */
function desdeLaTarjeta() {
  const caja = origen?.closest('.medio')?.getBoundingClientRect();
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
  grafo?.pausar(true);
  cine.showModal();
  if (!reducido) {
    const desde = desdeLaTarjeta();
    if (desde) {
      pantalla.animate([{ transformOrigin: '0 0', transform: desde, borderRadius: '12px' }, { transformOrigin: '0 0', transform: 'none' }], { duration: 560, easing: SALIDA });
      marcoCine.animate([{ backgroundColor: 'rgba(255,255,255,0)', borderColor: 'transparent', boxShadow: 'none' }, { offset: 0.45, backgroundColor: 'rgba(255,255,255,0)', borderColor: 'transparent', boxShadow: 'none' }, {}], { duration: 560, easing: 'ease-out' });
      piezasCine().forEach((el) => el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 0, offset: 0.4 }, { opacity: 1, transform: 'none' }], { duration: 620, easing: SALIDA }));
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
  const hacia = reducido ? null : desdeLaTarjeta();
  if (hacia) {
    piezasCine().forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' }));
    marcoCine.animate([{}, { backgroundColor: 'rgba(255,255,255,0)', borderColor: 'transparent', boxShadow: 'none' }], { duration: 220, fill: 'forwards' });
    await pantalla.animate([{ transformOrigin: '0 0', transform: 'none' }, { transformOrigin: '0 0', transform: hacia }], { duration: 380, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', fill: 'forwards' }).finished.catch(() => {});
  }
  cine.close();
  [pantalla, marcoCine, ...piezasCine()].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
  cineVideo.removeAttribute('src');
  cineVideo.load();
  cerrando = false;
}

cine.addEventListener('cancel', (e) => {
  e.preventDefault();
  cerrarCine();
});
cine.addEventListener('close', () => {
  cineVideo.pause();
  grafo?.pausar(false);
  origen?.focus({ preventScroll: true });
  avances.forEach((v) => {
    const r = v.getBoundingClientRect();
    if (v.src && r.top < innerHeight && r.bottom > 0) v.play().catch(() => {});
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
  if (document.fullscreenElement) document.exitFullscreen();
  else if (pantalla.requestFullscreen) pantalla.requestFullscreen();
  else if (cineVideo.webkitEnterFullscreen) cineVideo.webkitEnterFullscreen();
});

cine.addEventListener('keydown', (e) => {
  if ((e.target instanceof HTMLButtonElement || e.target === escala) && e.key !== 'k') return;
  if (e.key === ' ' || e.key === 'k') {
    e.preventDefault();
    alternar();
  } else if (e.key === 'm') {
    botonSonido.click();
  } else if (e.key === 'f') {
    $('#cine-completa').click();
  }
});

// ------------------------------------------------------------------ buscador rápido (Ctrl+K)
const paleta = $('#paleta');
const campoPaleta = $('#paleta-campo');
const listaPaleta = $('#paleta-lista');
const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const ENTRADAS = [
  ...PROYECTOS.map((p) => ({ grupo: 'Proyectos', texto: p.nombre, tipo: p.destacado ? 'con video' : 'proyecto', claves: p.habilidades.join(' '), hacer: () => irA(p.destino) })),
  ...HABILIDADES.filter((h) => PROYECTOS.some((p) => p.habilidades.includes(h.id))).map((h) => ({
    grupo: 'Tecnologías',
    texto: h.nombre,
    tipo: `${PROYECTOS.filter((p) => p.habilidades.includes(h.id)).length} proyectos`,
    claves: h.id,
    hacer: () => {
      filtrar(h.id);
      irA('#inicio');
    },
  })),
  ...[
    ['Proyectos destacados', '#proyectos'],
    ['Otros proyectos', '#otros'],
    ['Experiencia', '#experiencia'],
    ['Certificados', '#certificados'],
    ['Tecnologías', '#habilidades'],
    ['Contacto', '#contacto'],
  ].map(([texto, destino]) => ({ grupo: 'Secciones', texto, tipo: 'sección', claves: '', hacer: () => irA(destino) })),
  { grupo: 'Acciones', texto: 'Descargar la hoja de vida', tipo: 'PDF', claves: 'cv curriculum hoja de vida', hacer: () => $('.barra-cv').click() },
  { grupo: 'Acciones', texto: 'Copiar el correo', tipo: 'correo', claves: 'email contacto mail', hacer: () => $('#copiar-correo').click() },
  { grupo: 'Acciones', texto: 'Abrir GitHub', tipo: 'enlace', claves: 'codigo repositorios', hacer: () => window.open('https://github.com/Cristianriosrivas', '_blank', 'noopener') },
  { grupo: 'Acciones', texto: 'Abrir LinkedIn', tipo: 'enlace', claves: 'perfil', hacer: () => window.open('https://linkedin.com/in/cristian-david-rios-rivas-998b383b7', '_blank', 'noopener') },
];

let resultados = [];
let seleccion = 0;

function pintarPaleta() {
  const q = normalizar(campoPaleta.value.trim());
  resultados = ENTRADAS.filter((e) => !q || normalizar(`${e.texto} ${e.claves} ${e.grupo}`).includes(q));
  seleccion = Math.min(seleccion, Math.max(0, resultados.length - 1));
  listaPaleta.replaceChildren();
  if (!resultados.length) {
    const vacio = document.createElement('p');
    vacio.className = 'paleta-vacio';
    vacio.textContent = 'Nada coincide. Prueba con React, IA o Contacto.';
    listaPaleta.append(vacio);
    campoPaleta.removeAttribute('aria-activedescendant');
    return;
  }
  let grupoActual = '';
  resultados.forEach((e, i) => {
    if (e.grupo !== grupoActual) {
      grupoActual = e.grupo;
      const g = document.createElement('div');
      g.className = 'paleta-grupo';
      g.setAttribute('role', 'presentation');
      g.textContent = e.grupo;
      listaPaleta.append(g);
    }
    const item = document.createElement('div');
    item.className = 'paleta-item';
    item.id = `paleta-op-${i}`;
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(i === seleccion));
    const texto = document.createElement('span');
    texto.textContent = e.texto;
    const tipo = document.createElement('span');
    tipo.className = 'paleta-tipo';
    tipo.textContent = e.tipo;
    item.append(texto, tipo);
    item.addEventListener('pointermove', () => {
      if (seleccion !== i) {
        seleccion = i;
        marcarSeleccion();
      }
    });
    item.addEventListener('click', () => ejecutar(i));
    listaPaleta.append(item);
  });
  marcarSeleccion();
}

function marcarSeleccion() {
  $$('.paleta-item', listaPaleta).forEach((el) => el.setAttribute('aria-selected', String(el.id === `paleta-op-${seleccion}`)));
  const activo = $(`#paleta-op-${seleccion}`);
  if (activo) {
    campoPaleta.setAttribute('aria-activedescendant', activo.id);
    activo.scrollIntoView({ block: 'nearest' });
  }
}

function ejecutar(i) {
  const e = resultados[i];
  if (!e) return;
  paleta.close();
  e.hacer();
}

function abrirPaleta() {
  if (paleta.open || cine.open) return;
  campoPaleta.value = '';
  seleccion = 0;
  pintarPaleta();
  paleta.showModal();
  campoPaleta.focus();
}

$('#abrir-paleta').addEventListener('click', abrirPaleta);
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    paleta.open ? paleta.close() : abrirPaleta();
  }
});
campoPaleta.addEventListener('input', () => {
  seleccion = 0;
  pintarPaleta();
});
campoPaleta.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') seleccion = Math.min(resultados.length - 1, seleccion + 1);
  else if (e.key === 'ArrowUp') seleccion = Math.max(0, seleccion - 1);
  else if (e.key === 'Enter') return ejecutar(seleccion);
  else return;
  e.preventDefault();
  marcarSeleccion();
});
paleta.addEventListener('click', (e) => {
  if (e.target === paleta) paleta.close();
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
