import { useEffect } from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router'
import { Detalle } from '../componentes/Detalles'
import { Pagina } from '../componentes/Pagina'
import { controles } from '../data/catalogo/controles'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import estilos from './Controles.module.css'

const grupos = [
  { titulo: 'Controles', complementario: false },
  { titulo: 'Controles complementarios', complementario: true },
]

export function Controles() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { marcarPasoVisto } = useEvaluacion()
  const control = id === undefined ? controles[0] : controles.find((item) => item.id === id)

  useEffect(() => marcarPasoVisto('controles'), [marcarPasoVisto])

  if (!control) {
    return (
      <Pagina titulo="Control no encontrado" introduccion={`El control ${id ?? ''} no forma parte de la selección de esta aplicación.`}>
        <p>
          <Link to="/controles">Ver la lista de controles</Link>
        </p>
      </Pagina>
    )
  }

  return (
    <div className={estilos.composicion}>
      <nav className={estilos.lista} aria-label="Controles">
        {grupos.map((grupo) => (
          <div key={grupo.titulo} className={estilos.grupo}>
            <p className={`rotulo ${estilos.grupoTitulo}`}>{grupo.titulo}</p>
            <ul className={estilos.items}>
              {controles
                .filter((item) => item.complementario === grupo.complementario)
                .map((item) => (
                  <li key={item.id}>
                    <NavLink to={`/controles/${item.id}`} className={`${estilos.opcion}`} aria-current={item.id === control.id ? 'page' : undefined}>
                      <span className={estilos.idControl}>{item.id}</span>
                      <span className={estilos.nombreControl}>{item.nombre}</span>
                      <span className={estilos.propiedades} aria-label={`Propiedades ${item.propiedades.join(', ')}`}>
                        {(['C', 'I', 'D'] as const).map((propiedad) => (
                          <span key={propiedad} data-marcada={item.propiedades.includes(propiedad) || undefined}>
                            {propiedad}
                          </span>
                        ))}
                      </span>
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={estilos.detalle}>
        <Pagina
          titulo={`${control.id} ${control.nombre}`}
          introduccion="Controles ISO/IEC 27001:2022 sobre confidencialidad, con su justificación para el DBA, su implementación en Oracle y lo que verifica un auditor externo."
        >
          <label className={estilos.selector}>
            <span className="rotulo">Control</span>
            <select className="control-texto" value={control.id} onChange={(evento) => navegar(`/controles/${evento.target.value}`)}>
              {grupos.map((grupo) => (
                <optgroup key={grupo.titulo} label={grupo.titulo}>
                  {controles
                    .filter((item) => item.complementario === grupo.complementario)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.id} {item.nombre}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          <article key={control.id} className={estilos.articulo} aria-label={`Detalle de ${control.id}`}>
            <Detalle entidad={{ tipo: 'control', dato: control }} />
          </article>
        </Pagina>
      </div>
    </div>
  )
}
