---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Confidencialidad en bases de datos Oracle: tablero anunciador

## Scope and mode

Aplicación de varias páginas (React, rutas por hash) con navbar fijo. Modo **Operate** (tablas, matriz, batería, hallazgos, archivo de evaluación) con bolsillos **Read** (marco teórico y ejemplo XEPDB1 de solo lectura). Escritorio primero, en una oficina con luz de día; a 390 px debe funcionar completo.

## Audience, job, proof, constraints

- DBA o responsable de seguridad de cualquier organización, y el profesor que califica la rúbrica del curso.
- Tarea: recorrer riesgos, tareas, controles, matriz, batería y hallazgos; exportar el plan de acción y la evaluación.
- Prueba: consultas SQL repetibles, evidencias requeridas por fila y un ejemplo real de solo lectura (XEPDB1) con su salida.
- Restricciones: escala 0 a 4; español; tema claro; sin rayas largas; sin comentarios en el código; el contenido común no menciona la instancia del ejemplo.

## Chosen direction and memorable moment

Tablero anunciador de sala de control, fijado por el autor. Momento memorable: al documentar la última evidencia de una fila, su lámpara se enciende en el color del estado y el panel de detalle deja seguir la cadena riesgo, control, prueba y hallazgo.

## Unresolved

- Inicio: el recorrido de seis pasos puede ser una fila de ventanas de anunciador o una lista vertical; se decide al construir esa página.

## Direction contract

THESIS: La aplicación es un tablero anunciador de sala de control: cada control es una ventana que se enciende según la evidencia que la organización documenta, y la trazabilidad es el diagrama mímico que la recorre. Rechaza el centro de cumplimiento (sidebar, tarjetas, insignias de color) y el sitio cyber oscuro con candados y neón.

OWN-WORLD: Acero pintado gris claro con placas grabadas en Archivo condensado y tinta casi negra. El chasis usa dos tintas y el color existe solo como lámpara encendida (verde, ámbar, roja, blanca), siempre con texto grabado encima. Ventanas de esquinas casi rectas (2 a 3 px) con brillo interior y nunca resplandor exterior. Pulsadores con borde de 1 px y presión de scale(0.97). Cinta de mímico: IDs en JetBrains Mono con subrayado grueso que se enciende al enfocar. Madurez 0 a 4 como cinco intensidades fijas de lámpara blanca con su número. Sin sombras salvo el panel lateral de detalle, tintada hacia la tinta.

STORY: La persona entiende que el tablero muestra qué tan protegida está su base Oracle, cree en cada lámpara porque nace de evidencias que ella documentó y de consultas que puede repetir, y actúa: completa la matriz, corre la batería, abre un hallazgo y exporta su plan de acción.

FIRST VIEWPORT: Navbar fijo de 60 px: nombre corto del proyecto a la izquierda y los menús Herramientas y Material de apoyo a la derecha, con una lámpara pequeña en la ruta activa. Debajo, mucho aire: la placa del título (dos líneas como máximo, Archivo condensado), una descripción breve, el campo Organización evaluada y un único pulsador Comenzar el diagnóstico. Más abajo, el recorrido de seis pasos con su lámpara de progreso y una placa de créditos discreta.

FORM: Tablero anunciador de sala de control (THE ROLL), dirección fijada por el usuario en el plan de rediseño; no se sorteó ni se presentaron alternativas. Interacción firma: seguir una referencia en el panel lateral anclado a la derecha y ver encenderse la lámpara. Movimiento: lámparas en 160 a 200 ms, panel con resorte corto (0,4 s, rebote 0,1) y salida de 180 ms ease-out, pulsadores en 120 a 160 ms; con movimiento reducido todo pasa a solo opacidad. Construcción code-led, sin comp.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
