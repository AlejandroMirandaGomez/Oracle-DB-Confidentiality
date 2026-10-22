import { useNavigate } from 'react-router'
import { ComponenteTabular, type ColumnaTabular } from '../componentes/ComponenteTabular'
import { Pagina } from '../componentes/Pagina'
import { ejemplos, type EjemploDisponible } from '../data/ejemplos/indice'
import estilos from './Ejemplos.module.css'

const columnas: ColumnaTabular<EjemploDisponible>[] = [
  { clave: 'entidad', encabezado: 'Entidad', celda: (ejemplo) => <span className={estilos.entidad}>{ejemplo.entidad}</span> },
  { clave: 'motor', encabezado: 'Motor', celda: (ejemplo) => ejemplo.motor },
  { clave: 'fecha', encabezado: 'Fecha de evaluación', celda: (ejemplo) => <span className={estilos.fecha}>{ejemplo.fechaEvaluacion}</span> },
  { clave: 'resultado', encabezado: 'Resultado resumido', celda: (ejemplo) => ejemplo.resultado },
]

export function Ejemplos() {
  const navegar = useNavigate()
  return (
    <Pagina
      titulo="Ejemplos de evaluación"
      introduccion="Evaluaciones de solo lectura sobre instancias reales, presentadas a nombre de empresas ficticias, que muestran cómo se ve el recorrido completo, con sus pruebas ejecutadas y sus hallazgos. Abra una para recorrerla."
    >
      <ComponenteTabular
        etiqueta="Ejemplos de evaluación disponibles"
        columnas={columnas}
        filas={ejemplos}
        idDe={(ejemplo) => ejemplo.id}
        nombreDe={(ejemplo) => ejemplo.entidad}
        alSeleccionar={(id) => {
          const ejemplo = ejemplos.find((item) => item.id === id)
          if (ejemplo) navegar(ejemplo.ruta)
        }}
        vacio="Todavía no hay ejemplos publicados."
      />
    </Pagina>
  )
}
