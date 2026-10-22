@@_formato.sql
PROMPT
PROMPT PR-14 | Cifrado de datos en reposo con TDE | A8.24 A8.12
PROMPT
@@_contexto.sql
PROMPT Estado del almacén de claves por contenedor (se espera OPEN)
SELECT con_id, wrl_type, wrl_parameter, status, wallet_type, keystore_mode FROM v$encryption_wallet ORDER BY con_id;
PROMPT Parámetros de configuración de TDE
SELECT name, value FROM v$parameter WHERE name IN ('wallet_root', 'tde_configuration', 'encrypt_new_tablespaces') ORDER BY name;
PROMPT Tablespaces cifrados por contenedor
SELECT con_id, tablespace_name, encrypted FROM cdb_tablespaces WHERE con_id IN (1, 3) ORDER BY con_id, tablespace_name;
PROMPT Disponibilidad de la opción en esta edición
SELECT parameter, value FROM v$option WHERE parameter IN ('Transparent Data Encryption', 'Backup Encryption');
EXIT
