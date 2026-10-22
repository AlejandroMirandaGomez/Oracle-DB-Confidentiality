import { useId } from 'react'
import estilos from './BotoneraEstado.module.css'
import { PuntoLampara } from './Lampara'
import { tonoDeValor, type ValorLampara } from './tonosLampara'

type Props<T extends ValorLampara> = {
  etiqueta: string
  opciones: readonly T[]
  valor: T | null
  alCambiar: (valor: T | null) => void
  nota?: string
  alCambiarNota?: (nota: string) => void
  etiquetaNota?: string
}

export function BotoneraEstado<T extends ValorLampara>({ etiqueta, opciones, valor, alCambiar, nota, alCambiarNota, etiquetaNota = 'Nota' }: Props<T>) {
  const idNota = useId()
  return (
    <div className={estilos.botonera}>
      <div className={estilos.grupo} role="group" aria-label={etiqueta}>
        {opciones.map((opcion) => {
          const activa = opcion === valor
          const tono = tonoDeValor[opcion]
          return (
            <button
              key={opcion}
              type="button"
              className={`pulsador ${estilos.opcion}`}
              data-tono={tono}
              aria-pressed={activa}
              onClick={() => alCambiar(activa ? null : opcion)}
            >
              <PuntoLampara tono={activa ? 'blanca' : 'apagada'} />
              {opcion}
            </button>
          )
        })}
      </div>
      {alCambiarNota && (
        <div className={estilos.nota}>
          <label className="rotulo" htmlFor={idNota}>
            {etiquetaNota}
          </label>
          <textarea id={idNota} className="control-texto" rows={2} value={nota ?? ''} onChange={(evento) => alCambiarNota(evento.target.value)} />
        </div>
      )}
    </div>
  )
}
