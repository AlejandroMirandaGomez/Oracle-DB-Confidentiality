import type { Prueba } from '../tipos'

export const pruebas: Prueba[] = [
  {
    id: 'PR-01',
    nombre: 'Cuentas con contraseña por defecto',
    tipo: 'Consulta de configuración',
    controles: ['A5.17'],
    objetivo: 'Comprobar que ninguna cuenta de ningún contenedor conserva la contraseña de fábrica.',
    procedimiento: ['Conectar a CDB$ROOT como SYSDBA.', 'Consultar CDB_USERS_WITH_DEFPWD para todos los contenedores.'],
    resultadoEsperado: 'Ninguna fila.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `SELECT con_id, username FROM cdb_users_with_defpwd ORDER BY con_id, username;`,
  },
  {
    id: 'PR-02',
    nombre: 'Cuentas internas abiertas e identidades de la organización',
    tipo: 'Consulta de configuración',
    controles: ['A5.16'],
    objetivo: 'Verificar que las cuentas mantenidas por Oracle estén cerradas y que las demás sean nominales.',
    procedimiento: [
      'Conectar a NOMBRE_PDB como SYSDBA.',
      'Listar las cuentas mantenidas por Oracle abiertas y con autenticación.',
      'Listar las cuentas creadas por la organización con su perfil y último acceso.',
    ],
    resultadoEsperado: 'Solo SYS y SYSTEM abiertas entre las internas; cuentas de la organización nominales y en uso.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT username, account_status, authentication_type
FROM dba_users
WHERE oracle_maintained = 'Y' AND account_status = 'OPEN' AND authentication_type <> 'NONE'
ORDER BY username;
SELECT account_status, authentication_type, COUNT(*) AS cuentas
FROM dba_users WHERE oracle_maintained = 'Y'
GROUP BY account_status, authentication_type ORDER BY cuentas DESC;
SELECT username, account_status, authentication_type, profile, created, TO_CHAR(last_login, 'YYYY-MM-DD HH24:MI') AS ultimo_acceso
FROM dba_users WHERE oracle_maintained = 'N' ORDER BY username;`,
  },
  {
    id: 'PR-03',
    nombre: 'Titulares de privilegios administrativos',
    tipo: 'Consulta de configuración',
    controles: ['A8.2'],
    objetivo: 'Identificar quién tiene DBA, PDB_DBA y privilegios del archivo de contraseñas.',
    procedimiento: ['Consultar CDB_ROLE_PRIVS para DBA y PDB_DBA.', 'Consultar V$PWFILE_USERS.', 'Revisar AUDIT_SYS_OPERATIONS.'],
    resultadoEsperado: 'Titulares nominales y autorizados; operaciones de SYS auditadas.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `SELECT r.con_id, r.grantee, r.granted_role, r.admin_option
FROM cdb_role_privs r
WHERE r.granted_role IN ('DBA', 'PDB_DBA')
ORDER BY r.con_id, r.grantee;
SELECT username, sysdba, sysoper, sysbackup, syskm, account_status FROM v$pwfile_users;
SELECT name, value FROM v$parameter
WHERE name IN ('remote_login_passwordfile', 'audit_sys_operations', 'os_authent_prefix')
ORDER BY name;`,
  },
  {
    id: 'PR-04',
    nombre: 'Privilegios de sistema y ANY',
    tipo: 'Consulta de configuración',
    controles: ['A5.18', 'A8.2'],
    objetivo: 'Detectar privilegios ANY o de sistema excesivos en cuentas que no administran la base.',
    procedimiento: [
      'Listar privilegios directos y roles de las cuentas de la organización.',
      'Buscar privilegios ANY alcanzables mediante roles.',
    ],
    resultadoEsperado: 'Ningún privilegio ANY fuera de las cuentas administrativas.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT p.grantee, p.privilege, p.admin_option
FROM dba_sys_privs p
JOIN dba_users u ON u.username = p.grantee
WHERE u.oracle_maintained = 'N'
ORDER BY p.grantee, p.privilege;
SELECT r.grantee, r.granted_role, r.admin_option, r.default_role
FROM dba_role_privs r
JOIN dba_users u ON u.username = r.grantee
WHERE u.oracle_maintained = 'N'
ORDER BY r.grantee, r.granted_role;
SELECT DISTINCT r.grantee, s.privilege
FROM dba_role_privs r
JOIN dba_users u ON u.username = r.grantee
JOIN role_sys_privs s ON s.role = r.granted_role
WHERE u.oracle_maintained = 'N' AND s.privilege LIKE '%ANY%'
ORDER BY r.grantee, s.privilege
FETCH FIRST 15 ROWS ONLY;`,
  },
  {
    id: 'PR-05',
    nombre: 'Canales de extracción otorgados a PUBLIC',
    tipo: 'Consulta de configuración',
    controles: ['A8.12', 'A8.3'],
    objetivo: 'Comprobar que cualquier usuario no pueda escribir archivos ni abrir conexiones desde la base.',
    procedimiento: [
      'Consultar DBA_TAB_PRIVS para PUBLIC sobre paquetes de archivos y red.',
      'Listar titulares de los roles de exportación masiva.',
      'Listar privilegios sobre directorios.',
    ],
    resultadoEsperado: 'PUBLIC sin EXECUTE sobre los paquetes; exportación solo en cuentas administrativas.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT grantee, table_name, privilege
FROM dba_tab_privs
WHERE grantee = 'PUBLIC'
  AND table_name IN ('UTL_FILE', 'UTL_HTTP', 'UTL_TCP', 'UTL_SMTP', 'UTL_MAIL', 'UTL_INADDR', 'HTTPURITYPE', 'DBMS_LDAP')
ORDER BY table_name;
SELECT t.owner, t.table_name, t.privilege
FROM dba_tab_privs t
JOIN dba_users u ON u.username = t.owner
WHERE t.grantee = 'PUBLIC' AND u.oracle_maintained = 'N'
ORDER BY t.owner, t.table_name;
SELECT grantee, granted_role FROM dba_role_privs
WHERE granted_role IN ('DATAPUMP_EXP_FULL_DATABASE', 'EXP_FULL_DATABASE')
ORDER BY granted_role, grantee;
SELECT t.grantee, t.table_name AS directorio, t.privilege
FROM dba_tab_privs t
JOIN dba_directories d ON d.directory_name = t.table_name
JOIN dba_users u ON u.username = t.grantee
WHERE u.oracle_maintained = 'N'
ORDER BY t.grantee;`,
  },
  {
    id: 'PR-06',
    nombre: 'Perfil DEFAULT frente al perfil seguro',
    tipo: 'Consulta de configuración',
    controles: ['A8.5'],
    objetivo: 'Comparar los límites de contraseña del perfil DEFAULT con los del perfil seguro definido.',
    procedimiento: ['Comparar DBA_PROFILES de DEFAULT y PRUEBA_PERFIL_SEGURO.', 'Listar el perfil asignado a cada cuenta.'],
    resultadoEsperado: 'Todas las cuentas con un perfil que bloquee tras 5 intentos o menos y tenga función de verificación.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT d.resource_name,
       d.limit AS limit_default,
       s.limit AS limit_seguro
FROM dba_profiles d
JOIN dba_profiles s ON s.resource_name = d.resource_name AND s.profile = 'PRUEBA_PERFIL_SEGURO'
WHERE d.profile = 'DEFAULT' AND d.resource_type = 'PASSWORD'
ORDER BY d.resource_name;
SELECT username, profile, account_status FROM dba_users
WHERE oracle_maintained = 'N' ORDER BY profile, username;
SELECT name, value FROM v$parameter WHERE name = 'sec_max_failed_login_attempts';`,
  },
  {
    id: 'PR-07',
    nombre: 'Bloqueo tras intentos fallidos',
    tipo: 'Prueba funcional',
    controles: ['A8.5'],
    objetivo: 'Demostrar que una cuenta con el perfil seguro se bloquea al tercer intento fallido.',
    procedimiento: [
      'Intentar tres conexiones TCP a NOMBRE_PDB como PRUEBA_BLOQUEO con contraseñas incorrectas.',
      'Intentar una cuarta conexión con la contraseña correcta.',
      'Consultar el estado de la cuenta como SYSDBA.',
    ],
    resultadoEsperado: 'ORA-01017 en los tres intentos, ORA-28000 en el cuarto y la cuenta en LOCKED(TIMED).',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `WHENEVER SQLERROR CONTINUE
CONNECT prueba_bloqueo/"Clave_Incorrecta_01"@//localhost:1521/NOMBRE_PDB
CONNECT prueba_bloqueo/"Clave_Incorrecta_02"@//localhost:1521/NOMBRE_PDB
CONNECT prueba_bloqueo/"Clave_Incorrecta_03"@//localhost:1521/NOMBRE_PDB
CONNECT prueba_bloqueo/"<clave del usuario de prueba>"@//localhost:1521/NOMBRE_PDB
CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT username, account_status, lock_date, profile FROM dba_users WHERE username = 'PRUEBA_BLOQUEO';`,
  },
  {
    id: 'PR-08',
    nombre: 'Versiones de verificador de contraseña',
    tipo: 'Consulta de configuración',
    controles: ['A5.17', 'A8.5'],
    objetivo: 'Comprobar que el motor no conserve verificadores 11G, más débiles que los 12C.',
    procedimiento: ['Consultar PASSWORD_VERSIONS de las cuentas abiertas con contraseña.'],
    resultadoEsperado: 'Solo 12C.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT username, password_versions, account_status
FROM dba_users
WHERE authentication_type = 'PASSWORD' AND account_status = 'OPEN'
ORDER BY username;
SELECT COUNT(*) AS cuentas_con_11g
FROM dba_users
WHERE authentication_type = 'PASSWORD' AND account_status = 'OPEN' AND password_versions LIKE '%11G%';`,
  },
  {
    id: 'PR-09',
    nombre: 'Mínimo privilegio con rol de solo lectura',
    tipo: 'Prueba funcional',
    controles: ['A5.15', 'A8.3'],
    objetivo: 'Demostrar que un usuario con rol de lectura no puede modificar datos ni leer otras tablas.',
    procedimiento: [
      'Conectar por TCP como PRUEBA_LECTOR.',
      'Listar SESSION_PRIVS y SESSION_ROLES.',
      'Intentar SELECT, DELETE y UPDATE sobre CLIENTES y SELECT sobre ASIGNACION.',
    ],
    resultadoEsperado: 'Lectura permitida; DELETE y UPDATE con ORA-01031; ASIGNACION con ORA-00942.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `CONNECT prueba_lector/"<clave del usuario de prueba>"@//localhost:1521/NOMBRE_PDB
SELECT privilege FROM session_privs ORDER BY privilege;
SELECT role FROM session_roles ORDER BY role;
SELECT COUNT(*) AS filas_visibles FROM prueba_app.clientes;
WHENEVER SQLERROR CONTINUE
DELETE FROM prueba_app.clientes WHERE id_cliente = 1;
UPDATE prueba_app.clientes SET salario = 0 WHERE id_cliente = 1;
SELECT * FROM prueba_app.asignacion;
ROLLBACK;`,
  },
  {
    id: 'PR-10',
    nombre: 'Restricción de filas con VPD',
    tipo: 'Prueba funcional',
    controles: ['A8.3'],
    objetivo: 'Demostrar que un usuario solo ve las filas de la sucursal que tiene asignada.',
    procedimiento: [
      'Contar filas por sucursal como SYSDBA (exento).',
      'Conectar como PRUEBA_SOPORTE, asignado a HEREDIA, y repetir la consulta.',
    ],
    resultadoEsperado: 'SYSDBA ve 12 filas en tres sucursales; PRUEBA_SOPORTE ve solo las 4 de HEREDIA.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT object_owner, object_name, policy_name, sel, upd, del, enable FROM dba_policies WHERE object_owner = 'PRUEBA_APP';
SELECT sucursal, COUNT(*) AS filas FROM prueba_app.clientes GROUP BY sucursal ORDER BY sucursal;
CONNECT prueba_soporte/"<clave del usuario de prueba>"@//localhost:1521/NOMBRE_PDB
SELECT sucursal, COUNT(*) AS filas FROM prueba_app.clientes GROUP BY sucursal ORDER BY sucursal;`,
  },
  {
    id: 'PR-11',
    nombre: 'Redacción dinámica de columnas confidenciales',
    tipo: 'Prueba funcional',
    controles: ['A8.11'],
    objetivo: 'Demostrar que cédula, correo y salario se muestran redactados a un usuario no exento.',
    procedimiento: [
      'Listar REDACTION_COLUMNS.',
      'Consultar las filas de HEREDIA como SYSDBA.',
      'Consultar las mismas filas como PRUEBA_SOPORTE.',
    ],
    resultadoEsperado: 'Cédula parcial, correo sin nombre de usuario y salario en 0 para PRUEBA_SOPORTE.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT object_owner, object_name, column_name, function_type FROM redaction_columns WHERE object_owner = 'PRUEBA_APP' ORDER BY column_name;
SELECT id_cliente, cedula, correo, salario, sucursal FROM prueba_app.clientes WHERE sucursal = 'HEREDIA' ORDER BY id_cliente;
CONNECT prueba_soporte/"<clave del usuario de prueba>"@//localhost:1521/NOMBRE_PDB
SELECT id_cliente, cedula, correo, salario, sucursal FROM prueba_app.clientes ORDER BY id_cliente;`,
  },
  {
    id: 'PR-12',
    nombre: 'Inventario y etiquetas de clasificación',
    tipo: 'Consulta de configuración',
    controles: ['A5.12'],
    objetivo: 'Verificar que las columnas con datos personales estén etiquetadas.',
    procedimiento: ['Leer DBA_COL_COMMENTS del esquema de prueba.', 'Contar columnas clasificadas por esquema de la organización.'],
    resultadoEsperado: 'Todas las columnas de las tablas con datos personales clasificadas.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT table_name, column_name, comments FROM dba_col_comments
WHERE owner = 'PRUEBA_APP' AND table_name = 'CLIENTES' ORDER BY column_name;
SELECT table_name, comments FROM dba_tab_comments WHERE owner IN ('PRUEBA_APP', 'PRUEBA_DEV') ORDER BY owner, table_name;
SELECT u.username AS esquema,
       COUNT(c.column_name) AS columnas_totales,
       COUNT(CASE WHEN c.comments LIKE 'CLASIF=%' THEN 1 END) AS columnas_clasificadas
FROM dba_users u
LEFT JOIN dba_col_comments c ON c.owner = u.username
WHERE u.oracle_maintained = 'N'
GROUP BY u.username
ORDER BY u.username;`,
  },
  {
    id: 'PR-13',
    nombre: 'Copia para desarrollo con enmascaramiento estático',
    tipo: 'Prueba funcional',
    controles: ['A8.11', 'A8.31'],
    objetivo: 'Demostrar que la copia entregada a desarrollo no contiene ningún valor real.',
    procedimiento: [
      'Cruzar PRUEBA_DEV.CLIENTES_DEV con PRUEBA_APP.CLIENTES por cédula, nombre, correo y salario.',
      'Mostrar una muestra de la copia.',
      'Verificar que la copia no tiene privilegios otorgados.',
    ],
    resultadoEsperado: '0 coincidencias en cada columna y ningún privilegio otorgado.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT
  (SELECT COUNT(*) FROM prueba_dev.clientes_dev d JOIN prueba_app.clientes p ON p.cedula = d.cedula) AS cedulas_reales,
  (SELECT COUNT(*) FROM prueba_dev.clientes_dev d JOIN prueba_app.clientes p ON p.nombre = d.nombre) AS nombres_reales,
  (SELECT COUNT(*) FROM prueba_dev.clientes_dev d JOIN prueba_app.clientes p ON p.correo = d.correo) AS correos_reales,
  (SELECT COUNT(*) FROM prueba_dev.clientes_dev d JOIN prueba_app.clientes p ON p.id_cliente = d.id_cliente AND p.salario = d.salario) AS salarios_identicos
FROM dual;
SELECT id_cliente, cedula, nombre, correo, salario, sucursal FROM prueba_dev.clientes_dev WHERE id_cliente <= 4 ORDER BY id_cliente;
SELECT grantee, table_name, privilege FROM dba_tab_privs WHERE owner = 'PRUEBA_DEV';`,
  },
  {
    id: 'PR-14',
    nombre: 'Cifrado de datos en reposo con TDE',
    tipo: 'Consulta de configuración',
    controles: ['A8.24', 'A8.12'],
    objetivo: 'Comprobar que el almacén de claves esté abierto y los tablespaces cifrados.',
    procedimiento: ['Consultar V$ENCRYPTION_WALLET.', 'Revisar WALLET_ROOT y TDE_CONFIGURATION.', 'Listar tablespaces cifrados.'],
    resultadoEsperado: 'Almacén OPEN y tablespaces de datos con ENCRYPTED = YES.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `SELECT con_id, wrl_type, wrl_parameter, status, wallet_type, keystore_mode FROM v$encryption_wallet ORDER BY con_id;
SELECT name, value FROM v$parameter WHERE name IN ('wallet_root', 'tde_configuration', 'encrypt_new_tablespaces') ORDER BY name;
SELECT con_id, tablespace_name, encrypted FROM cdb_tablespaces WHERE con_id IN (1, 3) ORDER BY con_id, tablespace_name;
SELECT parameter, value FROM v$option WHERE parameter IN ('Transparent Data Encryption', 'Backup Encryption');`,
  },
  {
    id: 'PR-15',
    nombre: 'Registro de eventos con auditoría unificada',
    tipo: 'Prueba funcional',
    controles: ['A8.15'],
    objetivo: 'Demostrar que los intentos fallidos de PR-07 y los accesos de PR-09 a PR-11 quedaron registrados.',
    procedimiento: [
      'Listar las políticas habilitadas.',
      'Forzar la escritura con DBMS_AUDIT_MGMT.FLUSH_UNIFIED_AUDIT_TRAIL.',
      'Buscar en UNIFIED_AUDIT_TRAIL los LOGON de PRUEBA_BLOQUEO y los accesos a CLIENTES.',
    ],
    resultadoEsperado: 'Cuatro LOGON fallidos de PRUEBA_BLOQUEO y los SELECT, DELETE y UPDATE de los usuarios de prueba.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT parameter, value FROM v$option WHERE parameter = 'Unified Auditing';
SELECT policy_name, enabled_option, entity_name, success, failure FROM audit_unified_enabled_policies ORDER BY policy_name;
BEGIN
  DBMS_AUDIT_MGMT.FLUSH_UNIFIED_AUDIT_TRAIL;
END;
/
SELECT event_timestamp, dbusername, action_name, return_code, unified_audit_policies
FROM unified_audit_trail
WHERE dbusername = 'PRUEBA_BLOQUEO' AND action_name = 'LOGON'
ORDER BY event_timestamp;
SELECT event_timestamp, dbusername, action_name, return_code, object_name
FROM unified_audit_trail
WHERE object_schema = 'PRUEBA_APP' AND object_name = 'CLIENTES'
ORDER BY event_timestamp;`,
  },
  {
    id: 'PR-16',
    nombre: 'Protección y retención del rastro de auditoría',
    tipo: 'Prueba funcional',
    controles: ['A5.33'],
    objetivo: 'Demostrar que ni SYSDBA puede borrar auditoría y verificar que exista retención definida.',
    procedimiento: [
      'Revisar AUDIT_SYS_OPERATIONS y la cuenta AUDSYS.',
      'Intentar DELETE sobre AUDSYS.AUD$UNIFIED con un filtro que no afecta filas.',
      'Consultar marcas de archivo y trabajos de purga.',
    ],
    resultadoEsperado: 'ORA-46385 en el borrado; al menos una marca de archivo y un trabajo de purga.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT name, value FROM v$parameter WHERE name IN ('audit_sys_operations', 'audit_trail') ORDER BY name;
SELECT username, account_status, authentication_type FROM dba_users WHERE username = 'AUDSYS';
SELECT grantee, granted_role FROM dba_role_privs WHERE granted_role IN ('AUDIT_ADMIN', 'AUDIT_VIEWER') ORDER BY granted_role, grantee;
WHENEVER SQLERROR CONTINUE
DELETE FROM audsys.aud$unified WHERE 1 = 0;
ROLLBACK;
SELECT audit_trail, last_archive_ts FROM dba_audit_mgmt_last_arch_ts;
SELECT job_name, job_status, audit_trail, job_frequency FROM dba_audit_mgmt_cleanup_jobs;`,
  },
  {
    id: 'PR-17',
    nombre: 'Respaldos recientes y cifrados',
    tipo: 'Consulta de configuración',
    controles: ['A8.13'],
    objetivo: 'Comprobar la vigencia de los respaldos y si sus piezas están cifradas.',
    procedimiento: ['Listar trabajos RMAN de 14 días.', 'Calcular días desde el último completo exitoso.', 'Contar piezas por cifrado.'],
    resultadoEsperado: 'Un completo exitoso en los últimos 7 días y todas las piezas cifradas.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `SELECT session_key, input_type, status, start_time, end_time, output_bytes_display
FROM v$rman_backup_job_details
WHERE start_time > SYSDATE - 14
ORDER BY start_time;
SELECT ROUND(SYSDATE - MAX(end_time), 1) AS dias_desde_ultimo_full
FROM v$rman_backup_job_details
WHERE input_type = 'DB FULL' AND status = 'COMPLETED';
SELECT encrypted, COUNT(*) AS piezas FROM v$backup_piece WHERE status = 'A' GROUP BY encrypted;
SELECT name, value FROM v$rman_configuration ORDER BY name;`,
  },
  {
    id: 'PR-18',
    nombre: 'Validación de la restauración',
    tipo: 'Validación con RMAN',
    controles: ['A8.13'],
    objetivo: 'Demostrar que el respaldo del tablespace USERS de NOMBRE_PDB se puede restaurar.',
    procedimiento: [
      'Ejecutar SHOW ENCRYPTION FOR DATABASE.',
      'Listar respaldos de NOMBRE_PDB:USERS.',
      'Ejecutar RESTORE TABLESPACE NOMBRE_PDB:USERS VALIDATE.',
    ],
    resultadoEsperado: 'Validación terminada sin errores.',
    herramienta: 'RMAN',
    lenguaje: 'RMAN',
    sql: `rman target /
SHOW ENCRYPTION FOR DATABASE;
LIST BACKUP OF TABLESPACE NOMBRE_PDB:USERS SUMMARY;
RESTORE TABLESPACE NOMBRE_PDB:USERS VALIDATE;`,
  },
  {
    id: 'PR-19',
    nombre: 'Cifrado de la conexión de red',
    tipo: 'Prueba funcional',
    controles: ['A8.20'],
    objetivo: 'Comprobar si una sesión TCP real a NOMBRE_PDB negocia cifrado e integridad.',
    procedimiento: ['Conectar por TCP a localhost:1521/NOMBRE_PDB.', 'Leer V$SESSION_CONNECT_INFO de la propia sesión.'],
    resultadoEsperado: 'Líneas del adaptador de cifrado AES y del de integridad SHA.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `CONNECT /@//localhost:1521/NOMBRE_PDB AS SYSDBA
SELECT network_service_banner FROM v$session_connect_info WHERE sid = SYS_CONTEXT('USERENV', 'SID');
SELECT COUNT(DISTINCT c.sid) AS sesiones_tcp_sin_cifrado
FROM v$session_connect_info c
WHERE c.network_service_banner LIKE '%TCP/IP%'
  AND NOT EXISTS (
    SELECT 1 FROM v$session_connect_info e
    WHERE e.sid = c.sid AND e.serial# = c.serial# AND e.network_service_banner LIKE '%Encryption service adapter%');`,
  },
  {
    id: 'PR-20',
    nombre: 'Configuración del listener y de Oracle Net',
    tipo: 'Revisión de archivos',
    controles: ['A8.20'],
    objetivo: 'Revisar la seguridad del listener y los parámetros de red del servidor.',
    procedimiento: [
      'Ejecutar lsnrctl status en el servidor de la base.',
      "Leer sqlnet.ora y listener.ora, ubicados en el directorio de red indicado por TNS_ADMIN o en network/admin del ORACLE_HOME, sin las líneas de comentario. En Windows, usar Get-Content con Where-Object { $_ -notmatch '^\\s*#' }.",
    ],
    resultadoEsperado: 'Autenticación local del listener, cifrado exigido en sqlnet.ora y solo los servicios necesarios.',
    herramienta: 'lsnrctl y revisión de archivos',
    lenguaje: 'Comandos',
    sql: `lsnrctl status
grep -v '^[[:space:]]*#' "$ORACLE_HOME/network/admin/sqlnet.ora"
grep -v '^[[:space:]]*#' "$ORACLE_HOME/network/admin/listener.ora"`,
  },
  {
    id: 'PR-21',
    nombre: 'Residuos en la papelera y purga',
    tipo: 'Prueba funcional',
    controles: ['A8.10'],
    objetivo: 'Demostrar que un DROP sin PURGE deja datos legibles y que la purga los elimina.',
    procedimiento: [
      'Borrar sin PURGE la tabla TMP_EXTRACCION con cédulas y salarios.',
      'Leer la tabla desde su nombre en la papelera.',
      'Ejecutar PURGE TABLE y volver a revisar la papelera.',
    ],
    resultadoEsperado: 'Datos legibles tras el DROP y ninguno tras el PURGE.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SET SERVEROUTPUT ON
SELECT name, value FROM v$parameter WHERE name = 'recyclebin';
DROP TABLE prueba_app.tmp_extraccion;
SELECT owner, original_name, type, droptime FROM dba_recyclebin WHERE owner = 'PRUEBA_APP';
DECLARE
  v_objeto dba_recyclebin.object_name%TYPE;
  v_filas  NUMBER;
BEGIN
  SELECT object_name INTO v_objeto FROM dba_recyclebin
  WHERE owner = 'PRUEBA_APP' AND original_name = 'TMP_EXTRACCION' AND type = 'TABLE';
  EXECUTE IMMEDIATE 'SELECT COUNT(*) FROM prueba_app."' || v_objeto || '"' INTO v_filas;
  DBMS_OUTPUT.PUT_LINE('Filas legibles en ' || v_objeto || ': ' || v_filas);
END;
/
PURGE TABLE prueba_app.tmp_extraccion;
SELECT COUNT(*) AS objetos_en_papelera FROM dba_recyclebin WHERE owner = 'PRUEBA_APP';
SELECT owner, COUNT(*) AS objetos FROM dba_recyclebin GROUP BY owner ORDER BY owner;`,
  },
  {
    id: 'PR-22',
    nombre: 'Nivel de parches del motor',
    tipo: 'Consulta de configuración',
    controles: ['A8.8'],
    objetivo: 'Identificar la versión exacta y los parches aplicados.',
    procedimiento: ['Consultar V$INSTANCE y V$VERSION.', 'Consultar CDB_REGISTRY_SQLPATCH.', 'Ejecutar opatch lspatches.'],
    resultadoEsperado: 'La actualización trimestral vigente aplicada.',
    herramienta: 'SQL*Plus y OPatch',
    lenguaje: 'SQL',
    sql: `SELECT instance_name, version_full, startup_time FROM v$instance;
SELECT banner_full FROM v$version;
SELECT con_id, patch_id, patch_type, action, status, action_time, description FROM cdb_registry_sqlpatch ORDER BY con_id, action_time;`,
  },
  {
    id: 'PR-23',
    nombre: 'Cuentas abiertas sin uso reciente',
    tipo: 'Consulta de configuración',
    controles: ['A5.18'],
    objetivo: 'Encontrar cuentas abiertas que nunca se usaron o no se usan hace más de 90 días.',
    procedimiento: ['Listar cuentas abiertas con su último inicio de sesión.', 'Revisar INACTIVE_ACCOUNT_TIME por perfil.'],
    resultadoEsperado: 'Ninguna cuenta abierta sin uso y bloqueo por inactividad de 90 días o menos.',
    herramienta: 'SQL*Plus',
    lenguaje: 'SQL',
    sql: `ALTER SESSION SET CONTAINER = NOMBRE_PDB;
SELECT username, account_status, profile, created, TO_CHAR(last_login, 'YYYY-MM-DD HH24:MI') AS ultimo_acceso,
       CASE
         WHEN last_login IS NULL THEN 'NUNCA USADA'
         WHEN last_login < SYSTIMESTAMP - INTERVAL '90' DAY THEN 'SIN USO > 90 DIAS'
         ELSE 'EN USO'
       END AS revision
FROM dba_users
WHERE oracle_maintained = 'N' AND account_status = 'OPEN'
ORDER BY username;
SELECT profile, limit FROM dba_profiles WHERE resource_name = 'INACTIVE_ACCOUNT_TIME' ORDER BY profile;`,
  },
]
