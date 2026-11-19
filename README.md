# Cristian David Rios · Portafolio

Portafolio de Cristian David Rios Rivas, desarrollador frontend y mobile.

**En línea:** <https://mi-portafoliocristianrios.vercel.app>

Un portafolio profesional con un mapa de habilidades en 3D en la portada: los proyectos orbitan en un anillo y cada tecnología queda cerca de los proyectos que la usan. Elige una habilidad y el mapa enciende sus conexiones y la página resalta los proyectos que la usan. También tiene un buscador rápido (Ctrl+K).

## Qué hay

- **Proyectos con video:** MediFlow, Finnets, English Buddy y Tu Guía Inteligente. Cada uno muestra un avance mudo mientras está a la vista y abre su video completo (voz en español, subtítulos en español e inglés) en una sala con controles propios.
- **Otros proyectos:** Gestor de Rutas, Asistente virtual de la Univalle, Revista Afro Univalluna, Alza tu Voz, Agente LuminaStore y ParqueApp.
- **Experiencia:** trabajo, formación e idiomas.
- **Certificados:** Oracle, ONE AI for Tech (con los enlaces públicos de verificación de Alura), SENA, Cisco y MinTIC.
- **Tecnologías:** las herramientas con las que trabajo.
- **Hoja de vida** en PDF: `Cristian_Rios_CV.pdf`.

## Cómo está hecho

Sitio estático, sin paso de construcción:

| Archivo | Qué hace |
| --- | --- |
| `index.html` | Todo el contenido, legible aunque falle JavaScript o WebGL. |
| `assets/css/estilos.css` | Estilos: blanco frío, tinta, acento cobalto; letras Geist y Geist Mono. |
| `assets/js/grafo3d.js` | El mapa de habilidades en Three.js: anillo de proyectos, tecnologías dentro, giro con inercia y señales al filtrar. |
| `assets/js/main.js` | Filtro por habilidad, buscador Ctrl+K, avances de video y la sala de video. |
| `assets/js/datos.js` | Proyectos y tecnologías que usa cada uno. |
| `assets/video/` | Los cuatro videos en 720p y sus avances. |

Respeta `prefers-reduced-motion`: el mapa queda quieto. Si el equipo no tiene WebGL, el mapa se reemplaza por un aviso y el filtro por habilidad sigue funcionando.

## Verlo en local

```powershell
python -m http.server 5180
```

y abre <http://localhost:5180>.

---

Diseño y código: Cristian David Rios Rivas.
