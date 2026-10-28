import { createHashRouter } from 'react-router'
import App from './App'
import { Cargando } from './paginas/Cargando'
import { Controles } from './paginas/Controles'
import { Ejemplos } from './paginas/Ejemplos'
import { Hallazgos } from './paginas/Hallazgos'
import { Historial } from './paginas/Historial'
import { Inicio } from './paginas/Inicio'
import { MarcoTeorico } from './paginas/MarcoTeorico'
import { Matriz } from './paginas/Matriz'
import { NoEncontrada } from './paginas/NoEncontrada'
import { Pruebas } from './paginas/Pruebas'
import { Riesgos } from './paginas/Riesgos'
import { Tareas } from './paginas/Tareas'
import { UsoIA } from './paginas/UsoIA'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    HydrateFallback: Cargando,
    children: [
      { index: true, element: <Inicio /> },
      { path: 'riesgos', element: <Riesgos /> },
      { path: 'tareas', element: <Tareas /> },
      { path: 'controles', element: <Controles /> },
      { path: 'controles/:id', element: <Controles /> },
      { path: 'matriz', element: <Matriz /> },
      { path: 'pruebas', element: <Pruebas /> },
      { path: 'hallazgos', element: <Hallazgos /> },
      { path: 'historial', element: <Historial /> },
      { path: 'historial/:id', element: <Historial /> },
      { path: 'marco-teorico', element: <MarcoTeorico /> },
      { path: 'uso-ia', element: <UsoIA /> },
      { path: 'ejemplos', element: <Ejemplos /> },
      {
        path: 'ejemplos/xepdb1',
        lazy: async () => ({ Component: (await import('./paginas/EjemploXepdb1')).EjemploXepdb1 }),
      },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
])
