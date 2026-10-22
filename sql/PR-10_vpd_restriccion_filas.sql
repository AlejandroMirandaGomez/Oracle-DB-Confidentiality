@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-10 | Restricción de filas con Virtual Private Database | A8.3
PROMPT
@@_contexto.sql
PROMPT Política VPD registrada
SELECT object_owner, object_name, policy_name, sel, upd, del, enable FROM dba_policies WHERE object_owner = 'LEGAJO_APP';
PROMPT Filas por sucursal vistas por una sesión exenta (SYSDBA)
SELECT sucursal, COUNT(*) AS filas FROM legajo_app.clientes GROUP BY sucursal ORDER BY sucursal;
CONNECT legajo_soporte/"&1"@//localhost:1521/XEPDB1
@@_formato.sql
@@_contexto.sql
PROMPT Filas por sucursal vistas por LEGAJO_SOPORTE (asignado a HEREDIA)
SELECT sucursal, COUNT(*) AS filas FROM legajo_app.clientes GROUP BY sucursal ORDER BY sucursal;
EXIT
