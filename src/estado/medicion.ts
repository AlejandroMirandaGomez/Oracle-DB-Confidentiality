import type { CampoMedicion, EvidenciaRequerida, FilaMatriz, Medicion, Nivel, OpcionMedicion, ReglaMedicion, RegistroEvidencia, ValorMedicion } from '../data/tipos'
import { errorMedicion } from './validacionMedicion'

export type EstadoMedicion = 'sin-medir' | 'medida' | 'excluida'

export type ResultadoMedicion = {
  estado: EstadoMedicion
  puntaje: number
  resumen: string
  desarrollo: string[]
  aviso?: string | undefined
}

export type LineaCalculo = {
  medicion: Medicion
  resultado: ResultadoMedicion
  pesoEfectivo: number
  aporte: number
}

export type CalculoControl = {
  lineas: LineaCalculo[]
  ponderado: number
  puntuacion: number
  respondidas: number
  excluidas: number
  limitante: LineaCalculo | null
}

export type EjemploEscala = {
  entrada: string
  puntaje: number
}

export const idNingunaCondicion = 'ninguna'

export const registroVacioEvidencia: RegistroEvidencia = { valores: {}, nota: '' }

const decimales = new Intl.NumberFormat('es-CR', { maximumFractionDigits: 3 })
const conDosDecimales = new Intl.NumberFormat('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })

export function formatoPuntuacion(valor: number): string {
  return conDosDecimales.format(valor)
}

export function formatoNumero(valor: number): string {
  return decimales.format(valor)
}

function redondear(valor: number): number {
  return Math.round(valor * 10000) / 10000
}

function acotar(valor: number): number {
  return Math.min(1, Math.max(0, redondear(valor)))
}

function numeroDe(campos: CampoMedicion[], id: string, valores: Record<string, ValorMedicion>): number | null {
  const valor = valores[id]
  if (typeof valor === 'number' && Number.isFinite(valor)) return valor
  return campos.find((campo) => campo.id === id)?.sugerido ?? null
}

export function puntajeProporcion(casos: number, total: number, maximoTolerado: number, topeConCasos: number): number {
  if (casos <= 0) return 1
  const porcentaje = Math.min(100, (casos / total) * 100)
  return acotar(Math.min(1 - porcentaje / maximoTolerado, topeConCasos))
}

export function puntajePorCaso(casos: number, restaPorCaso: number): number {
  return acotar(1 - casos * restaPorCaso)
}

export function puntajeVigencia(dias: number, objetivo: number, vecesLimite: number): number {
  if (dias <= objetivo) return 1
  const limite = objetivo * vecesLimite
  if (dias >= limite) return 0
  return acotar(1 - (dias - objetivo) / (limite - objetivo))
}

export const valoresDeAlcance = ['todos', 'mayoria', 'mitad', 'minoria', 'ninguno']

export function opcionesDeAlcance(regla: Extract<ReglaMedicion, { tipo: 'alcance' }>, base: number): OpcionMedicion[] {
  const piso = Math.floor(base / 2)
  const techo = Math.ceil(base / 2)
  const opciones: OpcionMedicion[] = [{ valor: 'todos', texto: `${regla.todos} (${formatoNumero(base)})`, puntos: 1 }]
  if (piso + 1 < base) opciones.push({ valor: 'mayoria', texto: `La mayoría (más de ${formatoNumero(piso)})`, puntos: 0.7 })
  if (base % 2 === 0) opciones.push({ valor: 'mitad', texto: `La mitad (${formatoNumero(base / 2)})`, puntos: 0.5 })
  if (techo > 1) opciones.push({ valor: 'minoria', texto: `Menos de la mitad (menos de ${formatoNumero(techo)})`, puntos: 0.3 })
  opciones.push({ valor: 'ninguno', texto: `${regla.ninguno} (0)`, puntos: 0 })
  return opciones
}

const sinMedir: ResultadoMedicion = { estado: 'sin-medir', puntaje: 0, resumen: 'Sin medir', desarrollo: [] }

function evaluarProporcion(medicion: Medicion, regla: Extract<ReglaMedicion, { tipo: 'proporcion' }>, valores: Record<string, ValorMedicion>): ResultadoMedicion {
  const brutos = numeroDe(medicion.campos, regla.casos, valores)
  const descontados = regla.descontar ? numeroDe(medicion.campos, regla.descontar, valores) : 0
  const total = numeroDe(medicion.campos, regla.total, valores)
  if (brutos === null || descontados === null || total === null) return sinMedir
  const casos = Math.max(0, brutos - descontados)
  const avisoDescuento = descontados > brutos ? 'Lo que descuenta supera al número de casos. Revise los datos.' : undefined
  if (total === 0) {
    if (regla.siTotalCero === 'excluir') {
      return { estado: 'excluida', puntaje: 0, resumen: 'No aplica', desarrollo: ['El total es 0, así que no hay nada que medir y esta medición sale del cálculo.'] }
    }
    return {
      estado: 'medida',
      puntaje: regla.siTotalCero,
      resumen: `Total en 0: ${regla.sujeto} sin base de medición`,
      desarrollo: [`El total es 0, lo que aquí significa que el control no existe todavía. Vale ${formatoPuntuacion(regla.siTotalCero)}.`],
    }
  }
  const porcentaje = Math.min(100, (casos / total) * 100)
  const lineal = acotar(1 - porcentaje / regla.maximoTolerado)
  const puntaje = puntajeProporcion(casos, total, regla.maximoTolerado, regla.topeConCasos)
  const desarrollo: string[] = []
  if (regla.descontar) desarrollo.push(`Casos: ${formatoNumero(brutos)} − ${formatoNumero(descontados)} = ${formatoNumero(casos)}`)
  desarrollo.push(`Porcentaje: ${formatoNumero(casos)} de ${formatoNumero(total)} = ${formatoNumero(porcentaje)} %`)
  if (casos === 0) desarrollo.push('Sin casos, la medición vale 1,00')
  else if (lineal === 0) desarrollo.push(`Llega al máximo tolerado de ${formatoNumero(regla.maximoTolerado)} % o lo supera, así que vale 0,00`)
  else desarrollo.push(`Puntaje: 1 − (${formatoNumero(porcentaje)} % ÷ ${formatoNumero(regla.maximoTolerado)} %) = ${formatoPuntuacion(lineal)}`)
  if (casos > 0 && lineal > regla.topeConCasos) desarrollo.push(`Mientras quede un caso no pasa de ${formatoPuntuacion(regla.topeConCasos)}`)
  return {
    estado: 'medida',
    puntaje,
    resumen: `${formatoNumero(casos)} de ${formatoNumero(total)} ${regla.sujeto} (${formatoNumero(porcentaje)} %)`,
    desarrollo,
    aviso: casos > total ? 'Los casos superan al total. Revise los datos.' : avisoDescuento,
  }
}

function evaluarPorCaso(medicion: Medicion, regla: Extract<ReglaMedicion, { tipo: 'porCaso' }>, valores: Record<string, ValorMedicion>): ResultadoMedicion {
  const brutos = numeroDe(medicion.campos, regla.casos, valores)
  const descontados = regla.descontar ? numeroDe(medicion.campos, regla.descontar, valores) : 0
  if (brutos === null || descontados === null) return sinMedir
  const casos = Math.max(0, brutos - descontados)
  const puntaje = puntajePorCaso(casos, regla.restaPorCaso)
  const desarrollo: string[] = []
  if (regla.descontar) desarrollo.push(`Casos: ${formatoNumero(brutos)} − ${formatoNumero(descontados)} = ${formatoNumero(casos)}`)
  desarrollo.push(`Puntaje: 1 − (${formatoNumero(casos)} × ${formatoPuntuacion(regla.restaPorCaso)}) = ${formatoPuntuacion(puntaje)}`)
  return {
    estado: 'medida',
    puntaje,
    resumen: `${regla.sujeto}, casos: ${formatoNumero(casos)}`,
    desarrollo,
    aviso: descontados > brutos ? 'Lo que descuenta supera al número de casos. Revise los datos.' : undefined,
  }
}

function evaluarVigencia(medicion: Medicion, regla: Extract<ReglaMedicion, { tipo: 'vigencia' }>, valores: Record<string, ValorMedicion>): ResultadoMedicion {
  const dias = numeroDe(medicion.campos, regla.dias, valores)
  const objetivo = numeroDe(medicion.campos, regla.objetivo, valores)
  if (dias === null || objetivo === null) return sinMedir
  if (objetivo <= 0) return { ...sinMedir, aviso: 'El objetivo debe ser mayor que 0.' }
  const limite = objetivo * regla.vecesLimite
  const puntaje = puntajeVigencia(dias, objetivo, regla.vecesLimite)
  const desarrollo = [`Objetivo: ${formatoNumero(objetivo)} días. Límite: ${formatoNumero(objetivo)} × ${regla.vecesLimite} = ${formatoNumero(limite)} días`]
  if (dias <= objetivo) desarrollo.push(`${formatoNumero(dias)} días está dentro del objetivo, así que vale 1,00`)
  else if (dias >= limite) desarrollo.push(`${formatoNumero(dias)} días llega al límite o lo supera, así que vale 0,00`)
  else desarrollo.push(`Puntaje: 1 − ((${formatoNumero(dias)} − ${formatoNumero(objetivo)}) ÷ (${formatoNumero(limite)} − ${formatoNumero(objetivo)})) = ${formatoPuntuacion(puntaje)}`)
  return { estado: 'medida', puntaje, resumen: `${formatoNumero(dias)} días desde ${regla.evento}, objetivo ${formatoNumero(objetivo)}`, desarrollo }
}

function evaluarCobertura(medicion: Medicion, regla: Extract<ReglaMedicion, { tipo: 'cobertura' }>, valores: Record<string, ValorMedicion>): ResultadoMedicion {
  const valor = numeroDe(medicion.campos, regla.valor, valores)
  const objetivo = numeroDe(medicion.campos, regla.objetivo, valores)
  if (valor === null || objetivo === null) return sinMedir
  if (objetivo <= 0) return { ...sinMedir, aviso: 'El objetivo debe ser mayor que 0.' }
  const puntaje = acotar(valor / objetivo)
  return {
    estado: 'medida',
    puntaje,
    resumen: `${formatoNumero(valor)} de ${formatoNumero(objetivo)} ${regla.unidad}`,
    desarrollo: [`Puntaje: ${formatoNumero(valor)} ÷ ${formatoNumero(objetivo)} = ${formatoPuntuacion(puntaje)}${valor >= objetivo ? ', con máximo 1,00' : ''}`],
  }
}

function evaluarAlcance(medicion: Medicion, regla: Extract<ReglaMedicion, { tipo: 'alcance' }>, valores: Record<string, ValorMedicion>): ResultadoMedicion {
  const base = numeroDe(medicion.campos, regla.base, valores)
  if (base === null) return sinMedir
  if (base === 0) {
    if (regla.siBaseCero === 'excluir') {
      return { estado: 'excluida', puntaje: 0, resumen: 'No aplica', desarrollo: ['El total es 0, así que no hay nada que medir y esta medición sale del cálculo.'] }
    }
    return {
      estado: 'medida',
      puntaje: regla.siBaseCero,
      resumen: 'Total en 0',
      desarrollo: [`El total es 0, lo que aquí significa que el control no existe todavía. Vale ${formatoPuntuacion(regla.siBaseCero)}.`],
    }
  }
  const opcion = opcionesDeAlcance(regla, base).find((item) => item.valor === valores[regla.campo.id])
  if (!opcion) return sinMedir
  return { estado: 'medida', puntaje: opcion.puntos, resumen: opcion.texto, desarrollo: [`${opcion.texto}: vale ${formatoPuntuacion(opcion.puntos)}`] }
}

export function evaluarMedicion(medicion: Medicion, valores: Record<string, ValorMedicion>): ResultadoMedicion {
  const error = errorMedicion(medicion, valores)
  if (error) return { ...sinMedir, aviso: error }
  const { regla } = medicion
  if (regla.tipo === 'proporcion') return evaluarProporcion(medicion, regla, valores)
  if (regla.tipo === 'porCaso') return evaluarPorCaso(medicion, regla, valores)
  if (regla.tipo === 'vigencia') return evaluarVigencia(medicion, regla, valores)
  if (regla.tipo === 'cobertura') return evaluarCobertura(medicion, regla, valores)
  if (regla.tipo === 'alcance') return evaluarAlcance(medicion, regla, valores)
  if (regla.tipo === 'opciones') {
    const opcion = regla.opciones.find((item) => item.valor === valores[regla.campo.id])
    if (!opcion) return sinMedir
    return { estado: 'medida', puntaje: opcion.puntos, resumen: opcion.texto, desarrollo: [`${opcion.texto}: vale ${formatoPuntuacion(opcion.puntos)}`] }
  }
  const cumplidos = regla.items.filter((item) => valores[item.id] === true)
  if (cumplidos.length === 0 && valores[idNingunaCondicion] !== true) return sinMedir
  const puntaje = acotar(cumplidos.reduce((suma, item) => suma + item.puntos, 0))
  return {
    estado: 'medida',
    puntaje,
    resumen: `${cumplidos.length} de ${regla.items.length} condiciones`,
    desarrollo: [cumplidos.length === 0 ? 'Ninguna condición se cumple, así que vale 0,00' : `Suma: ${cumplidos.map((item) => formatoPuntuacion(item.puntos)).join(' + ')} = ${formatoPuntuacion(puntaje)}`],
  }
}

export function camposDeEvidencia(evidencia: EvidenciaRequerida): CampoMedicion[] {
  const campos = new Map<string, CampoMedicion>()
  evidencia.mediciones.forEach((medicion) => {
    medicion.campos.forEach((campo) => {
      if (!campo.oculto && !campos.has(campo.id)) campos.set(campo.id, campo)
    })
  })
  return [...campos.values()]
}

export function calcularEvidencia(evidencia: EvidenciaRequerida, registro: RegistroEvidencia): CalculoControl {
  const resultados = evidencia.mediciones.map((medicion) => ({ medicion, resultado: evaluarMedicion(medicion, registro.valores) }))
  const pesoVigente = resultados.reduce((suma, { medicion, resultado }) => suma + (resultado.estado === 'excluida' ? 0 : medicion.peso), 0)
  const lineas: LineaCalculo[] = resultados.map(({ medicion, resultado }) => {
    const pesoEfectivo = resultado.estado === 'excluida' || pesoVigente === 0 ? 0 : medicion.peso / pesoVigente
    return { medicion, resultado, pesoEfectivo, aporte: pesoEfectivo * resultado.puntaje }
  })
  const ponderado = acotar(lineas.reduce((suma, linea) => suma + linea.aporte, 0))
  const limitante = lineas
    .filter((linea) => linea.medicion.critica && linea.resultado.estado === 'medida' && linea.resultado.puntaje < ponderado)
    .reduce<LineaCalculo | null>((menor, linea) => (menor === null || linea.resultado.puntaje < menor.resultado.puntaje ? linea : menor), null)
  return {
    lineas,
    ponderado,
    puntuacion: limitante ? limitante.resultado.puntaje : ponderado,
    respondidas: resultados.filter(({ resultado }) => resultado.estado !== 'sin-medir').length,
    excluidas: resultados.filter(({ resultado }) => resultado.estado === 'excluida').length,
    limitante,
  }
}

export function calcularFila(fila: FilaMatriz, registroDe: (filaId: string, evidenciaId: string) => RegistroEvidencia): CalculoControl {
  return calcularEvidencia(fila.evidencia, registroDe(fila.id, fila.evidencia.id))
}

export function nombreDeRegla(regla: ReglaMedicion): string {
  const nombres: Record<ReglaMedicion['tipo'], string> = {
    proporcion: 'Proporción',
    porCaso: 'Por caso',
    vigencia: 'Vigencia',
    cobertura: 'Cobertura',
    opciones: 'Valor exacto',
    alcance: 'Alcance',
    lista: 'Lista de condiciones',
  }
  if (regla.tipo === 'opciones' && regla.campo.origen === 'organizacion') return 'Respuesta'
  return nombres[regla.tipo]
}

export function explicarRegla(regla: ReglaMedicion): string {
  if (regla.tipo === 'proporcion') {
    const tope = regla.topeConCasos < 1 ? ` Mientras quede un caso no pasa de ${formatoPuntuacion(regla.topeConCasos)}.` : ''
    return `Importa el tamaño de la base: se calcula qué porcentaje del total son ${regla.sujeto}. Puntaje = 1 − (porcentaje ÷ ${formatoNumero(regla.maximoTolerado)} %). Sin casos vale 1,00 y desde ${formatoNumero(regla.maximoTolerado)} % vale 0,00.${tope}`
  }
  if (regla.tipo === 'porCaso') return `No importa el tamaño de la base. Cada caso resta ${formatoPuntuacion(regla.restaPorCaso)}. ${regla.motivo}`
  if (regla.tipo === 'vigencia') return `Vale 1,00 mientras ${regla.evento} esté dentro de su objetivo. Después baja en línea recta y llega a 0,00 cuando pasan ${regla.vecesLimite} veces esos días.`
  if (regla.tipo === 'cobertura') return `Se compara lo conservado con lo exigido: puntaje = ${regla.unidad} conservados ÷ ${regla.unidad} exigidos, con máximo 1,00.`
  if (regla.tipo === 'alcance') return 'Las opciones se calculan con su total real. El total completo vale 1,00, la mayoría 0,70, la mitad 0,50, menos de la mitad 0,30 y cero 0,00.'
  if (regla.tipo === 'opciones') {
    return regla.campo.origen === 'sql' ? 'Cada resultado posible tiene su puntaje fijo. Elija el que obtuvo.' : 'Cada respuesta tiene su puntaje fijo. Elija la que describa a su organización.'
  }
  return 'Marque lo que se cumple. El puntaje es la suma de lo marcado.'
}

export function escalaDeRegla(medicion: Medicion): EjemploEscala[] {
  const { regla } = medicion
  if (regla.tipo === 'proporcion') {
    const { maximoTolerado, topeConCasos, unidad, ejemplos } = regla
    const conCasos = ejemplos.map(({ casos, total }) => ({
      entrada: `${formatoNumero(casos)} de ${formatoNumero(total)} ${unidad}`,
      puntaje: puntajeProporcion(casos, total, maximoTolerado, topeConCasos),
    }))
    return [{ entrada: 'Sin casos', puntaje: 1 }, ...conCasos.sort((a, b) => b.puntaje - a.puntaje)]
  }
  if (regla.tipo === 'porCaso') {
    const ejemplos: EjemploEscala[] = [{ entrada: 'Sin casos', puntaje: 1 }]
    for (let casos = 1; casos <= 5; casos += 1) {
      const puntaje = puntajePorCaso(casos, regla.restaPorCaso)
      ejemplos.push({ entrada: casos === 1 ? '1 caso' : `${casos} casos`, puntaje })
      if (puntaje === 0) break
    }
    return ejemplos
  }
  if (regla.tipo === 'vigencia') {
    const objetivo = medicion.campos.find((campo) => campo.id === regla.objetivo)?.sugerido ?? 30
    const limite = objetivo * regla.vecesLimite
    const medio = Math.round((objetivo + limite) / 2)
    return [
      { entrada: `Hasta ${formatoNumero(objetivo)} días`, puntaje: 1 },
      { entrada: `${formatoNumero(medio)} días`, puntaje: puntajeVigencia(medio, objetivo, regla.vecesLimite) },
      { entrada: `${formatoNumero(limite)} días o más`, puntaje: 0 },
    ]
  }
  if (regla.tipo === 'cobertura') {
    return [
      { entrada: 'Todo lo exigido', puntaje: 1 },
      { entrada: 'La mitad de lo exigido', puntaje: 0.5 },
      { entrada: 'Nada', puntaje: 0 },
    ]
  }
  if (regla.tipo === 'alcance') return opcionesDeAlcance(regla, regla.ejemploBase).map((opcion) => ({ entrada: opcion.texto, puntaje: opcion.puntos }))
  if (regla.tipo === 'opciones') return regla.opciones.map((opcion) => ({ entrada: opcion.valor === opcion.valor.toUpperCase() ? opcion.valor : opcion.texto, puntaje: opcion.puntos }))
  return regla.items.map((item) => ({ entrada: item.texto, puntaje: item.puntos }))
}

export function nivelDesdePuntuacion(calculo: CalculoControl): Nivel | null {
  if (calculo.respondidas === 0) return null
  if (calculo.puntuacion >= 0.75) return 3
  if (calculo.puntuacion >= 0.5) return 2
  return calculo.puntuacion > 0 ? 1 : 0
}
