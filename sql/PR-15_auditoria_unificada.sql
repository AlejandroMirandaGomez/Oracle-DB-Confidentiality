@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-15 | Registro de eventos con auditoría unificada | A8.15
PROMPT
@@_contexto.sql
PROMPT Modo de auditoría unificada (FALSE indica modo mixto)
SELECT parameter, value FROM v$option WHERE parameter = 'Unified Auditing';
PROMPT Políticas de auditoría habilitadas
SELECT policy_name, enabled_option, entity_name, success, failure FROM audit_unified_enabled_policies ORDER BY policy_name;
BEGIN
  DBMS_AUDIT_MGMT.FLUSH_UNIFIED_AUDIT_TRAIL;
END;
/
PROMPT Inicios de sesión fallidos de LEGAJO_BLOQUEO registrados (generados en PR-07)
SELECT event_timestamp, dbusername, action_name, return_code, unified_audit_policies
FROM unified_audit_trail
WHERE dbusername = 'LEGAJO_BLOQUEO' AND action_name = 'LOGON'
ORDER BY event_timestamp;
PROMPT Accesos a LEGAJO_APP.CLIENTES registrados por la política LEGAJO_AUD_CLIENTES
SELECT event_timestamp, dbusername, action_name, return_code, object_name
FROM unified_audit_trail
WHERE object_schema = 'LEGAJO_APP' AND object_name = 'CLIENTES'
ORDER BY event_timestamp;
EXIT
