import type { PlantillaHallazgo } from '../tipos'

const remediacionTde =
  "ALTER SYSTEM SET WALLET_ROOT = '<ruta del almacén>' SCOPE = SPFILE;\nSHUTDOWN IMMEDIATE\nSTARTUP\nALTER SYSTEM SET TDE_CONFIGURATION = 'KEYSTORE_CONFIGURATION=FILE';\nADMINISTER KEY MANAGEMENT CREATE KEYSTORE IDENTIFIED BY \"<clave>\";\nADMINISTER KEY MANAGEMENT SET KEYSTORE OPEN IDENTIFIED BY \"<clave>\" CONTAINER = ALL;\nADMINISTER KEY MANAGEMENT SET KEY IDENTIFIED BY \"<clave>\" WITH BACKUP CONTAINER = ALL;\nALTER TABLESPACE <tablespace> ENCRYPTION ONLINE USING 'AES256' ENCRYPT;"

const remediacionRed =
  'SQLNET.ENCRYPTION_SERVER = REQUIRED\nSQLNET.ENCRYPTION_TYPES_SERVER = (AES256)\nSQLNET.CRYPTO_CHECKSUM_SERVER = REQUIRED\nSQLNET.CRYPTO_CHECKSUM_TYPES_SERVER = (SHA256)'

const remediacionPublic =
  'REVOKE EXECUTE ON utl_file FROM PUBLIC;\nREVOKE EXECUTE ON utl_http FROM PUBLIC;\nREVOKE EXECUTE ON utl_tcp FROM PUBLIC;\nREVOKE EXECUTE ON utl_smtp FROM PUBLIC;\nREVOKE EXECUTE ON utl_inaddr FROM PUBLIC;\nREVOKE EXECUTE ON httpuritype FROM PUBLIC;\nREVOKE EXECUTE ON dbms_ldap FROM PUBLIC;'

const remediacionPerfil =
  'ALTER PROFILE DEFAULT LIMIT\n  FAILED_LOGIN_ATTEMPTS 5\n  PASSWORD_VERIFY_FUNCTION ora12c_strong_verify_function\n  PASSWORD_REUSE_TIME 365\n  PASSWORD_REUSE_MAX 12\n  INACTIVE_ACCOUNT_TIME 90;'

const remediacionAuditoria =
  "BEGIN\n  DBMS_AUDIT_MGMT.SET_LAST_ARCHIVE_TIMESTAMP(\n    audit_trail_type  => DBMS_AUDIT_MGMT.AUDIT_TRAIL_UNIFIED,\n    last_archive_time => SYSTIMESTAMP - INTERVAL '90' DAY);\n  DBMS_AUDIT_MGMT.CREATE_PURGE_JOB(\n    audit_trail_type           => DBMS_AUDIT_MGMT.AUDIT_TRAIL_UNIFIED,\n    audit_trail_purge_interval => 24,\n    audit_trail_purge_name     => '<nombre del trabajo de purga>',\n    use_last_arch_timestamp    => TRUE);\nEND;\n/"

const remediacionVpd =
  "BEGIN\n  DBMS_RLS.ADD_POLICY(\n    object_schema   => '<esquema>',\n    object_name     => '<tabla>',\n    policy_name     => '<política>',\n    function_schema => '<esquema>',\n    policy_function => '<función de política>',\n    statement_types => 'SELECT,UPDATE,DELETE',\n    update_check    => TRUE);\nEND;\n/"

const remediacionRedaccion =
  "BEGIN\n  DBMS_REDACT.ADD_POLICY(\n    object_schema => '<esquema>',\n    object_name   => '<tabla>',\n    policy_name   => '<política>',\n    column_name   => '<columna>',\n    function_type => DBMS_REDACT.FULL,\n    expression    => '1=1');\nEND;\n/"

const remediacionClasificacion = "COMMENT ON COLUMN <esquema>.<tabla>.<columna> IS 'CLASIF=CONFIDENCIAL;TIPO=<tipo de dato>';"

const remediacionCopiaEnmascarada =
  'CREATE TABLE <esquema_dev>.<tabla> AS\nSELECT <clave>,\n       ORA_HASH(<identificador>) AS <identificador>,\n       ROUND(<monto> * (0.85 + DBMS_RANDOM.VALUE * 0.3), -3) AS <monto>\nFROM <esquema>.<tabla>;'

