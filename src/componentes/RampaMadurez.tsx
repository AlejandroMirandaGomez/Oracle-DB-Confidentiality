import { nivelesMadurez } from '../data/catalogo/escalas'
import type { NivelEvaluado } from '../data/tipos'
import estilos from './RampaMadurez.module.css'

type Props = {
  nivel: NivelEvaluado
  conNombre?: boolean
}

export function RampaMadurez({ nivel, conNombre = false }: Props) {
  if (nivel === null) {
    return (
      <span className={estilos.celda} data-nivel="sin">
        Sin evaluar
      </span>
    )
  }
  const descripcion = nivelesMadurez[nivel]
  return (
    <span className={estilos.celda} data-nivel={nivel}>
      <span className={estilos.numero}>{nivel}</span>
      {conNombre && descripcion && <span className={estilos.nombre}>{descripcion.nombre}</span>}
    </span>
  )
}
