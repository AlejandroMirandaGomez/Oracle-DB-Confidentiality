import { bandaDeRiesgo } from '../data/catalogo/escalas'
import { plantillasHallazgo, remediacionesDePrueba } from '../data/catalogo/hallazgos'
import { matriz } from '../data/catalogo/matriz'
import { pruebas } from '../data/catalogo/pruebas'
import { riesgos } from '../data/catalogo/riesgos'
import type {
  BandaRiesgo,
  FilaMatriz,
  Hallazgo,
  Niveles,
  PlantillaHallazgo,
  Prioridad,
  RespuestasEvidencia,
  RespuestasPruebas,
} from '../data/tipos'

const ordenDePrioridad: Record<Prioridad, number> = { Alta: 0, Media: 1, Baja: 2 }

function puntajeInherente(riesgoId: string): number {
  const riesgo = riesgos.find((item) => item.id === riesgoId)
  return riesgo ? riesgo.impacto * riesgo.probabilidad : 0
}

function bandaDeFila(fila: FilaMatriz): BandaRiesgo {
  return bandaDeRiesgo(puntajeInherente(fila.riesgo))
}

function evidenciasPendientes(fila: FilaMatriz, respuestas: RespuestasEvidencia): string[] {
  return fila.evidenciasRequeridas.flatMap((evidencia) => {
    const registro = respuestas[fila.id]?.[evidencia.id]
    if (!registro || registro.respuesta === null || registro.respuesta === 'Sí') return []
    const nota = registro.nota.trim()
    return [`${evidencia.titulo} (${registro.respuesta})${nota ? `: ${nota}` : ''}`]
  })
}

function pruebasFallidas(fila: FilaMatriz, respuestas: RespuestasPruebas) {
  return fila.pruebas.flatMap((pruebaId) => {
    const registro = respuestas[pruebaId]
    if (!registro || registro.respuesta === null || registro.respuesta === 'Conforme') return []
    return [{ id: pruebaId, respuesta: registro.respuesta, nota: registro.nota.trim() }]
  })
}

function describirPruebas(fallidas: ReturnType<typeof pruebasFallidas>): string {
  return fallidas.map((prueba) => `${prueba.id} (${prueba.respuesta})${prueba.nota ? `: ${prueba.nota}` : ''}`).join('; ')
}

function remediacionDePruebas(fallidas: ReturnType<typeof pruebasFallidas>): string[] {
  return fallidas.flatMap((prueba) => {
    const remediacion = remediacionesDePrueba[prueba.id]
    return remediacion ? [remediacion] : []
  })
}

function unir(bloques: string[]): string {
  return [...new Set(bloques)].join('\n')
}

function prioridadDe(banda: BandaRiesgo, nivel: number, hayNoConforme: boolean): Prioridad {
  if ((banda === 'Crítico' && nivel <= 1) || (hayNoConforme && banda === 'Crítico')) return 'Alta'
  if (nivel === 2 || banda === 'Alto') return 'Media'
  return 'Baja'
}

function hallazgoDeFila(
  fila: FilaMatriz,
  plantilla: PlantillaHallazgo,
  nivel: number,
  evidencias: RespuestasEvidencia,
  fallidas: ReturnType<typeof pruebasFallidas>,
  bateriaCompleta: boolean,
): Hallazgo {
  const base = nivel <= 1 ? plantilla.condicionNoCumple : plantilla.condicionParcial
  const partes = [base]
  const pendientes = evidenciasPendientes(fila, evidencias)
  if (pendientes.length > 0) partes.push(`Evidencias sin cumplir: ${pendientes.join('; ')}.`)
  if (bateriaCompleta && fallidas.length > 0) partes.push(`Pruebas técnicas: ${describirPruebas(fallidas)}.`)
  return {
    id: `H-${fila.id.slice(2)}`,
    titulo: plantilla.titulo,
    prioridad: prioridadDe(
      bandaDeFila(fila),
      nivel,
      fallidas.some((prueba) => prueba.respuesta === 'No conforme'),
    ),
    condicion: partes.join(' '),
    criterio: plantilla.criterio,
    causa: plantilla.causa,
    efecto: plantilla.efecto,
    recomendacion: plantilla.recomendacion,
    remediacion: unir([plantilla.remediacion, ...(bateriaCompleta ? remediacionDePruebas(fallidas) : [])]),
    controles: [fila.control],
    pruebas: fila.pruebas,
    riesgos: [fila.riesgo],
    filas: [fila.id],
    contradiccion: false,
  }
}

function hallazgoDeContradiccion(
  fila: FilaMatriz,
  plantilla: PlantillaHallazgo,
  nivel: number,
  fallidas: ReturnType<typeof pruebasFallidas>,
): Hallazgo {
  return {
    id: `H-${fila.id.slice(2)}C`,
    titulo: `Una prueba contradice el nivel ${nivel} declarado en ${fila.control}`,
    prioridad: prioridadDe(
      bandaDeFila(fila),
      nivel,
      fallidas.some((prueba) => prueba.respuesta === 'No conforme'),
    ),
    condicion: `La matriz declara el nivel ${nivel} para ${fila.control}, pero la batería no lo confirma. Pruebas técnicas: ${describirPruebas(fallidas)}.`,
    criterio: plantilla.criterio,
    causa: 'El nivel declarado no se verificó con las pruebas técnicas, o la configuración cambió después de evaluar la fila.',
    efecto: plantilla.efecto,
    recomendacion: 'Corregir el control con la remediación indicada y repetir la prueba, o ajustar el nivel de la matriz al resultado observado.',
    remediacion: unir(remediacionDePruebas(fallidas)),
    controles: [fila.control],
    pruebas: fallidas.map((prueba) => prueba.id),
    riesgos: [fila.riesgo],
    filas: [fila.id],
    contradiccion: true,
  }
}

export function bateriaRespondida(respuestasPruebas: RespuestasPruebas): boolean {
  return pruebas.every((prueba) => (respuestasPruebas[prueba.id]?.respuesta ?? null) !== null)
}

export function generarHallazgos(
  niveles: Niveles,
  respuestasEvidencia: RespuestasEvidencia,
  respuestasPruebas: RespuestasPruebas,
): Hallazgo[] {
  const bateriaCompleta = bateriaRespondida(respuestasPruebas)
  const generados: Hallazgo[] = []

  matriz.forEach((fila) => {
    const nivel = niveles[fila.id]
    const plantilla = plantillasHallazgo.find((item) => item.control === fila.control)
    if (nivel === undefined || !plantilla) return
    const fallidas = bateriaCompleta ? pruebasFallidas(fila, respuestasPruebas) : []
    if (nivel <= 2) generados.push(hallazgoDeFila(fila, plantilla, nivel, respuestasEvidencia, fallidas, bateriaCompleta))
    else if (fallidas.length > 0) generados.push(hallazgoDeContradiccion(fila, plantilla, nivel, fallidas))
  })

  return generados.sort(
    (a, b) =>
      ordenDePrioridad[a.prioridad] - ordenDePrioridad[b.prioridad] ||
      puntajeInherente(b.riesgos[0] ?? '') - puntajeInherente(a.riesgos[0] ?? '') ||
      a.id.localeCompare(b.id),
  )
}
