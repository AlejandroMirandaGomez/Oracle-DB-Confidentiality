import { CheckIcon, ClipboardTextIcon, SealCheckIcon } from '@phosphor-icons/react'
import { useEffect, useState, type FormEvent } from 'react'
import { Papel } from '../componentes/Papel'
import { legajo } from '../data/legajo'
import { declaracionJurada, usosIA, validacionPendiente } from '../data/usoIA'
import { guardarAlmacen, leerAlmacen } from '../estado/almacen'
import estilos from './PapelUsoIA.module.css'

type FirmaDeclaracion = { nombre: string; fecha: string }

export function PapelUsoIA() {
  const [validaciones, setValidaciones] = useState<Record<string, string>>(() => leerAlmacen('validaciones-ia', {}))
  const [firma, setFirma] = useState<FirmaDeclaracion | null>(() => leerAlmacen<FirmaDeclaracion | null>('declaracion', null))
  const [nombre, setNombre] = useState('')
  const [copiado, setCopiado] = useState(false)

  useEffect(() => guardarAlmacen('validaciones-ia', validaciones), [validaciones])
  useEffect(() => guardarAlmacen('declaracion', firma), [firma])
  useEffect(() => {
    if (!copiado) return
    const temporizador = window.setTimeout(() => setCopiado(false), 1600)
    return () => window.clearTimeout(temporizador)
  }, [copiado])

  const pendientes = usosIA.filter((uso) => !(validaciones[uso.id] ?? '').trim()).length

  async function copiarTabla() {
    const filas = usosIA.map((uso) =>
      [uso.herramienta, uso.prompt, uso.aporte, (validaciones[uso.id] ?? '').trim() || validacionPendiente, uso.fuente].join('\t'),
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
    const limpio = nombre.trim()
    if (!limpio) return
    setFirma({ nombre: limpio, fecha: new Intl.DateTimeFormat('es-CR', { dateStyle: 'long' }).format(new Date()) })
    setNombre('')
  }

  return (
    <Papel
      letra="I"
      titulo="Uso documentado de inteligencia artificial"
      objetivo="Registro de cada uso de IA generativa en este trabajo, con el prompt exacto, lo que aportó, cómo lo validó el estudiante y la fuente oficial contra la que se verificó."
    >
      <div className={estilos.barra}>
        <p className={estilos.estado}>
          {pendientes === 0
            ? 'Todas las validaciones están completas.'
            : `${pendientes} de ${usosIA.length} validaciones por completar. Escríbalas en la columna correspondiente; se guardan en este navegador.`}
        </p>
        <button type="button" className={estilos.copiar} onClick={copiarTabla}>
          {copiado ? <CheckIcon weight="bold" aria-hidden="true" /> : <ClipboardTextIcon aria-hidden="true" />}
          {copiado ? 'Tabla copiada' : 'Copiar tabla'}
        </button>
      </div>

      <div className={estilos.marco}>
        <table className={estilos.tabla}>
          <caption className="solo-lectores">Tabla de uso de inteligencia artificial</caption>
          <thead>
            <tr>
              <th scope="col" className={estilos.colHerramienta}>Herramienta IA</th>
              <th scope="col" className={estilos.colPrompt}>Prompt exacto utilizado</th>
              <th scope="col" className={estilos.colAporte}>Aporte de la IA</th>
              <th scope="col" className={estilos.colValidacion}>Validación o corrección del estudiante</th>
              <th scope="col" className={estilos.colFuente}>Fuente verificada</th>
            </tr>
          </thead>
          <tbody>
            {usosIA.map((uso) => {
              const texto = validaciones[uso.id] ?? ''
              return (
                <tr key={uso.id}>
                  <th scope="row">{uso.herramienta}</th>
                  <td>
                    <q className={estilos.prompt}>{uso.prompt}</q>
                  </td>
                  <td>{uso.aporte}</td>
                  <td>
                    <label className="solo-lectores" htmlFor={`validacion-${uso.id}`}>
                      Validación del estudiante para {uso.id}
                    </label>
                    <textarea
                      id={`validacion-${uso.id}`}
                      className={estilos.validacion}
                      data-pendiente={!texto.trim() || undefined}
                      value={texto}
                      placeholder={validacionPendiente}
                      rows={4}
                      onChange={(evento) => setValidaciones((previas) => ({ ...previas, [uso.id]: evento.target.value }))}
                    />
                  </td>
                  <td>{uso.fuente}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className={estilos.declaracion}>
        <h3 className={estilos.declaracionTitulo}>Declaración jurada</h3>
        <p className={estilos.declaracionTexto}>
          Yo, <strong>{legajo.autor}</strong>, {declaracionJurada.charAt(0).toLowerCase() + declaracionJurada.slice(1)}
        </p>
        {firma ? (
          <div className={estilos.firmada}>
            <SealCheckIcon className={estilos.sello} weight="bold" aria-hidden="true" />
            <div>
              <p className={estilos.firmaNombre}>{firma.nombre}</p>
              <p className={estilos.firmaFecha}>Firmado el {firma.fecha}</p>
            </div>
            <button type="button" className={estilos.quitar} onClick={() => setFirma(null)}>
              Quitar firma
            </button>
          </div>
        ) : (
          <form className={estilos.formulario} onSubmit={firmar}>
            <label htmlFor="firma-declaracion" className={estilos.etiqueta}>
              Nombre completo del estudiante
            </label>
            <div className={estilos.fila}>
              <input
                id="firma-declaracion"
                className={estilos.campo}
                value={nombre}
                autoComplete="name"
                onChange={(evento) => setNombre(evento.target.value)}
              />
              <button type="submit" className={estilos.firmar} disabled={!nombre.trim()}>
                Firmar declaración
              </button>
            </div>
          </form>
        )}
      </div>
    </Papel>
  )
}
