@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-12 | Inventario y etiquetas de clasificación de datos | A5.12
PROMPT
@@_contexto.sql
PROMPT Etiquetas de clasificación del esquema de prueba
SELECT table_name, column_name, comments FROM dba_col_comments
WHERE owner = 'LEGAJO_APP' AND table_name = 'CLIENTES' ORDER BY column_name;
SELECT table_name, comments FROM dba_tab_comments WHERE owner IN ('LEGAJO_APP', 'LEGAJO_DEV') ORDER BY owner, table_name;
PROMPT Columnas con etiqueta CLASIF= por esquema de la organización
SELECT u.username AS esquema,
       COUNT(c.column_name) AS columnas_totales,
       COUNT(CASE WHEN c.comments LIKE 'CLASIF=%' THEN 1 END) AS columnas_clasificadas
FROM dba_users u
LEFT JOIN dba_col_comments c ON c.owner = u.username
WHERE u.oracle_maintained = 'N'
GROUP BY u.username
ORDER BY u.username;
EXIT
