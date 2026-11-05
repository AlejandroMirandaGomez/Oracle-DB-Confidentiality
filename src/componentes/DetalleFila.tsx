import { estadoDeNivel } from '../data/catalogo/escalas'
import type { FilaMatriz, FilaMatrizEjemplo } from '../data/tipos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { useInstantanea } from '../estado/instantanea'
import { calcularFila, formatoPuntuacion, registroVacioEvidencia } from '../estado/medicion'
import { nivelSugerido } from '../estado/nivelSugerido'
import { Campo, Rejilla } from './Campo'
import { DescripcionNivel } from './DescripcionNivel'
import { DesgloseControl } from './DesgloseControl'
import estilos from './DetalleFila.module.css'
import { LamparaEstado } from './Lampara'
import { RampaMadurez } from './RampaMadurez'
import { ListaRefs } from './Ref'
import { SelectorNivel } from './SelectorNivel'
import { TarjetaEvidencia, TarjetaEvidenciaGuardada } from './TarjetaEvidencia'

export function DetalleFila({ fila }: { fila: FilaMatriz }) {
  const instantanea = useInstantanea()
  const { nivelDe, fijarNivel, respuestaEvidencia, progresoEvidencias } = useEvaluacion()
  if (instantanea) return <DetalleFilaGuardada fila={fila} evaluacion={instantanea} />
  const nivel = nivelDe(fila.id)
  const progreso = progresoEvidencias(fila.id)
  const calculo = calcularFila(fila, respuestaEvidencia)
  const sugerido = nivelSugerido(calculo)
  return (
    <>
      <Rejilla>
        <Campo etiqueta="Tarea">
          <ListaRefs ids={[fila.tarea]} conNombre />
        </Campo>
        <Campo etiqueta="Riesgo">
          <ListaRefs ids={[fila.riesgo]} conNombre />
        </Campo>
        <Campo etiqueta="Control observable" ancho>
          <ListaRefs ids={[fila.control]} conNombre />
        </Campo>
      </Rejilla>

      <DesgloseControl control={fila.control} calculo={calculo} />

      <section className={estilos.seccion} aria-labelledby={`evidencias-${fila.id}`}>
        <div className={estilos.encabezadoSeccion}>
          <h3 id={`evidencias-${fila.id}`} className={estilos.subtitulo}>
            Evidencia por medir
          </h3>
          <p className={estilos.progreso} aria-live="polite">
            {progreso.hechas} de {progreso.total} mediciones
          </p>
        </div>
        <TarjetaEvidencia filaId={fila.id} evidencia={fila.evidencia} />
      </section>

      <section className={estilos.seccion} aria-labelledby={`nivel-${fila.id}`}>
        <h3 id={`nivel-${fila.id}`} className={estilos.subtitulo}>
          Nivel de madurez
        </h3>
        <p className={estilos.sugerido} aria-live="polite">
          {sugerido === null ? (
            'Mida la evidencia para obtener un nivel sugerido.'
          ) : (
            <>
              Nivel sugerido por la puntuación {formatoPuntuacion(calculo.puntuacion)}: <RampaMadurez nivel={sugerido} control={fila.control} conNombre />
            </>
          )}
        </p>
        <div className={estilos.confirmacion}>
          <SelectorNivel nivel={nivel} control={fila.control} sugerido={sugerido} etiqueta={`Nivel de madurez de ${fila.id}`} alCambiar={(valor) => fijarNivel(fila.id, valor)} />
          <LamparaEstado valor={estadoDeNivel(nivel)} />
        </div>
        <DescripcionNivel control={fila.control} nivel={nivel} />
        <p className={estilos.nota}>Desde 0,75 se sugiere el nivel 3, desde 0,50 el nivel 2 y con menos el nivel 1 o 0. El nivel 4 solo lo asigna usted, porque exige verificación periódica. El nivel no cambia la puntuación.</p>
      </section>

      <Rejilla>
        <Campo etiqueta="Pruebas de la batería" ancho>
          <ListaRefs ids={fila.pruebas} conNombre />
        </Campo>
      </Rejilla>
    </>
  )
}

function DetalleFilaGuardada({ fila, evaluacion }: { fila: FilaMatriz; evaluacion: NonNullable<ReturnType<typeof useInstantanea>> }) {
  const nivel = evaluacion.niveles[fila.id] ?? null
  const registroDe = (filaId: string, evidenciaId: string) => evaluacion.respuestasEvidencia[filaId]?.[evidenciaId] ?? registroVacioEvidencia
  return (
    <>
      <Rejilla>
        <Campo etiqueta="Tarea"><ListaRefs ids={[fila.tarea]} conNombre /></Campo>
        <Campo etiqueta="Riesgo"><ListaRefs ids={[fila.riesgo]} conNombre /></Campo>
        <Campo etiqueta="Control observable" ancho><ListaRefs ids={[fila.control]} conNombre /></Campo>
        <Campo etiqueta="Criterio" ancho>{fila.criterio}</Campo>
        <Campo etiqueta="Nivel guardado" ancho>
          <div className={estilos.confirmacion}>
            <RampaMadurez nivel={nivel} control={fila.control} conNombre />
            <LamparaEstado valor={estadoDeNivel(nivel)} />
          </div>
          <DescripcionNivel control={fila.control} nivel={nivel} />
        </Campo>
      </Rejilla>
      <DesgloseControl control={fila.control} calculo={calcularFila(fila, registroDe)} />
      <section className={estilos.seccion} aria-labelledby={`evidencias-${fila.id}`}>
        <h3 id={`evidencias-${fila.id}`} className={estilos.subtitulo}>Evidencia guardada</h3>
        <TarjetaEvidenciaGuardada evidencia={fila.evidencia} registro={registroDe(fila.id, fila.evidencia.id)} />
      </section>
      <Rejilla><Campo etiqueta="Pruebas de la batería" ancho><ListaRefs ids={fila.pruebas} conNombre /></Campo></Rejilla>
    </>
  )
}

export function DetalleFilaEjemplo({ fila }: { fila: FilaMatrizEjemplo }) {
  return (
    <>
      <Rejilla>
        <Campo etiqueta="Tarea">
          <ListaRefs ids={[fila.tarea]} conNombre />
        </Campo>
        <Campo etiqueta="Riesgo">
          <ListaRefs ids={[fila.riesgo]} conNombre />
        </Campo>
        <Campo etiqueta="Control observable" ancho>
          <ListaRefs ids={[fila.control]} conNombre />
        </Campo>
        <Campo etiqueta="Nivel de madurez" ancho>
          <div className={estilos.confirmacion}>
            <RampaMadurez nivel={fila.nivel} control={fila.control} conNombre />
            <LamparaEstado valor={estadoDeNivel(fila.nivel)} />
          </div>
          <DescripcionNivel control={fila.control} nivel={fila.nivel} />
        </Campo>
        <Campo etiqueta="Evidencia" ancho>
          {fila.evidencia}
        </Campo>
        <Campo etiqueta="Pruebas" ancho>
          <ListaRefs ids={fila.pruebas} conNombre />
        </Campo>
      </Rejilla>
    </>
  )
}
