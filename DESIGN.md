---
name: Legajo de auditoría ISO 27002 · Confidencialidad DBA
description: Papeles de trabajo de auditoría vivos, con marcas de cotejo en lápiz rojo y referencias cruzadas en lápiz azul.
colors:
  papel: "#e8f0e5"
  papel-claro: "#f3f8f1"
  papel-hondo: "#d9e5d4"
  regla: "#bfd2ba"
  regla-fuerte: "#92ae8c"
  tinta: "#15221a"
  tinta-suave: "#364740"
  grafito: "#56625b"
  rojo: "#b0261e"
  rojo-tenue: "rgb(176 38 30 / 0.09)"
  azul: "#1c4a92"
  azul-tenue: "rgb(28 74 146 / 0.1)"
typography:
  display:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 0.82
    fontVariation: "'wdth' 62"
  headline-caratula:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.55rem, 2.1vw, 2.05rem)"
    fontWeight: 750
    lineHeight: 1.05
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 72"
  headline:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.25rem)"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 78"
  title:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
    fontVariation: "'wdth' 92"
  body:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum'"
  body-campo:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 650
    fontVariation: "'wdth' 85"
  label-formulario:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    fontVariation: "'wdth' 85"
  marca:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 560
    fontVariation: "'wdth' 88"
  id:
    fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 560
    letterSpacing: "-0.01em"
  codigo:
    fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0px"
  foco: "2px"
  punto: "50%"
spacing:
  renglon: "1.75rem"
  margen: "clamp(1rem, 3vw, 2.5rem)"
  ancho-indice: "15.5rem"
  celda: "0.6rem 0.85rem"
  campo: "0.85rem 1rem 0.95rem 0"
  entre-papeles: "clamp(3.5rem, 8vw, 6.5rem)"
components:
  ref:
    backgroundColor: "transparent"
    textColor: "{colors.azul}"
    typography: "{typography.id}"
    rounded: "{rounded.none}"
    padding: "0.05em 0.1em 0.2em"
  boton:
    backgroundColor: "{colors.papel-claro}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.6rem"
  accion:
    backgroundColor: "{colors.papel-claro}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0.32rem 0.7rem"
  boton-pendiente:
    backgroundColor: "transparent"
    textColor: "{colors.azul}"
    rounded: "{rounded.none}"
    padding: "0.15rem 0.45rem"
  filtro:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.65rem"
  filtro-activo:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel-claro}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.65rem"
  formulario-encabezado:
    backgroundColor: "{colors.papel-claro}"
    textColor: "{colors.tinta}"
    typography: "{typography.label-formulario}"
    rounded: "{rounded.none}"
    padding: "0.45rem 0.75rem 0.5rem"
  cabecera-tabla:
    backgroundColor: "{colors.papel-hondo}"
    textColor: "{colors.grafito}"
    typography: "{typography.label}"
    padding: "{spacing.celda}"
  bloque-codigo:
    backgroundColor: "{colors.papel-claro}"
    textColor: "{colors.tinta}"
    typography: "{typography.codigo}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1rem"
  hoja:
    backgroundColor: "{colors.papel-claro}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    width: "min(41rem, calc(100vw - 1.5rem))"
---

# Design System: Legajo de auditoría ISO 27002 · Confidencialidad DBA

## Overview

**Creative North Star: "El legajo de papeles de trabajo"**

El sistema es un legajo de auditoría impreso en papel de columnas verde pálido, con rayado contable, y anotado a mano con un lápiz bicolor. Cada sección es un papel con su letra (S, A a J), su encabezado de formulario (Entidad, Papel N.º, Preparado, Revisado) y su leyenda de marcas al pie. La tinta verde negra lleva el texto y los IDs; el lápiz rojo estampa marcas de cotejo y señala excepciones; el lápiz azul subraya referencias cruzadas que se pueden seguir hasta el papel destino.

