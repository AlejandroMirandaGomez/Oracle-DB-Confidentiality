import { createContext, useContext } from 'react'
import type {
  Hallazgo,
  NivelEvaluado,
  RegistroEvidencia,
  RegistroPrueba,
} from '../data/tipos'
import type { ResumenImportacion } from './archivoEvaluacion'

export type FirmaDeclaracion = { nombre: string; fecha: string }

export type Progreso = { hechas: number; total: number }

export type ResultadoImportacion =
  | { ok: true; resumen: ResumenImportacion; aplicar: () => void }
  | { ok: false; mensaje: string }

export type ValorEvaluacion = {
  organizacion: string
  fijarOrganizacion: (nombre: string) => void
  nivelDe: (filaId: string) => NivelEvaluado
  fijarNivel: (filaId: string, nivel: NivelEvaluado) => void
  respuestaEvidencia: (filaId: string, evidenciaId: string) => RegistroEvidencia
  fijarRespuestaEvidencia: (filaId: string, evidenciaId: string, cambios: Partial<RegistroEvidencia>) => void
  respuestaPrueba: (pruebaId: string) => RegistroPrueba
  fijarRespuestaPrueba: (pruebaId: string, cambios: Partial<RegistroPrueba>) => void
  limpiarMatriz: () => void
  limpiarBateria: () => void
  exportarEvaluacion: () => void
  importarEvaluacion: (archivo: File) => Promise<ResultadoImportacion>
  hayDatos: boolean
  matrizCompleta: boolean
  bateriaCompleta: boolean
  progresoMatriz: Progreso
  progresoBateria: Progreso
  progresoEvidencias: (filaId: string) => Progreso
  hallazgos: Hallazgo[]
  pasosVistos: string[]
  marcarPasoVisto: (paso: string) => void
  validacionesIA: Record<string, string>
  fijarValidacionIA: (usoId: string, texto: string) => void
  firmaDeclaracion: FirmaDeclaracion | null
  firmarDeclaracion: (nombre: string) => void
  quitarFirmaDeclaracion: () => void
  pila: string[]
  direccion: 1 | -1
  abrirReferencia: (id: string) => void
  seguirReferencia: (id: string) => void
  volverA: (indice: number) => void
  cerrarHoja: () => void
}

export const ContextoEvaluacion = createContext<ValorEvaluacion | null>(null)

export function useEvaluacion(): ValorEvaluacion {
  const valor = useContext(ContextoEvaluacion)
  if (!valor) throw new Error('useEvaluacion debe usarse dentro de EvaluacionProvider')
  return valor
}
