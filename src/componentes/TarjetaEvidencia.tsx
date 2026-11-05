import { useId, useState, type ReactNode } from 'react'
import type { CampoMedicion, ConsultaMedicion, EvidenciaRequerida, Medicion, RegistroEvidencia, ReglaMedicion, ValorMedicion } from '../data/tipos'
import { useEvaluacion } from '../estado/contextoEvaluacion'
import { calcularEvidencia, camposDeEvidencia, escalaDeRegla, explicarRegla, formatoPuntuacion, idNingunaCondicion, nombreDeRegla, opcionesDeAlcance, type CalculoControl, type ResultadoMedicion } from '../estado/medicion'
import { saludDePuntuacion } from '../estado/puntuaciones'
import { limpiarDependientes, ordenarCampos, restriccionCampo } from '../estado/validacionMedicion'
import { BloqueCodigo } from './BloqueCodigo'
import { Lampara } from './Lampara'
import estilos from './TarjetaEvidencia.module.css'
import type { Tono } from './tonosLampara'

type Valores = Record<string, ValorMedicion>
type ReglaOpciones = Extract<ReglaMedicion, { tipo: 'opciones' }>
type ReglaLista = Extract<ReglaMedicion, { tipo: 'lista' }>
type ReglaAlcance = Extract<ReglaMedicion, { tipo: 'alcance' }>

const tonoDeSalud: Record<ReturnType<typeof saludDePuntuacion>, Tono> = { Verde: 'verde', Amarillo: 'ambar', Rojo: 'roja' }

const dondeEjecutar: Record<ConsultaMedicion['contenedor'], string> = {
  PDB: 'Ejecute esta consulta conectado a la PDB que guarda los datos, con una cuenta que pueda leer el diccionario, como SYSDBA.',
  CDB$ROOT: 'Ejecute esta consulta conectado a CDB$ROOT, con una cuenta que pueda leer el diccionario, como SYSDBA. Los datos de RMAN no se ven desde la PDB.',
}

export function LamparaMedicion({ resultado }: { resultado: ResultadoMedicion }) {
  if (resultado.estado === 'sin-medir') return <Lampara tono="apagada" texto="Sin medir" />
  if (resultado.estado === 'excluida') return <Lampara tono="apagada" texto="No aplica" />
  return <Lampara tono={tonoDeSalud[saludDePuntuacion(resultado.puntaje)]} texto={formatoPuntuacion(resultado.puntaje)} />
}

function Encabezado({ evidencia, calculo }: { evidencia: EvidenciaRequerida; calculo: CalculoControl }) {
  return (
    <header className={estilos.cabeza}>
      <h4 className={estilos.titulo}>
        <span className={estilos.id}>{evidencia.id}</span>
        <span>{evidencia.nombre}</span>
      </h4>
      {calculo.respondidas === 0 ? <Lampara tono="apagada" texto="Sin medir" /> : <Lampara tono={tonoDeSalud[saludDePuntuacion(calculo.puntuacion)]} texto={formatoPuntuacion(calculo.puntuacion)} />}
    </header>
  )
}

function Paso({ numero, titulo, children }: { numero: number; titulo: string; children: ReactNode }) {
  return (
    <section className={estilos.paso}>
      <h5 className={estilos.tituloPaso}>
        <span className={estilos.numero}>{numero}</span>
        {titulo}
      </h5>
      {children}
    </section>
  )
}

function GuiaConsulta({ consulta }: { consulta: ConsultaMedicion }) {
  const { ajustes } = consulta
  if (!ajustes) return <p className={estilos.instruccion}>Cópiela tal como está: no hay que cambiar nada. Devuelve una sola fila con los datos del paso 2.</p>
  return (
    <div className={estilos.ajustes}>
      <p className={estilos.instruccion}>Devuelve una sola fila con los datos del paso 2. Funciona tal como está; cámbiela solo si su organización usa otros valores en estas partes:</p>
      <ul className={estilos.listaAjustes}>
        {ajustes.map((ajuste) => (
          <li key={ajuste.busque}>
            <code>{ajuste.busque}</code>
            <span>{ajuste.cuando}</span>
          </li>
        ))}
      </ul>
      <p className={estilos.ayuda}>No cambie los nombres que van después de AS: son los datos que se piden en el paso 2.</p>
    </div>
  )
}

