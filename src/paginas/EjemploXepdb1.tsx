import { CaretRightIcon } from '@phosphor-icons/react'
import { BloqueCodigo } from '../componentes/BloqueCodigo'
import { CedulaTrazabilidad } from '../componentes/CedulaTrazabilidad'
import { ComponenteTabular, type ColumnaTabular } from '../componentes/ComponenteTabular'
import { LamparaEstado } from '../componentes/Lampara'
import { Pagina } from '../componentes/Pagina'
import { PanelRiesgos } from '../componentes/PanelRiesgos'
import { PanelTareas } from '../componentes/PanelTareas'
import { RampaMadurez } from '../componentes/RampaMadurez'
import { ListaRefs } from '../componentes/Ref'
import { estadoDeNivel } from '../data/catalogo/escalas'
import { entidad } from '../data/ejemplos/xepdb1/entidad'
import { hallazgos } from '../data/ejemplos/xepdb1/hallazgos'
import { matriz } from '../data/ejemplos/xepdb1/matriz'
import { pruebas } from '../data/ejemplos/xepdb1/pruebas'
import type { Control, FilaMatrizEjemplo, HallazgoEjemplo, PruebaEjemplo } from '../data/tipos'
import { conteoDeEstados, conteoDeVeredictos } from '../estado/calculos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { irA } from '../estado/desplazamiento'
import { useIndice } from '../estado/fuente'
import { useNivelDe } from '../estado/useNivelDe'
import { evidenciaDe } from '../recursos'
import estilos from './EjemploXepdb1.module.css'

const secciones = [
  { id: 'cedula', titulo: 'Cédula de trazabilidad' },
  { id: 'riesgos', titulo: 'Riesgos' },
  { id: 'tareas', titulo: 'Tareas' },
  { id: 'controles', titulo: 'Controles' },
  { id: 'matriz', titulo: 'Matriz' },
  { id: 'bateria', titulo: 'Batería de pruebas' },
  { id: 'hallazgos', titulo: 'Hallazgos' },
]

const columnasControles = (observableDe: ReturnType<typeof useIndice>['observableDeControl']): ColumnaTabular<Control>[] => [
  { clave: 'id', encabezado: 'ID', celda: (control) => <span className={estilos.id}>{control.id}</span> },
  { clave: 'control', encabezado: 'Control', celda: (control) => <span className={estilos.nombre}>{control.nombre}</span> },
  {
    clave: 'observable',
    encabezado: 'Lo que verifica el auditor',
    celda: (control) => <span className={estilos.texto}>{control.observable?.enunciado ?? 'Control complementario sin observable propio.'}</span>,
  },
  {
    clave: 'veredicto',
    encabezado: 'Veredicto',
    celda: (control) => {
      const observable = observableDe(control.id)
      return observable ? <LamparaEstado valor={observable.veredicto} /> : <LamparaEstado valor="Sin evaluar" texto="Sin observable" />
    },
  },
]

const columnasMatriz: ColumnaTabular<FilaMatrizEjemplo>[] = [
  { clave: 'id', encabezado: 'Fila', celda: (fila) => <span className={estilos.id}>{fila.id}</span> },
  { clave: 'control', encabezado: 'Control', celda: (fila) => <ListaRefs ids={[fila.control]} /> },
  { clave: 'riesgo', encabezado: 'Riesgo', celda: (fila) => <ListaRefs ids={[fila.riesgo]} /> },
  { clave: 'criterio', encabezado: 'Criterio', celda: (fila) => <span className={estilos.texto}>{fila.criterio}</span> },
  { clave: 'nivel', encabezado: 'Nivel 0-4', celda: (fila) => <RampaMadurez nivel={fila.nivel} /> },
  { clave: 'evidencia', encabezado: 'Evidencia', celda: (fila) => <span className={estilos.texto}>{fila.evidencia}</span> },
  { clave: 'estado', encabezado: 'Estado', celda: (fila) => <LamparaEstado valor={estadoDeNivel(fila.nivel)} /> },
]

const columnasPruebas: ColumnaTabular<PruebaEjemplo>[] = [
  { clave: 'id', encabezado: 'ID', celda: (prueba) => <span className={estilos.id}>{prueba.id}</span> },
  {
    clave: 'prueba',
    encabezado: 'Prueba',
    celda: (prueba) => (
      <span className={estilos.apilado}>
        <span className={estilos.nombre}>{prueba.nombre}</span>
        <span className={estilos.nota}>
          {prueba.tipo}, {prueba.herramienta}
        </span>
      </span>
    ),
  },
  { clave: 'esperado', encabezado: 'Esperado', celda: (prueba) => <span className={estilos.texto}>{prueba.resultadoEsperado}</span> },
  { clave: 'obtenido', encabezado: 'Obtenido', celda: (prueba) => <span className={estilos.texto}>{prueba.resultadoObtenido}</span> },
  { clave: 'veredicto', encabezado: 'Veredicto', celda: (prueba) => <LamparaEstado valor={prueba.veredicto} /> },
  { clave: 'controles', encabezado: 'Controles', celda: (prueba) => <ListaRefs ids={prueba.controles} /> },
]

