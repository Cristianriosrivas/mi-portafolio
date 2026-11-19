---
name: Portafolio de Cristian David Rios
description: Portafolio profesional de un desarrollador frontend y mobile, con un mapa de habilidades en 3D.
colors:
  cobalt: "#2b47f5"
  cobalt-hover: "#1c36d6"
  cobalt-wash: "#edf0ff"
  cobalt-on-ink: "#5b74ff"
  ink: "#0e1116"
  ink-secondary: "#434c5e"
  ink-muted: "#5d6578"
  ink-hover: "#262c37"
  ink-raised: "#1d222b"
  on-ink: "#b4bccb"
  on-ink-strong: "#d5dae3"
  page: "#f8f9fb"
  surface: "#ffffff"
  surface-sunken: "#f1f3f6"
  line: "#e3e6eb"
  line-strong: "#cdd3dc"
  line-project: "#b9c0cc"
  panel-text: "#e9ecf2"
  panel-muted: "#8a93a6"
  panel-chip: "#c4cad6"
  panel-link: "#aebbff"
  panel-active: "#c9d2ff"
  cobalt-panel: "#4361ff"
  available: "#129e55"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6.4vw, 5.75rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.038em"
  closing:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.4vw, 4.4rem)"
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: "-0.036em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 3.1rem)"
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.3rem)"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  subtitle:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 550
    lineHeight: 1.4
  meta:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 500
    lineHeight: 1.45
  small:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.4
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 500
    lineHeight: 1.4
  role:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 1.6vw, 1.25rem)"
    fontWeight: 500
    lineHeight: 1.4
  display-compact:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 12vw, 3.4rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.038em"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  tag: "6px"
  control: "10px"
  card: "12px"
  panel: "18px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 5vw, 72px)"
  section: "clamp(64px, 9vh, 112px)"
  container: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  button-accent:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  chip-skill:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel-text}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  chip-skill-active:
    backgroundColor: "{colors.cobalt-on-ink}"
    textColor: "{colors.surface}"
  tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.tag}"
    padding: "3px 9px"
---

# Design System: Portafolio de Cristian David Rios

## Overview

**Creative North Star: "La ficha técnica bien hecha"**

Un portafolio de desarrollador en su forma estándar, ejecutado con el oficio de un sitio de producto de software: página clara de fondo blanco frío, tipografía Geist apretada y segura, mucho aire y un solo acento cobalto que marca lo interactivo. Quien contrata entiende en segundos quién es, qué busca y qué ha construido.

El gesto propio es el mapa de habilidades en 3D de la portada: un panel de tinta, como la ventana de un producto, donde los diez proyectos orbitan en un anillo y cada tecnología queda dentro, cerca de los proyectos que la usan. Elegir una habilidad enciende sus conexiones, manda señales hacia los proyectos y resalta en la página las etiquetas de tecnología que coinciden. El cierre repite la superficie de tinta con su retícula de puntos, así la página abre y termina en el mismo material.

La identidad es profesional y neutra a propósito: nada de temas regionales o decorativos. El lugar (Buenaventura, Colombia) es un dato, no un motivo.

**Key Characteristics:**
- Blanco frío, tinta casi negra y un único acento cobalto.
- Geist para todo el texto; Geist Mono para fechas, etiquetas, datos y teclas.
- Dos superficies: la página clara y los paneles de tinta (mapa y cierre) con retícula de puntos.
- Detalles de software: buscador Ctrl+K, estado de disponibilidad con latido, etiquetas de tecnología en mono.
- Los videos de los proyectos son la prueba: avance mudo en bucle y sala de video que crece desde su tarjeta.

## Colors

Neutros fríos con un solo acento: el color existe para decir «esto se puede tocar» o «esto está elegido».

### Primary
- **Cobalto** (cobalt): botones de acción principal del cierre, viñetas de «Lo que hice», puntos de la línea de experiencia, selección del buscador, etiquetas de tecnología que coinciden con el filtro, foco y selección de texto.
- **Cobalto sobre tinta** (cobalt-on-ink): el mismo acento aclarado para los paneles oscuros (mapa de habilidades, ficha elegida).

### Neutral
- **Tinta** (ink): títulos, texto principal, botón primario y las superficies oscuras.
- **Tinta secundaria y tenue** (ink-secondary, ink-muted): párrafos y datos de apoyo.
- **Página, superficie y superficie hundida** (page, surface, surface-sunken): el fondo frío, las tarjetas blancas y los estados de hover del menú.
- **Líneas** (line, line-strong, line-project): separadores de 1px y bordes de controles; line-project, más marcada, separa los proyectos destacados.
- **Texto de panel** (panel-text, panel-muted, panel-chip, panel-link, panel-active): el texto sobre el mapa de habilidades; cobalt-panel es la ficha elegida.
- **Sobre tinta** (on-ink, on-ink-strong, ink-raised): textos y bordes del cierre y del panel.
- **Disponible** (available): solo el punto de estado de la portada.

### Named Rules
**La regla de un acento.** El cobalto es el único color de la página; si algo no es interactivo ni está elegido, no lleva cobalto.

**La regla de dos superficies.** La página es clara; solo el mapa de habilidades y el cierre son de tinta. No se agregan más superficies oscuras.

## Typography

**Display Font:** Geist (con la sans del sistema de respaldo)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono

**Character:** Una sans geométrica de producto, apretada en los títulos (tracking negativo) y cómoda en el texto, acompañada de su mono para todo lo que es dato.

