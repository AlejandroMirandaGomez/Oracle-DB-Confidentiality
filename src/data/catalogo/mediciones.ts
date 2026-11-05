import type { AjusteConsulta, CampoMedicion, ConsultaMedicion, EvidenciaRequerida, Medicion, OpcionMedicion, ReglaMedicion } from '../tipos'
import type { IdControl } from './norma'

type MedicionDeControl = Medicion & { control: IdControl }

const patronSensible = 'CEDULA|PASAPORTE|CORREO|EMAIL|TELEFONO|CELULAR|DIRECCION|SALARIO|SUELDO|TARJETA|IBAN|NACIMIENTO|DIAGNOSTICO|CONTRASENA|PASSWORD'

const cteActivas = `activas AS (
  SELECT username
  FROM dba_users
  WHERE oracle_maintained = 'N'
    AND account_status NOT LIKE '%LOCKED%'
    AND authentication_type <> 'NONE'
)`

const cteAlcance = `alcance (cuenta, rol) AS (
  SELECT username, username FROM activas
  UNION ALL
  SELECT a.cuenta, r.granted_role
  FROM alcance a
  JOIN dba_role_privs r ON r.grantee = a.rol
)`

const cteSensibles = `sensibles AS (
  SELECT c.owner, c.table_name, c.column_name, m.comments AS etiqueta
  FROM dba_tab_columns c
  JOIN dba_users u ON u.username = c.owner AND u.oracle_maintained = 'N'
  JOIN dba_tables t ON t.owner = c.owner AND t.table_name = c.table_name AND t.dropped = 'NO'
  LEFT JOIN dba_col_comments m
    ON m.owner = c.owner AND m.table_name = c.table_name AND m.column_name = c.column_name
  WHERE m.comments LIKE 'CLASIF=CONFIDENCIAL%'
     OR REGEXP_LIKE(c.column_name, '${patronSensible}')
)`

const cteLimites = `limites AS (
  SELECT p.profile, p.resource_name,
         CASE WHEN p.limit = 'DEFAULT' THEN d.limit ELSE p.limit END AS limite
  FROM dba_profiles p
  JOIN dba_profiles d ON d.profile = 'DEFAULT' AND d.resource_name = p.resource_name
)`

const cteConClave = `con_clave AS (
  SELECT username, profile, password_versions
  FROM dba_users
  WHERE oracle_maintained = 'N'
    AND account_status NOT LIKE '%LOCKED%'
    AND authentication_type = 'PASSWORD'
)`

const cteAdministradores = `administradores AS (
  SELECT cuenta FROM alcance WHERE rol IN ('DBA', 'PDB_DBA')
)`

const paquetesDeSalida = "'UTL_FILE', 'UTL_HTTP', 'UTL_TCP', 'UTL_SMTP', 'UTL_MAIL', 'UTL_INADDR', 'HTTPURITYPE', 'DBMS_LDAP'"

const cuentasActivas: CampoMedicion = { id: 'CUENTAS_ACTIVAS', etiqueta: 'Cuentas activas', origen: 'sql' }

const ajusteSensibles: AjusteConsulta = {
  busque: patronSensible,
  cuando: 'Son los nombres de columna que se tratan como sensibles. Si los suyos son otros, agréguelos en mayúsculas y separados por |. Por ejemplo, si la cédula se llama NUM_ID, agregue |NUM_ID.',
}

const ajusteEtiqueta: AjusteConsulta = {
  busque: 'CLASIF=CONFIDENCIAL%',
  cuando: 'Es la etiqueta de clasificación que propone esta aplicación. Si usa otro formato, escriba el suyo.',
}

const ajusteAdministradores: AjusteConsulta = {
  busque: "'DBA', 'PDB_DBA'",
  cuando: 'Son los roles que se consideran administrativos. Si tiene roles propios de administración, agréguelos entre comillas y separados por coma.',
}

const hastaUnTrimestre: OpcionMedicion[] = [
  { valor: 'trimestre', texto: 'Hace menos de 3 meses', puntos: 1 },
  { valor: 'semestre', texto: 'Hace 3 a 6 meses', puntos: 0.6 },
  { valor: 'anio', texto: 'Hace 6 a 12 meses', puntos: 0.3 },
  { valor: 'nunca', texto: 'Hace más de un año o nunca', puntos: 0 },
]

const hastaUnSemestre: OpcionMedicion[] = [
  { valor: 'semestre', texto: 'Hace menos de 6 meses', puntos: 1 },
  { valor: 'anio', texto: 'Hace 6 a 12 meses', puntos: 0.5 },
  { valor: 'nunca', texto: 'Hace más de un año o nunca', puntos: 0 },
]

const hastaUnaSemana: OpcionMedicion[] = [
  { valor: 'semana', texto: 'Esta semana', puntos: 1 },
  { valor: 'mes', texto: 'Este mes', puntos: 0.5 },
  { valor: 'nunca', texto: 'Hace más de un mes o nunca', puntos: 0 },
]

function respuesta(id: string, etiqueta: string, opciones: OpcionMedicion[]): ReglaMedicion {
  return { tipo: 'opciones', campo: { id, etiqueta, origen: 'organizacion' }, opciones }
}

function alcance(id: string, etiqueta: string, base: string, todos: string, ninguno: string, ejemploBase: number, siBaseCero: 'excluir' | number = 'excluir'): ReglaMedicion {
  return { tipo: 'alcance', campo: { id, etiqueta, origen: 'organizacion' }, base, todos, ninguno, ejemploBase, siBaseCero }
}

function objetivoFijo(id: string, etiqueta: string, sugerido: number): CampoMedicion {
  return { id, etiqueta, origen: 'organizacion', sugerido, oculto: true }
}

function campoObjetivo(etiqueta: string, sugerido: number, id: string): CampoMedicion {
  return { id, etiqueta, origen: 'organizacion', sugerido, ayuda: `Si lo deja vacío se usan ${sugerido} días.` }
}

