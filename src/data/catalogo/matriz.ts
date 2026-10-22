import type { EvidenciaRequerida, FilaMatriz } from '../tipos'
import { controles } from './controles'
import { pruebas } from './pruebas'

type FilaBase = Omit<FilaMatriz, 'evidenciasRequeridas'>

const filasBase: FilaBase[] = [
  {
    id: 'M-01',
    tarea: 'T-01',
    riesgo: 'R-CONF-01',
    control: 'A5.16',
    criterio: 'Internas bloqueadas, cuentas nominales y bajas oportunas.',
    pruebas: ['PR-02'],
  },
  {
    id: 'M-02',
    tarea: 'T-01',
    riesgo: 'R-CONF-01',
    control: 'A5.18',
    criterio: 'Sin ANY fuera de administración y sin cuentas abiertas sin uso.',
    pruebas: ['PR-04', 'PR-23'],
  },
  {
    id: 'M-03',
    tarea: 'T-02',
    riesgo: 'R-CONF-01',
    control: 'A8.2',
    criterio: 'DBA y SYSDBA solo en cuentas nominales autorizadas y auditadas.',
    pruebas: ['PR-03'],
  },
  {
    id: 'M-04',
    tarea: 'T-02',
    riesgo: 'R-CONF-04',
    control: 'A5.15',
    criterio: 'Acceso por roles de función con negación por omisión.',
    pruebas: ['PR-09'],
  },
  {
    id: 'M-05',
    tarea: 'T-02',
    riesgo: 'R-CONF-04',
    control: 'A8.12',
    criterio: 'PUBLIC sin paquetes de extracción y exportación restringida.',
    pruebas: ['PR-05'],
  },
  {
    id: 'M-06',
    tarea: 'T-03',
    riesgo: 'R-CONF-02',
    control: 'A8.5',
    criterio: 'Perfil con bloqueo, verificación y no reutilización en todas las cuentas.',
    pruebas: ['PR-06', 'PR-07'],
  },
  {
    id: 'M-07',
    tarea: 'T-03',
    riesgo: 'R-CONF-02',
    control: 'A5.17',
    criterio: 'Sin contraseñas de fábrica y solo verificadores 12C.',
    pruebas: ['PR-01', 'PR-08'],
  },
  {
    id: 'M-08',
    tarea: 'T-04',
    riesgo: 'R-CONF-03',
    control: 'A8.24',
    criterio: 'Almacén de claves abierto y tablespaces clasificados cifrados.',
    pruebas: ['PR-14'],
  },
  {
    id: 'M-09',
    tarea: 'T-05',
    riesgo: 'R-CONF-04',
    control: 'A8.11',
    criterio: 'Redacción activa sobre todas las columnas confidenciales.',
    pruebas: ['PR-11'],
  },
  {
    id: 'M-10',
    tarea: 'T-05',
    riesgo: 'R-CONF-04',
    control: 'A8.3',
    criterio: 'VPD habilitado en cada tabla confidencial.',
    pruebas: ['PR-10'],
  },
  {
    id: 'M-11',
    tarea: 'T-06',
    riesgo: 'R-CONF-03',
    control: 'A8.13',
    criterio: 'Respaldo reciente, cifrado y con restauración validada.',
    pruebas: ['PR-17', 'PR-18'],
  },
  {
    id: 'M-12',
    tarea: 'T-07',
    riesgo: 'R-CONF-05',
    control: 'A8.15',
    criterio: 'Registro de inicios fallidos, privilegios y acceso a datos clasificados.',
    pruebas: ['PR-15'],
  },
  {
    id: 'M-13',
    tarea: 'T-08',
    riesgo: 'R-CONF-02',
    control: 'A8.8',
    criterio: 'Actualización trimestral vigente aplicada.',
    pruebas: ['PR-22'],
  },
  {
    id: 'M-14',
    tarea: 'T-09',
    riesgo: 'R-CONF-02',
    control: 'A8.20',
    criterio: 'Cifrado e integridad exigidos y listener restringido.',
    pruebas: ['PR-19', 'PR-20'],
  },
  {
    id: 'M-15',
    tarea: 'T-10',
    riesgo: 'R-CONF-03',
    control: 'A8.10',
    criterio: 'Borrado definitivo y papelera sin datos clasificados.',
    pruebas: ['PR-21'],
  },
  {
    id: 'M-16',
    tarea: 'T-11',
    riesgo: 'R-CONF-05',
    control: 'A5.33',
    criterio: 'Rastro inalterable con retención y purga definidas.',
    pruebas: ['PR-16'],
  },
  {
    id: 'M-17',
    tarea: 'T-12',
    riesgo: 'R-CONF-04',
    control: 'A8.31',
    criterio: 'Copias de desarrollo sin valores reales ni privilegios hacia producción.',
    pruebas: ['PR-13'],
  },
  {
    id: 'M-18',
    tarea: 'T-13',
    riesgo: 'R-CONF-04',
    control: 'A5.12',
    criterio: 'Todas las columnas con datos personales etiquetadas.',
    pruebas: ['PR-12'],
  },
]

const pasosDeObservable = [
  'Conéctese a la base con una cuenta autorizada a consultar el diccionario de datos.',
  'Ejecute la consulta.',
  'Compare el resultado con el criterio de aceptación.',
]

function evidenciasDeFila(controlId: string, pruebaIds: string[]): EvidenciaRequerida[] {
  const evidencias: EvidenciaRequerida[] = []
  const observable = controles.find((control) => control.id === controlId)?.observable
  if (observable) {
    evidencias.push({
      id: observable.id,
      origen: 'observable',
      titulo: observable.enunciado,
      pasos: pasosDeObservable,
      codigo: observable.consulta,
      lenguaje: 'SQL',
      esperado: observable.criterio,
    })
  }
  pruebaIds.forEach((pruebaId) => {
    const prueba = pruebas.find((item) => item.id === pruebaId)
    if (!prueba) return
    evidencias.push({
      id: prueba.id,
      origen: 'prueba',
      titulo: prueba.nombre,
      pasos: prueba.procedimiento,
      codigo: prueba.sql,
      lenguaje: prueba.lenguaje,
      esperado: prueba.resultadoEsperado,
    })
  })
  return evidencias
}

export const matriz: FilaMatriz[] = filasBase.map((fila) => ({
  ...fila,
  evidenciasRequeridas: evidenciasDeFila(fila.control, fila.pruebas),
}))
