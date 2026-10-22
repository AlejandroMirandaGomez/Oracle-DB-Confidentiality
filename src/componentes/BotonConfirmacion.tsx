import { useState, type ReactNode } from 'react'
import { DialogoConfirmacion } from './DialogoConfirmacion'

type Props = {
  etiqueta: string
  titulo: string
  etiquetaConfirmar: string
  alConfirmar: () => void
  deshabilitado?: boolean
  icono?: ReactNode
  children: ReactNode
}

export function BotonConfirmacion({ etiqueta, titulo, etiquetaConfirmar, alConfirmar, deshabilitado = false, icono, children }: Props) {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <button type="button" className="pulsador" disabled={deshabilitado} onClick={() => setAbierto(true)}>
        {icono}
        {etiqueta}
      </button>
      <DialogoConfirmacion
        abierto={abierto}
        aviso="Esta acción no se puede deshacer"
        titulo={titulo}
        etiquetaConfirmar={etiquetaConfirmar}
        alCancelar={() => setAbierto(false)}
        alConfirmar={() => {
          alConfirmar()
          setAbierto(false)
        }}
      >
        {children}
      </DialogoConfirmacion>
    </>
  )
}