const columnasHallazgos: ColumnaTabular<HallazgoEjemplo>[] = [
  { clave: 'id', encabezado: 'ID', celda: (hallazgo) => <span className={estilos.id}>{hallazgo.id}</span> },
  { clave: 'hallazgo', encabezado: 'Hallazgo', celda: (hallazgo) => <span className={estilos.nombre}>{hallazgo.titulo}</span> },
  { clave: 'control', encabezado: 'Controles', celda: (hallazgo) => <ListaRefs ids={hallazgo.controles} /> },
  { clave: 'riesgo', encabezado: 'Riesgo', celda: (hallazgo) => <ListaRefs ids={hallazgo.riesgos} /> },
  { clave: 'prioridad', encabezado: 'Prioridad', celda: (hallazgo) => <LamparaEstado valor={hallazgo.prioridad} /> },
]

export function EjemploXepdb1() {
  const { abrirReferencia } = useEvaluacion()
  const indice = useIndice()
  const nivelDe = useNivelDe()
  const estados = conteoDeEstados(
    matriz.map((fila) => fila.id),
    nivelDe,
  )
  const veredictos = conteoDeVeredictos(pruebas.map((prueba) => prueba.veredicto))
  const preparacion = evidenciaDe('00_preparacion')
  const limpieza = evidenciaDe('99_limpieza')

  return (
    <Pagina
      titulo="Ejemplo XEPDB1"
      introduccion="Evaluación real de una instancia Oracle 21c XE, de solo lectura. Muestra cómo termina el recorrido completo: riesgos, tareas, controles, matriz, batería ejecutada y hallazgos."
    >
      <section className={estilos.ficha} aria-labelledby="titulo-entidad">
        <h2 id="titulo-entidad" className={estilos.subtitulo}>
          Entidad evaluada
        </h2>
        <dl className={estilos.datos}>
          <div>
            <dt className="rotulo">Motor</dt>
            <dd>
              {entidad.motor} {entidad.version}
            </dd>
          </div>
          <div>
            <dt className="rotulo">Contenedor</dt>
            <dd className={estilos.mono}>CDB XE, PDB {entidad.pdb}</dd>
          </div>
          <div>
            <dt className="rotulo">Fecha de evaluación</dt>
            <dd className={estilos.mono}>
              {entidad.fechaEjecucion} {entidad.horaEjecucion}
            </dd>
          </div>
          <div>
            <dt className="rotulo">Herramientas</dt>
            <dd>{entidad.herramientas.join(', ')}</dd>
          </div>
        </dl>
        <p className={estilos.nota}>{entidad.notaDatos}</p>
        <nav className={estilos.anclas} aria-label="Secciones del ejemplo">
          {secciones.map((seccion) => (
            <button key={seccion.id} type="button" className="pulsador" data-compacto="" onClick={() => irA(`ejemplo-${seccion.id}`)}>
              {seccion.titulo}
            </button>
          ))}
        </nav>
      </section>

      <section id="ejemplo-cedula" className={estilos.seccion} aria-labelledby="titulo-cedula">
        <h2 id="titulo-cedula" className={estilos.subtitulo}>
          Cédula de trazabilidad
        </h2>
        <p className={estilos.resumen}>
          La matriz evalúa {matriz.length} filas: <LamparaEstado valor="Cumple" /> {estados.Cumple}, <LamparaEstado valor="Parcial" /> {estados.Parcial} y{' '}
          <LamparaEstado valor="No cumple" /> {estados['No cumple']}. De las {pruebas.length} pruebas, {veredictos.Conforme} son conformes, {veredictos.Parcial}{' '}
          parciales y {veredictos['No conforme']} no conformes.
        </p>
        <CedulaTrazabilidad />
        <p className={estilos.nota}>
          Residual = inherente × (1 − 0,8 × cobertura), donde la cobertura es el promedio de madurez de las filas de la matriz del riesgo dividido entre 4.
        </p>
      </section>

      <section id="ejemplo-riesgos" className={estilos.seccion} aria-labelledby="titulo-riesgos">
        <h2 id="titulo-riesgos" className={estilos.subtitulo}>
          Riesgos
        </h2>
        <PanelRiesgos nivelTitulo={3} />
      </section>

      <section id="ejemplo-tareas" className={estilos.seccion} aria-labelledby="titulo-tareas">
        <h2 id="titulo-tareas" className={estilos.subtitulo}>
          Tareas
        </h2>
        <PanelTareas />
      </section>

      <section id="ejemplo-controles" className={estilos.seccion} aria-labelledby="titulo-controles">
        <h2 id="titulo-controles" className={estilos.subtitulo}>
          Controles con su observable y veredicto
        </h2>
        <ComponenteTabular
          etiqueta="Controles ISO/IEC 27001:2022 con el veredicto de su observable"
          columnas={columnasControles(indice.observableDeControl)}
          filas={indice.controles}
          idDe={(control) => control.id}
          nombreDe={(control) => control.nombre}
          alSeleccionar={abrirReferencia}
          vacio="No hay controles para mostrar."
        />
      </section>

      <section id="ejemplo-matriz" className={estilos.seccion} aria-labelledby="titulo-matriz">
        <h2 id="titulo-matriz" className={estilos.subtitulo}>
          Matriz con nivel y evidencia
        </h2>
        <ComponenteTabular
          etiqueta="Matriz de evaluación de la instancia con su nivel de madurez y evidencia"
          columnas={columnasMatriz}
          filas={matriz}
          idDe={(fila) => fila.id}
          nombreDe={(fila) => fila.criterio}
          alSeleccionar={abrirReferencia}
          vacio="No hay filas para mostrar."
        />
      </section>

      <section id="ejemplo-bateria" className={estilos.seccion} aria-labelledby="titulo-bateria">
        <h2 id="titulo-bateria" className={estilos.subtitulo}>
          Batería de pruebas ejecutada
        </h2>
        <dl className={estilos.datos}>
          <div>
            <dt className="rotulo">Ejecución</dt>
            <dd className={estilos.mono}>
              {entidad.fechaEjecucion}, {entidad.horaEjecucion}
            </dd>
          </div>
          <div>
            <dt className="rotulo">Instancia</dt>
            <dd>
              {entidad.motor} {entidad.version}, PDB {entidad.pdb}
            </dd>
          </div>
          <div>
            <dt className="rotulo">Resultado</dt>
            <dd className={estilos.conteo}>
              <span>
                <LamparaEstado valor="Conforme" /> {veredictos.Conforme}
              </span>
              <span>
                <LamparaEstado valor="Parcial" /> {veredictos.Parcial}
              </span>
              <span>
                <LamparaEstado valor="No conforme" /> {veredictos['No conforme']}
              </span>
            </dd>
          </div>
        </dl>
        <p className={estilos.explicacion}>
          El script <code>scripts/ejecutar_bateria.ps1</code> crea un entorno de prueba aislado (usuarios, rol, perfil, tabla con datos sintéticos, políticas VPD, de redacción y de auditoría), ejecuta las pruebas en orden, guarda cada salida en <code>evidencias/</code> y al final elimina todos los objetos. Las contraseñas de los usuarios de prueba se generan al azar en cada ejecución y no se guardan.
        </p>
        <BloqueCodigo codigo="powershell -ExecutionPolicy Bypass -File scripts\ejecutar_bateria.ps1" titulo="Cómo repetir la batería" />
        <div className={estilos.extremos}>
          {preparacion && (
            <details className={estilos.desplegable}>
              <summary>
                <CaretRightIcon className={estilos.caret} aria-hidden="true" />
                Preparación del entorno de prueba
              </summary>
              <BloqueCodigo codigo={preparacion} titulo="evidencias/00_preparacion.txt" variante="listado" />
            </details>
          )}
          {limpieza && (
            <details className={estilos.desplegable}>
              <summary>
                <CaretRightIcon className={estilos.caret} aria-hidden="true" />
                Eliminación del entorno de prueba
              </summary>
              <BloqueCodigo codigo={limpieza} titulo="evidencias/99_limpieza.txt" variante="listado" />
            </details>
          )}
        </div>
        <ComponenteTabular
          etiqueta="Pruebas técnicas ejecutadas con su resultado esperado, obtenido y veredicto"
          columnas={columnasPruebas}
          filas={pruebas}
          idDe={(prueba) => prueba.id}
          nombreDe={(prueba) => prueba.nombre}
          alSeleccionar={abrirReferencia}
          vacio="No hay pruebas para mostrar."
        />
      </section>

      <section id="ejemplo-hallazgos" className={estilos.seccion} aria-labelledby="titulo-hallazgos">
        <h2 id="titulo-hallazgos" className={estilos.subtitulo}>
          Hallazgos
        </h2>
        <ComponenteTabular
          etiqueta="Hallazgos de la instancia con su prioridad"
          columnas={columnasHallazgos}
          filas={hallazgos}
          idDe={(hallazgo) => hallazgo.id}
          nombreDe={(hallazgo) => hallazgo.titulo}
          alSeleccionar={abrirReferencia}
          vacio="No hay hallazgos para mostrar."
        />
      </section>
    </Pagina>
  )
}
