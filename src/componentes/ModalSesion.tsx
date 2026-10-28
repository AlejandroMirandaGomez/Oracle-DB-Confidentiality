import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import estilos from './ModalSesion.module.css'

const largoMaximoNombre = 120

type PropsFormulario = { alCancelar: () => void; alEntrar: (nombre: string) => void }

function FormularioSesion({ alCancelar, alEntrar }: PropsFormulario) {
  const [nombre, setNombre] = useState('Cliente')
  const id = useId()
  const nombreLimpio = nombre.trim()

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (nombreLimpio !== '') alEntrar(nombreLimpio)
  }

  return (
    <form className={estilos.formulario} onSubmit={enviar}>
      <h2 id={`${id}-titulo`} className={estilos.titulo}>
        Iniciar sesión
      </h2>
      <div className={estilos.campo}>
        <label className="rotulo" htmlFor={`${id}-nombre`}>
          Nombre de la empresa
        </label>
        <input
          id={`${id}-nombre`}
          className="control-texto"
          type="text"
          value={nombre}
          maxLength={largoMaximoNombre}
          autoComplete="organization"
          autoFocus
          required
          aria-describedby={`${id}-ayuda`}
          onChange={(evento) => setNombre(evento.target.value)}
        />
        <p id={`${id}-ayuda`} className={estilos.ayuda}>
          Cliente incluye cinco evaluaciones de demostración. Puede cambiar el nombre de la empresa. La sesión se guarda solo en este navegador.
        </p>
      </div>
      <div className={estilos.acciones}>
        <button type="button" className="pulsador" onClick={alCancelar}>
          Cancelar
        </button>
        <button type="submit" className="pulsador" data-principal="" disabled={nombreLimpio === ''}>
          Entrar
        </button>
      </div>
    </form>
  )
}

type Props = { abierto: boolean; alCerrar: () => void; alEntrar: (nombre: string) => void }

export function ModalSesion({ abierto, alCerrar, alEntrar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const elemento = dialogo.current
    if (!elemento) return
    if (abierto && !elemento.open) elemento.showModal()
    if (!abierto && elemento.open) elemento.close()
  }, [abierto])

  return (
    <dialog
      ref={dialogo}
      className={estilos.modal}
      aria-label="Iniciar sesión"
      onCancel={(evento) => {
        evento.preventDefault()
        alCerrar()
      }}
      onClose={alCerrar}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) alCerrar()
      }}
    >
      {abierto && <FormularioSesion alCancelar={alCerrar} alEntrar={alEntrar} />}
    </dialog>
  )
}
