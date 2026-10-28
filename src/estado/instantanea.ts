import { createContext, useContext } from 'react'
import type { Evaluacion } from './archivoEvaluacion'

export const ContextoInstantanea = createContext<Evaluacion | null>(null)

export function useInstantanea(): Evaluacion | null {
  return useContext(ContextoInstantanea)
}
