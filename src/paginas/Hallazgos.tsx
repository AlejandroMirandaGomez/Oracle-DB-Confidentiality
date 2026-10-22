import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { Link } from 'react-router'
import { ArchivoEvaluacion } from '../componentes/ArchivoEvaluacion'
import { ComponenteTabular, type ColumnaTabular } from '../componentes/ComponenteTabular'
import { LamparaEstado } from '../componentes/Lampara'
import { LeyendaLamparas } from '../componentes/LeyendaLamparas'
import { Pagina } from '../componentes/Pagina'
import { ListaRefs } from '../componentes/Ref'
import type { Hallazgo } from '../data/tipos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { descargarArchivo, nombreArchivoPlan, planComoCsv, planComoMarkdown } from '../estado/exportaciones'
import estilos from './Hallazgos.module.css'

const columnas: ColumnaTabular<Hallazgo>[] = [
  { clave: 'id', encabezado: 'ID', celda: (hallazgo) => <span className={estilos.id}>{hallazgo.id}</span> },
  { clave: 'hallazgo', encabezado: 'Hallazgo', celda: (hallazgo) => <span className={estilos.titulo}>{hallazgo.titulo}</span> },
  { clave: 'control', encabezado: 'Control', celda: (hallazgo) => <ListaRefs ids={hallazgo.controles} /> },
  { clave: 'riesgo', encabezado: 'Riesgo', celda: (hallazgo) => <ListaRefs ids={hallazgo.riesgos} /> },
  { clave: 'prioridad', encabezado: 'Prioridad', celda: (hallazgo) => <LamparaEstado valor={hallazgo.prioridad} /> },
]

export function Hallazgos() {
  const { matrizCompleta, progresoMatriz, bateriaCompleta, hallazgos, organizacion, abrirReferencia, marcarPasoVisto } = useEvaluacion()

  useEffect(() => marcarPasoVisto('hallazgos'), [marcarPasoVisto])

  if (!matrizCompleta) {
    const faltan = progresoMatriz.total - progresoMatriz.hechas
    return (
      <Pagina
        titulo="Hallazgos y plan de acción"
        introduccion="Los hallazgos se generan a partir de la matriz de evaluación. Complete las 18 filas para desbloquearlos."
      >
        <section className={estilos.bloqueo} aria-labelledby="titulo-bloqueo">
          <h2 id="titulo-bloqueo" className={estilos.subtitulo}>
            Faltan {faltan} de {progresoMatriz.total} filas por evaluar
          </h2>
          <LamparaEstado valor="Sin evaluar" texto="Bloqueado" />
          <p className={estilos.explicacion}>
            Asigne un nivel de madurez a cada fila de la matriz. Cuando todas tengan nivel, aquí aparecerá el plan de acción con la remediación de cada control que no alcance el nivel 3.
          </p>
          <Link to="/matriz" className="pulsador" data-principal="">
            Ir a la matriz de evaluación
          </Link>
        </section>
      </Pagina>
    )
  }

  const nombre = organizacion.trim() === '' ? 'la organización' : organizacion.trim()

  function exportar(formato: 'csv' | 'md') {
    const ahora = new Date()
    const archivo = nombreArchivoPlan(organizacion, formato, ahora)
    if (formato === 'csv') descargarArchivo(archivo, planComoCsv(organizacion, hallazgos), 'text/csv')
    else descargarArchivo(archivo, planComoMarkdown(organizacion, hallazgos, ahora), 'text/markdown')
  }

  return (
    <Pagina
      titulo="Hallazgos y plan de acción"
      introduccion="Un hallazgo por cada fila con nivel 0, 1 o 2, con su condición, criterio, causa, efecto, recomendación y la remediación propuesta para Oracle."
    >
      <section className={estilos.cabecera} aria-labelledby="titulo-plan">
        <h2 id="titulo-plan" className={estilos.plan}>
          Plan de acción de {nombre}
        </h2>
        <div className={estilos.acciones}>
          <button type="button" className="pulsador" onClick={() => exportar('csv')} disabled={hallazgos.length === 0}>
            <DownloadSimpleIcon aria-hidden="true" />
            Exportar plan de acción (CSV)
          </button>
          <button type="button" className="pulsador" onClick={() => exportar('md')} disabled={hallazgos.length === 0}>
            <DownloadSimpleIcon aria-hidden="true" />
            Exportar plan de acción (Markdown)
          </button>
        </div>
        <ArchivoEvaluacion />
      </section>

      {!bateriaCompleta && (
        <p className={estilos.aviso}>
          Complete la batería de pruebas para obtener hallazgos más precisos.{' '}
          <Link to="/pruebas">Ir a la batería de pruebas</Link>
        </p>
      )}

      <LeyendaLamparas tipo="hallazgos" />

      <ComponenteTabular
        etiqueta="Hallazgos ordenados por prioridad y riesgo inherente"
        columnas={columnas}
        filas={hallazgos}
        idDe={(hallazgo) => hallazgo.id}
        nombreDe={(hallazgo) => hallazgo.titulo}
        alSeleccionar={abrirReferencia}
        vacio="Ninguna fila quedó en nivel 0, 1 o 2, así que no hay hallazgos que atender. Mantenga la verificación periódica de los controles."
      />
    </Pagina>
  )
}
