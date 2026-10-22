import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/jetbrains-mono'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './estilos/global.css'
import { router } from './rutas'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('No se encontró el elemento raíz')

createRoot(raiz).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
