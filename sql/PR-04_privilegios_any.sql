@@_formato.sql
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT PR-04 | Privilegios de sistema y ANY en cuentas no administradas por Oracle | A5.18 A8.2
PROMPT
@@_contexto.sql
PROMPT Privilegios de sistema otorgados directamente a cuentas de la organización (se espera ninguno con ANY)
SELECT p.grantee, p.privilege, p.admin_option
FROM dba_sys_privs p
JOIN dba_users u ON u.username = p.grantee
WHERE u.oracle_maintained = 'N'
ORDER BY p.grantee, p.privilege;
PROMPT Roles otorgados a cuentas de la organización
SELECT r.grantee, r.granted_role, r.admin_option, r.default_role
FROM dba_role_privs r
JOIN dba_users u ON u.username = r.grantee
WHERE u.oracle_maintained = 'N'
ORDER BY r.grantee, r.granted_role;
PROMPT Privilegios ANY alcanzables mediante roles por cuentas de la organización
SELECT DISTINCT r.grantee, s.privilege
FROM dba_role_privs r
JOIN dba_users u ON u.username = r.grantee
JOIN role_sys_privs s ON s.role = r.granted_role
WHERE u.oracle_maintained = 'N' AND s.privilege LIKE '%ANY%'
ORDER BY r.grantee, s.privilege
FETCH FIRST 15 ROWS ONLY;
EXIT
