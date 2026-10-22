import { useEffect, useState, type ReactNode } from 'react'

type Props = {
  etiqueta: string
  etiquetaConfirmacion: string
  alConfirmar: () => void
  deshabilitado?: boolean
  icono?: ReactNode
}

export function BotonConfirmacion({ etiqueta, etiquetaConfirmacion, alConfirmar, deshabilitado = false, icono }: Props) {
  const [armado, setArmado] = useState(false)

  useEffect(() => {
    if (!armado) return
    const temporizador = window.setTimeout(() => setArmado(false), 4000)
    return () => window.clearTimeout(temporizador)
  }, [armado])

  function alPulsar() {
    if (!armado) {
      setArmado(true)
      return
    }
    setArmado(false)
    alConfirmar()
  }

  return (
    <button type="button" className="pulsador" data-principal={armado || undefined} disabled={deshabilitado} onClick={alPulsar} aria-live="polite">
      {icono}
      {armado ? etiquetaConfirmacion : etiqueta}
    </button>
  )
}
