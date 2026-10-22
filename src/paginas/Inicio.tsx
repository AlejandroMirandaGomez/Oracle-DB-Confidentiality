import { ArrowRightIcon, EraserIcon, LockSimpleIcon } from '@phosphor-icons/react'
import { useEffect, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { ArchivoEvaluacion } from '../componentes/ArchivoEvaluacion'
import { BotonConfirmacion } from '../componentes/BotonConfirmacion'
import { Lampara, PuntoLampara } from '../componentes/Lampara'
import type { Tono } from '../componentes/tonosLampara'
import { proyecto } from '../data/catalogo/proyecto'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import estilos from './Inicio.module.css'

type EstadoPaso = { tono: Tono; texto: string; avance?: string; bloqueado?: boolean }

type Paso = { ruta: string; nombre: string; frase: string; estado: EstadoPaso }

type Apoyo = { ruta: string; nombre: string; frase: string }

const apoyo: Apoyo[] = [
  { ruta: '/marco-teorico', nombre: 'Marco teórico', frase: 'Los conceptos que sostienen la norma y los controles, con sus referencias en APA 7.' },
  { ruta: '/uso-ia', nombre: 'Uso de IA', frase: 'La declaración del uso de inteligencia artificial en este trabajo.' },
  { ruta: '/ejemplos', nombre: 'Ejemplos', frase: 'Una evaluación real de solo lectura para ver cómo termina el recorrido.' },
]

export function Inicio() {
  const { pasosVistos, progresoMatriz, progresoBateria, matrizCompleta, bateriaCompleta, hallazgos, hayDatos, limpiarAvance } = useEvaluacion()
  useEffect(() => {
    document.title = proyecto.titulo
  }, [])

  const lectura = (paso: string): EstadoPaso =>
    pasosVistos.includes(paso) ? { tono: 'verde', texto: 'Visto' } : { tono: 'apagada', texto: 'Sin iniciar' }

  const avance = (hechas: number, total: number, completa: boolean, unidad: string): EstadoPaso => {
    if (completa) return { tono: 'verde', texto: 'Completa', avance: `${total} de ${total} ${unidad}` }
    if (hechas > 0) return { tono: 'ambar', texto: 'En curso', avance: `${hechas} de ${total} ${unidad}` }
    return { tono: 'apagada', texto: 'Sin iniciar', avance: `0 de ${total} ${unidad}` }
  }

  const estadoHallazgos: EstadoPaso = !matrizCompleta
    ? { tono: 'apagada', texto: 'Bloqueada', avance: 'Requiere la matriz completa', bloqueado: true }
    : pasosVistos.includes('hallazgos')
      ? { tono: 'verde', texto: 'Revisados', avance: `${hallazgos.length} ${hallazgos.length === 1 ? 'hallazgo' : 'hallazgos'}` }
      : { tono: 'ambar', texto: 'Listos', avance: `${hallazgos.length} ${hallazgos.length === 1 ? 'hallazgo' : 'hallazgos'}` }

  const pasos: Paso[] = [
    { ruta: '/riesgos', nombre: 'Riesgos', frase: 'Entienda los cinco riesgos de confidencialidad y cómo se valoran.', estado: lectura('riesgos') },
    { ruta: '/tareas', nombre: 'Tareas', frase: 'Conozca las 13 tareas críticas del DBA por fase del ciclo PHVA.', estado: lectura('tareas') },
    { ruta: '/controles', nombre: 'Controles', frase: 'Elija los controles ISO/IEC 27001:2022 que mitigan cada riesgo.', estado: lectura('controles') },
    {
      ruta: '/matriz',
      nombre: 'Matriz',
      frase: 'Evalúe la madurez de 18 filas con las evidencias que cada una requiere.',
      estado: avance(progresoMatriz.hechas, progresoMatriz.total, matrizCompleta, 'filas'),
    },
    {
      ruta: '/pruebas',
      nombre: 'Batería',
      frase: 'Ejecute 23 pruebas técnicas y documente lo que observa.',
      estado: avance(progresoBateria.hechas, progresoBateria.total, bateriaCompleta, 'pruebas'),
    },
    { ruta: '/hallazgos', nombre: 'Hallazgos', frase: 'Reciba hallazgos priorizados y un plan de acción con su remediación.', estado: estadoHallazgos },
  ]

  return (
    <div className={estilos.inicio}>
      <section className={estilos.portada} aria-labelledby="titulo-inicio">
        <div className={estilos.mensaje}>
          <h1 id="titulo-inicio" className={estilos.titular}>
            {proyecto.titulo}
          </h1>
          <p className={estilos.descripcion}>
            Herramientas y conocimiento para identificar los riesgos de confidencialidad de una base de datos Oracle, medir la madurez de sus controles y aplicar ISO/IEC 27002:2022 con un plan de acción a la medida.
          </p>
          <div className={estilos.llamada}>
            <Link to="/riesgos" className={`pulsador ${estilos.comenzar}`} data-principal="">
              Comenzar el diagnóstico
              <ArrowRightIcon weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className={estilos.placa} role="group" aria-label="Créditos">
          <p className={estilos.placaAutor}>{proyecto.autor}</p>
          <p>{proyecto.universidad}</p>
          <p>{proyecto.escuela}</p>
          <p>{proyecto.curso}</p>
          <p>{proyecto.profesor}</p>
          <p>{proyecto.periodo}</p>
        </div>
      </section>

      <section className={estilos.bloque} aria-labelledby="titulo-herramientas">
        <div className={estilos.encabezado}>
          <h2 id="titulo-herramientas" className={estilos.subtitulo}>
            Herramientas
          </h2>
          <div className={estilos.apoyoConAccion}>
            <p className={estilos.apoyo}>Siga el recorrido en orden. Su avance se guarda en este navegador y se puede exportar.</p>
            <BotonConfirmacion
              etiqueta="Limpiar avance"
              titulo="¿Limpiar todo el avance?"
              etiquetaConfirmar="Sí, limpiar avance"
              deshabilitado={!hayDatos && pasosVistos.length === 0}
              alConfirmar={limpiarAvance}
              icono={<EraserIcon aria-hidden="true" />}
            >
              <p>Se borrarán los niveles de la matriz, las respuestas de evidencias, los resultados de la batería y los pasos marcados como vistos.</p>
              <p>Si quiere conservar su evaluación, expórtela antes de continuar.</p>
            </BotonConfirmacion>
          </div>
        </div>
        <ol className={estilos.pasos}>
          {pasos.map((paso, posicion) => (
            <li key={paso.ruta} className={estilos.paso} style={{ '--posicion': posicion } as CSSProperties}>
              <span className={estilos.numero} aria-hidden="true">
                {posicion + 1}
              </span>
              <div className={estilos.texto}>
                <Link to={paso.ruta} className={estilos.enlacePaso}>
                  {paso.nombre}
                </Link>
                <p>{paso.frase}</p>
              </div>
              <div className={estilos.estado}>
                {paso.estado.bloqueado ? (
                  <span className={estilos.bloqueada}>
                    <LockSimpleIcon aria-hidden="true" />
                    <Lampara tono={paso.estado.tono} texto={paso.estado.texto} />
                  </span>
                ) : (
                  <Lampara tono={paso.estado.tono} texto={paso.estado.texto} />
                )}
                {paso.estado.avance && <span className={estilos.avance}>{paso.estado.avance}</span>}
              </div>
            </li>
          ))}
        </ol>
        <div className={estilos.retomar}>
          <p className={estilos.apoyo}>Retome una evaluación guardada o descargue la suya para conservarla.</p>
          <ArchivoEvaluacion />
        </div>
      </section>

      <section className={estilos.bloque} aria-labelledby="titulo-apoyo">
        <div className={estilos.encabezado}>
          <h2 id="titulo-apoyo" className={estilos.subtitulo}>
            Material de apoyo
          </h2>
        </div>
        <ul className={estilos.listaApoyo}>
          {apoyo.map((elemento) => (
            <li key={elemento.ruta} className={estilos.elementoApoyo}>
              <PuntoLampara tono="apagada" />
              <Link to={elemento.ruta} className={estilos.enlacePaso}>
                {elemento.nombre}
              </Link>
              <p>{elemento.frase}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
