import { formatoNumero, formatoPuntuacion, type CalculoControl } from '../estado/medicion'
import { saludDePuntuacion } from '../estado/puntuaciones'
import estilos from './DesgloseControl.module.css'
import { Lampara } from './Lampara'
import { LamparaMedicion } from './TarjetaEvidencia'
import type { Tono } from './tonosLampara'

const tonoDeSalud: Record<ReturnType<typeof saludDePuntuacion>, Tono> = { Verde: 'verde', Amarillo: 'ambar', Rojo: 'roja' }

export function DesgloseControl({ control, calculo }: { control: string; calculo: CalculoControl }) {
  const criticas = calculo.lineas.filter((linea) => linea.medicion.critica)
  const vigentes = calculo.lineas.filter((linea) => linea.resultado.estado !== 'excluida')
  const operacion = vigentes.map((linea) => `(${formatoPuntuacion(linea.pesoEfectivo)} × ${formatoPuntuacion(linea.resultado.puntaje)})`).join(' + ')
  return (
    <section className={estilos.desglose} aria-labelledby={`desglose-${control}`}>
      <h3 id={`desglose-${control}`} className={estilos.titulo}>
        Cuánto vale {control}
      </h3>
      <p className={estilos.regla}>Cada medición recibe un puntaje de 0 a 1 según su regla. El control suma peso × puntaje de cada una. Lo que falte por medir cuenta como 0,00.</p>
      <div className={estilos.marco}>
        <table className={estilos.tabla}>
          <caption className="solo-lectores">Aporte de cada medición a la puntuación de {control}</caption>
          <thead>
            <tr>
              <th scope="col">Medición</th>
              <th scope="col" className={estilos.numero}>Peso</th>
              <th scope="col">Puntaje</th>
              <th scope="col" className={estilos.numero}>Aporte</th>
            </tr>
          </thead>
          <tbody>
            {calculo.lineas.map(({ medicion, resultado, pesoEfectivo, aporte }) => (
              <tr key={medicion.id}>
                <th scope="row">
                  <span className={estilos.id}>{medicion.id}</span> {medicion.nombre}
                  {medicion.critica && <span className={estilos.critica}> (crítica)</span>}
                </th>
                <td className={estilos.numero}>{resultado.estado === 'excluida' ? 'Fuera' : `${formatoNumero(pesoEfectivo * 100)} %`}</td>
                <td><LamparaMedicion resultado={resultado} /></td>
                <td className={estilos.numero}>{formatoPuntuacion(aporte)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>Puntuación del control</th>
              <td className={estilos.numero}>
                <Lampara tono={calculo.respondidas === 0 ? 'apagada' : tonoDeSalud[saludDePuntuacion(calculo.puntuacion)]} texto={formatoPuntuacion(calculo.puntuacion)} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {vigentes.length > 0 && <p className={estilos.operacion}>{operacion} = {formatoPuntuacion(calculo.ponderado)}</p>}
      {calculo.excluidas > 0 && <p className={estilos.nota}>Las mediciones que no aplican salen del cálculo y su peso se reparte entre las demás.</p>}
      {calculo.limitante ? (
        <p className={estilos.tope}>
          El cálculo da {formatoPuntuacion(calculo.ponderado)}, pero {calculo.limitante.medicion.id} es crítica y vale {formatoPuntuacion(calculo.limitante.resultado.puntaje)}. El control queda en {formatoPuntuacion(calculo.puntuacion)}.
        </p>
      ) : (
        criticas.length > 0 && <p className={estilos.nota}>{criticas.map((linea) => linea.medicion.id).join(' y ')} es crítica: el control no puede valer más que ella.</p>
      )}
    </section>
  )
}
