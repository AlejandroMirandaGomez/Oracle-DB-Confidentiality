import type { Estado, Nivel } from './tipos'

export const legajo = {
  titulo: 'Controles ISO/IEC 27001:2022 para la confidencialidad en la administración de bases de datos',
  universidad: 'Universidad Nacional de Costa Rica',
  escuela: 'Escuela de Informática',
  curso: 'Administración de Bases de Datos',
  profesor: 'Prof. Johnny Villalobos Murillo',
  periodo: 'II Ciclo 2026',
  autor: 'Alejandro Obed Miranda Gómez',
  iniciales: 'AOMG',
  entidad: 'Instancia Oracle Database 21c Express Edition (CDB XE, PDB XEPDB1)',
  version: '21.3.0.0.0',
  fechaEjecucion: '2026-10-21',
  horaEjecucion: '18:29',
  metodologia: 'PHVA (Planificar, Hacer, Verificar, Actuar)',
  herramientas: ['SQL Developer', 'SQL*Plus', 'RMAN', 'lsnrctl'],
} as const

export const nivelesMadurez: { nivel: Nivel; nombre: string; descripcion: string }[] = [
  { nivel: 0, nombre: 'Inexistente', descripcion: 'No hay configuración, procedimiento ni evidencia del control.' },
  { nivel: 1, nombre: 'Inicial', descripcion: 'Existe por omisión del motor o de forma parcial, sin una decisión explícita ni verificación.' },
  { nivel: 2, nombre: 'Definido', descripcion: 'Configurado según un criterio explícito y demostrado, pero incompleto en alcance o sin verificación periódica.' },
  { nivel: 3, nombre: 'Implementado y verificado', descripcion: 'Aplicado en todo el alcance y demostrado con una prueba ejecutada en la instancia.' },
  { nivel: 4, nombre: 'Gestionado', descripcion: 'Verificado periódicamente, monitoreado con alertas y mejorado a partir de los resultados.' },
]

export function estadoDeNivel(nivel: Nivel): Estado {
  if (nivel >= 3) return 'Cumple'
  if (nivel === 2) return 'Parcial'
  return 'No cumple'
}

export const escalaImpacto = [
  { valor: 1, nombre: 'Insignificante', descripcion: 'Información pública o sin datos personales.' },
  { valor: 2, nombre: 'Menor', descripcion: 'Información interna sin datos personales identificables.' },
  { valor: 3, nombre: 'Moderado', descripcion: 'Datos personales de pocos titulares, sin datos financieros.' },
  { valor: 4, nombre: 'Mayor', descripcion: 'Datos personales masivos o financieros; deber de responder ante la PRODHAB.' },
  { valor: 5, nombre: 'Severo', descripcion: 'Credenciales administrativas o datos de acceso restringido en masa; compromiso total de la base.' },
] as const

export const escalaProbabilidad = [
  { valor: 1, nombre: 'Rara', descripcion: 'Requiere condiciones excepcionales.' },
  { valor: 2, nombre: 'Improbable', descripcion: 'Requiere acceso privilegiado o físico difícil de obtener.' },
  { valor: 3, nombre: 'Posible', descripcion: 'Requiere acceso al equipo o a la red local, con una debilidad conocida presente.' },
  { valor: 4, nombre: 'Probable', descripcion: 'La debilidad está presente y se explota con herramientas comunes.' },
  { valor: 5, nombre: 'Casi segura', descripcion: 'La debilidad está expuesta y ya se observa actividad que la aprovecha.' },
] as const

export type BandaRiesgo = 'Bajo' | 'Medio' | 'Alto' | 'Crítico'

export function bandaDeRiesgo(puntaje: number): BandaRiesgo {
  if (puntaje >= 15) return 'Crítico'
  if (puntaje >= 10) return 'Alto'
  if (puntaje >= 5) return 'Medio'
  return 'Bajo'
}

export const factorReduccionMaximo = 0.8
