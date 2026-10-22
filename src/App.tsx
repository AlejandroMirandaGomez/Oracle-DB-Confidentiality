import { Caratula } from './componentes/Caratula'
import { HojaReferencia } from './componentes/HojaReferencia'
import { IndicePapeles } from './componentes/IndicePapeles'
import { legajo } from './data/legajo'
import { LegajoProvider } from './estado/LegajoProvider'
import estilos from './App.module.css'
import { CedulaSumaria } from './papeles/CedulaSumaria'
import { PapelControles } from './papeles/PapelControles'
import { PapelHallazgos } from './papeles/PapelHallazgos'
import { PapelMarcoTeorico } from './papeles/PapelMarcoTeorico'
import { PapelMatriz } from './papeles/PapelMatriz'
import { PapelObservables } from './papeles/PapelObservables'
import { PapelPruebas } from './papeles/PapelPruebas'
import { PapelReferencias } from './papeles/PapelReferencias'
import { PapelRiesgos } from './papeles/PapelRiesgos'
import { PapelTareas } from './papeles/PapelTareas'
import { PapelUsoIA } from './papeles/PapelUsoIA'

export default function App() {
  return (
    <LegajoProvider>
      <div className={estilos.escritorio}>
        <IndicePapeles />
        <main className={estilos.legajo}>
          <Caratula />
          <CedulaSumaria />
          <PapelRiesgos />
          <PapelTareas />
          <PapelControles />
          <PapelObservables />
          <PapelMatriz />
          <PapelPruebas />
          <PapelHallazgos />
          <PapelMarcoTeorico />
          <PapelUsoIA />
          <PapelReferencias />
          <footer className={estilos.cierre}>
            <p>
              Fin del legajo. {legajo.autor}, {legajo.curso}, {legajo.universidad}, {legajo.periodo}.
            </p>
            <p>Los datos de clientes del esquema de prueba son sintéticos y se eliminaron de la instancia al terminar la batería.</p>
          </footer>
        </main>
      </div>
      <HojaReferencia />
    </LegajoProvider>
  )
}