function CampoNumerico({ evidencia, campo, valores, alCambiar }: { evidencia: EvidenciaRequerida; campo: CampoMedicion; valores: Valores; alCambiar: (valor: number | null) => void }) {
  const id = useId()
  const [error, fijarError] = useState<string | null>(null)
  const valor = valores[campo.id]
  const restriccion = restriccionCampo(evidencia, campo, valores)
  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.etiqueta}>
        {campo.etiqueta}
      </label>
      <input
        id={id}
        className="control-texto"
        type="number"
        inputMode="numeric"
        min={restriccion.minimo}
        max={restriccion.maximo ?? undefined}
        step={1}
        disabled={restriccion.bloqueado}
        aria-describedby={`${id}-esperado${error ? ` ${id}-error` : ''}`}
        aria-invalid={Boolean(error)}
        value={typeof valor === 'number' ? valor : ''}
        placeholder={restriccion.bloqueado ? `Primero complete ${restriccion.dependeDe?.etiqueta}` : campo.sugerido === undefined ? undefined : String(campo.sugerido)}
        onChange={(evento) => {
          const texto = evento.target.value
          const numero = Number(texto)
          if (texto === '') {
            fijarError(null)
            alCambiar(null)
          } else if (!Number.isSafeInteger(numero) || numero < restriccion.minimo || (restriccion.maximo !== null && numero > restriccion.maximo)) {
            fijarError(restriccion.maximo !== null && numero > restriccion.maximo ? `No puede superar ${restriccion.maximo}.` : restriccion.minimo > 0 && numero < restriccion.minimo ? 'Debe ser mayor que 0.' : 'Use una cantidad completa y no negativa.')
          } else {
            fijarError(null)
            alCambiar(numero)
          }
        }}
      />
      {campo.origen === 'sql' && <p className={estilos.origen}>Columna {campo.id}</p>}
      <p id={`${id}-esperado`} className={estilos.esperado}>El valor esperado: {restriccion.esperado}</p>
      {error && <p id={`${id}-error`} className={estilos.error} role="alert">{error}</p>}
      {campo.ayuda && <p className={estilos.ayuda}>{campo.ayuda}</p>}
    </div>
  )
}

function SelectorOpcion({ regla, valor, alCambiar }: { regla: ReglaOpciones; valor: ValorMedicion | undefined; alCambiar: (valor: string | null) => void }) {
  const id = useId()
  const esDeConsulta = regla.campo.origen === 'sql'
  const mejores = regla.opciones.filter((opcion) => opcion.puntos === Math.max(...regla.opciones.map((item) => item.puntos))).map((opcion) => opcion.valor)
  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.etiqueta}>
        {regla.campo.etiqueta}
      </label>
      <select id={id} className="control-texto" value={typeof valor === 'string' ? valor : ''} onChange={(evento) => alCambiar(evento.target.value === '' ? null : evento.target.value)}>
        <option value="">{esDeConsulta ? 'Elija el resultado' : 'Elija una respuesta'}</option>
        {regla.opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {esDeConsulta ? `${opcion.valor}: ${opcion.texto}` : opcion.texto}
          </option>
        ))}
      </select>
      {esDeConsulta && <p className={estilos.origen}>Columna {regla.campo.id}</p>}
      <p className={estilos.esperado}>El valor esperado: {esDeConsulta ? `${mejores.join(' o ')}.` : `${regla.opciones.find((opcion) => opcion.valor === mejores[0])?.texto}.`}</p>
    </div>
  )
}

