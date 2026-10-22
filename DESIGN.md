---
name: Confidencialidad en bases de datos Oracle, tablero anunciador
description: Tablero anunciador de sala de control en acero gris y tinta casi negra, donde cada control es una lámpara que se enciende con la evidencia documentada.
colors:
  panel: "#cbd0cc"
  panel-claro: "#dde1de"
  panel-hondo: "#b9bfbb"
  placa: "#1e2124"
  placa-suave: "#3a3f43"
  remache: "#454b50"
  junta: "#a7aeaa"
  lampara-verde: "#2a8452"
  lampara-ambar: "#e39b17"
  lampara-roja: "#c8372d"
  lampara-blanca: "#f5f2e8"
  sobre-lampara: "#ffffff"
  velo: "rgb(30 33 36 / 0.32)"
typography:
  titular-inicio:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7.4vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "0"
    fontVariation: "'wdth' 62"
  titulo-pagina:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.25rem)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "0"
    fontVariation: "'wdth' 66"
  subtitulo-inicio:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "0"
    fontVariation: "'wdth' 72"
  subtitulo-fluido:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "0"
    fontVariation: "'wdth' 72"
  subtitulo-fluido-menor:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "0"
    fontVariation: "'wdth' 72"
  titulo-panel:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "0"
    fontVariation: "'wdth' 68"
  enlace-paso:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 1.75rem)"
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: "0"
    fontVariation: "'wdth' 72"
  descripcion-inicio:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.5vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.5
  seccion-175:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.08
    fontVariation: "'wdth' 72"
  seccion-15:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.08
    fontVariation: "'wdth' 72"
  subtitulo-125:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.08
    fontVariation: "'wdth' 72"
  titulo-grupo-1125:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.08
    fontVariation: "'wdth' 72"
  introduccion:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  cuerpo:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  cuerpo-menor:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  texto-tabla:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  nota:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
  rotulo:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 78"
  pulsador:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    fontVariation: "'wdth' 88"
  id-mono:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  numero-mono:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.2
  codigo-bloque:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
  codigo-listado:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  radio: "2px"
spacing:
  alto-navbar: "3.75rem"
  margen: "clamp(1rem, 4vw, 3rem)"
  ancho-contenido: "78rem"
  gap-pulsadores: "0.35rem"
  celda-v: "0.7rem"
  celda-h: "0.85rem"
  seccion: "1.75rem"