La densidad es la de un papel de trabajo real: tablas con reglas finas, celdas compactas, etiquetas condensadas de formulario y cifras tabulares. La jerarquía no viene de cajas ni de color, sino del eje de ancho de Archivo (condensada en letras de papel, títulos y formularios; ancho normal en prosa) y de reglas de distinto grosor (2px tinta entre papeles, 1px regla fuerte en encabezados, 1px regla en filas).

Tema claro únicamente, elegido por la escena de uso: el profesor califica en una laptop con luz de día. El mundo rechaza el centro de cumplimiento GRC (barra lateral de tarjetas, insignias de color) y el sitio cyber oscuro con candados y neón.

**Key Characteristics:**
- Papel verde pálido con rayado contable cada renglón (1.75rem) y doble regla vertical de margen.
- Dos tintas para el chasis (tinta y grafito); el color solo aparece como lápiz.
- Esquinas rectas en todo; reglas finas en lugar de tarjetas.
- Una sola superficie con sombra: la hoja que se levanta sobre la pila.
- Marcas con forma y texto: el color nunca es la única señal.
- Movimiento de papel: hojas que se levantan con peso, trazos que se dibujan, sellos que se estampan.

## Colors

Paleta de papel contable: verdes desaturados para el soporte y las reglas, tinta verde negra para el texto, y dos lápices saturados con roles fijos.

### Primary
- **Tinta verde negra** (tinta): texto, IDs canónicos, reglas de 2px que abren cada papel, letra del papel, relleno del estado seleccionado (filtro activo, opción de control activa, punto enfocado del mapa de calor).

### Secondary
- **Lápiz rojo** (rojo): marcas de cotejo (visto, parcial, no cumple), sello de firma de revisión, círculo a lápiz del nivel 0-4 elegido y de la letra del papel actual en el índice, tramas de banda, la palabra "Crítico", el escenario de riesgo (rojo-tenue de fondo con filete de 1px) y el cursor de escritura.
- **Lápiz azul** (azul): referencias cruzadas (IDs en mono con trazo de lápiz que se dibuja debajo), enlaces, botones de texto que llevan a otra acción (Firmar revisión, Copiar), anillo de foco y selección de texto.

### Neutral
- **Papel** (papel): fondo general del legajo.
- **Papel claro** (papel-claro): superficies que se escriben: formularios de encabezado, la hoja levantada, bloques de código, fila activa de la cédula, botones.
- **Papel hondo** (papel-hondo): cabeceras de tabla, barra de la hoja y del bloque de código, pista de la barra de desplazamiento, hoja de abajo de la pila.
- **Regla** (regla): filetes entre filas y entre celdas de formulario.
- **Regla fuerte** (regla-fuerte): bordes de formularios, bloques, botones y filtros; regla bajo el encabezado de cada papel.
- **Tinta suave** (tinta-suave): texto secundario, objetivo del papel, nombres junto a referencias, IDs dentro de filas.
- **Grafito** (grafito): etiquetas de formulario y de tabla, notas, fechas, pie de papel, nivel 0 de la trama (borde punteado).

### Named Rules
**La Regla del Lápiz Bicolor.** Rojo solo para marcas de cotejo y excepciones; azul solo para referencias cruzadas y lo que se sigue o se activa; tinta verde negra para IDs y texto. Un ID que no es enlace va en tinta o tinta suave, nunca en azul. La regla vertical roja de margen al 20 % y el rayado verde son impresión del papel, no lápiz: son material propio del mundo y están permitidos.

**La Regla de las Dos Tintas.** El chasis (texto, reglas, superficies, selección) se resuelve solo con verdes y tinta. Un estado seleccionado se marca invirtiendo a tinta sobre papel claro, nunca con un tono de acento.

## Typography

**Display Font:** Archivo Variable (eje de ancho 62 a 125 %, con system-ui)
**Body Font:** Archivo Variable
**Label/Mono Font:** JetBrains Mono Variable (con ui-monospace)

