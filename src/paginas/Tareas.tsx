import { useEffect } from 'react'
import { Pagina } from '../componentes/Pagina'
import { PanelTareas } from '../componentes/PanelTareas'
import { useEvaluacion } from '../estado/contextoEvaluacion'

export function Tareas() {
  const { marcarPasoVisto } = useEvaluacion()

  useEffect(() => marcarPasoVisto('tareas'), [marcarPasoVisto])

  return (
    <Pagina
      titulo="Tareas críticas del DBA"
      introduccion="Las 13 tareas del DBA que tocan la confidencialidad, ordenadas por la fase del ciclo PHVA en que ocurren. Abra una tarea para ver los riesgos que mitiga y sus controles."
    >
      <PanelTareas />
    </Pagina>
  )
}
