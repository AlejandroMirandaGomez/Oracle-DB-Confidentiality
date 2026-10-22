import { createContext, useContext } from 'react'
import { indiceCatalogoBase, type Indice } from './indice'

export const ContextoIndice = createContext<Indice>(indiceCatalogoBase)

export function useIndice(): Indice {
  return useContext(ContextoIndice)
}