### Hierarchy
- **Display** (650, clamp(3rem, 6.4vw, 5.75rem), 0.98): el nombre en la portada.
- **Closing** (650, clamp(2.4rem, 5.4vw, 4.4rem)): la pregunta del cierre.
- **Headline** (650, clamp(2rem, 3.8vw, 3.1rem)): títulos de sección.
- **Title** (650, clamp(1.75rem, 2.6vw, 2.3rem)): el nombre de cada proyecto destacado.
- **Subtitle** (600, 1.25rem): cargos, certificaciones y nombres de otros proyectos.
- **Body** (400, 1.0625rem, 1.6): párrafos de 50 a 68 caracteres.
- **UI** (550, 0.95rem): botones, menú y listas.
- **Lead** (500, 1.1rem): subtítulo de cada proyecto y títulos menores.
- **Meta y Small** (500, 0.88rem y 0.8rem): datos de apoyo, fichas de habilidad y notas.
- **Label** (Geist Mono 400, 0.75rem): fechas, etiquetas de tecnología, datos de ficha y teclas.
- **Display compacto** (clamp(2.6rem, 12vw, 3.4rem)): el nombre en celulares.

### Named Rules
**La regla del dato en mono.** Fechas, horas, tecnologías, duraciones y atajos de teclado van en Geist Mono; nada más.

## Layout

Contenedor de 1240px con márgenes de clamp(20px, 5vw, 72px). La portada es una rejilla de dos columnas a pantalla completa: texto a la izquierda y el mapa a la derecha. Los proyectos destacados alternan el video a izquierda y derecha (1.35fr de video contra 1fr de texto), y el video queda pegado arriba mientras se lee su ficha. La experiencia usa dos columnas con el título fijo a la izquierda. Las secciones empiezan con clamp(64px, 9vh, 112px) de aire. Por debajo de 1080px la portada pasa a una columna; por debajo de 900px los proyectos y la experiencia también; por debajo de 720px el menú se reduce al buscador y al CV.

## Elevation & Depth

Casi plano: bordes de 1px hacen el trabajo y la sombra se reserva para lo que flota.

### Shadow Vocabulary
- **Sombra** (`box-shadow: 0 1px 2px rgba(14, 17, 22, 0.04), 0 12px 32px -16px rgba(14, 17, 22, 0.18)`): videos de proyecto en reposo.
- **Sombra alta** (`box-shadow: 0 2px 4px rgba(14, 17, 22, 0.05), 0 28px 60px -28px rgba(14, 17, 22, 0.32)`): video al pasar el puntero.
- **Panel** (`box-shadow: 0 2px 4px rgba(14, 17, 22, 0.08), 0 40px 80px -36px rgba(14, 17, 22, 0.55)`): el mapa de habilidades.

### Named Rules
**La regla del borde primero.** Una tarjeta lleva borde o sombra, no ambos con peso; las sombras siempre caen hacia abajo y nunca son de color.

## Shapes

Esquinas suaves y consistentes: 6px en etiquetas y foco, 10px en controles y el monograma, 12px en tarjetas y videos, 18px en paneles y diálogos (mapa, buscador, sala de video) y píldoras para fichas, viñetas y el estado de disponibilidad.

## Components

### Buttons
- **Shape:** 10px de radio, 46px de alto (38px en la variante chica).
- **Primary:** tinta con texto blanco; en hover se aclara un tono.
- **Accent:** cobalto, solo para «Escribirme» en el cierre.
- **Outline:** blanco con borde de línea fuerte; en hover el borde pasa a tinta. Sobre tinta, el borde es translúcido y el texto blanco.
- **Press:** escala 0.97.

### Chips
- **Fichas de habilidad:** píldoras sobre tinta con borde translúcido; la elegida se llena de cobalto.
- **Etiquetas de tecnología:** Geist Mono sobre blanco con borde de línea; las que coinciden con el filtro se tiñen de cobalto.

### Cards / Containers
- **Video de proyecto:** 16:9, radio 12px, sombra suave, botón «Ver video» blanco arriba a la izquierda y una línea de avance cobalto al pie.
- **Certificados y grupos de tecnologías:** blanco, borde de línea, radio 12px, sin sombra.

### Navigation
- Barra pegada arriba que gana un borde al hacer scroll; enlaces con fondo hundido en hover y en la sección actual; buscador con su atajo Ctrl K y el botón de CV.

### Mapa de habilidades (firma)
Panel de tinta con retícula de puntos. Proyectos en un anillo inclinado (los destacados con un aro cobalto), tecnologías dentro. Se arrastra para girar con inercia y gira despacio solo. Al elegir una habilidad se encienden sus aristas y viajan señales hacia los proyectos.

### Buscador rápido
Diálogo con campo, resultados agrupados (proyectos, tecnologías, secciones, acciones) y navegación por teclado; se abre con Ctrl+K o con el botón de la barra.

### Sala de video
Diálogo que crece desde el video de su tarjeta y vuelve a él al cerrar, con controles propios y la carta 3D en pausa mientras está abierto.

## Do's and Don'ts

### Do:
- **Do** usar el cobalto solo en lo interactivo o elegido.
- **Do** poner fechas, tecnologías y datos en Geist Mono.
- **Do** mantener dos superficies: página clara y paneles de tinta.
- **Do** decir qué hizo Cristian en cada proyecto, no solo qué hace el producto.

### Don't:
- **Don't** usar temas regionales o decorativos (mar, cartas náuticas, motivos locales) como identidad.
- **Don't** usar degradados de texto, vidrio decorativo ni brillos de color.
- **Don't** poner rótulos encima de los títulos (kickers) ni numerar secciones.
- **Don't** publicar certificados con número de documento; se nombran, no se adjuntan.
