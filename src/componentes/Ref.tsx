import { useContext, type CSSProperties } from 'react'
import { useLegajo } from '../estado/LegajoProvider'
import { buscarEntidad, nombreCorto } from '../estado/indice'
import { DentroDeHoja } from './contextoHoja'
import estilos from './Ref.module.css'

type Props = {
  id: string
  conNombre?: boolean
  resaltado?: boolean
  retardo?: number
}

export function Ref({ id, conNombre = false, resaltado = false, retardo = 0 }: Props) {
  const { abrirReferencia, seguirReferencia } = useLegajo()
  const enHoja = useContext(DentroDeHoja)
  const existe = buscarEntidad(id) !== undefined
  const nombre = nombreCorto(id)

  if (!existe) return <span className={estilos.ref}>{id}</span>

  const estilo = { '--retardo': `${retardo}ms` } as CSSProperties

  return (
    <button
      type="button"
      className={estilos.ref}
      data-resaltado={resaltado || undefined}
      style={estilo}
      onClick={() => (enHoja ? seguirReferencia(id) : abrirReferencia(id))}
      title={nombre}
      aria-label={`${id}: ${nombre}`}
    >
      <span className={estilos.codigo}>{id}</span>
      {conNombre && <span className={estilos.nombre}>{nombre}</span>}
      <svg className={estilos.trazo} viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
        <path d="M1 4.2 C 18 2.4, 34 5.1, 52 3.6 S 84 2.2, 99 3.9" pathLength={1} />
      </svg>
    </button>
  )
}

export function ListaRefs({ ids, resaltado = false, conNombre = false }: { ids: string[]; resaltado?: boolean; conNombre?: boolean }) {
  if (ids.length === 0) return <span className={estilos.vacio}>Sin referencias</span>
  return (
    <span className={conNombre ? estilos.listaApilada : estilos.lista}>
      {ids.map((id, posicion) => (
        <Ref key={id} id={id} resaltado={resaltado} retardo={posicion * 45} conNombre={conNombre} />
      ))}
    </span>
  )
}
