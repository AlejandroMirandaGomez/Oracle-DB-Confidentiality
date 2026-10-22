import { LamparaEstado } from './Lampara'
import type { ValorLampara } from './tonosLampara'
import { RampaMadurez } from './RampaMadurez'
import estilos from './LeyendaLamparas.module.css'

type Tipo = 'matriz' | 'bateria' | 'hallazgos'

type Entrada = { valor: ValorLampara; significado: string }

const entradas: Record<Tipo, Entrada[]> = {
  matriz: [
    { valor: 'Cumple', significado: 'Nivel 3 o 4: aplicado y verificado' },
    { valor: 'Parcial', significado: 'Nivel 2: definido pero incompleto' },
    { valor: 'No cumple', significado: 'Nivel 0 o 1: sin control efectivo' },
    { valor: 'Sin evaluar', significado: 'Fila sin nivel confirmado' },
  ],
  bateria: [
    { valor: 'Conforme', significado: 'El resultado observado coincide con el esperado' },
    { valor: 'Parcial', significado: 'Coincide en parte' },
    { valor: 'No conforme', significado: 'No coincide con el esperado' },
    { valor: 'Sin documentar', significado: 'La prueba aún no tiene resultado' },
  ],
  hallazgos: [
    { valor: 'Alta', significado: 'Riesgo crítico con control inexistente o prueba no conforme' },
    { valor: 'Media', significado: 'Control parcial o riesgo alto' },
    { valor: 'Baja', significado: 'Seguimiento sin urgencia' },
  ],
}

export function LeyendaLamparas({ tipo }: { tipo: Tipo }) {
  return (
    <section className={estilos.leyenda} aria-label="Leyenda de las lámparas">
      <dl className={estilos.lista}>
        {entradas[tipo].map((entrada) => (
          <div key={entrada.valor} className={estilos.entrada}>
            <dt>
              <LamparaEstado valor={entrada.valor} />
            </dt>
            <dd>{entrada.significado}</dd>
          </div>
        ))}
        {tipo === 'matriz' && (
          <div className={estilos.entrada}>
            <dt className={estilos.rampa}>
              {([0, 1, 2, 3, 4] as const).map((nivel) => (
                <RampaMadurez key={nivel} nivel={nivel} />
              ))}
            </dt>
            <dd>Madurez de 0 a 4, de apagada a plena</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
