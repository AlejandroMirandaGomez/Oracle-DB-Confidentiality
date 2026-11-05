import { matriz } from '../data/catalogo/matriz'
import { pruebas } from '../data/catalogo/pruebas'
import type {
  EvidenciaRequerida,
  Nivel,
  Niveles,
  RegistroEvidencia,
  RegistroPrueba,
  RespuestaPrueba,
  RespuestasEvidencia,
  RespuestasPruebas,
  ValorMedicion,
} from '../data/tipos'
import { camposDeEvidencia, idNingunaCondicion, valoresDeAlcance } from './medicion'

export const formatoEvaluacion = 'evaluacion-confidencialidad-oracle'
export const versionEvaluacion = 4
const versionesLegibles: unknown[] = [1, 2, 3, versionEvaluacion]

export type Evaluacion = {
  organizacion: string
  niveles: Niveles
  respuestasEvidencia: RespuestasEvidencia
  respuestasPruebas: RespuestasPruebas
}

export type EvaluacionExportada = Evaluacion & {
  formato: typeof formatoEvaluacion
  version: typeof versionEvaluacion
  fechaExportacion: string
}

export type ResumenImportacion = {
  niveles: number
  evidencias: number
  pruebas: number
  ignorados: number
}

export type ResultadoValidacion =
  | { ok: true; evaluacion: Evaluacion; resumen: ResumenImportacion }
  | { ok: false; mensaje: string }

const respuestasDePrueba: RespuestaPrueba[] = ['Conforme', 'Parcial', 'No conforme']
const largoMaximoOrganizacion = 120
const largoMaximoNota = 2000
const valorMaximoMedicion = 1_000_000_000_000

const evidenciasPorFila = new Map(matriz.map((fila) => [fila.id, new Map([[fila.evidencia.id, fila.evidencia]])]))
const idsDePruebas = new Set(pruebas.map((prueba) => prueba.id))

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function esNivel(valor: unknown): valor is Nivel {
  return typeof valor === 'number' && Number.isInteger(valor) && valor >= 0 && valor <= 4
}

function textoAcotado(valor: unknown, maximo: number): string {
  return typeof valor === 'string' ? valor.slice(0, maximo) : ''
}

export function sanearOrganizacion(valor: unknown): string {
  return textoAcotado(valor, largoMaximoOrganizacion)
}

export function sanearNiveles(valor: unknown, ignorados = { cuenta: 0 }): Niveles {
  const niveles: Niveles = {}
  if (!esObjeto(valor)) return niveles
  Object.entries(valor).forEach(([filaId, nivel]) => {
    if (evidenciasPorFila.has(filaId) && esNivel(nivel)) niveles[filaId] = nivel
    else ignorados.cuenta += 1
  })
  return niveles
}

function sanearValores(evidencia: EvidenciaRequerida, valor: Record<string, unknown>): Record<string, ValorMedicion> {
  const limpios: Record<string, ValorMedicion> = {}
  camposDeEvidencia(evidencia).forEach((campo) => {
    const numero = valor[campo.id]
    if (typeof numero === 'number' && Number.isFinite(numero) && numero >= 0 && numero <= valorMaximoMedicion) limpios[campo.id] = numero
  })
  evidencia.mediciones.forEach(({ regla }) => {
    if (regla.tipo === 'opciones') {
      const opcion = regla.opciones.find((item) => item.valor === valor[regla.campo.id])
      if (opcion) limpios[regla.campo.id] = opcion.valor
    }
    if (regla.tipo === 'alcance') {
      const opcion = valor[regla.campo.id]
      if (typeof opcion === 'string' && valoresDeAlcance.includes(opcion)) limpios[regla.campo.id] = opcion
    }
    if (regla.tipo === 'lista') {
      regla.items.forEach((item) => {
        if (valor[item.id] === true) limpios[item.id] = true
      })
      if (valor[idNingunaCondicion] === true) limpios[idNingunaCondicion] = true
    }
  })
  return limpios
}

