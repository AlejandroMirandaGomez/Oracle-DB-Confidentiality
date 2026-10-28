import { ArrowLeftIcon, ArrowUUpLeftIcon, DownloadSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router'
import { BotonConfirmacion } from '../componentes/BotonConfirmacion'
import { CedulaTrazabilidad } from '../componentes/CedulaTrazabilidad'
import { ComponenteTabular, type ColumnaTabular } from '../componentes/ComponenteTabular'
import { GraficosHistorial } from '../componentes/GraficosHistorial'
import { Lampara, LamparaEstado } from '../componentes/Lampara'
import { Pagina } from '../componentes/Pagina'
import { PanelRiesgos } from '../componentes/PanelRiesgos'
import { PanelTareas } from '../componentes/PanelTareas'
import { RampaMadurez } from '../componentes/RampaMadurez'
import { ListaRefs } from '../componentes/Ref'
import { estadoDeNivel } from '../data/catalogo/escalas'
import { controles } from '../data/catalogo/controles'
import { matriz } from '../data/catalogo/matriz'
import { pruebas } from '../data/catalogo/pruebas'
import type { Control, FilaMatriz, Hallazgo, Prueba } from '../data/tipos'
import { construirArchivo, nombreArchivoEvaluacion } from '../estado/archivoEvaluacion'
import { conteoDeEstados } from '../estado/calculos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { irA } from '../estado/desplazamiento'
import { descargarArchivo } from '../estado/exportaciones'
import { generarHallazgos } from '../estado/hallazgos'
import type { EvaluacionGuardada } from '../estado/historial'
import { formatoPuntuacion, puntuacionesControles, puntuacionSalud, saludDePuntuacion } from '../estado/puntuaciones'
import estilos from './Historial.module.css'

const formatoFecha = new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' })

function fechaGuardada(registro: EvaluacionGuardada): string {
  return formatoFecha.format(new Date(registro.fechaGuardado))
}

function nombreOrganizacion(registro: EvaluacionGuardada): string {
  return registro.evaluacion.organizacion.trim() || 'Organización sin nombre'
}

function resumen(registro: EvaluacionGuardada): string {
  const niveles = registro.evaluacion.niveles
  const conteo = conteoDeEstados(matriz.map((fila) => fila.id), (id) => niveles[id] ?? null)
  return `Cumple ${conteo.Cumple}, Parcial ${conteo.Parcial}, No cumple ${conteo['No cumple']}`
}

const columnasHistorial: ColumnaTabular<EvaluacionGuardada>[] = [
  { clave: 'organizacion', encabezado: 'Organización', celda: (registro) => <span className={estilos.organizacion}>{nombreOrganizacion(registro)}{registro.demostracion && <span className={estilos.demostracion}>Demostración</span>}</span> },
  { clave: 'fecha', encabezado: 'Fecha de evaluación', celda: (registro) => <time className={estilos.fecha} dateTime={registro.fechaGuardado}>{fechaGuardada(registro)}</time> },
  { clave: 'salud', encabezado: 'Salud', celda: (registro) => {
    const puntuacion = puntuacionSalud(registro.evaluacion)
    const salud = saludDePuntuacion(puntuacion)
    return <span className={estilos.salud}><Lampara tono={salud === 'Verde' ? 'verde' : salud === 'Amarillo' ? 'ambar' : 'roja'} texto={salud} /> <span>{formatoPuntuacion(puntuacion)}</span></span>
  } },
  { clave: 'matriz', encabezado: 'Matriz', celda: (registro) => `${Object.keys(registro.evaluacion.niveles).length} de ${matriz.length} filas` },
  { clave: 'bateria', encabezado: 'Batería', celda: (registro) => `${pruebas.filter((prueba) => registro.evaluacion.respuestasPruebas[prueba.id]?.respuesta != null).length} de ${pruebas.length} pruebas` },
  { clave: 'resultado', encabezado: 'Resultado resumido', celda: resumen },
]

export function Historial() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { historial, organizacion, restaurarEvaluacion, eliminarEvaluacion, abrirReferencia } = useEvaluacion()
  const registro = historial.find((item) => item.id === id)

  if (!id) {
    return (
      <Pagina
        titulo="Historial de evaluaciones"
        introduccion="Evaluaciones guardadas en este navegador. Abra una para revisar su cédula de trazabilidad, riesgos, tareas, controles observables, matriz, pruebas y hallazgos sin cambiar el trabajo actual."
      >
        <ComponenteTabular
          etiqueta="Evaluaciones guardadas"
          columnas={columnasHistorial}
          filas={historial}
          idDe={(item) => item.id}
          nombreDe={nombreOrganizacion}
          etiquetaAbrir={(item) => `Abrir evaluación de ${nombreOrganizacion(item)} del ${fechaGuardada(item)}`}
          alSeleccionar={(seleccionado) => navegar(`/historial/${seleccionado}`)}
          vacio="Todavía no hay evaluaciones guardadas. Complete la matriz y use Guardar evaluación en la barra superior."
        />
        <GraficosHistorial historial={historial} organizacionActual={organizacion} />
        <p className={estilos.nota}>Los guardados permanecen en este navegador. Puede exportar cada evaluación como archivo JSON desde su detalle.</p>
      </Pagina>
    )
  }

  if (!registro) {
    return (
      <Pagina titulo="Evaluación no encontrada" introduccion="Este guardado no existe en el historial de este navegador.">
        <Link to="/historial" className="pulsador"><ArrowLeftIcon aria-hidden="true" /> Volver al historial</Link>
      </Pagina>
    )
  }

  const evaluacion = registro.evaluacion
  const hallazgos = generarHallazgos(evaluacion.niveles, evaluacion.respuestasEvidencia, evaluacion.respuestasPruebas)
  const conteo = conteoDeEstados(matriz.map((fila) => fila.id), (filaId) => evaluacion.niveles[filaId] ?? null)
  const pruebasHechas = pruebas.filter((prueba) => evaluacion.respuestasPruebas[prueba.id]?.respuesta != null).length
  const puntuaciones = new Map(puntuacionesControles(evaluacion).map((control) => [control.filaId, control.puntuacion]))
  const saludNumerica = puntuacionSalud(evaluacion)
  const salud = saludDePuntuacion(saludNumerica)

  const columnasControles: ColumnaTabular<Control>[] = [
    { clave: 'id', encabezado: 'ID', celda: (control) => <span className={estilos.id}>{control.id}</span> },
    { clave: 'control', encabezado: 'Control observable', celda: (control) => control.nombre },
    { clave: 'observable', encabezado: 'Lo que verifica el auditor', celda: (control) => control.observable?.enunciado ?? 'Control complementario sin observable propio.' },
    { clave: 'madurez', encabezado: 'Madurez 0-4', celda: (control) => {
      const fila = matriz.find((item) => item.control === control.id)
      return fila ? <RampaMadurez nivel={evaluacion.niveles[fila.id] ?? null} control={control.id} /> : 'Sin evaluar'
    } },
    { clave: 'puntuacion', encabezado: 'Puntuación 0-1', celda: (control) => {
      const fila = matriz.find((item) => item.control === control.id)
      return fila ? <span className={estilos.id}>{formatoPuntuacion(puntuaciones.get(fila.id) ?? 0)}</span> : 'Sin evaluar'
    } },
    { clave: 'riesgos', encabezado: 'Riesgos', celda: (control) => <ListaRefs ids={control.riesgos} /> },
  ]

  const columnasMatriz: ColumnaTabular<FilaMatriz>[] = [
    { clave: 'fila', encabezado: 'Fila', celda: (fila) => <span className={estilos.id}>{fila.id}</span> },
    { clave: 'tarea', encabezado: 'Tarea', celda: (fila) => <ListaRefs ids={[fila.tarea]} /> },
    { clave: 'riesgo', encabezado: 'Riesgo', celda: (fila) => <ListaRefs ids={[fila.riesgo]} /> },
    { clave: 'control', encabezado: 'Control observable', celda: (fila) => <ListaRefs ids={[fila.control]} /> },
    { clave: 'criterio', encabezado: 'Criterio', celda: (fila) => fila.criterio },
    { clave: 'nivel', encabezado: 'Nivel 0-4', celda: (fila) => <RampaMadurez nivel={evaluacion.niveles[fila.id] ?? null} control={fila.control} /> },
    { clave: 'puntuacion', encabezado: 'Puntuación 0-1', celda: (fila) => <span className={estilos.id}>{formatoPuntuacion(puntuaciones.get(fila.id) ?? 0)}</span> },
    { clave: 'estado', encabezado: 'Estado', celda: (fila) => <LamparaEstado valor={estadoDeNivel(evaluacion.niveles[fila.id] ?? null)} /> },
    {
      clave: 'evidencias', encabezado: 'Evidencias documentadas', celda: (fila) => (
        <ul className={estilos.evidencias}>
          {fila.evidenciasRequeridas.map((evidencia) => {
            const respuesta = evaluacion.respuestasEvidencia[fila.id]?.[evidencia.id]
            return (
              <li key={evidencia.id}>
                <strong>{evidencia.titulo}:</strong> {respuesta?.respuesta ?? 'Sin responder'}
                {respuesta?.nota && <span className={estilos.notaEvidencia}>{respuesta.nota}</span>}
              </li>
            )
          })}
        </ul>
      ),
    },
  ]

  const columnasPruebas: ColumnaTabular<Prueba>[] = [
    { clave: 'id', encabezado: 'ID', celda: (prueba) => <span className={estilos.id}>{prueba.id}</span> },
    { clave: 'prueba', encabezado: 'Prueba', celda: (prueba) => prueba.nombre },
    { clave: 'esperado', encabezado: 'Resultado esperado', celda: (prueba) => prueba.resultadoEsperado },
    { clave: 'resultado', encabezado: 'Resultado', celda: (prueba) => <LamparaEstado valor={evaluacion.respuestasPruebas[prueba.id]?.respuesta ?? 'Sin documentar'} /> },
    { clave: 'observado', encabezado: 'Resultado observado', celda: (prueba) => evaluacion.respuestasPruebas[prueba.id]?.nota || 'Sin documentar' },
    { clave: 'controles', encabezado: 'Controles observables', celda: (prueba) => <ListaRefs ids={prueba.controles} /> },
  ]

  const columnasHallazgos: ColumnaTabular<Hallazgo>[] = [
    { clave: 'id', encabezado: 'ID', celda: (hallazgo) => <span className={estilos.id}>{hallazgo.id}</span> },
    { clave: 'hallazgo', encabezado: 'Hallazgo', celda: (hallazgo) => hallazgo.titulo },
    { clave: 'control', encabezado: 'Controles observables', celda: (hallazgo) => <ListaRefs ids={hallazgo.controles} /> },
    { clave: 'riesgo', encabezado: 'Riesgo', celda: (hallazgo) => <ListaRefs ids={hallazgo.riesgos} /> },
    { clave: 'prioridad', encabezado: 'Prioridad', celda: (hallazgo) => <LamparaEstado valor={hallazgo.prioridad} /> },
    { clave: 'recomendacion', encabezado: 'Recomendación', celda: (hallazgo) => hallazgo.recomendacion },
  ]

  const exportar = () => {
    const fecha = new Date(registro.fechaGuardado)
    descargarArchivo(nombreArchivoEvaluacion(evaluacion.organizacion, fecha), JSON.stringify(construirArchivo(evaluacion, fecha), null, 2), 'application/json')
  }

  return (
    <Pagina
      titulo={nombreOrganizacion(registro)}
      introduccion={`Evaluación guardada el ${fechaGuardada(registro)}; vista de solo lectura que conserva el estado tal como estaba al guardar.${registro.demostracion ? ' Datos simulados para mostrar el funcionamiento del software.' : ''}`}
    >
      <div className={estilos.acciones}>
        <Link to="/historial" className="pulsador"><ArrowLeftIcon aria-hidden="true" /> Volver al historial</Link>
        <button type="button" className="pulsador" onClick={exportar}><DownloadSimpleIcon aria-hidden="true" /> Exportar JSON</button>
        <BotonConfirmacion
          etiqueta="Restaurar evaluación"
          titulo="¿Restaurar esta evaluación?"
          etiquetaConfirmar="Sí, restaurar"
          alConfirmar={() => {
            if (restaurarEvaluacion(registro.id)) navegar('/matriz')
          }}
          icono={<ArrowUUpLeftIcon aria-hidden="true" />}
        >
          <p>Reemplazará la evaluación en curso con este guardado. Los demás elementos del historial permanecerán disponibles.</p>
        </BotonConfirmacion>
        <BotonConfirmacion
          etiqueta="Eliminar guardado"
          titulo="¿Eliminar esta evaluación del historial?"
          etiquetaConfirmar="Sí, eliminar"
          alConfirmar={() => {
            const resultado = eliminarEvaluacion(registro.id)
            if (resultado.ok) navegar('/historial')
          }}
          icono={<TrashIcon aria-hidden="true" />}
        >
          <p>Se eliminará esta instantánea del navegador. La evaluación en curso no cambiará.</p>
        </BotonConfirmacion>
      </div>

      <section className={estilos.resumen} aria-label="Resumen de la evaluación guardada">
        <p>Matriz completa: {matriz.length} de {matriz.length} filas.</p>
        <p className={estilos.salud}><span>Salud:</span> <Lampara tono={salud === 'Verde' ? 'verde' : salud === 'Amarillo' ? 'ambar' : 'roja'} texto={salud} /> <span>{formatoPuntuacion(saludNumerica)} de 1</span></p>
        <p><LamparaEstado valor="Cumple" /> {conteo.Cumple} <LamparaEstado valor="Parcial" /> {conteo.Parcial} <LamparaEstado valor="No cumple" /> {conteo['No cumple']}</p>
        <p>Batería: {pruebasHechas} de {pruebas.length} pruebas documentadas. Hallazgos: {hallazgos.length}.</p>
      </section>
      <p className={estilos.nota}>Cada puntuación de control combina el nivel de madurez (0 a 4) con sus evidencias documentadas; el promedio determina la salud de la evaluación.</p>

      <nav className={estilos.anclas} aria-label="Secciones de la evaluación guardada">
        {[
          ['cedula', 'Cédula de trazabilidad'],
          ['riesgos', 'Riesgos'],
          ['tareas', 'Tareas'],
          ['controles', 'Controles observables'],
          ['matriz', 'Matriz'],
          ['pruebas', 'Batería de pruebas'],
          ['hallazgos', 'Hallazgos'],
        ].map(([seccion, titulo]) => <button key={seccion} type="button" className="pulsador" data-compacto="" onClick={() => irA(`historial-${seccion}`)}>{titulo}</button>)}
      </nav>

      <section id="historial-cedula" className={estilos.seccion} aria-labelledby="titulo-historial-cedula">
        <h2 id="titulo-historial-cedula">Cédula de trazabilidad</h2>
        <CedulaTrazabilidad />
      </section>

      <section id="historial-riesgos" className={estilos.seccion} aria-labelledby="titulo-historial-riesgos">
        <h2 id="titulo-historial-riesgos">Riesgos</h2>
        <PanelRiesgos nivelTitulo={3} />
      </section>

      <section id="historial-tareas" className={estilos.seccion} aria-labelledby="titulo-historial-tareas">
        <h2 id="titulo-historial-tareas">Tareas</h2>
        <PanelTareas />
      </section>

      <section id="historial-controles" className={estilos.seccion} aria-labelledby="titulo-historial-controles">
        <h2 id="titulo-historial-controles">Controles observables</h2>
        <ComponenteTabular etiqueta="Controles observables de la evaluación guardada" columnas={columnasControles} filas={controles} idDe={(control) => control.id} nombreDe={(control) => control.nombre} alSeleccionar={abrirReferencia} vacio="No hay controles observables." />
      </section>

      <section id="historial-matriz" className={estilos.seccion} aria-labelledby="titulo-historial-matriz">
        <h2 id="titulo-historial-matriz">Matriz de evaluación</h2>
        <ComponenteTabular etiqueta="Matriz de la evaluación guardada" columnas={columnasMatriz} filas={matriz} idDe={(fila) => fila.id} nombreDe={(fila) => fila.id} alSeleccionar={abrirReferencia} vacio="No hay filas guardadas." />
      </section>

      <section id="historial-pruebas" className={estilos.seccion} aria-labelledby="titulo-historial-pruebas">
        <h2 id="titulo-historial-pruebas">Batería de pruebas</h2>
        <ComponenteTabular etiqueta="Pruebas de la evaluación guardada" columnas={columnasPruebas} filas={pruebas} idDe={(prueba) => prueba.id} nombreDe={(prueba) => prueba.nombre} alSeleccionar={abrirReferencia} vacio="No hay pruebas guardadas." />
      </section>

      <section id="historial-hallazgos" className={estilos.seccion} aria-labelledby="titulo-historial-hallazgos">
        <h2 id="titulo-historial-hallazgos">Hallazgos</h2>
        <ComponenteTabular etiqueta="Hallazgos de la evaluación guardada" columnas={columnasHallazgos} filas={hallazgos} idDe={(hallazgo) => hallazgo.id} nombreDe={(hallazgo) => hallazgo.titulo} alSeleccionar={abrirReferencia} vacio="Esta evaluación no generó hallazgos." />
      </section>
    </Pagina>
  )
}
