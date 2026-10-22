import { ArrowUUpLeftIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { buscarEntidad, nombreTipo, papelDeTipo, tituloDeEntidad } from '../estado/indice'
import { useLegajo } from '../estado/LegajoProvider'
import { Detalle } from './Detalles'
import estilos from './HojaReferencia.module.css'
import { DentroDeHoja } from './contextoHoja'

const resorte = { type: 'spring', duration: 0.46, bounce: 0.12 } as const
const salida = { duration: 0.18, ease: [0.23, 1, 0.32, 1] } as const

export function HojaReferencia() {
  const { pila, direccion, cerrarHoja, volverA } = useLegajo()
  const reducir = useReducedMotion() ?? false
  const actual = pila.at(-1)
  const entidad = actual ? buscarEntidad(actual) : undefined
  const abierta = entidad !== undefined
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
      if (evento.key === 'Escape') cerrarHoja()
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

  const desplazamiento = reducir ? 0 : 36

  return (
    <AnimatePresence>
      {abierta && entidad && actual && (
        <>
          <motion.div
            key="velo"
            className={estilos.velo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.22 } }}
            exit={{ opacity: 0, transition: salida }}
            onClick={cerrarHoja}
            aria-hidden="true"
          />
          <motion.aside
            key="hoja"
            className={estilos.hoja}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hoja-titulo"
            initial={reducir ? { opacity: 0 } : { opacity: 0, transform: 'translateX(48px) rotate(0.9deg)' }}
            animate={reducir ? { opacity: 1 } : { opacity: 1, transform: 'translateX(0px) rotate(0deg)', transition: resorte }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, transform: 'translateX(32px) rotate(0.4deg)', transition: salida }}
          >
            <div className={estilos.bajo} aria-hidden="true" data-visible={pila.length > 1 || undefined} />
            <div className={estilos.papel}>
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
                    <button type="button" className={estilos.boton} onClick={() => volverA(pila.length - 2)}>
                      <ArrowUUpLeftIcon aria-hidden="true" />
                      <span>Volver a {pila.at(-2)}</span>
                    </button>
                  )}
                  <button type="button" className={estilos.botonIcono} onClick={cerrarHoja} aria-label="Cerrar la hoja">
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
                    initial={reducir ? { opacity: 0 } : { opacity: 0, transform: `translateX(${desplazamiento * direccion}px)`, filter: 'blur(2px)' }}
                    animate={reducir ? { opacity: 1 } : { opacity: 1, transform: 'translateX(0px)', filter: 'blur(0px)', transition: resorte }}
                    exit={reducir ? { opacity: 0 } : { opacity: 0, transform: `translateX(${-18 * direccion}px)`, filter: 'blur(2px)', transition: salida }}
                  >
                    <header className={estilos.encabezado}>
                      <h2 id="hoja-titulo" ref={titulo} tabIndex={-1} className={estilos.titulo}>
                        <span className={estilos.id}>{actual}</span>
                        <span>{tituloDeEntidad(entidad)}</span>
                      </h2>
                      <p className={estilos.tipo}>
                        {nombreTipo[entidad.tipo]}, papel {papelDeTipo[entidad.tipo]}
                      </p>
                    </header>
                    <DentroDeHoja.Provider value={true}>
                      <Detalle entidad={entidad} />
                    </DentroDeHoja.Provider>
                  </motion.article>
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
