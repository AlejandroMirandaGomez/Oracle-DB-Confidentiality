import { estadoDeNivel } from '../catalogo/escalas'
import { entidad } from './xepdb1/entidad'
import { matriz } from './xepdb1/matriz'
import { pruebas } from './xepdb1/pruebas'

export type EjemploDisponible = {
  id: string
  ruta: string
  entidad: string
  motor: string
  fechaEvaluacion: string
  resultado: string
}

function resumenXepdb1(): string {
  const noCumplen = matriz.filter((fila) => estadoDeNivel(fila.nivel) === 'No cumple').length
  const parciales = matriz.filter((fila) => estadoDeNivel(fila.nivel) === 'Parcial').length
  const cumplen = matriz.length - noCumplen - parciales
  const noConformes = pruebas.filter((prueba) => prueba.veredicto === 'No conforme').length
  return `Cumple ${cumplen}, Parcial ${parciales}, No cumple ${noCumplen}. Pruebas no conformes: ${noConformes} de ${pruebas.length}.`
}

export const ejemplos: EjemploDisponible[] = [
  {
    id: entidad.id,
    ruta: `/ejemplos/${entidad.id}`,
    entidad: `PDB ${entidad.pdb}`,
    motor: `${entidad.motor} ${entidad.version}`,
    fechaEvaluacion: `${entidad.fechaEjecucion} ${entidad.horaEjecucion}`,
    resultado: resumenXepdb1(),
  },
]
