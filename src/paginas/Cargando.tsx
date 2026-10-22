import estilos from './Cargando.module.css'

export function Cargando() {
  return (
    <p role="status" className={estilos.mensaje}>
      Cargando la aplicación.
    </p>
  )
}
