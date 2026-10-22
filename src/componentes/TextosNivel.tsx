import type { TextoNivel } from '../data/tipos'
import estilos from './TextosNivel.module.css'

export function TextosNivel({ textos }: { textos: TextoNivel[] }) {
  return (
    <div className={estilos.textos}>
      {textos.map((texto) => (
        <div key={texto.origen} className={estilos.texto}>
          <p className={`rotulo ${estilos.origen}`}>{texto.origen}</p>
          <p>{texto.texto}</p>
        </div>
      ))}
    </div>
  )
}
