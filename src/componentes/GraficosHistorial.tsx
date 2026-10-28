import { Fragment, useState } from 'react'
import { CaretDownIcon, CaretRightIcon, CaretUpIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { controles } from '../data/catalogo/controles'
import { matriz } from '../data/catalogo/matriz'
import type { EvaluacionGuardada } from '../estado/historial'
import { formatoPuntuacion, puntuacionesControles, puntuacionSalud, saludDePuntuacion } from '../estado/puntuaciones'
import { GraficoEvolucion, LeyendaPuntuacion } from './GraficoEvolucion'
import estilos from './GraficosHistorial.module.css'

const fechaHora = new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' })

function claveOrganizacion(registro: EvaluacionGuardada): string {
  return registro.evaluacion.organizacion.trim().toLocaleLowerCase('es')
}

function GraficoControles({ registros }: { registros: EvaluacionGuardada[] }) {
  const [controlesAbiertos, setControlesAbiertos] = useState<Set<string>>(() => new Set())
  const columnas = registros.map((registro) => ({ registro, puntuaciones: new Map(puntuacionesControles(registro.evaluacion).map((control) => [control.id, control.puntuacion])) }))
  const nombres = new Map(controles.map((control) => [control.id, control.nombre]))
  const todosAbiertos = matriz.every((fila) => controlesAbiertos.has(fila.control))
  const todosCerrados = controlesAbiertos.size === 0
  const alternarControl = (id: string) => setControlesAbiertos((actual) => {
    const siguientes = new Set(actual)
    if (siguientes.has(id)) siguientes.delete(id)
    else siguientes.add(id)
    return siguientes
  })

  return (
    <>
    <div className={estilos.accionesMapa}>
      <button type="button" className="pulsador" onClick={() => setControlesAbiertos(todosAbiertos ? new Set() : new Set(matriz.map((fila) => fila.control)))}>
        {todosAbiertos ? <CaretUpIcon aria-hidden="true" /> : todosCerrados ? <CaretDownIcon aria-hidden="true" /> : <CaretRightIcon aria-hidden="true" />}
        {todosAbiertos ? 'Contraer todos' : 'Expandir todos'}
      </button>
    </div>
    <div className={estilos.escalaHorizontal}>
      <table className={estilos.mapa}>
        <caption className="solo-lectores">Puntuación de cada control observable en cada evaluación, ordenada por fecha</caption>
        <thead>
          <tr>
            <th scope="col">Control observable</th>
            {columnas.map(({ registro }) => (
              <th key={registro.id} scope="col">
                <Link to={`/historial/${registro.id}`}>{fechaHora.format(new Date(registro.fechaGuardado))}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matriz.map((fila) => {
            const abierto = controlesAbiertos.has(fila.control)
            const nombre = nombres.get(fila.control) ?? fila.control
            return (
              <Fragment key={fila.control}>
                <tr className={estilos.filaControl} data-abierto={abierto || undefined} onClick={() => alternarControl(fila.control)}>
                  <th scope="row">
                    <button type="button" className={estilos.abrirControl} aria-expanded={abierto} aria-controls={`progresion-${fila.id}`}>
                      <span className={estilos.etiquetaControl}>
                        <span className={estilos.idControl}>{fila.control}</span>
                        <span className={estilos.nombreControl}>{nombre}</span>
                      </span>
                      <CaretRightIcon className={estilos.iconoControl} aria-hidden="true" />
                    </button>
                  </th>
                  {columnas.map(({ registro, puntuaciones }, indice) => {
                    const valor = puntuaciones.get(fila.control) ?? 0
                    const previo = columnas[indice - 1]?.puntuaciones.get(fila.control)
                    const cambio = previo === undefined ? null : valor - previo
                    const salud = saludDePuntuacion(valor)
                    return (
                      <td key={registro.id} data-salud={salud}>
                        <span className={estilos.puntuacion}>{formatoPuntuacion(valor)}</span>
                        {cambio !== null && <span className={estilos.variacion}>{cambio > 0 ? '+' : cambio < 0 ? '−' : ''}{formatoPuntuacion(Math.abs(cambio))}</span>}
                      </td>
                    )
                  })}
                </tr>
                {abierto && (
                  <tr className={estilos.filaProgresion}>
                    <td colSpan={columnas.length + 1}>
                      <div id={`progresion-${fila.id}`} className={estilos.detalleControl}>
                        <div className={estilos.cabeceraDetalle}>
                          <h3>Progresión de {fila.control}: {nombre}</h3>
                          <p>Puntuación de 0 a 1 en cada evaluación, de la más antigua a la más reciente.</p>
                        </div>
                        <GraficoEvolucion
                          puntos={columnas.map(({ registro, puntuaciones }) => ({ id: registro.id, fecha: registro.fechaGuardado, valor: puntuaciones.get(fila.control) ?? 0 }))}
                          etiqueta={`Progresión del control observable ${fila.control}: ${nombre}`}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
    </>
  )
}

export function GraficosHistorial({ historial, organizacionActual }: { historial: EvaluacionGuardada[]; organizacionActual: string }) {
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const organizaciones = Array.from(new Map(historial.map((registro) => [claveOrganizacion(registro), registro.evaluacion.organizacion.trim() || 'Organización sin nombre'])).entries())
  const clavePreferida = organizacionActual.trim().toLocaleLowerCase('es')
  const claveActual = seleccion !== null && organizaciones.some(([clave]) => clave === seleccion)
    ? seleccion
    : organizaciones.some(([clave]) => clave === clavePreferida) ? clavePreferida : organizaciones[0]?.[0]
  const registros = historial.filter((registro) => claveOrganizacion(registro) === claveActual).sort((a, b) => Date.parse(a.fechaGuardado) - Date.parse(b.fechaGuardado))

  return (
    <div className={estilos.conjunto}>
      {organizaciones.length > 1 && (
        <label className={estilos.selector}>
          <span>Mostrar evolución de</span>
          <select className="control-texto" value={claveActual} onChange={(evento) => setSeleccion(evento.target.value)}>
            {organizaciones.map(([clave, nombre]) => <option key={clave} value={clave}>{nombre}</option>)}
          </select>
        </label>
      )}

      <section className={estilos.seccion} aria-labelledby="grafico-salud">
        <div className={estilos.cabecera}>
          <h2 id="grafico-salud">Evolución de la salud</h2>
          <p>Promedio de las puntuaciones de los 18 controles de la matriz, en orden cronológico.</p>
        </div>
        {registros.length === 0
          ? <p className={estilos.vacio}>Guarde una evaluación para comenzar la gráfica de salud.</p>
          : <GraficoEvolucion puntos={registros.map((registro) => ({ id: registro.id, fecha: registro.fechaGuardado, valor: puntuacionSalud(registro.evaluacion) }))} etiqueta="Evolución cronológica de la puntuación de salud, de cero a uno" />}
        <LeyendaPuntuacion />
        {registros.length === 1 && <p className={estilos.nota}>Guarde una evaluación posterior de la misma organización para ver el cambio.</p>}
      </section>

      <section className={estilos.seccion} aria-labelledby="grafico-controles">
        <div className={estilos.cabecera}>
          <h2 id="grafico-controles">Evolución de los controles observables</h2>
          <p>Cada celda muestra la puntuación de 0 a 1 del control en esa evaluación; debajo aparece el cambio frente al guardado anterior. Toque una fila para ver su progresión.</p>
        </div>
        {registros.length === 0 ? <p className={estilos.vacio}>Guarde una evaluación para comenzar la gráfica de controles observables.</p> : <GraficoControles registros={registros} />}
        <p className={estilos.nota}>Puntuación = (nivel de madurez ÷ 4) × promedio de evidencias. Sí vale 1, Parcial 0,5, y No o sin responder 0.</p>
      </section>
    </div>
  )
}
