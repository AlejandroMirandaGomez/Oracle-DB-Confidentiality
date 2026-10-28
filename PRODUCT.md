# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript, sitio estático sin backend. La evaluación de cada persona se guarda en su navegador y se puede exportar e importar como archivo `.json`. Se publicará en GitHub Pages desde el repositorio Git del curso, con rutas por hash para que la recarga funcione sin servidor.

## Users

- **Primario:** DBA o responsable de seguridad de cualquier organización que usa bases de datos Oracle. Quiere medir qué tan protegida está la confidencialidad de sus datos, saber qué falta y recibir un plan de acción con remediación que pueda aplicar.
- **Secundario:** el profesor Johnny Villalobos Murillo (curso Administración de Bases de Datos, Escuela de Informática, Universidad Nacional de Costa Rica, II Ciclo 2026), que califica el artefacto contra una rúbrica de 100 puntos y necesita encontrar cada elemento exigido y verificar que sea técnicamente correcto y auditable.
- **Terciario (inferido):** el autor, Alejandro Obed Miranda Gómez, que usa la aplicación como demostración en el video explicativo de 5 minutos.

## Product Purpose

Aplicación de autoevaluación de la confidencialidad en bases de datos Oracle para cualquier organización. Guía un recorrido ordenado: entender los cinco riesgos de confidencialidad, conocer las tareas críticas del DBA, elegir los controles ISO/IEC 27001:2022 (Anexo A) e ISO/IEC 27002:2022 que los mitigan, evaluar la madurez de cada control de 0 a 4 con evidencias requeridas, ejecutar una batería de pruebas técnicas y obtener hallazgos priorizados con remediación. El éxito es doble: que una organización termine con un plan de acción propio, y que el artefacto cumpla la rúbrica del curso: riesgos y tareas (20 %), mapeo y justificación de controles (20 %), matriz y controles observables (20 %), pruebas técnicas y scripts (15 %), documentación de uso de IA y APA 7 (15 %), presentación (10 %).

## Positioning

Une el marco normativo con consultas SQL y pruebas que se pueden repetir sobre cualquier instancia Oracle, y genera hallazgos y remediación a partir de lo que la propia organización documenta. Incluye un ejemplo real de solo lectura, evaluado sobre una instancia Oracle 21c XE (PDB `XEPDB1`), donde cada afirmación se puede seguir hasta el resultado de su script. Toda la información está encadenada: riesgo → tarea → control → evidencia → prueba → hallazgo.

## Operating Context

- Metodología PHVA (Planificar-Hacer-Verificar-Actuar) y principio de mínimo privilegio.
- Motor Oracle Database con herramientas SQL*Plus, SQL Developer, RMAN y lsnrctl.
- Las pruebas funcionales usan un entorno de prueba temporal con objetos `PRUEBA_*` que el usuario crea y elimina con los scripts de la aplicación.
- El estado vive en el navegador de quien evalúa; no hay cuentas ni servidor, y nada se ejecuta contra la base de la organización desde la aplicación.
- Los scripts `.sql` de verificación del ejemplo son entregables propios dentro del repositorio.
- Referencias en APA 7; normativa costarricense: Ley 8968 y su reglamento.
- Otros entregables del curso fuera de esta aplicación: repositorio Git, video de 5 minutos, tabla de uso de IA firmada. El informe PDF quedó fuera del alcance por decisión del autor.

## Capabilities and Constraints

Contenido obligatorio del artefacto:
1. Tabla de riesgos R-CONF-01 a R-CONF-05 con impacto y probabilidad.
2. Tabla de al menos 12 tareas críticas del DBA: gestión de usuarios, privilegios, autenticación, cifrado TDE, enmascaramiento, backup, auditoría, parcheo, listener, eliminación segura, logs, clones DEV/TEST.
3. Mapeo a los controles A5.12, A5.15, A5.16, A5.17, A5.18, A5.33, A8.2, A8.3, A8.5, A8.10, A8.11, A8.12, A8.13, A8.15 y A8.20, con implementación sugerida y evidencia observable.
4. Lista de 15 controles observables por un auditor externo.
5. Matriz de evaluación: Tarea | Riesgo | Control | Madurez 0-4 | Evidencia | Estado (Cumple / No cumple / Parcial).
6. Batería de pruebas: ID, Tipo, Procedimiento, Resultado esperado, Herramienta, con scripts de verificación.

Capacidades de la herramienta:
- Matriz de 18 filas que arranca sin evaluar; cada fila pide evidencias (Sí, Parcial, No) y sugiere un nivel que la persona confirma.
- Batería de 23 pruebas con SQL para copiar y resultado observado documentado por la persona.
- Hallazgos que se desbloquean al completar la matriz y se refinan al completar la batería.
- Nombre opcional de la organización evaluada, exportación de la evaluación en `.json` y exportación de la matriz y del plan de acción.
- Historial local de evaluaciones guardadas al completar la matriz, con detalle de solo lectura y gráficas de salud y de puntuación de los controles en el tiempo. La ficha de cada control también muestra su propia evolución para la organización de la sesión. La puntuación de cada control está entre 0 y 1 y combina su nivel de madurez de 0 a 4 con las evidencias documentadas.
- Un navegador sin sesión previa inicia como Cliente y carga cinco evaluaciones simuladas, identificadas como demostración y eliminables de forma permanente en ese navegador. El historial admite guardados adicionales y muestra controles que mejoran y otros que retroceden. El cierre de sesión explícito se conserva al recargar.

Restricciones:
- La escala de madurez es 0-4.
- El texto de ISO/IEC 27002:2022 está licenciado al autor para uso académico, pero el sitio es público: se parafrasea y se cita, nunca se transcribe.
- Idioma: español. Tema claro únicamente.
- El contenido común no menciona la instancia del ejemplo ni sus cuentas, fechas o resultados; esos datos viven solo en el ejemplo de solo lectura.
- Nada de rutas locales de los equipos del autor en el proyecto entregable.

## Brand Commitments

Encabezado académico de la asignación: Universidad Nacional de Costa Rica · Escuela de Informática · Administración de Bases de Datos · Prof. Johnny Villalobos Murillo · II Ciclo 2026. Autor: Alejandro Obed Miranda Gómez. No hay logotipos ni activos de marca disponibles.

## Evidence on Hand

- Enunciado de la asignación (documento del curso, fuera del repositorio).
- Salidas reales de las 23 pruebas ejecutadas sobre la instancia del ejemplo, en `evidencias/`, con sus scripts en `sql/` y el ejecutor en `scripts/`.
- Ausencias que no deben inventarse: no hay una segunda organización evaluada ni resultados de pruebas distintos de los del ejemplo.

## Product Principles

1. **Trazabilidad total:** cada riesgo se puede seguir hasta sus tareas, controles, evidencias, pruebas y hallazgos, y de vuelta.
2. **Evidencia antes que afirmación:** ningún control se marca como cumplido sin una evidencia que la persona haya documentado.
3. **Del conocimiento a la acción:** cada pantalla acerca a la persona a un plan de acción propio, no a un informe ajeno.
4. **Honestidad técnica:** las limitaciones del motor y los incumplimientos se muestran tal cual, con su remediación.
5. **La norma se cita, no se copia.**

## Accessibility & Inclusion

Contraste AA en todo texto, foco visible, navegación completa por teclado, respeto de `prefers-reduced-motion` y ningún desplazamiento horizontal de la página a 390 px. El color nunca es la única señal: todo estado lleva texto.
