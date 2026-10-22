@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-16 | Protección y retención del rastro de auditoría | A5.33
PROMPT
@@_contexto.sql
PROMPT Auditoría de operaciones de SYS
SELECT name, value FROM v$parameter WHERE name IN ('audit_sys_operations', 'audit_trail') ORDER BY name;
PROMPT Cuenta propietaria del rastro unificado
SELECT username, account_status, authentication_type FROM dba_users WHERE username = 'AUDSYS';
PROMPT Titulares de roles de administración y lectura de auditoría
SELECT grantee, granted_role FROM dba_role_privs WHERE granted_role IN ('AUDIT_ADMIN', 'AUDIT_VIEWER') ORDER BY granted_role, grantee;
PROMPT Intento de borrar registros de auditoría como SYSDBA (se espera ORA-46385)
WHENEVER SQLERROR CONTINUE
DELETE FROM audsys.aud$unified WHERE 1 = 0;
ROLLBACK;
PROMPT Marcas de archivo para purga controlada (se espera al menos una fila)
SELECT audit_trail, last_archive_ts FROM dba_audit_mgmt_last_arch_ts;
PROMPT Trabajos de purga programados (se espera al menos una fila)
SELECT job_name, job_status, audit_trail, job_frequency FROM dba_audit_mgmt_cleanup_jobs;
EXIT
