import { SignInIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import estilos from './MenuUsuario.module.css'
import { ModalSesion } from './ModalSesion'

type Props = {
  abierto: boolean
  alAlternar: () => void
  alCerrar: () => void
  registrarDisparador: (elemento: HTMLButtonElement | null) => void
}

export function MenuUsuario({ abierto, alAlternar, alCerrar, registrarDisparador }: Props) {
  const { organizacion, fijarOrganizacion } = useEvaluacion()
  const [modalAbierto, setModalAbierto] = useState(false)
  const disparador = useRef<HTMLButtonElement | null>(null)
  const modalEstabaAbierto = useRef(false)
  const nombre = organizacion.trim()
  const sesionIniciada = nombre !== ''
  const inicial = Array.from(nombre)[0]?.toLocaleUpperCase('es')

  useEffect(() => {
    if (modalEstabaAbierto.current && !modalAbierto) disparador.current?.focus()
    modalEstabaAbierto.current = modalAbierto
  }, [modalAbierto])

  const abrirModal = () => {
    alCerrar()
    setModalAbierto(true)
  }

  const cerrarModal = () => setModalAbierto(false)

  const entrar = (nuevoNombre: string) => {
    fijarOrganizacion(nuevoNombre)
    setModalAbierto(false)
  }

  const cerrarSesion = () => {
    fijarOrganizacion('')
    alCerrar()
    disparador.current?.focus()
  }

  return (
    <div className={estilos.usuario}>
      <button
        ref={(elemento) => {
          disparador.current = elemento
          registrarDisparador(elemento)
        }}
        type="button"
        className={estilos.circulo}
        data-activo={sesionIniciada ? '' : undefined}
        aria-expanded={abierto}
        aria-controls="menu-usuario"
        aria-label={sesionIniciada ? `Cuenta de ${nombre}` : 'Cuenta, sin sesión iniciada'}
        onClick={alAlternar}
      >
        {sesionIniciada ? (
          <span className={estilos.inicial} aria-hidden="true">
            {inicial}
          </span>
        ) : (
          <UserIcon weight="bold" aria-hidden="true" />
        )}
      </button>

      <div id="menu-usuario" className={estilos.panel} hidden={!abierto}>
        {sesionIniciada ? (
          <>
            <div className={estilos.identidad}>
              <p className="rotulo">Sesión iniciada</p>
              <p className={estilos.nombre}>{nombre}</p>
            </div>
            <button type="button" className={estilos.accion} onClick={cerrarSesion}>
              <SignOutIcon weight="bold" aria-hidden="true" />
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <div className={estilos.identidad}>
              <p className="rotulo">Sin sesión</p>
              <p className={estilos.ayuda}>Entre como Cliente para explorar las evaluaciones de demostración o indique otra empresa.</p>
            </div>
            <button type="button" className={estilos.accion} onClick={abrirModal}>
              <SignInIcon weight="bold" aria-hidden="true" />
              Iniciar sesión
            </button>
          </>
        )}
      </div>

      <ModalSesion abierto={modalAbierto} alCerrar={cerrarModal} alEntrar={entrar} />
    </div>
  )
}
