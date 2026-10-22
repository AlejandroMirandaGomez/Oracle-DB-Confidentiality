@@_formato.sql
PROMPT
PROMPT PR-01 | Cuentas con contraseña por defecto | A5.17
PROMPT
@@_contexto.sql
PROMPT Cuentas con contraseña por defecto en todos los contenedores (se espera ninguna fila)
SELECT con_id, username FROM cdb_users_with_defpwd ORDER BY con_id, username;
EXIT
