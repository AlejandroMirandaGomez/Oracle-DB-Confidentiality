@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-02 | Ciclo de vida de identidades: cuentas mantenidas por Oracle y cuentas nominales | A5.16
PROMPT
@@_contexto.sql
PROMPT Cuentas mantenidas por Oracle abiertas y con autenticación (solo deberían figurar SYS y SYSTEM)
SELECT username, account_status, authentication_type
FROM dba_users
WHERE oracle_maintained = 'Y' AND account_status = 'OPEN' AND authentication_type <> 'NONE'
ORDER BY username;
PROMPT Cuentas mantenidas por Oracle por estado
SELECT account_status, authentication_type, COUNT(*) AS cuentas
FROM dba_users WHERE oracle_maintained = 'Y'
GROUP BY account_status, authentication_type ORDER BY cuentas DESC;
PROMPT Identidades creadas por la organización
SELECT username, account_status, authentication_type, profile, created, TO_CHAR(last_login, 'YYYY-MM-DD HH24:MI') AS ultimo_acceso
FROM dba_users WHERE oracle_maintained = 'N' ORDER BY username;
EXIT
