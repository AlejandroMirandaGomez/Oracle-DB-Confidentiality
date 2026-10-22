import { Papel } from '../componentes/Papel'
import { referencias } from '../data/referencias'
import estilos from './PapelReferencias.module.css'

export function PapelReferencias() {
  return (
    <Papel
      letra="J"
      titulo="Referencias"
      objetivo="Fuentes citadas en el legajo, en formato APA 7. El texto de ISO/IEC 27002:2022 se consultó con licencia del autor y se parafrasea; no se reproduce."
    >
      <ol className={estilos.lista}>
        {referencias.map((referencia) => (
          <li key={referencia.id} className={estilos.referencia}>
            {referencia.apa}{' '}
            {referencia.url && (
              <a href={referencia.url} target="_blank" rel="noreferrer" className={estilos.enlace}>
                {referencia.url}
              </a>
            )}
          </li>
        ))}
      </ol>
    </Papel>
  )
}
