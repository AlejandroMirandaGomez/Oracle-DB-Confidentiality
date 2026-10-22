import { ArrowUUpLeftIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { useIndice } from '../estado/fuente'
import { nombreTipo } from '../estado/indice'
import { Detalle } from './Detalles'
import estilos from './HojaReferencia.module.css'
import { DentroDeHoja } from './contextoHoja'

const resorte = { type: 'spring', duration: 0.4, bounce: 0.1 } as const
const salida = { duration: 0.18, ease: [0.23, 1, 0.32, 1] } as const
const enfocables = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'

export function HojaReferencia() {
  const { pila, direccion, cerrarHoja, volverA } = useEvaluacion()
  const indice = useIndice()
  const reducir = useReducedMotion() ?? false
  const actual = pila.at(-1)
  const entidad = actual ? indice.buscar(actual) : undefined
  const abierta = entidad !== undefined
  const hoja = useRef<HTMLElement>(null)
  const titulo = useRef<HTMLHeadingElement>(null)
  const desplazable = useRef<HTMLDivElement>(null)
  const focoPrevio = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!abierta) return
    focoPrevio.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const raiz = document.documentElement
    const desbordePrevio = raiz.style.overflow
    raiz.style.overflow = 'hidden'
    function alPresionar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        cerrarHoja()
        return
      }
      if (evento.key !== 'Tab' || !hoja.current) return
      const candidatos = [...hoja.current.querySelectorAll<HTMLElement>(enfocables)].filter((elemento) => elemento.offsetParent !== null)
      const primero = candidatos[0]
      const ultimo = candidatos.at(-1)
      if (!primero || !ultimo) return
      const activo = document.activeElement
      if (evento.shiftKey && (activo === primero || activo === titulo.current)) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && activo === ultimo) {
        evento.preventDefault()
        primero.focus()
      } else if (!hoja.current.contains(activo)) {
        evento.preventDefault()
        primero.focus()
      }
    }
    window.addEventListener('keydown', alPresionar)
    return () => {
      raiz.style.overflow = desbordePrevio
      window.removeEventListener('keydown', alPresionar)
      focoPrevio.current?.focus({ preventScroll: true })
    }
  }, [abierta, cerrarHoja])

  useEffect(() => {
    desplazable.current?.scrollTo({ top: 0 })
    titulo.current?.focus({ preventScroll: true })
  }, [actual])

  const desplazamiento = reducir ? 0 : 28

  return (
    <AnimatePresence>
      {abierta && entidad && actual && (
        <>
          <motion.div
            key="velo"
            className={estilos.velo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: salida }}
            onClick={cerrarHoja}
            aria-hidden="true"
          />
          <motion.aside
            key="hoja"
            ref={hoja}
            className={estilos.hoja}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hoja-titulo"
            initial={reducir ? { opacity: 0 } : { opacity: 0, transform: 'translateX(56px)' }}
            animate={reducir ? { opacity: 1 } : { opacity: 1, transform: 'translateX(0px)', transition: resorte }}
            exit={reducir ? { opacity: 0, transition: salida } : { opacity: 0, transform: 'translateX(40px)', transition: salida }}
          >
            <div className={estilos.barra}>
              <nav className={estilos.recorrido} aria-label="Recorrido de referencias">
                {pila.map((id, posicion) => {
                  const esActual = posicion === pila.length - 1
                  return (
                    <span key={`${id}-${posicion}`} className={estilos.paso}>
                      {posicion > 0 && <span className={estilos.flecha} aria-hidden="true" />}
                      {esActual ? (
                        <span className={estilos.pasoActual} aria-current="page">
                          {id}
                        </span>
                      ) : (
                        <button type="button" className={estilos.pasoPrevio} onClick={() => volverA(posicion)}>
                          {id}
                        </button>
                      )}
                    </span>
                  )
                })}
              </nav>
              <div className={estilos.acciones}>
                {pila.length > 1 && (
                  <button type="button" className="pulsador" data-compacto="" onClick={() => volverA(pila.length - 2)}>
                    <ArrowUUpLeftIcon aria-hidden="true" />
                    <span>Volver a {pila.at(-2)}</span>
                  </button>
                )}
                <button type="button" className="pulsador" data-compacto="" onClick={cerrarHoja} aria-label="Cerrar el detalle">
                  <XIcon weight="bold" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div ref={desplazable} className={estilos.desplazable}>
              <AnimatePresence mode="popLayout" initial={false} custom={direccion}>
                <motion.article
                  key={actual}
                  className={estilos.contenido}
                  custom={direccion}
                  initial={reducir ? { opacity: 0 } : { opacity: 0, transform: `translateX(${desplazamiento * direccion}px)` }}
                  animate={reducir ? { opacity: 1 } : { opacity: 1, transform: 'translateX(0px)', transition: resorte }}
                  exit={reducir ? { opacity: 0, transition: salida } : { opacity: 0, transform: `translateX(${-16 * direccion}px)`, transition: salida }}
                >
                  <header className={estilos.encabezado}>
                    <p className={estilos.tipo}>{nombreTipo[entidad.tipo]}</p>
                    <h2 id="hoja-titulo" ref={titulo} tabIndex={-1} className={estilos.titulo}>
                      <span className={estilos.id}>{actual}</span>
                      <span>{indice.tituloDe(entidad)}</span>
                    </h2>
                  </header>
                  <DentroDeHoja.Provider value={true}>
                    <Detalle entidad={entidad} />
                  </DentroDeHoja.Provider>
                </motion.article>
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
