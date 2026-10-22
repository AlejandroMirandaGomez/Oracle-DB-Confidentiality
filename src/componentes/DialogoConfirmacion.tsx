import { useEffect, useId, useRef, type ReactNode } from 'react'
import estilos from './DialogoConfirmacion.module.css'

type Props = {
  abierto: boolean
  aviso: string
  titulo: string
  etiquetaConfirmar: string
  alConfirmar: () => void
  alCancelar: () => void
  children: ReactNode
}

export function DialogoConfirmacion({ abierto, aviso, titulo, etiquetaConfirmar, alConfirmar, alCancelar, children }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const idTitulo = useId()

  useEffect(() => {
    const elemento = dialogo.current
    if (!elemento) return
    if (abierto && !elemento.open) elemento.showModal()
    if (!abierto && elemento.open) elemento.close()
  }, [abierto])

  return (
    <dialog
      ref={dialogo}
      className={estilos.dialogo}
      aria-labelledby={idTitulo}
      onCancel={(evento) => {
        evento.preventDefault()
        alCancelar()
      }}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) alCancelar()
      }}
    >
      <p className={`rotulo ${estilos.aviso}`}>{aviso}</p>
      <div className={estilos.contenido}>
        <h2 id={idTitulo} className={estilos.titulo}>
          {titulo}
        </h2>
        <div className={estilos.mensaje}>{children}</div>
        <div className={estilos.acciones}>
          <button type="button" className="pulsador" autoFocus onClick={alCancelar}>
            Cancelar
          </button>
          <button type="button" className="pulsador" data-principal="" onClick={alConfirmar}>
            {etiquetaConfirmar}
          </button>
        </div>
      </div>
    </dialog>
  )
}
