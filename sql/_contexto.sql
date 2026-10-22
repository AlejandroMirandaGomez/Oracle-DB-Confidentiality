SELECT 'Ejecutado ' || TO_CHAR(SYSTIMESTAMP, 'YYYY-MM-DD HH24:MI:SS TZH:TZM')
       || ' | Contenedor ' || SYS_CONTEXT('USERENV', 'CON_NAME')
       || ' | Sesión ' || SYS_CONTEXT('USERENV', 'SESSION_USER')
       || ' | Protocolo ' || NVL(SYS_CONTEXT('USERENV', 'NETWORK_PROTOCOL'), 'local') AS contexto
FROM dual;
SET FEEDBACK ON
