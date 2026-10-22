import { Papel } from '../componentes/Papel'
import { marcoTeorico } from '../data/marcoTeorico'
import estilos from './PapelMarcoTeorico.module.css'

export function PapelMarcoTeorico() {
  return (
    <Papel
      letra="H"
      titulo="Marco teórico"
      objetivo="Síntesis de los conceptos que sostienen las decisiones del legajo: la norma, los principios de acceso, los controles técnicos de Oracle y la ley costarricense de protección de datos."
    >
      <div className={estilos.composicion}>
        <nav className={estilos.contenido} aria-label="Secciones del marco teórico">
          <ol>
            {marcoTeorico.map((seccion) => (
              <li key={seccion.id}>
                <a href={`#${seccion.id}`}>{seccion.titulo}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={estilos.texto}>
          {marcoTeorico.map((seccion) => (
            <section key={seccion.id} id={seccion.id} className={estilos.seccion} aria-labelledby={`${seccion.id}-titulo`}>
              <h3 id={`${seccion.id}-titulo`} className={estilos.titulo}>
                {seccion.titulo}
              </h3>
              {seccion.parrafos.map((parrafo) => (
                <p key={parrafo.slice(0, 40)} className={estilos.parrafo}>
                  {parrafo}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </Papel>
  )
}