components:
  lampara-apagada:
    backgroundColor: "{colors.panel-claro}"
    textColor: "{colors.remache}"
    rounded: "{rounded.radio}"
    padding: "0.28rem 0.6rem"
    height: "1.5rem"
  lampara-verde:
    backgroundColor: "{colors.lampara-verde}"
    textColor: "{colors.sobre-lampara}"
    rounded: "{rounded.radio}"
    padding: "0.28rem 0.6rem"
  lampara-ambar:
    backgroundColor: "{colors.lampara-ambar}"
    textColor: "{colors.placa}"
    rounded: "{rounded.radio}"
    padding: "0.28rem 0.6rem"
  lampara-roja:
    backgroundColor: "{colors.lampara-roja}"
    textColor: "{colors.sobre-lampara}"
    rounded: "{rounded.radio}"
    padding: "0.28rem 0.6rem"
  lampara-blanca:
    backgroundColor: "{colors.lampara-blanca}"
    textColor: "{colors.placa}"
    rounded: "{rounded.radio}"
    padding: "0.28rem 0.6rem"
  pulsador:
    backgroundColor: "{colors.panel-claro}"
    textColor: "{colors.placa}"
    typography: "{typography.pulsador}"
    rounded: "{rounded.radio}"
    padding: "0.35rem 0.85rem"
    height: "2.25rem"
  pulsador-hover:
    backgroundColor: "{colors.panel-hondo}"
  pulsador-principal:
    backgroundColor: "{colors.placa}"
    textColor: "{colors.panel-claro}"
    rounded: "{rounded.radio}"
  pulsador-principal-hover:
    backgroundColor: "{colors.placa-suave}"
  pulsador-deshabilitado:
    textColor: "{colors.remache}"
    rounded: "{rounded.radio}"
  campo-texto:
    backgroundColor: "{colors.panel-claro}"
    textColor: "{colors.placa}"
    rounded: "{rounded.radio}"
    padding: "0.45rem 0.7rem"
    height: "2.5rem"
  navbar:
    backgroundColor: "{colors.panel-hondo}"
    textColor: "{colors.placa}"
    height: "{spacing.alto-navbar}"
  navbar-menu:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.placa}"
    padding: "0.35rem"
  navbar-enlace-activo:
    backgroundColor: "{colors.panel-claro}"
    textColor: "{colors.placa}"
    rounded: "{rounded.radio}"
  tabla-encabezado:
    backgroundColor: "{colors.panel-hondo}"
    textColor: "{colors.placa}"
    padding: "0.65rem 0.85rem"
  tabla-fila-hover:
    backgroundColor: "{colors.panel-claro}"
  panel-detalle:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.placa}"
    width: "44rem"
  panel-detalle-barra:
    backgroundColor: "{colors.panel-hondo}"
    padding: "0.6rem 0.9rem"
  bloque-codigo:
    backgroundColor: "{colors.panel-claro}"
    textColor: "{colors.placa}"
    typography: "{typography.codigo-bloque}"
    padding: "0.85rem 1rem"
  bloque-codigo-barra:
    backgroundColor: "{colors.panel-hondo}"
    textColor: "{colors.placa-suave}"
    typography: "{typography.codigo-listado}"
  placa-creditos:
    backgroundColor: "{colors.panel-claro}"
    textColor: "{colors.placa-suave}"
    padding: "0.85rem 1.1rem"
  paso-numero:
    backgroundColor: "{colors.panel-claro}"
    textColor: "{colors.placa}"
    rounded: "{rounded.radio}"
    size: "2.75rem"
  celda-madurez-4:
    backgroundColor: "{colors.lampara-blanca}"
    textColor: "{colors.placa}"
    typography: "{typography.numero-mono}"
    rounded: "{rounded.radio}"
  celda-madurez-sin:
    backgroundColor: "{colors.panel-claro}"
    textColor: "{colors.remache}"
    typography: "{typography.rotulo}"
    rounded: "{rounded.radio}"
  lista-controles:
    backgroundColor: "{colors.panel-hondo}"
    textColor: "{colors.placa}"
    width: "21rem"
  lista-controles-activo:
    backgroundColor: "{colors.placa}"
    textColor: "{colors.panel-claro}"
---

# Design System: Confidencialidad en bases de datos Oracle, tablero anunciador

## Overview

**Creative North Star: "Tablero anunciador de sala de control"**

Cada control es una ventana iluminada de un anunciador industrial, y la trazabilidad (riesgo, control, prueba, hallazgo) es el diagrama mímico que la enciende. La escena es una oficina con luz de día, de modo que el sistema es claro únicamente: acero pintado gris claro, placas grabadas en Archivo condensado y tinta casi negra. El chasis trabaja con dos tintas, `--panel` (gris acero) y `--placa` (tinta casi negra). El color no decora: existe solo como lámpara encendida (verde, ámbar, roja, blanca) y siempre lleva texto grabado encima.

La densidad es de instrumento, no de panel de marketing. Las páginas son listas, tablas y regiones separadas por reglas de 1 px y 2 px, con mucho aire en Inicio y compactas en las herramientas. Las esquinas son casi rectas (2 px) y las lámparas muestran brillo interior, nunca resplandor exterior. El único objeto elevado de todo el sistema es el panel lateral de detalle.

El sistema rechaza el centro de cumplimiento (barra lateral de navegación, tarjetas, insignias de color) y el sitio cyber oscuro con candados y neón. La construcción confirma ambas negativas: la navegación es una barra superior con menús, los contenedores son regiones con regla y no tarjetas, y el único fondo oscuro es la tinta de un pulsador activo o de la opción seleccionada.

