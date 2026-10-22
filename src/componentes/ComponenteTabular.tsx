import { Fragment, type MouseEvent, type ReactNode } from 'react'
import estilos from './ComponenteTabular.module.css'

export type ColumnaTabular<T> = {
  clave: string
  encabezado: string
  alineacion?: 'izquierda' | 'derecha' | 'centro'
  celda: (fila: T) => ReactNode
}

export type GrupoTabular = {
  id: string
  titulo: string
  detalle?: string
}

type Props<T> = {
  etiqueta: string
  columnas: ColumnaTabular<T>[]
  filas: T[]
  idDe: (fila: T) => string
  nombreDe: (fila: T) => string
  alSeleccionar: (id: string) => void
  grupos?: GrupoTabular[]
  grupoDe?: (fila: T) => string
  vacio: string
}

const selectorInteractivo = 'button, a, input, select, textarea, label, summary'

export function ComponenteTabular<T>({ etiqueta, columnas, filas, idDe, nombreDe, alSeleccionar, grupos, grupoDe, vacio }: Props<T>) {
  if (filas.length === 0) return <p className={estilos.vacio}>{vacio}</p>

  function alHacerClic(evento: MouseEvent<HTMLTableRowElement>, id: string) {
    const interactivo = (evento.target as HTMLElement).closest(selectorInteractivo)
    if (interactivo && !interactivo.hasAttribute('data-primario')) return
    alSeleccionar(id)
  }

  function pintarFila(fila: T) {
    const id = idDe(fila)
    return (
      <tr key={id} className={estilos.fila} onClick={(evento) => alHacerClic(evento, id)}>
        {columnas.map((columna, posicion) => {
          const contenido = columna.celda(fila)
          if (posicion === 0) {
            return (
              <th key={columna.clave} scope="row" className={estilos.celda} data-alineacion={columna.alineacion} data-primera="">
                <button type="button" className={estilos.abrir} data-primario="" aria-label={`Abrir ${id}: ${nombreDe(fila)}`}>
                  {contenido}
                </button>
              </th>
            )
          }
          return (
            <td key={columna.clave} className={estilos.celda} data-etiqueta={columna.encabezado} data-alineacion={columna.alineacion}>
              {contenido}
            </td>
          )
        })}
      </tr>
    )
  }

  const gruposVisibles = grupos && grupoDe ? grupos.filter((grupo) => filas.some((fila) => grupoDe(fila) === grupo.id)) : null

  return (
    <div className={estilos.marco}>
      <table className={estilos.tabla}>
        <caption className="solo-lectores">{etiqueta}</caption>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave} scope="col" className={`rotulo ${estilos.encabezado}`} data-alineacion={columna.alineacion}>
                {columna.encabezado}
              </th>
            ))}
          </tr>
        </thead>
        {gruposVisibles && grupoDe ? (
          gruposVisibles.map((grupo) => (
            <Fragment key={grupo.id}>
              <tbody className={estilos.grupo}>
                <tr className={estilos.cabeceraGrupo}>
                  <th scope="colgroup" colSpan={columnas.length}>
                    <span className={estilos.tituloGrupo}>{grupo.titulo}</span>
                    {grupo.detalle && <span className={estilos.detalleGrupo}>{grupo.detalle}</span>}
                  </th>
                </tr>
                {filas.filter((fila) => grupoDe(fila) === grupo.id).map(pintarFila)}
              </tbody>
            </Fragment>
          ))
        ) : (
          <tbody>{filas.map(pintarFila)}</tbody>
        )}
      </table>
    </div>
  )
}
