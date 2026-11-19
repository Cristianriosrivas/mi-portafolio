---
name: Carta de proyectos
description: El portafolio de Cristian David Rios como carta náutica de la Bahía de Buenaventura.
colors:
  chart-magenta: "#b8006f"
  light-magenta: "#d6338e"
  chart-ink: "#18233a"
  ink-secondary: "#3a4862"
  ink-muted: "#5d6a82"
  chart-white: "#f8f9f7"
  inset-paper: "#eef0ec"
  model-base: "#dfe2dc"
  land-buff: "#efd9a6"
  land-buff-deep: "#e2c27f"
  sounding-shallow: "#9fcbe3"
  sounding-mid: "#bcdcec"
  sounding-light: "#d6eaf3"
  sounding-faint: "#e9f3f7"
  buoy-red: "#c8102e"
  buoy-green: "#00804a"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 5.4vw, 5.25rem)"
    fontWeight: 850
    lineHeight: 0.92
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 122"
  headline:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(2.2rem, 4.6vw, 4rem)"
    fontWeight: 850
    lineHeight: 1.05
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 122"
  title:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)"
    fontWeight: 850
    lineHeight: 1.05
    fontVariation: "'wdth' 120"
  body:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  water:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 560
    lineHeight: 1.3
    fontVariation: "'wdth' 86"
  label:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.1em"
    fontVariation: "'wdth' 118"
  display-compact:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 10vw, 3.1rem)"
    fontWeight: 850
    lineHeight: 0.92
    fontVariation: "'wdth' 122"
  headline-compact:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.75rem, 8vw, 2.6rem)"
    fontWeight: 850
    lineHeight: 1.05
    fontVariation: "'wdth' 122"
  title-compact:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 7.6vw, 2.2rem)"
    fontWeight: 850
    lineHeight: 1.05
    fontVariation: "'wdth' 120"
  dialog-title:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)"
    fontWeight: 850
    lineHeight: 1.05
    fontVariation: "'wdth' 120"
  role-line:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.1rem, 1.6vw, 1.25rem)"
    fontWeight: 560
    lineHeight: 1.3
    fontVariation: "'wdth' 86"
  contact-line:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.0625rem, 2.2vw, 1.25rem)"
    fontWeight: 700
    lineHeight: 1.3
    fontVariation: "'wdth' 92"
  subtitle:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.2
    fontVariation: "'wdth' 112"
  ui:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.3
    fontVariation: "'wdth' 108"
  small:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 500
    lineHeight: 1.45
  micro:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.1
    fontVariation: "'wdth' 82"
rounded:
  tag: "2px"
  control: "3px"
  chip: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(72px, 12vh, 140px)"
  panel: "clamp(26px, 4vw, 52px)"
components:
  button-primary:
    backgroundColor: "{colors.chart-ink}"
    textColor: "{colors.chart-white}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.chart-magenta}"
    textColor: "{colors.chart-white}"
  button-outline:
    backgroundColor: "{colors.chart-white}"
    textColor: "{colors.chart-ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  button-magenta:
    backgroundColor: "{colors.chart-magenta}"
    textColor: "{colors.chart-white}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  chip-skill:
    backgroundColor: "{colors.chart-white}"
    textColor: "{colors.chart-ink}"
    rounded: "{rounded.chip}"
    padding: "0 11px"
    height: "32px"
  chip-skill-active:
    backgroundColor: "{colors.chart-magenta}"
    textColor: "{colors.chart-white}"
  video-play:
    backgroundColor: "{colors.chart-magenta}"
    textColor: "{colors.chart-white}"
    rounded: "{rounded.chip}"
    height: "48px"
---

# Design System: Carta de proyectos

## Overview

**Creative North Star: "La carta de la bahía"**