function SelectorAlcance({ regla, base, etiquetaBase, valor, alCambiar }: { regla: ReglaAlcance; base: ValorMedicion | undefined; etiquetaBase: string; valor: ValorMedicion | undefined; alCambiar: (valor: string | null) => void }) {
  const id = useId()
  const total = typeof base === 'number' && base > 0 ? base : null
  const opciones = total === null ? [] : opcionesDeAlcance(regla, total)
  const elegida = opciones.some((opcion) => opcion.valor === valor) ? String(valor) : ''
  const indicacion = typeof base !== 'number' ? `Primero escriba ${etiquetaBase}` : base === 0 ? 'No aplica: el total es 0' : 'Elija una respuesta'
  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.etiqueta}>
        {regla.campo.etiqueta}
      </label>
      <select id={id} className="control-texto" disabled={total === null} value={elegida} onChange={(evento) => alCambiar(evento.target.value === '' ? null : evento.target.value)}>
        <option value="">{indicacion}</option>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
      {total !== null && <p className={estilos.ayuda}>De {etiquetaBase.toLowerCase()}: {total}</p>}
      <p className={estilos.esperado}>El valor esperado: {total === null ? regla.todos.toLowerCase() : base === 0 ? 'no aplica.' : `${regla.todos} (${total}).`}</p>
    </div>
  )
}

function ListaCondiciones({ regla, valores, alCambiar }: { regla: ReglaLista; valores: Valores; alCambiar: (valores: Valores) => void }) {
  function sinMarcas(): Valores {
    const siguientes = { ...valores }
    regla.items.forEach((item) => delete siguientes[item.id])
    delete siguientes[idNingunaCondicion]
    return siguientes
  }

  return (
    <fieldset className={estilos.lista}>
      <legend className="solo-lectores">Condiciones que se cumplen</legend>
      {regla.items.map((item) => (
        <label key={item.id} className={estilos.condicion}>
          <input
            type="checkbox"
            checked={valores[item.id] === true}
            onChange={(evento) => {
              const siguientes = { ...valores }
              delete siguientes[idNingunaCondicion]
              if (evento.target.checked) siguientes[item.id] = true
              else delete siguientes[item.id]
              alCambiar(siguientes)
            }}
          />
          <code>{item.texto}</code>
          <span className={estilos.puntos}>+{formatoPuntuacion(item.puntos)}</span>
        </label>
      ))}
      <label className={estilos.condicion}>
        <input
          type="checkbox"
          checked={valores[idNingunaCondicion] === true}
          onChange={(evento) => {
            const siguientes = sinMarcas()
            if (evento.target.checked) siguientes[idNingunaCondicion] = true
            alCambiar(siguientes)
          }}
        />
        <span>Ninguna se cumple</span>
        <span className={estilos.puntos}>{formatoPuntuacion(0)}</span>
      </label>
      <p className={estilos.esperado}>El valor esperado: todas las condiciones cumplidas.</p>
    </fieldset>
  )
}

