// Lo que el mapa de habilidades necesita de cada proyecto. Los textos viven en index.html.

/** Proyectos: `destacado` son los que tienen video. `destino` es su sección en la página. */
export const PROYECTOS = [
  { id: 'mediflow', nombre: 'MediFlow', destacado: true, habilidades: ['react', 'typescript', 'ia', 'python', 'tailwind', 'equipo'], fecha: 2026.72, destino: '#p-mediflow' },
  { id: 'finnets', nombre: 'Finnets', destacado: true, habilidades: ['react', 'movil', 'typescript', 'nextjs', 'supabase', 'ia'], fecha: 2026.78, destino: '#p-finnets' },
  { id: 'english-buddy', nombre: 'English Buddy', destacado: true, habilidades: ['react', 'nextjs', 'typescript', 'supabase', 'ia', 'tailwind'], fecha: 2026.87, destino: '#p-english-buddy' },
  { id: 'tu-guia', nombre: 'Tu Guía Inteligente', destacado: true, habilidades: ['react', 'typescript', '3d', 'ia', 'supabase', 'diseno'], fecha: 2026.88, destino: '#p-tu-guia' },
  { id: 'gestor-rutas', nombre: 'Gestor de Rutas', habilidades: ['react', 'typescript', 'algoritmos'], fecha: 2026.9, destino: '#otro-gestor-rutas' },
  { id: 'asistente-univalle', nombre: 'Asistente Univalle', habilidades: ['python', 'ia'], fecha: 2026.84, destino: '#otro-asistente-univalle' },
  { id: 'afro-univalluna', nombre: 'Afro Univalluna', habilidades: ['diseno'], fecha: 2026.6, destino: '#otro-afro-univalluna' },
  { id: 'alza-tu-voz', nombre: 'Alza tu Voz', habilidades: ['vue', 'python', 'ia'], fecha: 2026.68, destino: '#otro-alza-tu-voz' },
  { id: 'luminastore', nombre: 'LuminaStore', habilidades: ['python', 'ia'], fecha: 2026.55, destino: '#otro-luminastore' },
  { id: 'parqueapp', nombre: 'ParqueApp', habilidades: ['vue', 'tailwind', 'equipo'], fecha: 2025.3, destino: '#otro-parqueapp' },
];

/** Habilidades del mapa. `ficha` las muestra como filtro en la portada. */
export const HABILIDADES = [
  { id: 'react', nombre: 'React', ficha: true },
  { id: 'typescript', nombre: 'TypeScript', ficha: true },
  { id: 'ia', nombre: 'IA y agentes', ficha: true },
  { id: 'movil', nombre: 'Móvil', ficha: true },
  { id: 'nextjs', nombre: 'Next.js', ficha: true },
  { id: 'python', nombre: 'Python', ficha: true },
  { id: 'supabase', nombre: 'Supabase', ficha: true },
  { id: 'vue', nombre: 'Vue', ficha: true },
  { id: 'tailwind', nombre: 'Tailwind CSS', ficha: false },
  { id: '3d', nombre: 'Three.js', ficha: false },
  { id: 'algoritmos', nombre: 'Algoritmos', ficha: false },
  { id: 'equipo', nombre: 'Scrum y Git', ficha: false },
  { id: 'diseno', nombre: 'Diseño web', ficha: false },
];