**Character:** Una sola familia que cambia de ancho según el oficio: muy condensada y pesada como rótulo de carpeta en la letra del papel, condensada en títulos y formularios, ancho normal en la prosa. JetBrains Mono lleva todo lo que es código o identificador canónico (R-CONF-01, T-03, A8.13, PR-07), fechas y SQL.

### Hierarchy
- **Display** (800, clamp(3rem, 6vw, 4.25rem), 0.82, ancho 62 %): la letra de cada papel (S, A a J) a la izquierda del título.
- **Headline carátula** (750, clamp(1.55rem, 2.1vw, 2.05rem), 1.05, ancho 72 %): título del legajo en la carátula, máximo 28ch.
- **Headline** (650, clamp(1.6rem, 3vw, 2.25rem), 1.12, ancho 78 %, -0.01em): título de cada papel; todos los h1 a h4 heredan ancho 78 % y peso 650 con text-wrap balance.
- **Title** (600, 1rem, 1.3, ancho 92 %): nombre de un riesgo u objeto dentro de una fila.
- **Body** (400, 1rem, 1.55, cifras tabulares): prosa; objetivo del papel a 62ch, entrada de la hoja a 60ch. Valor de campo a 0.9375rem / 1.5.
- **Label** (650, 0.75rem, ancho 85 %): cabeceras de tabla, etiquetas de campo, fases del índice. Etiqueta de formulario de encabezado a 0.6875rem. Siempre en caja de oración, sin versalitas ni espaciado ancho.
- **Marca** (560, 0.875rem, ancho 88 %): texto que acompaña una marca o una banda.
- **ID** (JetBrains Mono 560 a 600, 0.8125rem, -0.01em): identificadores canónicos y referencias. Código a 0.8125rem / 1.6; listados a 0.75rem sobre renglón de 1.75rem.

### Named Rules
**La Regla del Eje de Ancho.** El ancho comunica el registro: 62 % letra de papel, 72 a 78 % títulos, 85 a 88 % etiquetas y marcas, 92 % nombres en fila, 100 % prosa. No se usa peso ni tamaño extra para lo que el ancho ya resuelve.

**La Regla del ID Canónico.** Todo identificador del legajo va en JetBrains Mono y se escribe completo; es el idioma de las referencias cruzadas.

## Layout

Escritorio: rejilla de dos columnas, índice de papeles fijo a la izquierda (15.5rem, alto completo, regla derecha doble) y el legajo en el resto. El legajo tiene un margen fluido (clamp(1rem, 3vw, 2.5rem)) con una regla roja de margen a la izquierda, dos reglas verdes a la derecha y el rayado contable cada 1.75rem detrás de todo.

Cada papel abre con una regla de tinta de 2px y un encabezado en tres columnas: letra, títulos con objetivo, formulario de cuatro casillas (Entidad, Papel, Preparado, Revisado). Entre papeles hay clamp(3.5rem, 8vw, 6.5rem). Las tablas usan celdas de 0.6rem por 0.85rem, filetes de 1px y cabecera en papel hondo; los campos de detalle se ordenan en rejilla de dos columnas con filete inferior.

Responsivo: la carátula pasa a una columna a 1180px; a 1100px el índice se convierte en franja horizontal fija arriba solo con letras y se pierden las reglas de margen; a 860px el formulario del papel baja bajo el título; a 760px las tablas se apilan como filas etiquetadas (etiqueta de 0.6875rem sobre cada valor); a 640px la hoja levantada ocupa toda la pantalla; a 520px el formulario del papel pasa a 2 por 2.

## Elevation & Depth

Plano por defecto. La profundidad se expresa con reglas, con el papel claro sobre el papel y con el papel hondo en cabeceras. Hay exactamente una pila elevada: la hoja de referencia que se levanta desde la derecha sobre un velo de tinta al 22 %, con una segunda hoja de papel hondo girada -1.2° asomando debajo cuando el lector ya siguió una referencia.

