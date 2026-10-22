@@_formato.sql
PROMPT
PROMPT PR-03 | Titulares de privilegios administrativos | A8.2
PROMPT
@@_contexto.sql
PROMPT Titulares de los roles DBA y PDB_DBA en todos los contenedores
SELECT r.con_id, r.grantee, r.granted_role, r.admin_option
FROM cdb_role_privs r
WHERE r.granted_role IN ('DBA', 'PDB_DBA')
ORDER BY r.con_id, r.grantee;
PROMPT Usuarios en el archivo de contraseñas (SYSDBA, SYSOPER, SYSBACKUP, SYSKM)
SELECT username, sysdba, sysoper, sysbackup, syskm, account_status FROM v$pwfile_users;
PROMPT Parámetros relacionados con el acceso privilegiado
SELECT name, value FROM v$parameter
WHERE name IN ('remote_login_passwordfile', 'audit_sys_operations', 'os_authent_prefix')
ORDER BY name;
EXIT
