import type { FasePhva, Tarea } from '../data/tipos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { useIndice } from '../estado/fuente'
import { ComponenteTabular, type ColumnaTabular, type GrupoTabular } from './ComponenteTabular'
import estilos from './PanelTareas.module.css'
import { ListaRefs } from './Ref'

const fases: { fase: FasePhva; sentido: string }[] = [
  { fase: 'Planificar', sentido: 'Decidir qué proteger' },
  { fase: 'Hacer', sentido: 'Configurar el control' },
  { fase: 'Verificar', sentido: 'Comprobar que funciona' },
  { fase: 'Actuar', sentido: 'Corregir y eliminar' },
]

const columnas: ColumnaTabular<Tarea>[] = [
  { clave: 'id', encabezado: 'ID', celda: (tarea) => <span className={estilos.id}>{tarea.id}</span> },
  {
    clave: 'tarea',
    encabezado: 'Tarea',
    celda: (tarea) => (
      <span className={estilos.tarea}>
        <span className={estilos.nombre}>{tarea.nombre}</span>
        <span className={estilos.descripcion}>{tarea.descripcion}</span>
      </span>
    ),
  },
  { clave: 'frecuencia', encabezado: 'Frecuencia', celda: (tarea) => tarea.frecuencia },
  { clave: 'controles', encabezado: 'Controles', celda: (tarea) => <ListaRefs ids={tarea.controles} /> },
]

export function PanelTareas() {
  const { abrirReferencia } = useEvaluacion()
  const { tareas } = useIndice()
  const grupos: GrupoTabular[] = fases.map(({ fase, sentido }) => {
    const cantidad = tareas.filter((tarea) => tarea.fase === fase).length
    return { id: fase, titulo: fase, detalle: `${sentido}, ${cantidad} ${cantidad === 1 ? 'tarea' : 'tareas'}` }
  })

  return (
    <ComponenteTabular
      etiqueta="Tareas del DBA por fase del ciclo PHVA"
      columnas={columnas}
      filas={tareas}
      idDe={(tarea) => tarea.id}
      nombreDe={(tarea) => tarea.nombre}
      alSeleccionar={abrirReferencia}
      grupos={grupos}
      grupoDe={(tarea) => tarea.fase}
      vacio="No hay tareas para mostrar."
    />
  )
}
