import type { Nivel, RespuestaEvidencia } from '../data/tipos'

export function nivelSugerido(respuestas: (RespuestaEvidencia | null)[]): Nivel | null {
  const dadas = respuestas.filter((respuesta): respuesta is RespuestaEvidencia => respuesta !== null)
  if (dadas.length === 0) return null
  if (dadas.length === respuestas.length && dadas.every((respuesta) => respuesta === 'No')) return 0
  if (!dadas.includes('Sí')) return 1
  if (dadas.length === respuestas.length && dadas.every((respuesta) => respuesta === 'Sí')) return 3
  return 2
}
