import { useEffect, useId, useLayoutEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from 'react'
import { nivelesMadurez } from '../data/catalogo/escalas'
import { modeloDeControl } from '../data/catalogo/madurez'
import type { Nivel } from '../data/tipos'
import { useIndice } from '../estado/fuente'
import estilos from './PistaNivel.module.css'
import { TextosNivel } from './TextosNivel'

export type PropsDisparador = {
  tabIndex?: number
  onPointerEnter?: (evento: PointerEvent<HTMLElement>) => void
  onPointerLeave?: () => void
  onPointerDown?: (evento: PointerEvent<HTMLElement>) => void
  onFocus?: (evento: FocusEvent<HTMLElement>) => void
  onBlur?: () => void
  'aria-describedby'?: string | undefined
}

type Props = {
  control: string | undefined
  nivel: Nivel | null
  children: (disparador: PropsDisparador) => ReactNode
}

const margen = 8
const hueco = 6

export function PistaNivel({ control: idControl, nivel, children }: Props) {
  const indice = useIndice()
  const control = idControl === undefined ? undefined : indice.buscarControl(idControl)
  const identificador = useId()
  const [intencion, setIntencion] = useState({ abrir: false, retardo: 0 })
  const [abierta, setAbierta] = useState(false)
  const [ancla, setAncla] = useState<HTMLElement | null>(null)
  const pista = useRef<HTMLDivElement>(null)
  const disponible = control !== undefined && nivel !== null

  function programar(abrir: boolean, retardo: number) {
    setIntencion({ abrir, retardo })
  }

  useEffect(() => {
    const temporizador = window.setTimeout(() => setAbierta(intencion.abrir), intencion.retardo)
    return () => window.clearTimeout(temporizador)
  }, [intencion])

  useEffect(() => {
    if (!abierta) return
    function alPresionar(evento: KeyboardEvent) {
      if (evento.key !== 'Escape') return
      evento.stopPropagation()
      setIntencion({ abrir: false, retardo: 0 })
    }
    function alTocarFuera(evento: globalThis.PointerEvent) {
      const objetivo = evento.target
      if (!(objetivo instanceof Node)) return
      if (ancla?.contains(objetivo) || pista.current?.contains(objetivo)) return
      setIntencion({ abrir: false, retardo: 0 })
    }
    document.addEventListener('keydown', alPresionar, true)
    document.addEventListener('pointerdown', alTocarFuera, true)
    return () => {
      document.removeEventListener('keydown', alPresionar, true)
      document.removeEventListener('pointerdown', alTocarFuera, true)
    }
  }, [abierta, ancla])

  useLayoutEffect(() => {
    const elemento = pista.current
    if (!abierta || !elemento) return
    if (typeof elemento.showPopover === 'function') elemento.showPopover()
    function colocar() {
      if (!elemento || !ancla) return
      const caja = ancla.getBoundingClientRect()
      const anchoVentana = document.documentElement.clientWidth
      const altoVentana = window.innerHeight
      elemento.style.maxHeight = 'none'
      const ancho = elemento.offsetWidth
      const alto = elemento.offsetHeight
      const espacioArriba = caja.top - hueco - margen
      const espacioAbajo = altoVentana - caja.bottom - hueco - margen
      const arriba = alto <= espacioArriba || (alto > espacioAbajo && espacioArriba > espacioAbajo)
      const disponibleAlto = Math.max(arriba ? espacioArriba : espacioAbajo, 96)
      const altoFinal = Math.min(alto, disponibleAlto)
      const izquierda = Math.min(Math.max(caja.left + caja.width / 2 - ancho / 2, margen), Math.max(anchoVentana - ancho - margen, margen))
      elemento.style.maxHeight = `${disponibleAlto}px`
      elemento.style.left = `${izquierda}px`
      elemento.style.top = `${arriba ? caja.top - hueco - altoFinal : caja.bottom + hueco}px`
    }
    colocar()
    window.addEventListener('resize', colocar)
    document.addEventListener('scroll', colocar, true)
    return () => {
      window.removeEventListener('resize', colocar)
      document.removeEventListener('scroll', colocar, true)
    }
  }, [abierta, ancla])

  if (!disponible) return <>{children({})}</>

  const modelo = modeloDeControl(control)
  const descripcion = nivelesMadurez[nivel]

  const disparador: PropsDisparador = {
    tabIndex: 0,
    onPointerEnter: (evento) => {
      setAncla(evento.currentTarget)
      if (evento.pointerType !== 'touch') programar(true, 100)
    },
    onPointerLeave: () => programar(false, 120),
    onPointerDown: (evento) => {
      setAncla(evento.currentTarget)
      if (evento.pointerType === 'touch') programar(true, 0)
    },
    onFocus: (evento) => {
      setAncla(evento.currentTarget)
      programar(true, 0)
    },
    onBlur: () => programar(false, 0),
    'aria-describedby': abierta ? identificador : undefined,
  }

  return (
    <>
      {children(disparador)}
      {abierta && (
        <div
          ref={pista}
          id={identificador}
          popover="manual"
          role="tooltip"
          className={estilos.pista}
          onPointerEnter={() => programar(true, 0)}
          onPointerLeave={() => programar(false, 120)}
        >
          <p className={estilos.cabeza}>
            <span className={estilos.numero}>{nivel}</span>
            <span className={estilos.nombre}>{descripcion?.nombre}</span>
          </p>
          <p className={estilos.contexto}>
            {control.id}, modelo {modelo.id}: {modelo.nombre}
          </p>
          <TextosNivel textos={modelo.niveles[nivel]} />
        </div>
      )}
    </>
  )
}
