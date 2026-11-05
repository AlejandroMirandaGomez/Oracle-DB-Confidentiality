import { matriz } from '../data/catalogo/matriz'
import type { EvidenciaRequerida, Medicion, Nivel, RespuestaPrueba, RespuestasEvidencia, RespuestasPruebas, ValorMedicion } from '../data/tipos'
import type { EvaluacionGuardada } from './historial'
import { idNingunaCondicion, opcionesDeAlcance } from './medicion'

type RespuestaSimulada = 'Sí' | 'Parcial' | 'No'
type Serie<T> = readonly [T, T, T, T, T]
type PerfilControl = { niveles: Serie<Nivel>; evidencias: Serie<RespuestaSimulada> }

const perfiles: Record<string, PerfilControl> = {
  'M-01': { niveles: [1, 2, 3, 4, 4], evidencias: ['Parcial', 'Sí', 'Sí', 'Sí', 'Sí'] },
  'M-02': { niveles: [1, 2, 3, 4, 4], evidencias: ['Parcial', 'Parcial', 'Sí', 'Parcial', 'Sí'] },
  'M-03': { niveles: [2, 2, 3, 4, 3], evidencias: ['Parcial', 'Sí', 'Sí', 'Sí', 'Parcial'] },
  'M-04': { niveles: [1, 2, 3, 4, 4], evidencias: ['Parcial', 'Sí', 'Sí', 'Sí', 'Sí'] },
  'M-05': { niveles: [1, 1, 2, 3, 4], evidencias: ['No', 'Parcial', 'Parcial', 'Sí', 'Sí'] },
  'M-06': { niveles: [1, 2, 3, 4, 4], evidencias: ['Parcial', 'Sí', 'Sí', 'Parcial', 'Sí'] },
  'M-07': { niveles: [2, 2, 3, 4, 4], evidencias: ['Parcial', 'Sí', 'Sí', 'Sí', 'Sí'] },
  'M-08': { niveles: [1, 2, 3, 4, 3], evidencias: ['No', 'Parcial', 'Sí', 'Sí', 'Parcial'] },
  'M-09': { niveles: [1, 2, 3, 3, 4], evidencias: ['Parcial', 'Parcial', 'Sí', 'Parcial', 'Sí'] },
  'M-10': { niveles: [1, 2, 3, 4, 4], evidencias: ['Parcial', 'Sí', 'Sí', 'Sí', 'Sí'] },
  'M-11': { niveles: [1, 2, 3, 4, 4], evidencias: ['Parcial', 'Sí', 'Sí', 'Parcial', 'Sí'] },
  'M-12': { niveles: [2, 2, 3, 4, 4], evidencias: ['Parcial', 'Sí', 'Sí', 'Sí', 'Sí'] },
  'M-13': { niveles: [1, 2, 3, 4, 4], evidencias: ['No', 'Parcial', 'Parcial', 'Parcial', 'Sí'] },
  'M-14': { niveles: [1, 2, 3, 3, 2], evidencias: ['Parcial', 'Sí', 'Sí', 'Parcial', 'Parcial'] },
  'M-15': { niveles: [1, 2, 3, 4, 4], evidencias: ['Parcial', 'Parcial', 'Sí', 'Sí', 'Sí'] },
  'M-16': { niveles: [1, 2, 2, 3, 4], evidencias: ['No', 'Parcial', 'Sí', 'Sí', 'Sí'] },
  'M-17': { niveles: [1, 2, 3, 4, 4], evidencias: ['Parcial', 'Sí', 'Sí', 'Parcial', 'Sí'] },
  'M-18': { niveles: [1, 2, 3, 4, 4], evidencias: ['Parcial', 'Sí', 'Sí', 'Sí', 'Sí'] },
}

const diasAnteriores = [120, 90, 60, 30, 1] as const
const etapas = [0, 1, 2, 3, 4] as const

const resultadoPrueba: Record<RespuestaSimulada, RespuestaPrueba> = {
  Sí: 'Conforme',
  Parcial: 'Parcial',
  No: 'No conforme',
}

const observacionPrueba: Record<RespuestaSimulada, string> = {
  Sí: 'Simulación: cumple el resultado esperado.',
  Parcial: 'Simulación: cumple parcialmente el criterio.',
  No: 'Simulación: no alcanza el resultado esperado.',
}

const calidadPorNivel: Record<Nivel, number> = { 0: 0.05, 1: 0.3, 2: 0.62, 3: 0.86, 4: 0.97 }
const ajustePorRespuesta: Record<RespuestaSimulada, number> = { Sí: 0, Parcial: -0.08, No: -0.18 }
const variacionPorEvidencia = [0.03, -0.04, 0.01, -0.02] as const
const casosDescontados = 2

function calidadSimulada(nivel: Nivel, respuesta: RespuestaSimulada, indice: number): number {
  const variacion = variacionPorEvidencia[indice % variacionPorEvidencia.length] ?? 0
  return Math.min(1, Math.max(0, calidadPorNivel[nivel] + ajustePorRespuesta[respuesta] + variacion))
}

