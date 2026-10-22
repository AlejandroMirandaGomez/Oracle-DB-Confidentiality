import { lazy, Suspense, useContext, type ReactNode } from 'react'
import type { Control, HallazgoEjemplo, Riesgo, Tarea, Hallazgo, Prioridad } from '../data/tipos'
import { valorarRiesgo } from '../estado/calculos'
import type { Entidad } from '../estado/indice'
import { useIndice } from '../estado/fuente'
import { useNivelDe } from '../estado/useNivelDe'
import { BandaRiesgo } from './BandaRiesgo'
import { BloqueCodigo } from './BloqueCodigo'
import { Campo, Rejilla } from './Campo'
import { DentroDeHoja } from './contextoHoja'
import { DetalleFila, DetalleFilaEjemplo } from './DetalleFila'
import { DetallePrueba } from './DetallePrueba'
import estilos from './Detalles.module.css'
import { LamparaEstado, PuntoLampara } from './Lampara'
import { ListaRefs } from './Ref'

const DetallePruebaEjemplo = lazy(() => import('./DetallePruebaEjemplo').then((modulo) => ({ default: modulo.DetallePruebaEjemplo })))

function Subtitulo({ id, children }: { id: string; children: ReactNode }) {
  const enHoja = useContext(DentroDeHoja)
  const Etiqueta = enHoja ? 'h3' : 'h2'
  return (
    <Etiqueta id={id} className={estilos.subtitulo}>
      {children}
    </Etiqueta>
  )
}

export function Detalle({ entidad }: { entidad: Entidad }) {
  switch (entidad.tipo) {
    case 'riesgo':
      return <DetalleRiesgo riesgo={entidad.dato} />
    case 'tarea':
      return <DetalleTarea tarea={entidad.dato} />
    case 'control':
      return <DetalleControl control={entidad.dato} />
    case 'prueba':
      return <DetallePrueba prueba={entidad.dato} />
    case 'fila':
      return <DetalleFila fila={entidad.dato} />
    case 'hallazgo':
      return <VistaHallazgo hallazgo={entidad.dato} />
    case 'pruebaEjemplo':
      return (
        <Suspense fallback={<p className={estilos.nota}>Cargando el detalle de la prueba.</p>}>
          <DetallePruebaEjemplo prueba={entidad.dato} />
        </Suspense>
      )
    case 'filaEjemplo':
      return <DetalleFilaEjemplo fila={entidad.dato} />
    case 'hallazgoEjemplo':
      return <VistaHallazgo hallazgo={entidad.dato} />
  }
}

function DetalleRiesgo({ riesgo }: { riesgo: Riesgo }) {
  const indice = useIndice()
  const nivelDe = useNivelDe()
  const filas = indice.filasDeRiesgo(riesgo.id)
  const valoracion = valorarRiesgo(
    riesgo,
    filas.map((fila) => fila.id),
    nivelDe,
  )
  return (
    <>
      <p className={estilos.entrada}>{riesgo.descripcion}</p>
      <div className={estilos.escenario}>
        <p className="rotulo">{indice.modo === 'ejemplo' ? 'Escenario en Oracle' : 'Escenario típico en Oracle'}</p>
        <p>{riesgo.escenario}</p>
      </div>
      <Rejilla>
        <Campo etiqueta="Impacto">
          {riesgo.impacto} de 5. {riesgo.justificacionImpacto}
        </Campo>
        <Campo etiqueta="Probabilidad">
          {riesgo.probabilidad} de 5. {riesgo.justificacionProbabilidad}
        </Campo>
        <Campo etiqueta="Riesgo inherente">
          <BandaRiesgo puntaje={valoracion.inherente} />
        </Campo>
        <Campo etiqueta="Riesgo residual">
          <BandaRiesgo puntaje={valoracion.residual} />
          <span className={estilos.nota}>
            {valoracion.cobertura === null
              ? 'Evalúe las filas de la matriz de este riesgo para calcularlo.'
              : `Cobertura de los controles: ${Math.round(valoracion.cobertura * 100)} % (${valoracion.evaluadas} de ${valoracion.total} filas evaluadas)`}
          </span>
        </Campo>
        <Campo etiqueta="Amenaza">{riesgo.amenaza}</Campo>
        <Campo etiqueta="Vulnerabilidad">{riesgo.vulnerabilidad}</Campo>
        <Campo etiqueta="Activos" ancho>
          {riesgo.activos.join('; ')}
        </Campo>
        <Campo etiqueta="Tareas del DBA">
          <ListaRefs ids={riesgo.tareas} />
        </Campo>
        <Campo etiqueta="Controles">
          <ListaRefs ids={riesgo.controles} />
        </Campo>
        <Campo etiqueta="Filas de la matriz" ancho>
          <ListaRefs ids={filas.map((fila) => fila.id)} />
        </Campo>
      </Rejilla>
    </>
  )
}

function DetalleTarea({ tarea }: { tarea: Tarea }) {
  const indice = useIndice()
  return (
    <>
      <p className={estilos.entrada}>{tarea.descripcion}</p>
      <Rejilla>
        <Campo etiqueta="Frecuencia">{tarea.frecuencia}</Campo>
        <Campo etiqueta="Fase PHVA">{tarea.fase}</Campo>
        <Campo etiqueta="Herramientas y vistas" ancho>
          <span className={estilos.mono}>{tarea.herramientas.join('  ·  ')}</span>
        </Campo>
        <Campo etiqueta="Riesgos que mitiga">
          <ListaRefs ids={tarea.riesgos} />
        </Campo>
        <Campo etiqueta="Controles">
          <ListaRefs ids={tarea.controles} />
        </Campo>
        <Campo etiqueta="Filas de la matriz" ancho>
          <ListaRefs ids={indice.filasDeTarea(tarea.id).map((fila) => fila.id)} />
        </Campo>
      </Rejilla>
    </>
  )
}

