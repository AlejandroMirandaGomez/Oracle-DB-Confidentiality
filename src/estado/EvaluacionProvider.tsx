import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { matriz } from '../data/catalogo/matriz'
import { pruebas } from '../data/catalogo/pruebas'
import type {
  NivelEvaluado,
  Niveles,
  RegistroEvidencia,
  RegistroPrueba,
  RespuestasEvidencia,
  RespuestasPruebas,
} from '../data/tipos'
import {
  construirArchivo,
  hayDatosDeEvaluacion,
  nombreArchivoEvaluacion,
  sanearNiveles,
  sanearOrganizacion,
  sanearRespuestasEvidencia,
  sanearRespuestasPruebas,
  validarArchivo,
  type Evaluacion,
} from './archivoEvaluacion'
import { guardarAlmacen, leerAlmacen } from './almacen'
import { ContextoEvaluacion, type Progreso, type ResultadoImportacion, type ValorEvaluacion } from './contextoEvaluacion'
import { generarHallazgos } from './hallazgos'
import { escribirHistorial, inicializarHistorialCliente, leerHistorial } from './historial'

const registroVacioEvidencia: RegistroEvidencia = { respuesta: null, nota: '' }
const registroVacioPrueba: RegistroPrueba = { respuesta: null, nota: '' }

const totalDeEvidencias = new Map(matriz.map((fila) => [fila.id, fila.evidenciasRequeridas.length]))

function nombreDeSesion(nombre: unknown): string {
  const limpio = sanearOrganizacion(nombre).trim()
  return limpio.toLocaleLowerCase('es') === 'cliente' ? 'Cliente' : limpio
}

