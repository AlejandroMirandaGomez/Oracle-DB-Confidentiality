import { CaretDownIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { ResumenImportacion } from '../estado/archivoEvaluacion'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import estilos from './ArchivoEvaluacion.module.css'

type Estado =
  | { tipo: 'reposo' }
  | { tipo: 'confirmar'; resumen: ResumenImportacion; aplicar: () => void }
  | { tipo: 'hecho'; resumen: ResumenImportacion }
  | { tipo: 'error'; mensaje: string }

function describirResumen(resumen: ResumenImportacion): string {
  const partes = `${resumen.niveles} niveles, ${resumen.evidencias} respuestas de evidencias y ${resumen.pruebas} resultados de pruebas`
  return resumen.ignorados > 0 ? `${partes}. Se ignoraron ${resumen.ignorados} elementos que esta aplicación no reconoce` : partes
}

export type AccionArchivo = {
  etiqueta: string
  alActivar: () => void
  deshabilitada?: boolean
}

export function ArchivoEvaluacion({ acciones = [] }: { acciones?: AccionArchivo[] }) {
  const { exportarEvaluacion, importarEvaluacion, hayDatos } = useEvaluacion()
  const [estado, setEstado] = useState<Estado>({ tipo: 'reposo' })
  const [menuAbierto, setMenuAbierto] = useState(false)
  const entrada = useRef<HTMLInputElement>(null)
  const contenedorMenu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuAbierto) return
    const alPulsar = (evento: PointerEvent) => {
      if (!contenedorMenu.current?.contains(evento.target as Node)) setMenuAbierto(false)
    }
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setMenuAbierto(false)
    }
    document.addEventListener('pointerdown', alPulsar)
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('pointerdown', alPulsar)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [menuAbierto])

  const elegirOpcion = (accion: () => void) => {
    setMenuAbierto(false)
    accion()
  }

  const opciones: AccionArchivo[] = [
    ...acciones,
    { etiqueta: 'Exportar evaluación', alActivar: exportarEvaluacion },
    { etiqueta: 'Importar evaluación', alActivar: () => entrada.current?.click() },
  ]

  async function alElegir(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!archivo) return
    const resultado = await importarEvaluacion(archivo)
    if (!resultado.ok) {
      setEstado({ tipo: 'error', mensaje: resultado.mensaje })
      return
    }
    if (hayDatos) {
      setEstado({ tipo: 'confirmar', resumen: resultado.resumen, aplicar: resultado.aplicar })
      return
    }
    resultado.aplicar()
    setEstado({ tipo: 'hecho', resumen: resultado.resumen })
  }

  return (
    <div className={estilos.archivo}>
      <div className={estilos.menu} ref={contenedorMenu}>
        <button type="button" className="pulsador" aria-expanded={menuAbierto} aria-controls="menu-archivo" onClick={() => setMenuAbierto((abierto) => !abierto)}>
          <DownloadSimpleIcon aria-hidden="true" />
          Exportar e importar
          <CaretDownIcon weight="bold" aria-hidden="true" />
        </button>
        <div id="menu-archivo" className={estilos.opciones} hidden={!menuAbierto}>
          {opciones.map((opcion) => (
            <button key={opcion.etiqueta} type="button" className={estilos.opcion} disabled={opcion.deshabilitada} onClick={() => elegirOpcion(opcion.alActivar)}>
              {opcion.etiqueta}
            </button>
          ))}
        </div>
        <input ref={entrada} className="solo-lectores" type="file" accept="application/json,.json" tabIndex={-1} aria-hidden="true" onChange={alElegir} />
      </div>
      <div className={estilos.mensaje} aria-live="polite">
        {estado.tipo === 'error' && (
          <p role="alert" className={estilos.error}>
            {estado.mensaje}
          </p>
        )}
        {estado.tipo === 'hecho' && <p>Evaluación importada: {describirResumen(estado.resumen)}.</p>}
        {estado.tipo === 'confirmar' && (
          <div className={estilos.confirmacion}>
            <p>El archivo trae {describirResumen(estado.resumen)}. Reemplazará la evaluación que tiene ahora en este navegador.</p>
            <div className={estilos.botones}>
              <button
                type="button"
                className="pulsador"
                data-principal=""
                onClick={() => {
                  estado.aplicar()
                  setEstado({ tipo: 'hecho', resumen: estado.resumen })
                }}
              >
                Reemplazar mi evaluación actual
              </button>
              <button type="button" className="pulsador" onClick={() => setEstado({ tipo: 'reposo' })}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
