@@_formato.sql
WHENEVER SQLERROR CONTINUE
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT 99 | Eliminación del entorno de prueba LEGAJO_* en XEPDB1
PROMPT
@@_contexto.sql
NOAUDIT POLICY legajo_aud_clientes;
DROP AUDIT POLICY legajo_aud_clientes;
BEGIN
  DBMS_REDACT.DROP_POLICY(object_schema => 'LEGAJO_APP', object_name => 'CLIENTES', policy_name => 'LEGAJO_RED_CLIENTES');
END;
/
BEGIN
  DBMS_RLS.DROP_POLICY(object_schema => 'LEGAJO_APP', object_name => 'CLIENTES', policy_name => 'LEGAJO_VPD_SUCURSAL');
END;
/
DROP USER legajo_lector CASCADE;
DROP USER legajo_soporte CASCADE;
DROP USER legajo_bloqueo CASCADE;
DROP USER legajo_dev CASCADE;
DROP USER legajo_app CASCADE;
DROP ROLE legajo_rol_lectura;
DROP PROFILE legajo_perfil_seguro;
PROMPT Objetos LEGAJO restantes (se espera 0 en cada fila)
SELECT 'usuarios' AS tipo, COUNT(*) AS restantes FROM dba_users WHERE username LIKE 'LEGAJO%'
UNION ALL SELECT 'roles', COUNT(*) FROM dba_roles WHERE role LIKE 'LEGAJO%'
UNION ALL SELECT 'perfiles', COUNT(DISTINCT profile) FROM dba_profiles WHERE profile LIKE 'LEGAJO%'
UNION ALL SELECT 'politicas de auditoria', COUNT(DISTINCT policy_name) FROM audit_unified_policies WHERE policy_name LIKE 'LEGAJO%'
UNION ALL SELECT 'politicas de redaccion', COUNT(*) FROM redaction_policies WHERE policy_name LIKE 'LEGAJO%'
UNION ALL SELECT 'politicas vpd', COUNT(*) FROM dba_policies WHERE policy_name LIKE 'LEGAJO%';
EXIT
