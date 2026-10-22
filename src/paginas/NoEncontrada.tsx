import { Link } from 'react-router'
import { Pagina } from '../componentes/Pagina'

export function NoEncontrada() {
  return (
    <Pagina titulo="Página no encontrada" introduccion="La dirección que abrió no corresponde a ninguna sección de la aplicación.">
      <p>
        <Link to="/">Volver al inicio</Link>
      </p>
    </Pagina>
  )
}
