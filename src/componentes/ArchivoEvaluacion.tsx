import { DownloadSimpleIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { useRef, useState, type ChangeEvent } from 'react'
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

export function ArchivoEvaluacion() {
  const { exportarEvaluacion, importarEvaluacion, hayDatos } = useEvaluacion()
  const [estado, setEstado] = useState<Estado>({ tipo: 'reposo' })
  const entrada = useRef<HTMLInputElement>(null)

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
      <div className={estilos.botones}>
        <button type="button" className="pulsador" onClick={exportarEvaluacion}>
          <DownloadSimpleIcon aria-hidden="true" />
          Exportar evaluación
        </button>
        <button type="button" className="pulsador" onClick={() => entrada.current?.click()}>
          <UploadSimpleIcon aria-hidden="true" />
          Importar evaluación
        </button>
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