const mediciones: MedicionDeControl[] = [
  {
    id: 'EV-18.1',
    control: 'A5.12',
    nombre: 'Columnas sensibles con etiqueta',
    pregunta: '¿Cuántas columnas con datos sensibles ya tienen su etiqueta de clasificación?',
    cita: '5.12, esquema aplicado de forma consistente',
    porque: 'La norma pide que toda la organización clasifique la información de la misma manera. Una columna sin etiqueta queda fuera de redacción, cifrado y auditoría.',
    peso: 50,
    campos: [
      { id: 'COLUMNAS_SENSIBLES', etiqueta: 'Columnas sensibles', origen: 'sql' },
      { id: 'SIN_ETIQUETA', etiqueta: 'Sin etiqueta', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'SIN_ETIQUETA', total: 'COLUMNAS_SENSIBLES', sujeto: 'columnas sin etiqueta', unidad: 'columnas', ejemplos: [{ casos: 6, total: 12 }, { casos: 6, total: 24 }, { casos: 6, total: 300 }], maximoTolerado: 50, topeConCasos: 0.9, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-18.2',
    control: 'A5.12',
    nombre: 'Esquemas con propietario',
    pregunta: '¿Cuántos esquemas con datos tienen una persona responsable de clasificarlos?',
    cita: '5.12, responsabilidad de los propietarios',
    porque: 'La norma hace responsable al propietario de la información de su clasificación. Si nadie responde por un esquema, la etiqueta no se mantiene.',
    peso: 25,
    campos: [{ id: 'ESQUEMAS_CON_DATOS', etiqueta: 'Esquemas con datos', origen: 'sql' }],
    regla: alcance('con_propietario', 'Esquemas con propietario nombrado', 'ESQUEMAS_CON_DATOS', 'Todos', 'Ninguno', 8),
  },
  {
    id: 'EV-18.3',
    control: 'A5.12',
    nombre: 'Revisión del inventario',
    pregunta: '¿Cuándo se revisó por última vez el inventario de clasificación?',
    cita: '5.12, revisión a lo largo del tiempo',
    porque: 'La sensibilidad de un dato cambia durante su ciclo de vida, así que la norma pide criterios para revisar la clasificación.',
    peso: 25,
    campos: [],
    regla: respuesta('revision_inventario', 'Última revisión del inventario', hastaUnSemestre),
  },
  {
    id: 'EV-04.1',
    control: 'A5.15',
    nombre: 'Accesos fuera de roles',
    pregunta: '¿Cuántas cuentas reciben privilegios directos en lugar de un rol de función?',
    cita: '5.15, asignación de roles a grupos de entidades',
    porque: 'La norma propone roles para simplificar el control de acceso. Un privilegio suelto no aparece en la matriz de roles y escapa a la revisión.',
    peso: 40,
    campos: [cuentasActivas, { id: 'CON_PRIVILEGIOS_DIRECTOS', etiqueta: 'Con privilegios directos', origen: 'sql' }],
    regla: { tipo: 'proporcion', casos: 'CON_PRIVILEGIOS_DIRECTOS', total: 'CUENTAS_ACTIVAS', sujeto: 'cuentas con privilegios directos', unidad: 'cuentas', ejemplos: [{ casos: 5, total: 20 }, { casos: 5, total: 40 }, { casos: 5, total: 800 }], maximoTolerado: 25, topeConCasos: 0.9, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-04.2',
    control: 'A5.15',
    nombre: 'Roles documentados',
    pregunta: '¿Cuántos roles propios están descritos en la matriz de rol por función?',
    cita: '5.15 a) y j), reglas respaldadas por procedimientos documentados',
    porque: 'Las reglas de acceso deben decir qué entidad recibe qué acceso. Un rol sin documentar concede permisos que nadie aprobó de forma explícita.',
    peso: 30,
    campos: [{ id: 'ROLES_PROPIOS', etiqueta: 'Roles propios', origen: 'sql' }],
    regla: alcance('documentados', 'Roles propios documentados', 'ROLES_PROPIOS', 'Todos', 'Ninguno', 12, 0),
  },
  {
    id: 'EV-04.3',
    control: 'A5.15',
    nombre: 'Roles genéricos amplios',
    pregunta: '¿Cuántas cuentas heredan roles genéricos en lugar de roles de función?',
    cita: '5.15, otra información a), privilegio mínimo',
    porque: 'La premisa de la norma es que todo está prohibido salvo lo permitido. Los roles genéricos conceden más de lo que cualquier función necesita.',
    peso: 30,
    campos: [cuentasActivas, { id: 'CON_ROL_GENERICO', etiqueta: 'Con rol genérico', origen: 'sql' }],
    regla: { tipo: 'proporcion', casos: 'CON_ROL_GENERICO', total: 'CUENTAS_ACTIVAS', sujeto: 'cuentas con rol genérico', unidad: 'cuentas', ejemplos: [{ casos: 4, total: 16 }, { casos: 4, total: 32 }, { casos: 4, total: 800 }], maximoTolerado: 25, topeConCasos: 0.9, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-01.1',
    control: 'A5.16',
    nombre: 'Cuentas internas abiertas',
    pregunta: '¿Cuántas cuentas internas de Oracle siguen abiertas, además de SYS y SYSTEM?',
    cita: '5.16 d), identidades que ya no son necesarias',
    porque: 'Una identidad que no se usa debe inhabilitarse. Cada cuenta interna abierta es una puerta conocida, sin importar el tamaño de la base.',
    peso: 55,
    campos: [{ id: 'INTERNAS_ABIERTAS', etiqueta: 'Cuentas internas abiertas', origen: 'sql' }],
    regla: { tipo: 'porCaso', casos: 'INTERNAS_ABIERTAS', sujeto: 'cuentas internas abiertas', restaPorCaso: 0.25, motivo: 'El riesgo no depende del tamaño de la base: una sola cuenta conocida basta.' },
  },
  {
    id: 'EV-01.2',
    control: 'A5.16',
    nombre: 'Cuentas con responsable',
    pregunta: '¿Cuántas cuentas activas corresponden a una persona o sistema identificado?',
    cita: '5.16 a), b) y c), una identidad por entidad',
    porque: 'La norma exige poder responsabilizar a alguien de lo hecho con cada identidad. Una cuenta compartida o huérfana rompe esa trazabilidad.',
    peso: 45,
    campos: [cuentasActivas],
    regla: alcance('con_responsable', 'Cuentas con responsable identificado', 'CUENTAS_ACTIVAS', 'Todas', 'Ninguna', 40),
  },
  {
    id: 'EV-07.1',
    control: 'A5.17',
    nombre: 'Contraseñas de fábrica',
    pregunta: '¿Cuántas cuentas abiertas conservan la contraseña de fábrica?',
    cita: '5.17 e), asignación de información de autenticación',
    porque: 'La norma pide cambiar la autenticación predeterminada justo después de instalar. Esa contraseña es pública: una sola cuenta anula el resto del control.',
    peso: 45,
    critica: true,
    campos: [{ id: 'CLAVES_DE_FABRICA', etiqueta: 'Cuentas con contraseña de fábrica', origen: 'sql' }],
    regla: { tipo: 'porCaso', casos: 'CLAVES_DE_FABRICA', sujeto: 'cuentas con contraseña de fábrica', restaPorCaso: 1, motivo: 'Una sola cuenta basta para entrar, por eso el primer caso deja la medición en 0,00.' },
  },
  {
    id: 'EV-07.2',
    control: 'A5.17',
    nombre: 'Verificadores débiles',
    pregunta: '¿Cuántas cuentas conservan verificadores antiguos de contraseña?',
    cita: '5.17 h), sistema de gestión de contraseñas',
    porque: 'Las contraseñas deben almacenarse en forma protegida. Un verificador 10G u 11G se ataca fuera de línea mucho más rápido que uno 12C.',
    peso: 30,
    campos: [
      { id: 'CUENTAS_CON_CLAVE', etiqueta: 'Cuentas con contraseña', origen: 'sql' },
      { id: 'VERIFICADOR_DEBIL', etiqueta: 'Con verificador débil', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'VERIFICADOR_DEBIL', total: 'CUENTAS_CON_CLAVE', sujeto: 'cuentas con verificador débil', unidad: 'cuentas', ejemplos: [{ casos: 2, total: 10 }, { casos: 2, total: 20 }, { casos: 2, total: 400 }], maximoTolerado: 20, topeConCasos: 0.7, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-07.3',
    control: 'A5.17',
    nombre: 'Reglas de contraseña del perfil',
    pregunta: '¿Cuántas cuentas tienen un perfil que no verifica la contraseña o permite reutilizarla?',
    cita: '5.17 b), e) y f), sistema de gestión de contraseñas',
    porque: 'El sistema debe exigir contraseñas seguras, evitar las de uso común e impedir reutilizarlas. La norma también advierte contra forzar cambios frecuentes, por eso no se evalúa la caducidad.',
    peso: 25,
    campos: [
      { id: 'CUENTAS_CON_CLAVE', etiqueta: 'Cuentas con contraseña', origen: 'sql' },
      { id: 'PERFIL_DEBIL', etiqueta: 'Con perfil débil', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'PERFIL_DEBIL', total: 'CUENTAS_CON_CLAVE', sujeto: 'cuentas con perfil débil', unidad: 'cuentas', ejemplos: [{ casos: 5, total: 10 }, { casos: 5, total: 20 }, { casos: 5, total: 400 }], maximoTolerado: 50, topeConCasos: 0.9, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-02.1',
    control: 'A5.18',
    nombre: 'Privilegios ANY heredados',
    pregunta: '¿Cuántas cuentas no administrativas alcanzan un privilegio ANY, directo o heredado por roles?',
    cita: '5.18 f), nivel de acceso acorde con la política',
    porque: 'El nivel otorgado debe coincidir con la política. Un privilegio ANY llega a toda la base: por muchas cuentas que existan, una sola puede leerlo todo.',
    peso: 40,
    campos: [{ id: 'CUENTAS_CON_ANY', etiqueta: 'Cuentas con privilegio ANY', origen: 'sql' }],
    regla: { tipo: 'porCaso', casos: 'CUENTAS_CON_ANY', sujeto: 'cuentas con privilegios ANY', restaPorCaso: 0.34, motivo: 'Un privilegio ANY alcanza toda la base, así que el daño posible no se reparte entre más usuarios.' },
  },
  {
    id: 'EV-02.2',
    control: 'A5.18',
    nombre: 'Cuentas sin uso',
    pregunta: '¿Cuántas cuentas activas no inician sesión hace más de 90 días?',
    cita: '5.18 d), retiro de derechos que ya no se necesitan',
    porque: 'Los derechos se retiran cuando dejan de necesitarse. Aquí sí importa la proporción: unas pocas cuentas dormidas en miles pesan menos que la mitad de una base pequeña.',
    peso: 35,
    campos: [cuentasActivas, { id: 'CUENTAS_SIN_USO', etiqueta: 'Cuentas sin uso', origen: 'sql' }],
    regla: { tipo: 'proporcion', casos: 'CUENTAS_SIN_USO', total: 'CUENTAS_ACTIVAS', sujeto: 'cuentas sin uso', unidad: 'cuentas', ejemplos: [{ casos: 6, total: 20 }, { casos: 6, total: 40 }, { casos: 6, total: 1000 }], maximoTolerado: 30, topeConCasos: 0.9, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-02.3',
    control: 'A5.18',
    nombre: 'Revisión de derechos',
    pregunta: '¿Cuándo se revisaron por última vez los derechos de acceso?',
    cita: '5.18, revisión de los derechos de acceso',
    porque: 'La norma pide revisiones regulares, sobre todo tras cambios de función y para los accesos privilegiados.',
    peso: 25,
    campos: [],
    regla: respuesta('revision_derechos', 'Última revisión de los derechos', hastaUnTrimestre),
  },
  {
    id: 'EV-03.1',
    control: 'A8.2',
    nombre: 'Administradores sin autorizar',
    pregunta: '¿Cuántos titulares de privilegios administrativos no están en su lista de autorizados?',
    cita: '8.2 a), b) y c), autorización y registro de privilegios',
    porque: 'Cada derecho privilegiado se asigna caso por caso y bajo autorización. Un administrador sin autorizar puede leer toda la base, sin importar cuántas cuentas tenga.',
    peso: 40,
    critica: true,
    campos: [
      { id: 'TITULARES_ADMIN', etiqueta: 'Titulares administrativos', origen: 'sql' },
      { id: 'autorizados', etiqueta: 'Autorizados en su registro', origen: 'organizacion', ayuda: 'Compare los titulares con su lista de administradores.' },
    ],
    regla: { tipo: 'porCaso', casos: 'TITULARES_ADMIN', descontar: 'autorizados', sujeto: 'administradores sin autorizar', restaPorCaso: 0.5, motivo: 'Una cuenta administrativa ve todos los datos, por eso no se divide entre el total de usuarios.' },
  },
  {
    id: 'EV-03.2',
    control: 'A8.2',
    nombre: 'Exceso de administradores',
    pregunta: '¿Qué parte de las cuentas tiene más privilegios administrativos de los que la operación necesita?',
    cita: '8.2 b), requisito mínimo para cada función',
    porque: 'Aquí entra el tamaño de la organización: tres administradores de más son una quinta parte de una base con 15 cuentas, pero casi nada en una con 1 500. Se toleran 2 administradores: titular y suplente.',
    peso: 25,
    campos: [
      cuentasActivas,
      { id: 'TITULARES_ADMIN', etiqueta: 'Titulares administrativos', origen: 'sql' },
      objetivoFijo('necesarios', 'Administradores necesarios', 2),
    ],
    regla: { tipo: 'proporcion', casos: 'TITULARES_ADMIN', descontar: 'necesarios', total: 'CUENTAS_ACTIVAS', sujeto: 'administradores de más', unidad: 'cuentas', ejemplos: [{ casos: 3, total: 15 }, { casos: 3, total: 30 }, { casos: 3, total: 1500 }], maximoTolerado: 20, topeConCasos: 0.9, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-03.3',
    control: 'A8.2',
    nombre: 'Revisión de privilegios',
    pregunta: '¿Cuándo se revisó por última vez quién conserva privilegios administrativos?',
    cita: '8.2 g), revisión periódica',
    porque: 'La norma pide comprobar con regularidad y tras cada cambio que cada persona sigue calificando para trabajar con esos privilegios.',
    peso: 20,
    campos: [],
    regla: respuesta('revision_privilegios', 'Última revisión de privilegios', hastaUnTrimestre),
  },
  {
    id: 'EV-03.4',
    control: 'A8.2',
    nombre: 'Registro del uso privilegiado',
    pregunta: '¿Qué valor devuelve la consulta sobre el registro de operaciones privilegiadas?',
    cita: '8.2 j), registro de los accesos privilegiados',
    porque: 'Todo acceso privilegiado debe quedar registrado para auditoría. Sin ese rastro no se puede demostrar qué hizo un administrador.',
    peso: 15,
    campos: [],
    regla: {
      tipo: 'opciones',
      campo: { id: 'REGISTRO_PRIVILEGIADO', etiqueta: 'Valor de REGISTRO_PRIVILEGIADO', origen: 'sql' },
      opciones: [
        { valor: 'SYS_Y_POLITICA', texto: 'Se registran SYS y el uso de privilegios', puntos: 1 },
        { valor: 'SOLO_SYS', texto: 'Solo se registran las operaciones de SYS', puntos: 0.5 },
        { valor: 'SOLO_POLITICA', texto: 'Solo se registra el uso de privilegios', puntos: 0.5 },
        { valor: 'SIN_REGISTRO', texto: 'No se registra nada', puntos: 0 },
      ],
    },
  },
  {
    id: 'EV-10.1',
    control: 'A8.3',
    nombre: 'Objetos abiertos a PUBLIC',
    pregunta: '¿Cuántas tablas o vistas de la organización están abiertas a PUBLIC?',
    cita: '8.3 a), sin acceso anónimo a información sensible',
    porque: 'Lo que se otorga a PUBLIC lo recibe cualquier cuenta. La exposición no depende de cuántos usuarios existan.',
    peso: 30,
    campos: [{ id: 'OBJETOS_EN_PUBLIC', etiqueta: 'Objetos abiertos a PUBLIC', origen: 'sql' }],
    regla: { tipo: 'porCaso', casos: 'OBJETOS_EN_PUBLIC', sujeto: 'objetos abiertos a PUBLIC', restaPorCaso: 0.25, motivo: 'PUBLIC incluye a todas las cuentas, por eso cada objeto resta lo mismo en cualquier base.' },
  },
  {
    id: 'EV-10.2',
    control: 'A8.3',
    nombre: 'Lectura sin necesidad de saber',
    pregunta: '¿Cuántas personas leen tablas sensibles, directamente o por herencia de roles, sin deber hacerlo?',
    cita: '8.3 c) y d), a qué datos accede cada identidad',
    porque: 'La norma pide controlar qué datos ve cada identidad. Los privilegios heredados son la vía más común de sobreexposición, y su gravedad depende de qué parte de las cuentas alcanzan.',
    peso: 45,
    campos: [
      cuentasActivas,
      { id: 'CUENTAS_CON_LECTURA', etiqueta: 'Cuentas con lectura', origen: 'sql' },
      { id: 'justificadas', etiqueta: 'Con necesidad justificada', origen: 'organizacion', ayuda: 'Compare la lista con la matriz de rol por función.' },
    ],
    regla: { tipo: 'proporcion', casos: 'CUENTAS_CON_LECTURA', descontar: 'justificadas', total: 'CUENTAS_ACTIVAS', sujeto: 'cuentas con lectura sin justificar', unidad: 'cuentas', ejemplos: [{ casos: 3, total: 6 }, { casos: 3, total: 30 }, { casos: 3, total: 1500 }], maximoTolerado: 20, topeConCasos: 0.9, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-10.3',
    control: 'A8.3',
    nombre: 'Restricción por filas',
    pregunta: '¿Cuántas tablas sensibles carecen de una política VPD activa?',
    cita: '8.3 c), control de los datos visibles por usuario',
    porque: 'Dentro de una misma tabla, el acceso debe limitarse a lo que cada función necesita.',
    peso: 25,
    campos: [
      { id: 'TABLAS_SENSIBLES', etiqueta: 'Tablas sensibles', origen: 'sql' },
      { id: 'SIN_VPD', etiqueta: 'Sin política VPD', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'SIN_VPD', total: 'TABLAS_SENSIBLES', sujeto: 'tablas sin restricción por filas', unidad: 'tablas', ejemplos: [{ casos: 5, total: 5 }, { casos: 5, total: 10 }, { casos: 5, total: 100 }], maximoTolerado: 100, topeConCasos: 1, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-06.1',
    control: 'A8.5',
    nombre: 'Bloqueo por intentos fallidos',
    pregunta: '¿Cuántas cuentas permiten más de 5 intentos fallidos antes de bloquearse?',
    cita: '8.5 e), protección contra fuerza bruta',
    porque: 'La norma pide bloquear tras un número máximo de errores. Cada cuenta sin ese límite se puede atacar sin freno.',
    peso: 45,
    campos: [
      { id: 'CUENTAS_CON_CLAVE', etiqueta: 'Cuentas con contraseña', origen: 'sql' },
      { id: 'SIN_BLOQUEO_EFECTIVO', etiqueta: 'Sin bloqueo efectivo', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'SIN_BLOQUEO_EFECTIVO', total: 'CUENTAS_CON_CLAVE', sujeto: 'cuentas sin bloqueo efectivo', unidad: 'cuentas', ejemplos: [{ casos: 2, total: 20 }, { casos: 2, total: 40 }, { casos: 2, total: 800 }], maximoTolerado: 10, topeConCasos: 0.7, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-06.2',
    control: 'A8.5',
    nombre: 'Segundo factor en administradores',
    pregunta: '¿Cuántos administradores entran con un factor adicional a la contraseña?',
    cita: '8.5, autenticación multifactor en sistemas críticos',
    porque: 'La norma pide factores adicionales para sistemas de información crítica. La cuenta con más alcance es la que más lo necesita.',
    peso: 30,
    campos: [{ id: 'TITULARES_ADMIN', etiqueta: 'Titulares administrativos', origen: 'sql' }],
    regla: alcance('con_segundo_factor', 'Administradores con segundo factor', 'TITULARES_ADMIN', 'Todos', 'Ninguno', 6),
  },
  {
    id: 'EV-06.3',
    control: 'A8.5',
    nombre: 'Límite de inactividad',
    pregunta: '¿Cuántas cuentas pueden dejar una sesión abierta sin límite de inactividad?',
    cita: '8.5 k), fin de las sesiones inactivas',
    porque: 'Una sesión abandonada entrega el acceso a quien llegue después, por eso la norma pide cerrarla tras un período definido.',
    peso: 25,
    campos: [
      { id: 'CUENTAS_CON_CLAVE', etiqueta: 'Cuentas con contraseña', origen: 'sql' },
      { id: 'SIN_LIMITE_INACTIVIDAD', etiqueta: 'Sin límite de inactividad', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'SIN_LIMITE_INACTIVIDAD', total: 'CUENTAS_CON_CLAVE', sujeto: 'cuentas sin límite de inactividad', unidad: 'cuentas', ejemplos: [{ casos: 10, total: 20 }, { casos: 10, total: 40 }, { casos: 10, total: 800 }], maximoTolerado: 50, topeConCasos: 0.9, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-15.1',
    control: 'A8.10',
    nombre: 'Datos sensibles en la papelera',
    pregunta: '¿Cuántas tablas con columnas sensibles siguen en la papelera?',
    cita: '8.10, métodos de eliminación b)',
    porque: 'La norma pide eliminar versiones obsoletas y copias dondequiera que estén. En Oracle, una tabla en la papelera sigue siendo legible.',
    peso: 60,
    campos: [{ id: 'TABLAS_EN_PAPELERA', etiqueta: 'Tablas sensibles en la papelera', origen: 'sql' }],
    regla: { tipo: 'porCaso', casos: 'TABLAS_EN_PAPELERA', sujeto: 'tablas sensibles en la papelera', restaPorCaso: 0.2, motivo: 'Cada tabla es una copia completa y legible, sin importar cuántas tablas tenga la base.' },
  },
  {
    id: 'EV-15.2',
    control: 'A8.10',
    nombre: 'Retención definida',
    pregunta: '¿Cuántas tablas sensibles tienen un período de retención definido?',
    cita: '8.10, general y métodos de eliminación a)',
    porque: 'La información confidencial no debe guardarse más tiempo del necesario. Sin un plazo definido, nunca llega el momento de eliminarla.',
    peso: 40,
    campos: [{ id: 'TABLAS_SENSIBLES', etiqueta: 'Tablas sensibles', origen: 'sql' }],
    regla: alcance('con_retencion', 'Tablas sensibles con retención definida', 'TABLAS_SENSIBLES', 'Todas', 'Ninguna', 20),
  },
  {
    id: 'EV-09.1',
    control: 'A8.11',
    nombre: 'Columnas sin enmascarar',
    pregunta: '¿Cuántas columnas sensibles se muestran sin redacción activa?',
    cita: '8.11 a), mostrar solo los datos mínimos requeridos',
    porque: 'Las consultas y máscaras deben mostrar únicamente lo necesario.',
    peso: 50,
    campos: [
      { id: 'COLUMNAS_SENSIBLES', etiqueta: 'Columnas sensibles', origen: 'sql' },
      { id: 'SIN_REDACCION', etiqueta: 'Sin redacción', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'SIN_REDACCION', total: 'COLUMNAS_SENSIBLES', sujeto: 'columnas sin enmascarar', unidad: 'columnas', ejemplos: [{ casos: 6, total: 6 }, { casos: 6, total: 12 }, { casos: 6, total: 300 }], maximoTolerado: 100, topeConCasos: 1, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-09.2',
    control: 'A8.11',
    nombre: 'Cuentas exentas de redacción',
    pregunta: '¿Cuántas cuentas no administrativas ven los datos sin máscara?',
    cita: '8.11 a) y b), control de acceso a los datos procesados',
    porque: 'No todos deben ver todos los datos. Cuantas más cuentas estén exentas, menos protege la máscara.',
    peso: 30,
    campos: [
      cuentasActivas,
      { id: 'CUENTAS_EXENTAS', etiqueta: 'Cuentas exentas', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'CUENTAS_EXENTAS', total: 'CUENTAS_ACTIVAS', sujeto: 'cuentas exentas', unidad: 'cuentas', ejemplos: [{ casos: 2, total: 20 }, { casos: 2, total: 40 }, { casos: 2, total: 800 }], maximoTolerado: 10, topeConCasos: 0.8, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-09.3',
    control: 'A8.11',
    nombre: 'Verificación del enmascaramiento',
    pregunta: '¿Cuándo se comprobó por última vez que el enmascaramiento oculta los datos?',
    cita: '8.11, verificación de la seudonimización o anonimización',
    porque: 'La norma pide verificar que los datos hayan quedado bien ocultos: una persona puede reidentificarse por otros datos que la máscara no cubre.',
    peso: 20,
    campos: [],
    regla: respuesta('verificacion_mascara', 'Última comprobación del enmascaramiento', hastaUnSemestre),
  },
  {
    id: 'EV-05.1',
    control: 'A8.12',
    nombre: 'Canales de salida abiertos',
    pregunta: '¿Cuántos paquetes que sacan datos de la base puede ejecutar PUBLIC?',
    cita: '8.12 c), bloquear transmisiones que expongan información',
    porque: 'Cualquier cuenta puede usar estos paquetes para escribir archivos o abrir conexiones. Cada canal abierto es una vía de fuga para toda la base.',
    peso: 40,
    campos: [{ id: 'PAQUETES_EN_PUBLIC', etiqueta: 'Paquetes abiertos a PUBLIC', origen: 'sql' }],
    regla: { tipo: 'porCaso', casos: 'PAQUETES_EN_PUBLIC', sujeto: 'paquetes abiertos a PUBLIC', restaPorCaso: 0.2, motivo: 'Cada paquete es un canal disponible para todas las cuentas, sea cual sea su número.' },
  },
  {
    id: 'EV-05.2',
    control: 'A8.12',
    nombre: 'Exportación sin autorizar',
    pregunta: '¿Cuántas cuentas no administrativas pueden exportar la base completa?',
    cita: '8.12, aprobación de la exportación por el propietario',
    porque: 'La norma pide que el propietario de los datos apruebe cada exportación. Una sola cuenta con este rol puede extraer toda la base.',
    peso: 35,
    campos: [{ id: 'CON_EXPORTACION', etiqueta: 'Cuentas no administrativas con exportación', origen: 'sql' }],
    regla: { tipo: 'porCaso', casos: 'CON_EXPORTACION', sujeto: 'cuentas con exportación masiva', restaPorCaso: 0.34, motivo: 'Una exportación completa saca todos los datos de una vez, sin importar cuántas cuentas haya.' },
  },
  {
    id: 'EV-05.3',
    control: 'A8.12',
    nombre: 'Escritura en directorios',
    pregunta: '¿Cuántas cuentas no administrativas pueden escribir en directorios del servidor?',
    cita: '8.12 c), impedir copias fuera del control',
    porque: 'Un directorio con escritura permite volcar datos a archivos que salen del alcance de los controles de la base.',
    peso: 25,
    campos: [{ id: 'ESCRITURA_DIRECTORIOS', etiqueta: 'Cuentas con escritura', origen: 'sql' }],
    regla: { tipo: 'porCaso', casos: 'ESCRITURA_DIRECTORIOS', sujeto: 'cuentas con escritura en directorios', restaPorCaso: 0.25, motivo: 'Cada cuenta puede volcar datos fuera de la base por sí sola.' },
  },
  {
    id: 'EV-11.1',
    control: 'A8.13',
    nombre: 'Antigüedad del último respaldo',
    pregunta: '¿Hace cuántos días terminó el último respaldo completo o incremental exitoso?',
    cita: '8.13 b), objetivo de punto de recuperación',
    porque: 'La frecuencia del respaldo debe reflejar lo que el negocio tolera perder. Por eso el objetivo lo define usted.',
    peso: 30,
    campos: [
      { id: 'DIAS_DESDE_RESPALDO', etiqueta: 'Días desde el último respaldo', origen: 'sql', ayuda: '9999 significa que no hay ningún respaldo registrado.' },
      campoObjetivo('Días máximos que tolera perder', 7, 'objetivo_respaldo'),
    ],
    regla: { tipo: 'vigencia', dias: 'DIAS_DESDE_RESPALDO', objetivo: 'objetivo_respaldo', evento: 'el último respaldo', vecesLimite: 3 },
  },
  {
    id: 'EV-11.2',
    control: 'A8.13',
    nombre: 'Piezas de respaldo sin cifrar',
    pregunta: '¿Cuántas piezas de respaldo activas no están cifradas?',
    cita: '8.13 f), cifrado cuando importa la confidencialidad',
    porque: 'A8.13 no lleva Confidencialidad en la norma: entra a esta matriz por este inciso. Una pieza sin cifrar es una copia legible de la base, por eso esta medición es crítica.',
    peso: 35,
    critica: true,
    campos: [
      { id: 'PIEZAS_ACTIVAS', etiqueta: 'Piezas activas', origen: 'sql' },
      { id: 'PIEZAS_SIN_CIFRAR', etiqueta: 'Piezas sin cifrar', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'PIEZAS_SIN_CIFRAR', total: 'PIEZAS_ACTIVAS', sujeto: 'piezas sin cifrar', unidad: 'piezas', ejemplos: [{ casos: 10, total: 20 }, { casos: 10, total: 40 }, { casos: 10, total: 1000 }], maximoTolerado: 50, topeConCasos: 0.6, siTotalCero: 0 },
  },
  {
    id: 'EV-11.3',
    control: 'A8.13',
    nombre: 'Prueba de restauración',
    pregunta: '¿Cuándo se probó por última vez restaurar un respaldo?',
    cita: '8.13 e), prueba regular de los respaldos',
    porque: 'La norma pide probar la restauración en un sistema de prueba. Un respaldo que nunca se restauró es una suposición.',
    peso: 20,
    campos: [],
    regla: respuesta('prueba_restauracion', 'Última prueba de restauración', hastaUnSemestre),
  },
  {
    id: 'EV-11.4',
    control: 'A8.13',
    nombre: 'Trabajos de respaldo fallidos',
    pregunta: '¿Qué parte de los trabajos de respaldo de los últimos 30 días falló?',
    cita: '8.13, seguimiento de las fallas programadas',
    porque: 'La operación debe vigilar la ejecución y atender las fallas para mantener la integridad de los respaldos.',
    peso: 15,
    campos: [
      { id: 'TRABAJOS_30_DIAS', etiqueta: 'Trabajos en 30 días', origen: 'sql' },
      { id: 'TRABAJOS_CON_FALLA', etiqueta: 'Trabajos con falla', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'TRABAJOS_CON_FALLA', total: 'TRABAJOS_30_DIAS', sujeto: 'trabajos con falla', unidad: 'trabajos', ejemplos: [{ casos: 2, total: 4 }, { casos: 2, total: 8 }, { casos: 2, total: 60 }], maximoTolerado: 50, topeConCasos: 0.8, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-12.1',
    control: 'A8.15',
    nombre: 'Eventos obligatorios registrados',
    pregunta: '¿Cuántas de las tres políticas de auditoría básicas no están activas?',
    cita: '8.15 a), c), d) e i), eventos a registrar',
    porque: 'La norma lista intentos de acceso, cambios de configuración, uso de privilegios y cambios de identidades. Estas tres políticas los cubren.',
    peso: 40,
    campos: [
      { id: 'POLITICAS_REQUERIDAS', etiqueta: 'Políticas requeridas', origen: 'sql' },
      { id: 'POLITICAS_INACTIVAS', etiqueta: 'Políticas inactivas', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'POLITICAS_INACTIVAS', total: 'POLITICAS_REQUERIDAS', sujeto: 'políticas inactivas', unidad: 'políticas', ejemplos: [{ casos: 1, total: 3 }, { casos: 2, total: 3 }, { casos: 3, total: 3 }], maximoTolerado: 100, topeConCasos: 0.67, siTotalCero: 0 },
  },
  {
    id: 'EV-12.2',
    control: 'A8.15',
    nombre: 'Tablas sensibles sin auditar',
    pregunta: '¿Cuántas tablas sensibles no tienen una política de auditoría de acceso?',
    cita: '8.15 b) y f), acceso a recursos y a datos importantes',
    porque: 'Para la confidencialidad importa saber quién leyó los datos, no solo quién inició sesión.',
    peso: 35,
    campos: [
      { id: 'TABLAS_SENSIBLES', etiqueta: 'Tablas sensibles', origen: 'sql' },
      { id: 'SIN_AUDITORIA', etiqueta: 'Sin auditoría', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'SIN_AUDITORIA', total: 'TABLAS_SENSIBLES', sujeto: 'tablas sin auditoría', unidad: 'tablas', ejemplos: [{ casos: 5, total: 5 }, { casos: 5, total: 10 }, { casos: 5, total: 100 }], maximoTolerado: 100, topeConCasos: 1, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-12.3',
    control: 'A8.15',
    nombre: 'Revisión de los registros',
    pregunta: '¿Cuándo se analizaron por última vez los registros de auditoría?',
    cita: '8.15, análisis de registro',
    porque: 'Un registro que nadie lee no detecta nada. La norma pide analizarlo para identificar comportamientos anómalos.',
    peso: 25,
    campos: [],
    regla: respuesta('analisis_registros', 'Último análisis de los registros', hastaUnaSemana),
  },
  {
    id: 'EV-14.1',
    control: 'A8.20',
    nombre: 'Sesiones de red sin cifrar',
    pregunta: '¿Cuántas sesiones TCP abiertas ahora mismo viajan sin cifrado?',
    cita: '8.20 e), confidencialidad de los datos en la red',
    porque: 'Lo que la base protege adentro se expone si el resultado viaja en claro. Mida en horario laboral, con las aplicaciones conectadas.',
    peso: 45,
    campos: [
      { id: 'SESIONES_TCP', etiqueta: 'Sesiones TCP', origen: 'sql' },
      { id: 'SESIONES_SIN_CIFRAR', etiqueta: 'Sesiones sin cifrar', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'SESIONES_SIN_CIFRAR', total: 'SESIONES_TCP', sujeto: 'sesiones sin cifrar', unidad: 'sesiones', ejemplos: [{ casos: 2, total: 10 }, { casos: 2, total: 20 }, { casos: 2, total: 300 }], maximoTolerado: 20, topeConCasos: 0.7, siTotalCero: 'excluir' },
  },
  {
    id: 'EV-14.2',
    control: 'A8.20',
    nombre: 'Configuración de Oracle Net',
    pregunta: '¿Qué condiciones cumplen sqlnet.ora y listener.ora en el servidor?',
    instruccion: 'Estos valores no se leen con SQL. Abra sqlnet.ora y listener.ora en la carpeta network/admin del Oracle Home, o en la que indique TNS_ADMIN, y use lsnrctl status para ver los servicios del listener.',
    cita: '8.20 e), i), k) y n), controles de red',
    porque: 'La sesión de hoy puede ir cifrada por casualidad. Estos parámetros son los que obligan a cifrar y limitan quién se conecta.',
    peso: 55,
    campos: [],
    regla: {
      tipo: 'lista',
      items: [
        { id: 'cifrado', texto: 'SQLNET.ENCRYPTION_SERVER = REQUIRED', puntos: 0.35 },
        { id: 'integridad', texto: 'SQLNET.CRYPTO_CHECKSUM_SERVER = REQUIRED', puntos: 0.2 },
        { id: 'nodos', texto: 'TCP.VALIDNODE_CHECKING = YES con TCP.INVITED_NODES definidos', puntos: 0.25 },
        { id: 'servicios', texto: 'El listener no publica EXTPROC ni servicios innecesarios', puntos: 0.2 },
      ],
    },
  },
  {
    id: 'EV-08.1',
    control: 'A8.24',
    nombre: 'Estado del almacén de claves',
    pregunta: '¿Qué estado devuelve V$ENCRYPTION_WALLET?',
    cita: '8.24 d), gestión de claves',
    porque: 'Sin un almacén abierto con clave maestra, TDE no protege nada. Por eso el resto del control no puede valer más que esta medición.',
    peso: 40,
    critica: true,
    campos: [],
    regla: {
      tipo: 'opciones',
      campo: { id: 'ESTADO_ALMACEN', etiqueta: 'Valor de ESTADO_ALMACEN', origen: 'sql' },
      opciones: [
        { valor: 'OPEN', texto: 'Abierto y con clave maestra', puntos: 1 },
        { valor: 'OPEN_UNKNOWN_MASTER_KEY_STATUS', texto: 'Abierto, sin confirmar la clave maestra', puntos: 0.5 },
        { valor: 'OPEN_NO_MASTER_KEY', texto: 'Abierto, sin clave maestra', puntos: 0.25 },
        { valor: 'CLOSED', texto: 'Cerrado', puntos: 0 },
        { valor: 'NOT_AVAILABLE', texto: 'No disponible: no hay almacén configurado', puntos: 0 },
      ],
    },
  },
  {
    id: 'EV-08.2',
    control: 'A8.24',
    nombre: 'Tablespaces sin cifrar',
    pregunta: '¿Cuántos tablespaces de datos no están cifrados?',
    cita: '8.24 b), protección acorde con la clasificación',
    porque: 'Una copia de un datafile sin cifrar basta para leer los datos fuera de la base, sin pasar por ningún control de acceso.',
    peso: 40,
    campos: [
      { id: 'TABLESPACES_DATOS', etiqueta: 'Tablespaces de datos', origen: 'sql' },
      { id: 'SIN_CIFRAR', etiqueta: 'Sin cifrar', origen: 'sql' },
    ],
    regla: { tipo: 'proporcion', casos: 'SIN_CIFRAR', total: 'TABLESPACES_DATOS', sujeto: 'tablespaces sin cifrar', unidad: 'tablespaces', ejemplos: [{ casos: 2, total: 2 }, { casos: 2, total: 4 }, { casos: 2, total: 20 }], maximoTolerado: 100, topeConCasos: 0.9, siTotalCero: 0 },
  },
  {
    id: 'EV-08.3',
    control: 'A8.24',
    nombre: 'Rotación de la clave maestra',
    pregunta: '¿Hace cuántos días se activó la clave maestra actual?',
    cita: '8.24, gestión de claves e), cambio de claves',
    porque: 'Las reglas de gestión deben decir cuándo y cómo se cambian las claves. El objetivo de días lo define su política.',
    peso: 20,
    campos: [
      { id: 'DIAS_DESDE_ROTACION', etiqueta: 'Días desde la activación', origen: 'sql', ayuda: '9999 significa que no existe clave maestra.' },
      objetivoFijo('objetivo', 'Días máximos entre rotaciones', 365),
    ],
    regla: { tipo: 'vigencia', dias: 'DIAS_DESDE_ROTACION', objetivo: 'objetivo', evento: 'la última rotación', vecesLimite: 2 },
  },
  {
    id: 'EV-13.1',
    control: 'A8.8',
    nombre: 'Antigüedad del último parche',
    pregunta: '¿Hace cuántos días se aplicó el último parche?',
    cita: '8.8, actualizaciones y a) cronograma de reacción',
    porque: 'La norma pide instalar los parches aprobados y definir un cronograma. Oracle publica actualizaciones trimestrales, de ahí el objetivo sugerido.',
    peso: 45,
    campos: [
      { id: 'DIAS_SIN_PARCHE', etiqueta: 'Días sin parche', origen: 'sql', ayuda: 'Si nunca se aplicó un parche, cuenta desde la creación de la base.' },
      objetivoFijo('objetivo_parche', 'Días máximos sin parche', 120),
    ],
    regla: { tipo: 'vigencia', dias: 'DIAS_SIN_PARCHE', objetivo: 'objetivo_parche', evento: 'el último parche', vecesLimite: 3 },
  },
  {
    id: 'EV-13.2',
    control: 'A8.8',
    nombre: 'Respuesta ante parches pendientes',
    pregunta: '¿Qué situación describe mejor a su motor?',
    instruccion: 'Compare la columna VERSION_MOTOR con la última actualización publicada para su edición.',
    cita: '8.8 i), controles cuando no hay actualización',
    porque: 'Si no hay parche disponible, por ejemplo en Express Edition, la norma acepta otros controles. No cuenta igual tener compensación que no tener nada.',
    peso: 30,
    campos: [],
    regla: {
      tipo: 'opciones',
      campo: { id: 'situacion', etiqueta: 'Situación del motor', origen: 'organizacion' },
      opciones: [
        { valor: 'al_dia', texto: 'Recibe parches y la actualización vigente está aplicada', puntos: 1 },
        { valor: 'compensado', texto: 'Hay un parche pendiente o no disponible, con controles compensatorios documentados', puntos: 0.6 },
        { valor: 'pendiente', texto: 'Hay un parche pendiente con fecha planificada', puntos: 0.4 },
        { valor: 'sin_plan', texto: 'Hay un parche pendiente o no disponible, sin plan ni compensación', puntos: 0 },
      ],
    },
  },
  {
    id: 'EV-13.3',
    control: 'A8.8',
    nombre: 'Búsqueda de vulnerabilidades',
    pregunta: '¿Cuándo se buscaron por última vez vulnerabilidades en la base?',
    cita: '8.8 d), herramientas de escaneo',
    porque: 'La norma pide usar herramientas de escaneo para identificar vulnerabilidades y confirmar que se corrigieron.',
    peso: 25,
    campos: [],
    regla: respuesta('escaneo', 'Último escaneo de vulnerabilidades', hastaUnTrimestre),
  },
  {
    id: 'EV-17.1',
    control: 'A8.31',
    nombre: 'Copias con datos reales',
    pregunta: 'De sus esquemas o copias de desarrollo y prueba, ¿cuántos están enmascarados?',
    cita: '8.31 g), información confidencial fuera de producción',
    porque: 'La norma prohíbe copiar información confidencial a desarrollo sin controles equivalentes. Una copia real sin máscara expone todo, sin importar el tamaño de la base.',
    peso: 55,
    critica: true,
    campos: [
      { id: 'ESQUEMAS_NO_PRODUCTIVOS', etiqueta: 'Esquemas no productivos', origen: 'sql', ayuda: 'Sume a mano las copias que vivan en otros servidores.' },
      { id: 'enmascarados', etiqueta: 'Enmascarados', origen: 'organizacion', ayuda: 'Cuente los que pasaron la comprobación de la prueba PR-13.' },
    ],
    regla: { tipo: 'porCaso', casos: 'ESQUEMAS_NO_PRODUCTIVOS', descontar: 'enmascarados', sujeto: 'copias sin enmascarar', restaPorCaso: 0.5, motivo: 'Cada copia sin máscara expone todos los datos reales a quienes trabajan en ella.' },
  },
  {
    id: 'EV-17.2',
    control: 'A8.31',
    nombre: 'Separación de los entornos',
    pregunta: '¿Dónde está su entorno de desarrollo respecto de producción?',
    cita: '8.31 a), dominios separados',
    porque: 'La norma pide operar desarrollo y producción en dominios distintos. Cuanto más compartan, más fácil es que un cambio o una consulta crucen de un lado al otro.',
    peso: 45,
    campos: [],
    regla: {
      tipo: 'opciones',
      campo: { id: 'separacion', etiqueta: 'Ubicación del entorno', origen: 'organizacion' },
      opciones: [
        { valor: 'servidor', texto: 'En otro servidor o instancia', puntos: 1 },
        { valor: 'pdb', texto: 'En otra PDB de la misma instancia', puntos: 0.7 },
        { valor: 'esquema', texto: 'En otro esquema de la misma PDB', puntos: 0.3 },
        { valor: 'mismo', texto: 'En el mismo esquema que producción', puntos: 0 },
      ],
    },
  },
  {
    id: 'EV-16.1',
    control: 'A5.33',
    nombre: 'Administradores que controlan la auditoría',
    pregunta: '¿Cuántos administradores también pueden gestionar la auditoría?',
    cita: '5.33 a) y 8.15, protección de registros',
    porque: 'Quien administra la base no debe poder alterar el rastro de sus propias actividades. Una sola cuenta con ambos papeles invalida la evidencia.',
    peso: 35,
    campos: [{ id: 'ADMIN_Y_AUDITOR', etiqueta: 'Administradores con roles de auditoría', origen: 'sql' }],
    regla: { tipo: 'porCaso', casos: 'ADMIN_Y_AUDITOR', sujeto: 'administradores con roles de auditoría', restaPorCaso: 0.5, motivo: 'Basta una cuenta con ambos papeles para que el rastro deje de ser confiable.' },
  },
  {
    id: 'EV-16.2',
    control: 'A5.33',
    nombre: 'Retención conservada',
    pregunta: '¿Cuántos días de auditoría conserva la base?',
    cita: '5.33 b), calendario de conservación',
    porque: 'La norma pide definir cuánto tiempo se conserva cada tipo de registro. Aquí se compara lo conservado con un año de registros.',
    peso: 35,
    campos: [
      { id: 'DIAS_CONSERVADOS', etiqueta: 'Días conservados', origen: 'sql' },
      objetivoFijo('exigidos', 'Días exigidos', 365),
    ],
    regla: { tipo: 'cobertura', valor: 'DIAS_CONSERVADOS', objetivo: 'exigidos', unidad: 'días' },
  },
  {
    id: 'EV-16.3',
    control: 'A5.33',
    nombre: 'Archivo y purga controlados',
    pregunta: '¿Qué valor devuelve la consulta sobre el archivo y la purga de auditoría?',
    cita: '5.33, destrucción al vencer el período',
    porque: 'El sistema debe permitir destruir los registros vencidos de forma controlada. Sin marca de archivo, una purga puede borrar lo que aún no se guardó.',
    peso: 30,
    campos: [],
    regla: {
      tipo: 'opciones',
      campo: { id: 'ESTADO_RETENCION', etiqueta: 'Valor de ESTADO_RETENCION', origen: 'sql' },
      opciones: [
        { valor: 'ARCHIVO_Y_PURGA', texto: 'Marca de archivo y trabajo de purga activo', puntos: 1 },
        { valor: 'SOLO_ARCHIVO', texto: 'Solo marca de archivo', puntos: 0.5 },
        { valor: 'SOLO_PURGA', texto: 'Solo trabajo de purga, sin marca de archivo', puntos: 0.25 },
        { valor: 'SIN_DEFINIR', texto: 'Ni marca de archivo ni trabajo de purga', puntos: 0 },
      ],
    },
  },
]

const consultas: Record<IdControl, ConsultaMedicion> = {
  'A5.12': {
    contenedor: 'PDB',
    codigo: `WITH ${cteSensibles}
SELECT (SELECT COUNT(*) FROM sensibles) AS COLUMNAS_SENSIBLES,
       (SELECT COUNT(*) FROM sensibles
        WHERE etiqueta IS NULL OR etiqueta NOT LIKE 'CLASIF=%') AS SIN_ETIQUETA,
       (SELECT COUNT(DISTINCT t.owner)
        FROM dba_tables t
        JOIN dba_users u ON u.username = t.owner
        WHERE u.oracle_maintained = 'N' AND t.dropped = 'NO') AS ESQUEMAS_CON_DATOS
FROM dual;`,
    ajustes: [ajusteSensibles, ajusteEtiqueta, { busque: "NOT LIKE 'CLASIF=%'", cuando: 'Debe coincidir con el formato de su etiqueta.' }],
  },
  'A5.15': {
    contenedor: 'PDB',
    codigo: `WITH ${cteActivas},
${cteAlcance}
SELECT (SELECT COUNT(*) FROM activas) AS CUENTAS_ACTIVAS,
       (SELECT COUNT(*)
        FROM activas a
        WHERE EXISTS (SELECT 1 FROM dba_tab_privs p
                      WHERE p.grantee = a.username AND p.type IN ('TABLE', 'VIEW'))
           OR EXISTS (SELECT 1 FROM dba_sys_privs s
                      WHERE s.grantee = a.username AND s.privilege <> 'CREATE SESSION')
       ) AS CON_PRIVILEGIOS_DIRECTOS,
       (SELECT COUNT(DISTINCT cuenta) FROM alcance
        WHERE rol IN ('RESOURCE', 'SELECT_CATALOG_ROLE', 'EXECUTE_CATALOG_ROLE', 'DELETE_CATALOG_ROLE')
       ) AS CON_ROL_GENERICO,
       (SELECT COUNT(*) FROM dba_roles WHERE oracle_maintained = 'N') AS ROLES_PROPIOS
FROM dual;`,
    ajustes: [{ busque: "'RESOURCE', 'SELECT_CATALOG_ROLE', 'EXECUTE_CATALOG_ROLE', 'DELETE_CATALOG_ROLE'", cuando: 'Son los roles que se tratan como genéricos. Agregue otros que su organización considere igual.' }],
  },
  'A5.16': {
    contenedor: 'PDB',
    codigo: `WITH ${cteActivas}
SELECT (SELECT COUNT(*)
        FROM dba_users
        WHERE oracle_maintained = 'Y'
          AND account_status NOT LIKE '%LOCKED%'
          AND authentication_type <> 'NONE'
          AND username NOT IN ('SYS', 'SYSTEM')) AS INTERNAS_ABIERTAS,
       (SELECT COUNT(*) FROM activas) AS CUENTAS_ACTIVAS
FROM dual;`,
  },
  'A5.17': {
    contenedor: 'PDB',
    codigo: `WITH ${cteLimites},
${cteConClave}
SELECT (SELECT COUNT(*)
        FROM dba_users_with_defpwd d
        JOIN dba_users u ON u.username = d.username
        WHERE u.account_status NOT LIKE '%LOCKED%') AS CLAVES_DE_FABRICA,
       (SELECT COUNT(*) FROM con_clave) AS CUENTAS_CON_CLAVE,
       (SELECT COUNT(*) FROM con_clave
        WHERE password_versions LIKE '%10G%' OR password_versions LIKE '%11G%') AS VERIFICADOR_DEBIL,
       (SELECT COUNT(*)
        FROM con_clave c
        JOIN limites v ON v.profile = c.profile AND v.resource_name = 'PASSWORD_VERIFY_FUNCTION'
        JOIN limites r ON r.profile = c.profile AND r.resource_name = 'PASSWORD_REUSE_MAX'
        WHERE v.limite = 'NULL' OR r.limite = 'UNLIMITED') AS PERFIL_DEBIL
FROM dual;`,
  },
  'A5.18': {
    contenedor: 'PDB',
    codigo: `WITH ${cteActivas},
${cteAlcance}
SELECT (SELECT COUNT(*) FROM activas) AS CUENTAS_ACTIVAS,
       (SELECT COUNT(DISTINCT a.cuenta)
        FROM alcance a
        JOIN dba_sys_privs s ON s.grantee = a.rol
        WHERE s.privilege LIKE '%ANY%'
          AND a.cuenta NOT IN (SELECT cuenta FROM alcance WHERE rol IN ('DBA', 'PDB_DBA'))
       ) AS CUENTAS_CON_ANY,
       (SELECT COUNT(*)
        FROM dba_users u
        JOIN activas a ON a.username = u.username
        WHERE (u.last_login IS NULL OR u.last_login < SYSTIMESTAMP - INTERVAL '90' DAY)
          AND u.created < SYSDATE - 90) AS CUENTAS_SIN_USO
FROM dual;`,
    ajustes: [ajusteAdministradores, { busque: "INTERVAL '90' DAY", cuando: 'Son los días sin uso que se toleran. Si su política usa otro plazo, cambie este 90 y también el de SYSDATE - 90.' }],
  },
  'A5.33': {
    contenedor: 'PDB',
    codigo: `WITH ${cteActivas},
${cteAlcance}
SELECT (SELECT COUNT(DISTINCT cuenta)
        FROM alcance
        WHERE rol IN ('AUDIT_ADMIN', 'AUDIT_VIEWER')
          AND cuenta IN (SELECT cuenta FROM alcance WHERE rol IN ('DBA', 'PDB_DBA'))
       ) AS ADMIN_Y_AUDITOR,
       (SELECT NVL(ROUND(SYSDATE - CAST(MIN(event_timestamp) AS DATE)), 0)
        FROM unified_audit_trail) AS DIAS_CONSERVADOS,
       (SELECT CASE
                 WHEN m.marcas > 0 AND t.trabajos > 0 THEN 'ARCHIVO_Y_PURGA'
                 WHEN m.marcas > 0 THEN 'SOLO_ARCHIVO'
                 WHEN t.trabajos > 0 THEN 'SOLO_PURGA'
                 ELSE 'SIN_DEFINIR'
               END
        FROM (SELECT COUNT(*) AS marcas FROM dba_audit_mgmt_last_arch_ts) m
        CROSS JOIN (SELECT COUNT(*) AS trabajos FROM dba_audit_mgmt_cleanup_jobs
                    WHERE job_status = 'ENABLED') t
       ) AS ESTADO_RETENCION
FROM dual;`,
    ajustes: [ajusteAdministradores],
  },
  'A8.2': {
    contenedor: 'PDB',
    codigo: `WITH ${cteActivas},
${cteAlcance},
titulares AS (
  SELECT cuenta FROM alcance WHERE rol IN ('DBA', 'PDB_DBA')
  UNION
  SELECT p.username
  FROM v$pwfile_users p
  JOIN activas a ON a.username = p.username
)
SELECT (SELECT COUNT(*) FROM activas) AS CUENTAS_ACTIVAS,
       (SELECT COUNT(*) FROM titulares) AS TITULARES_ADMIN,
       (SELECT CASE
                 WHEN s.valor = 'TRUE' AND p.total > 0 THEN 'SYS_Y_POLITICA'
                 WHEN s.valor = 'TRUE' THEN 'SOLO_SYS'
                 WHEN p.total > 0 THEN 'SOLO_POLITICA'
                 ELSE 'SIN_REGISTRO'
               END
        FROM (SELECT UPPER(value) AS valor FROM v$parameter WHERE name = 'audit_sys_operations') s
        CROSS JOIN (SELECT COUNT(*) AS total FROM audit_unified_enabled_policies
                    WHERE policy_name = 'ORA_SECURECONFIG') p
       ) AS REGISTRO_PRIVILEGIADO
FROM dual;`,
    ajustes: [ajusteAdministradores, { busque: "'ORA_SECURECONFIG'", cuando: 'Es la política que registra el uso de privilegios. Si usa una propia, escriba su nombre.' }],
  },
  'A8.3': {
    contenedor: 'PDB',
    codigo: `WITH ${cteActivas},
${cteAlcance},
${cteSensibles}
SELECT (SELECT COUNT(*) FROM activas) AS CUENTAS_ACTIVAS,
       (SELECT COUNT(DISTINCT p.owner || '.' || p.table_name)
        FROM dba_tab_privs p
        JOIN dba_users u ON u.username = p.owner
        WHERE p.grantee = 'PUBLIC'
          AND u.oracle_maintained = 'N'
          AND p.type IN ('TABLE', 'VIEW')) AS OBJETOS_EN_PUBLIC,
       (SELECT COUNT(DISTINCT a.cuenta)
        FROM alcance a
        JOIN dba_tab_privs p ON p.grantee = a.rol AND p.privilege IN ('SELECT', 'READ')
        JOIN sensibles s ON s.owner = p.owner AND s.table_name = p.table_name
        WHERE a.cuenta <> p.owner) AS CUENTAS_CON_LECTURA,
       (SELECT COUNT(DISTINCT owner || '.' || table_name) FROM sensibles) AS TABLAS_SENSIBLES,
       (SELECT COUNT(DISTINCT s.owner || '.' || s.table_name)
        FROM sensibles s
        WHERE NOT EXISTS (SELECT 1 FROM dba_policies p
                          WHERE p.object_owner = s.owner
                            AND p.object_name = s.table_name
                            AND p.enable = 'YES')) AS SIN_VPD
FROM dual;`,
    ajustes: [ajusteSensibles, ajusteEtiqueta],
  },
  'A8.5': {
    contenedor: 'PDB',
    codigo: `WITH ${cteActivas},
${cteAlcance},
${cteLimites},
${cteConClave}
SELECT (SELECT COUNT(*) FROM con_clave) AS CUENTAS_CON_CLAVE,
       (SELECT COUNT(CASE WHEN l.limite = 'UNLIMITED' THEN 1
                          WHEN TO_NUMBER(l.limite) > 5 THEN 1 END)
        FROM con_clave c
        JOIN limites l ON l.profile = c.profile AND l.resource_name = 'FAILED_LOGIN_ATTEMPTS'
       ) AS SIN_BLOQUEO_EFECTIVO,
       (SELECT COUNT(*)
        FROM con_clave c
        JOIN limites l ON l.profile = c.profile AND l.resource_name = 'IDLE_TIME'
        WHERE l.limite = 'UNLIMITED') AS SIN_LIMITE_INACTIVIDAD,
       (SELECT COUNT(DISTINCT cuenta) FROM alcance WHERE rol IN ('DBA', 'PDB_DBA')) AS TITULARES_ADMIN
FROM dual;`,
    ajustes: [ajusteAdministradores, { busque: '> 5', cuando: 'Es el máximo de intentos que se acepta. Si su política permite otro número, cámbielo.' }],
  },
  'A8.8': {
    contenedor: 'PDB',
    codigo: `SELECT ROUND(SYSDATE - GREATEST(d.created, NVL(p.ultimo, d.created))) AS DIAS_SIN_PARCHE,
       i.version_full AS VERSION_MOTOR
FROM v$database d
CROSS JOIN v$instance i
CROSS JOIN (SELECT MAX(CAST(action_time AS DATE)) AS ultimo
            FROM dba_registry_sqlpatch
            WHERE status = 'SUCCESS') p;`,
  },
  'A8.10': {
    contenedor: 'PDB',
    codigo: `WITH columnas AS (
  SELECT c.owner, c.table_name
  FROM dba_tab_columns c
  JOIN dba_users u ON u.username = c.owner AND u.oracle_maintained = 'N'
  LEFT JOIN dba_col_comments m
    ON m.owner = c.owner AND m.table_name = c.table_name AND m.column_name = c.column_name
  WHERE m.comments LIKE 'CLASIF=CONFIDENCIAL%'
     OR REGEXP_LIKE(c.column_name, '${patronSensible}')
)
SELECT (SELECT COUNT(DISTINCT r.owner || '.' || r.object_name)
        FROM dba_recyclebin r
        JOIN columnas c ON c.owner = r.owner AND c.table_name = r.object_name
        WHERE r.type = 'TABLE') AS TABLAS_EN_PAPELERA,
       (SELECT COUNT(DISTINCT c.owner || '.' || c.table_name)
        FROM columnas c
        JOIN dba_tables t ON t.owner = c.owner AND t.table_name = c.table_name AND t.dropped = 'NO'
       ) AS TABLAS_SENSIBLES
FROM dual;`,
    ajustes: [ajusteSensibles, ajusteEtiqueta],
  },
  'A8.11': {
    contenedor: 'PDB',
    codigo: `WITH ${cteActivas},
${cteAlcance},
${cteAdministradores},
${cteSensibles},
redactadas AS (
  SELECT c.object_owner, c.object_name, c.column_name
  FROM redaction_columns c
  JOIN redaction_policies p
    ON p.object_owner = c.object_owner AND p.object_name = c.object_name
  WHERE TRIM(p.enable) = 'YES'
)
SELECT (SELECT COUNT(*) FROM sensibles) AS COLUMNAS_SENSIBLES,
       (SELECT COUNT(*)
        FROM sensibles s
        WHERE NOT EXISTS (SELECT 1 FROM redactadas r
                          WHERE r.object_owner = s.owner
                            AND r.object_name = s.table_name
                            AND r.column_name = s.column_name)) AS SIN_REDACCION,
       (SELECT COUNT(*) FROM activas) AS CUENTAS_ACTIVAS,
       (SELECT COUNT(DISTINCT a.cuenta)
        FROM alcance a
        JOIN dba_sys_privs p ON p.grantee = a.rol
        WHERE p.privilege = 'EXEMPT REDACTION POLICY'
          AND a.cuenta NOT IN (SELECT cuenta FROM administradores)) AS CUENTAS_EXENTAS
FROM dual;`,
    ajustes: [ajusteSensibles, ajusteEtiqueta, ajusteAdministradores],
  },
  'A8.12': {
    contenedor: 'PDB',
    codigo: `WITH ${cteActivas},
${cteAlcance},
${cteAdministradores}
SELECT (SELECT COUNT(DISTINCT table_name)
        FROM dba_tab_privs
        WHERE grantee = 'PUBLIC'
          AND privilege = 'EXECUTE'
          AND table_name IN (${paquetesDeSalida})) AS PAQUETES_EN_PUBLIC,
       (SELECT COUNT(DISTINCT cuenta)
        FROM alcance
        WHERE rol IN ('DATAPUMP_EXP_FULL_DATABASE', 'EXP_FULL_DATABASE')
          AND cuenta NOT IN (SELECT cuenta FROM administradores)) AS CON_EXPORTACION,
       (SELECT COUNT(DISTINCT a.cuenta)
        FROM alcance a
        JOIN dba_tab_privs p ON p.grantee = a.rol
        WHERE p.type = 'DIRECTORY'
          AND p.privilege = 'WRITE'
          AND a.cuenta NOT IN (SELECT cuenta FROM administradores)) AS ESCRITURA_DIRECTORIOS
FROM dual;`,
    ajustes: [ajusteAdministradores, { busque: paquetesDeSalida, cuando: 'Son los paquetes que se revisan. Agregue otros que su organización considere vías de salida.' }],
  },
  'A8.13': {
    contenedor: 'CDB$ROOT',
    codigo: `SELECT (SELECT NVL(ROUND(SYSDATE - MAX(end_time)), 9999)
        FROM v$rman_backup_job_details
        WHERE input_type IN ('DB FULL', 'DB INCR')
          AND status LIKE 'COMPLETED%') AS DIAS_DESDE_RESPALDO,
       (SELECT COUNT(*) FROM v$backup_piece WHERE status = 'A') AS PIEZAS_ACTIVAS,
       (SELECT COUNT(*) FROM v$backup_piece
        WHERE status = 'A' AND encrypted <> 'YES') AS PIEZAS_SIN_CIFRAR,
       (SELECT COUNT(*) FROM v$rman_backup_job_details
        WHERE start_time > SYSDATE - 30) AS TRABAJOS_30_DIAS,
       (SELECT COUNT(*) FROM v$rman_backup_job_details
        WHERE start_time > SYSDATE - 30
          AND status NOT LIKE 'COMPLETED%'
          AND status NOT LIKE 'RUNNING%') AS TRABAJOS_CON_FALLA
FROM dual;`,
  },
  'A8.15': {
    contenedor: 'PDB',
    codigo: `WITH ${cteSensibles},
requeridas (policy_name) AS (
  SELECT 'ORA_LOGON_FAILURES' FROM dual
  UNION ALL SELECT 'ORA_SECURECONFIG' FROM dual
  UNION ALL SELECT 'ORA_ACCOUNT_MGMT' FROM dual
),
auditadas AS (
  SELECT DISTINCT p.object_schema, p.object_name
  FROM audit_unified_policies p
  JOIN audit_unified_enabled_policies e ON e.policy_name = p.policy_name
)
SELECT (SELECT COUNT(*) FROM requeridas) AS POLITICAS_REQUERIDAS,
       (SELECT COUNT(*)
        FROM requeridas r
        WHERE NOT EXISTS (SELECT 1 FROM audit_unified_enabled_policies e
                          WHERE e.policy_name = r.policy_name)) AS POLITICAS_INACTIVAS,
       (SELECT COUNT(DISTINCT owner || '.' || table_name) FROM sensibles) AS TABLAS_SENSIBLES,
       (SELECT COUNT(DISTINCT s.owner || '.' || s.table_name)
        FROM sensibles s
        WHERE NOT EXISTS (SELECT 1 FROM auditadas a
                          WHERE a.object_schema = s.owner
                            AND a.object_name = s.table_name)) AS SIN_AUDITORIA
FROM dual;`,
    ajustes: [ajusteSensibles, ajusteEtiqueta, { busque: "'ORA_LOGON_FAILURES'", cuando: 'Es la primera de las tres políticas. Si registra estos eventos con políticas propias, cambie los tres nombres por los suyos.' }],
  },
  'A8.20': {
    contenedor: 'PDB',
    codigo: `WITH tcp AS (
  SELECT DISTINCT sid, serial#
  FROM v$session_connect_info
  WHERE network_service_banner LIKE '%TCP/IP%'
),
cifradas AS (
  SELECT DISTINCT sid, serial#
  FROM v$session_connect_info
  WHERE network_service_banner LIKE '%Encryption service adapter%'
)
SELECT COUNT(*) AS SESIONES_TCP,
       COUNT(CASE WHEN c.sid IS NULL THEN 1 END) AS SESIONES_SIN_CIFRAR
FROM tcp t
LEFT JOIN cifradas c ON c.sid = t.sid AND c.serial# = t.serial#;`,
  },
  'A8.24': {
    contenedor: 'PDB',
    codigo: `SELECT (SELECT status FROM v$encryption_wallet WHERE ROWNUM = 1) AS ESTADO_ALMACEN,
       (SELECT COUNT(*)
        FROM dba_tablespaces
        WHERE contents = 'PERMANENT'
          AND tablespace_name NOT IN ('SYSTEM', 'SYSAUX')) AS TABLESPACES_DATOS,
       (SELECT COUNT(*)
        FROM dba_tablespaces
        WHERE contents = 'PERMANENT'
          AND tablespace_name NOT IN ('SYSTEM', 'SYSAUX')
          AND encrypted <> 'YES') AS SIN_CIFRAR,
       (SELECT NVL(ROUND(SYSDATE - CAST(MAX(activation_time) AS DATE)), 9999)
        FROM v$encryption_keys) AS DIAS_DESDE_ROTACION
FROM dual;`,
  },
  'A8.31': {
    contenedor: 'PDB',
    codigo: `SELECT COUNT(*) AS ESQUEMAS_NO_PRODUCTIVOS
FROM dba_users
WHERE oracle_maintained = 'N'
  AND REGEXP_LIKE(username, '(^|_)(DEV|DESA|TEST|QA|PRUEBA)(_|$)');`,
    ajustes: [{ busque: 'DEV|DESA|TEST|QA|PRUEBA', cuando: 'Son las palabras que identifican un esquema no productivo. Agregue las que usen sus nombres.' }],
  },
}

function crearEvidencia(id: string, control: IdControl, nombre: string, pregunta: string): EvidenciaRequerida {
  return { id, control, nombre, pregunta, consulta: consultas[control], mediciones: mediciones.filter((medicion) => medicion.control === control) }
}

export const evidencias: EvidenciaRequerida[] = [
  crearEvidencia('EV-01', 'A5.16', 'Identidades de la base', '¿Cada cuenta abierta corresponde a una persona o sistema identificado?'),
  crearEvidencia('EV-02', 'A5.18', 'Derechos de acceso vigentes', '¿Los derechos de acceso siguen siendo necesarios y están revisados?'),
  crearEvidencia('EV-03', 'A8.2', 'Titulares de privilegios administrativos', '¿Quién tiene privilegios administrativos, está autorizado y queda registrado?'),
  crearEvidencia('EV-04', 'A5.15', 'Acceso por roles de función', '¿El acceso se otorga por roles de función documentados?'),
  crearEvidencia('EV-05', 'A8.12', 'Canales de extracción de datos', '¿Qué vías permiten sacar datos de la base sin autorización?'),
  crearEvidencia('EV-06', 'A8.5', 'Protección del inicio de sesión', '¿El inicio de sesión resiste la fuerza bruta y protege a los administradores?'),
  crearEvidencia('EV-07', 'A5.17', 'Calidad de las contraseñas', '¿Las contraseñas se asignan, guardan y validan de forma segura?'),
  crearEvidencia('EV-08', 'A8.24', 'Cifrado y gestión de claves', '¿Los datos en reposo están cifrados y su clave está bien gestionada?'),
  crearEvidencia('EV-09', 'A8.11', 'Enmascaramiento de datos sensibles', '¿Las columnas sensibles se muestran enmascaradas a quien no debe verlas?'),
  crearEvidencia('EV-10', 'A8.3', 'Acceso a los datos sensibles', '¿Quién puede leer los datos sensibles y con qué restricción?'),
  crearEvidencia('EV-11', 'A8.13', 'Respaldos vigentes y cifrados', '¿Los respaldos están al día, cifrados y probados?'),
  crearEvidencia('EV-12', 'A8.15', 'Registro de eventos', '¿Los eventos importantes y el acceso a datos sensibles quedan registrados y se revisan?'),
  crearEvidencia('EV-13', 'A8.8', 'Parches y vulnerabilidades', '¿El motor está al día y se buscan vulnerabilidades?'),
  crearEvidencia('EV-14', 'A8.20', 'Protección de la red', '¿El tráfico viaja cifrado y la red limita quién se conecta?'),
  crearEvidencia('EV-15', 'A8.10', 'Eliminación de datos sensibles', '¿Los datos sensibles se eliminan a tiempo y sin dejar copias legibles?'),
  crearEvidencia('EV-16', 'A5.33', 'Protección del rastro de auditoría', '¿El rastro de auditoría se conserva el tiempo exigido y nadie lo puede alterar?'),
  crearEvidencia('EV-17', 'A8.31', 'Separación de entornos', '¿Desarrollo y prueba están separados de producción y sin datos reales?'),
  crearEvidencia('EV-18', 'A5.12', 'Clasificación de la información', '¿Los datos sensibles están clasificados y tienen responsable?'),
]

export function evidenciaDeControl(control: string): EvidenciaRequerida {
  const evidencia = evidencias.find((item) => item.control === control)
  if (!evidencia) throw new Error(`Falta la evidencia de ${control}`)
  return evidencia
}
