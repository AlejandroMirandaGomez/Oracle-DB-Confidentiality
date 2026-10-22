@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-23 | Revisión de derechos: cuentas abiertas sin uso reciente | A5.18
PROMPT
@@_contexto.sql
PROMPT Cuentas abiertas de la organización con su último inicio de sesión
SELECT username, account_status, profile, created, TO_CHAR(last_login, 'YYYY-MM-DD HH24:MI') AS ultimo_acceso,
       CASE
         WHEN last_login IS NULL THEN 'NUNCA USADA'
         WHEN last_login < SYSTIMESTAMP - INTERVAL '90' DAY THEN 'SIN USO > 90 DIAS'
         ELSE 'EN USO'
       END AS revision
FROM dba_users
WHERE oracle_maintained = 'N' AND account_status = 'OPEN'
ORDER BY username;
PROMPT Bloqueo automático por inactividad configurado en cada perfil
SELECT profile, limit FROM dba_profiles WHERE resource_name = 'INACTIVE_ACCOUNT_TIME' ORDER BY profile;
EXIT
