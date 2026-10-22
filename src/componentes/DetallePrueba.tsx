import type { ReactNode } from 'react'
import type { Prueba, RespuestaPrueba } from '../data/tipos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { BloqueCodigo } from './BloqueCodigo'
import { BotoneraEstado } from './BotoneraEstado'
import { Campo, Rejilla } from './Campo'
import estilos from './DetallePrueba.module.css'
import { LamparaEstado } from './Lampara'
import { ListaRefs } from './Ref'

const opcionesPrueba = ['Conforme', 'Parcial', 'No conforme'] as const

function Paso({ numero, titulo, children }: { numero: number; titulo: string; children: ReactNode }) {
  return (
    <li className={estilos.paso}>
      <h3 className={estilos.tituloPaso}>
        <span className={estilos.numero}>{numero}</span>
        {titulo}
      </h3>
      <div className={estilos.contenidoPaso}>{children}</div>
    </li>
  )
}

export function DetallePrueba({ prueba }: { prueba: Prueba }) {
  const { respuestaPrueba, fijarRespuestaPrueba } = useEvaluacion()
  const registro = respuestaPrueba(prueba.id)
  return (
    <>
      <p className={estilos.entrada}>{prueba.objetivo}</p>
      <Rejilla>
        <Campo etiqueta="Tipo">{prueba.tipo}</Campo>
        <Campo etiqueta="Herramienta">{prueba.herramienta}</Campo>
        <Campo etiqueta="Controles que respalda" ancho>
          <ListaRefs ids={prueba.controles} conNombre />
        </Campo>
      </Rejilla>
      <ol className={estilos.pasos}>
        <Paso numero={1} titulo="Procedimiento">
          <ol className={estilos.procedimiento}>
            {prueba.procedimiento.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </Paso>
        <Paso numero={2} titulo="Ejecución">
          <BloqueCodigo codigo={prueba.sql} titulo={prueba.lenguaje} />
        </Paso>
        <Paso numero={3} titulo="Resultado esperado">
          <p>{prueba.resultadoEsperado}</p>
        </Paso>
        <Paso numero={4} titulo="Resultado observado">
          <div className={estilos.veredicto}>
            <LamparaEstado valor={registro.respuesta ?? 'Sin documentar'} />
          </div>
          <BotoneraEstado<RespuestaPrueba>
            etiqueta={`Resultado de ${prueba.id}`}
            opciones={opcionesPrueba}
            valor={registro.respuesta}
            alCambiar={(respuesta) => fijarRespuestaPrueba(prueba.id, { respuesta })}
            nota={registro.nota}
            alCambiarNota={(nota) => fijarRespuestaPrueba(prueba.id, { nota })}
            etiquetaNota="Resultado observado"
          />
        </Paso>
      </ol>
    </>
  )
}
