const prefijo = 'confidencialidad-oracle:'

export function leerAlmacen<T>(clave: string, valorPorOmision: T): T {
  try {
    const crudo = window.localStorage.getItem(prefijo + clave)
    if (crudo === null) return valorPorOmision
    return JSON.parse(crudo) as T
  } catch {
    return valorPorOmision
  }
}

export function guardarAlmacen<T>(clave: string, valor: T): void {
  try {
    window.localStorage.setItem(prefijo + clave, JSON.stringify(valor))
  } catch {
    return
  }
}

export function borrarAlmacen(clave: string): void {
  try {
    window.localStorage.removeItem(prefijo + clave)
  } catch {
    return
  }
}
