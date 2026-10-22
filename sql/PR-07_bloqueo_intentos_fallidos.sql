@@_formato.sql
PROMPT
PROMPT PR-07 | Bloqueo de la cuenta tras intentos fallidos | A8.5
PROMPT
PROMPT Cuatro intentos con contraseña incorrecta sobre LEGAJO_BLOQUEO (perfil con FAILED_LOGIN_ATTEMPTS 3)
WHENEVER SQLERROR CONTINUE
CONNECT legajo_bloqueo/"Clave_Incorrecta_01"@//localhost:1521/XEPDB1
CONNECT legajo_bloqueo/"Clave_Incorrecta_02"@//localhost:1521/XEPDB1
CONNECT legajo_bloqueo/"Clave_Incorrecta_03"@//localhost:1521/XEPDB1
PROMPT Intento con la contraseña correcta después del bloqueo (se espera ORA-28000)
CONNECT legajo_bloqueo/"&1"@//localhost:1521/XEPDB1
CONNECT / AS SYSDBA
@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
@@_contexto.sql
PROMPT Estado de la cuenta después de la prueba
SELECT username, account_status, lock_date, profile FROM dba_users WHERE username = 'LEGAJO_BLOQUEO';
EXIT
