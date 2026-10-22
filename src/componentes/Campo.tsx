import type { ReactNode } from 'react'
import estilos from './Campo.module.css'

export function Campo({ etiqueta, children, ancho = false }: { etiqueta: string; children: ReactNode; ancho?: boolean }) {
  return (
    <div className={estilos.campo} data-ancho={ancho || undefined}>
      <h4 className={estilos.etiqueta}>{etiqueta}</h4>
      <div className={estilos.valor}>{children}</div>
    </div>
  )
}

export function Rejilla({ children }: { children: ReactNode }) {
  return <div className={estilos.rejilla}>{children}</div>
}
