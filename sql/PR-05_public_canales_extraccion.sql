@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-05 | Canales de extracción de datos otorgados a PUBLIC | A8.12 A8.3
PROMPT
@@_contexto.sql
PROMPT Paquetes de red y de archivos ejecutables por cualquier usuario (se espera ninguna fila)
SELECT grantee, table_name, privilege
FROM dba_tab_privs
WHERE grantee = 'PUBLIC'
  AND table_name IN ('UTL_FILE', 'UTL_HTTP', 'UTL_TCP', 'UTL_SMTP', 'UTL_MAIL', 'UTL_INADDR', 'HTTPURITYPE', 'DBMS_LDAP')
ORDER BY table_name;
PROMPT Objetos de la organización con privilegios otorgados a PUBLIC (se espera ninguna fila)
SELECT t.owner, t.table_name, t.privilege
FROM dba_tab_privs t
JOIN dba_users u ON u.username = t.owner
WHERE t.grantee = 'PUBLIC' AND u.oracle_maintained = 'N'
ORDER BY t.owner, t.table_name;
PROMPT Titulares de roles de exportación masiva
SELECT grantee, granted_role FROM dba_role_privs
WHERE granted_role IN ('DATAPUMP_EXP_FULL_DATABASE', 'EXP_FULL_DATABASE')
ORDER BY granted_role, grantee;
PROMPT Privilegios sobre directorios otorgados a cuentas de la organización
SELECT t.grantee, t.table_name AS directorio, t.privilege
FROM dba_tab_privs t
JOIN dba_directories d ON d.directory_name = t.table_name
JOIN dba_users u ON u.username = t.grantee
WHERE u.oracle_maintained = 'N'
ORDER BY t.grantee;
EXIT
