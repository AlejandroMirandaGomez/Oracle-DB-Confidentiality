import estilos from './Trama.module.css'

export type Densidad = 0 | 1 | 2 | 3 | 4

export function Trama({ densidad }: { densidad: Densidad }) {
  return <span className={estilos.trama} data-densidad={densidad} aria-hidden="true" />
}
