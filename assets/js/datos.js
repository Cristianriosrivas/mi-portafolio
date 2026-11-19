// Lo que la carta necesita saber de cada proyecto. Los textos viven en index.html.
// Posiciones en unidades de la carta: x hacia el este, z hacia el sur (la bahía abre al oeste).

/** Proyectos con video: señales mayores, con su característica de luz real. */
export const PROYECTOS = [
  {
    id: 'mediflow',
    nombre: 'MediFlow',
    caracteristica: 'Fl(2) 6s',
    luz: { tipo: 'grupo', destellos: 2, periodo: 6 },
    posicion: [-1.6, -1.15],
    habilidades: ['react', 'typescript', 'ia', 'python', 'tailwind', 'equipo'],
    fecha: 2026.72,
    destino: '#p-mediflow',
  },
  {
    id: 'finnets',
    nombre: 'Finnets',
    caracteristica: 'Q 1s',
    luz: { tipo: 'grupo', destellos: 1, periodo: 1 },
    posicion: [1.25, -1.55],
    habilidades: ['react', 'movil', 'typescript', 'nextjs', 'supabase', 'ia'],
    fecha: 2026.78,
    destino: '#p-finnets',
  },
  {
    id: 'english-buddy',
    nombre: 'English Buddy',
    caracteristica: 'Oc 4s',
    luz: { tipo: 'ocultacion', periodo: 4 },
    posicion: [3.0, 1.55],
    habilidades: ['react', 'nextjs', 'typescript', 'supabase', 'ia', 'tailwind'],
    fecha: 2026.87,
    destino: '#p-english-buddy',
  },
  {
    id: 'tu-guia',
    nombre: 'Tu Guía Inteligente',
    caracteristica: 'Iso 2s',
    luz: { tipo: 'iso', periodo: 2 },
    posicion: [4.15, -0.35],
    habilidades: ['react', 'typescript', '3d', 'ia', 'supabase', 'diseno'],
    fecha: 2026.88,
    destino: '#p-tu-guia',
  },
];

/** La "Lista de luces": señales menores, que se nombran cuando un rumbo pasa por ellas. */
export const OTROS = [
  { id: 'gestor-rutas', nombre: 'Gestor de Rutas', caracteristica: 'Fl 5s', luz: { tipo: 'grupo', destellos: 1, periodo: 5 }, posicion: [5.75, 0.1], habilidades: ['react', 'typescript', 'algoritmos'], fecha: 2026.9, destino: '#luz-gestor-rutas' },
  { id: 'asistente-univalle', nombre: 'Asistente Univalle', caracteristica: 'Fl(3) 10s', luz: { tipo: 'grupo', destellos: 3, periodo: 10 }, posicion: [7.4, 0.0], habilidades: ['python', 'ia'], fecha: 2026.84, destino: '#luz-asistente-univalle' },
  { id: 'afro-univalluna', nombre: 'Afro Univalluna', caracteristica: 'Oc(2) 8s', luz: { tipo: 'ocultacion', periodo: 8 }, posicion: [7.55, -0.95], habilidades: ['diseno'], fecha: 2026.6, destino: '#luz-afro-univalluna' },
  { id: 'alza-tu-voz', nombre: 'Alza tu Voz', caracteristica: 'LFl 10s', luz: { tipo: 'largo', periodo: 10 }, posicion: [0.6, 1.45], habilidades: ['vue', 'python', 'ia'], fecha: 2026.68, destino: '#luz-alza-tu-voz' },
  { id: 'luminastore', nombre: 'LuminaStore', caracteristica: 'Q(3) 10s', luz: { tipo: 'grupo', destellos: 3, periodo: 10 }, posicion: [-3.6, 0.15], habilidades: ['python', 'ia'], fecha: 2026.55, destino: '#luz-luminastore' },
  { id: 'parqueapp', nombre: 'ParqueApp', caracteristica: 'Fl 3s', luz: { tipo: 'grupo', destellos: 1, periodo: 3 }, posicion: [2.3, -0.55], habilidades: ['vue', 'tailwind', 'equipo'], fecha: 2025.3, destino: '#luz-parqueapp' },
];

/** Habilidades que trazan rumbo. `claves` son las palabras que las reconocen al escribir. */
export const HABILIDADES = [
  { id: 'react', nombre: 'React', ficha: true, claves: ['react', 'jsx', 'hooks', 'frontend', 'front'] },
  { id: 'typescript', nombre: 'TypeScript', ficha: true, claves: ['typescript', 'ts', 'tipado', 'javascript', 'js'] },
  { id: 'movil', nombre: 'Móvil', ficha: true, claves: ['react native', 'native', 'expo', 'movil', 'mobile', 'android', 'ios', 'celular'] },
  { id: 'nextjs', nombre: 'Next.js', ficha: true, claves: ['next', 'nextjs', 'next.js', 'app router', 'ssr'] },
  { id: 'ia', nombre: 'IA y agentes', ficha: true, claves: ['ia', 'ai', 'inteligencia artificial', 'inteligencia', 'agente', 'agentes', 'llm', 'gemini', 'langgraph', 'langchain', 'rag', 'groq', 'cohere', 'chatbot', 'chat', 'ollama'] },
  { id: 'python', nombre: 'Python', ficha: true, claves: ['python', 'fastapi', 'pytest', 'streamlit', 'backend', 'api'] },
  { id: 'supabase', nombre: 'Supabase', ficha: true, claves: ['supabase', 'postgres', 'postgresql', 'sql', 'base de datos', 'bases de datos', 'rls'] },
  { id: 'vue', nombre: 'Vue', ficha: true, claves: ['vue', 'vue 3', 'vue3', 'pinia'] },
  { id: '3d', nombre: '3D', ficha: false, claves: ['3d', 'three', 'three.js', 'threejs', 'webgl'] },
  { id: 'tailwind', nombre: 'Tailwind CSS', ficha: false, claves: ['tailwind', 'css'] },
  { id: 'algoritmos', nombre: 'Algoritmos', ficha: false, claves: ['algoritmos', 'algoritmo', 'grafos', 'grafo', 'dijkstra', 'estructuras de datos', 'bfs', 'dfs'] },
  { id: 'equipo', nombre: 'Trabajo en equipo', ficha: false, claves: ['scrum', 'equipo', 'agil', 'agile', 'git', 'github', 'pull request', 'product owner'] },
  { id: 'diseno', nombre: 'Diseño web', ficha: false, claves: ['diseno', 'diseño', 'ui', 'ux', 'joomla', 'figma', 'cms'] },
];
