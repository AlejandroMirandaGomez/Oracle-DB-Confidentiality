import { nivelesMadurez } from '../data/catalogo/escalas'
import { modeloDeControl } from '../data/catalogo/madurez'
import type { NivelEvaluado } from '../data/tipos'
import { useIndice } from '../estado/fuente'
import estilos from './DescripcionNivel.module.css'
import { TextosNivel } from './TextosNivel'

type Props = {
  control: string
  nivel: NivelEvaluado
}

export function DescripcionNivel({ control: idControl, nivel }: Props) {
  const control = useIndice().buscarControl(idControl)
  if (!control) return null
  if (nivel === null) {
    return (
      <p className={estilos.vacio} aria-live="polite">
        Elija un nivel para ver qué significa en {control.id}.
      </p>
    )
  }
  const modelo = modeloDeControl(control)
  const nombre = nivelesMadurez[nivel]?.nombre
  return (
    <div className={estilos.descripcion} aria-live="polite">
      <p className={estilos.titulo}>
        Nivel {nivel}, {nombre}, en {control.id}
      </p>
      <p className={estilos.modelo}>
        Modelo COBIT 4.1 {modelo.id}: {modelo.nombre}
      </p>
      <TextosNivel textos={modelo.niveles[nivel]} />
    </div>
  )
}
