import { estadoDeNivel, nivelesMadurez } from '../data/legajo'
import type { Control, FilaMatriz, Hallazgo, Observable, Prueba, Riesgo, Tarea } from '../data/tipos'
import { valorarRiesgo } from '../estado/calculos'
import {
  buscarPrueba,
  filasDeControl,
  filasDeRiesgo,
  filasDeTarea,
  hallazgosDe,
  observableDeControl,
  observablesDePrueba,
  pruebasDeRiesgo,
  type Entidad,
} from '../estado/indice'
import { useLegajo } from '../estado/LegajoProvider'
import { evidenciaDe, rutaDeScript, scriptDe } from '../recursos'
import { BandaPuntaje } from './BandaPuntaje'
import { BloqueCodigo } from './BloqueCodigo'
import { Campo, Rejilla } from './Campo'
import estilos from './Detalles.module.css'
import { Marca } from './Marca'
import { Trama } from './Trama'
import { ListaRefs } from './Ref'
import { SelectorNivel } from './SelectorNivel'

export function Detalle({ entidad }: { entidad: Entidad }) {
  switch (entidad.tipo) {
    case 'riesgo':
      return <DetalleRiesgo riesgo={entidad.dato} />
    case 'tarea':
      return <DetalleTarea tarea={entidad.dato} />
    case 'control':
      return <DetalleControl control={entidad.dato} />
    case 'observable':
      return <DetalleObservable observable={entidad.dato} />
    case 'prueba':
      return <DetallePrueba prueba={entidad.dato} />
    case 'fila':
      return <DetalleFila fila={entidad.dato} />
    case 'hallazgo':
      return <DetalleHallazgo hallazgo={entidad.dato} />
  }
}

function DetalleRiesgo({ riesgo }: { riesgo: Riesgo }) {
  const { nivelDe } = useLegajo()
  const valoracion = valorarRiesgo(riesgo, nivelDe)
  return (
    <>
      <p className={estilos.entrada}>{riesgo.descripcion}</p>
      <blockquote className={estilos.escenario}>
        <span className={estilos.escenarioRotulo}>Escenario en Oracle</span>
        {riesgo.escenario}
      </blockquote>
      <Rejilla>
        <Campo etiqueta="Impacto">
          {riesgo.impacto} de 5. {riesgo.justificacionImpacto}
        </Campo>
        <Campo etiqueta="Probabilidad">
          {riesgo.probabilidad} de 5. {riesgo.justificacionProbabilidad}
        </Campo>
        <Campo etiqueta="Riesgo inherente">
          <BandaPuntaje puntaje={valoracion.inherente} />
        </Campo>
        <Campo etiqueta="Riesgo residual">
          <BandaPuntaje puntaje={valoracion.residual} />
          <span className={estilos.nota}>Cobertura de los controles: {Math.round(valoracion.cobertura * 100)} %</span>
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
        <Campo etiqueta="Filas de la matriz">
          <ListaRefs ids={filasDeRiesgo(riesgo.id).map((fila) => fila.id)} />
        </Campo>
        <Campo etiqueta="Pruebas">
          <ListaRefs ids={pruebasDeRiesgo(riesgo.id)} />
        </Campo>
        <Campo etiqueta="Hallazgos" ancho>
          <ListaRefs ids={hallazgosDe(riesgo.id).map((hallazgo) => hallazgo.id)} conNombre />
        </Campo>
      </Rejilla>
    </>
  )
}

function DetalleTarea({ tarea }: { tarea: Tarea }) {
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
          <ListaRefs ids={filasDeTarea(tarea.id).map((fila) => fila.id)} />
        </Campo>
      </Rejilla>
    </>
  )
}

const nombrePropiedad = { C: 'Confidencialidad', I: 'Integridad', D: 'Disponibilidad' } as const

function DetalleControl({ control }: { control: Control }) {
  const observable = observableDeControl(control.id)
  return (
    <>
      <p className={estilos.entrada}>{control.proposito}</p>
      <Rejilla>
        <Campo etiqueta="Tema">{control.tema}{control.complementario ? ', complementario' : ''}</Campo>
        <Campo etiqueta="Tipo">{control.tipo.join(' y ')}</Campo>
        <Campo etiqueta="Propiedades marcadas por la norma" ancho>
          <span className={estilos.propiedades}>
            {(['C', 'I', 'D'] as const).map((propiedad) => (
              <span key={propiedad} data-marcada={control.propiedades.includes(propiedad) || undefined}>
                {nombrePropiedad[propiedad]}
              </span>
            ))}
          </span>
        </Campo>
        <Campo etiqueta="Por qué aplica al DBA" ancho>
          {control.justificacion}
        </Campo>
        <Campo etiqueta="Implementación en Oracle 21c XE" ancho>
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
        <Campo etiqueta="Observable">
          <ListaRefs ids={observable ? [observable.id] : []} />
        </Campo>
        <Campo etiqueta="Filas de la matriz">
          <ListaRefs ids={filasDeControl(control.id).map((fila) => fila.id)} />
        </Campo>
        <Campo etiqueta="Hallazgos">
          <ListaRefs ids={hallazgosDe(control.id).map((hallazgo) => hallazgo.id)} />
        </Campo>
      </Rejilla>
    </>
  )
}

