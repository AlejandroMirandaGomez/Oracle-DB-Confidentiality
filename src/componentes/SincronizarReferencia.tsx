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
  const aperturaInicial = useRef(true)
  const primeraSincronizacion = useRef(true)
  const rutaPrevia = useRef(pathname)
  const fijarActual = useRef(fijarParametros)

  useEffect(() => {
    fijarActual.current = fijarParametros
  })

  useEffect(() => {
    if (!aperturaInicial.current) return
    aperturaInicial.current = false
    const referencia = parametros.get('ref')
    if (referencia && indice.buscar(referencia)) abrirReferencia(referencia)
    else if (referencia) fijarParametros((previos) => conReferencia(previos, undefined), { replace: true })
  }, [parametros, indice, abrirReferencia, fijarParametros])

  useEffect(() => {
    if (primeraSincronizacion.current) {
      primeraSincronizacion.current = false
      return
    }
    fijarActual.current((previos) => conReferencia(previos, pila.at(-1)), { replace: true })
  }, [pila])

  useEffect(() => {
    if (rutaPrevia.current === pathname) return
    rutaPrevia.current = pathname
    cerrarHoja()
  }, [pathname, cerrarHoja])

  return null
}
