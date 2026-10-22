import { bandaDeRiesgo, estadoDeNivel, factorReduccionMaximo } from '../data/catalogo/escalas'
import type { BandaRiesgo, Estado, Nivel, NivelEvaluado, Riesgo, Veredicto } from '../data/tipos'

export type Valoracion = {
  inherente: number
  bandaInherente: BandaRiesgo
  evaluadas: number
  total: number
  cobertura: number | null
  residual: number | null
  bandaResidual: BandaRiesgo | null
}

export type NivelDe = (filaId: string) => NivelEvaluado

export function valorarRiesgo(riesgo: Riesgo, filaIds: string[], nivelDe: NivelDe): Valoracion {
  const inherente = riesgo.impacto * riesgo.probabilidad
  const niveles = filaIds.flatMap((id): Nivel[] => {
    const nivel = nivelDe(id)
    return nivel === null ? [] : [nivel]
  })
  const base = { inherente, bandaInherente: bandaDeRiesgo(inherente), evaluadas: niveles.length, total: filaIds.length }
  if (niveles.length === 0) return { ...base, cobertura: null, residual: null, bandaResidual: null }
  const cobertura = niveles.reduce<number>((suma, nivel) => suma + nivel, 0) / (niveles.length * 4)
  const residual = Math.round(inherente * (1 - factorReduccionMaximo * cobertura) * 10) / 10
  return { ...base, cobertura, residual, bandaResidual: bandaDeRiesgo(residual) }
}

export function conteoDeEstados(filaIds: string[], nivelDe: NivelDe): Record<Estado, number> {
  const conteo: Record<Estado, number> = { Cumple: 0, Parcial: 0, 'No cumple': 0, 'Sin evaluar': 0 }
  filaIds.forEach((id) => {
    conteo[estadoDeNivel(nivelDe(id))] += 1
  })
  return conteo
}

export function madurezPromedio(filaIds: string[], nivelDe: NivelDe): number | null {
  const niveles = filaIds.flatMap((id): Nivel[] => {
    const nivel = nivelDe(id)
    return nivel === null ? [] : [nivel]
  })
  if (niveles.length === 0) return null
  return Math.round((niveles.reduce<number>((suma, nivel) => suma + nivel, 0) / niveles.length) * 100) / 100
}

export function conteoDeVeredictos(veredictos: Veredicto[]): Record<Veredicto, number> {
  const conteo: Record<Veredicto, number> = { Conforme: 0, Parcial: 0, 'No conforme': 0 }
  veredictos.forEach((veredicto) => {
    conteo[veredicto] += 1
  })
  return conteo
}

export function formatoDecimal(valor: number): string {
  return new Intl.NumberFormat('es-CR', { maximumFractionDigits: 1 }).format(valor)
}
