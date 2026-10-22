import { Papel } from '../componentes/Papel'
import { ListaRefs } from '../componentes/Ref'
import { tareas } from '../data/tareas'
import type { FasePhva } from '../data/tipos'
import { useLegajo } from '../estado/LegajoProvider'
import estilos from './PapelTareas.module.css'

const fases: { fase: FasePhva; sentido: string }[] = [
  { fase: 'Planificar', sentido: 'Decidir qué proteger' },
  { fase: 'Hacer', sentido: 'Configurar el control' },
  { fase: 'Verificar', sentido: 'Comprobar que funciona' },
  { fase: 'Actuar', sentido: 'Corregir y eliminar' },
]

export function PapelTareas() {
  const { abrirReferencia } = useLegajo()
  return (
    <Papel
      letra="B"
      titulo="Tareas críticas del DBA"
      objetivo="Las 13 tareas del DBA que tocan la confidencialidad, ordenadas por la fase del ciclo PHVA en que ocurren. Incluyen las 12 que pide el enunciado y la clasificación de datos que las precede."
    >
      <div className={estilos.columnas}>
        {fases.map(({ fase, sentido }) => {
          const deLaFase = tareas.filter((tarea) => tarea.fase === fase)
          return (
            <section key={fase} className={estilos.columna} aria-labelledby={`fase-${fase}`}>
              <header className={estilos.cabecera}>
                <h3 id={`fase-${fase}`} className={estilos.fase}>
                  {fase}
                </h3>
                <p className={estilos.sentido}>
                  {sentido}, {deLaFase.length} {deLaFase.length === 1 ? 'tarea' : 'tareas'}
                </p>
              </header>
              <ol className={estilos.lista}>
                {deLaFase.map((tarea) => (
                  <li key={tarea.id} className={estilos.tarea}>
                    <button type="button" className={estilos.titulo} onClick={() => abrirReferencia(tarea.id)}>
                      <span className={estilos.id}>{tarea.id}</span>
                      <span className={estilos.nombre}>{tarea.nombre}</span>
                    </button>
                    <p className={estilos.descripcion}>{tarea.descripcion}</p>
                    <p className={estilos.frecuencia}>{tarea.frecuencia}</p>
                    <div className={estilos.refs}>
                      <ListaRefs ids={tarea.controles} />
                      <span className={estilos.separador} aria-hidden="true" />
                      <ListaRefs ids={tarea.riesgos} />
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </div>
    </Papel>
  )
}
