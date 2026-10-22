const evidencias = import.meta.glob('../evidencias/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const scripts = import.meta.glob(['../sql/*.sql', '../sql/*.rman', '../scripts/*.ps1'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function nombreDeArchivo(ruta: string): string {
  return ruta.split('/').pop() ?? ruta
}

const evidenciaPorId = new Map(
  Object.entries(evidencias).map(([ruta, texto]) => [nombreDeArchivo(ruta).replace(/\.txt$/, ''), limpiarEvidencia(texto)]),
)

const scriptPorNombre = new Map(Object.entries(scripts).map(([ruta, texto]) => [nombreDeArchivo(ruta), texto.replace(/^﻿/, '')]))

function limpiarEvidencia(texto: string): string {
  return texto
    .replace(/^﻿/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function evidenciaDe(id: string): string | undefined {
  return evidenciaPorId.get(id)
}

export function scriptDe(nombre: string): string | undefined {
  return scriptPorNombre.get(nombre)
}

export function rutaDeScript(nombre: string): string {
  return nombre.endsWith('.ps1') ? `scripts/${nombre}` : `sql/${nombre}`
}
