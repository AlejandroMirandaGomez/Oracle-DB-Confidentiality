import { useEffect, type ReactNode } from 'react'
import { proyecto } from '../data/catalogo/proyecto'
import estilos from './Pagina.module.css'

type Props = {
  titulo: string
  introduccion?: string
  acciones?: ReactNode
  ancha?: boolean
  children: ReactNode
}

export function Pagina({ titulo, introduccion, acciones, ancha = false, children }: Props) {
  useEffect(() => {
    document.title = `${titulo} · ${proyecto.nombreCorto}`
  }, [titulo])

  return (
    <div className={estilos.pagina} data-ancha={ancha || undefined}>
      <header className={estilos.cabecera}>
        <div className={estilos.titulos}>
          <h1 className={estilos.titulo}>{titulo}</h1>
          {introduccion && <p className={estilos.introduccion}>{introduccion}</p>}
        </div>
        {acciones && <div className={estilos.acciones}>{acciones}</div>}
      </header>
      <div className={estilos.cuerpo}>{children}</div>
    </div>
  )
}
