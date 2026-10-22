import { CaretRightIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { BloqueCodigo } from '../componentes/BloqueCodigo'
import { Marca } from '../componentes/Marca'
import { Papel } from '../componentes/Papel'
import { ListaRefs } from '../componentes/Ref'
import { legajo } from '../data/legajo'
import { pruebas } from '../data/pruebas'
import type { TipoPrueba, Veredicto } from '../data/tipos'
import { conteoDeVeredictos } from '../estado/calculos'
import { useLegajo } from '../estado/LegajoProvider'
import { evidenciaDe } from '../recursos'
import estilos from './PapelPruebas.module.css'

type FiltroVeredicto = 'Todos' | Veredicto
type FiltroTipo = 'Todos' | TipoPrueba

const veredictos: FiltroVeredicto[] = ['Todos', 'Conforme', 'Parcial', 'No conforme']
const tipos: FiltroTipo[] = ['Todos', 'Consulta de configuración', 'Prueba funcional', 'Revisión de archivos', 'Validación con RMAN']

export function PapelPruebas() {
  const { abrirReferencia } = useLegajo()
  const [veredicto, setVeredicto] = useState<FiltroVeredicto>('Todos')
  const [tipo, setTipo] = useState<FiltroTipo>('Todos')
  const conteo = conteoDeVeredictos()
  const visibles = pruebas.filter(
    (prueba) => (veredicto === 'Todos' || prueba.veredicto === veredicto) && (tipo === 'Todos' || prueba.tipo === tipo),
  )
  const preparacion = evidenciaDe('00_preparacion')
  const limpieza = evidenciaDe('99_limpieza')

  return (
    <Papel
      letra="F"
      titulo="Batería de pruebas técnicas"
      objetivo="Veintitrés pruebas ejecutadas sobre la instancia, con su procedimiento, el resultado esperado, el resultado obtenido y la evidencia capturada. Cada fila abre el script y la salida completa."
    >
      <div className={estilos.ejecucion}>
        <dl className={estilos.ficha}>
          <div>
            <dt>Ejecución</dt>
            <dd>
              {legajo.fechaEjecucion}, {legajo.horaEjecucion}
            </dd>
          </div>
          <div>
            <dt>Instancia</dt>
            <dd>Oracle 21c XE {legajo.version}, PDB XEPDB1</dd>
          </div>
          <div>
            <dt>Resultado</dt>
            <dd className={estilos.conteo}>
              <span>
                <Marca valor="Conforme" conTexto={false} /> {conteo.Conforme}
              </span>
              <span>
                <Marca valor="Parcial" conTexto={false} /> {conteo.Parcial}
              </span>
              <span>
                <Marca valor="No conforme" conTexto={false} /> {conteo['No conforme']}
              </span>
            </dd>
          </div>
        </dl>
        <p className={estilos.metodo}>
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
      </div>

      <div className={estilos.filtros}>
        <div className={estilos.grupoFiltro} role="radiogroup" aria-label="Filtrar por veredicto">
          {veredictos.map((opcion) => (
            <button
              key={opcion}
              type="button"
              role="radio"
              aria-checked={veredicto === opcion}
              data-activo={veredicto === opcion || undefined}
              className={estilos.filtro}
              onClick={() => setVeredicto(opcion)}
            >
              {opcion}
            </button>
          ))}
        </div>
        <label className={estilos.selector}>
          <span>Tipo</span>
          <select value={tipo} onChange={(evento) => setTipo(evento.target.value as FiltroTipo)}>
            {tipos.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
        <span className={estilos.cuenta}>
          {visibles.length} de {pruebas.length}
        </span>
      </div>

      <ol className={estilos.lista}>
        {visibles.map((prueba) => (
          <li key={prueba.id} className={estilos.prueba}>
            <button type="button" className={estilos.cabeza} onClick={() => abrirReferencia(prueba.id)}>
              <span className={estilos.id}>{prueba.id}</span>
              <span className={estilos.nombre}>{prueba.nombre}</span>
              <span className={estilos.tipo}>
                {prueba.tipo}, {prueba.herramienta}
              </span>
            </button>
            <div className={estilos.comparacion}>
              <p>
                <span className={estilos.rotulo}>Esperado</span>
                {prueba.resultadoEsperado}
              </p>
              <p>
                <span className={estilos.rotulo}>Obtenido</span>
                {prueba.resultadoObtenido}
              </p>
            </div>
            <div className={estilos.cierre}>
              <Marca valor={prueba.veredicto} />
              <ListaRefs ids={prueba.controles} />
            </div>
          </li>
        ))}
      </ol>
      {visibles.length === 0 && <p className={estilos.vacio}>Ninguna prueba coincide con los filtros elegidos.</p>}
    </Papel>
  )
}
