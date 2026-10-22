import { useRef, type KeyboardEvent } from 'react'
import { nivelesMadurez } from '../data/catalogo/escalas'
import type { NivelEvaluado } from '../data/tipos'
import { PistaNivel } from './PistaNivel'
import { RampaMadurez } from './RampaMadurez'
import estilos from './SelectorNivel.module.css'

type Props = {
  nivel: NivelEvaluado
  control: string
  etiqueta: string
  sugerido?: NivelEvaluado
  alCambiar?: (nivel: NivelEvaluado) => void
}

const opciones: NivelEvaluado[] = [0, 1, 2, 3, 4, null]

export function SelectorNivel({ nivel, control, etiqueta, sugerido = null, alCambiar }: Props) {
  const grupo = useRef<HTMLDivElement>(null)

  if (!alCambiar) return <RampaMadurez nivel={nivel} control={control} />

  function alPresionar(evento: KeyboardEvent<HTMLDivElement>) {
    const hacia = evento.key === 'ArrowRight' || evento.key === 'ArrowDown' ? 1 : evento.key === 'ArrowLeft' || evento.key === 'ArrowUp' ? -1 : 0
    if (hacia === 0 || !alCambiar) return
    evento.preventDefault()
    const actual = opciones.indexOf(nivel)
    const siguiente = opciones[(actual + hacia + opciones.length) % opciones.length]
    if (siguiente === undefined) return
    alCambiar(siguiente)
    const botones = grupo.current?.querySelectorAll<HTMLButtonElement>('button')
    botones?.[(actual + hacia + opciones.length) % opciones.length]?.focus()
  }

  return (
    <div ref={grupo} className={estilos.selector} role="radiogroup" aria-label={etiqueta} onKeyDown={alPresionar}>
      {opciones.map((valor) => {
        const activo = valor === nivel
        const esSugerido = sugerido !== null && valor === sugerido
        const nombre = valor === null ? 'Sin evaluar' : `${valor}: ${nivelesMadurez[valor]?.nombre ?? ''}`
        const etiquetaOpcion = esSugerido ? `${nombre}, nivel sugerido` : nombre
        const tabulable = activo || (nivel === null && valor === null)
        return (
          <PistaNivel key={valor ?? 'sin'} control={control} nivel={valor}>
            {(disparador) => (
              <button
                {...disparador}
                type="button"
                role="radio"
                aria-checked={activo}
                aria-label={etiquetaOpcion}
                tabIndex={tabulable ? 0 : -1}
                className={`pulsador ${estilos.opcion}`}
                data-nivel={valor ?? 'sin'}
                data-tono="nivel"
                data-sugerido={esSugerido ? true : undefined}
                onClick={() => alCambiar(valor)}
              >
                {valor === null ? 'Sin evaluar' : valor}
              </button>
            )}
          </PistaNivel>
        )
      })}
    </div>
  )
}