function Respuesta({ evidencia, valores, alCambiar }: { evidencia: EvidenciaRequerida; valores: Valores; alCambiar: (valores: Valores) => void }) {
  const campos = camposDeEvidencia(evidencia)
  const reglas = evidencia.mediciones.map((medicion) => medicion.regla)
  const opciones = reglas.filter((regla): regla is ReglaOpciones => regla.tipo === 'opciones')
  const listas = reglas.filter((regla): regla is ReglaLista => regla.tipo === 'lista')
  const alcances = reglas.filter((regla): regla is ReglaAlcance => regla.tipo === 'alcance')
  const instrucciones = evidencia.mediciones.flatMap((medicion) => (medicion.instruccion ? [medicion.instruccion] : []))
  const camposDeRegistros = campos.filter((campo) => campo.origen === 'organizacion')
  const opcionesDeRegistros = opciones.filter((regla) => regla.campo.origen === 'organizacion')
  const hayRegistros = camposDeRegistros.length > 0 || opcionesDeRegistros.length > 0 || listas.length > 0 || alcances.length > 0

  function fijar(id: string, valor: ValorMedicion | null) {
    const siguientes = { ...valores }
    if (valor === null) delete siguientes[id]
    else siguientes[id] = valor
    alCambiar(limpiarDependientes(evidencia, siguientes))
  }

  return (
    <div className={estilos.grupos}>
      <div className={estilos.grupo}>
        <p className="rotulo">De la fila que devolvió la consulta</p>
        <div className={estilos.campos}>
          {ordenarCampos(evidencia, campos.filter((campo) => campo.origen === 'sql')).map((campo) => (
            <CampoNumerico key={campo.id} evidencia={evidencia} campo={campo} valores={valores} alCambiar={(valor) => fijar(campo.id, valor)} />
          ))}
          {opciones.filter((regla) => regla.campo.origen === 'sql').map((regla) => (
            <SelectorOpcion key={regla.campo.id} regla={regla} valor={valores[regla.campo.id]} alCambiar={(valor) => fijar(regla.campo.id, valor)} />
          ))}
        </div>
      </div>
      {hayRegistros && (
        <div className={estilos.grupo}>
          <p className="rotulo">De los registros de su organización</p>
          {instrucciones.map((instruccion) => (
            <p key={instruccion} className={estilos.instruccion}>{instruccion}</p>
          ))}
          <div className={estilos.campos}>
            {camposDeRegistros.map((campo) => (
              <CampoNumerico key={campo.id} evidencia={evidencia} campo={campo} valores={valores} alCambiar={(valor) => fijar(campo.id, valor)} />
            ))}
            {alcances.map((regla) => (
              <SelectorAlcance key={regla.campo.id} regla={regla} base={valores[regla.base]} etiquetaBase={campos.find((campo) => campo.id === regla.base)?.etiqueta ?? regla.base} valor={valores[regla.campo.id]} alCambiar={(valor) => fijar(regla.campo.id, valor)} />
            ))}
            {opcionesDeRegistros.map((regla) => (
              <SelectorOpcion key={regla.campo.id} regla={regla} valor={valores[regla.campo.id]} alCambiar={(valor) => fijar(regla.campo.id, valor)} />
            ))}
          </div>
          {listas.map((regla) => (
            <ListaCondiciones key={regla.items[0]?.id} regla={regla} valores={valores} alCambiar={alCambiar} />
          ))}
        </div>
      )}
    </div>
  )
}

