@@_formato.sql
PROMPT
PROMPT PR-17 | Respaldos recientes y cifrados | A8.13
PROMPT
@@_contexto.sql
PROMPT Trabajos de respaldo de los últimos 14 días
SELECT session_key, input_type, status, start_time, end_time, output_bytes_display
FROM v$rman_backup_job_details
WHERE start_time > SYSDATE - 14
ORDER BY start_time;
PROMPT Días desde el último respaldo completo exitoso de la base
SELECT ROUND(SYSDATE - MAX(end_time), 1) AS dias_desde_ultimo_full
FROM v$rman_backup_job_details
WHERE input_type = 'DB FULL' AND status = 'COMPLETED';
PROMPT Piezas de respaldo según cifrado (se espera ENCRYPTED = YES)
SELECT encrypted, COUNT(*) AS piezas FROM v$backup_piece WHERE status = 'A' GROUP BY encrypted;
PROMPT Configuración persistente de RMAN
SELECT name, value FROM v$rman_configuration ORDER BY name;
EXIT
