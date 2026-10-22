import { useId } from 'react'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import estilos from './CampoOrganizacion.module.css'

export function CampoOrganizacion() {
  const { organizacion, fijarOrganizacion } = useEvaluacion()
  const id = useId()
  return (
    <div className={estilos.campo}>
      <label className="rotulo" htmlFor={id}>
        Organización evaluada
      </label>
      <input
        id={id}
        className="control-texto"
        type="text"
        value={organizacion}
        maxLength={120}
        autoComplete="organization"
        aria-describedby={`${id}-ayuda`}
        onChange={(evento) => fijarOrganizacion(evento.target.value)}
      />
      <p id={`${id}-ayuda`} className={estilos.ayuda}>
        Opcional. Aparece en los hallazgos y en las exportaciones.
      </p>
    </div>
  )
}
