# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript, sitio estático sin backend. El estado editable (matriz de evaluación) se guarda en el navegador. Por ahora se ejecuta solo en local; más adelante se publicará en GitHub Pages desde el repositorio Git del curso.

## Users

- **Primario:** el profesor Johnny Villalobos Murillo (curso Administración de Bases de Datos, Escuela de Informática, Universidad Nacional de Costa Rica, II Ciclo 2026), que califica el artefacto contra una rúbrica de 100 puntos y necesita encontrar cada elemento exigido y verificar que sea técnicamente correcto y auditable.
- **Secundario (inferido):** el autor, Alejandro Obed Miranda Gómez, que usa el artefacto como demostración en el video explicativo de 5 minutos.

## Product Purpose

Artefacto académico individual que diseña y demuestra un marco de controles ISO/IEC 27001:2022 (Anexo A) e ISO/IEC 27002:2022 para mitigar riesgos de confidencialidad en las tareas de un Administrador de Bases de Datos sobre Oracle 21c XE, con matriz de evaluación y pruebas observables auditables. El éxito es cumplir la rúbrica: riesgos y tareas (20 %), mapeo y justificación de controles (20 %), matriz y controles observables (20 %), pruebas técnicas y scripts (15 %), documentación de uso de IA y APA 7 (15 %), presentación (10 %).

## Positioning

Las evidencias provienen de una instancia real de Oracle 21c XE del autor: los scripts de verificación se ejecutan sobre ella (incluidos objetos de prueba creados y luego eliminados) y el artefacto muestra el resultado obtenido junto al esperado. Toda la información está encadenada: riesgo → tarea → control → evidencia → prueba.

## Operating Context

- Metodología PHVA (Planificar-Hacer-Verificar-Actuar) y principio de mínimo privilegio.
- Motor Oracle 21c XE (CDB `XE`, PDB `XEPDB1`); herramienta SQL Developer.
- Los scripts `.sql` de verificación son entregables propios dentro del repositorio.
- Referencias en APA 7; normativa costarricense: Ley 8968 y su reglamento.
- Otros entregables del curso fuera de este artefacto: repositorio Git, video de 5 minutos, tabla de uso de IA firmada. El informe PDF quedó fuera del alcance por decisión del autor.

## Capabilities and Constraints

Contenido obligatorio del artefacto:
1. Tabla de riesgos R-CONF-01 a R-CONF-05 con impacto y probabilidad.
2. Tabla de al menos 12 tareas críticas del DBA: gestión de usuarios, privilegios, autenticación, cifrado TDE, enmascaramiento, backup, auditoría, parcheo, listener, eliminación segura, logs, clones DEV/TEST.
3. Mapeo a los controles A5.12, A5.15, A5.16, A5.17, A5.18, A5.33, A8.2, A8.3, A8.5, A8.10, A8.11, A8.12, A8.13, A8.15 y A8.20, con implementación sugerida y evidencia observable.
4. Lista de 15 controles observables por un auditor externo.
5. Matriz de evaluación: Tarea | Riesgo | Control | Criterio 0-4 | Evidencia | Estado (Cumple / No cumple / Parcial).
6. Batería de pruebas: ID, Tipo, Procedimiento, Resultado esperado, Herramienta, con scripts de verificación.

Restricciones:
- La escala de madurez de esta asignación es 0-4 (no 0-5 como en el proyecto CloudCR).
- El texto de ISO/IEC 27002:2022 está licenciado al autor para uso académico, pero el sitio será público: se parafrasea y se cita, nunca se transcribe.
- Idioma: español.
- Decisión abierta: si la tabla de uso de IA con declaración jurada y el marco teórico (2-3 páginas) viven dentro del artefacto, ya que el informe PDF quedó fuera.

## Brand Commitments

Encabezado académico de la asignación: Universidad Nacional de Costa Rica · Escuela de Informática · Administración de Bases de Datos · Prof. Johnny Villalobos Murillo · II Ciclo 2026. Autor: Alejandro Obed Miranda Gómez. No hay logotipos ni activos de marca disponibles.

## Evidence on Hand

- Enunciado: `Asignacion-ISO27001-Confidencialidad-DBA-II-Ciclo-2026-UNA.pdf`.
- `D:\UNA\AdministracionBasesDatos\Documentacion\`: ISO IEC 27002-2022.pdf (versión en español), catálogo propio de los 93 controles con peso y C/I/D, Top 30 y Top 10 de controles para auditar BD con preguntas, niveles de madurez derivados de COBIT 4.1, COBIT 4.1 y 2019, documento del Proyecto Integrador CloudCR (metodología de madurez y riesgo).
- Instancia local Oracle 21c XE donde se ejecutarán los scripts.
- Ausencias que no deben inventarse: no hay organización auditada real distinta de la instancia del autor, ni resultados de pruebas hasta que se ejecuten.

## Product Principles

1. **Trazabilidad total:** cada riesgo se puede seguir hasta sus tareas, controles, evidencias y pruebas, y de vuelta.
2. **Evidencia antes que afirmación:** ningún control se marca como Cumple sin un resultado real que lo respalde.
3. **Legible para quien califica:** cada elemento de la rúbrica se encuentra en segundos.
4. **Honestidad técnica:** las limitaciones de Oracle XE y los incumplimientos se muestran tal cual, con su plan de mejora.
5. **La norma se cita, no se copia.**
