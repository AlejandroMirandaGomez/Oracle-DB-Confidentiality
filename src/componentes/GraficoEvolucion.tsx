import { Lampara } from './Lampara'
import { formatoPuntuacion, saludDePuntuacion } from '../estado/puntuaciones'
import estilos from './GraficoEvolucion.module.css'

export type PuntoEvolucion = { id: string; fecha: string; valor: number }

const fechaCorta = new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: 'short', year: '2-digit' })
const fechaHora = new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' })
const horaCorta = new Intl.DateTimeFormat('es-CR', { hour: '2-digit', minute: '2-digit' })

export function GraficoEvolucion({ puntos, etiqueta }: { puntos: PuntoEvolucion[]; etiqueta: string }) {
  const coordenadas = puntos.map((punto, indice) => ({
    ...punto,
    salud: saludDePuntuacion(punto.valor),
    x: puntos.length === 1 ? 392 : 58 + (indice / (puntos.length - 1)) * 672,
    y: 220 - punto.valor * 194,
  }))
  const etiquetas = new Set(puntos.length <= 5
    ? puntos.map((_, indice) => indice)
    : [0, 1, 2, 3, 4].map((indice) => Math.round((indice * (puntos.length - 1)) / 4)))

  return (
    <div className={estilos.escalaHorizontal}>
      <svg className={estilos.grafico} viewBox="0 0 780 296" role="img" aria-label={etiqueta}>
        {[0, 0.25, 0.5, 0.75, 1].map((valor) => {
          const y = 220 - valor * 194
          return (
            <g key={valor}>
              <line className={estilos.lineaGuia} x1="58" x2="730" y1={y} y2={y} />
              <text className={estilos.rotuloEje} x="46" y={y + 4} textAnchor="end">{formatoPuntuacion(valor)}</text>
            </g>
          )
        })}
        {coordenadas.length > 1 && <polyline className={estilos.trayectoria} points={coordenadas.map((punto) => `${punto.x},${punto.y}`).join(' ')} />}
        {coordenadas.map((punto, indice) => (
          <g key={punto.id}>
            <circle className={estilos.punto} data-salud={punto.salud} cx={punto.x} cy={punto.y} r="6">
              <title>{`${fechaHora.format(new Date(punto.fecha))}: ${formatoPuntuacion(punto.valor)} de 1, ${punto.salud.toLowerCase()}`}</title>
            </circle>
            {coordenadas.length <= 5 && <text className={estilos.valorPunto} x={punto.x} y={punto.y - 13} textAnchor="middle">{formatoPuntuacion(punto.valor)}</text>}
            {etiquetas.has(indice) && (
              <text className={estilos.rotuloEje} x={punto.x} y="251" textAnchor={indice === 0 && coordenadas.length > 1 ? 'start' : indice === coordenadas.length - 1 && coordenadas.length > 1 ? 'end' : 'middle'}>
                <tspan x={punto.x}>{fechaCorta.format(new Date(punto.fecha))}</tspan>
                <tspan x={punto.x} dy="15">{horaCorta.format(new Date(punto.fecha))}</tspan>
              </text>
            )}
          </g>
        ))}
      </svg>
      <table className="solo-lectores">
        <caption>{etiqueta}</caption>
        <thead><tr><th scope="col">Fecha</th><th scope="col">Puntuación</th></tr></thead>
        <tbody>{puntos.map((punto) => <tr key={punto.id}><td>{fechaHora.format(new Date(punto.fecha))}</td><td>{formatoPuntuacion(punto.valor)} de 1</td></tr>)}</tbody>
      </table>
    </div>
  )
}

export function LeyendaPuntuacion() {
  return (
    <div className={estilos.leyenda} aria-label="Escala de puntuación">
      <span><Lampara tono="roja" texto="Rojo" /> menos de 0,50</span>
      <span><Lampara tono="ambar" texto="Amarillo" /> de 0,50 a menos de 0,75</span>
      <span><Lampara tono="verde" texto="Verde" /> desde 0,75</span>
    </div>
  )
}
