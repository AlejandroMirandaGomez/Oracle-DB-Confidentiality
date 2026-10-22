@@_formato.sql
PROMPT
PROMPT PR-09 | Mínimo privilegio con rol de solo lectura | A5.15 A8.3
PROMPT
CONNECT legajo_lector/"&1"@//localhost:1521/XEPDB1
@@_formato.sql
@@_contexto.sql
PROMPT Privilegios y roles activos de la sesión
SELECT privilege FROM session_privs ORDER BY privilege;
SELECT role FROM session_roles ORDER BY role;
PROMPT Lectura permitida por el rol LEGAJO_ROL_LECTURA
SELECT COUNT(*) AS filas_visibles FROM legajo_app.clientes;
WHENEVER SQLERROR CONTINUE
PROMPT Intento de borrado (se espera ORA-01031)
DELETE FROM legajo_app.clientes WHERE id_cliente = 1;
PROMPT Intento de modificación (se espera ORA-01031)
UPDATE legajo_app.clientes SET salario = 0 WHERE id_cliente = 1;
PROMPT Intento de leer una tabla sin privilegio (se espera ORA-00942)
SELECT * FROM legajo_app.asignacion;
ROLLBACK;
EXIT