**Key Characteristics:**
- Dos tintas de chasis (`--panel` y `--placa`); el color solo aparece como lámpara encendida con texto grabado.
- Radio único de 2 px; reglas de 1 px y 2 px en tinta o junta, nunca de color.
- Archivo Variable con eje de ancho: condensado (62 a 78 por ciento) en placas, títulos y rótulos; ancho normal en prosa.
- JetBrains Mono para IDs canónicos, números y código.
- Una sola sombra, la del panel lateral, tintada hacia la tinta.
- Movimiento corto de instrumento: lámparas 160 a 200 ms, pulsadores 120 a 160 ms, panel 0,4 s.

## Colors

Paleta de acero pintado y tinta, con cuatro lámparas como único color.

### Primary
- **Tinta de placa** (#1e2124, `--placa`): texto, bordes de 1 px y 2 px, reglas, foco y fondo del pulsador activo o de la opción seleccionada. Es la segunda tinta del chasis.
- **Tinta suave** (#3a3f43, `--placa-suave`): texto secundario, subrayados en reposo, fondo del pulsador principal al pasar el cursor.

### Secondary
- **Lámpara verde** (#2a8452, `--lampara-verde`): estados completos (Completa, Visto, CUMPLE). Texto blanco encima, 4,65:1.
- **Lámpara ámbar** (#e39b17, `--lampara-ambar`): estados en curso o parciales. Texto `--placa` encima, 6,91:1.
- **Lámpara roja** (#c8372d, `--lampara-roja`): riesgo alto o crítico, incumplimiento. Texto blanco encima, 5,20:1.
- **Lámpara blanca** (#f5f2e8, `--lampara-blanca`): madurez 0 a 4 en cinco intensidades, y marca de propiedad activa. Texto `--placa`.
- **Texto sobre lámpara** (#ffffff, `--sobre-lampara`): solo sobre verde y rojo.

### Neutral
- **Acero** (#cbd0cc, `--panel`): fondo de página, del menú desplegable y del panel lateral.
- **Acero claro** (#dde1de, `--panel-claro`): superficie de pulsadores, campos, bloques de código, filas apiladas y placa de créditos.
- **Acero hondo** (#b9bfbb, `--panel-hondo`): navbar, franja de encabezado de tabla, barras de bloque y panel, lista lateral de Controles.
- **Remache** (#454b50, `--remache`): rótulos, texto de apoyo, estados deshabilitados, marcador del scroll. 5,66:1 sobre `--panel` y 4,73:1 sobre `--panel-hondo`.
- **Junta** (#a7aeaa, `--junta`): reglas finas entre filas, borde de lámpara apagada y de pulsador deshabilitado.
- **Velo** (rgb(30 33 36 / 0.32), `--velo`): cubre la página detrás del panel lateral.

### Named Rules
**The Lámpara Encendida Rule.** El color solo existe como lámpara encendida y siempre con texto grabado. Una lámpara apagada es acero claro con borde de junta y texto remache; no hay un cuarto estado de color.

**The Dos Tintas Rule.** El chasis (fondos, bordes, reglas, texto) usa únicamente la familia de `--panel` y la de `--placa`. Un tinte de lámpara mezclado con acero solo se admite en celdas de baja intensidad (mapa de calor, escala de madurez) con su texto o inicial al lado.

**The Contraste Medido Rule.** Los tokens de texto sobre lámpara se ajustaron por medición AA, no por gusto: `--remache` y `--lampara-verde` son más oscuros que los valores que sugería el plan. No se aclaran sin medir de nuevo.

## Typography

**Display Font:** Archivo Variable (con Archivo, system-ui, sans-serif), eje de ancho condensado
**Body Font:** Archivo Variable a ancho normal
**Label/Mono Font:** JetBrains Mono Variable (con JetBrains Mono, ui-monospace, monospace)

**Character:** Una placa grabada y una columna de códigos de instrumento. El ancho condensado da la voz de rótulo industrial en titulares y placas; la prosa permanece en ancho normal para leerse sin esfuerzo. Los números y IDs son monoespaciados y todo el cuerpo usa cifras tabulares.

### Hierarchy
- **Display** (800, clamp(2.5rem, 7.4vw, 5.75rem), 0.95, ancho 62 por ciento): titular de Inicio, dos líneas como máximo.
- **Headline** (750, clamp(2rem, 4.2vw, 3.25rem), 1, ancho 66 por ciento): h1 de cada Pagina; subtítulos de Inicio en clamp(2rem, 4vw, 3rem).
- **Title** (700, clamp(1.4rem, 2.2vw, 1.75rem) a 1.125rem, 1.08 a 1.1, ancho 68 a 85 por ciento): título del panel lateral en clamp(1.6rem, 3vw, 2.1rem), enlaces de paso, subtítulos de sección (1.75, 1.5, 1.25 y 1.125 rem) y subtítulos fluidos clamp(1.5rem, 2.6vw, 2rem) y clamp(1.5rem, 3vw, 2.1rem).
- **Body** (400, 1 rem, 1,55): prosa; 0.9375rem en celdas, valores y campos; 1.125rem en introducciones de página y clamp(1.125rem, 1.5vw, 1.25rem) en la descripción de Inicio, con máximo de 54 a 62ch.
- **Label** (650 a 700, 0.75rem, 0,08em, versalitas, ancho 78 por ciento): clase global `.rotulo`, lámparas, encabezados apilados y celda "sin evaluar". También 0.8125rem y 0.875rem para notas y texto de tabla.
- **Mono** (600 a 700, 0.8125rem y 0.9375rem; 0.75rem en listados): IDs canónicos de controles, riesgos y pruebas, números de nivel, código SQL.

Rampa literal completa en uso: 0.75, 0.8125, 0.875, 0.9375, 1, 1.125, 1.25, 1.5 y 1.75 rem, más los clamp fluidos de títulos de página, panel, Inicio y subtítulos. Todos están registrados en el frontmatter.

### Named Rules
**The Rótulo Nunca Encima Rule.** La clase `.rotulo` (versalitas cortas con espaciado) acompaña etiquetas, columnas y valores; nunca se coloca encima de un título como antetítulo.

**The Ancho Por Función Rule.** Condensado para placas, títulos, lámparas y rótulos; ancho normal para prosa; mono para identificadores y código. No se mezclan en una misma frase.

## Layout

Una columna de contenido de hasta 78rem (`--ancho-contenido`), centrada, con márgenes laterales fluidos `clamp(1rem, 4vw, 3rem)`. El navbar es sticky de 60 px (3,75rem) con regla inferior de 2 px; el contenido de página arranca con padding vertical fluido y `scroll-padding-top` descuenta el navbar.

Pagina abre con h1 condensado, descripción de hasta 62ch y una regla de 2 px; el cuerpo es una rejilla con separación `clamp(2rem, 4vw, 3rem)`. Las tablas son regiones con regla superior de 2 px y filas separadas por reglas de 1 px en junta. Controles usa una lista lateral sticky de 21rem a todo el alto bajo el navbar (`100dvh` menos 3,75rem), con borde derecho de 2 px, y el detalle ocupa el resto. Inicio es una portada de dos columnas (mensaje y placa de créditos) seguida de una lista numerada de seis pasos con número, enlace y estado en filas separadas por reglas.

Responsive: Controles apila y sustituye la lista lateral por un selector a 860 px; las tablas pasan a registros apilados con etiquetas generadas (`data-etiqueta`) a 760 px; el navbar cambia a menú móvil a 760 px; la portada de Inicio apila a 900 px y sus pasos a 640 px; el panel lateral ocupa 100vw a 640 px; Campo pasa a una columna a 560 px. No hay desplazamiento horizontal a 390 px; el ancho mínimo del cuerpo es 20rem.

El ritmo vertical es de reglas, no de huecos: 0.35rem entre pulsadores, 0.7rem por 0.85rem en celdas, 1.75rem entre secciones, `clamp(4rem, 9vw, 7.5rem)` entre bloques de Inicio.

## Elevation & Depth

El sistema es plano por defecto. La profundidad se transmite con tonos de acero (`--panel`, `--panel-claro`, `--panel-hondo`), reglas de tinta y brillo interior en las piezas encendidas. Las únicas elevaciones son la del panel lateral de detalle y la de la pista de nivel, ambas con `--sombra-panel`.

### Shadow Vocabulary
- **Sombra de panel** (`box-shadow: 0 28px 56px -20px rgb(30 33 36 / 0.5), 0 8px 18px -8px rgb(30 33 36 / 0.28)`, `--sombra-panel`): solo el panel lateral, tintada hacia la tinta.
- **Brillo interior** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.34), inset 0 -0.5rem 0.7rem -0.45rem rgb(30 33 36 / 0.38)`, `--brillo-interior`): lámparas, puntos, celdas de madurez 3 y 4, pulsadores de estado pulsados. Es la lectura de "encendida".
- **Presión interior** (`box-shadow: inset 0 2px 4px rgb(30 33 36 / 0.32)`, `--presion-interior`): pulsador mientras se presiona.
- **Relieve de pulsador** (`box-shadow: inset 0 -2px 0 rgb(30 33 36 / 0.14)`, `--relieve-pulsador`): borde inferior de reposo de pulsadores y del punto del mapa de calor.

### Named Rules
**The Una Sombra Rule.** Ninguna sombra exterior salvo `--sombra-panel`. Todo lo demás es inset o regla.

**The Sin Resplandor Rule.** Una lámpara brilla hacia adentro; nunca emite halo ni glow exterior.

## Shapes

Esquinas casi rectas con radio único de 2 px (`--radio`) en lámparas, pulsadores, campos, números de paso y celdas. Los contenedores grandes (regiones de tabla, panel lateral, bloques de código, registros apilados) tienen esquinas rectas. El borde habitual es de 1 px en `--placa`; los bordes de 2 px (navbar, encabezados de Pagina, regla superior de tablas, borde del panel, menú desplegable, celda de madurez 4, número de paso) son siempre tinta, nunca de color. La placa de créditos lleva borde de 2 px y un filo interior de 1 px a 6 px de distancia, como una placa grabada. Foco visible: contorno de 2 px en `--placa` con 2 px de separación.

## Components

### Lámpara y PuntoLampara
Ventana de esquinas casi rectas (2 px) con rótulo grabado en versalitas condensadas (0.75rem, 700, 0,08em). Apagada: fondo `--panel-claro`, borde `--junta`, texto `--remache`. Encendida: borde `--placa-suave`, fondo del tono (verde, ámbar, roja o blanca), brillo interior y animación `encender` de 180 ms (opacidad de 0,35 a 1 y brillo de 0,82 a 1). PuntoLampara es la versión de 0.75rem sin texto, con borde de 2 px en tinta al encenderse; siempre acompaña un texto vecino. BandaRiesgo envuelve una lámpara con el puntaje y la banda escritos ("Sin evaluar" si no hay puntaje).

### RampaMadurez
Cinco intensidades fijas de lámpara blanca para los niveles 0 a 4, siempre con el número en mono: mezclas de `--lampara-blanca` con `--panel-hondo` al 28, 52 y 76 por ciento para los niveles 1 a 3, blanco pleno en el 4. El borde se oscurece por nivel (junta, remache, placa-suave, placa, y 2 px de placa en el 4); los niveles 3 y 4 añaden brillo interior. "Sin evaluar" es una celda de acero claro con rótulo.

### Pulsador, SelectorNivel y BotoneraEstado
Pulsador global `.pulsador`: borde de 1 px en tinta, 2 px de radio, fondo `--panel-claro`, texto 0.875rem a 600 y ancho 88 por ciento, alto mínimo 2.25rem (2.75rem con puntero grueso), relieve inferior. Hover (solo con puntero fino): `--panel-hondo`. Pulsado: `scale(0.97)` y presión interior, con transición de 140 ms en transform, sombra y color. Variantes: `data-principal`, `aria-pressed="true"` y `aria-checked="true"` pasan a fondo `--placa` y texto `--panel-claro` (hover `--placa-suave`); `data-compacto` baja a 1.875rem y 0.8125rem. Deshabilitado: borde junta, texto remache, sin relieve.
SelectorNivel es una fila de pulsadores mono 0 a 4 teñidos con la intensidad de la rampa; el elegido lleva borde de 2 px, brillo interior y una barra interior inferior de 0.3rem en tinta; el nivel sugerido se marca con una lámpara ámbar de 0.6rem en la esquina, y su texto lo anuncia también en el nombre accesible. BotoneraEstado son pulsadores de 5.5rem que, al quedar pulsados, se encienden en verde, ámbar o roja con brillo interior.

### PistaNivel y DescripcionNivel
La pista de nivel es una placa de tinta (`--placa`, texto `--panel-claro`, borde de 1 px en `--remache`, radio de 2 px, `--sombra-panel`) de hasta 40rem que se abre en la capa superior con la API popover, para no recortarse dentro del panel lateral ni de las tablas. Lleva el número en mono, el nombre del nivel en versalitas condensadas, el control y el modelo COBIT en 0.75rem, y el texto de origen precedido por su rótulo. Aparece a 100 ms con el puntero, al instante con el foco o el toque, y se cierra con Escape, al salir o al tocar fuera; aparece con 140 ms de opacidad y 2 px de desplazamiento. DescripcionNivel es la misma definición en una ficha de `--panel-claro` con borde de 1 px, bajo el selector de la fila.

### ComponenteTabular
Región con regla superior de 2 px y regla inferior de 1 px en tinta. Encabezado en franja `--panel-hondo` con regla de 1 px; filas separadas por reglas de 1 px en junta; cabeceras de grupo en `--panel-claro` con título condensado de 1.125rem. Las filas son clicables y abren el panel lateral: hover (puntero fino) y foco interior las pasan a `--panel-claro`. A 760 px se apilan como registros: cada fila es un bloque con borde de 1 px, etiqueta generada en rótulo a 6.5rem, y la primera celda sobre `--panel-hondo`.

### Navbar
Sticky de 60 px sobre `--panel-hondo` con regla inferior de 2 px. Marca a la izquierda en placa condensada (1.125rem, 800, ancho 66 por ciento, versalitas) con borde de 1 px. A la derecha, menús desplegables Herramientas y Material de apoyo: disparador de 0.9375rem a 600; abierto lleva borde de tinta y fondo `--panel-claro`; el menú es una caja de 17rem con borde de 2 px en `--panel`. La ruta activa lleva `aria-current`, fondo `--panel-claro`, peso 700, subrayado de 3 px y una lámpara pequeña. A 760 px los menús pasan a un panel móvil con botón.

### Panel lateral de detalle (HojaReferencia)
`role="dialog"` anclado a la derecha, ancho `min(44rem, 100vw)`, fondo `--panel`, borde izquierdo de 2 px y `--sombra-panel`, sobre un velo `--velo`. Entra con resorte corto (0,4 s, rebote 0,1) y sale en 180 ms con `--ease-out`; atrapa Tab y devuelve el foco. La barra superior (`--panel-hondo`) muestra el recorrido como cadena de pasos mono unidos por trazos de 2 px (el paso actual con caja, los previos como enlaces subrayados que engrosan a 4 px al pasar). El encabezado del contenido lleva el tipo en 0.8125rem, el título condensado y una regla de 2 px. A 640 px ocupa todo el ancho.

### Ref (cinta de mímico)
Botón sin caja con el ID en mono (0.8125rem, 600) y el nombre en 0.9375rem, subrayado por una barra de 2 px en `--placa-suave` que se enciende a 4 px y `--placa` al enfocar, al pasar el cursor o cuando la referencia está resaltada (160 ms). Al pulsar, `scale(0.97)`. Las listas de Ref se envuelven con 0.85rem de separación o se apilan.

### BloqueCodigo, Campo y Rejilla
BloqueCodigo: caja de 1 px en tinta sobre `--panel-claro`, barra de título en mono 0.75rem sobre `--panel-hondo` y cuerpo mono de 0.8125rem con interlineado 1,6; la variante listado baja a 0.75rem sin ajuste de línea y altura máxima de 32rem. Campo y Rejilla son una lista de definición (`dl`) de dos columnas con regla superior de 1 px en tinta y filas con regla de junta; etiqueta a 650 y valor a 0.9375rem; una columna a 560 px. El campo de texto `.control-texto` lleva borde de 1 px, radio 2 px, fondo `--panel-claro`, 0.9375rem y alto mínimo de 2.5rem.

### Mapa de calor
Plano cuadrado de 5 por 5 con borde de 2 px y celdas de baja intensidad: mezclas de lámpara con `--panel-claro` (verde 22, ámbar 40, roja 26 y 50 por ciento) más la inicial de la banda en la esquina y el valor en mono. Los puntos de riesgo son cuadros de 2rem con borde de 2 px y número; el enfocado se invierte a tinta.

### Placa de créditos y lista de pasos de Inicio
La placa de créditos es una caja de `--panel-claro` con borde de 2 px y filo interior, texto de 0.8125rem y el nombre del autor a 1rem condensado. La lista numerada de seis pasos usa un cuadro mono de 2.75rem con borde de 2 px, el enlace condensado de paso que engrosa su subrayado a 5 px al pasar el cursor, y a la derecha la lámpara de progreso con su texto. Los pasos entran con un escalonado de 45 ms y 240 ms de duración (opacidad y 8 px de desplazamiento), el único escalonado del sistema.

### Movimiento
Lámparas 160 a 200 ms, pulsadores 120 a 160 ms, panel 0,4 s con salida de 180 ms, entrada de la ficha de control 180 ms. Curva `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out`). Con `prefers-reduced-motion`, animaciones y transiciones bajan a 1 ms y el desplazamiento suave se desactiva; el panel conserva solo opacidad.

## Do's and Don'ts

### Do:
- **Do** usar `--panel` y `--placa` para todo el chasis y reservar verde, ámbar, roja y blanca para lámparas encendidas con texto grabado.
- **Do** mantener el radio en 2 px y los bordes en 1 px de tinta o junta; los de 2 px solo en tinta, en navbar, encabezados, reglas superiores y piezas firma.
- **Do** componer con reglas, filas y regiones; separar con reglas de 1 px y encabezar con 2 px.
- **Do** escribir IDs canónicos y números en JetBrains Mono, y títulos y placas con ancho condensado (62 a 78 por ciento).
- **Do** acompañar toda lámpara, punto y celda teñida con texto o inicial (CUMPLE, PARCIAL, banda, número de nivel).
- **Do** dar a cada pulsador `scale(0.97)` al presionar y a toda animación una duración de 120 a 200 ms (0,4 s solo el panel), con `--ease-out`.
- **Do** probar contraste sobre el fondo real antes de tocar `--remache` o las lámparas.

### Don't:
- **Don't** poner un rótulo (`.rotulo`) encima de un título.
- **Don't** alinear tarjetas iguales en fila; la información va en tablas, listas y rejillas con reglas.
- **Don't** usar bordes de color ni bordes mayores de 1 px en color; los de 2 px son de tinta.
- **Don't** añadir sombras exteriores; la única es `--sombra-panel` del panel lateral. Sin resplandor en lámparas.
- **Don't** usar azul ni ningún color fuera de las cuatro lámparas.
- **Don't** usar rayado, trama ni degradados decorativos.
- **Don't** señalar un estado solo con color: toda lámpara lleva texto.
- **Don't** introducir barra lateral de navegación, insignias de color, candados ni neón, ni tema oscuro.

### Desviaciones aceptadas del brief
- Las lámparas de progreso de Inicio usan ámbar (En curso, Listos) y verde (Completa, Visto) porque el plan lo ordena; el texto las distingue de CUMPLE y PARCIAL.
- La declaración de uso de IA es contenido firmado del autor y conserva sus menciones originales.
- `--remache` (#454b50) y `--lampara-verde` (#2a8452) se oscurecieron respecto al plan por contraste AA medido.
