import { useState } from 'react'
import { conteoDeEstados, valorarRiesgo } from '../estado/calculos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { useIndice } from '../estado/fuente'
import { useNivelDe } from '../estado/useNivelDe'
import { BandaRiesgo } from './BandaRiesgo'
import estilos from './CedulaTrazabilidad.module.css'
import { LamparaEstado } from './Lampara'
import { ListaRefs } from './Ref'

export function CedulaTrazabilidad() {
  const { abrirReferencia } = useEvaluacion()
  const indice = useIndice()
  const nivelDe = useNivelDe()
  const [activo, setActivo] = useState<string | null>(null)

  return (
    <div className={estilos.marco}>
      <table className={estilos.tabla}>
        <caption className="solo-lectores">Trazabilidad de los cinco riesgos de confidencialidad hacia sus tareas, controles, pruebas y matriz</caption>
        <thead>
          <tr>
            {['Riesgo', 'Inherente', 'Residual', 'Tareas', 'Controles observables', 'Pruebas', 'Matriz'].map((encabezado) => (
              <th key={encabezado} scope="col" className="rotulo">
                {encabezado}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {indice.riesgos.map((riesgo) => {
            const filaIds = indice.filasDeRiesgo(riesgo.id).map((fila) => fila.id)
            const valoracion = valorarRiesgo(riesgo, filaIds, nivelDe)
            const estados = conteoDeEstados(filaIds, nivelDe)
            const encendido = activo === riesgo.id
            return (
              <tr
                key={riesgo.id}
                className={estilos.fila}
                data-activo={encendido || undefined}
                data-atenuado={activo !== null && !encendido ? true : undefined}
                onMouseEnter={() => setActivo(riesgo.id)}
                onMouseLeave={() => setActivo(null)}
                onFocus={() => setActivo(riesgo.id)}
                onBlur={(evento) => {
                  if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) setActivo(null)
                }}
              >
                <th scope="row" className={estilos.riesgo}>
                  <button type="button" className={estilos.abrir} onClick={() => abrirReferencia(riesgo.id)}>
                    <span className={estilos.id}>{riesgo.id}</span>
                    <span className={estilos.nombre}>{riesgo.nombre}</span>
                  </button>
                </th>
                <td data-etiqueta="Inherente">
                  <BandaRiesgo puntaje={valoracion.inherente} />
                </td>
                <td data-etiqueta="Residual">
                  <BandaRiesgo puntaje={valoracion.residual} />
                </td>
                <td data-etiqueta="Tareas">
                  <ListaRefs ids={riesgo.tareas} resaltado={encendido} />
                </td>
                <td data-etiqueta="Controles observables">
                  <ListaRefs ids={riesgo.controles} resaltado={encendido} />
                </td>
                <td data-etiqueta="Pruebas">
                  <ListaRefs ids={indice.pruebasDeRiesgo(riesgo.id)} resaltado={encendido} />
                </td>
                <td data-etiqueta="Matriz">
                  <span className={estilos.estados}>
                    {estados.Cumple > 0 && (
                      <span className={estilos.conteo}>
                        <LamparaEstado valor="Cumple" /> {estados.Cumple}
                      </span>
                    )}
                    {estados.Parcial > 0 && (
                      <span className={estilos.conteo}>
                        <LamparaEstado valor="Parcial" /> {estados.Parcial}
                      </span>
                    )}
                    {estados['No cumple'] > 0 && (
                      <span className={estilos.conteo}>
                        <LamparaEstado valor="No cumple" /> {estados['No cumple']}
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
