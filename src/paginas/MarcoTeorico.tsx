import { useEffect, useState } from 'react'
import { Pagina } from '../componentes/Pagina'
import { PuntoLampara } from '../componentes/Lampara'
import { marcoTeorico } from '../data/catalogo/marcoTeorico'
import { referencias } from '../data/catalogo/referencias'
import { irA } from '../estado/desplazamiento'
import estilos from './MarcoTeorico.module.css'

const secciones = [...marcoTeorico.map((seccion) => ({ id: seccion.id, titulo: seccion.titulo })), { id: 'referencias', titulo: 'Referencias' }]

export function MarcoTeorico() {
  const [actual, setActual] = useState(secciones[0]?.id ?? '')

  useEffect(() => {
    const elementos = secciones.flatMap(({ id }) => {
      const elemento = document.getElementById(id)
      return elemento ? [elemento] : []
    })
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.find((entrada) => entrada.isIntersecting)
        if (visible) setActual(visible.target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    elementos.forEach((elemento) => observador.observe(elemento))
    return () => observador.disconnect()
  }, [])

  return (
    <Pagina
      titulo="Marco teórico y referencias"
      introduccion="Síntesis de los conceptos que sostienen las decisiones de la aplicación: la norma, los principios de acceso, los controles técnicos de Oracle y la ley costarricense de protección de datos."
    >
      <div className={estilos.composicion}>
        <nav className={estilos.indice} aria-label="Secciones del marco teórico">
          <ol>
            {secciones.map((seccion) => (
              <li key={seccion.id}>
                <button type="button" className={estilos.enlace} aria-current={actual === seccion.id ? 'location' : undefined} onClick={() => irA(seccion.id)}>
                  <PuntoLampara tono={actual === seccion.id ? 'blanca' : 'apagada'} />
                  {seccion.titulo}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className={estilos.texto}>
          {marcoTeorico.map((seccion) => (
            <section key={seccion.id} id={seccion.id} className={estilos.seccion} aria-labelledby={`${seccion.id}-titulo`}>
              <h2 id={`${seccion.id}-titulo`} className={estilos.titulo}>
                {seccion.titulo}
              </h2>
              {seccion.parrafos.map((parrafo) => (
                <p key={parrafo.slice(0, 40)} className={estilos.parrafo}>
                  {parrafo}
                </p>
              ))}
            </section>
          ))}

          <section id="referencias" className={estilos.seccion} aria-labelledby="referencias-titulo">
            <h2 id="referencias-titulo" className={estilos.titulo}>
              Referencias
            </h2>
            <p className={estilos.parrafo}>
              Fuentes citadas en formato APA 7. El texto de ISO/IEC 27002:2022 se consultó con licencia del autor y se parafrasea; no se reproduce.
            </p>
            <ol className={estilos.referencias}>
              {referencias.map((referencia) => (
                <li key={referencia.id} className={estilos.referencia}>
                  {referencia.apa}{' '}
                  {referencia.url && (
                    <a href={referencia.url} target="_blank" rel="noreferrer">
                      {referencia.url}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </Pagina>
  )
}
