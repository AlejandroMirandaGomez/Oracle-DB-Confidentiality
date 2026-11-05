import { construirArchivo, validarArchivo, type Evaluacion } from './archivoEvaluacion'
import { crearEvaluacionesCliente } from './demoCliente'

const claveHistorial = 'confidencialidad-oracle:historial'
const clavesDemostracionAnteriores = ['confidencialidad-oracle:cliente-demostracion-inicializada-v1', 'confidencialidad-oracle:cliente-demostracion-inicializada-v2', 'confidencialidad-oracle:cliente-demostracion-inicializada-v3', 'confidencialidad-oracle:cliente-demostracion-inicializada-v4', 'confidencialidad-oracle:cliente-demostracion-inicializada-v5']
const claveDemostracionCliente = 'confidencialidad-oracle:cliente-demostracion-inicializada-v6'
const idsDemostracionesTemporales = new Set(Array.from({ length: 5 }, (_, indice) => `cliente-demostracion-adicional-${indice + 1}`))

export type EvaluacionGuardada = {
  id: string
  fechaGuardado: string
  demostracion?: boolean
  evaluacion: Evaluacion
}

export type ResultadoHistorial = { ok: true } | { ok: false; mensaje: string }

export function leerHistorial(): EvaluacionGuardada[] {
  try {
    const contenido: unknown = JSON.parse(window.localStorage.getItem(claveHistorial) ?? '[]')
    if (!Array.isArray(contenido)) return []
    const registrosVigentes = contenido.filter((registro) => {
      if (typeof registro !== 'object' || registro === null) return true
      const candidato = registro as Record<string, unknown>
      return !(candidato.demostracion === true && typeof candidato.id === 'string' && idsDemostracionesTemporales.has(candidato.id))
    })
    if (registrosVigentes.length !== contenido.length) {
      try {
        window.localStorage.setItem(claveHistorial, JSON.stringify(registrosVigentes))
      } catch {
        return registrosVigentes.flatMap(validarRegistroHistorial)
      }
    }
    return registrosVigentes.flatMap(validarRegistroHistorial)
  } catch {
    return []
  }
}

function validarRegistroHistorial(registro: unknown): EvaluacionGuardada[] {
  try {
    if (typeof registro !== 'object' || registro === null) return []
    const candidato = registro as Record<string, unknown>
    if (typeof candidato.id !== 'string' || typeof candidato.fechaGuardado !== 'string' || !Number.isFinite(Date.parse(candidato.fechaGuardado))) return []
    const evaluacion = candidato.evaluacion
    if (typeof evaluacion !== 'object' || evaluacion === null) return []
    const validacion = validarArchivo(JSON.stringify(construirArchivo(evaluacion as Evaluacion, new Date(candidato.fechaGuardado))))
    return validacion.ok ? [{ id: candidato.id, fechaGuardado: candidato.fechaGuardado, demostracion: candidato.demostracion === true, evaluacion: validacion.evaluacion }] : []
  } catch {
    return []
  }
}

export function escribirHistorial(historial: EvaluacionGuardada[]): ResultadoHistorial {
  try {
    window.localStorage.setItem(claveHistorial, JSON.stringify(historial))
    return { ok: true }
  } catch {
    return { ok: false, mensaje: 'No se pudo guardar en este navegador. Compruebe que haya espacio disponible y permita el almacenamiento local.' }
  }
}

export function inicializarHistorialCliente(historial: EvaluacionGuardada[]): EvaluacionGuardada[] {
  try {
    if (window.localStorage.getItem(claveDemostracionCliente) === '1') return historial
    const propias = historial.filter((registro) => !registro.demostracion)
    const yaInicializado = clavesDemostracionAnteriores.some((clave) => window.localStorage.getItem(clave) === '1')
    const conservaDemostraciones = propias.length !== historial.length
    const demostraciones = !yaInicializado || conservaDemostraciones ? crearEvaluacionesCliente(new Date()) : []
    const siguientes = [...propias, ...demostraciones].sort((a, b) => Date.parse(b.fechaGuardado) - Date.parse(a.fechaGuardado))
    if (!escribirHistorial(siguientes).ok) return historial
    try {
      window.localStorage.setItem(claveDemostracionCliente, '1')
    } catch {
      return siguientes
    }
    return siguientes
  } catch {
    return historial
  }
}
