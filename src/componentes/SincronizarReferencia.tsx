import { useEffect, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { useIndice } from '../estado/fuente'

function conReferencia(previos: URLSearchParams, referencia: string | undefined): URLSearchParams {
  const siguientes = new URLSearchParams(previos)
  if (referencia) siguientes.set('ref', referencia)
  else siguientes.delete('ref')
  return siguientes
}

export function SincronizarReferencia() {
  const [parametros, fijarParametros] = useSearchParams()
  const { pila, abrirReferencia, cerrarHoja } = useEvaluacion()
  const indice = useIndice()
  const { pathname } = useLocation()
  const rutaPrevia = useRef(pathname)
  const ultimo = useRef<{ referencia: string | null; tope: string | null }>({ referencia: null, tope: null })
  const tope = pila.at(-1) ?? null
  const referencia = parametros.get('ref')

  useEffect(() => {
    const previo = ultimo.current
    ultimo.current = { referencia, tope }
    if (referencia !== previo.referencia) {
      if (referencia === tope) return
      if (referencia && indice.buscar(referencia)) abrirReferencia(referencia)
      else if (referencia) fijarParametros((previos) => conReferencia(previos, undefined), { replace: true })
      else cerrarHoja()
      return
    }
    if (tope !== previo.tope && tope !== referencia) {
      fijarParametros((previos) => conReferencia(previos, tope ?? undefined), { replace: true })
    }
  }, [referencia, tope, indice, abrirReferencia, cerrarHoja, fijarParametros])

  useEffect(() => {
    if (rutaPrevia.current === pathname) return
    rutaPrevia.current = pathname
    if (referencia === null) cerrarHoja()
  }, [pathname, referencia, cerrarHoja])

  return null
}
