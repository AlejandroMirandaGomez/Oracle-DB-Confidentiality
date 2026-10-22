@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
SET SERVEROUTPUT ON
PROMPT
PROMPT PR-21 | Eliminación segura y residuos en la papelera | A8.10
PROMPT
@@_contexto.sql
SELECT name, value FROM v$parameter WHERE name = 'recyclebin';
PROMPT Paso 1. Borrado sin PURGE de una tabla con cédulas y salarios
DROP TABLE legajo_app.tmp_extraccion;
SELECT owner, original_name, type, droptime FROM dba_recyclebin WHERE owner = 'LEGAJO_APP';
PROMPT Paso 2. Los datos borrados siguen siendo legibles desde la papelera
DECLARE
  v_objeto dba_recyclebin.object_name%TYPE;
  v_filas  NUMBER;
BEGIN
  SELECT object_name INTO v_objeto FROM dba_recyclebin
  WHERE owner = 'LEGAJO_APP' AND original_name = 'TMP_EXTRACCION' AND type = 'TABLE';
  EXECUTE IMMEDIATE 'SELECT COUNT(*) FROM legajo_app."' || v_objeto || '"' INTO v_filas;
  DBMS_OUTPUT.PUT_LINE('Filas legibles en ' || v_objeto || ': ' || v_filas);
END;
/
PROMPT Paso 3. Purga definitiva del objeto
PURGE TABLE legajo_app.tmp_extraccion;
SELECT COUNT(*) AS objetos_en_papelera FROM dba_recyclebin WHERE owner = 'LEGAJO_APP';
PROMPT Paso 4. Objetos de la organización que permanecen en la papelera de XEPDB1
SELECT owner, COUNT(*) AS objetos FROM dba_recyclebin GROUP BY owner ORDER BY owner;
EXIT
