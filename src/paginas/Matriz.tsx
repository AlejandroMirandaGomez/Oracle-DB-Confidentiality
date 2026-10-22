import { DownloadSimpleIcon, EraserIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { ArchivoEvaluacion } from '../componentes/ArchivoEvaluacion'
import { BotonConfirmacion } from '../componentes/BotonConfirmacion'
import { LamparaEstado } from '../componentes/Lampara'
import { LeyendaLamparas } from '../componentes/LeyendaLamparas'
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
import { nivelSugerido } from '../estado/nivelSugerido'
import estilos from './Matriz.module.css'

type Filtro = 'Todas' | Estado

const filtros: Filtro[] = ['Todas', 'Cumple', 'Parcial', 'No cumple', 'Sin evaluar']

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
    matriz.some((fila) =>
      fila.evidenciasRequeridas.some((evidencia) => {
        const registro = respuestaEvidencia(fila.id, evidencia.id)
        return registro.respuesta !== null || registro.nota !== ''
      }),
    )
  const visibles = matriz.filter((fila) => filtro === 'Todas' || estadoDeNivel(nivelDe(fila.id)) === filtro)

  return (
    <Pagina
      titulo="Matriz de evaluación"
      introduccion="Cada fila une una tarea, un riesgo y un control. Abra la fila para documentar sus evidencias con Sí, Parcial o No y confirme un nivel de madurez de 0 a 4. Pase el cursor sobre un nivel para leer qué significa en el control de esa fila. La matriz arranca sin evaluar."
    >
      <section className={estilos.organizacion} aria-label="Organización y archivo de la evaluación">
        <ArchivoEvaluacion />
      </section>

      <div className={estilos.barra}>
        <p className={estilos.totales} aria-live="polite">
          <span className={estilos.progreso}>
            {progresoMatriz.hechas} de {progresoMatriz.total} filas evaluadas
          </span>
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
          <button
            type="button"
            className="pulsador"
            onClick={() => descargarArchivo(nombreArchivoMatriz(organizacion), matrizComoCsv(organizacion, nivelDe, respuestaEvidencia), 'text/csv')}
          >
            <DownloadSimpleIcon aria-hidden="true" />
            Exportar CSV
          </button>
          <BotonConfirmacion
            etiqueta="Limpiar matriz"
            etiquetaConfirmacion="Confirmar limpieza"
            deshabilitado={!hayMatriz}
            alConfirmar={limpiarMatriz}
            icono={<EraserIcon aria-hidden="true" />}
          />
        </div>
      </div>

      <LeyendaLamparas tipo="matriz" />

      <div className={estilos.marco}>
        <table className={estilos.tabla}>
          <caption className="solo-lectores">Matriz de evaluación: tarea, riesgo, control, criterio 0 a 4, evidencias y estado</caption>
          <thead>
            <tr>
              {['Fila', 'Tarea', 'Riesgo', 'Control', 'Criterio 0-4', 'Evidencia', 'Estado'].map((encabezado) => (
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
              const sugerido = nivelSugerido(fila.evidenciasRequeridas.map((evidencia) => respuestaEvidencia(fila.id, evidencia.id).respuesta))
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
                  <td data-etiqueta="Control">
                    <div className={estilos.control}>
                      <Ref id={fila.control} />
                      <span className={estilos.controlNombre}>{indice.buscarControl(fila.control)?.nombre}</span>
                    </div>
                  </td>
                  <td data-etiqueta="Criterio 0-4">
                    <div className={estilos.nivel}>
                      <SelectorNivel nivel={nivel} control={fila.control} sugerido={sugerido} etiqueta={`Nivel de madurez de ${fila.id}`} alCambiar={(valor) => fijarNivel(fila.id, valor)} />
                      <span className={estilos.criterio}>{fila.criterio}</span>
                    </div>
                  </td>
                  <td data-etiqueta="Evidencia">
                    <div className={estilos.evidencia}>
                      <button type="button" className="pulsador" data-compacto="" onClick={() => abrirReferencia(fila.id)}>
                        {progreso.hechas} de {progreso.total} evidencias documentadas
                      </button>
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
