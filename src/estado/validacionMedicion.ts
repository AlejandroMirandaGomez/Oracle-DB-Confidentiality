import type { CampoMedicion, EvidenciaRequerida, Medicion, ValorMedicion } from '../data/tipos'

type Valores = Record<string, ValorMedicion>

export type RestriccionCampo = {
  minimo: number
  maximo: number | null
  dependeDe: CampoMedicion | null
  esperado: string
  bloqueado: boolean
}

const formatoEntero = new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 })

function campoPorId(evidencia: EvidenciaRequerida, id: string): CampoMedicion | undefined {
  return evidencia.mediciones.flatMap((medicion) => medicion.campos).find((campo) => campo.id === id)
}

export function restriccionCampo(evidencia: EvidenciaRequerida, campo: CampoMedicion, valores: Valores): RestriccionCampo {
  let minimo = 0
  let dependeDe: CampoMedicion | null = null
  let meta = campo.origen === 'sql' ? `el total real de ${campo.etiqueta.toLowerCase()}` : `el total documentado de ${campo.etiqueta.toLowerCase()}`

  for (const medicion of evidencia.mediciones) {
    const regla = medicion.regla
    if (regla.tipo === 'vigencia' || regla.tipo === 'cobertura') {
      if (regla.objetivo === campo.id) {
        minimo = 1
        meta = 'el plazo positivo definido por su organización'
      }
      if (regla.tipo === 'vigencia' && regla.dias === campo.id) {
        const objetivo = campoPorId(evidencia, regla.objetivo)
        const dias = valores[regla.objetivo]
        const limite = typeof dias === 'number' ? dias : objetivo?.sugerido
        meta = `hasta ${limite ?? 'el plazo de su política'} días`
      }
      if (regla.tipo === 'cobertura' && regla.valor === campo.id) {
        const objetivo = campoPorId(evidencia, regla.objetivo)
        const dias = valores[regla.objetivo]
        const limite = typeof dias === 'number' ? dias : objetivo?.sugerido
        meta = `al menos ${limite ?? 'el plazo exigido por su política'} días conservados`
      }
    }
    if (regla.tipo === 'proporcion' && regla.casos === campo.id) {
      dependeDe = campoPorId(evidencia, regla.total) ?? null
      const descuento = regla.descontar ? campoPorId(evidencia, regla.descontar) : undefined
      meta = descuento?.oculto && descuento.sugerido !== undefined
        ? `como máximo ${formatoEntero.format(descuento.sugerido)} casos`
        : regla.descontar ? 'ningún caso sin justificar' : '0 casos'
    }
    if (regla.tipo === 'porCaso' && regla.casos === campo.id) {
      meta = regla.descontar ? 'ningún caso sin justificar' : '0 casos'
    }
    if ((regla.tipo === 'proporcion' || regla.tipo === 'porCaso') && regla.descontar === campo.id && !campo.oculto) {
      dependeDe = campoPorId(evidencia, regla.casos) ?? null
      meta = 'la cantidad realmente justificada o protegida en sus registros'
    }
  }

  const base = dependeDe ? valores[dependeDe.id] : undefined
  const maximo = typeof base === 'number' && Number.isSafeInteger(base) && base >= 0 ? base : null
  const bloqueado = dependeDe !== null && maximo === null
  const esperado = dependeDe !== null && maximo !== null && meta === '0 casos'
    ? `0 de ${formatoEntero.format(maximo)} (${dependeDe.etiqueta}).`
    : dependeDe !== null && maximo !== null && meta === 'la cantidad realmente justificada o protegida en sus registros'
      ? `${formatoEntero.format(maximo)} de ${formatoEntero.format(maximo)} ${campo.etiqueta.toLowerCase()}.`
      : `${meta}.`

  return { minimo, maximo, dependeDe, esperado, bloqueado }
}

export function ordenarCampos(evidencia: EvidenciaRequerida, campos: CampoMedicion[]): CampoMedicion[] {
  const ordenados: CampoMedicion[] = []
  const incluidos = new Set<string>()
  const disponibles = new Map(campos.map((campo) => [campo.id, campo]))
  function incluir(campo: CampoMedicion) {
    if (incluidos.has(campo.id)) return
    incluidos.add(campo.id)
    const dependencia = restriccionCampo(evidencia, campo, {}).dependeDe
    if (dependencia) {
      const anterior = disponibles.get(dependencia.id)
      if (anterior) incluir(anterior)
    }
    ordenados.push(campo)
  }
  campos.forEach(incluir)
  return ordenados
}

export function errorCampo(evidencia: EvidenciaRequerida, campo: CampoMedicion, valores: Valores): string | null {
  const valor = valores[campo.id]
  if (valor === undefined) return null
  const restriccion = restriccionCampo(evidencia, campo, valores)
  if (typeof valor !== 'number' || !Number.isSafeInteger(valor) || valor < restriccion.minimo) return `${campo.etiqueta}: valor no válido.`
  if (restriccion.bloqueado) return `${campo.etiqueta}: primero complete ${restriccion.dependeDe?.etiqueta}.`
  if (restriccion.maximo !== null && valor > restriccion.maximo) return `${campo.etiqueta}: no puede superar ${formatoEntero.format(restriccion.maximo)} (${restriccion.dependeDe?.etiqueta}).`
  return null
}

export function errorMedicion(medicion: Medicion, valores: Valores): string | null {
  const evidencia: EvidenciaRequerida = { id: '', control: '', nombre: '', pregunta: '', consulta: { contenedor: 'PDB', codigo: '' }, mediciones: [medicion] }
  for (const campo of medicion.campos) {
    const error = errorCampo(evidencia, campo, valores)
    if (error) return error
  }
  return null
}

export function limpiarDependientes(evidencia: EvidenciaRequerida, valores: Valores): Valores {
  const siguientes = { ...valores }
  const campos = evidencia.mediciones.flatMap((medicion) => medicion.campos).filter((campo) => !campo.oculto)
  for (let vuelta = 0; vuelta < campos.length; vuelta += 1) {
    let cambio = false
    for (const campo of campos) {
      if (siguientes[campo.id] === undefined) continue
      const restriccion = restriccionCampo(evidencia, campo, siguientes)
      if (restriccion.bloqueado || errorCampo(evidencia, campo, siguientes)) {
        delete siguientes[campo.id]
        cambio = true
      }
    }
    if (!cambio) break
  }
  for (const medicion of evidencia.mediciones) {
    const regla = medicion.regla
    if (regla.tipo !== 'alcance') continue
    const base = siguientes[regla.base]
    const opcion = siguientes[regla.campo.id]
    if (typeof base !== 'number' || base <= 0 || opcion === 'mayoria' && Math.floor(base / 2) + 1 >= base || opcion === 'mitad' && base % 2 !== 0 || opcion === 'minoria' && Math.ceil(base / 2) <= 1) {
      delete siguientes[regla.campo.id]
    }
  }
  return siguientes
}
