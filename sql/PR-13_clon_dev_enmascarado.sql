@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-13 | Copia para desarrollo con enmascaramiento estático | A8.11 A8.31
PROMPT
@@_contexto.sql
PROMPT Valores reales que sobreviven en la copia de desarrollo (se espera 0 en cada columna)
SELECT
  (SELECT COUNT(*) FROM legajo_dev.clientes_dev d JOIN legajo_app.clientes p ON p.cedula = d.cedula) AS cedulas_reales,
  (SELECT COUNT(*) FROM legajo_dev.clientes_dev d JOIN legajo_app.clientes p ON p.nombre = d.nombre) AS nombres_reales,
  (SELECT COUNT(*) FROM legajo_dev.clientes_dev d JOIN legajo_app.clientes p ON p.correo = d.correo) AS correos_reales,
  (SELECT COUNT(*) FROM legajo_dev.clientes_dev d JOIN legajo_app.clientes p ON p.id_cliente = d.id_cliente AND p.salario = d.salario) AS salarios_identicos
FROM dual;
PROMPT Muestra de la copia de desarrollo
SELECT id_cliente, cedula, nombre, correo, salario, sucursal FROM legajo_dev.clientes_dev WHERE id_cliente <= 4 ORDER BY id_cliente;
PROMPT Privilegios otorgados sobre la copia (se espera ninguna fila)
SELECT grantee, table_name, privilege FROM dba_tab_privs WHERE owner = 'LEGAJO_DEV';
EXIT
