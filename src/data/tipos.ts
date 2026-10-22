export type Nivel = 0 | 1 | 2 | 3 | 4

export type Estado = 'Cumple' | 'Parcial' | 'No cumple'

export type Veredicto = 'Conforme' | 'Parcial' | 'No conforme'

export type FasePhva = 'Planificar' | 'Hacer' | 'Verificar' | 'Actuar'

export type Propiedad = 'C' | 'I' | 'D'

export type Escala = 1 | 2 | 3 | 4 | 5

export type Riesgo = {
  id: string
  nombre: string
  descripcion: string
  escenario: string
  activos: string[]
  amenaza: string
  vulnerabilidad: string
  impacto: Escala
  probabilidad: Escala
  justificacionImpacto: string
  justificacionProbabilidad: string
  tareas: string[]
  controles: string[]
}

export type Tarea = {
  id: string
  nombre: string
  descripcion: string
  frecuencia: string
  fase: FasePhva
  herramientas: string[]
  riesgos: string[]
  controles: string[]
}

export type Control = {
  id: string
  nombre: string
  tema: 'Organizacional' | 'Tecnológico'
  tipo: string[]
  propiedades: Propiedad[]
  complementario: boolean
  proposito: string
  justificacion: string
  implementacion: string[]
  evidencia: string
  riesgos: string[]
  tareas: string[]
  pruebas: string[]
}

export type Observable = {
  id: string
  control: string
  enunciado: string
  consulta: string
  criterio: string
  pruebas: string[]
  veredicto: Veredicto
  resultado: string
}

export type TipoPrueba =
  | 'Consulta de configuración'
  | 'Prueba funcional'
  | 'Revisión de archivos'
  | 'Validación con RMAN'

export type Prueba = {
  id: string
  nombre: string
  tipo: TipoPrueba
  controles: string[]
  objetivo: string
  procedimiento: string[]
  resultadoEsperado: string
  resultadoObtenido: string
  veredicto: Veredicto
  herramienta: string
  script: string
  evidencia: string
}

export type FilaMatriz = {
  id: string
  tarea: string
  riesgo: string
  control: string
  criterio: string
  nivel: Nivel
  evidencia: string
  pruebas: string[]
}

export type Prioridad = 'Alta' | 'Media' | 'Baja'

export type Hallazgo = {
  id: string
  titulo: string
  prioridad: Prioridad
  condicion: string
  criterio: string
  causa: string
  efecto: string
  recomendacion: string
  remediacion: string
  controles: string[]
  pruebas: string[]
  riesgos: string[]
}

export type SeccionTeorica = {
  id: string
  titulo: string
  parrafos: string[]
}

export type Referencia = {
  id: string
  apa: string
  url?: string
}

export type UsoIA = {
  id: string
  herramienta: string
  prompt: string
  aporte: string
  validacion: string
  fuente: string
}
