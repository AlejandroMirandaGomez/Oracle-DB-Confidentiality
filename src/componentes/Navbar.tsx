import { CaretDownIcon, ListIcon, XIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { proyecto } from '../data/catalogo/proyecto'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { PuntoLampara } from './Lampara'
import estilos from './Navbar.module.css'

type Enlace = { ruta: string; nombre: string; bloqueable?: boolean }

type Grupo = { id: string; titulo: string; enlaces: Enlace[] }

const grupos: Grupo[] = [
  {
    id: 'herramientas',
    titulo: 'Herramientas',
    enlaces: [
      { ruta: '/riesgos', nombre: 'Riesgos' },
      { ruta: '/tareas', nombre: 'Tareas del DBA' },
      { ruta: '/controles', nombre: 'Controles' },
      { ruta: '/matriz', nombre: 'Matriz de evaluación' },
      { ruta: '/pruebas', nombre: 'Batería de pruebas' },
      { ruta: '/hallazgos', nombre: 'Hallazgos', bloqueable: true },
    ],
  },
  {
    id: 'apoyo',
    titulo: 'Material de apoyo',
    enlaces: [
      { ruta: '/marco-teorico', nombre: 'Marco teórico' },
      { ruta: '/uso-ia', nombre: 'Uso de IA' },
      { ruta: '/ejemplos', nombre: 'Ejemplos' },
    ],
  },
]

function perteneceA(pathname: string, ruta: string): boolean {
  return pathname === ruta || pathname.startsWith(`${ruta}/`)
}

function EnlaceMenu({ enlace }: { enlace: Enlace }) {
  const { matrizCompleta } = useEvaluacion()
  const bloqueado = enlace.bloqueable === true && !matrizCompleta
  return (
    <NavLink to={enlace.ruta} className={`${estilos.enlace}`}>
      {({ isActive }) => (
        <>
          <PuntoLampara tono={isActive ? 'blanca' : 'apagada'} />
          <span className={estilos.textoEnlace}>
            <span>{enlace.nombre}</span>
            {bloqueado && <span className={estilos.requisito}>Requiere la matriz completa</span>}
          </span>
        </>
      )}
    </NavLink>
  )
}

export function Navbar() {
  const { pathname } = useLocation()
  const [apertura, setApertura] = useState({ ruta: pathname, grupo: null as string | null, movil: false })
  const abierto = apertura.ruta === pathname ? apertura.grupo : null
  const movilAbierto = apertura.ruta === pathname && apertura.movil
  const setAbierto = (grupo: string | null) => setApertura({ ruta: pathname, grupo, movil: false })
  const setMovilAbierto = (movil: boolean) => setApertura({ ruta: pathname, grupo: null, movil })
  const cerrarTodo = useCallback(() => setApertura({ ruta: pathname, grupo: null, movil: false }), [pathname])
  const contenedor = useRef<HTMLElement>(null)
  const disparadores = useRef(new Map<string, HTMLButtonElement>())

  useEffect(() => {
    if (abierto === null && !movilAbierto) return
    function alPresionarFuera(evento: PointerEvent) {
      if (contenedor.current && !contenedor.current.contains(evento.target as Node)) cerrarTodo()
    }
    function alPresionar(evento: KeyboardEvent) {
      if (evento.key !== 'Escape') return
      const grupoAbierto = abierto
      cerrarTodo()
      if (grupoAbierto) disparadores.current.get(grupoAbierto)?.focus()
    }
    document.addEventListener('pointerdown', alPresionarFuera)
    document.addEventListener('keydown', alPresionar)
    return () => {
      document.removeEventListener('pointerdown', alPresionarFuera)
      document.removeEventListener('keydown', alPresionar)
    }
  }, [abierto, movilAbierto, cerrarTodo])

  return (
    <header ref={contenedor} className={estilos.barra}>
      <div className={estilos.contenido}>
        <NavLink to="/" end className={`${estilos.marca}`}>
          {proyecto.nombreCorto}
        </NavLink>

        <nav className={estilos.menus} aria-label="Principal">
          {grupos.map((grupo) => {
            const activo = grupo.enlaces.some((enlace) => perteneceA(pathname, enlace.ruta))
            const idPanel = `menu-${grupo.id}`
            return (
              <div key={grupo.id} className={estilos.grupo}>
                <button
                  ref={(elemento) => {
                    if (elemento) disparadores.current.set(grupo.id, elemento)
                    else disparadores.current.delete(grupo.id)
                  }}
                  type="button"
                  className={estilos.disparador}
                  aria-expanded={abierto === grupo.id}
                  aria-controls={idPanel}
                  onClick={() => setAbierto(abierto === grupo.id ? null : grupo.id)}
                >
                  <PuntoLampara tono={activo ? 'blanca' : 'apagada'} />
                  {grupo.titulo}
                  <CaretDownIcon className={estilos.caret} weight="bold" aria-hidden="true" />
                </button>
                <ul id={idPanel} className={estilos.panel} hidden={abierto !== grupo.id}>
                  {grupo.enlaces.map((enlace) => (
                    <li key={enlace.ruta}>
                      <EnlaceMenu enlace={enlace} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </nav>

        <button
          type="button"
          className={`pulsador ${estilos.botonMenu}`}
          aria-expanded={movilAbierto}
          aria-controls="menu-movil"
          onClick={() => setMovilAbierto(!movilAbierto)}
        >
          {movilAbierto ? <XIcon weight="bold" aria-hidden="true" /> : <ListIcon weight="bold" aria-hidden="true" />}
          Menú
        </button>
      </div>

      <nav id="menu-movil" className={estilos.movil} aria-label="Principal en pantallas angostas" hidden={!movilAbierto}>
        {grupos.map((grupo) => (
          <div key={grupo.id} className={estilos.grupoMovil}>
            <p className="rotulo">{grupo.titulo}</p>
            <ul className={estilos.listaMovil}>
              {grupo.enlaces.map((enlace) => (
                <li key={enlace.ruta}>
                  <EnlaceMenu enlace={enlace} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </header>
  )
}
