import { SealCheckIcon } from '@phosphor-icons/react'
import estilos from './LeyendaMarcas.module.css'
import { Marca } from './Marca'
import { SelectorNivel } from './SelectorNivel'

export function LeyendaMarcas() {
  return (
    <div className={estilos.leyenda}>
      <h3 className={estilos.titulo}>Leyenda de marcas</h3>
      <dl className={estilos.lista}>
        <div>
          <dt>
            <Marca valor="Cumple" conTexto={false} />
          </dt>
          <dd>Cumple o conforme, verificado contra la evidencia</dd>
        </div>
        <div>
          <dt>
            <Marca valor="Parcial" conTexto={false} />
          </dt>
          <dd>Cumple en parte o con alcance incompleto</dd>
        </div>
        <div>
          <dt>
            <Marca valor="No cumple" conTexto={false} />
          </dt>
          <dd>No cumple, con hallazgo en el papel G</dd>
        </div>
        <div>
          <dt>
            <span className={estilos.ref}>PR-07</span>
          </dt>
          <dd>Referencia cruzada a otro papel</dd>
        </div>
        <div>
          <dt className={estilos.nivel}>
            <SelectorNivel nivel={2} original={2} etiqueta="Ejemplo de nivel" />
          </dt>
          <dd>Nivel de madurez asignado, encerrado en lápiz</dd>
        </div>
        <div>
          <dt>
            <SealCheckIcon className={estilos.sello} weight="bold" aria-hidden="true" />
          </dt>
          <dd>Papel firmado por el revisor</dd>
        </div>
      </dl>
    </div>
  )
}
