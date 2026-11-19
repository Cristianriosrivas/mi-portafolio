// La carta náutica en 3D: la Bahía de Buenaventura como maqueta de capas, una por isóbata,
// bajo una lámina de agua. Cada proyecto es una luz con su característica, y el trazador
// dibuja el rumbo entre las luces de una habilidad.
//
// La geografía es esquemática: se parece a la bahía, pero no sirve para navegar.
import * as THREE from 'three';

const ANCHO = 16; // unidades de la carta (1 unidad ≈ 1,2 millas náuticas)
const ALTO = 11;
const NX = 321;
const NZ = 221;
const MILLAS_POR_UNIDAD = 1.2;

// Ubicación: el centro de Isla Cascajal queda en 3°53′N 77°02′W.
const LON0 = -77.138;
const LAT0 = 3.878;
const GRADO = 0.02;

const C = {
  papel: '#f8f9f7',
  papel3: '#dfe2dc',
  tinta: '#18233a',
  tinta2: '#3a4862',
  magenta: '#b8006f',
  magentaLuz: '#d6338e',
  rojo: '#c8102e',
  verde: '#00804a',
};

// Colores de la carta por banda: 0–4 agua (de somera a profunda), 5–7 tierra.
const BANDAS = [
  [159, 203, 227],
  [186, 219, 236],
  [211, 232, 242],
  [232, 242, 246],
  [248, 249, 247],
  [239, 217, 166],
  [233, 208, 150],
  [226, 197, 134],
];
const ISOBATA = [104, 156, 193];
const CURVA = [201, 168, 104];
const COSTA = [36, 47, 72];

// Costas esquemáticas (x hacia el este, z hacia el sur).
const TIERRAS = [
  // Costa norte, La Bocana, Juanchaco y la boca de Bahía Málaga
  [[-4.4, -1.9], [-3.4, -2.3], [-2.2, -2.35], [-1.0, -2.7], [0.4, -2.45], [1.8, -2.75], [3.0, -2.35], [4.0, -1.75], [4.9, -1.35], [6.2, -1.55], [8.8, -1.7], [8.8, -6.2], [-0.4, -6.2], [-0.8, -5.0], [-1.7, -4.45], [-2.8, -4.55], [-3.5, -4.05], [-4.4, -4.25], [-5.3, -3.75], [-5.15, -3.0], [-4.75, -2.45]],
  // Costa sur y Punta Soldado
  [[-3.7, 2.75], [-2.5, 2.25], [-1.1, 2.55], [0.5, 2.15], [1.9, 2.45], [3.1, 2.3], [4.4, 1.75], [5.5, 1.3], [6.4, 1.45], [8.8, 1.45], [8.8, 6.2], [-4.3, 6.2], [-4.9, 4.3], [-4.3, 3.25]],
  // Isla Cascajal, donde está la ciudad
  [[4.65, -0.5], [5.1, -0.95], [5.9, -0.85], [6.4, -0.4], [6.3, 0.35], [5.7, 0.72], [5.0, 0.62], [4.62, 0.15]],
  // Tierra firme al este
  [[6.95, -1.65], [7.25, -0.6], [7.05, 0.4], [6.95, 1.3], [8.8, 1.4], [8.8, -1.75]],
];
const CANAL = [[-8.2, 0.95], [-4.6, 0.55], [-2.0, 0.22], [1.0, 0.08], [3.4, -0.12], [4.3, -0.2]];

// ---------------------------------------------------------------- ruido y distancias

function hash(ix, iz) {
  let h = (Math.imul(ix, 374761393) + Math.imul(iz, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function ruido(x, z) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz);
  const b = hash(ix + 1, iz);
  const c = hash(ix, iz + 1);
  const d = hash(ix + 1, iz + 1);
  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
}

function fbm(x, z) {
  let s = 0;
  let a = 0.5;
  let f = 1;
  for (let i = 0; i < 4; i++) {
    s += a * ruido(x * f, z * f);
    f *= 2.03;
    a *= 0.5;
  }
  return s / 0.9375;
}

/** Distancia con signo a un polígono (negativa por dentro). */
function sdPoligono(px, pz, v) {
  let d = (px - v[0][0]) ** 2 + (pz - v[0][1]) ** 2;
  let s = 1;
  for (let i = 0, j = v.length - 1; i < v.length; j = i, i++) {
    const ex = v[j][0] - v[i][0];
    const ez = v[j][1] - v[i][1];
    const wx = px - v[i][0];
    const wz = pz - v[i][1];
    const t = Math.min(1, Math.max(0, (wx * ex + wz * ez) / (ex * ex + ez * ez)));
    const bx = wx - ex * t;
    const bz = wz - ez * t;
    d = Math.min(d, bx * bx + bz * bz);
    const c1 = pz >= v[i][1];
    const c2 = pz < v[j][1];
    const c3 = ex * wz > ez * wx;
    if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) s = -s;
  }
  return s * Math.sqrt(d);
}

function distPolilinea(px, pz, pts) {
  let d = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i];
    const [bx, bz] = pts[i + 1];
    const ex = bx - ax;
    const ez = bz - az;
    const t = Math.min(1, Math.max(0, ((px - ax) * ex + (pz - az) * ez) / (ex * ex + ez * ez)));
    d = Math.min(d, Math.hypot(px - ax - ex * t, pz - az - ez * t));
  }
  return d;
}

/** Punto y dirección a una fracción t del recorrido de una polilínea. */
function puntoEn(pts, t) {
  const largos = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    largos.push(l);
    total += l;
  }
  let falta = t * total;
  for (let i = 0; i < largos.length; i++) {
    if (falta <= largos[i] || i === largos.length - 1) {
      const u = Math.min(1, falta / largos[i]);
      const dx = (pts[i + 1][0] - pts[i][0]) / largos[i];
      const dz = (pts[i + 1][1] - pts[i][1]) / largos[i];
      return { x: pts[i][0] + dx * largos[i] * u, z: pts[i][1] + dz * largos[i] * u, dx, dz };
    }
    falta -= largos[i];
  }
  return { x: pts.at(-1)[0], z: pts.at(-1)[1], dx: 1, dz: 0 };
}

// ---------------------------------------------------------------- relieve

