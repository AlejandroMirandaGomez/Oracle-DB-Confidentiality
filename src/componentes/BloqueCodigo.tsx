import { CheckIcon, CopySimpleIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import estilos from './BloqueCodigo.module.css'

type Props = {
  codigo: string
  titulo?: string
  variante?: 'sql' | 'listado'
}

export function BloqueCodigo({ codigo, titulo, variante = 'sql' }: Props) {
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (!copiado) return
    const temporizador = window.setTimeout(() => setCopiado(false), 1600)
    return () => window.clearTimeout(temporizador)
  }, [copiado])

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <figure className={estilos.bloque} data-variante={variante}>
      <figcaption className={estilos.barra}>
        <span className={estilos.titulo}>{titulo ?? (variante === 'sql' ? 'SQL' : 'Salida')}</span>
        <button type="button" className={estilos.copiar} onClick={copiar} aria-live="polite">
          {copiado ? <CheckIcon weight="bold" aria-hidden="true" /> : <CopySimpleIcon aria-hidden="true" />}
          <span>{copiado ? 'Copiado' : 'Copiar'}</span>
        </button>
      </figcaption>
      <pre className={estilos.pre} tabIndex={0}>
        <code>{codigo}</code>
      </pre>
    </figure>
  )
}
