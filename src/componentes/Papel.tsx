import { SealCheckIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { legajo } from '../data/legajo'
import { useLegajo } from '../estado/LegajoProvider'
import { LeyendaMarcas } from './LeyendaMarcas'
import estilos from './Papel.module.css'

type Props = {
  letra: string
  titulo: string
  objetivo: string
  children: ReactNode
  pie?: ReactNode
}

export function Papel({ letra, titulo, objetivo, children, pie }: Props) {
  const { marcarPapelVisible } = useLegajo()
  const referencia = useRef<HTMLElement>(null)

  useEffect(() => {
    const elemento = referencia.current
    if (!elemento) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) marcarPapelVisible(letra)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [letra, marcarPapelVisible])

  return (
    <section ref={referencia} id={`papel-${letra.toLowerCase()}`} className={estilos.papel} aria-labelledby={`titulo-${letra}`}>
      <header className={estilos.encabezado}>
        <div className={estilos.letra} aria-hidden="true">
          {letra}
        </div>
        <div className={estilos.titulos}>
          <h2 id={`titulo-${letra}`} className={estilos.titulo}>
            <span className="solo-lectores">Papel {letra}. </span>
            {titulo}
          </h2>
          <p className={estilos.objetivo}>{objetivo}</p>
        </div>
        <dl className={estilos.formulario}>
          <div>
            <dt>Entidad</dt>
            <dd className={estilos.mono}>XEPDB1</dd>
          </div>
          <div>
            <dt>Papel</dt>
            <dd className={estilos.mono}>{letra}</dd>
          </div>
          <div>
            <dt>Preparado</dt>
            <dd>
              <span className={estilos.mono}>{legajo.iniciales}</span> <span className={estilos.fecha}>21/10/26</span>
            </dd>
          </div>
          <div>
            <dt>Revisado</dt>
            <dd>
              <FirmaRevision papel={letra} />
            </dd>
          </div>
        </dl>
      </header>
      <div className={estilos.cuerpo}>{children}</div>
      <footer className={estilos.pie}>{pie ?? <LeyendaMarcas />}</footer>
    </section>
  )
}

function FirmaRevision({ papel }: { papel: string }) {
  const { firmas, firmar, borrarFirma } = useLegajo()
  const [editando, setEditando] = useState(false)
  const [iniciales, setIniciales] = useState('')
  const firma = firmas[papel]

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    firmar(papel, iniciales)
    setEditando(false)
    setIniciales('')
  }

  if (firma) {
    return (
      <button type="button" className={estilos.firmada} onClick={() => borrarFirma(papel)} title="Quitar la firma de revisión">
        <SealCheckIcon className={estilos.sello} weight="bold" aria-hidden="true" />
        <span className={estilos.mono}>{firma.iniciales}</span>
        <span className={estilos.fecha}>{firma.fecha}</span>
      </button>
    )
  }

  if (editando) {
    return (
      <form className={estilos.formFirma} onSubmit={enviar}>
        <label className="solo-lectores" htmlFor={`iniciales-${papel}`}>
          Iniciales del revisor
        </label>
        <input
          id={`iniciales-${papel}`}
          className={estilos.campo}
          value={iniciales}
          maxLength={5}
          autoFocus
          placeholder="JVM"
          onChange={(evento) => setIniciales(evento.target.value)}
          onBlur={() => !iniciales && setEditando(false)}
          onKeyDown={(evento) => evento.key === 'Escape' && setEditando(false)}
        />
        <button type="submit" className={estilos.firmar}>
          Firmar
        </button>
      </form>
    )
  }

  return (
    <button type="button" className={estilos.pendiente} onClick={() => setEditando(true)}>
      Firmar revisión
    </button>
  )
}