### Shadow Vocabulary
- **Hoja levantada** (`box-shadow: 0 1px 0 rgb(21 34 26 / 0.06), 0 24px 48px -18px rgb(21 34 26 / 0.34), 0 6px 14px -6px rgb(21 34 26 / 0.12)`): solo la hoja de referencia abierta.
- **Hoja de abajo** (`box-shadow: 0 1px 0 rgb(21 34 26 / 0.05), 0 6px 16px -10px rgb(21 34 26 / 0.3)`): solo la hoja previa de la pila, bajo la hoja levantada.

### Named Rules
**La Regla de la Hoja Única.** Ninguna superficie tiene sombra salvo la hoja levantada y la que asoma debajo. Sin tarjetas, sin sombras de reposo, sin sombras desplazadas duras.

## Shapes

Esquinas rectas en todo (0px): formularios, botones, filtros, bloques, hojas, tablas. Las únicas curvas son trazos de lápiz dibujados a mano en SVG (círculo alrededor del nivel elegido y de la letra actual, trazo bajo la referencia) y el punto circular del mapa de calor (50 %), que es un punto trazado sobre una cuadrícula. El foco usa 2px de redondeo para que el anillo no corte el texto. Los bordes son de 1px; el 2px está reservado a la regla de tinta que abre papel, índice y cierre. El borde punteado de 1px indica algo pendiente de completar (botón Firmar revisión, nivel 0 de la trama).

## Components

### Buttons
Herramientas de escritorio, no llamadas a la acción.
- **Shape:** rectos (0px), borde de 1px.
- **Botón de hoja** (papel claro, tinta, borde regla fuerte, 0.3rem por 0.6rem, 0.8125rem): Cerrar, Volver; variante solo icono con 0.4rem.
- **Acción** (papel claro, tinta, borde tinta suave, 0.32rem por 0.7rem): acciones de la matriz como Restablecer y Descargar; deshabilitada al 45 % de opacidad.
- **Pendiente** (sin fondo, azul, borde punteado regla fuerte, 0.15rem por 0.45rem): "Firmar revisión"; al firmar se reemplaza por iniciales en mono rojo con un sello que se estampa.
- **Texto azul** (sin fondo, azul, borde transparente): Copiar en bloques de código.
- **Hover / Focus:** en puntero fino el borde sube a tinta suave o azul; al presionar escala 0.96 a 0.97 en 140ms con ease-out; foco con anillo azul de 2px separado 2px.

### Chips
No hay chips ni insignias de color. Los filtros de la matriz son un control segmentado: casillas rectas dentro de un borde de regla fuerte, separadas por filetes; la activa se invierte a tinta con texto papel claro.

### Cards / Containers
- **Corner Style:** recto (0px).
- **Background:** papel claro para formularios, código y hoja; nada más se encaja.
- **Shadow Strategy:** ninguna (ver La Regla de la Hoja Única).
- **Border:** 1px regla fuerte; formulario de la carátula con 1px tinta suave.
- **Internal Padding:** celdas de formulario 0.45rem por 0.75rem; código 0.85rem por 1rem.

### Inputs / Fields
- **Style:** campo de iniciales para firmar: 4.25rem, papel, borde regla fuerte, mono 0.8125rem en mayúsculas, placeholder grafito.
- **Focus:** anillo azul global.
- **Selector de nivel 0-4:** cinco números mono sin caja; el elegido se pone rojo y en negrita y un círculo de lápiz se dibuja a su alrededor en 300ms; el valor original queda tachado en grafito.

### Navigation
- **Índice de papeles:** columna fija con título condensado sobre regla de tinta de 2px, fases PHVA (Planificar, Hacer, Verificar, Actuar, Soporte) como etiquetas grafito, filas con letra del papel (800, ancho 62 %) y nombre a 0.875rem entre filetes. El papel actual se pone en tinta y peso 620 con un círculo rojo a lápiz alrededor de la letra; los papeles firmados muestran un sello rojo; las marcas de lectura usan un banderín azul. Pie con el estado de firmas.
- **Móvil (1100px o menos):** franja horizontal fija con solo las letras, sin barra de desplazamiento visible.