export function EvaluacionProvider({ children }: { children: ReactNode }) {
  const [organizacion, setOrganizacion] = useState(() => nombreDeSesion(leerAlmacen<unknown>('organizacion', 'Cliente')))
  const [niveles, setNiveles] = useState<Niveles>(() => sanearNiveles(leerAlmacen<unknown>('niveles', {})))
  const [respuestasEvidencia, setRespuestasEvidencia] = useState<RespuestasEvidencia>(() =>
    sanearRespuestasEvidencia(leerAlmacen<unknown>('evidencias', {})),
  )
  const [respuestasPruebas, setRespuestasPruebas] = useState<RespuestasPruebas>(() =>
    sanearRespuestasPruebas(leerAlmacen<unknown>('pruebas', {})),
  )
  const [pasosVistos, setPasosVistos] = useState<string[]>(() => leerAlmacen<string[]>('pasos-vistos', []))
  const [historial, setHistorial] = useState(() => {
    const guardados = leerHistorial()
    return organizacion === 'Cliente' ? inicializarHistorialCliente(guardados) : guardados
  })
  const [pila, setPila] = useState<string[]>([])
  const [direccion, setDireccion] = useState<1 | -1>(1)

  useEffect(() => guardarAlmacen('organizacion', organizacion), [organizacion])
  useEffect(() => guardarAlmacen('niveles', niveles), [niveles])
  useEffect(() => guardarAlmacen('evidencias', respuestasEvidencia), [respuestasEvidencia])
  useEffect(() => guardarAlmacen('pruebas', respuestasPruebas), [respuestasPruebas])
  useEffect(() => guardarAlmacen('pasos-vistos', pasosVistos), [pasosVistos])

  const fijarOrganizacion = useCallback((nombre: string) => {
    const siguiente = nombreDeSesion(nombre)
    setOrganizacion(siguiente)
    if (siguiente === 'Cliente') {
      const inicializado = inicializarHistorialCliente(historial)
      if (inicializado !== historial) setHistorial(inicializado)
    }
  }, [historial])

  const nivelDe = useCallback((filaId: string): NivelEvaluado => niveles[filaId] ?? null, [niveles])

  const fijarNivel = useCallback((filaId: string, nivel: NivelEvaluado) => {
    setNiveles((previos) => {
      const siguientes = { ...previos }
      if (nivel === null) delete siguientes[filaId]
      else siguientes[filaId] = nivel
      return siguientes
    })
  }, [])

  const respuestaEvidencia = useCallback(
    (filaId: string, evidenciaId: string): RegistroEvidencia => respuestasEvidencia[filaId]?.[evidenciaId] ?? registroVacioEvidencia,
    [respuestasEvidencia],
  )

  const fijarRespuestaEvidencia = useCallback((filaId: string, evidenciaId: string, cambios: Partial<RegistroEvidencia>) => {
    setRespuestasEvidencia((previas) => {
      const actual = previas[filaId]?.[evidenciaId] ?? registroVacioEvidencia
      const siguiente: RegistroEvidencia = { respuesta: cambios.respuesta === undefined ? actual.respuesta : cambios.respuesta, nota: cambios.nota ?? actual.nota }
      const deLaFila = { ...previas[filaId] }
      if (siguiente.respuesta === null && siguiente.nota === '') delete deLaFila[evidenciaId]
      else deLaFila[evidenciaId] = siguiente
      const resultado = { ...previas }
      if (Object.keys(deLaFila).length === 0) delete resultado[filaId]
      else resultado[filaId] = deLaFila
      return resultado
    })
  }, [])

  const respuestaPrueba = useCallback((pruebaId: string): RegistroPrueba => respuestasPruebas[pruebaId] ?? registroVacioPrueba, [respuestasPruebas])

  const fijarRespuestaPrueba = useCallback((pruebaId: string, cambios: Partial<RegistroPrueba>) => {
    setRespuestasPruebas((previas) => {
      const actual = previas[pruebaId] ?? registroVacioPrueba
      const siguiente: RegistroPrueba = { respuesta: cambios.respuesta === undefined ? actual.respuesta : cambios.respuesta, nota: cambios.nota ?? actual.nota }
      const resultado = { ...previas }
      if (siguiente.respuesta === null && siguiente.nota === '') delete resultado[pruebaId]
      else resultado[pruebaId] = siguiente
      return resultado
    })
  }, [])

  const limpiarMatriz = useCallback(() => {
    setNiveles({})
    setRespuestasEvidencia({})
  }, [])

  const limpiarBateria = useCallback(() => setRespuestasPruebas({}), [])

  const limpiarAvance = useCallback(() => {
    setNiveles({})
    setRespuestasEvidencia({})
    setRespuestasPruebas({})
    setPasosVistos([])
  }, [])

  const evaluacionActual = useMemo<Evaluacion>(
    () => ({ organizacion, niveles, respuestasEvidencia, respuestasPruebas }),
    [organizacion, niveles, respuestasEvidencia, respuestasPruebas],
  )

  const exportarEvaluacion = useCallback(() => {
    const ahora = new Date()
    const archivo = new Blob([JSON.stringify(construirArchivo(evaluacionActual, ahora), null, 2)], { type: 'application/json' })
    const enlace = document.createElement('a')
    enlace.href = URL.createObjectURL(archivo)
    enlace.download = nombreArchivoEvaluacion(organizacion, ahora)
    enlace.click()
    URL.revokeObjectURL(enlace.href)
  }, [evaluacionActual, organizacion])

  const importarEvaluacion = useCallback(async (archivo: File): Promise<ResultadoImportacion> => {
    let texto: string
    try {
      texto = await archivo.text()
    } catch {
      return { ok: false, mensaje: 'No se pudo leer el archivo. Vuelva a elegirlo o descargue otra copia de la evaluación.' }
    }
    const resultado = validarArchivo(texto)
    if (!resultado.ok) return resultado
    const { evaluacion, resumen } = resultado
    return {
      ok: true,
      resumen,
      aplicar: () => {
        fijarOrganizacion(evaluacion.organizacion)
        setNiveles(evaluacion.niveles)
        setRespuestasEvidencia(evaluacion.respuestasEvidencia)
        setRespuestasPruebas(evaluacion.respuestasPruebas)
      },
    }
  }, [fijarOrganizacion])

  const hayDatos = useMemo(() => hayDatosDeEvaluacion(evaluacionActual), [evaluacionActual])

  const progresoMatriz = useMemo<Progreso>(
    () => ({ hechas: matriz.filter((fila) => niveles[fila.id] !== undefined).length, total: matriz.length }),
    [niveles],
  )
  const progresoBateria = useMemo<Progreso>(
    () => ({ hechas: pruebas.filter((prueba) => (respuestasPruebas[prueba.id]?.respuesta ?? null) !== null).length, total: pruebas.length }),
    [respuestasPruebas],
  )
  const matrizCompleta = progresoMatriz.hechas === progresoMatriz.total
  const bateriaCompleta = progresoBateria.hechas === progresoBateria.total

  const guardarEvaluacion = useCallback(() => {
    if (!matrizCompleta) return { ok: false as const, mensaje: 'Complete las 18 filas de la matriz antes de guardar la evaluación.' }
    const registro = { id: crypto.randomUUID(), fechaGuardado: new Date().toISOString(), evaluacion: evaluacionActual }
    const siguientes = [registro, ...historial]
    const resultado = escribirHistorial(siguientes)
    if (resultado.ok) setHistorial(siguientes)
    return resultado
  }, [matrizCompleta, evaluacionActual, historial])

  const restaurarEvaluacion = useCallback((id: string) => {
    const registro = historial.find((item) => item.id === id)
    if (!registro) return false
    fijarOrganizacion(registro.evaluacion.organizacion)
    setNiveles(registro.evaluacion.niveles)
    setRespuestasEvidencia(registro.evaluacion.respuestasEvidencia)
    setRespuestasPruebas(registro.evaluacion.respuestasPruebas)
    return true
  }, [historial, fijarOrganizacion])

  const eliminarEvaluacion = useCallback((id: string) => {
    const siguientes = historial.filter((item) => item.id !== id)
    const resultado = escribirHistorial(siguientes)
    if (resultado.ok) setHistorial(siguientes)
    return resultado
  }, [historial])

  const progresoEvidencias = useCallback(
    (filaId: string): Progreso => {
      const respuestas = Object.values(respuestasEvidencia[filaId] ?? {})
      return { hechas: respuestas.filter((registro) => registro.respuesta !== null).length, total: totalDeEvidencias.get(filaId) ?? 0 }
    },
    [respuestasEvidencia],
  )

  const hallazgos = useMemo(
    () => (matrizCompleta ? generarHallazgos(niveles, respuestasEvidencia, respuestasPruebas) : []),
    [matrizCompleta, niveles, respuestasEvidencia, respuestasPruebas],
  )

  const marcarPasoVisto = useCallback((paso: string) => {
    setPasosVistos((previos) => (previos.includes(paso) ? previos : [...previos, paso]))
  }, [])

  const abrirReferencia = useCallback((id: string) => {
    setDireccion(1)
    setPila([id])
  }, [])

  const seguirReferencia = useCallback((id: string) => {
    setDireccion(1)
    setPila((previa) => {
      const posicion = previa.indexOf(id)
      if (posicion >= 0) return previa.slice(0, posicion + 1)
      return [...previa, id]
    })
  }, [])

  const volverA = useCallback((indice: number) => {
    setDireccion(-1)
    setPila((previa) => previa.slice(0, indice + 1))
  }, [])

  const cerrarHoja = useCallback(() => setPila([]), [])

  const valor = useMemo<ValorEvaluacion>(
    () => ({
      organizacion,
      fijarOrganizacion,
      nivelDe,
      fijarNivel,
      respuestaEvidencia,
      fijarRespuestaEvidencia,
      respuestaPrueba,
      fijarRespuestaPrueba,
      limpiarMatriz,
      limpiarBateria,
      limpiarAvance,
      exportarEvaluacion,
      importarEvaluacion,
      historial,
      guardarEvaluacion,
      restaurarEvaluacion,
      eliminarEvaluacion,
      hayDatos,
      matrizCompleta,
      bateriaCompleta,
      progresoMatriz,
      progresoBateria,
      progresoEvidencias,
      hallazgos,
      pasosVistos,
      marcarPasoVisto,
      pila,
      direccion,
      abrirReferencia,
      seguirReferencia,
      volverA,
      cerrarHoja,
    }),
    [
      organizacion,
      fijarOrganizacion,
      nivelDe,
      fijarNivel,
      respuestaEvidencia,
      fijarRespuestaEvidencia,
      respuestaPrueba,
      fijarRespuestaPrueba,
      limpiarMatriz,
      limpiarBateria,
      limpiarAvance,
      exportarEvaluacion,
      importarEvaluacion,
      historial,
      guardarEvaluacion,
      restaurarEvaluacion,
      eliminarEvaluacion,
      hayDatos,
      matrizCompleta,
      bateriaCompleta,
      progresoMatriz,
      progresoBateria,
      progresoEvidencias,
      hallazgos,
      pasosVistos,
      marcarPasoVisto,
      pila,
      direccion,
      abrirReferencia,
      seguirReferencia,
      volverA,
      cerrarHoja,
    ],
  )

  return <ContextoEvaluacion.Provider value={valor}>{children}</ContextoEvaluacion.Provider>
}
