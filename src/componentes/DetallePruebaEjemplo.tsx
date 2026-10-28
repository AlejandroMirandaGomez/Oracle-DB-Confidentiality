import type { PruebaEjemplo } from '../data/tipos'
import { evidenciaDe, rutaDeScript, scriptDe } from '../recursos'
import { BloqueCodigo } from './BloqueCodigo'
import { Campo, Rejilla } from './Campo'
import estilos from './DetallePrueba.module.css'
import { LamparaEstado } from './Lampara'
import { ListaRefs } from './Ref'

export function DetallePruebaEjemplo({ prueba }: { prueba: PruebaEjemplo }) {
  const script = scriptDe(prueba.script)
  const evidencia = evidenciaDe(prueba.evidencia)
  return (
    <>
      <p className={estilos.entrada}>{prueba.objetivo}</p>
      <Rejilla>
        <Campo etiqueta="Tipo">{prueba.tipo}</Campo>
        <Campo etiqueta="Herramienta">{prueba.herramienta}</Campo>
        <Campo etiqueta="Procedimiento" ancho>
          <ol>
            {prueba.procedimiento.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </Campo>
        <Campo etiqueta="Resultado esperado">{prueba.resultadoEsperado}</Campo>
        <Campo etiqueta="Resultado obtenido">{prueba.resultadoObtenido}</Campo>
        <Campo etiqueta="Veredicto">
          <LamparaEstado valor={prueba.veredicto} />
        </Campo>
        <Campo etiqueta="Controles observables">
          <ListaRefs ids={prueba.controles} />
        </Campo>
      </Rejilla>
      {script && (
        <div className={estilos.bloque}>
          <BloqueCodigo codigo={script} titulo={rutaDeScript(prueba.script)} />
        </div>
      )}
      {evidencia && (
        <div className={estilos.bloque}>
          <BloqueCodigo codigo={evidencia} titulo={`evidencias/${prueba.evidencia}.txt`} variante="listado" />
        </div>
      )}
    </>
  )
}
