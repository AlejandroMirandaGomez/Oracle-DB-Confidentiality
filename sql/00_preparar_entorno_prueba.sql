@@_formato.sql
WHENEVER SQLERROR EXIT FAILURE ROLLBACK
ALTER SESSION SET CONTAINER = XEPDB1;
PROMPT
PROMPT 00 | Preparación del entorno de prueba LEGAJO_* en XEPDB1
PROMPT
@@_contexto.sql

CREATE PROFILE legajo_perfil_seguro LIMIT
  FAILED_LOGIN_ATTEMPTS 3
  PASSWORD_LOCK_TIME 1/24
  PASSWORD_LIFE_TIME 90
  PASSWORD_GRACE_TIME 5
  PASSWORD_REUSE_TIME 365
  PASSWORD_REUSE_MAX 12
  INACTIVE_ACCOUNT_TIME 90
  PASSWORD_VERIFY_FUNCTION ora12c_strong_verify_function;

CREATE USER legajo_app NO AUTHENTICATION DEFAULT TABLESPACE users QUOTA 20M ON users;
CREATE USER legajo_dev NO AUTHENTICATION DEFAULT TABLESPACE users QUOTA 20M ON users;
CREATE USER legajo_lector IDENTIFIED BY "&1" PROFILE legajo_perfil_seguro;
CREATE USER legajo_soporte IDENTIFIED BY "&2" PROFILE legajo_perfil_seguro;
CREATE USER legajo_bloqueo IDENTIFIED BY "&3" PROFILE legajo_perfil_seguro;
GRANT CREATE SESSION TO legajo_lector, legajo_soporte, legajo_bloqueo;

CREATE TABLE legajo_app.clientes (
  id_cliente NUMBER(4) PRIMARY KEY,
  cedula     VARCHAR2(11) NOT NULL,
  nombre     VARCHAR2(60) NOT NULL,
  correo     VARCHAR2(60) NOT NULL,
  salario    NUMBER(10,2) NOT NULL,
  sucursal   VARCHAR2(10) NOT NULL
);

INSERT INTO legajo_app.clientes VALUES (1,  '1-0000-0412', 'Mariela Quesada Rojas',    'mariela.quesada@correo.test', 1184500, 'SAN JOSE');
INSERT INTO legajo_app.clientes VALUES (2,  '2-0000-1187', 'Esteban Solano Mora',      'esteban.solano@correo.test',   732900, 'HEREDIA');
INSERT INTO legajo_app.clientes VALUES (3,  '3-0000-0906', 'Daniela Vargas Chaves',    'daniela.vargas@correo.test',   948300, 'CARTAGO');
INSERT INTO legajo_app.clientes VALUES (4,  '4-0000-1530', 'Andrés Jiménez Ulate',     'andres.jimenez@correo.test',  1562750, 'HEREDIA');
INSERT INTO legajo_app.clientes VALUES (5,  '1-0000-2214', 'Sofía Araya Brenes',       'sofia.araya@correo.test',      689100, 'SAN JOSE');
INSERT INTO legajo_app.clientes VALUES (6,  '6-0000-0378', 'Luis Fernando Mata Céspedes', 'luis.mata@correo.test',     821460, 'CARTAGO');
INSERT INTO legajo_app.clientes VALUES (7,  '4-0000-0861', 'Valeria Campos Arias',     'valeria.campos@correo.test',  1307200, 'HEREDIA');
INSERT INTO legajo_app.clientes VALUES (8,  '2-0000-1749', 'Jorge Alfaro Salas',       'jorge.alfaro@correo.test',     598740, 'SAN JOSE');
INSERT INTO legajo_app.clientes VALUES (9,  '3-0000-2093', 'Natalia Porras Fallas',    'natalia.porras@correo.test',  1046880, 'CARTAGO');
INSERT INTO legajo_app.clientes VALUES (10, '5-0000-0657', 'Ricardo Monge Villalobos', 'ricardo.monge@correo.test',    877350, 'HEREDIA');
INSERT INTO legajo_app.clientes VALUES (11, '1-0000-3105', 'Gabriela Núñez Castro',    'gabriela.nunez@correo.test',  1421090, 'SAN JOSE');
INSERT INTO legajo_app.clientes VALUES (12, '7-0000-0482', 'Óscar Herrera Calderón',   'oscar.herrera@correo.test',    763410, 'CARTAGO');
COMMIT;

COMMENT ON TABLE legajo_app.clientes IS 'CLASIF=CONFIDENCIAL;CONTENIDO=DATOS_PERSONALES;NORMA=LEY_8968;PROPIETARIO=GERENCIA_CLIENTES';
COMMENT ON COLUMN legajo_app.clientes.id_cliente IS 'CLASIF=INTERNO;TIPO=CLAVE_TECNICA';
COMMENT ON COLUMN legajo_app.clientes.cedula IS 'CLASIF=CONFIDENCIAL;TIPO=IDENTIFICADOR_PERSONAL;LEY_8968=ACCESO_RESTRINGIDO';
COMMENT ON COLUMN legajo_app.clientes.nombre IS 'CLASIF=INTERNO;TIPO=DATO_PERSONAL';
COMMENT ON COLUMN legajo_app.clientes.correo IS 'CLASIF=CONFIDENCIAL;TIPO=DATO_DE_CONTACTO';
COMMENT ON COLUMN legajo_app.clientes.salario IS 'CLASIF=CONFIDENCIAL;TIPO=DATO_FINANCIERO;LEY_8968=ACCESO_RESTRINGIDO';
COMMENT ON COLUMN legajo_app.clientes.sucursal IS 'CLASIF=INTERNO;TIPO=DATO_OPERATIVO';

