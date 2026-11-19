// Mapa de habilidades en 3D: los proyectos y las tecnologías que usan, como una red que se puede
// girar. Al elegir una habilidad, sus conexiones se encienden y unas señales viajan hacia los
// proyectos que la usan.
import * as THREE from 'three';

// El mapa vive en un panel de tinta: proyectos claros, tecnologías grises y el acento cobalto.
const COLOR = {
  tinta: new THREE.Color('#eef1f6'),
  habilidad: new THREE.Color('#6d7688'),
  acento: new THREE.Color('#5b74ff'),
  linea: new THREE.Color('#2c3442'),
  lineaTenue: new THREE.Color('#1a1f28'),
  fondo: '#0e1116',
};

// Orden de los proyectos alrededor del anillo: vecinos que comparten tecnologías quedan juntos.
const ORDEN = ['mediflow', 'finnets', 'english-buddy', 'tu-guia', 'afro-univalluna', 'gestor-rutas', 'parqueapp', 'alza-tu-voz', 'luminastore', 'asistente-univalle'];

/**
 * Disposición orbital: los proyectos en un anillo exterior que ondula suavemente y cada
 * tecnología en el interior, en la dirección media de los proyectos que la usan. Cuanto más
 * se usa una tecnología, más cerca del centro queda.
 */
function distribuir(nodos, aristas) {
  const pos = nodos.map(() => new THREE.Vector3());
  const proyectos = nodos.map((n, i) => (n.tipo === 'proyecto' ? i : -1)).filter((i) => i >= 0);
  proyectos.sort((a, b) => ORDEN.indexOf(nodos[a].id) - ORDEN.indexOf(nodos[b].id));
  const angulo = new Map();
  proyectos.forEach((i, k) => {
    const a = (k / proyectos.length) * Math.PI * 2;
    angulo.set(i, a);
    pos[i].set(Math.cos(a) * 1.95, Math.sin(a * 3) * 0.22, Math.sin(a) * 1.95);
  });
  let k = 0;
  nodos.forEach((n, i) => {
    if (n.tipo !== 'habilidad') return;
    const vecinos = aristas.filter(([, b]) => b === i).map(([a]) => a);
    let sx = 0;
    let sz = 0;
    for (const v of vecinos) {
      sx += Math.cos(angulo.get(v));
      sz += Math.sin(angulo.get(v));
    }
    const a = Math.atan2(sz, sx);
    const r = Math.max(0.42, 1.25 - vecinos.length * 0.13);
    const y = ((k % 3) - 1) * 0.5 + (k % 2 ? 0.12 : -0.12);
    pos[i].set(Math.cos(a) * r, y, Math.sin(a) * r);
    k++;
  });
  // Separa tecnologías que caen muy cerca entre sí.
  for (let vuelta = 0; vuelta < 60; vuelta++) {
    nodos.forEach((n, i) => {
      if (n.tipo !== 'habilidad') return;
      nodos.forEach((m, j) => {
        if (j <= i || m.tipo !== 'habilidad') return;
        const d = new THREE.Vector3().subVectors(pos[i], pos[j]);
        const largo = d.length();
        if (largo < 0.42) {
          d.setLength((0.42 - largo) / 2 + 0.001);
          pos[i].add(d);
          pos[j].sub(d);
        }
      });
    });
  }
  return pos;
}

