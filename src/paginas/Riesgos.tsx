import { useEffect } from 'react'
import { Pagina } from '../componentes/Pagina'
import { PanelRiesgos } from '../componentes/PanelRiesgos'
import { useEvaluacion } from '../estado/contextoEvaluacion'

export function Riesgos() {
  const { marcarPasoVisto } = useEvaluacion()

  useEffect(() => marcarPasoVisto('riesgos'), [marcarPasoVisto])

  return (
    <Pagina
      titulo="Tabla de riesgos"
      introduccion="Cinco riesgos típicos de confidencialidad en una base Oracle, valorados por impacto y probabilidad de 1 a 5. El residual se calcula con la madurez que usted asigne en la matriz."
    >
      <PanelRiesgos />
    </Pagina>
  )
}
