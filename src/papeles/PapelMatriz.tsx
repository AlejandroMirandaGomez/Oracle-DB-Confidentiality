import { ArrowCounterClockwiseIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Marca } from '../componentes/Marca'
import { Papel } from '../componentes/Papel'
import { ListaRefs, Ref } from '../componentes/Ref'
import { SelectorNivel } from '../componentes/SelectorNivel'
import { Trama } from '../componentes/Trama'
import { estadoDeNivel, nivelesMadurez } from '../data/legajo'
import { matrizInicial } from '../data/matriz'
import type { Estado, Nivel } from '../data/tipos'
import { conteoDeMatriz, formatoDecimal, madurezPromedio } from '../estado/calculos'
import { buscarControl } from '../estado/indice'
import { useLegajo } from '../estado/LegajoProvider'
import estilos from './PapelMatriz.module.css'

type Filtro = 'Todas' | Estado

const filtros: Filtro[] = ['Todas', 'Cumple', 'Parcial', 'No cumple']

function exportarCsv(nivelDe: (filaId: string) => Nivel) {
  const encabezado = ['Fila', 'Tarea', 'Riesgo', 'Control', 'Criterio 0-4', 'Evidencia', 'Estado']
  const filas = matrizInicial.map((fila) => {
    const nivel = nivelDe(fila.id)
    return [fila.id, fila.tarea, fila.riesgo, fila.control, String(nivel), fila.evidencia, estadoDeNivel(nivel)]
  })
  const texto = [encabezado, ...filas].map((columnas) => columnas.map((valor) => `"${valor.replaceAll('"', '""')}"`).join(';')).join('\r\n')
  const archivo = new Blob(['﻿' + texto], { type: 'text/csv;charset=utf-8' })
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(archivo)
  enlace.download = 'matriz-evaluacion-confidencialidad.csv'
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}

export function PapelMatriz() {
  const { nivelDe, nivelOriginal, fijarNivel, estaAjustado, hayAjustes, restablecerNiveles } = useLegajo()
  const [filtro, setFiltro] = useState<Filtro>('Todas')
  const conteo = conteoDeMatriz(nivelDe)
  const promedio = madurezPromedio(nivelDe)
  const visibles = matrizInicial.filter((fila) => filtro === 'Todas' || estadoDeNivel(nivelDe(fila.id)) === filtro)

  return (
    <Papel
      letra="E"
      titulo="Matriz de evaluación"
      objetivo="Cada fila une una tarea, un riesgo y un control, y le asigna un nivel de madurez de 0 a 4 sostenido por la evidencia. Puede ajustar los niveles para simular una remediación: el estado, los totales y el riesgo residual se recalculan."
    >
      <div className={estilos.escala}>
        {nivelesMadurez.map((nivel) => (
          <div key={nivel.nivel} className={estilos.escalon}>
            <span className={estilos.escalonNumero}>
              <Trama densidad={nivel.nivel} />
              {nivel.nivel}
            </span>
            <span className={estilos.escalonNombre}>{nivel.nombre}</span>
            <span className={estilos.escalonTexto}>{nivel.descripcion}</span>
            <span className={estilos.escalonEstado}>
              <Marca valor={estadoDeNivel(nivel.nivel)} />
            </span>
          </div>
        ))}
      </div>

      <div className={estilos.barra}>
        <p className={estilos.totales} aria-live="polite">
          <span>
            <Marca valor="Cumple" conTexto={false} /> {conteo.Cumple}
          </span>
          <span>
            <Marca valor="Parcial" conTexto={false} /> {conteo.Parcial}
          </span>
          <span>
            <Marca valor="No cumple" conTexto={false} /> {conteo['No cumple']}
          </span>
          <span className={estilos.promedio}>Madurez promedio {formatoDecimal(promedio)} de 4</span>
        </p>
        <div className={estilos.controles}>
          <div className={estilos.filtros} role="radiogroup" aria-label="Filtrar por estado">
            {filtros.map((opcion) => (
              <button
                key={opcion}
                type="button"
                role="radio"
                aria-checked={filtro === opcion}
                data-activo={filtro === opcion || undefined}
                className={estilos.filtro}
                onClick={() => setFiltro(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>
          <button type="button" className={estilos.accion} onClick={restablecerNiveles} disabled={!hayAjustes}>
            <ArrowCounterClockwiseIcon aria-hidden="true" />
            Volver a la evidencia
          </button>
          <button type="button" className={estilos.accion} onClick={() => exportarCsv(nivelDe)}>
            <DownloadSimpleIcon aria-hidden="true" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className={estilos.marco}>
        <table className={estilos.tabla}>
          <caption className="solo-lectores">Matriz de evaluación: tarea, riesgo, control, criterio 0 a 4, evidencia y estado</caption>
          <thead>
            <tr>
              <th scope="col">Fila</th>
              <th scope="col">Tarea</th>
              <th scope="col">Riesgo</th>
              <th scope="col">Control</th>
              <th scope="col">Criterio 0-4</th>
              <th scope="col">Evidencia</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((fila) => {
              const nivel = nivelDe(fila.id)
              const ajustado = estaAjustado(fila.id)
              return (
                <tr key={fila.id} data-ajustado={ajustado || undefined}>
                  <th scope="row" data-etiqueta="Fila">
                    <Ref id={fila.id} />
                  </th>
                  <td data-etiqueta="Tarea">
                    <Ref id={fila.tarea} />
                  </td>
                  <td data-etiqueta="Riesgo">
                    <Ref id={fila.riesgo} />
                  </td>
                  <td data-etiqueta="Control">
                    <div className={estilos.control}>
                      <Ref id={fila.control} />
                      <span className={estilos.controlNombre}>{buscarControl(fila.control)?.nombre}</span>
                    </div>
                  </td>
                  <td data-etiqueta="Criterio 0-4">
                    <div className={estilos.nivel}>
                      <SelectorNivel
                        nivel={nivel}
                        original={nivelOriginal(fila.id)}
                        etiqueta={`Nivel de madurez de ${fila.id}`}
                        alCambiar={(valor) => fijarNivel(fila.id, valor)}
                      />
                      <span className={estilos.criterio}>{fila.criterio}</span>
                      {ajustado && <span className={estilos.ajuste}>Ajustado; la evidencia sostiene {nivelOriginal(fila.id)}</span>}
                    </div>
                  </td>
                  <td data-etiqueta="Evidencia">
                    <div className={estilos.evidencia}>
                      {fila.evidencia}
                      <ListaRefs ids={fila.pruebas} />
                    </div>
                  </td>
                  <td data-etiqueta="Estado">
                    <span className={estilos.estado}>
                      <Trama densidad={nivel} />
                      <Marca key={`${fila.id}-${nivel}`} valor={estadoDeNivel(nivel)} estampar={ajustado} />
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {visibles.length === 0 && <p className={estilos.vacio}>Ninguna fila tiene el estado {filtro.toLowerCase()} con los niveles actuales.</p>}
      </div>
    </Papel>
  )
}
