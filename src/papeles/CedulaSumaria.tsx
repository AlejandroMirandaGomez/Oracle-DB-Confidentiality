import { useState } from 'react'
import { BandaPuntaje } from '../componentes/BandaPuntaje'
import { Marca } from '../componentes/Marca'
import { ListaRefs } from '../componentes/Ref'
import { riesgos } from '../data/riesgos'
import { conteoDeEstados, conteoDeMatriz, conteoDeVeredictos, valorarRiesgo } from '../estado/calculos'
import { filasDeRiesgo, pruebasDeRiesgo } from '../estado/indice'
import { useLegajo } from '../estado/LegajoProvider'
import { Papel } from '../componentes/Papel'
import estilos from './CedulaSumaria.module.css'

export function CedulaSumaria() {
  const { nivelDe, abrirReferencia } = useLegajo()
  const [activo, setActivo] = useState<string | null>(null)
  const matriz = conteoDeMatriz(nivelDe)
  const veredictos = conteoDeVeredictos()

  return (
    <Papel
      letra="S"
      titulo="Cédula sumaria de trazabilidad"
      objetivo="Cada riesgo con sus tareas, controles y pruebas. Toque una referencia azul para seguir la cadena."
    >
      <p className={estilos.resumen}>
        La matriz evalúa <strong>18 filas</strong>:{' '}
        <span className={estilos.cifra}>
          <Marca valor="Cumple" conTexto={false} /> {matriz.Cumple} {matriz.Cumple === 1 ? 'cumple' : 'cumplen'}
        </span>
        ,{' '}
        <span className={estilos.cifra}>
          <Marca valor="Parcial" conTexto={false} /> {matriz.Parcial} {matriz.Parcial === 1 ? 'cumple' : 'cumplen'} en parte
        </span>{' '}
        y{' '}
        <span className={estilos.cifra}>
          <Marca valor="No cumple" conTexto={false} /> {matriz['No cumple']} no {matriz['No cumple'] === 1 ? 'cumple' : 'cumplen'}
        </span>
        . <strong>23 pruebas</strong>: {veredictos.Conforme} conformes, {veredictos.Parcial} parciales, {veredictos['No conforme']} no conformes.
      </p>

      <div className={estilos.marco}>
        <table className={estilos.tabla}>
          <caption className="solo-lectores">Trazabilidad de los cinco riesgos de confidencialidad</caption>
          <thead>
            <tr>
              <th scope="col">Riesgo</th>
              <th scope="col" className={estilos.num}>
                Inherente
              </th>
              <th scope="col" className={estilos.num}>
                Residual
              </th>
              <th scope="col">Tareas</th>
              <th scope="col">Controles</th>
              <th scope="col">Pruebas</th>
              <th scope="col">Matriz</th>
            </tr>
          </thead>
          <tbody>
            {riesgos.map((riesgo) => {
              const valoracion = valorarRiesgo(riesgo, nivelDe)
              const filas = filasDeRiesgo(riesgo.id).map((fila) => fila.id)
              const estados = conteoDeEstados(filas, nivelDe)
              const encendido = activo === riesgo.id
              return (
                <tr
                  key={riesgo.id}
                  className={estilos.fila}
                  data-activo={encendido || undefined}
                  data-atenuado={activo !== null && !encendido ? true : undefined}
                  onMouseEnter={() => setActivo(riesgo.id)}
                  onMouseLeave={() => setActivo(null)}
                  onFocus={() => setActivo(riesgo.id)}
                  onBlur={(evento) => {
                    if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) setActivo(null)
                  }}
                >
                  <th scope="row" className={estilos.riesgo}>
                    <button type="button" className={estilos.abrir} onClick={() => abrirReferencia(riesgo.id)}>
                      <span className={estilos.id}>{riesgo.id}</span>
                      <span className={estilos.nombre}>{riesgo.nombre}</span>
                    </button>
                  </th>
                  <td className={estilos.num} data-etiqueta="Inherente">
                    <BandaPuntaje puntaje={valoracion.inherente} />
                  </td>
                  <td className={estilos.num} data-etiqueta="Residual">
                    <BandaPuntaje puntaje={valoracion.residual} />
                  </td>
                  <td data-etiqueta="Tareas">
                    <ListaRefs ids={riesgo.tareas} resaltado={encendido} />
                  </td>
                  <td data-etiqueta="Controles">
                    <ListaRefs ids={riesgo.controles} resaltado={encendido} />
                  </td>
                  <td data-etiqueta="Pruebas">
                    <ListaRefs ids={pruebasDeRiesgo(riesgo.id)} resaltado={encendido} />
                  </td>
                  <td data-etiqueta="Matriz">
                    <span className={estilos.estados}>
                      {estados.Cumple > 0 && (
                        <span>
                          <Marca valor="Cumple" conTexto={false} />
                          {estados.Cumple}
                        </span>
                      )}
                      {estados.Parcial > 0 && (
                        <span>
                          <Marca valor="Parcial" conTexto={false} />
                          {estados.Parcial}
                        </span>
                      )}
                      {estados['No cumple'] > 0 && (
                        <span>
                          <Marca valor="No cumple" conTexto={false} />
                          {estados['No cumple']}
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className={estilos.formula}>
        Residual = inherente × (1 − 0,8 × cobertura), donde la cobertura es el promedio de madurez de las filas de la matriz del riesgo dividido entre 4. Cambiar un nivel en el papel E recalcula esta columna.
      </p>
    </Papel>
  )
}
