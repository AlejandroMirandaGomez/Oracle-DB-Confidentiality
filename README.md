# Legajo ISO/IEC 27001:2022 · Confidencialidad en la administración de bases de datos

Artefacto interactivo de la asignación del curso Administración de Bases de Datos (Universidad Nacional de Costa Rica, Escuela de Informática, II Ciclo 2026). Autor: Alejandro Obed Miranda Gómez.

El sitio presenta un legajo de papeles de trabajo de auditoría sobre una instancia real de Oracle Database 21c Express Edition: riesgos de confidencialidad, tareas del DBA, mapeo de controles del Anexo A, controles observables, matriz de evaluación editable, batería de pruebas con sus scripts y evidencias, hallazgos, marco teórico, uso documentado de IA y referencias APA 7.

## Requisitos

- Node.js 20 o superior.
- Para repetir las pruebas: Oracle Database 21c XE con la PDB `XEPDB1`, SQL*Plus y RMAN en el `PATH`, y una cuenta de Windows del grupo `ORA_DBA` (las pruebas se conectan con autenticación del sistema operativo).

## Ejecutar el sitio

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`. Para generar la versión estática: `npm run build` (queda en `dist/`).

## Repetir la batería de pruebas

```powershell
powershell -ExecutionPolicy Bypass -File scripts\ejecutar_bateria.ps1
```

El script:

1. Genera contraseñas aleatorias para los usuarios de prueba (no se guardan).
2. Ejecuta `sql/00_preparar_entorno_prueba.sql`, que crea en `XEPDB1` el esquema `LEGAJO_APP` con datos sintéticos, un perfil seguro, un rol de lectura, políticas VPD, de redacción y de auditoría, y una copia enmascarada en `LEGAJO_DEV`.
3. Ejecuta las pruebas `PR-01` a `PR-23` y guarda cada salida en `evidencias/`.
4. Ejecuta `sql/99_eliminar_entorno_prueba.sql`, que elimina todos los objetos `LEGAJO_*`.

Las evidencias reemplazan el nombre del equipo y sus direcciones IP locales por `EQUIPO-LOCAL` e `IP-LOCAL`. Los registros de auditoría que generan las pruebas permanecen en el rastro unificado, porque la base no permite borrarlos.

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/data/` | Contenido del legajo: riesgos, tareas, controles, observables, pruebas, matriz, hallazgos, marco teórico, referencias y uso de IA |
| `src/papeles/` | Un componente por papel de trabajo (S y A a J) |
| `src/componentes/` | Referencias cruzadas, hoja lateral, marcas de cotejo, selector de nivel y bloques de código |
| `sql/` | Scripts de verificación entregables |
| `scripts/` | Ejecutor de la batería |
| `evidencias/` | Salidas reales de la última ejecución |

## Estado guardado en el navegador

Los niveles ajustados en la matriz, las firmas de revisión, las validaciones de la tabla de IA y la firma de la declaración jurada se guardan en el `localStorage` del navegador. El botón **Volver a la evidencia** restablece la matriz a los niveles que sostienen las pruebas.
