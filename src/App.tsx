import { useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router'
import estilos from './App.module.css'
import { HojaReferencia } from './componentes/HojaReferencia'
import { Navbar } from './componentes/Navbar'
import { SincronizarReferencia } from './componentes/SincronizarReferencia'
import { useEvaluacion } from './estado/contextoEvaluacion'
import { EvaluacionProvider } from './estado/EvaluacionProvider'
import { ContextoIndice } from './estado/fuente'
import { crearIndiceCatalogo, indiceEjemplo } from './estado/indice'

function Cascaron() {
  const { hallazgos } = useEvaluacion()
  const { pathname } = useLocation()
  const indiceCatalogo = useMemo(() => crearIndiceCatalogo(hallazgos), [hallazgos])
  const indice = pathname.startsWith('/ejemplos/xepdb1') ? indiceEjemplo : indiceCatalogo
  const clavePagina = pathname.startsWith('/controles') ? '/controles' : pathname

  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.getElementById('contenido')?.focus({ preventScroll: true })
  }, [clavePagina])

  return (
    <ContextoIndice.Provider value={indice}>
      <button type="button" className={estilos.salto} onClick={() => document.getElementById('contenido')?.focus()}>
        Saltar al contenido
      </button>
      <Navbar />
      <main id="contenido" tabIndex={-1} className={estilos.principal}>
        <Outlet />
      </main>
      <HojaReferencia />
      <SincronizarReferencia />
    </ContextoIndice.Provider>
  )
}

export default function App() {
  return (
    <EvaluacionProvider>
      <Cascaron />
    </EvaluacionProvider>
  )
}
