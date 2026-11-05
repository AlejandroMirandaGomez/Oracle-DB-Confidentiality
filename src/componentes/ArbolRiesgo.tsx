import type { CSSProperties } from 'react'
import { matriz } from '../data/catalogo/matriz'
import { riesgos } from '../data/catalogo/riesgos'
import type { EvidenciaRequerida } from '../data/tipos'
import estilos from './ArbolRiesgo.module.css'

const nombreCorto: Record<string, string> = {
  'R-CONF-01': 'Privilegios excesivos y cuentas compartidas',
  'R-CONF-02': 'Autenticación débil, red sin cifrar y motor sin parches',
  'R-CONF-03': 'Datos expuestos en reposo y en respaldos',
  'R-CONF-04': 'Datos personales visibles sin necesidad',
  'R-CONF-05': 'Actividad indebida sin detectar',
}

const lineasDeMuestra = 3

type EvidenciaDeControl = { control: string; evidencia: EvidenciaRequerida }

function evidenciasDeRiesgo(controlesDelRiesgo: string[]): EvidenciaDeControl[] {
  return controlesDelRiesgo.flatMap((control) => {
    const fila = matriz.find((item) => item.control === control)
    return fila ? [{ control, evidencia: fila.evidencia }] : []
  })
}

const ramas = riesgos.map((riesgo) => {
  const evidencias = evidenciasDeRiesgo(riesgo.controles)
  const muestra = evidencias.find((item) => !item.evidencia.consulta.codigo.startsWith('WITH')) ?? evidencias[0]
  return {
    id: riesgo.id,
    nombre: nombreCorto[riesgo.id] ?? riesgo.nombre,
    controles: riesgo.controles,
    totalEvidencias: evidencias.length,
    muestra: muestra
      ? {
          control: muestra.control,
          id: muestra.evidencia.id,
          codigo: muestra.evidencia.consulta.codigo.split('\n').slice(0, lineasDeMuestra).join('\n'),
        }
      : null,
  }
})

const posicionMedia = Math.floor(ramas.length / 2)

function posicionDeRama(indice: number): 'primero' | 'medio' | 'ultimo' | 'intermedio' {
  if (indice === 0) return 'primero'
  if (indice === ramas.length - 1) return 'ultimo'
  if (indice === posicionMedia) return 'medio'
  return 'intermedio'
}

function plural(cantidad: number, singular: string, pluralTexto: string) {
  return `${cantidad} ${cantidad === 1 ? singular : pluralTexto}`
}

export function ArbolRiesgo() {
  return (
    <figure className={estilos.arbol} style={{ '--ramas': ramas.length } as CSSProperties}>
      <figcaption className="solo-lectores">
        Un riesgo, Confidencialidad, tiene varios factores de riesgo. Cada factor se mitiga con uno o más controles, y cada control se verifica con una evidencia, que es una consulta SQL.
      </figcaption>

      <div className={estilos.rejilla}>
        <div className={`${estilos.cabecera} ${estilos.columnaRaiz}`}>
          <span className={estilos.cabeceraTitulo}>Riesgo</span>
          <span className={estilos.cabeceraApoyo}>Lo que se protege</span>
        </div>
        <div className={`${estilos.cabecera} ${estilos.columnaFactor}`}>
          <span className={estilos.cabeceraTitulo}>Factores de riesgo</span>
          <span className={estilos.cabeceraApoyo}>Cómo se puede perder</span>
        </div>
        <div className={`${estilos.cabecera} ${estilos.columnaControl}`}>
          <span className={estilos.cabeceraTitulo}>Controles</span>
          <span className={estilos.cabeceraApoyo}>1 o más por factor</span>
        </div>
        <div className={`${estilos.cabecera} ${estilos.columnaEvidencia}`}>
          <span className={estilos.cabeceraTitulo}>Evidencias SQL</span>
          <span className={estilos.cabeceraApoyo}>1 por control</span>
        </div>

        <div className={estilos.raiz}>
          <span className={estilos.etiquetaRaiz}>Riesgo</span>
          <strong className={estilos.nombreRaiz}>Confidencialidad</strong>
          <span className={estilos.detalleRaiz}>{plural(ramas.length, 'factor de riesgo', 'factores de riesgo')}</span>
        </div>

        <ol className={estilos.ramas} aria-label="Factores de riesgo de confidencialidad">
          {ramas.map((rama, indice) => (
            <li
              key={rama.id}
              className={estilos.rama}
              style={{ '--columna': indice + 2, '--orden': indice } as CSSProperties}
              data-posicion={posicionDeRama(indice)}
            >
              <span className={`${estilos.conector} ${estilos.conectorRaiz}`} aria-hidden="true" />

              <div className={`${estilos.nodo} ${estilos.factor}`}>
                <span className={estilos.nivel}>Factor de riesgo</span>
                <span className={estilos.identificador}>{rama.id}</span>
                <span className={estilos.nombre}>{rama.nombre}</span>
              </div>

              <span className={`${estilos.conector} ${estilos.conectorControles}`} aria-hidden="true">
                <span className={estilos.cardinalidad}>1 : N</span>
              </span>

              <div className={`${estilos.nodo} ${estilos.controles}`}>
                <span className={estilos.nivel}>Controles</span>
                <span className={estilos.cantidad}>{plural(rama.controles.length, 'control', 'controles')}</span>
                <ul className={estilos.fichas} aria-label={`Controles de ${rama.id}`}>
                  {rama.controles.map((control) => (
                    <li key={control} className={estilos.ficha}>
                      {control}
                    </li>
                  ))}
                </ul>
              </div>

              <span className={`${estilos.conector} ${estilos.conectorEvidencias}`} aria-hidden="true">
                <span className={estilos.cardinalidad}>1 : 1</span>
              </span>

              <div className={`${estilos.nodo} ${estilos.evidencia}`}>
                <span className={estilos.nivel}>Evidencias SQL</span>
                <span className={estilos.cantidad}>{plural(rama.totalEvidencias, 'evidencia', 'evidencias')}</span>
                {rama.muestra && (
                  <div className={estilos.muestra}>
                    <span className={estilos.origenMuestra}>
                      Ejemplo · {rama.muestra.control} · {rama.muestra.id}
                    </span>
                    <pre className={estilos.codigo}>
                      <code>{rama.muestra.codigo}</code>
                    </pre>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  )
}
