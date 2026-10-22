import estilos from './Lampara.module.css'
import { tonoDeValor, type Tono, type ValorLampara } from './tonosLampara'

type PropsLampara = {
  tono: Tono
  texto: string
}

export function Lampara({ tono, texto }: PropsLampara) {
  return (
    <span key={tono} className={estilos.lampara} data-tono={tono}>
      {texto}
    </span>
  )
}

export function LamparaEstado({ valor, texto }: { valor: ValorLampara; texto?: string }) {
  return <Lampara tono={tonoDeValor[valor]} texto={texto ?? valor} />
}

export function PuntoLampara({ tono }: { tono: Tono }) {
  return <span key={tono} className={estilos.punto} data-tono={tono} aria-hidden="true" />
}
