import { FloppyDiskIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import estilos from './BotonGuardarEvaluacion.module.css'

export function BotonGuardarEvaluacion() {
  const { guardarEvaluacion, matrizCompleta, progresoMatriz } = useEvaluacion()
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null)
  const faltan = progresoMatriz.total - progresoMatriz.hechas

  const guardar = () => {
    const resultado = guardarEvaluacion()
    setMensaje(resultado.ok
      ? { tipo: 'exito', texto: 'Evaluación guardada en este navegador.' }
      : { tipo: 'error', texto: resultado.mensaje })
  }

  return (
    <div className={estilos.contenedor}>
      <button
        type="button"
        className={`pulsador ${estilos.boton}`}
        disabled={!matrizCompleta}
        aria-label="Guardar evaluación"
        title={matrizCompleta ? 'Guardar el estado actual de la evaluación' : `Complete la matriz para guardar. Faltan ${faltan} filas.`}
        onClick={guardar}
      >
        <FloppyDiskIcon weight="bold" aria-hidden="true" />
        <span className={estilos.etiqueta}>Guardar evaluación</span>
      </button>
      {mensaje && (
        <div className={estilos.mensaje} role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
          <span>{mensaje.texto}</span>
          {mensaje.tipo === 'exito' && <Link to="/historial" onClick={() => setMensaje(null)}>Ver historial</Link>}
          <button type="button" aria-label="Cerrar mensaje" onClick={() => setMensaje(null)}><XIcon aria-hidden="true" /></button>
        </div>
      )}
    </div>
  )
}
