import { useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
import { CheckIcon } from '@phosphor-icons/react'
import { controles } from '../data/catalogo/controles'
import { matriz } from '../data/catalogo/matriz'
import type { EvaluacionGuardada } from '../estado/historial'
import { formatoPuntuacion, puntuacionesControles, puntuacionSalud, saludDePuntuacion } from '../estado/puntuaciones'
import { Lampara } from './Lampara'
import estilos from './GraficoConjunto.module.css'

type Marcador = 'circulo' | 'cuadro' | 'triangulo'

type Serie = {
  id: string
  nombre: string
  color: string
  tono: number
  trazo: string | undefined
  marcador: Marcador
  valores: number[]
}

// Seis familias de color en tres tonos (medio, oscuro, claro). Cada tono lleva además su propio
// trazo y marcador, para que la identidad de los 18 controles no dependa solo del color.
const familias = [
  ['#118186', '#0a5b5f', '#19a9b0'],
  ['#af467e', '#812a5a', '#d46ea1'],
  ['#396fc8', '#204c96', '#6094ea'],
  ['#b25201', '#7e3a06', '#d8783d'],
  ['#8656b7', '#613888', '#a97dda'],
  ['#607e09', '#435905', '#82a438'],
] as const

const tonos = [
  { marcador: 'circulo', trazo: undefined },
  { marcador: 'cuadro', trazo: '7 4' },
  { marcador: 'triangulo', trazo: undefined },
] as const satisfies readonly { marcador: Marcador; trazo: string | undefined }[]

const plano = { izquierda: 58, derecha: 700, arriba: 24, abajo: 270 }
const anchoPlano = plano.derecha - plano.izquierda
const altoPlano = plano.abajo - plano.arriba
const anchoLienzo = 780
const altoLienzo = 330

const fechaCorta = new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: 'short', year: '2-digit' })
const fechaHora = new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' })
const horaCorta = new Intl.DateTimeFormat('es-CR', { hour: '2-digit', minute: '2-digit' })

const xDe = (indice: number, total: number) => total === 1 ? (plano.izquierda + plano.derecha) / 2 : plano.izquierda + (indice / (total - 1)) * anchoPlano
const yDe = (valor: number) => plano.abajo - valor * altoPlano
const puntosDe = (valores: number[]) => valores.map((valor, indice) => `${xDe(indice, valores.length)},${yDe(valor)}`).join(' ')

function aparienciaDe(indice: number) {
  const tono = Math.floor(indice / familias.length) % tonos.length
  const { marcador, trazo } = tonos[tono] ?? tonos[0]
  return { color: familias[indice % familias.length]?.[tono] ?? '#3a3f43', tono, marcador, trazo }
}

function valorInterpolado(valores: number[], x: number): number {
  if (valores.length === 1) return valores[0] ?? 0
  const posicion = Math.min(valores.length - 1, Math.max(0, ((x - plano.izquierda) / anchoPlano) * (valores.length - 1)))
  const inicio = Math.floor(posicion)
  const desde = valores[inicio] ?? 0
  const hasta = valores[Math.min(valores.length - 1, inicio + 1)] ?? desde
  return desde + (hasta - desde) * (posicion - inicio)
}

function textoCambio(cambio: number): string {
  return `${cambio > 0 ? '+' : cambio < 0 ? '−' : '±'}${formatoPuntuacion(Math.abs(cambio))}`
}

function FormaMarcador({ forma, x, y, radio = 4.5 }: { forma: Marcador; x: number; y: number; radio?: number }) {
  if (forma === 'cuadro') return <rect x={x - radio * 0.9} y={y - radio * 0.9} width={radio * 1.8} height={radio * 1.8} />
  if (forma === 'triangulo') {
    const lado = radio * 1.3
    return <polygon points={`${x},${y - lado} ${x + lado * 0.87},${y + lado * 0.6} ${x - lado * 0.87},${y + lado * 0.6}`} />
  }
  return <circle cx={x} cy={y} r={radio} />
}

