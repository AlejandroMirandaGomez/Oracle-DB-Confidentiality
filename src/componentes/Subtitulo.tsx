import { useContext, type ReactNode } from 'react'
import { DentroDeHoja } from './contextoHoja'
import estilos from './Subtitulo.module.css'

type Props = {
  id?: string
  menor?: boolean
  children: ReactNode
}

export function Subtitulo({ id, menor = false, children }: Props) {
  const enHoja = useContext(DentroDeHoja)
  const Etiqueta = menor ? (enHoja ? 'h4' : 'h3') : enHoja ? 'h3' : 'h2'
  return (
    <Etiqueta id={id} className={menor ? estilos.menor : estilos.subtitulo}>
      {children}
    </Etiqueta>
  )
}
