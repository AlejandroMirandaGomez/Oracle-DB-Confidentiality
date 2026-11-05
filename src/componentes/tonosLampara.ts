import type { BandaRiesgo, Estado, Prioridad, Veredicto } from '../data/tipos'

export type Tono = 'verde' | 'ambar' | 'roja' | 'blanca' | 'apagada'

export type ValorLampara = Estado | Veredicto | Prioridad | BandaRiesgo | 'Sin documentar'

export const tonoDeValor: Record<ValorLampara, Tono> = {
  Cumple: 'verde',
  Conforme: 'verde',
  Bajo: 'verde',
  Parcial: 'ambar',
  Medio: 'ambar',
  Media: 'ambar',
  'No cumple': 'roja',
  'No conforme': 'roja',
  Alto: 'roja',
  Crítico: 'roja',
  Alta: 'roja',
  'Sin evaluar': 'apagada',
  'Sin documentar': 'apagada',
  Baja: 'apagada',
}