function ClaveSerie({ serie }: { serie: Pick<Serie, 'color' | 'trazo' | 'marcador'> }) {
  return (
    <svg className={estilos.clave} viewBox="0 0 34 14" aria-hidden="true">
      <line x1="1" x2="33" y1="7" y2="7" stroke={serie.color} strokeWidth="2" strokeDasharray={serie.trazo} />
      <g fill={serie.color} className={estilos.marcadores}><FormaMarcador forma={serie.marcador} x={17} y={7} radio={4} /></g>
    </svg>
  )
}

function ClaveSalud({ valor }: { valor: number }) {
  return (
    <svg className={estilos.clave} viewBox="0 0 34 14" aria-hidden="true">
      <line x1="1" x2="33" y1="7" y2="7" className={estilos.lineaSalud} />
      <circle cx="17" cy="7" r="4.5" className={estilos.puntoSalud} data-salud={saludDePuntuacion(valor)} />
    </svg>
  )
}

const idSalud = 'salud'

export function GraficoConjunto({ registros }: { registros: EvaluacionGuardada[] }) {
  const lienzo = useRef<SVGSVGElement>(null)
  const [ocultos, setOcultos] = useState<Set<string>>(() => new Set())
  const [mostrarSalud, setMostrarSalud] = useState(true)
  const [resaltadoLeyenda, setResaltadoLeyenda] = useState<string | null>(null)
  const [puntero, setPuntero] = useState<{ indice: number; series: string[]; x: number; y: number } | null>(null)
  const [fechaFijada, setFechaFijada] = useState<number | null>(null)

  const total = registros.length
  const nombres = new Map(controles.map((control) => [control.id, control.nombre]))
  const puntuaciones = registros.map((registro) => new Map(puntuacionesControles(registro.evaluacion).map((control) => [control.id, control.puntuacion])))
  const salud = registros.map((registro) => puntuacionSalud(registro.evaluacion))
  const series: Serie[] = matriz.map((fila, indice) => ({
    id: fila.control,
    nombre: nombres.get(fila.control) ?? fila.control,
    ...aparienciaDe(indice),
    valores: puntuaciones.map((mapa) => mapa.get(fila.control) ?? 0),
  }))
  const visibles = series.filter((serie) => !ocultos.has(serie.id))

  const indiceFijado = fechaFijada !== null && fechaFijada < total ? fechaFijada : null
  const indiceLeido = puntero?.indice ?? indiceFijado ?? total - 1
  const registroLeido = registros[indiceLeido]
  const activos = new Set(resaltadoLeyenda ? [resaltadoLeyenda] : puntero?.series ?? [])
  const hayActivos = activos.size > 0
  // La serie resaltada se dibuja al final para que quede encima de las que comparten trayectoria.
  const ordenadas = [...visibles.filter((serie) => !activos.has(serie.id)), ...visibles.filter((serie) => activos.has(serie.id))]
  const etiquetas = new Set(total <= 5
    ? registros.map((_, indice) => indice)
    : [0, 1, 2, 3, 4].map((indice) => Math.round((indice * (total - 1)) / 4)))

  const alternar = (id: string) => setOcultos((actual) => {
    const siguientes = new Set(actual)
    if (siguientes.has(id)) siguientes.delete(id)
    else siguientes.add(id)
    return siguientes
  })

  const leerPuntero = (evento: MouseEvent<SVGRectElement>) => {
    const matrizPantalla = lienzo.current?.getScreenCTM()
    if (!matrizPantalla) return null
    const punto = new DOMPoint(evento.clientX, evento.clientY).matrixTransform(matrizPantalla.inverse())
    const indice = total === 1 ? 0 : Math.min(total - 1, Math.max(0, Math.round(((punto.x - plano.izquierda) / anchoPlano) * (total - 1))))
    const candidatas = [
      ...(mostrarSalud ? [{ id: idSalud, valores: salud }] : []),
      ...visibles,
    ].map((serie) => ({ id: serie.id, distancia: Math.abs(yDe(valorInterpolado(serie.valores, punto.x)) - punto.y) }))
    const minima = Math.min(...candidatas.map((candidata) => candidata.distancia))
    // Todas las líneas que pasan por el mismo punto se identifican juntas.
    const cercanas = minima <= 14 ? candidatas.filter((candidata) => candidata.distancia <= minima + 2).map((candidata) => candidata.id) : []
    return { indice, series: cercanas, x: punto.x, y: punto.y }
  }

  const alTeclear = (evento: KeyboardEvent<HTMLDivElement>) => {
    const desplazamientos: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, Home: -total, End: total }
    const paso = desplazamientos[evento.key]
    if (paso === undefined || total === 0) return
    evento.preventDefault()
    setFechaFijada(Math.min(total - 1, Math.max(0, (indiceFijado ?? total - 1) + paso)))
  }

  const seriesPuntero = puntero ? puntero.series.flatMap((id) => {
    if (id === idSalud) return [{ id, etiqueta: 'Salud general', valor: salud[puntero.indice] ?? 0, clave: <ClaveSalud valor={salud[puntero.indice] ?? 0} /> }]
    const serie = series.find((item) => item.id === id)
    return serie ? [{ id, etiqueta: `${serie.id} ${serie.nombre}`, valor: serie.valores[puntero.indice] ?? 0, clave: <ClaveSerie serie={serie} /> }] : []
  }) : []
  const xPuntero = puntero ? xDe(puntero.indice, total) : 0
  const valoresPuntero = new Set(seriesPuntero.map((item) => formatoPuntuacion(item.valor)))

  const saludLeida = salud[indiceLeido] ?? 0
  const saludPrevia = salud[indiceLeido - 1]
  const tonoSalud = saludDePuntuacion(saludLeida)

  return (
    <div className={estilos.conjunto}>
      <div className={estilos.escalaHorizontal}>
        <div
          className={estilos.lienzo}
          tabIndex={0}
          role="group"
          aria-label="Gráfica conjunta de controles y salud general. Use las flechas izquierda y derecha para elegir la evaluación que se lee en la leyenda."
          onKeyDown={alTeclear}
        >
          <svg ref={lienzo} className={estilos.grafico} viewBox={`0 0 ${anchoLienzo} ${altoLienzo}`} role="img" aria-label="Evolución cronológica de la puntuación de cada control observable y de la salud general, de cero a uno">
            {[0, 0.25, 0.5, 0.75, 1].map((valor) => (
              <g key={valor}>
                <line className={valor === 0.5 || valor === 0.75 ? estilos.umbral : estilos.lineaGuia} x1={plano.izquierda} x2={plano.derecha} y1={yDe(valor)} y2={yDe(valor)} />
                <text className={estilos.rotuloEje} x="46" y={yDe(valor) + 4} textAnchor="end">{formatoPuntuacion(valor)}</text>
              </g>
            ))}
            <text className={estilos.rotuloUmbral} x={plano.izquierda + 6} y={yDe(0.75) - 6}>Verde desde 0,75</text>
            <text className={estilos.rotuloUmbral} x={plano.izquierda + 6} y={yDe(0.5) - 6}>Amarillo desde 0,50</text>

            {(puntero || indiceFijado !== null) && (
              <line className={estilos.cursor} data-fijado={!puntero || undefined} x1={xDe(indiceLeido, total)} x2={xDe(indiceLeido, total)} y1={plano.arriba - 10} y2={plano.abajo} />
            )}

            {ordenadas.map((serie) => (
              <g key={serie.id} className={estilos.serie} data-atenuada={(hayActivos && !activos.has(serie.id)) || undefined}>
                <polyline className={estilos.linea} points={puntosDe(serie.valores)} stroke={serie.color} strokeDasharray={serie.trazo} data-activa={activos.has(serie.id) || undefined} />
                <g className={estilos.marcadores} fill={serie.color}>
                  {serie.valores.map((valor, indice) => <FormaMarcador key={registros[indice]?.id ?? indice} forma={serie.marcador} x={xDe(indice, total)} y={yDe(valor)} />)}
                </g>
              </g>
            ))}

            {mostrarSalud && total > 0 && (
              <g className={estilos.serie} data-atenuada={(hayActivos && !activos.has(idSalud)) || undefined}>
                <polyline className={estilos.halo} points={puntosDe(salud)} />
                <polyline className={estilos.lineaSalud} points={puntosDe(salud)} />
                {salud.map((valor, indice) => <circle key={registros[indice]?.id ?? indice} className={estilos.puntoSalud} data-salud={saludDePuntuacion(valor)} cx={xDe(indice, total)} cy={yDe(valor)} r="6" />)}
                <text className={estilos.rotuloSalud} x={xDe(total - 1, total) + 12} y={yDe(salud[total - 1] ?? 0) + 4}>Salud</text>
              </g>
            )}

            {registros.map((registro, indice) => etiquetas.has(indice) && (
              <text
                key={registro.id}
                className={estilos.rotuloEje}
                data-leida={indice === indiceLeido && (puntero || indiceFijado !== null) ? '' : undefined}
                x={xDe(indice, total)}
                y="296"
                textAnchor={indice === 0 && total > 1 ? 'start' : indice === total - 1 && total > 1 ? 'end' : 'middle'}
              >
                <tspan x={xDe(indice, total)}>{fechaCorta.format(new Date(registro.fechaGuardado))}</tspan>
                <tspan x={xDe(indice, total)} dy="15">{horaCorta.format(new Date(registro.fechaGuardado))}</tspan>
              </text>
            ))}

            <rect
              className={estilos.captura}
              x={plano.izquierda - 24}
              y={plano.arriba - 16}
              width={anchoPlano + 48}
              height={altoPlano + 32}
              onPointerMove={(evento) => setPuntero(leerPuntero(evento))}
              onPointerDown={(evento) => setPuntero(leerPuntero(evento))}
              onPointerLeave={() => setPuntero(null)}
              onClick={(evento) => {
                const lectura = leerPuntero(evento)
                if (lectura) setFechaFijada(lectura.indice)
              }}
            />
          </svg>

          {puntero && registros[puntero.indice] && (
            <div
              className={estilos.globo}
              data-lado={xPuntero > anchoLienzo * 0.6 ? 'izquierda' : 'derecha'}
              data-vertical={puntero.y < altoLienzo / 2 ? 'abajo' : 'arriba'}
              style={{ '--x': `${(xPuntero / anchoLienzo) * 100}%`, '--y': `${(Math.min(Math.max(puntero.y, plano.arriba), plano.abajo) / altoLienzo) * 100}%` } as CSSProperties}
              aria-hidden="true"
            >
              <time className={estilos.globoFecha}>{fechaHora.format(new Date(registros[puntero.indice]?.fechaGuardado ?? ''))}</time>
              {seriesPuntero.length === 0
                ? <span className={estilos.globoPista}>Acerque el cursor a una línea para identificarla</span>
                : (
                  <ul className={estilos.globoLista}>
                    {seriesPuntero.slice(0, 4).map((item) => (
                      <li key={item.id}>
                        {item.clave}
                        <strong>{formatoPuntuacion(item.valor)}</strong>
                        <span>{item.etiqueta}</span>
                      </li>
                    ))}
                    {seriesPuntero.length > 4 && <li className={estilos.globoMas}>y {seriesPuntero.length - 4} más{valoresPuntero.size === 1 ? ' con el mismo valor' : ''}</li>}
                  </ul>
                )}
            </div>
          )}
        </div>
      </div>

      <div className={estilos.leyenda}>
        <div className={estilos.barraLeyenda}>
          <p className={estilos.lectura}>
            Valores al <time dateTime={registroLeido?.fechaGuardado}>{registroLeido ? fechaHora.format(new Date(registroLeido.fechaGuardado)) : 'sin fecha'}</time>
            <span className={estilos.lecturaNota}>{indiceLeido === total - 1 ? 'Evaluación más reciente' : `Evaluación ${indiceLeido + 1} de ${total}`}{indiceLeido > 0 ? '; el cambio se mide frente a la anterior' : ''}</span>
          </p>
          <span className="solo-lectores" aria-live="polite">{indiceFijado !== null && registros[indiceFijado] ? `Leyendo la evaluación del ${fechaHora.format(new Date(registros[indiceFijado].fechaGuardado))}` : ''}</span>
          <div className={estilos.accionesLeyenda}>
            {indiceFijado !== null && indiceFijado !== total - 1 && (
              <button type="button" className="pulsador" data-compacto="" onClick={() => setFechaFijada(null)}>Ver la más reciente</button>
            )}
            <button type="button" className="pulsador" data-compacto="" disabled={ocultos.size === 0} onClick={() => setOcultos(new Set())}>Mostrar todos</button>
            <button type="button" className="pulsador" data-compacto="" disabled={ocultos.size === series.length} onClick={() => setOcultos(new Set(series.map((serie) => serie.id)))}>Ocultar todos</button>
          </div>
        </div>

        <ul className={estilos.elementos} aria-label="Series de la gráfica conjunta; pulse una para mostrarla u ocultarla">
          <li className={estilos.elementoSalud}>
            <button
              type="button"
              className={estilos.elemento}
              aria-pressed={mostrarSalud}
              data-activo={activos.has(idSalud) || undefined}
              style={{ '--serie': 'var(--placa)' } as CSSProperties}
              onClick={() => setMostrarSalud((actual) => !actual)}
              onPointerEnter={() => setResaltadoLeyenda(idSalud)}
              onPointerLeave={() => setResaltadoLeyenda(null)}
              onFocus={() => setResaltadoLeyenda(idSalud)}
              onBlur={() => setResaltadoLeyenda(null)}
            >
              <span className={estilos.casilla} aria-hidden="true">{mostrarSalud && <CheckIcon weight="bold" />}</span>
              <ClaveSalud valor={saludLeida} />
              <span className={estilos.identidad}>
                <span className={estilos.idSerie}>Salud general</span>
                <span className={estilos.nombreSerie}>Promedio de los {series.length} controles</span>
              </span>
              <span className={estilos.valor}>
                <Lampara tono={tonoSalud === 'Verde' ? 'verde' : tonoSalud === 'Amarillo' ? 'ambar' : 'roja'} texto={tonoSalud} />
                <span className={estilos.cifras}>
                  <span className={estilos.cifra}>{formatoPuntuacion(saludLeida)}</span>
                  {saludPrevia !== undefined && <span className={estilos.cambio}>{textoCambio(saludLeida - saludPrevia)}</span>}
                </span>
              </span>
            </button>
          </li>
          {series.map((serie) => {
            const visible = !ocultos.has(serie.id)
            const valor = serie.valores[indiceLeido] ?? 0
            const previo = serie.valores[indiceLeido - 1]
            return (
              <li key={serie.id}>
                <button
                  type="button"
                  className={estilos.elemento}
                  aria-pressed={visible}
                  data-tono={serie.tono}
                  data-activo={activos.has(serie.id) || undefined}
                  style={{ '--serie': serie.color } as CSSProperties}
                  onClick={() => alternar(serie.id)}
                  onPointerEnter={() => setResaltadoLeyenda(serie.id)}
                  onPointerLeave={() => setResaltadoLeyenda(null)}
                  onFocus={() => setResaltadoLeyenda(serie.id)}
                  onBlur={() => setResaltadoLeyenda(null)}
                >
                  <span className={estilos.casilla} aria-hidden="true">{visible && <CheckIcon weight="bold" />}</span>
                  <ClaveSerie serie={serie} />
                  <span className={estilos.identidad}>
                    <span className={estilos.idSerie}>{serie.id}</span>
                    <span className={estilos.nombreSerie}>{serie.nombre}</span>
                  </span>
                  <span className={estilos.cifras}>
                    <span className={estilos.cifra}>{formatoPuntuacion(valor)}</span>
                    {previo !== undefined && <span className={estilos.cambio}>{textoCambio(valor - previo)}</span>}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="solo-lectores">
        <table>
          <caption>Puntuación de la salud general y de cada control observable en cada evaluación, de cero a uno</caption>
          <thead>
            <tr>
              <th scope="col">Serie</th>
              {registros.map((registro) => <th key={registro.id} scope="col">{fechaHora.format(new Date(registro.fechaGuardado))}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Salud general</th>
              {salud.map((valor, indice) => <td key={registros[indice]?.id ?? indice}>{formatoPuntuacion(valor)}</td>)}
            </tr>
            {series.map((serie) => (
              <tr key={serie.id}>
                <th scope="row">{serie.id} {serie.nombre}</th>
                {serie.valores.map((valor, indice) => <td key={registros[indice]?.id ?? indice}>{formatoPuntuacion(valor)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
