import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { BloqueCodigo } from '../componentes/BloqueCodigo'
import { Papel } from '../componentes/Papel'
import { ListaRefs } from '../componentes/Ref'
import { Trama } from '../componentes/Trama'
import { hallazgos } from '../data/hallazgos'
import estilos from './PapelHallazgos.module.css'

const atributos = [
  { clave: 'condicion', titulo: 'Condición', ayuda: 'Lo que se encontró' },
  { clave: 'criterio', titulo: 'Criterio', ayuda: 'Lo que pide la norma' },
  { clave: 'causa', titulo: 'Causa', ayuda: 'Por qué ocurre' },
  { clave: 'efecto', titulo: 'Efecto', ayuda: 'Qué riesgo abre' },
  { clave: 'recomendacion', titulo: 'Recomendación', ayuda: 'Qué hacer' },
] as const

export function PapelHallazgos() {
  const [indice, setIndice] = useState(0)
  const [sentido, setSentido] = useState<1 | -1>(1)
  const reducir = useReducedMotion() ?? false
  const hallazgo = hallazgos[indice]

  function ir(destino: number) {
    const acotado = (destino + hallazgos.length) % hallazgos.length
    setSentido(acotado > indice ? 1 : -1)
    setIndice(acotado)
  }

  if (!hallazgo) return null

  return (
    <Papel
      letra="G"
      titulo="Hallazgos y plan de acción"
      objetivo="La fase Actuar del ciclo: cada incumplimiento de la matriz se documenta como hallazgo con condición, criterio, causa, efecto y recomendación, y trae la remediación propuesta para Oracle."
    >
      <div className={estilos.pestanas} role="tablist" aria-label="Hallazgos">
        {hallazgos.map((item, posicion) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={posicion === indice}
            aria-controls="hallazgo-actual"
            className={estilos.pestana}
            data-prioridad={item.prioridad}
            onClick={() => ir(posicion)}
          >
            <span className={estilos.pestanaId}>{item.id}</span>
            <span className={estilos.pestanaPrioridad}>
              <Trama densidad={item.prioridad === 'Alta' ? 4 : item.prioridad === 'Media' ? 2 : 1} />
              {item.prioridad}
            </span>
          </button>
        ))}
      </div>

      <div className={estilos.marco} id="hallazgo-actual" role="tabpanel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false} custom={sentido}>
          <motion.article
            key={hallazgo.id}
            className={estilos.hoja}
            initial={reducir ? { opacity: 0 } : { opacity: 0, transform: `translateX(${20 * sentido}px)` }}
            animate={{ opacity: 1, transform: 'translateX(0px)', transition: { duration: 0.24, ease: [0.23, 1, 0.32, 1] } }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, transform: `translateX(${-12 * sentido}px)`, transition: { duration: 0.12 } }}
          >
            <header className={estilos.cabecera}>
              <h3 className={estilos.titulo}>{hallazgo.titulo}</h3>
              <p className={estilos.id}>
                {hallazgo.id}
                <span className={estilos.prioridad}>
                  <Trama densidad={hallazgo.prioridad === 'Alta' ? 4 : hallazgo.prioridad === 'Media' ? 2 : 1} />
                  Prioridad {hallazgo.prioridad.toLowerCase()}
                </span>
              </p>
            </header>
            <dl className={estilos.atributos}>
              {atributos.map(({ clave, titulo, ayuda }) => (
                <div key={clave} className={estilos.atributo}>
                  <dt>
                    <span className={estilos.atributoTitulo}>{titulo}</span>
                    <span className={estilos.atributoAyuda}>{ayuda}</span>
                  </dt>
                  <dd>{hallazgo[clave]}</dd>
                </div>
              ))}
            </dl>
            <div className={estilos.inferior}>
              <BloqueCodigo codigo={hallazgo.remediacion} titulo="Remediación propuesta" />
              <dl className={estilos.refs}>
                <div>
                  <dt>Controles</dt>
                  <dd>
                    <ListaRefs ids={hallazgo.controles} />
                  </dd>
                </div>
                <div>
                  <dt>Pruebas</dt>
                  <dd>
                    <ListaRefs ids={hallazgo.pruebas} />
                  </dd>
                </div>
                <div>
                  <dt>Riesgos</dt>
                  <dd>
                    <ListaRefs ids={hallazgo.riesgos} />
                  </dd>
                </div>
              </dl>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className={estilos.navegacion}>
        <button type="button" className={estilos.paso} onClick={() => ir(indice - 1)}>
          <ArrowLeftIcon aria-hidden="true" />
          Anterior
        </button>
        <span className={estilos.posicion}>
          {indice + 1} de {hallazgos.length}
        </span>
        <button type="button" className={estilos.paso} onClick={() => ir(indice + 1)}>
          Siguiente
          <ArrowRightIcon aria-hidden="true" />
        </button>
      </div>
    </Papel>
  )
}
