import { controles } from '../data/controles'
import { hallazgos } from '../data/hallazgos'
import { matrizInicial } from '../data/matriz'
import { observables } from '../data/observables'
import { pruebas } from '../data/pruebas'
import { riesgos } from '../data/riesgos'
import { tareas } from '../data/tareas'
import type { Control, FilaMatriz, Hallazgo, Observable, Prueba, Riesgo, Tarea } from '../data/tipos'

export type Entidad =
  | { tipo: 'riesgo'; dato: Riesgo }
  | { tipo: 'tarea'; dato: Tarea }
  | { tipo: 'control'; dato: Control }
  | { tipo: 'observable'; dato: Observable }
  | { tipo: 'prueba'; dato: Prueba }
  | { tipo: 'fila'; dato: FilaMatriz }
  | { tipo: 'hallazgo'; dato: Hallazgo }

export type TipoEntidad = Entidad['tipo']

export const nombreTipo: Record<TipoEntidad, string> = {
  riesgo: 'Riesgo de confidencialidad',
  tarea: 'Tarea del DBA',
  control: 'Control ISO/IEC 27001:2022',
  observable: 'Control observable',
  prueba: 'Prueba técnica',
  fila: 'Fila de la matriz',
  hallazgo: 'Hallazgo',
}

export const papelDeTipo: Record<TipoEntidad, string> = {
  riesgo: 'A',
  tarea: 'B',
  control: 'C',
  observable: 'D',
  fila: 'E',
  prueba: 'F',
  hallazgo: 'G',
}

const entidades = new Map<string, Entidad>()
riesgos.forEach((dato) => entidades.set(dato.id, { tipo: 'riesgo', dato }))
tareas.forEach((dato) => entidades.set(dato.id, { tipo: 'tarea', dato }))
controles.forEach((dato) => entidades.set(dato.id, { tipo: 'control', dato }))
observables.forEach((dato) => entidades.set(dato.id, { tipo: 'observable', dato }))
pruebas.forEach((dato) => entidades.set(dato.id, { tipo: 'prueba', dato }))
matrizInicial.forEach((dato) => entidades.set(dato.id, { tipo: 'fila', dato }))
hallazgos.forEach((dato) => entidades.set(dato.id, { tipo: 'hallazgo', dato }))

export function buscarEntidad(id: string): Entidad | undefined {
  return entidades.get(id)
}

export function tituloDeEntidad(entidad: Entidad): string {
  switch (entidad.tipo) {
    case 'riesgo':
    case 'tarea':
    case 'control':
    case 'prueba':
      return entidad.dato.nombre
    case 'hallazgo':
      return entidad.dato.titulo
    case 'observable':
      return entidad.dato.enunciado
    case 'fila':
      return entidad.dato.criterio
  }
}

export function nombreCorto(id: string): string {
  const entidad = buscarEntidad(id)
  return entidad ? tituloDeEntidad(entidad) : id
}

export function buscarControl(id: string): Control | undefined {
  return controles.find((control) => control.id === id)
}

export function buscarPrueba(id: string): Prueba | undefined {
  return pruebas.find((prueba) => prueba.id === id)
}

export function filasDeRiesgo(id: string): FilaMatriz[] {
  return matrizInicial.filter((fila) => fila.riesgo === id)
}

export function filasDeControl(id: string): FilaMatriz[] {
  return matrizInicial.filter((fila) => fila.control === id)
}

export function filasDeTarea(id: string): FilaMatriz[] {
  return matrizInicial.filter((fila) => fila.tarea === id)
}

export function pruebasDeRiesgo(id: string): string[] {
  const ids = new Set<string>()
  filasDeRiesgo(id).forEach((fila) => fila.pruebas.forEach((prueba) => ids.add(prueba)))
  return [...ids].sort()
}

export function hallazgosDe(id: string): Hallazgo[] {
  return hallazgos.filter(
    (hallazgo) => hallazgo.controles.includes(id) || hallazgo.pruebas.includes(id) || hallazgo.riesgos.includes(id),
  )
}

export function observableDeControl(id: string): Observable | undefined {
  return observables.find((observable) => observable.control === id)
}

export function observablesDePrueba(id: string): Observable[] {
  return observables.filter((observable) => observable.pruebas.includes(id))
}
