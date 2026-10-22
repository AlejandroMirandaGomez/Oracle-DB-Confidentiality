@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-11 | Redacción dinámica de columnas confidenciales | A8.11
PROMPT
@@_contexto.sql
PROMPT Columnas protegidas por la política de redacción
SELECT object_owner, object_name, column_name, function_type FROM redaction_columns WHERE object_owner = 'LEGAJO_APP' ORDER BY column_name;
PROMPT Valores almacenados (sesión SYSDBA, exenta de redacción)
SELECT id_cliente, cedula, correo, salario, sucursal FROM legajo_app.clientes WHERE sucursal = 'HEREDIA' ORDER BY id_cliente;
CONNECT legajo_soporte/"&1"@//localhost:1521/XEPDB1
@@_formato.sql
@@_contexto.sql
PROMPT Mismas filas consultadas por LEGAJO_SOPORTE
SELECT id_cliente, cedula, correo, salario, sucursal FROM legajo_app.clientes ORDER BY id_cliente;
EXIT
