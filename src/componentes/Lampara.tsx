import estilos from './Lampara.module.css'
import { tonoDeValor, type Tono, type ValorLampara } from './tonosLampara'

type PropsLampara = {
  tono: Tono
  texto: string
  className?: string | undefined
}

export function Lampara({ tono, texto, className }: PropsLampara) {
  return (
    <span key={tono} className={className ? `${estilos.lampara} ${className}` : estilos.lampara} data-tono={tono}>
      {texto}
    </span>
  )
}

export function LamparaEstado({ valor, texto, className }: { valor: ValorLampara; texto?: string; className?: string | undefined }) {
  return <Lampara tono={tonoDeValor[valor]} texto={texto ?? valor} className={className} />
}

export function PuntoLampara({ tono }: { tono: Tono }) {
  return <span key={tono} className={estilos.punto} data-tono={tono} aria-hidden="true" />
}
