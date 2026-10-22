import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { bandaDeRiesgo, escalaImpacto, escalaProbabilidad } from '../data/catalogo/escalas'
import type { Riesgo } from '../data/tipos'
import { valorarRiesgo, type Valoracion } from '../estado/calculos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { useIndice } from '../estado/fuente'
import { useNivelDe } from '../estado/useNivelDe'
import { BandaRiesgo } from './BandaRiesgo'
import { ComponenteTabular, type ColumnaTabular } from './ComponenteTabular'
import { LamparaEstado } from './Lampara'
import estilos from './PanelRiesgos.module.css'

type Vista = 'inherente' | 'residual'

type FilaRiesgo = { riesgo: Riesgo; valoracion: Valoracion }

const escala = [1, 2, 3, 4, 5] as const
const separacionMinima = 0.46

export function PanelRiesgos({ nivelTitulo = 2 }: { nivelTitulo?: 2 | 3 }) {
  const { abrirReferencia } = useEvaluacion()
  const indice = useIndice()
  const nivelDe = useNivelDe()
  const Encabezado = nivelTitulo === 2 ? 'h2' : 'h3'
  const reducir = useReducedMotion() ?? false
  const [vista, setVista] = useState<Vista>('inherente')
  const [enfocado, setEnfocado] = useState<string | null>(null)


  const filas: FilaRiesgo[] = indice.riesgos.map((riesgo) => ({
    riesgo,
    valoracion: valorarRiesgo(
      riesgo,
      indice.filasDeRiesgo(riesgo.id).map((fila) => fila.id),
      nivelDe,
    ),
  }))

  const columnas: ColumnaTabular<FilaRiesgo>[] = [
    { clave: 'id', encabezado: 'ID', celda: ({ riesgo }) => <span className={estilos.id}>{riesgo.id}</span> },
    { clave: 'riesgo', encabezado: 'Riesgo', celda: ({ riesgo }) => <span className={estilos.nombre}>{riesgo.nombre}</span> },
    {
      clave: 'impacto',
      encabezado: 'Impacto',
      celda: ({ riesgo }) => (
        <span className={estilos.escala}>
          <span className={estilos.valor}>{riesgo.impacto}</span>
          {escalaImpacto[riesgo.impacto - 1]?.nombre}
        </span>
      ),
    },
    {
      clave: 'probabilidad',
      encabezado: 'Probabilidad',
      celda: ({ riesgo }) => (
        <span className={estilos.escala}>
          <span className={estilos.valor}>{riesgo.probabilidad}</span>
          {escalaProbabilidad[riesgo.probabilidad - 1]?.nombre}
        </span>
      ),
    },
    { clave: 'inherente', encabezado: 'Inherente', celda: ({ valoracion }) => <BandaRiesgo puntaje={valoracion.inherente} /> },
    { clave: 'residual', encabezado: 'Residual', celda: ({ valoracion }) => <BandaRiesgo puntaje={valoracion.residual} /> },
  ]

  const puntos = filas.flatMap(({ riesgo, valoracion }) => {
    const probabilidad = vista === 'inherente' ? riesgo.probabilidad : valoracion.residual === null ? null : valoracion.residual / riesgo.impacto
    return probabilidad === null ? [] : [{ riesgo, probabilidad }]
  })
  const sinResidual = filas.filter(({ valoracion }) => valoracion.residual === null)

  const ajustada = new Map<string, number>()
  escala.forEach((impacto) => {
    const fila = puntos.filter(({ riesgo }) => riesgo.impacto === impacto).sort((a, b) => a.probabilidad - b.probabilidad)
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
      const centro = originales.reduce<number>((suma, valor) => suma + valor, 0) / originales.length
      ids.forEach((id, posicion) => ajustada.set(id, centro + (posicion - (ids.length - 1) / 2) * separacionMinima))
    })
  })

  return (
    <>
      <ComponenteTabular
        etiqueta="Riesgos de confidencialidad con su impacto, probabilidad y valoración inherente y residual"
        columnas={columnas}
        filas={filas}
        idDe={({ riesgo }) => riesgo.id}
        nombreDe={({ riesgo }) => riesgo.nombre}
        alSeleccionar={abrirReferencia}
        vacio="No hay riesgos para mostrar."
      />

      <section className={estilos.mapa} aria-labelledby="titulo-mapa">
        <div className={estilos.cabezaMapa}>
          <Encabezado id="titulo-mapa" className={estilos.subtitulo}>
            Mapa de calor
          </Encabezado>
          <div className={estilos.conmutador} role="radiogroup" aria-label="Valoración que se muestra">
            {(['inherente', 'residual'] as const).map((opcion) => (
              <button
                key={opcion}
                type="button"
                role="radio"
                aria-checked={vista === opcion}
                className="pulsador"
                onClick={() => setVista(opcion)}
              >
                {opcion === 'inherente' ? 'Inherente' : 'Residual'}
              </button>
            ))}
          </div>
        </div>

        <div className={estilos.composicion}>
          <figure className={estilos.figura}>
            <div className={estilos.rejilla}>
              <span className={`rotulo ${estilos.ejeY}`}>Impacto</span>
              <div className={estilos.etiquetasY} aria-hidden="true">
                {[...escala].reverse().map((valor) => (
                  <span key={valor}>{valor}</span>
                ))}
              </div>
              <div className={estilos.plano}>
                {[...escala].reverse().map((impacto) =>
                  escala.map((probabilidad) => {
                    const banda = bandaDeRiesgo(impacto * probabilidad)
                    return (
                      <span key={`${impacto}-${probabilidad}`} className={estilos.celda} data-banda={banda} aria-hidden="true">
                        <span className={estilos.letraBanda}>{banda.charAt(0)}</span>
                        {impacto * probabilidad}
                      </span>
                    )
                  }),
                )}
                {puntos.map(({ riesgo, probabilidad }) => {
                  const valor = Math.min(Math.max(ajustada.get(riesgo.id) ?? probabilidad, 0.65), 5.35)
                  return (
                    <motion.button
                      key={riesgo.id}
                      type="button"
                      layout={!reducir}
                      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                      className={estilos.punto}
                      data-enfocado={enfocado === riesgo.id || undefined}
                      style={{ left: `${((valor - 0.5) / 5) * 100}%`, top: `${((5 - riesgo.impacto + 0.5) / 5) * 100}%` }}
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
              <span className={`rotulo ${estilos.ejeX}`}>Probabilidad</span>
            </div>
            <figcaption className={estilos.leyenda}>
              {vista === 'inherente'
                ? 'Posición según impacto y probabilidad antes de considerar los controles.'
                : 'Posición equivalente del riesgo residual: el impacto se mantiene y la probabilidad baja con la cobertura de los controles.'}
              {vista === 'residual' && sinResidual.length > 0 && (
                <span className={estilos.aviso}>
                  Sin evaluar en la matriz: {sinResidual.map(({ riesgo }) => riesgo.id).join(', ')}.
                </span>
              )}
            </figcaption>
          </figure>

          <div className={estilos.escalas}>
            <table className={estilos.tablaEscala}>
              <caption className="rotulo">Escala de impacto sobre la confidencialidad</caption>
              <tbody>
                {escalaImpacto.map((nivel) => (
                  <tr key={nivel.valor}>
                    <th scope="row">{nivel.valor}</th>
                    <td className={estilos.nombreEscala}>{nivel.nombre}</td>
                    <td>{nivel.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className={estilos.tablaEscala}>
              <caption className="rotulo">Escala de probabilidad</caption>
              <tbody>
                {escalaProbabilidad.map((nivel) => (
                  <tr key={nivel.valor}>
                    <th scope="row">{nivel.valor}</th>
                    <td className={estilos.nombreEscala}>{nivel.nombre}</td>
                    <td>{nivel.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={estilos.bandas}>
              <p className="rotulo">Bandas por puntaje I × P</p>
              <ul className={estilos.listaBandas}>
                {(
                  [
                    ['Bajo', '1 a 4'],
                    ['Medio', '5 a 9'],
                    ['Alto', '10 a 14'],
                    ['Crítico', '15 a 25'],
                  ] as const
                ).map(([banda, rango]) => (
                  <li key={banda}>
                    <span className={estilos.chipBanda}>{banda.charAt(0)}</span>
                    <LamparaEstado valor={banda} /> {rango}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
