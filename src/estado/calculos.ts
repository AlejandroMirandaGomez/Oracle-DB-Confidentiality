import { bandaDeRiesgo, estadoDeNivel, factorReduccionMaximo, type BandaRiesgo } from '../data/legajo'
import { matrizInicial } from '../data/matriz'
import { pruebas } from '../data/pruebas'
import type { Estado, Nivel, Riesgo, Veredicto } from '../data/tipos'
import { filasDeRiesgo } from './indice'

export type Valoracion = {
  inherente: number
  bandaInherente: BandaRiesgo
  cobertura: number
  residual: number
  bandaResidual: BandaRiesgo
}

export function valorarRiesgo(riesgo: Riesgo, nivelDe: (filaId: string) => Nivel): Valoracion {
  const inherente = riesgo.impacto * riesgo.probabilidad
  const filas = filasDeRiesgo(riesgo.id)
  const cobertura = filas.length === 0 ? 0 : filas.reduce((suma, fila) => suma + nivelDe(fila.id), 0) / (filas.length * 4)
  const residual = Math.round(inherente * (1 - factorReduccionMaximo * cobertura) * 10) / 10
  return {
    inherente,
    bandaInherente: bandaDeRiesgo(inherente),
    cobertura,
    residual,
    bandaResidual: bandaDeRiesgo(residual),
  }
}

export function conteoDeEstados(filaIds: string[], nivelDe: (filaId: string) => Nivel): Record<Estado, number> {
  const conteo: Record<Estado, number> = { Cumple: 0, Parcial: 0, 'No cumple': 0 }
  filaIds.forEach((id) => {
    conteo[estadoDeNivel(nivelDe(id))] += 1
  })
  return conteo
}

export function conteoDeMatriz(nivelDe: (filaId: string) => Nivel): Record<Estado, number> {
  return conteoDeEstados(
    matrizInicial.map((fila) => fila.id),
    nivelDe,
  )
}

export function madurezPromedio(nivelDe: (filaId: string) => Nivel): number {
  const suma = matrizInicial.reduce((total, fila) => total + nivelDe(fila.id), 0)
  return Math.round((suma / matrizInicial.length) * 100) / 100
}

export function conteoDeVeredictos(): Record<Veredicto, number> {
  const conteo: Record<Veredicto, number> = { Conforme: 0, Parcial: 0, 'No conforme': 0 }
  pruebas.forEach((prueba) => {
    conteo[prueba.veredicto] += 1
  })
  return conteo
}

export function formatoDecimal(valor: number): string {
  return new Intl.NumberFormat('es-CR', { maximumFractionDigits: 1 }).format(valor)
}
