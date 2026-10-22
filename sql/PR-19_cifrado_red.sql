@@_formato.sql
PROMPT
PROMPT PR-19 | Cifrado de la conexión de red al servicio XEPDB1 | A8.20
PROMPT
CONNECT /@//localhost:1521/XEPDB1 AS SYSDBA
@@_formato.sql
@@_contexto.sql
PROMPT Servicios negociados en esta sesión TCP (se espera una línea de cifrado AES y una de integridad SHA)
SELECT network_service_banner FROM v$session_connect_info WHERE sid = SYS_CONTEXT('USERENV', 'SID');
PROMPT Sesiones TCP actuales sin adaptador de cifrado
SELECT COUNT(DISTINCT c.sid) AS sesiones_tcp_sin_cifrado
FROM v$session_connect_info c
WHERE c.network_service_banner LIKE '%TCP/IP%'
  AND NOT EXISTS (
    SELECT 1 FROM v$session_connect_info e
    WHERE e.sid = c.sid AND e.serial# = c.serial# AND e.network_service_banner LIKE '%Encryption service adapter%');
EXIT
