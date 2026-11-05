import { EraserIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { ArchivoEvaluacion } from '../componentes/ArchivoEvaluacion'
import { BotonConfirmacion } from '../componentes/BotonConfirmacion'
import { ComoSeCalcula } from '../componentes/ComoSeCalcula'
import { Lampara, LamparaEstado } from '../componentes/Lampara'
import { Pagina } from '../componentes/Pagina'
import { ListaRefs, Ref } from '../componentes/Ref'
import { SelectorNivel } from '../componentes/SelectorNivel'
import { estadoDeNivel } from '../data/catalogo/escalas'
import { matriz } from '../data/catalogo/matriz'
import type { Estado } from '../data/tipos'
import { conteoDeEstados, formatoDecimal, madurezPromedio } from '../estado/calculos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { useIndice } from '../estado/fuente'
import { descargarArchivo, matrizComoCsv, nombreArchivoMatriz } from '../estado/exportaciones'
import { calcularFila, formatoPuntuacion } from '../estado/medicion'
import { nivelSugerido } from '../estado/nivelSugerido'
import { saludDePuntuacion } from '../estado/puntuaciones'
import estilos from './Matriz.module.css'

type Filtro = 'Todas' | Estado

const filtros: Filtro[] = ['Todas', 'Cumple', 'Parcial', 'No cumple', 'Sin evaluar']

const tonoDeSalud = { Verde: 'verde', Amarillo: 'ambar', Rojo: 'roja' } as const

export function Matriz() {
  const { nivelDe, fijarNivel, respuestaEvidencia, progresoEvidencias, progresoMatriz, limpiarMatriz, organizacion, abrirReferencia, marcarPasoVisto } = useEvaluacion()
  const indice = useIndice()
  const [filtro, setFiltro] = useState<Filtro>('Todas')

  useEffect(() => marcarPasoVisto('matriz'), [marcarPasoVisto])

  const ids = matriz.map((fila) => fila.id)
  const conteo = conteoDeEstados(ids, nivelDe)
  const promedio = madurezPromedio(ids, nivelDe)
  const hayMatriz =
    progresoMatriz.hechas > 0 ||
    matriz.some((fila) => {
      const registro = respuestaEvidencia(fila.id, fila.evidencia.id)
      return Object.keys(registro.valores).length > 0 || registro.nota !== ''
    })
  const visibles = matriz.filter((fila) => filtro === 'Todas' || estadoDeNivel(nivelDe(fila.id)) === filtro)

  return (
    <Pagina
      titulo="Matriz de evaluación"
      introduccion="Cada fila une una tarea, un riesgo y un control. Abra la fila para medir su evidencia con datos de su propia base y confirme un nivel de madurez de 0 a 4. Pase el cursor sobre un nivel para leer qué significa en el control de esa fila. La matriz arranca sin evaluar."
    >
      <ComoSeCalcula />

      <section className={estilos.organizacion} aria-label="Organización y archivo de la evaluación">
        <ArchivoEvaluacion
          acciones={[
            {
              etiqueta: 'Exportar matriz (CSV)',
              alActivar: () => descargarArchivo(nombreArchivoMatriz(organizacion), matrizComoCsv(organizacion, nivelDe, respuestaEvidencia), 'text/csv'),
            },
          ]}
        />
      </section>

      <div className={estilos.barra}>
        <p className={estilos.totales} aria-live="polite">
          <span className={estilos.progreso}>
            {progresoMatriz.hechas} de {progresoMatriz.total} filas evaluadas
          </span>
          {progresoMatriz.hechas < progresoMatriz.total && <span>Complete la matriz para habilitar Guardar evaluación.</span>}
          <span className={estilos.conteo}>
            <LamparaEstado valor="Cumple" /> {conteo.Cumple}
          </span>
          <span className={estilos.conteo}>
            <LamparaEstado valor="Parcial" /> {conteo.Parcial}
          </span>
          <span className={estilos.conteo}>
            <LamparaEstado valor="No cumple" /> {conteo['No cumple']}
          </span>
          <span className={estilos.promedio}>{promedio === null ? 'Madurez promedio sin evaluar' : `Madurez promedio ${formatoDecimal(promedio)} de 4`}</span>
        </p>
        <div className={estilos.controles}>
          <div className={estilos.filtros} role="radiogroup" aria-label="Filtrar por estado">
            {filtros.map((opcion) => (
              <button key={opcion} type="button" role="radio" aria-checked={filtro === opcion} className="pulsador" data-compacto="" onClick={() => setFiltro(opcion)}>
                {opcion}
              </button>
            ))}
          </div>
          <BotonConfirmacion
            etiqueta="Limpiar matriz"
            titulo="¿Limpiar la matriz?"
            etiquetaConfirmar="Sí, limpiar matriz"
            deshabilitado={!hayMatriz}
            alConfirmar={limpiarMatriz}
            icono={<EraserIcon aria-hidden="true" />}
          >
            <p>Se borrarán los niveles de las 18 filas y las respuestas de evidencias.</p>
            <p>Si quiere conservar su evaluación, expórtela antes de continuar.</p>
          </BotonConfirmacion>
        </div>
      </div>

      <div className={estilos.marco}>
        <table className={estilos.tabla}>
          <caption className="solo-lectores">Matriz de evaluación: tarea, riesgo, control, madurez 0 a 4, evidencias y estado</caption>
          <thead>
            <tr>
              {['Fila', 'Tarea', 'Riesgo', 'Control observable', 'Madurez 0-4', 'Evidencia', 'Estado'].map((encabezado) => (
                <th key={encabezado} scope="col" className="rotulo">
                  {encabezado}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((fila) => {
              const nivel = nivelDe(fila.id)
              const progreso = progresoEvidencias(fila.id)
              const calculo = calcularFila(fila, respuestaEvidencia)
              const sugerido = nivelSugerido(calculo)
              return (
                <tr key={fila.id}>
                  <th scope="row" data-etiqueta="Fila">
                    <Ref id={fila.id} />
                  </th>
                  <td data-etiqueta="Tarea">
                    <Ref id={fila.tarea} />
                  </td>
                  <td data-etiqueta="Riesgo">
                    <Ref id={fila.riesgo} />
                  </td>
                  <td data-etiqueta="Control observable">
                    <div className={estilos.control}>
                      <Ref id={fila.control} />
                      <span className={estilos.controlNombre}>{indice.buscarControl(fila.control)?.nombre}</span>
                    </div>
                  </td>
                  <td data-etiqueta="Madurez 0-4">
                    <div className={estilos.nivel}>
                      <SelectorNivel nivel={nivel} control={fila.control} sugerido={sugerido} etiqueta={`Nivel de madurez de ${fila.id}`} alCambiar={(valor) => fijarNivel(fila.id, valor)} />
                      <span className={estilos.criterio}>{fila.criterio}</span>
                    </div>
                  </td>
                  <td data-etiqueta="Evidencia">
                    <div className={estilos.evidencia}>
                      <button type="button" className="pulsador" data-compacto="" onClick={() => abrirReferencia(fila.id)}>
                        {progreso.hechas} de {progreso.total} mediciones
                      </button>
                      {calculo.respondidas > 0 && <Lampara tono={tonoDeSalud[saludDePuntuacion(calculo.puntuacion)]} texto={`Vale ${formatoPuntuacion(calculo.puntuacion)} de 1`} />}
                      <ListaRefs ids={fila.pruebas} />
                    </div>
                  </td>
                  <td data-etiqueta="Estado">
                    <LamparaEstado valor={estadoDeNivel(nivel)} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {visibles.length === 0 && <p className={estilos.vacio}>Ninguna fila tiene el estado {filtro.toLowerCase()} con los niveles actuales.</p>}
      </div>
    </Pagina>
  )
}
