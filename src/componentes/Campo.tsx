import type { ReactNode } from 'react'
import estilos from './Campo.module.css'

export function Campo({ etiqueta, children, ancho = false }: { etiqueta: string; children: ReactNode; ancho?: boolean }) {
  return (
    <div className={estilos.campo} data-ancho={ancho || undefined}>
      <dt className={`rotulo ${estilos.etiqueta}`}>{etiqueta}</dt>
      <dd className={estilos.valor}>{children}</dd>
    </div>
  )
}

export function Rejilla({ children }: { children: ReactNode }) {
  return <dl className={estilos.rejilla}>{children}</dl>
}
