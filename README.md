# Confidencialidad en bases de datos Oracle

Aplicación web para que cualquier organización aprenda, autoevalúe la confidencialidad de sus bases de datos Oracle y obtenga hallazgos con remediación, a partir de los controles de ISO/IEC 27001:2022 (Anexo A) e ISO/IEC 27002:2022.

Proyecto del curso Administración de Bases de Datos (Universidad Nacional de Costa Rica, Escuela de Informática, II Ciclo 2026). Autor: Alejandro Obed Miranda Gómez. Profesor: Johnny Villalobos Murillo.

La instancia Oracle 21c XE (PDB `XEPDB1`) con la que se construyó el contenido es ahora un **ejemplo de solo lectura**: se puede recorrer completo en `/ejemplos/xepdb1`, con sus scripts, sus salidas reales y sus hallazgos.

## Rutas de la aplicación

La aplicación usa rutas por hash, así que cualquier ruta se puede recargar sin servidor y publicarse en GitHub Pages.

| Ruta | Contenido |
| --- | --- |
| `#/` | Inicio: organización evaluada opcional, recorrido de seis pasos con su avance y material de apoyo |
| `#/riesgos` | Tabla de los cinco riesgos de confidencialidad, mapa de calor y escalas |
| `#/tareas` | Las 13 tareas críticas del DBA por fase PHVA |
| `#/controles` y `#/controles/:id` | Controles ISO/IEC 27001:2022 con su implementación en Oracle y lo que verifica un auditor externo |
| `#/matriz` | Matriz de evaluación de 18 filas, con evidencias requeridas y nivel de madurez de 0 a 4 |
| `#/pruebas` | Batería de 23 pruebas técnicas, con entorno de prueba y SQL para copiar |
| `#/hallazgos` | Hallazgos y plan de acción, desbloqueados al completar la matriz |
| `#/marco-teorico` | Marco teórico y referencias APA 7 |
| `#/uso-ia` | Declaración del uso de IA |
| `#/ejemplos` y `#/ejemplos/xepdb1` | Lista de ejemplos y el ejemplo XEPDB1 de solo lectura |

Cualquier referencia (riesgo, tarea, control, fila, prueba o hallazgo) abre un panel de detalle a la derecha. El enlace profundo viaja en el hash, por ejemplo `#/riesgos?ref=R-CONF-01`.

## Cómo se guarda la evaluación

- El avance se guarda solo en el `localStorage` del navegador, con el prefijo `confidencialidad-oracle:`. No hay servidor ni cuentas.
- La evaluación también se puede **exportar e importar** como archivo `.json` (formato `evaluacion-confidencialidad-oracle`, versión 1) desde el Inicio, la Matriz y los Hallazgos. El archivo incluye el nombre de la organización, los niveles y las respuestas de evidencias y de pruebas. No incluye las validaciones de IA ni la firma de la declaración.
- El nombre de la organización es opcional y aparece en los hallazgos, en el CSV de la matriz, en el plan de acción y en el archivo de la evaluación.
- Los hallazgos se generan con una función pura (`src/estado/hallazgos.ts`) a partir de los niveles, las evidencias y las pruebas, y mejoran cuando la batería está completa.

## Requisitos

- Node.js 20 o superior.

## Ejecutar la aplicación

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`. Para generar la versión estática: `npm run build` (queda en `dist/`). Verificaciones: `npx tsc -b` y `npx oxlint`.

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/data/catalogo/` | Contenido común a cualquier organización: riesgos, tareas, controles con su observable, matriz con sus evidencias requeridas, pruebas con su SQL, plantillas de hallazgos, marco teórico, referencias y uso de IA |
| `src/data/ejemplos/` | Ejemplos de solo lectura; `xepdb1/` conserva los datos reales de la instancia evaluada |
| `src/estado/` | Evaluación guardada, cálculo de riesgo residual, generación de hallazgos, índice de referencias y exportaciones |
| `src/paginas/` | Una página por ruta |
| `src/componentes/` | Navbar, panel de detalle, lámparas, componente tabular, selectores y bloques de código |
| `sql/`, `scripts/`, `evidencias/` | Scripts, ejecutor y salidas reales del ejemplo XEPDB1 |

## Repetir la batería sobre una instancia propia

Para repetir la batería del ejemplo se necesita Oracle Database 21c XE con la PDB `XEPDB1`, SQL*Plus y RMAN en el `PATH`, y una cuenta de Windows del grupo `ORA_DBA`, porque las pruebas se conectan con autenticación del sistema operativo.

```powershell
powershell -ExecutionPolicy Bypass -File scripts\ejecutar_bateria.ps1
```

El script:

1. Genera contraseñas aleatorias para los usuarios de prueba (no se guardan).
2. Ejecuta `sql/00_preparar_entorno_prueba.sql`, que crea en `XEPDB1` el esquema `LEGAJO_APP` con datos sintéticos, un perfil seguro, un rol de lectura, políticas VPD, de redacción y de auditoría, y una copia enmascarada en `LEGAJO_DEV`.
3. Ejecuta las pruebas `PR-01` a `PR-23` y guarda cada salida en `evidencias/`.
4. Ejecuta `sql/99_eliminar_entorno_prueba.sql`, que elimina todos los objetos `LEGAJO_*`.

Las evidencias reemplazan el nombre del equipo, las direcciones IP locales y las rutas de instalación por `EQUIPO-LOCAL`, `IP-LOCAL`, `<ORACLE_BASE>`, `<ORACLE_BASE_HOME>` y `<DIR_RESPALDOS>`. Los registros de auditoría que generan las pruebas permanecen en el rastro unificado, porque la base no permite borrarlos.

La aplicación muestra el mismo SQL, con los objetos de prueba renombrados a `PRUEBA_*`, en la página de la batería, para que cualquier organización lo ejecute en su propio entorno de prueba.
