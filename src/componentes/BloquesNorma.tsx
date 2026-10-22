import type { BloqueNorma, ItemNorma } from '../data/tipos'
import estilos from './BloquesNorma.module.css'
import { Subtitulo } from './Subtitulo'

const marcador = /^((?:[a-z]|\d+))\) (.*)$/s

function Item({ item }: { item: ItemNorma }) {
  const partes = item.texto.match(marcador)
  return (
    <li className={estilos.item}>
      {partes ? (
        <>
          <span className={estilos.marcador}>{partes[1]})</span>
          <span>{partes[2]}</span>
        </>
      ) : (
        <span className={estilos.sinMarcador}>{item.texto}</span>
      )}
      {item.subitems && (
        <ul className={estilos.subitems}>
          {item.subitems.map((subitem) => {
            const subpartes = subitem.match(marcador)
            return (
              <li key={subitem} className={estilos.item}>
                {subpartes ? (
                  <>
                    <span className={estilos.marcador}>{subpartes[1]})</span>
                    <span>{subpartes[2]}</span>
                  </>
                ) : (
                  <span className={estilos.sinMarcador}>{subitem}</span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

export function BloquesNorma({ bloques }: { bloques: BloqueNorma[] }) {
  return (
    <div className={estilos.bloques}>
      {bloques.map((bloque, indice) => {
        switch (bloque.tipo) {
          case 'parrafo':
            return <p key={indice}>{bloque.texto}</p>
          case 'subtitulo':
            return (
              <Subtitulo key={indice} menor>
                {bloque.texto}
              </Subtitulo>
            )
          case 'lista':
            return (
              <ul key={indice} className={estilos.lista}>
                {bloque.items.map((item) => (
                  <Item key={item.texto} item={item} />
                ))}
              </ul>
            )
        }
      })}
    </div>
  )
}