export const plantillasHallazgo: PlantillaHallazgo[] = [
  {
    control: 'A8.20',
    titulo: 'El tráfico de Oracle Net viaja sin cifrar',
    condicionNoCumple:
      'Las sesiones TCP a la base no negocian cifrado ni integridad: sqlnet.ora no exige parámetros de cifrado y el listener acepta conexiones sin restringir interfaces ni nodos.',
    condicionParcial: 'El cifrado o la integridad se aceptan pero no se exigen, o el listener no limita todos los nodos y servicios que debería.',
    criterio: 'A8.20 pide proteger la confidencialidad del tráfico y restringir las conexiones a la red.',
    causa: 'La configuración por omisión acepta cifrado pero no lo solicita, y ningún extremo lo exige.',
    efecto: 'Cualquier equipo en la red puede leer en claro los resultados de las consultas (R-CONF-02).',
    recomendacion: 'Exigir cifrado e integridad en el servidor, limitar los nodos invitados y retirar EXTPROC si no se usa.',
    remediacion: `${remediacionRed}\nTCP.VALIDNODE_CHECKING = YES\nTCP.INVITED_NODES = (<nodos autorizados>)`,
  },
  {
    control: 'A8.24',
    titulo: 'Los datos en reposo no están cifrados',
    condicionNoCumple: 'No hay un almacén de claves abierto ni tablespaces cifrados con TDE.',
    condicionParcial:
      'TDE está configurado, pero quedan tablespaces con datos clasificados sin cifrar o la custodia de la clave maestra no está definida.',
    criterio: 'A8.24 pide reglas de uso de criptografía con gestión de claves; A8.12 pide impedir la extracción no autorizada.',
    causa: 'TDE nunca se configuró o su alcance no incluye los datos clasificados.',
    efecto: 'Una copia de los datafiles basta para leer todos los datos fuera de la base (R-CONF-03).',
    recomendacion: 'Configurar el almacén de claves, cifrar en línea los tablespaces con datos clasificados y cifrar los nuevos por omisión.',
    remediacion: remediacionTde,
  },
  {
    control: 'A8.13',
    titulo: 'Los respaldos RMAN no están cifrados',
    condicionNoCumple:
      'Las piezas de respaldo activas tienen ENCRYPTED = NO y RMAN reporta ENCRYPTION FOR DATABASE OFF, o no hay un respaldo completo reciente.',
    condicionParcial:
      'Hay respaldos recientes y la restauración se valida, pero parte de las piezas no está cifrada o hay trabajos completos fallidos sin atender.',
    criterio: 'La guía de A8.13 pide cifrar los respaldos cuando la confidencialidad es importante.',
    causa: 'La política de respaldo cubre la disponibilidad pero no la confidencialidad.',
    efecto: 'Las piezas en el disco de respaldos permiten reconstruir la base completa en otra instancia (R-CONF-03).',
    recomendacion: 'Activar el cifrado de respaldos al tener TDE, o por contraseña mientras tanto, y revisar las causas de los trabajos fallidos.',
    remediacion: "CONFIGURE ENCRYPTION FOR DATABASE ON;\nCONFIGURE ENCRYPTION ALGORITHM 'AES256';\nSET ENCRYPTION ON IDENTIFIED BY \"<clave>\" ONLY;",
  },
  {
    control: 'A8.8',
    titulo: 'El motor no tiene parches de seguridad',
    condicionNoCumple: 'El motor corre una versión de lanzamiento sin ningún parche de seguridad aplicado.',
    condicionParcial: 'Hay parches aplicados, pero no la actualización trimestral vigente.',
    criterio: 'A8.8 pide evaluar la exposición a vulnerabilidades conocidas y corregirlas a tiempo.',
    causa: 'No existe un calendario de aplicación de parches, o la edición instalada no recibe actualizaciones trimestrales.',
    efecto: 'Las vulnerabilidades publicadas siguen abiertas (R-CONF-02).',
    recomendacion:
      'Aplicar la actualización trimestral vigente o migrar a una edición que la reciba, y reducir la exposición de red mientras tanto.',
    remediacion:
      'SELECT version_full FROM v$instance;\nopatch lspatches\nopatch apply <ruta del parche trimestral>',
  },
  {
    control: 'A8.12',
    titulo: 'PUBLIC puede escribir archivos y abrir conexiones de red',
    condicionNoCumple:
      'PUBLIC conserva EXECUTE sobre paquetes que escriben archivos o abren conexiones de red (UTL_FILE, UTL_HTTP, UTL_TCP, UTL_SMTP, UTL_INADDR, HTTPURITYPE, DBMS_LDAP).',
    condicionParcial: 'PUBLIC conserva EXECUTE sobre alguno de esos paquetes o la exportación masiva no se limita a cuentas administrativas.',
    criterio: 'A8.12 pide bloquear los canales por los que la información puede salir.',
    causa: 'Son concesiones por omisión del motor que nunca se revisaron.',
    efecto: 'Cualquier cuenta con una sesión puede enviar datos fuera del servidor (R-CONF-04).',
    recomendacion: 'Revocar de PUBLIC tras analizar dependencias y otorgar solo a las cuentas que lo justifiquen.',
    remediacion: remediacionPublic,
  },
  {
    control: 'A8.5',
    titulo: 'El perfil DEFAULT no protege las contraseñas',
    condicionNoCumple:
      'Las cuentas usan un perfil que admite más de 5 intentos fallidos, no tiene función de verificación y permite reutilizar contraseñas sin límite.',
    condicionParcial:
      'Existe un perfil seguro, pero no todas las cuentas lo usan o le falta alguno de sus límites (reutilización, caducidad o inactividad).',
    criterio: 'A8.5 pide protección contra fuerza bruta y contraseñas robustas.',
    causa: 'El perfil seguro no se asignó a todas las cuentas de la organización.',
    efecto: 'Las cuentas con un perfil débil son vulnerables a la adivinación de contraseñas (R-CONF-02).',
    recomendacion: 'Endurecer DEFAULT o asignar un perfil seguro a todas las cuentas de la organización.',
    remediacion: remediacionPerfil,
  },
  {
    control: 'A5.17',
    titulo: 'Se conservan verificadores de contraseña 11G',
    condicionNoCumple:
      'Las cuentas abiertas guardan verificadores 11G además de 12C, o hay cuentas que conservan la contraseña de fábrica.',
    condicionParcial: 'Algunas cuentas guardan verificadores 11G o no está definido cómo se entregan y cambian las contraseñas temporales.',
    criterio: 'A5.17 pide almacenar y gestionar la información de autenticación de forma protegida.',
    causa: 'sqlnet.ora no fija SQLNET.ALLOWED_LOGON_VERSION_SERVER.',
    efecto: 'El verificador 11G es más fácil de atacar si se obtiene el diccionario de datos (R-CONF-02).',
    recomendacion: 'Fijar el valor 12a y renovar las contraseñas para regenerar solo verificadores 12C.',
    remediacion: 'SQLNET.ALLOWED_LOGON_VERSION_SERVER = 12a\nALTER USER <cuenta> IDENTIFIED BY "<nueva clave>";',
  },
  {
    control: 'A8.2',
    titulo: 'Las cuentas administrativas no son nominales',
    condicionNoCumple: 'No existen cuentas administrativas nominales: los privilegios DBA, PDB_DBA y SYSDBA están en cuentas compartidas.',
    condicionParcial:
      'Existen cuentas nominales con privilegios administrativos, pero también quedan cuentas compartidas o sin auditoría de su uso.',
    criterio: 'A8.2 pide asignar los privilegios administrativos a identidades nominales, al mínimo y con registro de su uso.',
    causa: 'Las cuentas administrativas se crearon durante la instalación y nunca se reemplazaron por cuentas nominales.',
    efecto: 'Las acciones administrativas no se atribuyen a personas (R-CONF-01).',
    recomendacion: 'Crear cuentas nominales con el rol DBA y auditadas, y reservar SYS y SYSTEM para mantenimiento aprobado.',
    remediacion:
      'CREATE USER <iniciales>_dba IDENTIFIED BY "<clave>" PROFILE <perfil seguro>;\nGRANT dba TO <iniciales>_dba;\nREVOKE dba FROM <cuenta compartida>;\nALTER SYSTEM SET AUDIT_SYS_OPERATIONS = TRUE SCOPE = SPFILE;',
  },
  {
    control: 'A5.16',
    titulo: 'Cuentas internas de Oracle abiertas o sin dueño',
    condicionNoCumple:
      'Hay cuentas mantenidas por Oracle abiertas y con autenticación además de SYS y SYSTEM, o cuentas de la organización sin dueño identificable.',
    condicionParcial:
      'Las cuentas internas están bloqueadas salvo SYS y SYSTEM, pero faltan cuentas nominales o un procedimiento de bajas oportunas.',
    criterio: 'A5.16 pide que cada identidad corresponda a una persona o sistema durante todo su ciclo de vida.',
    causa: 'No hay un proceso de alta, cambio y baja de cuentas con un responsable.',
    efecto: 'Quedan credenciales abiertas sin dueño que nadie vigila (R-CONF-01).',
    recomendacion: 'Bloquear las cuentas internas que no se usen, asignar un responsable a cada cuenta y documentar las bajas.',
    remediacion:
      "ALTER USER <cuenta> ACCOUNT LOCK;\nSELECT username, account_status, authentication_type FROM dba_users WHERE oracle_maintained = 'Y' AND account_status = 'OPEN';",
  },
  {
    control: 'A5.18',
    titulo: 'Derechos de acceso sin revisión y cuentas sin uso',
    condicionNoCumple:
      'Hay privilegios ANY fuera de las cuentas administrativas y cuentas abiertas que nunca se usaron o llevan más de 90 días sin uso.',
    condicionParcial:
      'No hay privilegios ANY fuera de administración, pero quedan cuentas abiertas sin uso o sin bloqueo automático por inactividad.',
    criterio: 'A5.18 pide otorgar, revisar y retirar los derechos de acceso según la política.',
    causa: 'Los derechos se otorgan al crear la cuenta y nunca se revisan.',
    efecto: 'Los privilegios acumulados y las cuentas olvidadas amplían la superficie de ataque (R-CONF-01).',
    recomendacion: 'Revisar cada trimestre los privilegios y roles, bloquear las cuentas sin uso y configurar INACTIVE_ACCOUNT_TIME.',
    remediacion:
      'ALTER USER <cuenta> ACCOUNT LOCK;\nREVOKE <privilegio ANY> FROM <cuenta>;\nALTER PROFILE <perfil> LIMIT INACTIVE_ACCOUNT_TIME 90;',
  },
  {
    control: 'A5.33',
    titulo: 'El rastro de auditoría no tiene retención ni purga',
    condicionNoCumple: 'No hay marcas de archivo ni trabajos de purga en DBMS_AUDIT_MGMT.',
    condicionParcial: 'El rastro está protegido contra borrado, pero falta la marca de archivo o el trabajo de purga.',
    criterio: 'A5.33 pide un calendario de conservación de los registros.',
    causa: 'No se definió cuánto tiempo conservar la auditoría ni dónde archivarla.',
    efecto: 'El rastro crece sin control o se pierde sin haberse archivado (R-CONF-05).',
    recomendacion: 'Archivar el rastro, marcar la fecha archivada y programar una purga controlada.',
    remediacion: remediacionAuditoria,
  },
  {
    control: 'A5.12',
    titulo: 'Las columnas con datos personales no están clasificadas',
    condicionNoCumple: 'Ningún esquema de la organización tiene etiquetas de clasificación en sus columnas.',
    condicionParcial: 'Solo algunos esquemas o tablas tienen etiquetas de clasificación.',
    criterio: 'A5.12 pide clasificar toda la información; A8.3 y A8.11 dependen de esa clasificación.',
    causa: 'Los esquemas nunca se inventariaron.',
    efecto: 'Sin clasificación no se sabe qué redactar, filtrar, cifrar o auditar (R-CONF-04).',
    recomendacion: 'Inventariar las columnas con datos personales, etiquetarlas y aplicar el mismo patrón en cada esquema.',
    remediacion: remediacionClasificacion,
  },
  {
    control: 'A8.3',
    titulo: 'Las tablas confidenciales no filtran filas por usuario',
    condicionNoCumple: 'Ninguna tabla confidencial tiene una política de seguridad a nivel de fila (VPD).',
    condicionParcial: 'Solo algunas tablas confidenciales tienen una política VPD habilitada.',
    criterio: 'A8.3 pide limitar el acceso a la información según la política, incluso fila por fila.',
    causa: 'El acceso se resuelve solo con privilegios de objeto, que no distinguen filas.',
    efecto: 'Un usuario con SELECT sobre la tabla ve las filas de todas las unidades (R-CONF-04).',
    recomendacion: 'Aplicar políticas VPD que filtren por la función del usuario y que nieguen el acceso por omisión.',
    remediacion: remediacionVpd,
  },
  {
    control: 'A8.11',
    titulo: 'Las columnas confidenciales no están redactadas',
    condicionNoCumple: 'Ninguna columna confidencial tiene una política de redacción de datos.',
    condicionParcial: 'Solo algunas columnas confidenciales tienen redacción, o las copias para desarrollo conservan valores reales.',
    criterio: 'A8.11 pide mostrar el mínimo de datos necesario, de forma dinámica o estática.',
    causa: 'La redacción se configura columna por columna y nunca se planificó.',
    efecto: 'El personal de soporte y de análisis ve cédulas, correos y montos reales sin necesitarlos (R-CONF-04).',
    recomendacion: 'Aplicar Data Redaction a las columnas clasificadas como confidenciales y entregar a desarrollo solo copias enmascaradas.',
    remediacion: remediacionRedaccion,
  },
  {
    control: 'A5.15',
    titulo: 'Los accesos no se otorgan por roles de función',
    condicionNoCumple: 'Las cuentas reciben privilegios directos y no existen roles por función con negación por omisión.',
    condicionParcial: 'Existen roles por función, pero hay cuentas que conservan privilegios directos.',
    criterio: 'A5.15 pide reglas explícitas de acceso basadas en la necesidad de saber.',
    causa: 'Los privilegios se otorgan caso por caso, sin una matriz de roles por función.',
    efecto: 'Los privilegios sueltos se acumulan y nadie puede explicar por qué una cuenta accede a un dato (R-CONF-04).',
    recomendacion: 'Crear un rol por función de negocio, otorgarlo a las cuentas y retirar los privilegios directos.',
    remediacion:
      'CREATE ROLE <rol de función>;\nGRANT SELECT ON <esquema>.<tabla> TO <rol de función>;\nGRANT <rol de función> TO <cuenta>;\nREVOKE <privilegio directo> FROM <cuenta>;',
  },
  {
    control: 'A8.10',
    titulo: 'La papelera conserva datos confidenciales',
    condicionNoCumple:
      'Los objetos borrados con datos clasificados siguen legibles en la papelera y no hay una práctica de borrado definitivo.',
    condicionParcial:
      'Se usa PURGE al borrar, pero la papelera aún contiene objetos con datos clasificados o no existe un calendario de retención.',
    criterio: 'A8.10 pide eliminar la información confidencial cuando deja de necesitarse, sin dejar copias recuperables.',
    causa: 'La papelera está activa y el borrado se hace con DROP sin PURGE.',
    efecto: 'Los datos borrados siguen siendo recuperables por quien tenga acceso al esquema (R-CONF-03).',
    recomendacion: 'Borrar con PURGE los objetos con datos confidenciales, vaciar la papelera y fijar un calendario de retención.',
    remediacion: 'DROP TABLE <esquema>.<tabla> PURGE;\nPURGE DBA_RECYCLEBIN;',
  },
  {
    control: 'A8.15',
    titulo: 'El acceso a datos clasificados no se registra',
    condicionNoCumple:
      'No hay políticas de auditoría unificada sobre inicios de sesión fallidos, uso de privilegios ni acceso a tablas clasificadas.',
    condicionParcial: 'Se registran los inicios de sesión fallidos, pero no el acceso a las tablas clasificadas, o el rastro no se revisa.',
    criterio: 'A8.15 pide registrar, proteger y analizar los eventos relevantes.',
    causa: 'Solo están activas las políticas por omisión y nadie definió qué eventos importan.',
    efecto: 'Un acceso indebido no se detecta ni se puede atribuir a nadie (R-CONF-05).',
    recomendacion:
      'Mantener ORA_LOGON_FAILURES y ORA_SECURECONFIG, crear políticas sobre las tablas clasificadas y revisar el rastro cada semana.',
    remediacion:
      'AUDIT POLICY ora_logon_failures;\nAUDIT POLICY ora_secureconfig;\nCREATE AUDIT POLICY <política>\n  ACTIONS SELECT ON <esquema>.<tabla>,\n          UPDATE ON <esquema>.<tabla>,\n          DELETE ON <esquema>.<tabla>;\nAUDIT POLICY <política>;',
  },
  {
    control: 'A8.31',
    titulo: 'Las copias para desarrollo conservan valores reales',
    condicionNoCumple: 'Las copias entregadas a desarrollo y pruebas contienen valores reales o tienen privilegios hacia producción.',
    condicionParcial:
      'Las copias no contienen valores reales, pero falta un procedimiento formal de clonado o su separación de producción.',
    criterio: 'A8.31 pide separar desarrollo, prueba y producción, sin copiar información confidencial sin controles equivalentes.',
    causa: 'Se clona la tabla completa para depurar errores sin transformar los datos.',
    efecto: 'Los desarrolladores acceden a datos personales reales fuera de los controles de producción (R-CONF-04).',
    recomendacion: 'Entregar solo copias enmascaradas, en un esquema o PDB separado y sin privilegios hacia producción.',
    remediacion: remediacionCopiaEnmascarada,
  },
]

