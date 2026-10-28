import { estadoDeNivel } from '../data/catalogo/escalas'
import { matriz } from '../data/catalogo/matriz'
import type { Hallazgo, NivelEvaluado, RegistroEvidencia } from '../data/tipos'
import { fechaParaArchivo, nombreSeguro } from './archivoEvaluacion'

const caracteresDeFormula = /^[=+\-@\t\r]/

function celdaCsv(valor: string): string {
  const seguro = caracteresDeFormula.test(valor) ? `'${valor}` : valor
  return `"${seguro.replaceAll('"', '""')}"`
}

export function filasComoCsv(filas: string[][]): string {
  return filas.map((columnas) => columnas.map(celdaCsv).join(';')).join('\r\n')
}

export function descargarArchivo(nombre: string, contenido: string, tipo: string): void {
  const archivo = new Blob(['﻿' + contenido], { type: `${tipo};charset=utf-8` })
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(archivo)
  enlace.download = nombre
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}

export function matrizComoCsv(
  organizacion: string,
  nivelDe: (filaId: string) => NivelEvaluado,
  respuestaEvidencia: (filaId: string, evidenciaId: string) => RegistroEvidencia,
): string {
  const encabezado = [
    'Organización',
    'Fila',
    'Tarea',
    'Riesgo',
    'Control',
    'Madurez',
    'Nivel 0-4',
    'Estado',
    'Evidencias documentadas',
    'Respuestas de evidencias',
  ]
  const filas = matriz.map((fila) => {
    const nivel = nivelDe(fila.id)
    const registros = fila.evidenciasRequeridas.map((evidencia) => ({ evidencia, registro: respuestaEvidencia(fila.id, evidencia.id) }))
    const documentadas = registros.filter(({ registro }) => registro.respuesta !== null).length
    const detalle = registros
      .map(({ evidencia, registro }) => `${evidencia.id}: ${registro.respuesta ?? 'Sin documentar'}${registro.nota.trim() ? ` (${registro.nota.trim()})` : ''}`)
      .join(' | ')
    return [
      organizacion,
      fila.id,
      fila.tarea,
      fila.riesgo,
      fila.control,
      fila.criterio,
      nivel === null ? '' : String(nivel),
      estadoDeNivel(nivel),
      `${documentadas} de ${registros.length}`,
      detalle,
    ]
  })
  return filasComoCsv([encabezado, ...filas])
}

export function nombreArchivoMatriz(organizacion: string): string {
  return `matriz-evaluacion-${nombreSeguro(organizacion)}.csv`
}

export function planComoCsv(organizacion: string, hallazgos: Hallazgo[]): string {
  const encabezado = [
    'Organización',
    'ID',
    'Hallazgo',
    'Prioridad',
    'Control',
    'Riesgo',
    'Condición',
    'Criterio',
    'Causa',
    'Efecto',
    'Recomendación',
    'Remediación propuesta',
  ]
  const filas = hallazgos.map((hallazgo) => [
    organizacion,
    hallazgo.id,
    hallazgo.titulo,
    hallazgo.prioridad,
    hallazgo.controles.join(', '),
    hallazgo.riesgos.join(', '),
    hallazgo.condicion,
    hallazgo.criterio,
    hallazgo.causa,
    hallazgo.efecto,
    hallazgo.recomendacion,
    hallazgo.remediacion,
  ])
  return filasComoCsv([encabezado, ...filas])
}

export function planComoMarkdown(organizacion: string, hallazgos: Hallazgo[], fecha: Date): string {
  const nombre = organizacion.trim() === '' ? 'la organización' : organizacion.trim()
  const bloques = hallazgos.map((hallazgo) =>
    [
      `## ${hallazgo.id} ${hallazgo.titulo}`,
      '',
      `Prioridad: ${hallazgo.prioridad}. Control: ${hallazgo.controles.join(', ')}. Riesgo: ${hallazgo.riesgos.join(', ')}.`,
      '',
      `**Condición.** ${hallazgo.condicion}`,
      '',
      `**Criterio.** ${hallazgo.criterio}`,
      '',
      `**Causa.** ${hallazgo.causa}`,
      '',
      `**Efecto.** ${hallazgo.efecto}`,
      '',
      `**Recomendación.** ${hallazgo.recomendacion}`,
      '',
      '**Remediación propuesta.**',
      '',
      '```',
      hallazgo.remediacion,
      '```',
    ].join('\n'),
  )
  return [`# Plan de acción de ${nombre}`, '', `Fecha de generación: ${fechaParaArchivo(fecha)}.`, '', ...bloques.flatMap((bloque) => [bloque, ''])].join('\n')
}

export function nombreArchivoPlan(organizacion: string, extension: 'csv' | 'md', fecha: Date): string {
  return `plan-de-accion-${nombreSeguro(organizacion)}-${fechaParaArchivo(fecha)}.${extension}`
}
