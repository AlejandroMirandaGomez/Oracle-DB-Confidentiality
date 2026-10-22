@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-08 | Versiones de verificador de contraseña | A5.17 A8.5
PROMPT
@@_contexto.sql
PROMPT Verificadores almacenados por cuenta con contraseña (se espera solo 12C)
SELECT username, password_versions, account_status
FROM dba_users
WHERE authentication_type = 'PASSWORD' AND account_status = 'OPEN'
ORDER BY username;
PROMPT Cuentas abiertas que conservan el verificador 11G
SELECT COUNT(*) AS cuentas_con_11g
FROM dba_users
WHERE authentication_type = 'PASSWORD' AND account_status = 'OPEN' AND password_versions LIKE '%11G%';
EXIT
