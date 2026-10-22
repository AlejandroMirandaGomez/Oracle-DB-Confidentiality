import type { NivelDe } from './calculos'
import { useEvaluacion } from './contextoEvaluacion'
import { useIndice } from './fuente'

export function useNivelDe(): NivelDe {
  const indice = useIndice()
  const { nivelDe } = useEvaluacion()
  return indice.nivelFijoDe ?? nivelDe
}
