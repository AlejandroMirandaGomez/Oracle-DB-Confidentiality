@@_formato.sql
PROMPT
PROMPT PR-22 | Nivel de parches del motor | A8.8
PROMPT
@@_contexto.sql
SELECT instance_name, version_full, startup_time FROM v$instance;
SELECT banner_full FROM v$version;
PROMPT Parches SQL aplicados en cada contenedor (se espera la RU vigente)
SELECT con_id, patch_id, patch_type, action, status, action_time, description FROM cdb_registry_sqlpatch ORDER BY con_id, action_time;
EXIT