function simularMedicion(medicion: Medicion, calidad: number, valores: Record<string, ValorMedicion>, fijados: Set<string>): void {
  const { regla } = medicion
  const fijar = (id: string, valor: ValorMedicion) => {
    if (medicion.campos.some((campo) => campo.id === id && campo.oculto)) return
    valores[id] = valor
    fijados.add(id)
  }
  const objetivoDe = (id: string) => medicion.campos.find((campo) => campo.id === id)?.sugerido ?? 30
  medicion.campos.forEach((campo) => {
    if (!campo.oculto && !(campo.id in valores)) valores[campo.id] = campo.sugerido ?? 0
  })
  if (regla.tipo === 'proporcion') {
    const total = fijados.has(regla.total) ? Number(valores[regla.total]) : Math.max(...regla.ejemplos.map((ejemplo) => ejemplo.total))
    const casos = Math.min(total, Math.round(((1 - calidad) * regla.maximoTolerado * total) / 100))
    fijar(regla.total, total)
    if (regla.descontar && regla.casos === regla.total) {
      fijar(regla.descontar, total - casos)
    } else if (regla.descontar && fijados.has(regla.casos)) {
      fijar(regla.descontar, Math.max(0, Number(valores[regla.casos]) - casos))
    } else {
      fijar(regla.casos, casos)
      if (regla.descontar) fijar(regla.descontar, 0)
    }
  } else if (regla.tipo === 'porCaso') {
    const casos = Math.max(0, Math.ceil((1 - calidad) / regla.restaPorCaso - 0.2))
    if (regla.descontar) {
      const brutos = fijados.has(regla.casos) ? Number(valores[regla.casos]) : casos + casosDescontados
      fijar(regla.casos, brutos)
      fijar(regla.descontar, Math.max(0, brutos - casos))
    } else {
      fijar(regla.casos, casos)
    }
  } else if (regla.tipo === 'vigencia') {
    const objetivo = objetivoDe(regla.objetivo)
    fijar(regla.objetivo, objetivo)
    fijar(regla.dias, Math.round(objetivo * (1 + (1 - calidad) * (regla.vecesLimite - 1))))
  } else if (regla.tipo === 'cobertura') {
    const objetivo = objetivoDe(regla.objetivo)
    fijar(regla.objetivo, objetivo)
    fijar(regla.valor, Math.round(objetivo * calidad))
  } else if (regla.tipo === 'alcance') {
    const base = fijados.has(regla.base) ? Number(valores[regla.base]) : regla.ejemploBase
    fijar(regla.base, base)
    const cercana = opcionesDeAlcance(regla, base).reduce((mejor, opcion) => (Math.abs(opcion.puntos - calidad) < Math.abs(mejor.puntos - calidad) ? opcion : mejor))
    fijar(regla.campo.id, cercana.valor)
  } else if (regla.tipo === 'opciones') {
    const cercana = regla.opciones.reduce((mejor, opcion) => (Math.abs(opcion.puntos - calidad) < Math.abs(mejor.puntos - calidad) ? opcion : mejor))
    fijar(regla.campo.id, cercana.valor)
  } else {
    let suma = 0
    regla.items.forEach((item) => {
      if (suma + item.puntos / 2 > calidad) return
      suma += item.puntos
      fijar(item.id, true)
    })
    if (suma === 0) fijar(idNingunaCondicion, true)
  }
}

function valoresSimulados(evidencia: EvidenciaRequerida, nivel: Nivel, respuesta: RespuestaSimulada): Record<string, ValorMedicion> {
  const valores: Record<string, ValorMedicion> = {}
  const fijados = new Set<string>()
  evidencia.mediciones.forEach((medicion, indice) => simularMedicion(medicion, calidadSimulada(nivel, respuesta, indice), valores, fijados))
  return valores
}

function crearRegistroCliente(
  id: string,
  fechaReferencia: Date,
  diasAntes: number,
  definirFila: (filaId: string, indiceFila: number) => { nivel: Nivel; respuesta: RespuestaSimulada },
): EvaluacionGuardada {
  const fecha = new Date(fechaReferencia)
  fecha.setDate(fecha.getDate() - diasAntes)
  fecha.setHours(10, 0, 0, 0)
  const niveles: Record<string, Nivel> = {}
  const respuestasEvidencia: RespuestasEvidencia = {}
  const respuestasPruebas: RespuestasPruebas = {}

  matriz.forEach((fila, indiceFila) => {
    const { nivel, respuesta } = definirFila(fila.id, indiceFila)
    niveles[fila.id] = nivel
    respuestasEvidencia[fila.id] = { [fila.evidencia.id]: { valores: valoresSimulados(fila.evidencia, nivel, respuesta), nota: '' } }
    fila.pruebas.forEach((pruebaId) => {
      respuestasPruebas[pruebaId] = { respuesta: resultadoPrueba[respuesta], nota: observacionPrueba[respuesta] }
    })
  })

  return {
    id,
    fechaGuardado: fecha.toISOString(),
    demostracion: true,
    evaluacion: { organizacion: 'Cliente', niveles, respuestasEvidencia, respuestasPruebas },
  }
}

export function crearEvaluacionesCliente(fechaBase: Date): EvaluacionGuardada[] {
  return etapas.map((indice) => crearRegistroCliente(`cliente-demostracion-${indice + 1}`, fechaBase, diasAnteriores[indice], (filaId) => {
    const perfil = perfiles[filaId]
    if (!perfil) throw new Error(`Falta el perfil de demostración de ${filaId}`)
    return { nivel: perfil.niveles[indice], respuesta: perfil.evidencias[indice] }
  }))
}

