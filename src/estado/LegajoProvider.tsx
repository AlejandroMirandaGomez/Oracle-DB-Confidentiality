import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { matrizInicial } from '../data/matriz'
import type { Nivel } from '../data/tipos'
import { guardarAlmacen, leerAlmacen } from './almacen'
import { buscarEntidad } from './indice'

export type Firma = { iniciales: string; fecha: string }

type ValorLegajo = {
  nivelDe: (filaId: string) => Nivel
  nivelOriginal: (filaId: string) => Nivel
  estaAjustado: (filaId: string) => boolean
  hayAjustes: boolean
  fijarNivel: (filaId: string, nivel: Nivel) => void
  restablecerNiveles: () => void
  firmas: Record<string, Firma>
  firmar: (papel: string, iniciales: string) => void
  borrarFirma: (papel: string) => void
  pila: string[]
  direccion: 1 | -1
  abrirReferencia: (id: string) => void
  seguirReferencia: (id: string) => void
  volverA: (indice: number) => void
  cerrarHoja: () => void
  ultimoPapel: string | null
  marcarPapelVisible: (papel: string) => void
}

const ContextoLegajo = createContext<ValorLegajo | null>(null)

const nivelesOriginales = new Map(matrizInicial.map((fila) => [fila.id, fila.nivel]))

function leerReferenciaDeUrl(): string[] {
  const id = new URLSearchParams(window.location.search).get('ref')
  return id && buscarEntidad(id) ? [id] : []
}

function escribirReferenciaEnUrl(id: string | undefined) {
  const url = new URL(window.location.href)
  if (id) url.searchParams.set('ref', id)
  else url.searchParams.delete('ref')
  window.history.replaceState(null, '', url)
}

function fechaDeHoy(): string {
  return new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date())
}

export function LegajoProvider({ children }: { children: ReactNode }) {
  const [ajustes, setAjustes] = useState<Record<string, Nivel>>(() => leerAlmacen('niveles', {}))
  const [firmas, setFirmas] = useState<Record<string, Firma>>(() => leerAlmacen('firmas', {}))
  const [pila, setPila] = useState<string[]>(leerReferenciaDeUrl)
  const [direccion, setDireccion] = useState<1 | -1>(1)
  const [ultimoPapel] = useState<string | null>(() => leerAlmacen<string | null>('ultimo-papel', null))

  useEffect(() => guardarAlmacen('niveles', ajustes), [ajustes])
  useEffect(() => guardarAlmacen('firmas', firmas), [firmas])
  useEffect(() => escribirReferenciaEnUrl(pila.at(-1)), [pila])

  const nivelOriginal = useCallback((filaId: string): Nivel => nivelesOriginales.get(filaId) ?? 0, [])

  const nivelDe = useCallback(
    (filaId: string): Nivel => ajustes[filaId] ?? nivelOriginal(filaId),
    [ajustes, nivelOriginal],
  )

  const estaAjustado = useCallback(
    (filaId: string) => ajustes[filaId] !== undefined && ajustes[filaId] !== nivelOriginal(filaId),
    [ajustes, nivelOriginal],
  )

  const fijarNivel = useCallback(
    (filaId: string, nivel: Nivel) => {
      setAjustes((previos) => {
        const siguientes = { ...previos }
        if (nivel === nivelOriginal(filaId)) delete siguientes[filaId]
        else siguientes[filaId] = nivel
        return siguientes
      })
    },
    [nivelOriginal],
  )

  const restablecerNiveles = useCallback(() => setAjustes({}), [])

  const firmar = useCallback((papel: string, iniciales: string) => {
    const limpias = iniciales.trim().toUpperCase().slice(0, 5)
    if (!limpias) return
    setFirmas((previas) => ({ ...previas, [papel]: { iniciales: limpias, fecha: fechaDeHoy() } }))
  }, [])

  const borrarFirma = useCallback((papel: string) => {
    setFirmas((previas) => {
      const siguientes = { ...previas }
      delete siguientes[papel]
      return siguientes
    })
  }, [])

  const abrirReferencia = useCallback((id: string) => {
    if (!buscarEntidad(id)) return
    setDireccion(1)
    setPila([id])
  }, [])

  const seguirReferencia = useCallback((id: string) => {
    if (!buscarEntidad(id)) return
    setDireccion(1)
    setPila((previa) => {
      const posicion = previa.indexOf(id)
      if (posicion >= 0) return previa.slice(0, posicion + 1)
      return [...previa, id]
    })
  }, [])

  const volverA = useCallback((indice: number) => {
    setDireccion(-1)
    setPila((previa) => previa.slice(0, indice + 1))
  }, [])

  const cerrarHoja = useCallback(() => setPila([]), [])

  const marcarPapelVisible = useCallback((papel: string) => guardarAlmacen('ultimo-papel', papel), [])

  const valor = useMemo<ValorLegajo>(
    () => ({
      nivelDe,
      nivelOriginal,
      estaAjustado,
      hayAjustes: Object.keys(ajustes).length > 0,
      fijarNivel,
      restablecerNiveles,
      firmas,
      firmar,
      borrarFirma,
      pila,
      direccion,
      abrirReferencia,
      seguirReferencia,
      volverA,
      cerrarHoja,
      ultimoPapel,
      marcarPapelVisible,
    }),
    [nivelDe, nivelOriginal, estaAjustado, ajustes, fijarNivel, restablecerNiveles, firmas, firmar, borrarFirma, pila, direccion, abrirReferencia, seguirReferencia, volverA, cerrarHoja, ultimoPapel, marcarPapelVisible],
  )

  return <ContextoLegajo.Provider value={valor}>{children}</ContextoLegajo.Provider>
}

export function useLegajo(): ValorLegajo {
  const valor = useContext(ContextoLegajo)
  if (!valor) throw new Error('useLegajo debe usarse dentro de LegajoProvider')
  return valor
}
