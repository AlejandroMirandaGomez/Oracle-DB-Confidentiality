import { estadoDeNivel, nivelesMadurez } from '../data/catalogo/escalas'
import type { EvidenciaRequerida, FilaMatriz, FilaMatrizEjemplo, RespuestaEvidencia } from '../data/tipos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { nivelSugerido } from '../estado/nivelSugerido'
import { BloqueCodigo } from './BloqueCodigo'
import { BotoneraEstado } from './BotoneraEstado'
import { Campo, Rejilla } from './Campo'
import estilos from './DetalleFila.module.css'
import { LamparaEstado } from './Lampara'
import { RampaMadurez } from './RampaMadurez'
import { ListaRefs } from './Ref'
import { SelectorNivel } from './SelectorNivel'

const opcionesEvidencia = ['Sí', 'Parcial', 'No'] as const

function Evidencia({ filaId, evidencia }: { filaId: string; evidencia: EvidenciaRequerida }) {
  const { respuestaEvidencia, fijarRespuestaEvidencia } = useEvaluacion()
  const registro = respuestaEvidencia(filaId, evidencia.id)
  return (
    <li className={estilos.evidencia}>
      <header className={estilos.cabeza}>
        <h4 className={estilos.titulo}>
          <span className={estilos.id}>{evidencia.id}</span>
          <span>{evidencia.titulo}</span>
        </h4>
        <LamparaEstado valor={registro.respuesta ?? 'Sin documentar'} />
      </header>
      <ol className={estilos.pasos}>
        {evidencia.pasos.map((paso) => (
          <li key={paso}>{paso}</li>
        ))}
      </ol>
      <BloqueCodigo codigo={evidencia.codigo} titulo={evidencia.lenguaje} />
      <div className={estilos.esperado}>
        <p className="rotulo">Resultado esperado</p>
        <p>{evidencia.esperado}</p>
      </div>
      <BotoneraEstado<RespuestaEvidencia>
        etiqueta={`Respuesta para ${evidencia.id}`}
        opciones={opcionesEvidencia}
        valor={registro.respuesta}
        alCambiar={(respuesta) => fijarRespuestaEvidencia(filaId, evidencia.id, { respuesta })}
        nota={registro.nota}
        alCambiarNota={(nota) => fijarRespuestaEvidencia(filaId, evidencia.id, { nota })}
        etiquetaNota="Nota opcional"
      />
    </li>
  )
}

export function DetalleFila({ fila }: { fila: FilaMatriz }) {
  const { nivelDe, fijarNivel, respuestaEvidencia, progresoEvidencias } = useEvaluacion()
  const nivel = nivelDe(fila.id)
  const progreso = progresoEvidencias(fila.id)
  const sugerido = nivelSugerido(fila.evidenciasRequeridas.map((evidencia) => respuestaEvidencia(fila.id, evidencia.id).respuesta))
  const descripcion = nivel === null ? null : nivelesMadurez[nivel]
  return (
    <>
      <Rejilla>
        <Campo etiqueta="Tarea">
          <ListaRefs ids={[fila.tarea]} conNombre />
        </Campo>
        <Campo etiqueta="Riesgo">
          <ListaRefs ids={[fila.riesgo]} conNombre />
        </Campo>
        <Campo etiqueta="Control" ancho>
          <ListaRefs ids={[fila.control]} conNombre />
        </Campo>
      </Rejilla>

      <section className={estilos.seccion} aria-labelledby={`evidencias-${fila.id}`}>
        <div className={estilos.encabezadoSeccion}>
          <h3 id={`evidencias-${fila.id}`} className={estilos.subtitulo}>
            Evidencias requeridas
          </h3>
          <p className={estilos.progreso} aria-live="polite">
            {progreso.hechas} de {progreso.total} evidencias documentadas
          </p>
        </div>
        <ol className={estilos.evidencias}>
          {fila.evidenciasRequeridas.map((evidencia) => (
            <Evidencia key={evidencia.id} filaId={fila.id} evidencia={evidencia} />
          ))}
        </ol>
      </section>

      <section className={estilos.seccion} aria-labelledby={`nivel-${fila.id}`}>
        <h3 id={`nivel-${fila.id}`} className={estilos.subtitulo}>
          Nivel de madurez
        </h3>
        <p className={estilos.sugerido} aria-live="polite">
          {sugerido === null ? (
            'Documente al menos una evidencia para obtener un nivel sugerido.'
          ) : (
            <>
              Nivel sugerido por sus respuestas: <RampaMadurez nivel={sugerido} conNombre />
            </>
          )}
        </p>
        <div className={estilos.confirmacion}>
          <SelectorNivel nivel={nivel} sugerido={sugerido} etiqueta={`Nivel de madurez de ${fila.id}`} alCambiar={(valor) => fijarNivel(fila.id, valor)} />
          <LamparaEstado valor={estadoDeNivel(nivel)} />
        </div>
        <p className={estilos.nota}>
          {descripcion ? `${descripcion.nombre}: ${descripcion.descripcion}` : 'Confirme el nivel final con los pulsadores.'} El nivel 4 solo lo asigna usted, porque exige verificación periódica.
        </p>
      </section>

      <Rejilla>
        <Campo etiqueta="Pruebas de la batería" ancho>
          <ListaRefs ids={fila.pruebas} conNombre />
        </Campo>
      </Rejilla>
    </>
  )
}

export function DetalleFilaEjemplo({ fila }: { fila: FilaMatrizEjemplo }) {
  const descripcion = nivelesMadurez[fila.nivel]
  return (
    <>
      <Rejilla>
        <Campo etiqueta="Tarea">
          <ListaRefs ids={[fila.tarea]} conNombre />
        </Campo>
        <Campo etiqueta="Riesgo">
          <ListaRefs ids={[fila.riesgo]} conNombre />
        </Campo>
        <Campo etiqueta="Control" ancho>
          <ListaRefs ids={[fila.control]} conNombre />
        </Campo>
        <Campo etiqueta="Nivel de madurez" ancho>
          <div className={estilos.confirmacion}>
            <RampaMadurez nivel={fila.nivel} conNombre />
            <LamparaEstado valor={estadoDeNivel(fila.nivel)} />
          </div>
          {descripcion && <span className={estilos.nota}>{descripcion.descripcion}</span>}
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