export const remediacionesDePrueba: Record<string, string> = {
  'PR-01': 'ALTER USER <cuenta> IDENTIFIED BY "<nueva clave>";\nALTER USER <cuenta> PASSWORD EXPIRE;',
  'PR-02': 'ALTER USER <cuenta interna> ACCOUNT LOCK;\nCREATE USER <cuenta nominal> IDENTIFIED BY "<clave>" PROFILE <perfil seguro>;',
  'PR-03': 'REVOKE dba FROM <cuenta compartida>;\nGRANT dba TO <cuenta nominal>;\nALTER SYSTEM SET AUDIT_SYS_OPERATIONS = TRUE SCOPE = SPFILE;',
  'PR-04': 'REVOKE <privilegio ANY> FROM <cuenta>;\nGRANT <rol de función> TO <cuenta>;',
  'PR-05': remediacionPublic,
  'PR-06': `ALTER USER <cuenta> PROFILE <perfil seguro>;\n${remediacionPerfil}`,
  'PR-07': 'ALTER PROFILE <perfil seguro> LIMIT FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 1/24;\nALTER USER <cuenta> PROFILE <perfil seguro>;',
  'PR-08': 'SQLNET.ALLOWED_LOGON_VERSION_SERVER = 12a\nALTER USER <cuenta> IDENTIFIED BY "<nueva clave>";',
  'PR-09':
    'CREATE ROLE <rol de función>;\nGRANT SELECT ON <esquema>.<tabla> TO <rol de función>;\nREVOKE <privilegio directo> FROM <cuenta>;\nGRANT <rol de función> TO <cuenta>;',
  'PR-10': remediacionVpd,
  'PR-11': remediacionRedaccion,
  'PR-12': remediacionClasificacion,
  'PR-13': `${remediacionCopiaEnmascarada}\nREVOKE ALL ON <esquema_dev>.<tabla> FROM <cuenta>;`,
  'PR-14': remediacionTde,
  'PR-15':
    'CREATE AUDIT POLICY <política>\n  ACTIONS SELECT ON <esquema>.<tabla>,\n          UPDATE ON <esquema>.<tabla>,\n          DELETE ON <esquema>.<tabla>;\nAUDIT POLICY <política>;',
  'PR-16': remediacionAuditoria,
  'PR-17': 'CONFIGURE ENCRYPTION FOR DATABASE ON;\nBACKUP DATABASE;',
  'PR-18': 'RESTORE DATABASE VALIDATE;\nRESTORE ARCHIVELOG ALL VALIDATE;',
  'PR-19': remediacionRed,
  'PR-20': 'TCP.VALIDNODE_CHECKING = YES\nTCP.INVITED_NODES = (<nodos autorizados>)\nADMIN_RESTRICTIONS_<nombre del listener> = ON',
  'PR-21': 'DROP TABLE <esquema>.<tabla> PURGE;\nPURGE DBA_RECYCLEBIN;',
  'PR-22': 'SELECT version_full FROM v$instance;\nopatch lspatches\nopatch apply <ruta del parche trimestral>',
  'PR-23': 'ALTER USER <cuenta> ACCOUNT LOCK;\nALTER PROFILE <perfil> LIMIT INACTIVE_ACCOUNT_TIME 90;',
}
