import { bandaDeRiesgo, type BandaRiesgo } from '../data/legajo'
import { formatoDecimal } from '../estado/calculos'
import estilos from './BandaPuntaje.module.css'
import { Trama, type Densidad } from './Trama'

const densidadDeBanda: Record<BandaRiesgo, Densidad> = { Bajo: 1, Medio: 2, Alto: 3, Crítico: 4 }

export function BandaPuntaje({ puntaje }: { puntaje: number }) {
  const banda = bandaDeRiesgo(puntaje)
  return (
    <span className={estilos.banda} data-banda={banda}>
      <Trama densidad={densidadDeBanda[banda]} />
      <span className={estilos.puntaje}>{formatoDecimal(puntaje)}</span>
      <span className={estilos.nombre}>{banda}</span>
    </span>
  )
}