const nombrePropiedad = { C: 'Confidencialidad', I: 'Integridad', D: 'Disponibilidad' } as const

function DetalleControl({ control }: { control: Control }) {
  const indice = useIndice()
  const observable = control.observable
  const resultado = indice.observableDeControl(control.id)
  return (
    <>
      <p className={estilos.entrada}>{control.proposito}</p>
      <Rejilla>
        <Campo etiqueta="Tema">
          {control.tema}
          {control.complementario ? ', complementario' : ''}
        </Campo>
        <Campo etiqueta="Tipo">{control.tipo.join(' y ')}</Campo>
        <Campo etiqueta="Propiedades marcadas por la norma" ancho>
          <ul className={estilos.propiedades}>
            {(['C', 'I', 'D'] as const).map((propiedad) => {
              const marcada = control.propiedades.includes(propiedad)
              return (
                <li key={propiedad} data-marcada={marcada || undefined}>
                  <PuntoLampara tono={marcada ? 'blanca' : 'apagada'} />
                  {nombrePropiedad[propiedad]}
                  <span className={estilos.estadoPropiedad}>{marcada ? 'marcada' : 'no marcada'}</span>
                </li>
              )
            })}
          </ul>
        </Campo>
        <Campo etiqueta="Por qué aplica al DBA" ancho>
          {control.justificacion}
        </Campo>
        <Campo etiqueta="Implementación en Oracle" ancho>
          <ol>
            {control.implementacion.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </Campo>
      </Rejilla>
      <div className={estilos.bloque}>
        <BloqueCodigo codigo={control.evidencia} titulo="Evidencia observable" />
      </div>
      {observable && (
        <section className={estilos.auditor} aria-labelledby={`auditor-${control.id}`}>
          <Subtitulo id={`auditor-${control.id}`}>Lo que verifica un auditor externo</Subtitulo>
          <p className={estilos.enunciado}>{observable.enunciado}</p>
          <BloqueCodigo codigo={observable.consulta} titulo={`Consulta ${observable.id}`} />
          <Rejilla>
            <Campo etiqueta="Criterio de aceptación" ancho>
              {observable.criterio}
            </Campo>
            {resultado && (
              <Campo etiqueta="Se observó" ancho>
                <span className={estilos.observado}>
                  <LamparaEstado valor={resultado.veredicto} />
                  {resultado.resultado}
                </span>
              </Campo>
            )}
          </Rejilla>
        </section>
      )}
      <Rejilla>
        <Campo etiqueta="Riesgos">
          <ListaRefs ids={control.riesgos} />
        </Campo>
        <Campo etiqueta="Tareas">
          <ListaRefs ids={control.tareas} />
        </Campo>
        <Campo etiqueta="Pruebas">
          <ListaRefs ids={control.pruebas} />
        </Campo>
        <Campo etiqueta="Filas de la matriz">
          <ListaRefs ids={indice.filasDeControl(control.id).map((fila) => fila.id)} />
        </Campo>
      </Rejilla>
    </>
  )
}

type DatosHallazgo = Hallazgo | HallazgoEjemplo

function tieneFilas(hallazgo: DatosHallazgo): hallazgo is Hallazgo {
  return 'filas' in hallazgo
}

function VistaHallazgo({ hallazgo }: { hallazgo: DatosHallazgo }) {
  const prioridad: Prioridad = hallazgo.prioridad
  return (
    <>
      <p className={estilos.entrada}>
        <span className={estilos.prioridad}>
          <LamparaEstado valor={prioridad} texto={`Prioridad ${prioridad.toLowerCase()}`} />
          {tieneFilas(hallazgo) && hallazgo.contradiccion && <span className={estilos.nota}>Una prueba contradice el nivel declarado.</span>}
        </span>
      </p>
      <Rejilla>
        <Campo etiqueta="Condición" ancho>
          {hallazgo.condicion}
        </Campo>
        <Campo etiqueta="Criterio">{hallazgo.criterio}</Campo>
        <Campo etiqueta="Causa">{hallazgo.causa}</Campo>
        <Campo etiqueta="Efecto">{hallazgo.efecto}</Campo>
        <Campo etiqueta="Recomendación">{hallazgo.recomendacion}</Campo>
      </Rejilla>
      {hallazgo.remediacion !== '' && (
        <div className={estilos.bloque}>
          <BloqueCodigo codigo={hallazgo.remediacion} titulo="Remediación propuesta" />
        </div>
      )}
      <Rejilla>
        <Campo etiqueta="Controles">
          <ListaRefs ids={hallazgo.controles} />
        </Campo>
        <Campo etiqueta="Pruebas">
          <ListaRefs ids={hallazgo.pruebas} />
        </Campo>
        {tieneFilas(hallazgo) && (
          <Campo etiqueta="Filas de la matriz">
            <ListaRefs ids={hallazgo.filas} />
          </Campo>
        )}
        <Campo etiqueta="Riesgos" ancho>
          <ListaRefs ids={hallazgo.riesgos} conNombre />
        </Campo>
      </Rejilla>
    </>
  )
}
