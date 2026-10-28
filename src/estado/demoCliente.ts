import { matriz } from '../data/catalogo/matriz'
import type { Nivel, RespuestaEvidencia, RespuestaPrueba, RespuestasEvidencia, RespuestasPruebas } from '../data/tipos'
import type { EvaluacionGuardada } from './historial'

type Serie<T> = readonly [T, T, T, T, T]
type PerfilControl = { niveles: Serie<Nivel>; evidencias: Serie<RespuestaEvidencia> }

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

const resultadoPrueba: Record<RespuestaEvidencia, RespuestaPrueba> = {
  Sí: 'Conforme',
  Parcial: 'Parcial',
  No: 'No conforme',
}

const observacionPrueba: Record<RespuestaEvidencia, string> = {
  Sí: 'Simulación: cumple el resultado esperado.',
  Parcial: 'Simulación: cumple parcialmente el criterio.',
  No: 'Simulación: no alcanza el resultado esperado.',
}

function crearRegistroCliente(
  id: string,
  fechaReferencia: Date,
  diasAntes: number,
  definirFila: (filaId: string, indiceFila: number) => { nivel: Nivel; respuesta: RespuestaEvidencia },
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
    respuestasEvidencia[fila.id] = Object.fromEntries(fila.evidenciasRequeridas.map((evidencia) => [evidencia.id, { respuesta, nota: '' }]))
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

