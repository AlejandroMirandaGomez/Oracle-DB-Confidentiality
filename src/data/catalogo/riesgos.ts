import type { Riesgo } from '../tipos'

export const riesgos: Riesgo[] = [
  {
    id: 'R-CONF-01',
    nombre: 'Privilegios excesivos y cuentas administrativas compartidas',
    descripcion:
      'Cuentas con más privilegios de los que su función necesita, o cuentas administrativas compartidas, permiten leer cualquier dato sin que la acción se pueda atribuir a una persona.',
    escenario:
      'Un operador usa SYSTEM para una consulta de soporte, ejecuta SELECT sobre la tabla de clientes y exporta el resultado. La sesión aparece como SYSTEM y no identifica a nadie.',
    activos: ['Cuentas SYS, SYSTEM y la cuenta administradora de cada PDB', 'Roles DBA y PDB_DBA', 'Datos de todos los esquemas'],
    amenaza: 'Abuso de privilegios por personal interno o por un atacante que obtiene una credencial administrativa.',
    vulnerabilidad:
      'Cuentas administrativas compartidas o abiertas sin dueño, privilegios otorgados directamente a las cuentas y sin revisión periódica.',
    impacto: 5,
    probabilidad: 4,
    justificacionImpacto: 'Una cuenta con DBA lee la totalidad de los datos personales y puede desactivar otros controles.',
    justificacionProbabilidad:
      'Es frecuente que SYS y SYSTEM sigan abiertas, que no existan cuentas administrativas nominales y que los privilegios no se revisen por calendario.',
    tareas: ['T-01', 'T-02'],
    controles: ['A8.2', 'A5.18', 'A5.15'],
  },
  {
    id: 'R-CONF-02',
    nombre: 'Acceso no autorizado por autenticación débil, red sin cifrar o motor sin parches',
    descripcion:
      'Contraseñas débiles, verificadores antiguos, tráfico en claro o vulnerabilidades conocidas permiten que un tercero obtenga una sesión válida o capture datos en tránsito.',
    escenario:
      'Un equipo en la misma red captura el tráfico TCP hacia el puerto del listener y lee en claro los resultados de las consultas, o prueba contraseñas contra una cuenta del perfil DEFAULT, que por omisión admite 10 intentos.',
    activos: ['Listener y servicios de la base', 'Credenciales de las cuentas', 'Datos en tránsito'],
    amenaza: 'Captura de tráfico, ataques de fuerza bruta o explotación de vulnerabilidades publicadas del motor.',
    vulnerabilidad:
      'Oracle Net sin cifrado, verificadores de contraseña 11G, perfil DEFAULT sin función de verificación y versiones del motor sin las actualizaciones trimestrales.',
    impacto: 5,
    probabilidad: 3,
    justificacionImpacto: 'Una sesión obtenida así hereda todos los privilegios de la cuenta comprometida.',
    justificacionProbabilidad:
      'Requiere acceso a la red, pero las configuraciones por omisión del motor dejan estas debilidades presentes hasta que alguien las corrige.',
    tareas: ['T-03', 'T-08', 'T-09'],
    controles: ['A8.5', 'A5.17', 'A8.20', 'A8.8'],
  },
  {
    id: 'R-CONF-03',
    nombre: 'Exposición de datos en reposo, en respaldos y en residuos',
    descripcion:
      'Los datafiles, las piezas de respaldo y los objetos borrados conservan los datos en un formato legible fuera de los controles de acceso de la base.',
    escenario:
      'Alguien copia las piezas del directorio de respaldos a un medio externo y las restaura en otra instancia: obtiene la base completa porque las piezas no están cifradas.',
    activos: ['Datafiles de la base', 'Piezas de respaldo RMAN', 'Papelera de reciclaje', 'Volcados de Data Pump'],
    amenaza: 'Robo o copia de archivos por acceso al sistema operativo o al almacenamiento.',
    vulnerabilidad: 'Sin TDE, respaldos sin cifrar y papelera activa que conserva tablas borradas.',
    impacto: 5,
    probabilidad: 3,
    justificacionImpacto: 'Una sola copia de respaldo expone todos los datos sin pasar por ningún control de la base.',
    justificacionProbabilidad:
      'Requiere acceso al equipo o al almacenamiento, pero Oracle no cifra los respaldos por omisión y es habitual que las piezas queden legibles.',
    tareas: ['T-04', 'T-06', 'T-10'],
    controles: ['A8.13', 'A8.10', 'A8.12', 'A8.24'],
  },
  {
    id: 'R-CONF-04',
    nombre: 'Datos personales visibles para usuarios o entornos sin necesidad de conocerlos',
    descripcion:
      'Usuarios de soporte, analistas o entornos de desarrollo reciben columnas y filas que su trabajo no requiere, y los datos pueden salir de la base por canales no controlados.',
    escenario:
      'Para depurar un error se clona la tabla de clientes a desarrollo con las cédulas y salarios reales, y un desarrollador la exporta a una hoja de cálculo.',
    activos: ['Columnas clasificadas (cédula, correo, salario)', 'Copias para DEV/TEST', 'Paquetes UTL_FILE y UTL_HTTP'],
    amenaza: 'Divulgación por personal autorizado a la base pero no a esos datos, o extracción por paquetes de red y archivos.',
    vulnerabilidad:
      'Datos sin clasificar, ausencia de redacción y enmascaramiento en los esquemas de la organización, PUBLIC con EXECUTE sobre paquetes UTL_*.',
    impacto: 4,
    probabilidad: 4,
    justificacionImpacto: 'Expone datos personales de acceso restringido según el artículo 9 de la Ley 8968.',
    justificacionProbabilidad:
      'Es la vía más frecuente de fuga interna, y el motor otorga a PUBLIC paquetes de extracción como UTL_FILE y UTL_HTTP mientras nadie los revoque.',
    tareas: ['T-05', 'T-12', 'T-13', 'T-02'],
    controles: ['A5.12', 'A8.3', 'A8.11', 'A8.12', 'A5.15', 'A8.31'],
  },
  {
    id: 'R-CONF-05',
    nombre: 'Actividad indebida no detectada ni atribuible',
    descripcion:
      'Sin registros completos, protegidos y revisados, un acceso indebido a datos confidenciales no se detecta, no se puede atribuir a nadie y no sirve como evidencia.',
    escenario:
      'Un usuario consulta salarios fuera de su función durante semanas. Nadie lo nota porque no hay una política que audite el acceso a esa tabla ni una revisión de los registros.',
    activos: ['Rastro de auditoría unificada', 'Alert log y trazas', 'Registros del listener'],
    amenaza: 'Actividad maliciosa o negligente que se repite sin consecuencias, o manipulación de registros por un administrador.',
    vulnerabilidad: 'Auditoría en modo mixto sin políticas sobre datos sensibles, sin retención definida ni revisión periódica.',
    impacto: 4,
    probabilidad: 3,
    justificacionImpacto: 'Impide demostrar el cumplimiento del artículo 10 de la Ley 8968 y responder a un incidente.',
    justificacionProbabilidad:
      'Las políticas de auditoría por omisión existen, pero no cubren el acceso a los datos ni definen archivo ni purga del rastro.',
    tareas: ['T-07', 'T-11'],
    controles: ['A8.15', 'A5.33'],
  },
]