Todo el sitio es una carta náutica de la Bahía de Buenaventura impresa y levantada en relieve. El agua profunda es papel blanco, la somera se tiñe de azul por bandas de profundidad, la tierra es beige de carta, los textos son tinta azul negra y el magenta, el color con que las cartas marcan luces, rumbos y avisos, es la única voz de acento. Los proyectos son luces con su característica real (Fl(2) 6s, Q 1s, Oc 4s, Iso 2s), el contenido son las piezas impresas de una carta (cartucho de título, planos de detalle, lista de luces, notas, leyenda) y la interacción es navegación: trazar un rumbo entre luces.

La carta en 3D vive detrás de todo (Three.js, una sola escena continua) y el contenido flota encima, siempre en el plano más cercano. La densidad cambia por sección: la portada respira sobre la carta; las láminas de contenido son papel opaco con filete; la cámara vuela a la luz de cada proyecto mientras se lee su plano.

El papel se pasó a blanco neutro (#f8f9f7) en vez de un blanco cálido: las cartas impresas dejan el agua profunda en blanco y el calor lo pone la tierra. Así el fondo no cae en el crema genérico.

**Key Characteristics:**
- Una carta náutica de verdad como mundo: sondas en cursiva con décimas en subíndice, isóbatas, rosa de los vientos, canal balizado (IALA B), escala gráfica en millas.
- Magenta reservado para luces, rumbos, notas y la acción de ver video.
- Archivo con su eje de ancho: mayúsculas expandidas para rótulos de tierra y títulos, cursiva estrecha para nombres de agua, sondas y datos.
- Filetes dobles y marcos graduados en vez de tarjetas redondeadas.
- Movimiento como navegación: la cámara se amortigua hacia cada destino y se puede interrumpir.

## Colors

Una carta impresa: papel, tintes de sonda, tierra y tinta, con el magenta de las luces como único acento.

### Primary
- **Magenta de carta** (chart-magenta): luces, rumbos trazados, notas de certificaciones, la característica de cada luz, el rol en el cartucho, el botón de ver video, la selección de texto y el foco.
- **Magenta de luz** (light-magenta): el destello encendido de una luz en 3D y el hover del botón grande de reproducir.

### Secondary
- **Rojo de boya** (buoy-red) y **verde de boya** (buoy-green): solo las boyas del canal, según IALA B (rojo a estribor al entrar). No se usan en la interfaz.

### Neutral
- **Tinta de carta** (chart-ink): textos principales, filetes, botón primario, barra superior.
- **Tinta secundaria** (ink-secondary): párrafos y nombres de agua.
- **Tinta tenue** (ink-muted): datos de apoyo (fechas, emisores, notas al pie).
- **Blanco de carta** (chart-white): fondo de la página y de las láminas; el agua profunda en la carta.
- **Papel de plano** (inset-paper): el fondo de los planos de detalle que enmarcan los videos.
- **Base de maqueta** (model-base): los costados del bloque 3D.
- **Tierra de carta** (land-buff, land-buff-deep): la tierra en la carta, en terrazas por altura.
- **Tintes de sonda** (sounding-shallow a sounding-faint): bandas de 0–2, 2–5, 5–10 y 10–20 m; el más tenue también marca la fila de la lista de luces por donde pasa un rumbo.

### Named Rules
**La regla de las luces.** El magenta solo marca lo que en una carta sería luz, rumbo o aviso: características, derrotas, notas y la acción de ver un video. Nunca es fondo de sección ni adorno.

**La regla del papel blanco.** El fondo es blanco de carta, no crema. El calor del mundo lo ponen la tierra y la tinta.

## Typography

**Display Font:** Archivo (con Arial Narrow de respaldo)
**Body Font:** Archivo
**Label Font:** Archivo, mayúsculas con espaciado

**Character:** Una sola familia argentina (Omnibus-Type) usada como una carta usa su rotulación: el eje de ancho separa la tierra (mayúsculas expandidas, rectas) del agua (cursiva estrecha). Los números de datos van en cifras tabulares.

### Hierarchy
- **Display** (850, clamp(2.6rem, 5.4vw, 5.25rem), 0.92, ancho 122, mayúsculas): el nombre en el cartucho de título.
- **Headline** (850, clamp(2.2rem, 4.6vw, 4rem), ancho 122, mayúsculas): títulos de sección (Proyectos, Lista de luces, Bitácora, Certificados, Leyenda).
- **Title** (850, clamp(1.9rem, 3.2vw, 2.7rem), ancho 120, mayúsculas): el nombre de cada proyecto.
- **Body** (400, 1.0625rem, 1.55, ancho 100): párrafos, con medida de 46 a 62 caracteres.
- **Water** (cursiva 560, ancho 86): el rol, el subtítulo de cada proyecto, fechas, notas, sondas y pilas de tecnologías.
- **Label** (800, 0.8rem, espaciado 0.1em, ancho 118, mayúsculas): encabezados de listas, cabezas de tabla, nombres en las etiquetas de luces.
- **Escala menor**: subtitle (1.25rem, títulos de entradas y notas), ui (0.95rem, botones, listas de lo que hice, formaciones), small (0.88rem, datos de apoyo, pilas, fechas), micro (0.72rem, características de luz, rumbos de tramo y coordenadas del marco). No hay tamaños fuera de esta escala.
- **Compactas** (menos de 760px): display-compact, headline-compact y title-compact reducen el nombre, los títulos de sección y los nombres de proyecto para que quepan en 390px sin desbordar.
- **Fluidas de apoyo**: role-line (el rol del cartucho), contact-line (el correo) y dialog-title (el título de la sala de video).

### Named Rules
**La regla tierra y agua.** Lo que nombra un lugar o un proyecto va recto y expandido; lo que describe, fecha o mide va en cursiva estrecha.

## Layout

La carta 3D ocupa toda la ventana, fija. Un marco graduado de minutos de arco bordea la pantalla (barra superior, laterales de 12px y borde inferior que en pantallas de 1100px o más crece a 26px y lleva las longitudes; el lateral izquierdo lleva las latitudes). El contenido corre encima en láminas de papel opaco de hasta 1180px.

En pantallas de 1240px o más, los planos de proyecto ocupan el 74% del ancho y alternan de lado, y algunas láminas se pegan a un lado, para que la cámara muestre la luz del proyecto en el espacio libre. La portada es una rejilla de tres columnas: el cartucho a la izquierda, la carta al centro y el trazador abajo a la derecha. Por debajo de 760px todo pasa a una columna, el cartucho se compacta (sin pie, acciones en una fila) y la carta se ve en la franja de abajo.

Ritmo: márgenes laterales de clamp(16px, 4vw, 56px), secciones con clamp(72px, 12vh, 140px) arriba y abajo, láminas con clamp(26px, 4vw, 52px) de relleno, y entre planos de proyecto clamp(96px, 16vh, 180px).

## Elevation & Depth

La profundidad real la da la escena 3D: la carta es una maqueta de capas (el lecho baja una capa por banda de profundidad y la tierra sube en terrazas) bajo una lámina de agua translúcida, iluminada desde el noroeste. Las láminas de contenido flotan sobre ella con una sola sombra suave, siempre desplazada hacia abajo.

### Shadow Vocabulary
- **Lámina** (`box-shadow: 0 22px 48px -26px rgba(24, 35, 58, 0.5), 0 2px 6px -2px rgba(24, 35, 58, 0.12)`): cartucho, trazador, láminas y planos sobre la carta.
- **Sala de video** (`box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.6)`): el plano ampliado sobre el velo.

### Named Rules
**La regla de una sombra.** Las piezas impresas tienen un filete o una sombra de lámina, nunca un brillo de color ni una sombra dura sin desenfoque.

## Shapes

Esquinas casi rectas, como el papel: 2px en los rótulos de la carta, 3px en botones y campos, píldora (999px) solo para controles pequeños (fichas de habilidad, botón de ver video). Los marcos son filetes: el cartucho, la sala de video y el contacto llevan doble filete (borde de 2px y una línea interior de 1px separada 5px, dibujada con outline). Los planos de video llevan el mismo doble filete. Los números y letras de plano van en discos de 22 a 28px con borde. Las viñetas de las listas son anillos de boya.

## Components

### Buttons
- **Shape:** esquinas de 3px, 46px de alto, borde de 1.5px en tinta.
- **Primary:** fondo de tinta y texto blanco de carta; al pasar el puntero, el fondo se vuelve magenta.
- **Outline:** fondo blanco de carta y texto de tinta; al pasar el puntero, el borde y el texto se vuelven magenta.
- **Magenta:** la acción de contacto («Escribirme»); al pasar el puntero pasa a tinta.
- **Press:** escala a 0.97 en 160ms.

### Chips
- **Style:** fichas de habilidad en píldora de 32px, borde de tinta translúcido.
- **State:** seleccionada en magenta lleno (aria-pressed); al pasar el puntero, borde y texto magenta.

### Cards / Containers
- **Cartucho de título:** doble filete, sombra de lámina, nombre en display.
- **Plano de detalle:** cabeza con letra en disco, nombre del plano y coordenadas; video 16:9 en doble filete sobre papel de plano; pie con la escala gráfica (que avanza con el video) y la característica de la luz; debajo, ficha en dos columnas.
- **Nota:** recuadro con borde magenta de 1.5px para certificaciones de Oracle; la de ONE AI for Tech usa borde de tinta y fondo de sonda tenue.
- **Internal Padding:** clamp(22px, 2.8vw, 34px).

### Inputs / Fields
- **Style:** campo de 40px, borde de tinta translúcido, esquinas de 3px, marcador en cursiva.
- **Focus:** borde magenta y anillo de foco magenta de 2px.

### Navigation
- Barra fija de 60px en blanco de carta con borde inferior graduado. La marca (luz magenta y «Cristian Rios» en mayúsculas expandidas) a la izquierda y cuatro enlaces a la derecha, con un subrayado magenta que crece desde la izquierda en hover y en la sección actual (aria-current). En celular solo quedan la marca y el botón de CV.

### Luces y etiquetas de la carta
Cada proyecto es una luz 3D (pie, asta, linterna y halo) que destella con su característica. Su etiqueta es un rótulo de papel con el nombre en label y la característica en cursiva magenta. Ninguna etiqueta se dibuja bajo un panel ni encima de otra: si choca a la derecha de su luz se prueba a la izquierda, y si tampoco cabe se oculta.

### Trazador de rumbo
Elegir una habilidad dibuja en la carta la derrota magenta entre las luces que la usan, en orden cronológico, con el rumbo verdadero y la distancia en millas de cada tramo («Rv 082° · 3,5 M»). La leyenda y el campo de texto libre usan el mismo mecanismo.

### Sala de video
El video completo se abre en un diálogo con doble filete que crece desde el video de su plano y vuelve a él al cerrarse. Los controles son propios: reproducir, escala gráfica deslizable (con flechas del teclado), tiempo, sonido y pantalla completa.

## Do's and Don'ts

### Do:
- **Do** usar el magenta solo para luces, rumbos, notas y la acción de ver video.
- **Do** separar tierra y agua en la tipografía: mayúsculas expandidas para nombres, cursiva estrecha para datos.
- **Do** enmarcar con filetes (doble filete en piezas principales) y esquinas de 3px.
- **Do** mantener el contenido legible sin la carta 3D: todo está en el HTML y la carta tiene respaldo plano y modo quieto con `prefers-reduced-motion`.
- **Do** etiquetar la geografía como esquemática y no apta para navegación.

### Don't:
- **Don't** usar fondo crema; el papel es blanco de carta (#f8f9f7).
- **Don't** usar brillos de color, sombras duras sin desenfoque ni vidrio decorativo.
- **Don't** poner etiquetas o rótulos encima de los títulos (kickers).
- **Don't** publicar certificados con número de documento; se nombran, no se adjuntan.
