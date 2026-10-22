import { CheckIcon, ClipboardTextIcon, SealCheckIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Pagina } from '../componentes/Pagina'
import { proyecto } from '../data/catalogo/proyecto'
import { declaracionJurada, firmaDeclaracion, usosIA } from '../data/catalogo/usoIA'
import estilos from './UsoIA.module.css'

export function UsoIA() {
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (!copiado) return
    const temporizador = window.setTimeout(() => setCopiado(false), 1600)
    return () => window.clearTimeout(temporizador)
  }, [copiado])

  async function copiarTabla() {
    const filas = usosIA.map((uso) => [uso.herramienta, uso.prompt, uso.aporte, uso.validacion, uso.fuente].join('\t'))
    const texto = ['Herramienta IA\tPrompt exacto utilizado\tAporte de la IA\tValidación o corrección del estudiante\tFuente verificada', ...filas].join('\n')
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <Pagina
      titulo="Declaración del uso de IA"
      introduccion="Registro de cada uso de IA generativa en este trabajo, con el prompt exacto, lo que aportó, cómo lo validó el estudiante y la fuente oficial contra la que se verificó."
    >
      <div className={estilos.barra}>
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
            {usosIA.map((uso) => (
              <tr key={uso.id}>
                <th scope="row" data-etiqueta="Herramienta IA">
                  {uso.herramienta}
                </th>
                <td data-etiqueta="Prompt exacto">
                  <q className={estilos.prompt}>{uso.prompt}</q>
                </td>
                <td data-etiqueta="Aporte de la IA">{uso.aporte}</td>
                <td data-etiqueta="Validación">{uso.validacion}</td>
                <td data-etiqueta="Fuente verificada">{uso.fuente}</td>
              </tr>
            ))}
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
        <div className={estilos.firmada}>
          <SealCheckIcon className={estilos.sello} weight="bold" aria-hidden="true" />
          <div>
            <p className={estilos.firmaNombre}>{firmaDeclaracion.nombre}</p>
            <p className={estilos.firmaFecha}>Firmado el {firmaDeclaracion.fecha}</p>
          </div>
        </div>
      </section>
    </Pagina>
  )
}