function ComoVale({ medicion, resultado }: { medicion: Medicion; resultado: ResultadoMedicion }) {
  return (
    <>
      <p className={estilos.regla}>
        <strong>{nombreDeRegla(medicion.regla)}.</strong> {explicarRegla(medicion.regla)}
      </p>
      {medicion.regla.tipo !== 'lista' && (
        <table className={estilos.escala}>
          <caption className="solo-lectores">Ejemplos de puntaje de {medicion.id}</caption>
          <thead>
            <tr>
              <th scope="col">Resultado</th>
              <th scope="col">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {escalaDeRegla(medicion).map((ejemplo) => (
              <tr key={ejemplo.entrada}>
                <th scope="row">{ejemplo.entrada}</th>
                <td>{formatoPuntuacion(ejemplo.puntaje)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={estilos.desarrollo} aria-live="polite">
        <p className="rotulo">Con sus datos</p>
        {resultado.desarrollo.length === 0 ? (
          <p>Escriba los datos para ver el cálculo.</p>
        ) : (
          <ol>
            {resultado.desarrollo.map((linea) => (
              <li key={linea}>{linea}</li>
            ))}
          </ol>
        )}
        {resultado.aviso && <p className={estilos.aviso}>{resultado.aviso}</p>}
      </div>
    </>
  )
}

function BloqueMedicion({ medicion, resultado }: { medicion: Medicion; resultado: ResultadoMedicion }) {
  return (
    <section className={estilos.medicion}>
      <header className={estilos.cabeza}>
        <h6 className={estilos.tituloMedicion}>
          <span className={estilos.id}>{medicion.id}</span>
          <span>{medicion.nombre}</span>
          {medicion.critica && <span className={estilos.critica}>Crítica</span>}
        </h6>
        <LamparaMedicion resultado={resultado} />
      </header>
      <div className={estilos.contexto}>
        <p className={estilos.pregunta}>{medicion.pregunta}</p>
        <p>{medicion.porque}</p>
        <p className={estilos.cita}>ISO/IEC 27002:2022, {medicion.cita}. Peso en el control: {medicion.peso} %.</p>
      </div>
      <ComoVale medicion={medicion} resultado={resultado} />
    </section>
  )
}

export function TarjetaEvidencia({ filaId, evidencia }: { filaId: string; evidencia: EvidenciaRequerida }) {
  const { respuestaEvidencia, fijarRespuestaEvidencia } = useEvaluacion()
  const idNota = useId()
  const idInforme = useId()
  const registro = respuestaEvidencia(filaId, evidencia.id)
  const calculo = calcularEvidencia(evidencia, registro)
  return (
    <article className={estilos.tarjeta}>
      <Encabezado evidencia={evidencia} calculo={calculo} />
      <p className={estilos.pregunta}>{evidencia.pregunta}</p>
      <Paso numero={1} titulo="Ejecute la consulta">
        <p className={estilos.instruccion}>{dondeEjecutar[evidencia.consulta.contenedor]}</p>
        <BloqueCodigo codigo={evidencia.consulta.codigo} titulo="SQL" />
        <GuiaConsulta consulta={evidencia.consulta} />
      </Paso>
      <Paso numero={2} titulo="Escriba lo que obtuvo">
        <Respuesta evidencia={evidencia} valores={registro.valores} alCambiar={(valores) => fijarRespuestaEvidencia(filaId, evidencia.id, { valores })} />
      </Paso>
      <section className={estilos.informe} aria-labelledby={idInforme}>
        <header className={estilos.cabezaInforme}>
          <h5 id={idInforme} className={estilos.tituloInforme}>
            <span className={estilos.marcaInforme} aria-hidden="true">i</span>
            Cuánto vale cada medición
          </h5>
          <span className={estilos.etiquetaInforme}>Solo informativo</span>
        </header>
        <p className={estilos.avisoInforme}>No hay nada más que responder aquí. Esto se calcula solo con lo que escribió en el paso 2.</p>
        <div className={estilos.mediciones}>
          {calculo.lineas.map(({ medicion, resultado }) => (
            <BloqueMedicion key={medicion.id} medicion={medicion} resultado={resultado} />
          ))}
        </div>
      </section>
      <div className={estilos.nota}>
        <label className="rotulo" htmlFor={idNota}>
          Nota opcional
        </label>
        <textarea id={idNota} className="control-texto" rows={2} value={registro.nota} onChange={(evento) => fijarRespuestaEvidencia(filaId, evidencia.id, { nota: evento.target.value })} />
      </div>
    </article>
  )
}

export function TarjetaEvidenciaGuardada({ evidencia, registro }: { evidencia: EvidenciaRequerida; registro: RegistroEvidencia }) {
  const calculo = calcularEvidencia(evidencia, registro)
  return (
    <article className={estilos.tarjeta}>
      <Encabezado evidencia={evidencia} calculo={calculo} />
      <p className={estilos.pregunta}>{evidencia.pregunta}</p>
      <div className={estilos.mediciones}>
        {calculo.lineas.map(({ medicion, resultado }) => (
          <BloqueMedicion key={medicion.id} medicion={medicion} resultado={resultado} />
        ))}
      </div>
      {registro.nota && <p>{registro.nota}</p>}
    </article>
  )
}
