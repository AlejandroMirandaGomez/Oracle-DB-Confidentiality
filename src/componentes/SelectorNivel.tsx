import { nivelesMadurez } from '../data/legajo'
import type { Nivel } from '../data/tipos'
import estilos from './SelectorNivel.module.css'

type Props = {
  nivel: Nivel
  original: Nivel
  etiqueta: string
  alCambiar?: (nivel: Nivel) => void
}

export function SelectorNivel({ nivel, original, etiqueta, alCambiar }: Props) {
  const editable = alCambiar !== undefined
  return (
    <div className={estilos.selector} role="radiogroup" aria-label={etiqueta}>
      {nivelesMadurez.map(({ nivel: valor, nombre }) => {
        const activo = valor === nivel
        return (
          <button
            key={valor}
            type="button"
            role="radio"
            aria-checked={activo}
            disabled={!editable}
            className={estilos.opcion}
            data-activo={activo || undefined}
            data-original={valor === original && valor !== nivel ? true : undefined}
            title={`${valor}: ${nombre}`}
            onClick={() => alCambiar?.(valor)}
          >
            <span className={estilos.numero}>{valor}</span>
            <svg className={estilos.circulo} viewBox="0 0 40 32" aria-hidden="true">
              <path d="M21 3.5 C 31 3, 37.5 9, 36.5 16.5 C 35.5 25, 27 29.5, 18.5 28.8 C 9 28, 3 22.5, 3.6 15.2 C 4.3 7.8, 11.5 3.2, 23.5 4.8" pathLength={1} />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
