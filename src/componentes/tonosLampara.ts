import type { BandaRiesgo, Estado, Prioridad, RespuestaEvidencia, Veredicto } from '../data/tipos'

export type Tono = 'verde' | 'ambar' | 'roja' | 'blanca' | 'apagada'

export type ValorLampara = Estado | Veredicto | RespuestaEvidencia | Prioridad | BandaRiesgo | 'Sin documentar'

export const tonoDeValor: Record<ValorLampara, Tono> = {
  Cumple: 'verde',
  Conforme: 'verde',
  Sí: 'verde',
  Bajo: 'verde',
  Parcial: 'ambar',
  Medio: 'ambar',
  Media: 'ambar',
  'No cumple': 'roja',
  'No conforme': 'roja',
  No: 'roja',
  Alto: 'roja',
  Crítico: 'roja',
  Alta: 'roja',
  'Sin evaluar': 'apagada',
  'Sin documentar': 'apagada',
  Baja: 'apagada',
}
