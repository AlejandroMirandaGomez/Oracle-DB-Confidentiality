export const limpieza = {
  titulo: 'Eliminar el entorno de prueba',
  descripcion:
    'Retira todos los objetos PRUEBA_* creados para la batería y muestra el conteo de lo que queda, que debe ser cero en cada fila.',
  lenguaje: 'SQL',
  sql: `WHENEVER SQLERROR CONTINUE
ALTER SESSION SET CONTAINER = NOMBRE_PDB;
NOAUDIT POLICY prueba_aud_clientes;
DROP AUDIT POLICY prueba_aud_clientes;
BEGIN
  DBMS_REDACT.DROP_POLICY(object_schema => 'PRUEBA_APP', object_name => 'CLIENTES', policy_name => 'PRUEBA_RED_CLIENTES');
END;
/
BEGIN
  DBMS_RLS.DROP_POLICY(object_schema => 'PRUEBA_APP', object_name => 'CLIENTES', policy_name => 'PRUEBA_VPD_SUCURSAL');
END;
/
DROP USER prueba_lector CASCADE;
DROP USER prueba_soporte CASCADE;
DROP USER prueba_bloqueo CASCADE;
DROP USER prueba_dev CASCADE;
DROP USER prueba_app CASCADE;
DROP ROLE prueba_rol_lectura;
DROP PROFILE prueba_perfil_seguro;
SELECT 'usuarios' AS tipo, COUNT(*) AS restantes FROM dba_users WHERE username LIKE 'PRUEBA%'
UNION ALL SELECT 'roles', COUNT(*) FROM dba_roles WHERE role LIKE 'PRUEBA%'
UNION ALL SELECT 'perfiles', COUNT(DISTINCT profile) FROM dba_profiles WHERE profile LIKE 'PRUEBA%'
UNION ALL SELECT 'politicas de auditoria', COUNT(DISTINCT policy_name) FROM audit_unified_policies WHERE policy_name LIKE 'PRUEBA%'
UNION ALL SELECT 'politicas de redaccion', COUNT(*) FROM redaction_policies WHERE policy_name LIKE 'PRUEBA%'
UNION ALL SELECT 'politicas vpd', COUNT(*) FROM dba_policies WHERE policy_name LIKE 'PRUEBA%';`,
} as const
