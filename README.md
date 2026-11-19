# Carta de proyectos · Cristian David Rios

Portafolio de Cristian David Rios Rivas, desarrollador frontend y mobile de Buenaventura, en el Pacífico colombiano.

**En línea:** <https://mi-portafoliocristianrios.vercel.app>

El sitio es una carta náutica de la Bahía de Buenaventura en 3D. Cada proyecto es una luz con su característica, como en las cartas de verdad (MediFlow destella dos veces cada 6 segundos, Finnets es una luz rápida), y el trazador de rumbo une en la carta los proyectos donde usé una habilidad: elige React, IA o Supabase y la carta dibuja la derrota entre ellos, con su rumbo y su distancia en millas.

## Qué hay

- **Proyectos con video:** MediFlow, Finnets, English Buddy y Tu Guía Inteligente. Cada uno muestra un avance mudo mientras está a la vista y abre su video completo (voz en español, subtítulos en español e inglés) en una sala con controles propios.
- **Lista de luces:** el resto de proyectos (Gestor de Rutas, Asistente virtual de la Univalle, Revista Afro Univalluna, Alza tu Voz, Agente LuminaStore y ParqueApp).
- **Bitácora:** experiencia, formación e idiomas.
- **Certificados:** Oracle, ONE AI for Tech (con los enlaces públicos de verificación de Alura), SENA, Cisco y MinTIC.
- **Leyenda:** las herramientas con las que trabajo; cada una traza su rumbo en la carta.
- **Hoja de vida** en PDF: `Cristian_Rios_CV.pdf`.

## Cómo está hecho

Sitio estático, sin paso de construcción:

| Archivo | Qué hace |
| --- | --- |
| `index.html` | Todo el contenido, legible aunque falle JavaScript o WebGL. |
| `assets/css/carta.css` | El mundo de la carta: papel, tintes de sonda, tierra, tinta y el magenta de las luces. Letra Archivo (Omnibus-Type). |
| `assets/js/carta3d.js` | La bahía en Three.js: relieve por capas según la profundidad, sondas, rosa de los vientos, canal balizado, luces y el trazado de rumbos. La geografía es esquemática y no sirve para navegar. |
| `assets/js/main.js` | Trazador de rumbo, cámara que sigue al scroll, avances de video y la sala de video. |
| `assets/js/datos.js` | Posición, característica de luz y habilidades de cada proyecto. |
| `assets/video/` | Los cuatro videos en 720p y sus avances. |

Respeta `prefers-reduced-motion`: la carta queda quieta, sin destellos ni vuelos de cámara. Si el equipo no tiene WebGL, la carta se muestra impresa como fondo plano.

## Verlo en local

```powershell
python -m http.server 5180
```

y abre <http://localhost:5180>.

---

Diseño y código: Cristian David Rios Rivas.
