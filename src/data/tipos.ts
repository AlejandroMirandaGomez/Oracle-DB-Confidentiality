export type Nivel = 0 | 1 | 2 | 3 | 4

export type NivelEvaluado = Nivel | null

export type Estado = 'Cumple' | 'Parcial' | 'No cumple' | 'Sin evaluar'

export type Veredicto = 'Conforme' | 'Parcial' | 'No conforme'

export type RespuestaEvidencia = 'Sí' | 'Parcial' | 'No'

export type RespuestaPrueba = Veredicto

export type FasePhva = 'Planificar' | 'Hacer' | 'Verificar' | 'Actuar'

export type Propiedad = 'C' | 'I' | 'D'

export type Escala = 1 | 2 | 3 | 4 | 5

export type BandaRiesgo = 'Bajo' | 'Medio' | 'Alto' | 'Crítico'

export type Prioridad = 'Alta' | 'Media' | 'Baja'

export type LenguajeCodigo = 'SQL' | 'RMAN' | 'Comandos'

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

export type Observable = {
  id: string
  enunciado: string
  consulta: string
  criterio: string
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
  observable?: Observable
  riesgos: string[]
  tareas: string[]
  pruebas: string[]
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
  herramienta: string
  lenguaje: LenguajeCodigo
  sql: string
}

export type EvidenciaRequerida = {
  id: string
  origen: 'observable' | 'prueba'
  titulo: string
  pasos: string[]
  codigo: string
  lenguaje: LenguajeCodigo
  esperado: string
}

export type FilaMatriz = {
  id: string
  tarea: string
  riesgo: string
  control: string
  criterio: string
  pruebas: string[]
  evidenciasRequeridas: EvidenciaRequerida[]
}

export type PlantillaHallazgo = {
  control: string
  titulo: string
  condicionNoCumple: string
  condicionParcial: string
  criterio: string
  causa: string
  efecto: string
  recomendacion: string
  remediacion: string
}

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
  filas: string[]
  contradiccion: boolean
}

export type ObservableEjemplo = Observable & {
  control: string
  pruebas: string[]
  veredicto: Veredicto
  resultado: string
}

export type PruebaEjemplo = {
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

export type FilaMatrizEjemplo = {
  id: string
  tarea: string
  riesgo: string
  control: string
  criterio: string
  nivel: Nivel
  evidencia: string
  pruebas: string[]
}

export type HallazgoEjemplo = {
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

export type RegistroEvidencia = {
  respuesta: RespuestaEvidencia | null
  nota: string
}

export type RegistroPrueba = {
  respuesta: RespuestaPrueba | null
  nota: string
}

export type Niveles = Record<string, Nivel>

export type RespuestasEvidencia = Record<string, Record<string, RegistroEvidencia>>

export type RespuestasPruebas = Record<string, RegistroPrueba>

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
