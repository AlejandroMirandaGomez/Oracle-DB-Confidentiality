import { controles } from '../data/catalogo/controles'
import { matriz } from '../data/catalogo/matriz'
import { pruebas } from '../data/catalogo/pruebas'
import { riesgos } from '../data/catalogo/riesgos'
import { tareas } from '../data/catalogo/tareas'
import { hallazgos as hallazgosEjemplo } from '../data/ejemplos/xepdb1/hallazgos'
import { matriz as matrizEjemplo } from '../data/ejemplos/xepdb1/matriz'
import { observables as observablesEjemplo } from '../data/ejemplos/xepdb1/observables'
import { pruebas as pruebasEjemplo } from '../data/ejemplos/xepdb1/pruebas'
import { riesgos as riesgosEjemplo } from '../data/ejemplos/xepdb1/riesgos'
import type {
  Control,
  FilaMatriz,
  FilaMatrizEjemplo,
  Hallazgo,
  HallazgoEjemplo,
  ObservableEjemplo,
  Prueba,
  PruebaEjemplo,
  Riesgo,
  Tarea,
} from '../data/tipos'

export type Entidad =
  | { tipo: 'riesgo'; dato: Riesgo }
  | { tipo: 'tarea'; dato: Tarea }
  | { tipo: 'control'; dato: Control }
  | { tipo: 'prueba'; dato: Prueba }
  | { tipo: 'fila'; dato: FilaMatriz }
  | { tipo: 'hallazgo'; dato: Hallazgo }
  | { tipo: 'pruebaEjemplo'; dato: PruebaEjemplo }
  | { tipo: 'filaEjemplo'; dato: FilaMatrizEjemplo }
  | { tipo: 'hallazgoEjemplo'; dato: HallazgoEjemplo }

export type TipoEntidad = Entidad['tipo']

export type ModoIndice = 'catalogo' | 'ejemplo'

export type FilaBasica = {
  id: string
  tarea: string
  riesgo: string
  control: string
  criterio: string
  pruebas: string[]
}

export type HallazgoBasico = {
  id: string
  titulo: string
  controles: string[]
  pruebas: string[]
  riesgos: string[]
}

export const nombreTipo: Record<TipoEntidad, string> = {
  riesgo: 'Riesgo de confidencialidad',
  tarea: 'Tarea del DBA',
  control: 'Control ISO/IEC 27001:2022',
  prueba: 'Prueba técnica',
  fila: 'Fila de la matriz',
  hallazgo: 'Hallazgo',
  pruebaEjemplo: 'Prueba técnica',
  filaEjemplo: 'Fila de la matriz',
  hallazgoEjemplo: 'Hallazgo',
}

export type Indice = {
  modo: ModoIndice
  riesgos: Riesgo[]
  tareas: Tarea[]
  controles: Control[]
  buscar: (id: string) => Entidad | undefined
  tituloDe: (entidad: Entidad) => string
  nombreCorto: (id: string) => string
  buscarControl: (id: string) => Control | undefined
  filas: FilaBasica[]
  filasDeRiesgo: (id: string) => FilaBasica[]
  filasDeControl: (id: string) => FilaBasica[]
  filasDeTarea: (id: string) => FilaBasica[]
  pruebasDeRiesgo: (id: string) => string[]
  hallazgosDe: (id: string) => HallazgoBasico[]
  observableDeControl: (id: string) => ObservableEjemplo | undefined
}

export function tituloDeEntidad(entidad: Entidad): string {
  switch (entidad.tipo) {
    case 'riesgo':
    case 'tarea':
    case 'control':
    case 'prueba':
    case 'pruebaEjemplo':
      return entidad.dato.nombre
    case 'hallazgo':
    case 'hallazgoEjemplo':
      return entidad.dato.titulo
    case 'fila':
    case 'filaEjemplo':
      return entidad.dato.criterio
  }
}

type Fuente = {
  modo: ModoIndice
  entidades: Entidad[]
  filas: FilaBasica[]
  hallazgos: HallazgoBasico[]
  observables: ObservableEjemplo[]
}

function armarIndice(fuente: Fuente): Indice {
  const porId = new Map<string, Entidad>()
  fuente.entidades.forEach((entidad) => porId.set(entidad.dato.id, entidad))

  const buscar = (id: string) => porId.get(id)
  const filasDeRiesgo = (id: string) => fuente.filas.filter((fila) => fila.riesgo === id)

  return {
    modo: fuente.modo,
    riesgos: fuente.entidades.flatMap((entidad) => (entidad.tipo === 'riesgo' ? [entidad.dato] : [])),
    tareas: fuente.entidades.flatMap((entidad) => (entidad.tipo === 'tarea' ? [entidad.dato] : [])),
    controles: fuente.entidades.flatMap((entidad) => (entidad.tipo === 'control' ? [entidad.dato] : [])),
    buscar,
    tituloDe: tituloDeEntidad,
    nombreCorto: (id) => {
      const entidad = buscar(id)
      return entidad ? tituloDeEntidad(entidad) : id
    },
    buscarControl: (id) => {
      const entidad = buscar(id)
      return entidad?.tipo === 'control' ? entidad.dato : undefined
    },
    filas: fuente.filas,
    filasDeRiesgo,
    filasDeControl: (id) => fuente.filas.filter((fila) => fila.control === id),
    filasDeTarea: (id) => fuente.filas.filter((fila) => fila.tarea === id),
    pruebasDeRiesgo: (id) => {
      const ids = new Set<string>()
      filasDeRiesgo(id).forEach((fila) => fila.pruebas.forEach((prueba) => ids.add(prueba)))
      return [...ids].sort()
    },
    hallazgosDe: (id) =>
      fuente.hallazgos.filter((hallazgo) => hallazgo.controles.includes(id) || hallazgo.pruebas.includes(id) || hallazgo.riesgos.includes(id)),
    observableDeControl: (id) => fuente.observables.find((observable) => observable.control === id),
  }
}

export function crearIndiceCatalogo(hallazgos: Hallazgo[]): Indice {
  return armarIndice({
    modo: 'catalogo',
    entidades: [
      ...riesgos.map((dato): Entidad => ({ tipo: 'riesgo', dato })),
      ...tareas.map((dato): Entidad => ({ tipo: 'tarea', dato })),
      ...controles.map((dato): Entidad => ({ tipo: 'control', dato })),
      ...pruebas.map((dato): Entidad => ({ tipo: 'prueba', dato })),
      ...matriz.map((dato): Entidad => ({ tipo: 'fila', dato })),
      ...hallazgos.map((dato): Entidad => ({ tipo: 'hallazgo', dato })),
    ],
    filas: matriz,
    hallazgos,
    observables: [],
  })
}

export const indiceCatalogoBase = crearIndiceCatalogo([])

export const indiceEjemplo = armarIndice({
  modo: 'ejemplo',
  entidades: [
    ...riesgosEjemplo.map((dato): Entidad => ({ tipo: 'riesgo', dato })),
    ...tareas.map((dato): Entidad => ({ tipo: 'tarea', dato })),
    ...controles.map((dato): Entidad => ({ tipo: 'control', dato })),
    ...pruebasEjemplo.map((dato): Entidad => ({ tipo: 'pruebaEjemplo', dato })),
    ...matrizEjemplo.map((dato): Entidad => ({ tipo: 'filaEjemplo', dato })),
    ...hallazgosEjemplo.map((dato): Entidad => ({ tipo: 'hallazgoEjemplo', dato })),
  ],
  filas: matrizEjemplo,
  hallazgos: hallazgosEjemplo,
  observables: observablesEjemplo,
})
