import { BloqueCodigo } from '../componentes/BloqueCodigo'
import { Marca } from '../componentes/Marca'
import { Papel } from '../componentes/Papel'
import { ListaRefs } from '../componentes/Ref'
import { observables } from '../data/observables'
import { buscarControl } from '../estado/indice'
import estilos from './PapelObservables.module.css'

export function PapelObservables() {
  return (
    <Papel
      letra="D"
      titulo="Controles observables por un auditor externo"
      objetivo="Quince comprobaciones, una por control del enunciado, que un auditor externo puede repetir por su cuenta con una consulta y un criterio de aceptación explícito. El resultado viene de las pruebas ejecutadas en la instancia."
    >
      <ol className={estilos.lista}>
        {observables.map((observable) => {
          const control = buscarControl(observable.control)
          const veredicto = observable.veredicto
          return (
            <li key={observable.id} id={observable.id} className={estilos.item}>
              <div className={estilos.marca}>
                <Marca valor={veredicto} conTexto={false} />
              </div>
              <div className={estilos.cuerpo}>
                <p className={estilos.cabeza}>
                  <span className={estilos.id}>{observable.id}</span>
                  <ListaRefs ids={[observable.control]} />
                  <span className={estilos.control}>{control?.nombre}</span>
                </p>
                <p className={estilos.enunciado}>{observable.enunciado}</p>
                <p className={estilos.criterio}>
                  <span className={estilos.criterioRotulo}>Se acepta si:</span> {observable.criterio}
                </p>
                <p className={estilos.criterio}>
                  <span className={estilos.criterioRotulo}>Se observó:</span> {observable.resultado}
                </p>
                <div className={estilos.pie}>
                  <span className={estilos.resultado}>
                    <Marca valor={veredicto} />
                    <span className={estilos.pruebas}>
                      según <ListaRefs ids={observable.pruebas} />
                    </span>
                  </span>
                  <details className={estilos.consulta}>
                    <summary>Ver la consulta</summary>
                    <BloqueCodigo codigo={observable.consulta} titulo={`${observable.id}.sql`} />
                  </details>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </Papel>
  )
}
