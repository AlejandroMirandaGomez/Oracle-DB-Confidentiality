import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { BandaPuntaje } from '../componentes/BandaPuntaje'
import { Papel } from '../componentes/Papel'
import { ListaRefs } from '../componentes/Ref'
import { bandaDeRiesgo, escalaImpacto, escalaProbabilidad } from '../data/legajo'
import { riesgos } from '../data/riesgos'
import { valorarRiesgo } from '../estado/calculos'
import { useLegajo } from '../estado/LegajoProvider'
import estilos from './PapelRiesgos.module.css'

type Vista = 'inherente' | 'residual'

const escala = [1, 2, 3, 4, 5] as const

export function PapelRiesgos() {
  const { nivelDe, abrirReferencia } = useLegajo()
  const reducir = useReducedMotion() ?? false
  const [vista, setVista] = useState<Vista>('inherente')
  const [enfocado, setEnfocado] = useState<string | null>(null)

  const puntos = riesgos.map((riesgo) => {
    const valoracion = valorarRiesgo(riesgo, nivelDe)
    const probabilidad = vista === 'inherente' ? riesgo.probabilidad : valoracion.residual / riesgo.impacto
    return { riesgo, valoracion, probabilidad }
  })

  const separacionMinima = 0.46
  const ajustada = new Map<string, number>()
  escala.forEach((impacto) => {
    const fila = puntos
      .filter(({ riesgo }) => riesgo.impacto === impacto)
      .sort((a, b) => a.probabilidad - b.probabilidad)
    const grupos: { ids: string[]; originales: number[] }[] = []
    fila.forEach(({ riesgo, probabilidad }) => {
      const ultimo = grupos.at(-1)
      const finUltimo = ultimo ? (ultimo.originales.at(-1) ?? 0) : -Infinity
      if (ultimo && probabilidad - finUltimo < separacionMinima) {
        ultimo.ids.push(riesgo.id)
        ultimo.originales.push(probabilidad)
      } else {
        grupos.push({ ids: [riesgo.id], originales: [probabilidad] })
      }
    })
    grupos.forEach(({ ids, originales }) => {
      const centro = originales.reduce((suma, valor) => suma + valor, 0) / originales.length
      ids.forEach((id, posicion) => ajustada.set(id, centro + (posicion - (ids.length - 1) / 2) * separacionMinima))
    })
  })
  const posiciones = puntos.map(({ riesgo, probabilidad }) => {
    const valor = Math.min(Math.max(ajustada.get(riesgo.id) ?? probabilidad, 0.65), 5.35)
    return {
      izquierda: ((valor - 0.5) / 5) * 100,
      arriba: ((5 - riesgo.impacto + 0.5) / 5) * 100,
    }
  })

  return (
    <Papel
      letra="A"
      titulo="Riesgos de confidencialidad R-CONF"
      objetivo="Cinco riesgos de confidencialidad de la instancia, valorados por impacto y probabilidad del 1 al 5. El riesgo residual se recalcula con la madurez de los controles de la matriz."
    >
      <div className={estilos.composicion}>
        <figure className={estilos.mapa}>
          <div className={estilos.conmutador} role="radiogroup" aria-label="Valoración que se muestra">
            {(['inherente', 'residual'] as const).map((opcion) => (
              <button
                key={opcion}
                type="button"
                role="radio"
                aria-checked={vista === opcion}
                className={estilos.opcion}
                data-activa={vista === opcion || undefined}
                onClick={() => setVista(opcion)}
              >
                {opcion === 'inherente' ? 'Inherente' : 'Residual'}
              </button>
            ))}
          </div>
          <div className={estilos.rejilla}>
            <span className={estilos.ejeY}>Impacto</span>
            <div className={estilos.etiquetasY} aria-hidden="true">
              {[...escala].reverse().map((valor) => (
                <span key={valor}>{valor}</span>
              ))}
            </div>
            <div className={estilos.plano}>
              {[...escala].reverse().map((impacto) =>
                escala.map((probabilidad) => (
                  <span
                    key={`${impacto}-${probabilidad}`}
                    className={estilos.celda}
                    data-banda={bandaDeRiesgo(impacto * probabilidad)}
                    aria-hidden="true"
                  />
                )),
              )}
              {puntos.map(({ riesgo }, posicion) => {
                const ubicacion = posiciones[posicion]
                if (!ubicacion) return null
                return (
                  <motion.button
                    key={riesgo.id}
                    type="button"
                    layout={!reducir}
                    transition={{ type: 'spring', duration: 0.55, bounce: 0.15 }}
                    className={estilos.punto}
                    data-enfocado={enfocado === riesgo.id || undefined}
                    style={{
                      left: `${ubicacion.izquierda}%`,
                      top: `${ubicacion.arriba}%`,
                    }}
                    onMouseEnter={() => setEnfocado(riesgo.id)}
                    onMouseLeave={() => setEnfocado(null)}
                    onFocus={() => setEnfocado(riesgo.id)}
                    onBlur={() => setEnfocado(null)}
                    onClick={() => abrirReferencia(riesgo.id)}
                    aria-label={`${riesgo.id}: ${riesgo.nombre}`}
                  >
                    {riesgo.id.slice(-2)}
                  </motion.button>
                )
              })}
            </div>
            <div className={estilos.etiquetasX} aria-hidden="true">
              {escala.map((valor) => (
                <span key={valor}>{valor}</span>
              ))}
            </div>
            <span className={estilos.ejeX}>Probabilidad</span>
          </div>
          <figcaption className={estilos.leyenda}>
            {vista === 'inherente'
              ? 'Posición según impacto y probabilidad antes de considerar los controles.'
              : 'Posición equivalente del riesgo residual: el impacto se mantiene y la probabilidad baja con la cobertura de los controles.'}
          </figcaption>
        </figure>

        <ol className={estilos.registro}>
          {puntos.map(({ riesgo, valoracion }) => (
            <li key={riesgo.id} className={estilos.entrada} data-enfocado={enfocado === riesgo.id || undefined}>
              <button type="button" className={estilos.cabeza} onClick={() => abrirReferencia(riesgo.id)}>
                <span className={estilos.id}>{riesgo.id}</span>
                <span className={estilos.nombre}>{riesgo.nombre}</span>
              </button>
              <p className={estilos.descripcion}>{riesgo.descripcion}</p>
              <dl className={estilos.valores}>
                <div>
                  <dt>I × P</dt>
                  <dd className={estilos.mono}>
                    {riesgo.impacto} × {riesgo.probabilidad}
                  </dd>
                </div>
                <div>
                  <dt>Inherente</dt>
                  <dd>
                    <BandaPuntaje puntaje={valoracion.inherente} />
                  </dd>
                </div>
                <div>
                  <dt>Residual</dt>
                  <dd>
                    <BandaPuntaje puntaje={valoracion.residual} />
                  </dd>
                </div>
                <div>
                  <dt>Controles</dt>
                  <dd>
                    <ListaRefs ids={riesgo.controles} />
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>

      <div className={estilos.escalas}>
        <table className={estilos.escala}>
          <caption>Escala de impacto sobre la confidencialidad</caption>
          <tbody>
            {escalaImpacto.map((nivel) => (
              <tr key={nivel.valor}>
                <th scope="row">{nivel.valor}</th>
                <td className={estilos.escalaNombre}>{nivel.nombre}</td>
                <td>{nivel.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className={estilos.escala}>
          <caption>Escala de probabilidad</caption>
          <tbody>
            {escalaProbabilidad.map((nivel) => (
              <tr key={nivel.valor}>
                <th scope="row">{nivel.valor}</th>
                <td className={estilos.escalaNombre}>{nivel.nombre}</td>
                <td>{nivel.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={estilos.bandas}>
          Bandas por puntaje I × P: Bajo de 1 a 4, Medio de 5 a 9, Alto de 10 a 14 y Crítico de 15 a 25.
        </p>
      </div>
    </Papel>
  )
}
