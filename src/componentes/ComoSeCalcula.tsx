import { formatoNumero, formatoPuntuacion, puntajePorCaso, puntajeProporcion, puntajeVigencia } from '../estado/medicion'
import estilos from './ComoSeCalcula.module.css'
import { Lampara } from './Lampara'

const reglas = [
  {
    nombre: 'Proporción',
    cuando: 'Importa el tamaño de la base.',
    ejemplo: `La medición vale ${formatoPuntuacion(puntajeProporcion(3, 6, 20, 0.9))} si 3 de 6 cuentas leen datos sensibles sin justificación, y ${formatoPuntuacion(puntajeProporcion(3, 1500, 20, 0.9))} si son 3 de ${formatoNumero(1500)}.`,
  },
  {
    nombre: 'Por caso',
    cuando: 'Una sola vez ya es grave, sin importar el tamaño.',
    ejemplo: `La medición vale ${formatoPuntuacion(puntajePorCaso(1, 0.5))} con 1 administrador sin autorizar y ${formatoPuntuacion(puntajePorCaso(2, 0.5))} con 2, sin importar cuántas cuentas tenga la base.`,
  },
  {
    nombre: 'Vigencia',
    cuando: 'Importa cuánto tiempo pasó.',
    ejemplo: `Con un objetivo de 7 días, un respaldo de 7 días vale ${formatoPuntuacion(puntajeVigencia(7, 7, 3))}, uno de 14 vale ${formatoPuntuacion(puntajeVigencia(14, 7, 3))} y uno de 21 vale ${formatoPuntuacion(puntajeVigencia(21, 7, 3))}.`,
  },
  {
    nombre: 'Cobertura',
    cuando: 'Se compara lo conservado con lo exigido.',
    ejemplo: 'Con medio año de auditoría frente a un año exigido, vale 0,50.',
  },
  {
    nombre: 'Alcance',
    cuando: 'Un dato de sus registros se compara con el total real.',
    ejemplo: 'Con 10 cuentas activas, las opciones son Todas (10), La mayoría (más de 5), La mitad (5), Menos de la mitad (menos de 5) y Ninguna (0).',
  },
  {
    nombre: 'Valor exacto, respuesta y lista',
    cuando: 'El resultado es un estado, una configuración o un dato de sus registros.',
    ejemplo: 'Cada estado del almacén de claves, parámetro de sqlnet.ora o respuesta como «Hace menos de 3 meses» tiene sus puntos.',
  },
]

export function ComoSeCalcula() {
  return (
    <details className={estilos.explicacion} open>
      <summary className={estilos.resumen}>Cómo se calcula cuánto vale cada control</summary>
      <div className={estilos.cuerpo}>
        <ol className={estilos.pasos}>
          <li>
            <strong>Usted mide.</strong> Cada control tiene una sola evidencia. Abra la fila, ejecute su consulta, escriba los valores de la fila que devuelve y complete las pocas respuestas que salen de sus registros. La consulta se copia tal como está; si depende de los nombres de su organización, la evidencia indica qué cambiar.
          </li>
          <li>
            <strong>Cada medición recibe un puntaje de 0 a 1.</strong> La evidencia reúne varias mediciones, cada una con su propia regla, y siempre verá el cálculo con sus datos.
          </li>
          <li>
            <strong>El control suma peso × puntaje.</strong> Las mediciones que la norma trata como centrales pesan más. Si una medición es crítica, el control no puede valer más que ella.
          </li>
        </ol>

        <table className={estilos.tabla}>
          <caption className="solo-lectores">Reglas de puntaje y ejemplos</caption>
          <thead>
            <tr>
              <th scope="col">Regla</th>
              <th scope="col">Se usa cuando</th>
              <th scope="col">Ejemplo</th>
            </tr>
          </thead>
          <tbody>
            {reglas.map((regla) => (
              <tr key={regla.nombre}>
                <th scope="row" data-etiqueta="Regla">{regla.nombre}</th>
                <td data-etiqueta="Se usa cuando">{regla.cuando}</td>
                <td data-etiqueta="Ejemplo">{regla.ejemplo}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={estilos.semaforo}>
          <span><Lampara tono="verde" texto="Verde" /> desde 0,75</span>
          <span><Lampara tono="ambar" texto="Amarillo" /> de 0,50 a menos de 0,75</span>
          <span><Lampara tono="roja" texto="Rojo" /> menos de 0,50</span>
        </div>

        <p className={estilos.nota}>
          La madurez no entra en este cálculo: la puntuación solo sugiere un nivel, que usted confirma. ISO/IEC 27002:2022 no asigna puntajes. La norma indica qué revisar y cada medición cita su apartado, pero los pesos, tolerancias y topes son criterio de esta aplicación.
        </p>
      </div>
    </details>
  )
}
