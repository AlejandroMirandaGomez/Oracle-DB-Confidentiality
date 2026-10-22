import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/jetbrains-mono'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './estilos/global.css'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('No se encontró el elemento raíz')

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