export function sanearRespuestasEvidencia(valor: unknown, ignorados = { cuenta: 0 }): RespuestasEvidencia {
  const respuestas: RespuestasEvidencia = {}
  if (!esObjeto(valor)) return respuestas
  Object.entries(valor).forEach(([filaId, porEvidencia]) => {
    const conocidas = evidenciasPorFila.get(filaId)
    if (!conocidas || !esObjeto(porEvidencia)) {
      ignorados.cuenta += 1
      return
    }
    Object.entries(porEvidencia).forEach(([evidenciaId, registro]) => {
      const evidencia = conocidas.get(evidenciaId)
      if (!evidencia || !esObjeto(registro) || !esObjeto(registro.valores)) {
        ignorados.cuenta += 1
        return
      }
      const valores = sanearValores(evidencia, registro.valores)
      const nota = textoAcotado(registro.nota, largoMaximoNota)
      if (Object.keys(valores).length === 0 && nota === '') return
      const registroLimpio: RegistroEvidencia = { valores, nota }
      respuestas[filaId] = { ...respuestas[filaId], [evidenciaId]: registroLimpio }
    })
  })
  return respuestas
}

export function sanearRespuestasPruebas(valor: unknown, ignorados = { cuenta: 0 }): RespuestasPruebas {
  const respuestas: RespuestasPruebas = {}
  if (!esObjeto(valor)) return respuestas
  Object.entries(valor).forEach(([pruebaId, registro]) => {
    if (!idsDePruebas.has(pruebaId) || !esObjeto(registro)) {
      ignorados.cuenta += 1
      return
    }
    const respuesta = respuestasDePrueba.find((opcion) => opcion === registro.respuesta) ?? null
    const nota = textoAcotado(registro.nota, largoMaximoNota)
    if (respuesta === null && nota === '') return
    const registroLimpio: RegistroPrueba = { respuesta, nota }
    respuestas[pruebaId] = registroLimpio
  })
  return respuestas
}

export function contarEvidencias(respuestas: RespuestasEvidencia): number {
  return Object.values(respuestas).reduce((total, porFila) => total + Object.keys(porFila).length, 0)
}

export function hayDatosDeEvaluacion(evaluacion: Evaluacion): boolean {
  return (
    Object.keys(evaluacion.niveles).length > 0 ||
    contarEvidencias(evaluacion.respuestasEvidencia) > 0 ||
    Object.keys(evaluacion.respuestasPruebas).length > 0
  )
}

export function construirArchivo(evaluacion: Evaluacion, ahora: Date): EvaluacionExportada {
  return {
    formato: formatoEvaluacion,
    version: versionEvaluacion,
    organizacion: evaluacion.organizacion,
    fechaExportacion: ahora.toISOString(),
    niveles: evaluacion.niveles,
    respuestasEvidencia: evaluacion.respuestasEvidencia,
    respuestasPruebas: evaluacion.respuestasPruebas,
  }
}

function dosDigitos(valor: number): string {
  return String(valor).padStart(2, '0')
}

export function fechaParaArchivo(fecha: Date): string {
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`
}

export function nombreSeguro(organizacion: string): string {
  const limpio = organizacion
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return limpio === '' ? 'sin-nombre' : limpio
}

export function nombreArchivoEvaluacion(organizacion: string, fecha: Date): string {
  return `evaluacion-${nombreSeguro(organizacion)}-${fechaParaArchivo(fecha)}.json`
}

export function validarArchivo(texto: string): ResultadoValidacion {
  let contenido: unknown
  try {
    contenido = JSON.parse(texto)
  } catch {
    return {
      ok: false,
      mensaje: 'El archivo no es un JSON válido. Elija un archivo descargado con Exportar evaluación, sin modificarlo.',
    }
  }
  if (!esObjeto(contenido) || contenido.formato !== formatoEvaluacion) {
    return {
      ok: false,
      mensaje: `El archivo no tiene el formato ${formatoEvaluacion}. Elija un archivo descargado con Exportar evaluación en esta aplicación.`,
    }
  }
  if (!versionesLegibles.includes(contenido.version)) {
    return {
      ok: false,
      mensaje: `La versión del archivo (${String(contenido.version)}) no es compatible, esta aplicación lee la versión ${versionEvaluacion}. Exporte de nuevo la evaluación desde la aplicación que la generó.`,
    }
  }
  const ignorados = { cuenta: 0 }
  const niveles = sanearNiveles(contenido.niveles, ignorados)
  const respuestasEvidencia = sanearRespuestasEvidencia(contenido.respuestasEvidencia, ignorados)
  const respuestasPruebas = sanearRespuestasPruebas(contenido.respuestasPruebas, ignorados)
  return {
    ok: true,
    evaluacion: { organizacion: sanearOrganizacion(contenido.organizacion), niveles, respuestasEvidencia, respuestasPruebas },
    resumen: {
      niveles: Object.keys(niveles).length,
      evidencias: contarEvidencias(respuestasEvidencia),
      pruebas: Object.keys(respuestasPruebas).length,
      ignorados: ignorados.cuenta,
    },
  }
}