/** Alturas en metros: positivas en tierra, negativas (profundidad) en el agua. */
function construirRelieve() {
  const alturas = new Float32Array(NX * NZ);
  for (let j = 0; j < NZ; j++) {
    const z = -ALTO / 2 + (j * ALTO) / (NZ - 1);
    for (let i = 0; i < NX; i++) {
      const x = -ANCHO / 2 + (i * ANCHO) / (NX - 1);
      let d = Infinity;
      for (const p of TIERRAS) d = Math.min(d, sdPoligono(x, z, p));
      d += (fbm(x * 1.15 + 3.1, z * 1.15 - 1.7) - 0.5) * 0.34 + (fbm(x * 3.6, z * 3.6 + 5) - 0.5) * 0.12;
      let h;
      if (d < 0) {
        h = 3 + -d * 26 + fbm(x * 2 + 11, z * 2) * 14;
      } else {
        let p = 0.5 + d * 7.2 + Math.max(0, -3.8 - x) * 6.5 + (fbm(x * 2.2 - 4, z * 2.2 + 9) - 0.5) * 3.2;
        const dc = distPolilinea(x, z, CANAL);
        if (dc < 0.24) p = Math.max(p, 12.5 + (0.24 - dc) * 8);
        const dr = Math.hypot(x - 6.6, z - 1.25);
        if (dr < 1.1) p *= 0.45 + 0.55 * (dr / 1.1);
        h = -Math.min(p, 64);
      }
      alturas[j * NX + i] = h;
    }
  }
  return alturas;
}

function muestra(alturas, x, z) {
  const fx = ((x + ANCHO / 2) / ANCHO) * (NX - 1);
  const fz = ((z + ALTO / 2) / ALTO) * (NZ - 1);
  const i = Math.max(0, Math.min(NX - 2, Math.floor(fx)));
  const j = Math.max(0, Math.min(NZ - 2, Math.floor(fz)));
  const tx = Math.min(1, Math.max(0, fx - i));
  const tz = Math.min(1, Math.max(0, fz - j));
  const a = alturas[j * NX + i];
  const b = alturas[j * NX + i + 1];
  const c = alturas[(j + 1) * NX + i];
  const d = alturas[(j + 1) * NX + i + 1];
  return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz;
}

function banda(h) {
  if (h >= 0) return h < 20 ? 5 : h < 60 ? 6 : 7;
  const p = -h;
  return p < 2 ? 0 : p < 5 ? 1 : p < 10 ? 2 : p < 20 ? 3 : 4;
}

/** Altura de la maqueta para una banda: el lecho baja por capas y la tierra sube. */
function alturaMaqueta(b) {
  return b < 5 ? -(0.028 + 0.03 * b) : 0.04 + 0.035 * (b - 5);
}

// ---------------------------------------------------------------- boyas del canal

function boyasDelCanal() {
  const boyas = [];
  [0.2, 0.36, 0.52, 0.68, 0.84].forEach((t, k) => {
    const p = puntoEn(CANAL, t);
    const nx = -p.dz;
    const nz = p.dx;
    // IALA B: al entrar desde el mar, el rojo queda a estribor (al sur, rumbo este).
    boyas.push({ x: p.x - nx * 0.33, z: p.z - nz * 0.33, color: 'verde', fase: k * 0.7 });
    boyas.push({ x: p.x + nx * 0.33, z: p.z + nz * 0.33, color: 'rojo', fase: k * 0.7 + 1.3 });
  });
  return boyas;
}

// ---------------------------------------------------------------- la carta impresa

function formatoGrados(valor, eje) {
  const abs = Math.abs(valor);
  let g = Math.floor(abs);
  let m = Math.round((abs - g) * 60);
  if (m === 60) {
    g += 1;
    m = 0;
  }
  const letra = eje === 'lat' ? (valor >= 0 ? 'N' : 'S') : valor >= 0 ? 'E' : 'W';
  return `${g}°${String(m).padStart(2, '0')}′${letra}`;
}