CREATE TABLE legajo_app.asignacion (
  usuario  VARCHAR2(30) PRIMARY KEY,
  sucursal VARCHAR2(10) NOT NULL
);
INSERT INTO legajo_app.asignacion VALUES ('LEGAJO_SOPORTE', 'HEREDIA');
INSERT INTO legajo_app.asignacion VALUES ('LEGAJO_LECTOR', 'SAN JOSE');
COMMIT;

CREATE TABLE legajo_app.tmp_extraccion AS SELECT id_cliente, cedula, salario FROM legajo_app.clientes;

CREATE ROLE legajo_rol_lectura;
GRANT SELECT ON legajo_app.clientes TO legajo_rol_lectura;
GRANT legajo_rol_lectura TO legajo_lector, legajo_soporte;

CREATE OR REPLACE FUNCTION legajo_app.fn_vpd_sucursal (p_esquema IN VARCHAR2, p_objeto IN VARCHAR2)
RETURN VARCHAR2
AS
  v_sucursal legajo_app.asignacion.sucursal%TYPE;
BEGIN
  SELECT sucursal INTO v_sucursal
  FROM legajo_app.asignacion
  WHERE usuario = SYS_CONTEXT('USERENV', 'SESSION_USER');
  RETURN 'sucursal = ''' || v_sucursal || '''';
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RETURN '1 = 0';
END;
/

BEGIN
  DBMS_RLS.ADD_POLICY(
    object_schema   => 'LEGAJO_APP',
    object_name     => 'CLIENTES',
    policy_name     => 'LEGAJO_VPD_SUCURSAL',
    function_schema => 'LEGAJO_APP',
    policy_function => 'FN_VPD_SUCURSAL',
    statement_types => 'SELECT,UPDATE,DELETE',
    update_check    => TRUE);
END;
/

BEGIN
  DBMS_REDACT.ADD_POLICY(
    object_schema       => 'LEGAJO_APP',
    object_name         => 'CLIENTES',
    policy_name         => 'LEGAJO_RED_CLIENTES',
    column_name         => 'CEDULA',
    function_type       => DBMS_REDACT.PARTIAL,
    function_parameters => 'VFVVVVFVVVV,V-VVVV-VVVV,*,1,5',
    expression          => '1=1');
  DBMS_REDACT.ALTER_POLICY(
    object_schema => 'LEGAJO_APP',
    object_name   => 'CLIENTES',
    policy_name   => 'LEGAJO_RED_CLIENTES',
    action        => DBMS_REDACT.ADD_COLUMN,
    column_name   => 'SALARIO',
    function_type => DBMS_REDACT.FULL);
  DBMS_REDACT.ALTER_POLICY(
    object_schema         => 'LEGAJO_APP',
    object_name           => 'CLIENTES',
    policy_name           => 'LEGAJO_RED_CLIENTES',
    action                => DBMS_REDACT.ADD_COLUMN,
    column_name           => 'CORREO',
    function_type         => DBMS_REDACT.REGEXP,
    regexp_pattern        => DBMS_REDACT.RE_PATTERN_EMAIL_ADDRESS,
    regexp_replace_string => DBMS_REDACT.RE_REDACT_EMAIL_NAME,
    regexp_position       => DBMS_REDACT.RE_BEGINNING,
    regexp_occurrence     => DBMS_REDACT.RE_ALL);
END;
/

CREATE AUDIT POLICY legajo_aud_clientes
  ACTIONS SELECT ON legajo_app.clientes,
          UPDATE ON legajo_app.clientes,
          DELETE ON legajo_app.clientes;
AUDIT POLICY legajo_aud_clientes;

CREATE TABLE legajo_dev.clientes_dev AS
SELECT id_cliente,
       '9-0000-' || LPAD(MOD(ORA_HASH(cedula, 999999, 41), 10000), 4, '0') AS cedula,
       'Cliente de prueba ' || id_cliente AS nombre,
       'cliente' || id_cliente || '@pruebas.test' AS correo,
       ROUND(salario * (0.85 + DBMS_RANDOM.VALUE * 0.3), -3) AS salario,
       sucursal
FROM legajo_app.clientes;
COMMENT ON TABLE legajo_dev.clientes_dev IS 'CLASIF=INTERNO;ORIGEN=LEGAJO_APP.CLIENTES;ENMASCARADO=ESTATICO';

PROMPT
PROMPT Objetos creados en el entorno de prueba
SELECT username, account_status, authentication_type, profile
FROM dba_users WHERE username LIKE 'LEGAJO%' ORDER BY username;
SELECT owner, object_name, object_type FROM dba_objects WHERE owner LIKE 'LEGAJO%' ORDER BY owner, object_name;
EXIT
