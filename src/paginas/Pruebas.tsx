import { CaretRightIcon, EraserIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { BloqueCodigo } from '../componentes/BloqueCodigo'
import { BotonConfirmacion } from '../componentes/BotonConfirmacion'
import { ComponenteTabular, type ColumnaTabular } from '../componentes/ComponenteTabular'
import { LamparaEstado } from '../componentes/Lampara'
import { LeyendaLamparas } from '../componentes/LeyendaLamparas'
import { Pagina } from '../componentes/Pagina'
import { ListaRefs } from '../componentes/Ref'
import { limpieza } from '../data/catalogo/limpieza'
import { preparacion } from '../data/catalogo/preparacion'
import { pruebas } from '../data/catalogo/pruebas'
import type { Prueba, RespuestaPrueba, TipoPrueba } from '../data/tipos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import estilos from './Pruebas.module.css'

type FiltroResultado = 'Todos' | RespuestaPrueba | 'Sin documentar'
type FiltroTipo = 'Todos' | TipoPrueba

const resultados: FiltroResultado[] = ['Todos', 'Conforme', 'Parcial', 'No conforme', 'Sin documentar']
const tipos: FiltroTipo[] = ['Todos', 'Consulta de configuración', 'Prueba funcional', 'Revisión de archivos', 'Validación con RMAN']

const funcionales = ['PR-07', 'PR-09', 'PR-10', 'PR-11', 'PR-13', 'PR-15', 'PR-21']

export function Pruebas() {
  const { abrirReferencia, respuestaPrueba, progresoBateria, limpiarBateria, bateriaCompleta, marcarPasoVisto } = useEvaluacion()
  const [resultado, setResultado] = useState<FiltroResultado>('Todos')
  const [tipo, setTipo] = useState<FiltroTipo>('Todos')

  useEffect(() => marcarPasoVisto('pruebas'), [marcarPasoVisto])

  const visibles = pruebas.filter((prueba) => {
    const respuesta = respuestaPrueba(prueba.id).respuesta
    const coincideResultado = resultado === 'Todos' || (resultado === 'Sin documentar' ? respuesta === null : respuesta === resultado)
    return coincideResultado && (tipo === 'Todos' || prueba.tipo === tipo)
  })

  const columnas: ColumnaTabular<Prueba>[] = [
    { clave: 'id', encabezado: 'ID', celda: (prueba) => <span className={estilos.id}>{prueba.id}</span> },
    {
      clave: 'prueba',
      encabezado: 'Prueba',
      celda: (prueba) => (
        <span className={estilos.prueba}>
          <span className={estilos.nombre}>{prueba.nombre}</span>
          <span className={estilos.tipo}>
            {prueba.tipo}, {prueba.herramienta}
          </span>
        </span>
      ),
    },
    { clave: 'esperado', encabezado: 'Esperado', celda: (prueba) => <span className={estilos.texto}>{prueba.resultadoEsperado}</span> },
    {
      clave: 'obtenido',
      encabezado: 'Obtenido',
      celda: (prueba) => {
        const nota = respuestaPrueba(prueba.id).nota.trim()
        return nota === '' ? <span className={estilos.vacio}>Sin documentar</span> : <span className={estilos.texto}>{nota}</span>
      },
    },
    { clave: 'resultado', encabezado: 'Resultado', celda: (prueba) => <LamparaEstado valor={respuestaPrueba(prueba.id).respuesta ?? 'Sin documentar'} /> },
    { clave: 'controles', encabezado: 'Controles', celda: (prueba) => <ListaRefs ids={prueba.controles} /> },
  ]

  return (
    <Pagina
      titulo="Batería de pruebas técnicas"
      introduccion="Veintitrés pruebas para comprobar la confidencialidad en su base Oracle. Ejecute cada una en un entorno de prueba, documente el resultado observado y obtenga hallazgos más precisos."
    >
      <section className={estilos.extremo} aria-labelledby="paso-preparar">
        <h2 id="paso-preparar" className={estilos.subtitulo}>
          {preparacion.titulo}
        </h2>
        <p className={estilos.explicacion}>
          {preparacion.descripcion} Las pruebas funcionales ({funcionales.join(', ')}) necesitan este entorno; las consultas de configuración no.
        </p>
        <details className={estilos.desplegable}>
          <summary>
            <CaretRightIcon className={estilos.caret} aria-hidden="true" />
            Ver el SQL de preparación
          </summary>
          <BloqueCodigo codigo={preparacion.sql} titulo="SQL de preparación" />
        </details>
      </section>

      <section className={estilos.progreso} aria-label="Progreso de la batería">
        <p className={estilos.cuenta} aria-live="polite">
          {progresoBateria.hechas} de {progresoBateria.total} pruebas documentadas
        </p>
        <p className={estilos.aviso}>
          {bateriaCompleta
            ? 'La batería está completa: los hallazgos incorporan sus resultados.'
            : 'Complete la batería de pruebas para obtener hallazgos más precisos.'}
        </p>
        <BotonConfirmacion
          etiqueta="Limpiar batería"
          etiquetaConfirmacion="Confirmar limpieza"
          deshabilitado={progresoBateria.hechas === 0}
          alConfirmar={limpiarBateria}
          icono={<EraserIcon aria-hidden="true" />}
        />
      </section>

      <LeyendaLamparas tipo="bateria" />

      <div className={estilos.filtros}>
        <div className={estilos.grupoFiltro} role="radiogroup" aria-label="Filtrar por resultado">
          {resultados.map((opcion) => (
            <button key={opcion} type="button" role="radio" aria-checked={resultado === opcion} className="pulsador" data-compacto="" onClick={() => setResultado(opcion)}>
              {opcion}
            </button>
          ))}
        </div>
        <label className={estilos.selector}>
          <span className="rotulo">Tipo</span>
          <select className="control-texto" value={tipo} onChange={(evento) => setTipo(evento.target.value as FiltroTipo)}>
            {tipos.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
        <span className={estilos.visibles}>
          {visibles.length} de {pruebas.length}
        </span>
      </div>

      <ComponenteTabular
        etiqueta="Pruebas técnicas con su resultado esperado, resultado observado y veredicto"
        columnas={columnas}
        filas={visibles}
        idDe={(prueba) => prueba.id}
        nombreDe={(prueba) => prueba.nombre}
        alSeleccionar={abrirReferencia}
        vacio="Ninguna prueba coincide con los filtros elegidos."
      />

      <section className={estilos.extremo} aria-labelledby="paso-eliminar">
        <h2 id="paso-eliminar" className={estilos.subtitulo}>
          {limpieza.titulo}
        </h2>
        <p className={estilos.explicacion}>{limpieza.descripcion}</p>
        <details className={estilos.desplegable}>
          <summary>
            <CaretRightIcon className={estilos.caret} aria-hidden="true" />
            Ver el SQL de limpieza
          </summary>
          <BloqueCodigo codigo={limpieza.sql} titulo="SQL de limpieza" />
        </details>
      </section>
    </Pagina>
  )
}