function DetalleObservable({ observable }: { observable: Observable }) {
  return (
    <>
      <p className={estilos.entrada}>{observable.enunciado}</p>
      <div className={estilos.bloque}>
        <BloqueCodigo codigo={observable.consulta} titulo="Lo que ejecuta el auditor" />
      </div>
      <Rejilla>
        <Campo etiqueta="Criterio de aceptación" ancho>
          {observable.criterio}
        </Campo>
        <Campo etiqueta="Se observó" ancho>
          <Marca valor={observable.veredicto} estampar /> {observable.resultado}
        </Campo>
        <Campo etiqueta="Control">
          <ListaRefs ids={[observable.control]} conNombre />
        </Campo>
        <Campo etiqueta="Resultado de las pruebas">
          <ul className={estilos.veredictos}>
            {observable.pruebas.map((id) => {
              const prueba = buscarPrueba(id)
              return (
                <li key={id}>
                  <ListaRefs ids={[id]} />
                  {prueba && <Marca valor={prueba.veredicto} />}
                </li>
              )
            })}
          </ul>
        </Campo>
      </Rejilla>
    </>
  )
}

function DetallePrueba({ prueba }: { prueba: Prueba }) {
  const script = scriptDe(prueba.script)
  const evidencia = evidenciaDe(prueba.evidencia)
  return (
    <>
      <p className={estilos.entrada}>{prueba.objetivo}</p>
      <Rejilla>
        <Campo etiqueta="Tipo">{prueba.tipo}</Campo>
        <Campo etiqueta="Herramienta">{prueba.herramienta}</Campo>
        <Campo etiqueta="Procedimiento" ancho>
          <ol>
            {prueba.procedimiento.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </Campo>
        <Campo etiqueta="Resultado esperado">{prueba.resultadoEsperado}</Campo>
        <Campo etiqueta="Resultado obtenido">{prueba.resultadoObtenido}</Campo>
        <Campo etiqueta="Veredicto">
          <Marca valor={prueba.veredicto} estampar />
        </Campo>
        <Campo etiqueta="Controles">
          <ListaRefs ids={prueba.controles} />
        </Campo>
        <Campo etiqueta="Observables" ancho>
          <ListaRefs ids={observablesDePrueba(prueba.id).map((observable) => observable.id)} />
        </Campo>
      </Rejilla>
      {script && (
        <div className={estilos.bloque}>
          <BloqueCodigo codigo={script} titulo={rutaDeScript(prueba.script)} />
        </div>
      )}
      {evidencia && (
        <div className={estilos.bloque}>
          <BloqueCodigo codigo={evidencia} titulo={`evidencias/${prueba.evidencia}.txt`} variante="listado" />
        </div>
      )}
    </>
  )
}

function DetalleFila({ fila }: { fila: FilaMatriz }) {
  const { nivelDe, nivelOriginal, fijarNivel, estaAjustado } = useLegajo()
  const nivel = nivelDe(fila.id)
  const descripcion = nivelesMadurez.find((item) => item.nivel === nivel)
  return (
    <>
      <p className={estilos.entrada}>{fila.criterio}</p>
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
        <Campo etiqueta="Criterio de madurez 0-4" ancho>
          <div className={estilos.nivel}>
            <SelectorNivel nivel={nivel} original={nivelOriginal(fila.id)} etiqueta={`Nivel de ${fila.id}`} alCambiar={(valor) => fijarNivel(fila.id, valor)} />
            <Marca valor={estadoDeNivel(nivel)} estampar />
          </div>
          {descripcion && (
            <span className={estilos.nota}>
              {descripcion.nombre}: {descripcion.descripcion}
              {estaAjustado(fila.id) ? ` Ajustado por el revisor; la evidencia sostiene el nivel ${nivelOriginal(fila.id)}.` : ''}
            </span>
          )}
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

function DetalleHallazgo({ hallazgo }: { hallazgo: Hallazgo }) {
  return (
    <>
      <p className={estilos.entrada}>
        <span className={estilos.prioridad}>
          <Trama densidad={hallazgo.prioridad === 'Alta' ? 4 : hallazgo.prioridad === 'Media' ? 2 : 1} />
          Prioridad {hallazgo.prioridad.toLowerCase()}
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
      <div className={estilos.bloque}>
        <BloqueCodigo codigo={hallazgo.remediacion} titulo="Remediación propuesta" />
      </div>
      <Rejilla>
        <Campo etiqueta="Controles">
          <ListaRefs ids={hallazgo.controles} />
        </Campo>
        <Campo etiqueta="Pruebas">
          <ListaRefs ids={hallazgo.pruebas} />
        </Campo>
        <Campo etiqueta="Riesgos" ancho>
          <ListaRefs ids={hallazgo.riesgos} conNombre />
        </Campo>
      </Rejilla>
    </>
  )
}
