@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-06 | Parámetros de contraseña del perfil DEFAULT y del perfil seguro | A8.5
PROMPT
@@_contexto.sql
PROMPT Límites de contraseña de DEFAULT frente a LEGAJO_PERFIL_SEGURO
SELECT d.resource_name,
       d.limit AS limit_default,
       s.limit AS limit_seguro
FROM dba_profiles d
JOIN dba_profiles s ON s.resource_name = d.resource_name AND s.profile = 'LEGAJO_PERFIL_SEGURO'
WHERE d.profile = 'DEFAULT' AND d.resource_type = 'PASSWORD'
ORDER BY d.resource_name;
PROMPT Perfil asignado a cada cuenta de la organización
SELECT username, profile, account_status FROM dba_users
WHERE oracle_maintained = 'N' ORDER BY profile, username;
PROMPT Límite global de intentos fallidos por conexión
SELECT name, value FROM v$parameter WHERE name = 'sec_max_failed_login_attempts';
EXIT
