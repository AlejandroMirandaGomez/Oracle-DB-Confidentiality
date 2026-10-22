import { CheckIcon, ClipboardTextIcon, SealCheckIcon } from '@phosphor-icons/react'
import { useEffect, useState, type FormEvent } from 'react'
import { Pagina } from '../componentes/Pagina'
import { proyecto } from '../data/catalogo/proyecto'
import { declaracionJurada, usosIA, validacionPendiente } from '../data/catalogo/usoIA'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import estilos from './UsoIA.module.css'

export function UsoIA() {
  const { validacionesIA, fijarValidacionIA, firmaDeclaracion, firmarDeclaracion, quitarFirmaDeclaracion } = useEvaluacion()
  const [nombre, setNombre] = useState('')
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (!copiado) return
    const temporizador = window.setTimeout(() => setCopiado(false), 1600)
    return () => window.clearTimeout(temporizador)
  }, [copiado])

  const pendientes = usosIA.filter((uso) => !(validacionesIA[uso.id] ?? '').trim()).length

  async function copiarTabla() {
    const filas = usosIA.map((uso) =>
      [uso.herramienta, uso.prompt, uso.aporte, (validacionesIA[uso.id] ?? '').trim() || validacionPendiente, uso.fuente].join('\t'),
    )
    const texto = ['Herramienta IA\tPrompt exacto utilizado\tAporte de la IA\tValidación o corrección del estudiante\tFuente verificada', ...filas].join('\n')
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
    } catch {
      setCopiado(false)
    }
  }

  function firmar(evento: FormEvent) {
    evento.preventDefault()
    firmarDeclaracion(nombre)
    setNombre('')
  }

  return (
    <Pagina
      titulo="Declaración del uso de IA"
      introduccion="Registro de cada uso de IA generativa en este trabajo, con el prompt exacto, lo que aportó, cómo lo validó el estudiante y la fuente oficial contra la que se verificó."
    >
      <div className={estilos.barra}>
        <p className={estilos.estado} aria-live="polite">
          {pendientes === 0
            ? 'Todas las validaciones están completas.'
            : `${pendientes} de ${usosIA.length} validaciones por completar. Escríbalas en la columna correspondiente; se guardan en este navegador.`}
        </p>
        <button type="button" className="pulsador" onClick={copiarTabla} aria-live="polite">
          {copiado ? <CheckIcon weight="bold" aria-hidden="true" /> : <ClipboardTextIcon aria-hidden="true" />}
          {copiado ? 'Tabla copiada' : 'Copiar tabla'}
        </button>
      </div>

      <div className={estilos.marco}>
        <table className={estilos.tabla}>
          <caption className="solo-lectores">Tabla de uso de inteligencia artificial</caption>
          <thead>
            <tr>
              {['Herramienta IA', 'Prompt exacto utilizado', 'Aporte de la IA', 'Validación o corrección del estudiante', 'Fuente verificada'].map((encabezado) => (
                <th key={encabezado} scope="col" className="rotulo">
                  {encabezado}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usosIA.map((uso) => {
              const texto = validacionesIA[uso.id] ?? ''
              return (
                <tr key={uso.id}>
                  <th scope="row" data-etiqueta="Herramienta IA">
                    {uso.herramienta}
                  </th>
                  <td data-etiqueta="Prompt exacto">
                    <q className={estilos.prompt}>{uso.prompt}</q>
                  </td>
                  <td data-etiqueta="Aporte de la IA">{uso.aporte}</td>
                  <td data-etiqueta="Validación">
                    <label className="solo-lectores" htmlFor={`validacion-${uso.id}`}>
                      Validación del estudiante para {uso.id}
                    </label>
                    <textarea
                      id={`validacion-${uso.id}`}
                      className={`control-texto ${estilos.validacion}`}
                      data-pendiente={!texto.trim() || undefined}
                      value={texto}
                      placeholder={validacionPendiente}
                      rows={4}
                      onChange={(evento) => fijarValidacionIA(uso.id, evento.target.value)}
                    />
                  </td>
                  <td data-etiqueta="Fuente verificada">{uso.fuente}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <section className={estilos.declaracion} aria-labelledby="titulo-declaracion">
        <h2 id="titulo-declaracion" className={estilos.subtitulo}>
          Declaración jurada
        </h2>
        <p className={estilos.texto}>
          Yo, <strong>{proyecto.autor}</strong>, {declaracionJurada.charAt(0).toLowerCase() + declaracionJurada.slice(1)}
        </p>
        {firmaDeclaracion ? (
          <div className={estilos.firmada}>
            <SealCheckIcon className={estilos.sello} weight="bold" aria-hidden="true" />
            <div>
              <p className={estilos.firmaNombre}>{firmaDeclaracion.nombre}</p>
              <p className={estilos.firmaFecha}>Firmado el {firmaDeclaracion.fecha}</p>
            </div>
            <button type="button" className="pulsador" data-compacto="" onClick={quitarFirmaDeclaracion}>
              Quitar firma
            </button>
          </div>
        ) : (
          <form className={estilos.formulario} onSubmit={firmar}>
            <label htmlFor="firma-declaracion" className="rotulo">
              Nombre completo del estudiante
            </label>
            <div className={estilos.fila}>
              <input id="firma-declaracion" className="control-texto" value={nombre} autoComplete="name" onChange={(evento) => setNombre(evento.target.value)} />
              <button type="submit" className="pulsador" data-principal="" disabled={!nombre.trim()}>
                Firmar declaración
              </button>
            </div>
          </form>
        )}
      </section>
    </Pagina>
  )
}
