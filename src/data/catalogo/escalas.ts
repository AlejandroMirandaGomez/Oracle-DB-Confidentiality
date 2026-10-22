import type { BandaRiesgo, Estado, NivelEvaluado, Nivel } from '../tipos'

export const nivelesMadurez: { nivel: Nivel; nombre: string; origenCobit: string }[] = [
  { nivel: 0, nombre: 'Inexistente', origenCobit: 'COBIT 0' },
  { nivel: 1, nombre: 'Inicial', origenCobit: 'COBIT 1 y 2' },
  { nivel: 2, nombre: 'Definido', origenCobit: 'COBIT 3' },
  { nivel: 3, nombre: 'Implementado y verificado', origenCobit: 'COBIT 4' },
  { nivel: 4, nombre: 'Gestionado', origenCobit: 'COBIT 5' },
]

export function estadoDeNivel(nivel: NivelEvaluado): Estado {
  if (nivel === null) return 'Sin evaluar'
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

export function bandaDeRiesgo(puntaje: number): BandaRiesgo {
  if (puntaje >= 15) return 'Crítico'
  if (puntaje >= 10) return 'Alto'
  if (puntaje >= 5) return 'Medio'
  return 'Bajo'
}

export const factorReduccionMaximo = 0.8
