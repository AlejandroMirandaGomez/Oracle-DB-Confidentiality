import { matriz } from '../data/catalogo/matriz'
import type { RespuestaEvidencia } from '../data/tipos'
import type { Evaluacion } from './archivoEvaluacion'

export type Salud = 'Verde' | 'Amarillo' | 'Rojo'

export type PuntuacionControl = {
  id: string
  filaId: string
  puntuacion: number
}

const pesoRespuesta: Record<RespuestaEvidencia, number> = { Sí: 1, Parcial: 0.5, No: 0 }

export function puntuacionesControles(evaluacion: Evaluacion): PuntuacionControl[] {
  return matriz.map((fila) => {
    const nivel = evaluacion.niveles[fila.id] ?? 0
    const evidencias = fila.evidenciasRequeridas
    const calidadEvidencia = evidencias.length === 0 ? 0 : evidencias.reduce((suma, evidencia) => {
      const respuesta = evaluacion.respuestasEvidencia[fila.id]?.[evidencia.id]?.respuesta
      return suma + (respuesta === null || respuesta === undefined ? 0 : pesoRespuesta[respuesta])
    }, 0) / evidencias.length
    return { id: fila.control, filaId: fila.id, puntuacion: (nivel / 4) * calidadEvidencia }
  })
}

export function puntuacionSalud(evaluacion: Evaluacion): number {
  const puntuaciones = puntuacionesControles(evaluacion)
  return puntuaciones.reduce((suma, control) => suma + control.puntuacion, 0) / puntuaciones.length
}

export function saludDePuntuacion(puntuacion: number): Salud {
  if (puntuacion >= 0.75) return 'Verde'
  if (puntuacion >= 0.5) return 'Amarillo'
  return 'Rojo'
}

export function formatoPuntuacion(puntuacion: number): string {
  return new Intl.NumberFormat('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(puntuacion)
}
