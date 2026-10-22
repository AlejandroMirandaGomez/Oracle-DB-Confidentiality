import { bandaDeRiesgo } from '../data/catalogo/escalas'
import { formatoDecimal } from '../estado/calculos'
import estilos from './BandaRiesgo.module.css'
import { LamparaEstado } from './Lampara'

export function BandaRiesgo({ puntaje }: { puntaje: number | null }) {
  if (puntaje === null) return <LamparaEstado valor="Sin evaluar" className={estilos.banda} />
  const banda = bandaDeRiesgo(puntaje)
  return <LamparaEstado valor={banda} texto={`${formatoDecimal(puntaje)} ${banda}`} className={estilos.banda} />
}