async function pintarCarta(alturas, ancho, luces, boyas) {
  const alto = Math.round((ancho * ALTO) / ANCHO);
  const S = ancho / ANCHO;
  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  const ctx = lienzo.getContext('2d');
  const img = ctx.createImageData(ancho, alto);
  const px = img.data;
  const bandas = new Uint8Array(ancho * alto);

  // Interpolación bilineal con los índices de columna precalculados (es el paso más pesado).
  const col = new Int32Array(ancho);
  const tcol = new Float32Array(ancho);
  for (let x = 0; x < ancho; x++) {
    const fx = (((x + 0.5) / S) / ANCHO) * (NX - 1);
    col[x] = Math.min(NX - 2, Math.floor(fx));
    tcol[x] = fx - col[x];
  }
  for (let y = 0; y < alto; y++) {
    const fz = (((y + 0.5) / S) / ALTO) * (NZ - 1);
    const j = Math.min(NZ - 2, Math.floor(fz));
    const tz = fz - j;
    const fila0 = j * NX;
    const fila1 = fila0 + NX;
    const salida = y * ancho;
    for (let x = 0; x < ancho; x++) {
      const i = col[x];
      const tx = tcol[x];
      const arriba = alturas[fila0 + i] + (alturas[fila0 + i + 1] - alturas[fila0 + i]) * tx;
      const abajo = alturas[fila1 + i] + (alturas[fila1 + i + 1] - alturas[fila1 + i]) * tx;
      const h = arriba + (abajo - arriba) * tz;
      let b;
      if (h >= 0) b = h < 20 ? 5 : h < 60 ? 6 : 7;
      else b = h > -2 ? 0 : h > -5 ? 1 : h > -10 ? 2 : h > -20 ? 3 : 4;
      bandas[salida + x] = b;
    }
  }
  for (let i = 0; i < bandas.length; i++) {
    const c = BANDAS[bandas[i]];
    px[i * 4] = c[0];
    px[i * 4 + 1] = c[1];
    px[i * 4 + 2] = c[2];
    px[i * 4 + 3] = 255;
  }
  const marcar = (i, c) => {
    px[i * 4] = c[0];
    px[i * 4 + 1] = c[1];
    px[i * 4 + 2] = c[2];
  };
  // Isóbatas, curvas de nivel y la línea de costa, donde cambia la banda.
  for (let y = 0; y < alto - 1; y++) {
    for (let x = 0; x < ancho - 1; x++) {
      const i = y * ancho + x;
      const b = bandas[i];
      const r = bandas[i + 1];
      const d = bandas[i + ancho];
      if (b !== r || b !== d) {
        const otro = b !== r ? r : d;
        const costa = b < 5 !== otro < 5;
        if (costa) {
          marcar(i, COSTA);
          marcar(i + 1, COSTA);
          marcar(i + ancho, COSTA);
        } else {
          marcar(i, b < 5 ? ISOBATA : CURVA);
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);

  await Promise.all([
    document.fonts.load('italic 500 20px Archivo'),
    document.fonts.load('700 20px Archivo'),
    document.fonts.load('800 20px Archivo'),
  ]).catch(() => {});

  const aPx = (x, z) => [(x + ANCHO / 2) * S, (z + ALTO / 2) * S];
  const ocupado = [];
  const choca = (r) => ocupado.some((o) => r.x < o.x + o.w && r.x + r.w > o.x && r.y < o.y + o.h && r.y + r.h > o.y);

  function texto(cadena, x, z, { tam = 0.12, peso = 700, cursiva = false, color = C.tinta, espaciado = 0, angulo = 0, alfa = 1, estirar = 'normal' } = {}) {
    const [cx, cy] = aPx(x, z);
    const t = tam * S;
    ctx.save();
    ctx.globalAlpha = alfa;
    ctx.fillStyle = color;
    ctx.font = `${cursiva ? 'italic ' : ''}${peso} ${t}px Archivo`;
    if ('fontStretch' in ctx) ctx.fontStretch = estirar;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${espaciado * t}px`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(cx, cy);
    ctx.rotate(angulo);
    ctx.fillText(cadena, 0, 0);
    const w = ctx.measureText(cadena).width;
    ctx.restore();
    ocupado.push({ x: cx - w / 2 - 6, y: cy - t * 0.7 - 4, w: w + 12, h: t * 1.4 + 8 });
  }

  // Retícula de minutos.
  ctx.save();
  ctx.strokeStyle = 'rgba(24,35,58,0.13)';
  ctx.lineWidth = 1;
  ctx.font = `italic 500 ${0.1 * S}px Archivo`;
  ctx.fillStyle = 'rgba(24,35,58,0.6)';
  const latN = LAT0 + (ALTO / 2) * GRADO;
  const latS = LAT0 - (ALTO / 2) * GRADO;
  for (let m = Math.ceil(latS * 30); m <= Math.floor(latN * 30); m++) {
    const lat = m / 30;
    const [, y] = aPx(0, (LAT0 - lat) / GRADO);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ancho, y);
    ctx.stroke();
    ctx.textAlign = 'left';
    ctx.fillText(formatoGrados(lat, 'lat'), 26, y - 6);
  }
  const lonO = LON0 - (ANCHO / 2) * GRADO;
  const lonE = LON0 + (ANCHO / 2) * GRADO;
  for (let m = Math.ceil(lonO * 30); m <= Math.floor(lonE * 30); m++) {
    const lon = m / 30;
    const [x] = aPx((lon - LON0) / GRADO, 0);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, alto);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillText(formatoGrados(lon, 'lon'), x, 30);
  }
  ctx.restore();

  // Límites del canal de acceso.
  ctx.save();
  ctx.strokeStyle = C.magenta;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = Math.max(1, S * 0.012);
  ctx.setLineDash([S * 0.09, S * 0.07]);
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    for (let k = 0; k <= 60; k++) {
      const p = puntoEn(CANAL, k / 60);
      const [x, y] = aPx(p.x - p.dz * 0.24 * lado, p.z + p.dx * 0.24 * lado);
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Nombres de tierra (rectos) y de agua (cursiva).
  texto('BUENAVENTURA', 5.5, -0.08, { tam: 0.16, peso: 800, espaciado: 0.12, estirar: 'expanded' });
  texto('Isla Cascajal', 5.5, 0.22, { tam: 0.1, peso: 500, cursiva: true, color: C.tinta2 });
  texto('JUANCHACO', -4.55, -3.3, { tam: 0.115, peso: 700, espaciado: 0.1 });
  texto('LADRILLEROS', -3.25, -3.25, { tam: 0.105, peso: 700, espaciado: 0.1 });
  texto('LA BOCANA', -3.45, -2.72, { tam: 0.115, peso: 700, espaciado: 0.1 });
  texto('PIANGÜITA', -2.05, -2.88, { tam: 0.105, peso: 700, espaciado: 0.1 });
  texto('PUNTA SOLDADO', -3.15, 3.12, { tam: 0.115, peso: 700, espaciado: 0.1 });
  texto('VALLE DEL CAUCA', 3.7, -4.3, { tam: 0.34, peso: 800, espaciado: 0.35, alfa: 0.32, estirar: 'expanded' });
  texto('PACÍFICO COLOMBIANO', 2.6, 4.4, { tam: 0.26, peso: 800, espaciado: 0.32, alfa: 0.28, estirar: 'expanded' });
  texto('Bahía de Buenaventura', 0.0, 0.78, { tam: 0.27, peso: 500, cursiva: true, espaciado: 0.18, angulo: -0.04, color: C.tinta2 });
  texto('Océano Pacífico', -6.2, -1.25, { tam: 0.36, peso: 500, cursiva: true, espaciado: 0.16, color: C.tinta2 });
  texto('Bahía Málaga', -2.55, -5.1, { tam: 0.22, peso: 500, cursiva: true, espaciado: 0.12, color: C.tinta2 });
  texto('Río Dagua', 6.15, 1.1, { tam: 0.1, peso: 500, cursiva: true, color: C.tinta2 });
  const medio = puntoEn(CANAL, 0.43);
  texto('Canal de acceso', medio.x, medio.z - 0.38, { tam: 0.1, peso: 500, cursiva: true, angulo: Math.atan2(medio.dz, medio.dx), color: C.tinta2 });

  // Rosa de los vientos.
  const [rx, ry] = aPx(-6.15, 3.35);
  const rr = 1.05 * S;
  ctx.save();
  ctx.translate(rx, ry);
  ctx.strokeStyle = C.magenta;
  ctx.fillStyle = C.magenta;
  ctx.lineWidth = Math.max(1, S * 0.01);
  ctx.beginPath();
  ctx.arc(0, 0, rr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, rr * 0.84, 0, Math.PI * 2);
  ctx.stroke();
  for (let g = 0; g < 360; g += 2) {
    const a = (g * Math.PI) / 180;
    const largo = g % 10 === 0 ? rr * 0.1 : rr * 0.05;
    ctx.beginPath();
    ctx.moveTo(Math.sin(a) * rr, -Math.cos(a) * rr);
    ctx.lineTo(Math.sin(a) * (rr - largo), -Math.cos(a) * (rr - largo));
    ctx.stroke();
  }
  ctx.font = `italic 600 ${0.085 * S}px Archivo`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let g = 0; g < 360; g += 30) {
    const a = (g * Math.PI) / 180;
    ctx.save();
    ctx.rotate(a);
    ctx.fillText(String(g), 0, -rr * 0.74);
    ctx.restore();
  }
  for (let k = 0; k < 4; k++) {
    ctx.save();
    ctx.rotate((k * Math.PI) / 2);
    ctx.beginPath();
    ctx.moveTo(0, -rr * 0.6);
    ctx.lineTo(rr * 0.07, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -rr * 0.6);
    ctx.lineTo(-rr * 0.07, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.globalAlpha = 0.35;
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.font = `800 ${0.13 * S}px Archivo`;
  ctx.fillText('N', 0, -rr * 1.12);
  ctx.restore();
  ocupado.push({ x: rx - rr - 10, y: ry - rr * 1.25, w: rr * 2 + 20, h: rr * 2.3 });

  // Escala gráfica en millas náuticas.
  const [ex, ey] = aPx(-7.35, 4.85);
  const tramo = S / MILLAS_POR_UNIDAD;
  ctx.save();
  ctx.strokeStyle = C.tinta;
  ctx.lineWidth = 1.5;
  for (let k = 0; k < 3; k++) {
    ctx.fillStyle = k % 2 ? C.papel : C.tinta;
    ctx.fillRect(ex + k * tramo, ey, tramo, S * 0.06);
    ctx.strokeRect(ex + k * tramo, ey, tramo, S * 0.06);
  }
  ctx.fillStyle = C.tinta;
  ctx.font = `italic 500 ${0.1 * S}px Archivo`;
  ctx.textAlign = 'center';
  for (let k = 0; k <= 3; k++) ctx.fillText(String(k), ex + k * tramo, ey + S * 0.18);
  ctx.textAlign = 'left';
  ctx.fillText('Millas náuticas', ex, ey - S * 0.08);
  ctx.restore();
  ocupado.push({ x: ex - 10, y: ey - S * 0.2, w: tramo * 3 + 20, h: S * 0.45 });

  // Fondeadero.
  const [fx, fy] = aPx(2.05, 0.95);
  ctx.save();
  ctx.translate(fx, fy);
  ctx.strokeStyle = C.magenta;
  ctx.lineWidth = Math.max(1.2, S * 0.013);
  const a = S * 0.1;
  ctx.beginPath();
  ctx.arc(0, -a * 0.9, a * 0.22, 0, Math.PI * 2);
  ctx.moveTo(0, -a * 0.68);
  ctx.lineTo(0, a);
  ctx.moveTo(-a * 0.45, -a * 0.35);
  ctx.lineTo(a * 0.45, -a * 0.35);
  ctx.moveTo(-a * 0.7, a * 0.35);
  ctx.quadraticCurveTo(-a * 0.55, a * 1.05, 0, a);
  ctx.quadraticCurveTo(a * 0.55, a * 1.05, a * 0.7, a * 0.35);
  ctx.stroke();
  ctx.restore();
  ocupado.push({ x: fx - a, y: fy - a * 1.3, w: a * 2, h: a * 2.6 });

  // Símbolo de luz (destello magenta) en cada señal, y las boyas del canal.
  for (const luz of luces) {
    const [lx, ly] = aPx(luz.posicion[0], luz.posicion[1]);
    const t = (luz.mayor ? 0.34 : 0.24) * S;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(0.55);
    ctx.fillStyle = C.magenta;
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(t * 0.32, -t * 0.25, t * 0.28, -t * 0.85, 0, -t);
    ctx.bezierCurveTo(-t * 0.28, -t * 0.85, -t * 0.32, -t * 0.25, 0, 0);
    ctx.fill();
    ctx.restore();
    ocupado.push({ x: lx - 0.45 * S, y: ly - 0.5 * S, w: 0.9 * S, h: 0.75 * S });
  }
  for (const b of boyas) {
    const [bx, by] = aPx(b.x, b.z);
    const t = 0.07 * S;
    ctx.save();
    ctx.translate(bx, by);
    ctx.fillStyle = b.color === 'rojo' ? C.rojo : C.verde;
    ctx.beginPath();
    ctx.moveTo(0, -t);
    ctx.lineTo(t * 0.6, 0);
    ctx.lineTo(0, t * 0.5);
    ctx.lineTo(-t * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ocupado.push({ x: bx - t * 2, y: by - t * 2, w: t * 4, h: t * 4 });
  }

  // Nota de la carta.
  texto('Carta esquemática hecha para este portafolio · no apta para navegación', 3.2, 5.12, { tam: 0.1, peso: 500, cursiva: true, color: C.magenta });

  // Sondas: profundidades en cursiva, con la décima en subíndice como en las cartas.
  ctx.save();
  ctx.fillStyle = 'rgba(24,35,58,0.8)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const tamSonda = 0.112 * S;
  for (let fila = 0, z = -ALTO / 2 + 0.45; z < ALTO / 2 - 0.35; z += 0.42, fila++) {
    for (let x = -ANCHO / 2 + 0.5 + (fila % 2) * 0.24; x < ANCHO / 2 - 0.4; x += 0.48) {
      const jx = x + (hash(Math.round(x * 100), Math.round(z * 100)) - 0.5) * 0.22;
      const jz = z + (hash(Math.round(z * 100), Math.round(x * 100)) - 0.5) * 0.18;
      const h = muestra(alturas, jx, jz);
      if (h >= -0.4) continue;
      const [sx, sy] = aPx(jx, jz);
      const caja = { x: sx - tamSonda, y: sy - tamSonda * 0.7, w: tamSonda * 2, h: tamSonda * 1.4 };
      if (choca(caja)) continue;
      const p = -h;
      const entero = Math.floor(p);
      ctx.font = `italic 500 ${tamSonda}px Archivo`;
      if (p < 10) {
        const decima = Math.floor((p - entero) * 10);
        ctx.fillText(String(entero), sx - tamSonda * 0.18, sy);
        ctx.font = `italic 500 ${tamSonda * 0.68}px Archivo`;
        ctx.fillText(String(decima), sx + tamSonda * 0.32, sy + tamSonda * 0.32);
      } else {
        ctx.fillText(String(Math.round(p)), sx, sy);
      }
    }
  }
  ctx.restore();

  // Filete doble del borde.
  ctx.save();
  ctx.strokeStyle = C.tinta;
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, ancho - 4, alto - 4);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, 12, ancho - 24, alto - 24);
  ctx.restore();

  return lienzo;
}

// ---------------------------------------------------------------- luces

function brillo(luz, t) {
  const p = luz.periodo;
  const f = ((t % p) + p) % p;
  const pulso = (u) => Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u))), 0.6);
  switch (luz.tipo) {
    case 'grupo': {
      const n = luz.destellos;
      const dur = Math.min(0.42, p / (2 * n + 1));
      const sep = dur * 2.1;
      for (let k = 0; k < n; k++) {
        const t0 = k * sep;
        if (f >= t0 && f < t0 + dur) return pulso((f - t0) / dur);
      }
      return 0;
    }
    case 'ocultacion':
      return f < p - 1 ? 1 : 0.06;
    case 'iso':
      return f < p / 2 ? 1 : 0.05;
    case 'largo':
      return f < 2 ? pulso(f / 2) : 0;
    default:
      return 1;
  }
}

function crearHalo() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(214,51,142,1)');
  gr.addColorStop(0.16, 'rgba(214,51,142,0.6)');
  gr.addColorStop(0.45, 'rgba(214,51,142,0.16)');
  gr.addColorStop(1, 'rgba(214,51,142,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------------------------------------------------------------- poses de cámara

function posesBase(movil) {
  if (movil) {
    return {
      // En el celular la bahía queda en la franja bajo el cartucho.
      inicio: { t: [1.3, 0.05], dist: 22.5, polar: 0.6, azim: -0.08, ox: 0, oy: 0.22 },
      lista: { t: [0.6, 0], dist: 15, polar: 0.55, azim: 0, ox: 0, oy: 0 },
      puerto: { t: [5.3, -0.1], dist: 6.5, polar: 0.9, azim: 0.45, ox: 0, oy: 0 },
      univalle: { t: [7, -0.4], dist: 7, polar: 0.85, azim: 0.7, ox: 0, oy: 0 },
      leyenda: { t: [0.8, 0], dist: 15, polar: 0.6, azim: -0.1, ox: 0, oy: 0 },
      boca: { t: [-5.2, 0.8], dist: 8, polar: 1.0, azim: -0.85, ox: 0, oy: 0 },
    };
  }
  return {
    inicio: { t: [1.35, 0.1], dist: 11.8, polar: 0.86, azim: -0.12, ox: 0.215, oy: 0.03 },
    lista: { t: [0.6, 0], dist: 12.5, polar: 0.62, azim: 0, ox: 0, oy: 0 },
    puerto: { t: [5.4, -0.1], dist: 4.6, polar: 0.95, azim: 0.5, ox: 0.2, oy: 0 },
    univalle: { t: [7.1, -0.5], dist: 5.6, polar: 0.9, azim: 0.75, ox: 0, oy: 0 },
    leyenda: { t: [1.1, 0], dist: 11.5, polar: 0.68, azim: -0.08, ox: 0.2, oy: 0 },
    boca: { t: [-5.2, 0.8], dist: 6.4, polar: 1.04, azim: -0.9, ox: 0, oy: 0 },
  };
}

// ---------------------------------------------------------------- la escena

/**
 * Monta la carta en el lienzo. Devuelve la interfaz para moverse por ella.
 * Si el equipo no tiene WebGL, deja la carta impresa como fondo plano.
 */
export async function iniciarCarta({ lienzo, capa, proyectos, otros, reducido = false, alSenal }) {
  const movil = matchMedia('(max-width: 760px)').matches;
  const alturas = construirRelieve();
  const luces = [...proyectos.map((p) => ({ ...p, mayor: true })), ...otros.map((p) => ({ ...p, mayor: false }))];
  const boyas = boyasDelCanal();
  const ladoTextura = movil ? 1280 : 2048;
  const impresa = await pintarCarta(alturas, ladoTextura, luces, boyas);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, powerPreference: 'high-performance' });
  } catch (error) {
    const plana = document.createElement('div');
    plana.className = 'carta-plana';
    plana.style.backgroundImage = `url(${impresa.toDataURL('image/jpeg', 0.86)})`;
    lienzo.replaceWith(plana);
    return { plana: true, irA() {}, trazarRumbo() { return null; }, borrarRumbo() {}, resaltar() {} };
  }

  let dpr = Math.min(window.devicePixelRatio || 1, movil ? 1.5 : 1.6);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(C.papel, 1);

  const escena = new THREE.Scene();
  escena.fog = movil ? new THREE.Fog(C.papel, 17, 40) : new THREE.Fog(C.papel, 12, 30);

  const camara = new THREE.PerspectiveCamera(36, 1, 0.1, 80);

  escena.add(new THREE.HemisphereLight(0xffffff, 0xd9c9a4, 2.35));
  const sol = new THREE.DirectionalLight(0xffffff, 1.05);
  sol.position.set(-5, 9, -4);
  escena.add(sol);

  // Maqueta: el lecho baja en capas, la tierra sube en terrazas.
  const textura = new THREE.CanvasTexture(impresa);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const [segX, segZ] = movil ? [192, 132] : [288, 198];
  const geo = new THREE.PlaneGeometry(ANCHO, ALTO, segX, segZ);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const niveles = new Float32Array(pos.count);
  for (let k = 0; k < pos.count; k++) {
    const b = banda(muestra(alturas, pos.getX(k), pos.getZ(k)));
    pos.setY(k, alturaMaqueta(b));
    niveles[k] = b < 5 ? b + 1 : b - 5;
  }
  geo.setAttribute('aNivel', new THREE.BufferAttribute(niveles, 1));
  geo.computeVertexNormals();

  const revela = { value: reducido ? 2 : 0 };
  const matCarta = new THREE.MeshLambertMaterial({ map: textura });
  matCarta.onBeforeCompile = (sh) => {
    sh.uniforms.uRevela = revela;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aNivel;\nuniform float uRevela;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float kRev = clamp((uRevela - aNivel * 0.12) / 0.55, 0.0, 1.0);
        transformed.y *= 1.0 - pow(1.0 - kRev, 3.0);`,
      );
  };
  escena.add(new THREE.Mesh(geo, matCarta));

  // Base de la maqueta.
  const base = new THREE.Mesh(new THREE.BoxGeometry(ANCHO, 0.42, ALTO), new THREE.MeshLambertMaterial({ color: C.papel3 }));
  base.position.y = -0.17 - 0.21;
  escena.add(base);

  // Lámina de agua.
  const agua = new THREE.Mesh(
    new THREE.PlaneGeometry(ANCHO, ALTO).rotateX(-Math.PI / 2),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      fog: true,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        { uTiempo: { value: 0 }, uOpacidad: { value: reducido ? 1 : 0 }, uColor: { value: new THREE.Color('#5aa3c9') } },
      ]),
      vertexShader: `
        #include <fog_pars_vertex>
        varying vec3 vMundo;
        void main() {
          vec4 mundo = modelMatrix * vec4(position, 1.0);
          vMundo = mundo.xyz;
          vec4 mvPosition = viewMatrix * mundo;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `
        #include <common>
        #include <fog_pars_fragment>
        uniform float uTiempo;
        uniform float uOpacidad;
        uniform vec3 uColor;
        varying vec3 vMundo;
        void main() {
          float o = sin(vMundo.x * 6.0 + vMundo.z * 2.0 + uTiempo * 0.8) * sin(vMundo.z * 7.5 - vMundo.x * 1.5 - uTiempo * 0.65);
          float brillo = smoothstep(0.74, 1.0, o);
          vec3 color = mix(uColor, vec3(1.0), brillo * 0.8);
          gl_FragColor = vec4(color, (0.07 + brillo * 0.15) * uOpacidad);
          #include <colorspace_fragment>
          #include <fog_fragment>
        }`,
    }),
  );
  escena.add(agua);

  // Luces de los proyectos.
  const halo = crearHalo();
  const matTinta = new THREE.MeshLambertMaterial({ color: C.tinta });
  const objetos = luces.map((def, i) => {
    const [x, z] = def.posicion;
    const h = muestra(alturas, x, z);
    const suelo = h >= 0 ? alturaMaqueta(banda(h)) : 0;
    const e = def.mayor ? 1 : 0.72;
    const grupo = new THREE.Group();
    grupo.position.set(x, 0, z);
    const pie = new THREE.Mesh(new THREE.CylinderGeometry(0.055 * e, 0.065 * e, 0.03, 18), matTinta);
    pie.position.y = suelo + 0.015;
    const asta = new THREE.Mesh(new THREE.CylinderGeometry(0.009 * e, 0.009 * e, 0.3 * e, 6), matTinta);
    asta.position.y = suelo + 0.15 * e;
    const linterna = new THREE.Mesh(new THREE.SphereGeometry(0.036 * e, 14, 10), new THREE.MeshBasicMaterial({ color: C.magentaLuz }));
    const cima = suelo + 0.3 * e + 0.02;
    linterna.position.y = cima;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, transparent: true, depthWrite: false, opacity: 0.9 }));
    sprite.scale.setScalar(0.62 * e);
    sprite.position.y = cima;
    grupo.add(pie, asta, linterna, sprite);
    escena.add(grupo);

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.tabIndex = -1;
    boton.className = `senal${def.mayor ? '' : ' senal-menor'}`;
    boton.innerHTML = `<span class="senal-texto"><span class="senal-nombre"></span><span class="senal-car"></span></span>`;
    boton.querySelector('.senal-nombre').textContent = def.nombre;
    boton.querySelector('.senal-car').textContent = def.caracteristica;
    boton.hidden = !def.mayor;
    boton.style.opacity = '0';
    boton.addEventListener('click', () => alSenal?.(def));
    capa.append(boton);

    return { def, linterna, sprite, boton, cima: new THREE.Vector3(x, cima, z), fase: i * 1.37, e };
  });

  // Boyas del canal.
  const boyasObj = boyas.map((b) => {
    const color = b.color === 'rojo' ? C.rojo : C.verde;
    const geoBoya = b.color === 'rojo' ? new THREE.ConeGeometry(0.035, 0.08, 12) : new THREE.CylinderGeometry(0.03, 0.03, 0.07, 12);
    const cuerpo = new THREE.Mesh(geoBoya, new THREE.MeshLambertMaterial({ color }));
    cuerpo.position.set(b.x, 0.04, b.z);
    const luz = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), new THREE.MeshBasicMaterial({ color }));
    luz.position.set(b.x, 0.095, b.z);
    escena.add(cuerpo, luz);
    return { luz, fase: b.fase };
  });

  // ------------------------------------------------------------ rumbo
  const grupoRumbo = new THREE.Group();
  escena.add(grupoRumbo);
  const progresoRumbo = { value: 0 };
  let etiquetasRumbo = [];
  let animRumbo = null;

  function borrarRumbo() {
    grupoRumbo.children.slice().forEach((m) => {
      m.geometry.dispose();
      grupoRumbo.remove(m);
    });
    etiquetasRumbo.forEach((e) => e.el.remove());
    etiquetasRumbo = [];
    objetos.forEach((o) => {
      if (!o.def.mayor) o.boton.hidden = true;
      o.boton.classList.remove('activa');
    });
  }

  const matRumbo = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uProgreso: progresoRumbo, uTotal: { value: 1 }, uColor: { value: new THREE.Color(C.magenta) } },
    vertexShader: `
      attribute float aDist;
      varying float vDist;
      void main() {
        vDist = aDist;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform float uProgreso;
      uniform float uTotal;
      uniform vec3 uColor;
      varying float vDist;
      void main() {
        if (vDist > uProgreso * uTotal) discard;
        gl_FragColor = vec4(uColor, 0.95);
        #include <colorspace_fragment>
      }`,
  });
  const matAnillo = new THREE.MeshBasicMaterial({ color: C.magenta, transparent: true, opacity: 0.95, depthWrite: false });

  function trazarRumbo(ids) {
    borrarRumbo();
    const tramo = ids.map((id) => objetos.find((o) => o.def.id === id)).filter(Boolean);
    if (!tramo.length) return null;
    const Y = 0.14;
    const puntos = tramo.map((o) => new THREE.Vector3(o.def.posicion[0], Y, o.def.posicion[1]));

    // Cinta del rumbo, tramo a tramo, con la distancia acumulada para dibujarla de a poco.
    const vertices = [];
    const dist = [];
    const indices = [];
    let acum = 0;
    const ancho = 0.016;
    for (let i = 0; i < puntos.length - 1; i++) {
      const a = puntos[i];
      const b = puntos[i + 1];
      const d = new THREE.Vector3().subVectors(b, a);
      const largo = d.length();
      const n = new THREE.Vector3(-d.z, 0, d.x).normalize().multiplyScalar(ancho);
      const base = vertices.length / 3;
      vertices.push(a.x + n.x, Y, a.z + n.z, a.x - n.x, Y, a.z - n.z, b.x + n.x, Y, b.z + n.z, b.x - n.x, Y, b.z - n.z);
      dist.push(acum, acum, acum + largo, acum + largo);
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
      acum += largo;

      // Etiqueta del tramo: rumbo verdadero y distancia en millas.
      const rumbo = (((Math.atan2(d.x, -d.z) * 180) / Math.PI) + 360) % 360;
      const el = document.createElement('span');
      el.className = 'rumbo-etiqueta';
      el.textContent = `Rv ${String(Math.round(rumbo)).padStart(3, '0')}° · ${(largo * MILLAS_POR_UNIDAD).toFixed(1).replace('.', ',')} M`;
      el.style.opacity = '0';
      capa.append(el);
      etiquetasRumbo.push({ el, punto: new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), desde: (acum - largo / 2) });
    }
    if (vertices.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      g.setAttribute('aDist', new THREE.Float32BufferAttribute(dist, 1));
      g.setIndex(indices);
      matRumbo.uniforms.uTotal.value = Math.max(acum, 0.001);
      grupoRumbo.add(new THREE.Mesh(g, matRumbo));
    }
    for (const p of puntos) {
      const anillo = new THREE.Mesh(new THREE.RingGeometry(0.075, 0.1, 28).rotateX(-Math.PI / 2), matAnillo);
      anillo.position.copy(p);
      grupoRumbo.add(anillo);
    }
    tramo.forEach((o) => {
      o.boton.hidden = false;
      o.boton.classList.add('activa');
    });

    progresoRumbo.value = reducido ? 1 : 0;
    animRumbo = reducido ? null : { inicio: tiempo, total: acum };

    // Encuadre: todos los puntos del rumbo a la vista.
    const caja = new THREE.Box3().setFromPoints(puntos);
    const centro = caja.getCenter(new THREE.Vector3());
    const tam = caja.getSize(new THREE.Vector3());
    const tanMedio = Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
    const necesario = Math.max(tam.x / (2 * tanMedio * Math.max(camara.aspect, 0.5)), tam.z / (2 * tanMedio));
    objetivo.t = [centro.x, centro.z];
    objetivo.dist = Math.min(16, Math.max(3.6, necesario * 1.45 + 2.2));
    objetivo.polar = 0.72;
    objetivo.azim = -0.05;
    return { distancia: acum * MILLAS_POR_UNIDAD, tramos: tramo.length };
  }

  // ------------------------------------------------------------ cámara
  const poses = posesBase(movil);
  const actual = reducido ? { ...poses.inicio, t: [...poses.inicio.t] } : { t: [0.6, 0.2], dist: 17, polar: 0.12, azim: -0.12, ox: 0.15, oy: 0.03 };
  const objetivo = { ...poses.inicio, t: [...poses.inicio.t] };
  const puntero = { x: 0, y: 0, ax: 0, ay: 0 };
  if (!movil && !reducido) {
    window.addEventListener('pointermove', (e) => {
      puntero.x = (e.clientX / window.innerWidth) * 2 - 1;
      puntero.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  function irA(clave, lado) {
    const def = luces.find((l) => l.id === clave && l.mayor);
    let p;
    if (def) {
      const izquierda = lado !== 'der';
      p = movil
        ? { t: def.posicion, dist: 5.8, polar: 0.95, azim: 0.3, ox: 0, oy: 0.12 }
        : { t: def.posicion, dist: 3.7, polar: 0.98, azim: izquierda ? 0.38 : -0.38, ox: izquierda ? 0.24 : -0.24, oy: 0.02 };
      objetos.forEach((o) => o.boton.classList.toggle('activa', o.def.id === clave));
    } else if (poses[clave]) {
      p = poses[clave];
      if (clave !== 'inicio') objetos.forEach((o) => o.def.mayor && o.boton.classList.remove('activa'));
    } else {
      return;
    }
    objetivo.t = [...p.t];
    objetivo.dist = p.dist;
    objetivo.polar = p.polar;
    objetivo.azim = p.azim;
    objetivo.ox = p.ox;
    objetivo.oy = p.oy;
  }

  // ------------------------------------------------------------ tamaño y bucle
  let ancho = 0;
  let alto = 0;
  function medir() {
    ancho = window.innerWidth;
    alto = window.innerHeight;
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
  }
  medir();
  window.addEventListener('resize', medir);

  // Reloj propio: el tiempo de la escena solo corre mientras la pestaña está visible.
  let tiempo = 0;
  let anterior = performance.now();
  const v = new THREE.Vector3();
  const objetivoMundo = new THREE.Vector3();
  let promedio = 16;
  let cuadros = 0;
  let visible = true;
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    anterior = performance.now();
  });

  const entrada = reducido ? null : { inicio: 0.15 };

  // Paneles de contenido que tapan la carta: las etiquetas no se dibujan debajo de ellos.
  let obstaculos = [];
  let sucio = true;
  let vueltasObstaculos = 0;
  const marcarSucio = () => {
    sucio = true;
  };
  window.addEventListener('scroll', marcarSucio, { passive: true });
  window.addEventListener('resize', marcarSucio);
  function medirObstaculos() {
    obstaculos = [];
    for (const el of document.querySelectorAll('.barra, .cartucho, .trazador, .lamina, .plano')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.bottom > 0 && r.top < alto) obstaculos.push(r);
    }
    sucio = false;
    vueltasObstaculos = 0;
  }

  function cuadro(ahora = performance.now()) {
    requestAnimationFrame(cuadro);
    if (!visible) return;
    const dt = Math.min((ahora - anterior) / 1000, 0.1);
    anterior = ahora;
    tiempo += dt;
    const t = tiempo;

    // Entrada: las capas suben y el agua aparece.
    if (entrada) {
      const u = Math.max(0, t - entrada.inicio);
      revela.value = Math.min(1.3, u / 1.25);
      agua.material.uniforms.uOpacidad.value = Math.min(1, Math.max(0, (u - 0.9) / 0.6));
      if (u > 1.6) {
        capa.classList.add('lista');
      }
    }

    // Cámara con amortiguación exponencial: se puede interrumpir en cualquier momento.
    const k = reducido ? 1 : 1 - Math.exp(-dt * 2.4);
    actual.t[0] += (objetivo.t[0] - actual.t[0]) * k;
    actual.t[1] += (objetivo.t[1] - actual.t[1]) * k;
    actual.dist += (objetivo.dist - actual.dist) * k;
    actual.polar += (objetivo.polar - actual.polar) * k;
    actual.azim += (objetivo.azim - actual.azim) * k;
    actual.ox += (objetivo.ox - actual.ox) * k;
    actual.oy += (objetivo.oy - actual.oy) * k;
    const kp = 1 - Math.exp(-dt * 3);
    puntero.ax += (puntero.x - puntero.ax) * kp;
    puntero.ay += (puntero.y - puntero.ay) * kp;

    const polar = actual.polar + puntero.ay * 0.035;
    const azim = actual.azim + puntero.ax * 0.06;
    objetivoMundo.set(actual.t[0], 0, actual.t[1]);
    camara.position.set(
      objetivoMundo.x + actual.dist * Math.sin(polar) * Math.sin(azim),
      actual.dist * Math.cos(polar),
      objetivoMundo.z + actual.dist * Math.sin(polar) * Math.cos(azim),
    );
    camara.lookAt(objetivoMundo);
    camara.setViewOffset(ancho, alto, -actual.ox * ancho, -actual.oy * alto, ancho, alto);

    // Agua y luces.
    agua.material.uniforms.uTiempo.value = reducido ? 0 : t;
    for (const o of objetos) {
      const b = reducido ? 0.85 : brillo(o.def.luz, t + o.fase);
      o.sprite.material.opacity = 0.15 + b * 0.85;
      o.sprite.scale.setScalar((0.34 + b * 0.32) * o.e);
      o.linterna.material.color.set(b > 0.3 ? C.magentaLuz : C.magenta);
    }
    for (const b of boyasObj) {
      const on = reducido ? 1 : brillo({ tipo: 'grupo', destellos: 1, periodo: 4 }, t + b.fase);
      b.luz.scale.setScalar(0.7 + on * 0.9);
    }

    // Rumbo que se dibuja.
    if (animRumbo) {
      const u = Math.min(1, (t - animRumbo.inicio) / 1.6);
      progresoRumbo.value = 1 - Math.pow(1 - u, 3);
      if (u >= 1) animRumbo = null;
    }

    renderer.render(escena, camara);

    // Etiquetas DOM sobre las luces y los tramos. Ninguna se dibuja bajo un panel ni encima de otra:
    // si choca a la derecha de su luz se prueba a la izquierda, y si tampoco cabe se oculta.
    if (sucio || ++vueltasObstaculos > 45) medirObstaculos();
    const lista = capa.classList.contains('lista');
    const colocadas = [];
    const choca = (a) =>
      obstaculos.some((o) => a.x < o.right && a.x + a.w > o.left && a.y < o.bottom && a.y + a.h > o.top) ||
      colocadas.some((c) => a.x < c.x + c.w && a.x + a.w > c.x && a.y < c.y + c.h && a.y + a.h > c.y);
    for (const o of objetos) {
      if (o.boton.hidden) continue;
      v.copy(o.cima).project(camara);
      const px = ((v.x + 1) / 2) * ancho;
      const py = ((1 - v.y) / 2) * alto;
      if (!o.anchoEtiqueta) {
        o.anchoEtiqueta = o.boton.offsetWidth;
        o.altoEtiqueta = o.boton.offsetHeight;
      }
      const w = o.anchoEtiqueta;
      const h = o.altoEtiqueta;
      let caja = { x: px - 6, y: py - h - 14, w, h };
      if (caja.x + w > ancho - 18 || choca(caja)) {
        const izquierda = { x: px - w + 6, y: caja.y, w, h };
        if (!choca(izquierda)) caja = izquierda;
      }
      const fuera = v.z > 1 || px < 0 || px > ancho || py < 0 || py > alto;
      const luzTapada = obstaculos.some((r) => px > r.left && px < r.right && py > r.top && py < r.bottom);
      const ver = lista && !fuera && !luzTapada && !choca(caja);
      o.boton.style.opacity = ver ? '1' : '0';
      o.boton.style.pointerEvents = ver ? '' : 'none';
      o.boton.style.transform = `translate3d(${caja.x}px, ${py}px, 0) translate(0, -100%)`;
      if (ver) colocadas.push(caja);
    }
    for (const e of etiquetasRumbo) {
      v.copy(e.punto).project(camara);
      const px = ((v.x + 1) / 2) * ancho;
      const py = ((1 - v.y) / 2) * alto;
      if (!e.ancho) {
        e.ancho = e.el.offsetWidth;
        e.alto = e.el.offsetHeight;
      }
      const caja = { x: px - e.ancho / 2, y: py - e.alto / 2, w: e.ancho, h: e.alto };
      const llego = progresoRumbo.value * matRumbo.uniforms.uTotal.value >= e.desde;
      const ver = llego && v.z < 1 && !choca(caja);
      e.el.style.opacity = ver ? '1' : '0';
      e.el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      if (ver) colocadas.push(caja);
    }

    // Si el equipo no da abasto, baja la resolución.
    promedio = promedio * 0.95 + dt * 1000 * 0.05;
    if (++cuadros > 120 && promedio > 42 && dpr > 0.75) {
      dpr = Math.max(0.75, dpr - 0.25);
      renderer.setPixelRatio(dpr);
      renderer.setSize(ancho, alto, false);
      cuadros = 0;
    }
  }
  if (reducido) capa.classList.add('lista');
  cuadro();

  return {
    plana: false,
    irA,
    trazarRumbo,
    borrarRumbo,
    resaltar(id) {
      objetos.forEach((o) => o.boton.classList.toggle('activa', o.def.id === id));
    },
  };
}
