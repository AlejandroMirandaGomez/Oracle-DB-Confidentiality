import { useContext } from 'react'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { useIndice } from '../estado/fuente'
import { DentroDeHoja } from './contextoHoja'
import estilos from './Ref.module.css'

type Props = {
  id: string
  conNombre?: boolean
  resaltado?: boolean
}

export function Ref({ id, conNombre = false, resaltado = false }: Props) {
  const { abrirReferencia, seguirReferencia } = useEvaluacion()
  const indice = useIndice()
  const enHoja = useContext(DentroDeHoja)
  const existe = indice.buscar(id) !== undefined
  const nombre = indice.nombreCorto(id)

  if (!existe) return <span className={estilos.codigo}>{id}</span>

  return (
    <button
      type="button"
      className={estilos.ref}
      data-resaltado={resaltado || undefined}
      onClick={() => (enHoja ? seguirReferencia(id) : abrirReferencia(id))}
      title={nombre}
      aria-label={`${id}: ${nombre}`}
    >
      <span className={estilos.codigo}>{id}</span>
      {conNombre && <span className={estilos.nombre}>{nombre}</span>}
    </button>
  )
}

export function ListaRefs({ ids, resaltado = false, conNombre = false }: { ids: string[]; resaltado?: boolean; conNombre?: boolean }) {
  if (ids.length === 0) return <span className={estilos.vacio}>Sin referencias</span>
  return (
    <span className={conNombre ? estilos.listaApilada : estilos.lista}>
      {ids.map((id) => (
        <Ref key={id} id={id} resaltado={resaltado} conNombre={conNombre} />
      ))}
    </span>
  )
}