### Referencia cruzada (firma)
ID en mono azul con nombre opcional en tinta suave. Un trazo de lápiz azul en SVG se dibuja debajo al pasar el puntero o al enfocar (220ms) y se queda dibujado y más grueso cuando la fila de origen está activa (320ms con retardo escalonado). Al tocarla, la hoja destino se levanta desde la derecha con resorte (0.46s, rebote 0.12) y el recorrido de migas en mono permite volver.

### Marca de cotejo
Icono Phosphor en peso bold, rojo, girado -7° (parcial, 18°), con texto en tinta (cumple), tinta suave (parcial) o rojo (no cumple). Al aparecer se estampa: de 1.35 a 1 de escala en 260ms. Siempre forma más texto.

### Trama
Cuadro de 0.95rem con borde rojo al 70 % y rayado diagonal a lápiz cuya densidad codifica el nivel: 0 borde punteado grafito, 1 rayado abierto, 2 rayado denso, 3 cruzado, 4 cruzado denso con fondo rojo al 20 %. Acompaña puntajes, bandas y prioridades en lugar de cualquier insignia rellena. El puntaje va en mono 650 con ancho mínimo de 4ch para alinear la palabra de banda.

### Hoja de referencia
Panel de 41rem fijo a 0.75rem del borde, papel claro con rayado, regla roja de margen a 2.6rem, barra en papel hondo con recorrido y botones, contenido con sangría de 3.4rem. Título con ID en mono encima del nombre como parte del mismo h2, y debajo el tipo y papel de origen en grafito.

## Do's and Don'ts

### Do:
- **Do** usar rojo solo para marcas de cotejo, sellos, círculos de selección a lápiz y excepciones (banda Crítico, escenario de riesgo); azul solo para referencias cruzadas, enlaces y foco; tinta verde negra para IDs y texto.
- **Do** acompañar cada estado con forma y texto (marca + palabra, trama + puntaje + banda).
- **Do** codificar bandas, prioridades y madurez con la Trama de cinco densidades.
- **Do** abrir cada papel nuevo con regla de tinta de 2px, letra, título, formulario de cuatro casillas y leyenda de marcas al pie.
- **Do** escribir todo ID canónico en JetBrains Mono y hacerlo referencia azul cuando lleve a otro papel.
- **Do** usar el eje de ancho de Archivo para la jerarquía: condensada en formularios y títulos, normal en prosa.
- **Do** marcar la selección invirtiendo a tinta sobre papel claro.
- **Do** dar movimiento de papel con ease-out (cubic-bezier(0.23, 1, 0.32, 1)): presión a 0.97 en 140ms, trazos de 220 a 320ms, sellos de 260 a 280ms, hoja con resorte, y dejarlo instantáneo con movimiento reducido.
- **Do** mantener tema claro único, elegido por la escena de uso.
- **Do** mantener el código fuente sin comentarios de ningún tipo (CSS, TSX, SQL, HTML): los nombres se explican solos.

### Don't:
- **Don't** usar insignias, chips o etiquetas rellenas de color para bandas, estados o prioridades.
- **Don't** poner rótulos tipo eyebrow o kicker encima de los títulos.
- **Don't** usar rayas largas (em dash) en el texto visible.
- **Don't** agregar tarjetas, esquinas redondeadas ni sombras fuera de la hoja levantada.
- **Don't** agregar un tema oscuro, candados, neón ni la estética de panel GRC con barra lateral de tarjetas.
- **Don't** usar azul para texto que no se puede seguir, ni rojo como color decorativo o de acento.
- **Don't** introducir un tercer tono de acento ni un color de estado verde o ámbar.
