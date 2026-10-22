import { bandaDeRiesgo } from '../data/catalogo/escalas'
import { formatoDecimal } from '../estado/calculos'
import { LamparaEstado } from './Lampara'

export function BandaRiesgo({ puntaje }: { puntaje: number | null }) {
  if (puntaje === null) return <LamparaEstado valor="Sin evaluar" />
  const banda = bandaDeRiesgo(puntaje)
  return <LamparaEstado valor={banda} texto={`${formatoDecimal(puntaje)} ${banda}`} />
}
