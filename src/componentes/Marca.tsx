import { CheckIcon, CircleHalfTiltIcon, XIcon, type Icon } from '@phosphor-icons/react'
import type { Estado, Veredicto } from '../data/tipos'
import estilos from './Marca.module.css'

type Tipo = 'positivo' | 'parcial' | 'negativo'

const tipoDe: Record<Estado | Veredicto, Tipo> = {
  Cumple: 'positivo',
  Conforme: 'positivo',
  Parcial: 'parcial',
  'No cumple': 'negativo',
  'No conforme': 'negativo',
}

const iconoDe: Record<Tipo, Icon> = {
  positivo: CheckIcon,
  parcial: CircleHalfTiltIcon,
  negativo: XIcon,
}

type Props = {
  valor: Estado | Veredicto
  conTexto?: boolean
  estampar?: boolean
}

export function Marca({ valor, conTexto = true, estampar = false }: Props) {
  const tipo = tipoDe[valor]
  const Icono = iconoDe[tipo]
  return (
    <span className={estilos.marca} data-tipo={tipo} data-estampar={estampar || undefined} key={estampar ? valor : undefined}>
      <Icono className={estilos.icono} weight="bold" aria-hidden="true" />
      {conTexto ? <span className={estilos.texto}>{valor}</span> : <span className="solo-lectores">{valor}</span>}
    </span>
  )
}