function crearPunto() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(160,176,255,1)');
  gr.addColorStop(0.3, 'rgba(91,116,255,0.6)');
  gr.addColorStop(1, 'rgba(91,116,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function iniciarGrafo({ lienzo, contenedor, capa, proyectos, habilidades, reducido = false, alElegirProyecto, alElegirHabilidad }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    contenedor.classList.add('sin-3d');
    return { resaltarHabilidad() {}, pausar() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x0e1116, 0);

  // Nodos y aristas.
  const usadas = new Set(proyectos.flatMap((p) => p.habilidades));
  const nodos = [
    ...proyectos.map((p) => ({ id: p.id, nombre: p.nombre, tipo: 'proyecto', destacado: Boolean(p.destacado), def: p })),
    ...habilidades.filter((h) => usadas.has(h.id)).map((h) => ({ id: h.id, nombre: h.nombre, tipo: 'habilidad', def: h })),
  ];
  const indice = new Map(nodos.map((n, i) => [n.id, i]));
  const aristas = proyectos.flatMap((p) => p.habilidades.filter((h) => indice.has(h)).map((h) => [indice.get(p.id), indice.get(h)]));
  const posiciones = distribuir(nodos, aristas);

  const escena = new THREE.Scene();
  escena.fog = new THREE.Fog(COLOR.fondo, 4.6, 9);
  const camara = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camara.position.set(0, 0.35, 6.6);
  camara.lookAt(0, 0, 0);
  escena.add(new THREE.HemisphereLight(0xffffff, 0x1b2130, 1.6));
  const luz = new THREE.DirectionalLight(0xffffff, 2.2);
  luz.position.set(-3, 4, 5);
  escena.add(luz);

  const mundo = new THREE.Group();
  escena.add(mundo);

  // Esferas: los proyectos en tinta, las tecnologías en gris; los destacados llevan un anillo.
  const anillos = [];
  nodos.forEach((n, i) => {
    const radio = n.tipo === 'proyecto' ? (n.destacado ? 0.12 : 0.085) : 0.05;
    const mat = new THREE.MeshStandardMaterial({
      color: n.tipo === 'proyecto' ? COLOR.tinta : COLOR.habilidad,
      roughness: 0.32,
      metalness: 0.1,
      transparent: true,
    });
    const malla = new THREE.Mesh(new THREE.SphereGeometry(radio, 32, 20), mat);
    malla.position.copy(posiciones[i]);
    malla.userData.nodo = i;
    mundo.add(malla);
    n.malla = malla;
    n.radio = radio;
    if (n.destacado) {
      const anillo = new THREE.Mesh(
        new THREE.RingGeometry(radio + 0.05, radio + 0.062, 48),
        new THREE.MeshBasicMaterial({ color: COLOR.acento, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }),
      );
      anillo.position.copy(posiciones[i]);
      mundo.add(anillo);
      anillos.push(anillo);
      n.anillo = anillo;
    }
  });

  // Aristas con color por vértice: se encienden o se apagan según el filtro.
  const geoLineas = new THREE.BufferGeometry();
  const vertices = new Float32Array(aristas.length * 6);
  const colores = new Float32Array(aristas.length * 6);
  aristas.forEach(([a, b], k) => {
    vertices.set([posiciones[a].x, posiciones[a].y, posiciones[a].z, posiciones[b].x, posiciones[b].y, posiciones[b].z], k * 6);
  });
  geoLineas.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geoLineas.setAttribute('color', new THREE.BufferAttribute(colores, 3));
  const lineas = new THREE.LineSegments(geoLineas, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0 }));
  mundo.add(lineas);

  // Señales que recorren las aristas.
  const texPunto = crearPunto();
  const senales = Array.from({ length: 36 }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texPunto, transparent: true, depthWrite: false, opacity: 0 }));
    s.scale.setScalar(0.16);
    mundo.add(s);
    return { sprite: s, arista: -1, fase: Math.random() };
  });

  // Etiquetas DOM.
  for (const n of nodos) {
    const b = document.createElement('button');
    b.type = 'button';
    b.tabIndex = -1;
    b.className = `nodo nodo-${n.tipo}`;
    b.textContent = n.nombre;
    b.addEventListener('click', () => (n.tipo === 'proyecto' ? alElegirProyecto?.(n.def) : alElegirHabilidad?.(n.id)));
    b.addEventListener('pointerenter', () => {
      hover = indice.get(n.id);
    });
    b.addEventListener('pointerleave', () => {
      hover = -1;
    });
    capa.append(b);
    n.etiqueta = b;
  }

  // ---------------------------------------------------------------- estado de resaltado
  let filtro = null; // id de habilidad elegida
  let hover = -1;
  let activos = null; // Set de índices encendidos, o null

  function vecinos(i) {
    const s = new Set([i]);
    aristas.forEach(([a, b]) => {
      if (a === i) s.add(b);
      if (b === i) s.add(a);
    });
    return s;
  }

  function aplicarResaltado() {
    const foco = filtro != null ? indice.get(filtro) : hover >= 0 ? hover : -1;
    activos = foco >= 0 ? vecinos(foco) : null;
    contenedor.classList.toggle('filtrando', Boolean(activos));
    nodos.forEach((n, i) => {
      const encendido = !activos || activos.has(i);
      const destacado = activos && activos.has(i);
      n.malla.material.color.copy(destacado ? COLOR.acento : n.tipo === 'proyecto' ? COLOR.tinta : COLOR.habilidad);
      n.malla.material.opacity = encendido ? 1 : 0.2;
      if (n.anillo) n.anillo.material.opacity = destacado ? 1 : encendido ? 0.7 : 0.12;
      n.etiqueta.classList.toggle('activo', Boolean(destacado));
    });
    aristas.forEach(([a, b], k) => {
      const c = !activos ? COLOR.linea : activos.has(a) && activos.has(b) && (a === foco || b === foco) ? COLOR.acento : COLOR.lineaTenue;
      colores.set([c.r, c.g, c.b, c.r, c.g, c.b], k * 6);
    });
    geoLineas.attributes.color.needsUpdate = true;
    // Señales: por las aristas del foco, o pocas y suaves por toda la red.
    const rutas = activos ? aristas.map((ar, k) => (ar[0] === foco || ar[1] === foco ? k : -1)).filter((k) => k >= 0) : [];
    senales.forEach((s, k) => {
      if (rutas.length) s.arista = rutas[k % rutas.length];
      else s.arista = k < 10 ? (k * 7) % aristas.length : -1;
      s.fase = (k / senales.length) * 3.1;
    });
  }

  // ---------------------------------------------------------------- interacción: girar con inercia
  // Inclinado para que el anillo se lea como una órbita.
  const giro = { x: 0.5, y: reducido ? 0.4 : -0.9, vx: 0, vy: 0 };
  let arrastrando = false;
  let movido = 0;
  let ultimoToque = -10;
  let previo = null;
  const raycaster = new THREE.Raycaster();
  const puntero = new THREE.Vector2();

  contenedor.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.nodo')) return;
    arrastrando = true;
    movido = 0;
    previo = { x: e.clientX, y: e.clientY };
    contenedor.setPointerCapture(e.pointerId);
  });
  contenedor.addEventListener('pointermove', (e) => {
    if (arrastrando && previo) {
      const dx = e.clientX - previo.x;
      const dy = e.clientY - previo.y;
      movido += Math.abs(dx) + Math.abs(dy);
      giro.vy = dx * 0.0065;
      giro.vx = dy * 0.0045;
      giro.y += giro.vy;
      giro.x = Math.max(-0.2, Math.min(0.85, giro.x + giro.vx));
      previo = { x: e.clientX, y: e.clientY };
      ultimoToque = reloj;
      return;
    }
    // Hover sobre las esferas.
    const r = lienzo.getBoundingClientRect();
    puntero.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(puntero, camara);
    const tocado = raycaster.intersectObjects(nodos.map((n) => n.malla))[0];
    const nuevo = tocado ? tocado.object.userData.nodo : -1;
    if (nuevo !== hover && !e.target.closest('.nodo')) {
      hover = nuevo;
    }
    contenedor.style.cursor = nuevo >= 0 ? 'pointer' : '';
  });
  const soltar = (e) => {
    if (!arrastrando) return;
    arrastrando = false;
    previo = null;
    if (movido < 6 && hover >= 0) {
      const n = nodos[hover];
      if (n.tipo === 'proyecto') alElegirProyecto?.(n.def);
      else alElegirHabilidad?.(n.id);
    }
    ultimoToque = reloj;
    try {
      contenedor.releasePointerCapture(e.pointerId);
    } catch {}
  };
  contenedor.addEventListener('pointerup', soltar);
  contenedor.addEventListener('pointercancel', soltar);
  contenedor.addEventListener('pointerleave', () => {
    if (!arrastrando) hover = -1;
  });

  // ---------------------------------------------------------------- tamaño, visibilidad y bucle
  let ancho = 1;
  let alto = 1;
  const medir = () => {
    const r = contenedor.getBoundingClientRect();
    ancho = Math.max(1, r.width);
    alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    // En paneles angostos la cámara se aleja para que quepa la red.
    camara.position.z = ancho / alto < 1.05 ? 7.1 : 5.9;
    camara.updateProjectionMatrix();
  };
  new ResizeObserver(medir).observe(contenedor);
  medir();

  let enVista = true;
  new IntersectionObserver(([e]) => (enVista = e.isIntersecting)).observe(contenedor);
  let enPausa = false;

  const v = new THREE.Vector3();
  const vista = new THREE.Vector3();
  let reloj = 0;
  let anterior = performance.now();
  let ultimoHover = -2;
  let ultimoFiltro;
  let progresoEntrada = reducido ? 1 : 0;
  let aristasFijas = false;

  function cuadro(ahora) {
    requestAnimationFrame(cuadro);
    const dt = Math.min((ahora - anterior) / 1000, 0.05);
    anterior = ahora;
    if (!enVista || enPausa || document.hidden) return;
    reloj += dt;

    if (hover !== ultimoHover || filtro !== ultimoFiltro) {
      ultimoHover = hover;
      ultimoFiltro = filtro;
      aplicarResaltado();
    }

    // Entrada: la red se arma desde el centro mientras gira hasta su sitio.
    if (progresoEntrada < 1) {
      progresoEntrada = Math.min(1, progresoEntrada + dt / 1.4);
    }
    const ease = 1 - Math.pow(1 - progresoEntrada, 3);

    // Giro: inercia tras arrastrar y rotación lenta cuando nadie toca.
    if (!arrastrando) {
      giro.vy *= 0.94;
      giro.vx *= 0.9;
      giro.y += giro.vy;
      giro.x = Math.max(-0.2, Math.min(0.85, giro.x + giro.vx));
      if (!reducido && reloj - ultimoToque > 2.5) giro.y += dt * (progresoEntrada < 1 ? 0.9 * (1 - ease) + 0.1 : 0.1);
    }
    mundo.rotation.set(giro.x, giro.y, 0);

    nodos.forEach((n, i) => {
      const retraso = Math.min(1, Math.max(0, ease * 1.6 - (i / nodos.length) * 0.6));
      n.malla.position.copy(posiciones[i]).multiplyScalar(0.25 + 0.75 * retraso);
      n.malla.scale.setScalar(0.2 + 0.8 * retraso);
      if (n.anillo) {
        n.anillo.position.copy(n.malla.position);
        n.anillo.quaternion.copy(camara.quaternion).premultiply(mundo.quaternion.clone().invert());
      }
    });
    lineas.material.opacity = Math.max(0, (ease - 0.35) / 0.65);
    if (!aristasFijas) {
      // Mientras se arma, las aristas siguen a los nodos; al terminar quedan en su sitio final.
      aristas.forEach(([a, b], k) => {
        vertices.set([nodos[a].malla.position.x, nodos[a].malla.position.y, nodos[a].malla.position.z, nodos[b].malla.position.x, nodos[b].malla.position.y, nodos[b].malla.position.z], k * 6);
      });
      geoLineas.attributes.position.needsUpdate = true;
      if (ease >= 1) aristasFijas = true;
    }

    // Señales viajando de la habilidad al proyecto.
    for (const s of senales) {
      if (s.arista < 0 || reducido) {
        s.sprite.material.opacity = 0;
        continue;
      }
      const [a, b] = aristas[s.arista];
      const u = (reloj * (activos ? 0.55 : 0.22) + s.fase) % 1;
      // Las aristas van de proyecto (a) a habilidad (b): la señal sale de la habilidad.
      s.sprite.position.lerpVectors(nodos[b].malla.position, nodos[a].malla.position, u);
      s.sprite.material.opacity = (activos ? 1 : 0.55) * Math.sin(Math.PI * u) * lineas.material.opacity;
    }

    renderer.render(escena, camara);

    // Etiquetas: a la derecha de cada nodo, más tenues al fondo, sin pisarse.
    const ocupadas = [];
    const orden = nodos
      .map((n, i) => ({ n, i, prioridad: (activos && activos.has(i) ? 0 : 3) + (n.destacado ? 0 : n.tipo === 'habilidad' ? 1 : 2) }))
      .sort((a, b) => a.prioridad - b.prioridad);
    for (const { n } of orden) {
      v.copy(n.malla.position).applyMatrix4(mundo.matrixWorld);
      vista.copy(v).applyMatrix4(camara.matrixWorldInverse);
      v.project(camara);
      const x = ((v.x + 1) / 2) * ancho;
      const y = ((1 - v.y) / 2) * alto;
      if (!n.w) {
        n.w = n.etiqueta.offsetWidth;
        n.h = n.etiqueta.offsetHeight;
      }
      const caja = { x: x + n.radio * 60 + 4, y: y - n.h / 2, w: n.w, h: n.h };
      if (caja.x + caja.w > ancho - 6) caja.x = x - n.radio * 60 - 4 - n.w;
      const choca = ocupadas.some((o) => caja.x < o.x + o.w && caja.x + caja.w > o.x && caja.y < o.y + o.h && caja.y + caja.h > o.y);
      const profundidad = Math.min(1, Math.max(0, (-vista.z - 4.6) / 3.2));
      const visible = progresoEntrada > 0.75 && !choca && caja.x > 2 && caja.y > 2 && caja.y + caja.h < alto - 2;
      // Con un filtro activo, las etiquetas que no forman parte de él se atenúan.
      const atenuada = activos && !activos.has(indice.get(n.id));
      n.etiqueta.style.opacity = visible ? String((1 - profundidad * 0.55) * (atenuada ? 0.3 : 1)) : '0';
      n.etiqueta.style.pointerEvents = visible ? '' : 'none';
      n.etiqueta.style.transform = `translate3d(${caja.x.toFixed(1)}px, ${caja.y.toFixed(1)}px, 0)`;
      if (visible) ocupadas.push(caja);
    }
  }
  requestAnimationFrame(cuadro);

  return {
    resaltarHabilidad(id) {
      filtro = id;
      ultimoToque = reloj;
    },
    pausar(valor) {
      enPausa = Boolean(valor);
    },
  };
}
