import { matriz } from '../data/catalogo/matriz'
import type { Evaluacion } from './archivoEvaluacion'
import { calcularFila, formatoPuntuacion, registroVacioEvidencia, type CalculoControl } from './medicion'

export { formatoPuntuacion }

export type Salud = 'Verde' | 'Amarillo' | 'Rojo'

export type PuntuacionControl = {
  id: string
  filaId: string
  puntuacion: number
}

export function calculoDeFila(evaluacion: Evaluacion, filaId: string): CalculoControl | null {
  const fila = matriz.find((item) => item.id === filaId)
  if (!fila) return null
  return calcularFila(fila, (id, evidenciaId) => evaluacion.respuestasEvidencia[id]?.[evidenciaId] ?? registroVacioEvidencia)
}

export function puntuacionesControles(evaluacion: Evaluacion): PuntuacionControl[] {
  return matriz.map((fila) => ({ id: fila.control, filaId: fila.id, puntuacion: calculoDeFila(evaluacion, fila.id)?.puntuacion ?? 0 }))
}

export function puntuacionSalud(evaluacion: Evaluacion): number {
  const puntuaciones = puntuacionesControles(evaluacion)
  return puntuaciones.reduce((suma, control) => suma + control.puntuacion, 0) / puntuaciones.length
}

export function tieneMediciones(evaluacion: Evaluacion): boolean {
  return Object.values(evaluacion.respuestasEvidencia).some((porEvidencia) => Object.values(porEvidencia).some((registro) => Object.keys(registro.valores).length > 0))
}

export function saludDePuntuacion(puntuacion: number): Salud {
  if (puntuacion >= 0.75) return 'Verde'
  if (puntuacion >= 0.5) return 'Amarillo'
  return 'Rojo'
}
