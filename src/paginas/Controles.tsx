import { useEffect } from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router'
import { Detalle } from '../componentes/Detalles'
import { GraficoEvolucion, LeyendaPuntuacion, type PuntoEvolucion } from '../componentes/GraficoEvolucion'
import { Pagina } from '../componentes/Pagina'
import { controles } from '../data/catalogo/controles'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { formatoPuntuacion, puntuacionesControles } from '../estado/puntuaciones'
import estilos from './Controles.module.css'

const grupos = [
  { titulo: 'Controles observables', complementario: false },
  { titulo: 'Controles observables complementarios', complementario: true },
]

export function Controles() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { marcarPasoVisto, historial, organizacion } = useEvaluacion()
  const control = id === undefined ? controles[0] : controles.find((item) => item.id === id)

  useEffect(() => marcarPasoVisto('controles'), [marcarPasoVisto])

  if (!control) {
    return (
      <Pagina titulo="Control observable no encontrado" introduccion={`El control ${id ?? ''} no forma parte de la selección de esta aplicación.`}>
        <p>
          <Link to="/controles">Ver los controles observables</Link>
        </p>
      </Pagina>
    )
  }

  const claveOrganizacion = organizacion.trim().toLocaleLowerCase('es')
  const registros = historial
    .filter((registro) => registro.evaluacion.organizacion.trim().toLocaleLowerCase('es') === claveOrganizacion)
    .sort((a, b) => Date.parse(a.fechaGuardado) - Date.parse(b.fechaGuardado))
  const puntos: PuntoEvolucion[] = registros.flatMap((registro) => {
    const puntuacion = puntuacionesControles(registro.evaluacion).find((item) => item.id === control.id)?.puntuacion
    return puntuacion === undefined ? [] : [{ id: registro.id, fecha: registro.fechaGuardado, valor: puntuacion }]
  })
  const ultimaPuntuacion = puntos.at(-1)
  const anterior = puntos.at(-2)
  const variacion = ultimaPuntuacion && anterior ? ultimaPuntuacion.valor - anterior.valor : null

  return (
    <div className={estilos.composicion}>
      <nav className={estilos.lista} aria-label="Controles observables">
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
          introduccion="Controles observables ISO/IEC 27001:2022 sobre confidencialidad, con su justificación para el DBA, su implementación en Oracle y lo que verifica un auditor externo."
        >
          <label className={estilos.selector}>
            <span className="rotulo">Control observable</span>
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
          <section className={estilos.evolucion} aria-labelledby="titulo-evolucion-control">
            <div className={estilos.cabeceraEvolucion}>
              <div>
                <h2 id="titulo-evolucion-control">Evolución de {control.id}</h2>
                <p>Puntuación de 0 a 1 en las evaluaciones guardadas de {organizacion || 'la organización actual'}, en orden cronológico.</p>
              </div>
              <Link to="/historial">Ver historial completo</Link>
            </div>
            {puntos.length === 0
              ? <p className={estilos.graficoVacio}>Aún no hay evaluaciones guardadas de esta organización para mostrar la evolución de {control.id}.</p>
              : <GraficoEvolucion puntos={puntos} etiqueta={`Evolución cronológica de ${control.id} ${control.nombre}, de cero a uno`} />}
            {ultimaPuntuacion && (
              <p className={estilos.notaEvolucion}>
                Última puntuación: <strong>{formatoPuntuacion(ultimaPuntuacion.valor)} de 1</strong>
                {variacion !== null && ` · ${variacion > 0 ? 'Subió' : variacion < 0 ? 'Bajó' : 'Sin cambio'}${variacion === 0 ? '' : ` ${formatoPuntuacion(Math.abs(variacion))}`} frente a la evaluación anterior.`}
              </p>
            )}
            <LeyendaPuntuacion />
          </section>
          <article key={control.id} className={estilos.articulo} aria-label={`Detalle de ${control.id}`}>
            <Detalle entidad={{ tipo: 'control', dato: control }} />
          </article>
        </Pagina>
      </div>
    </div>
  )
}
