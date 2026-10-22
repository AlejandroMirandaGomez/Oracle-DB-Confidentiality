import { useContext } from 'react'
import { modeloDeControl } from '../data/catalogo/madurez'
import { nivelesMadurez } from '../data/catalogo/escalas'
import type { Control } from '../data/tipos'
import { BloquesNorma } from './BloquesNorma'
import { Campo, Rejilla } from './Campo'
import { DentroDeHoja } from './contextoHoja'
import estilos from './InformacionNorma.module.css'
import { RampaMadurez } from './RampaMadurez'
import { Subtitulo } from './Subtitulo'

export function InformacionNorma({ control }: { control: Control }) {
  const enHoja = useContext(DentroDeHoja)
  const { norma } = control
  return (
    <section className={estilos.seccion} aria-label={`Lo que dice la norma en ${control.id}`}>
      <Subtitulo>Lo que dice la norma</Subtitulo>
      <p className={estilos.fuente}>
        ISO/IEC 27002:2022, apartado {norma.fuente.apartado}, páginas {norma.fuente.paginasPdf} del PDF ({norma.fuente.paginasImpresas} impresas).
      </p>
      <Rejilla>
        <Campo etiqueta="Descripción" ancho>
          {norma.descripcion}
        </Campo>
        <Campo etiqueta="Concepto de ciberseguridad">{norma.conceptos.join(', ')}</Campo>
        <Campo etiqueta="Dominio de seguridad">{norma.dominios.join(', ')}</Campo>
      </Rejilla>
      <details className={estilos.desplegable} open={!enHoja}>
        <summary>Guía del control</summary>
        <BloquesNorma bloques={norma.guia} />
      </details>
      <details className={estilos.desplegable} open={!enHoja}>
        <summary>Otra información</summary>
        <BloquesNorma bloques={norma.otraInformacion} />
      </details>
    </section>
  )
}

export function MapeoCobit({ control }: { control: Control }) {
  const modelo = modeloDeControl(control)
  const { cobit } = control
  return (
    <section className={estilos.seccion} aria-label={`Madurez según COBIT 4.1 en ${control.id}`}>
      <Subtitulo>Madurez según COBIT 4.1</Subtitulo>
      <Rejilla>
        <Campo etiqueta="Objetivo de control" ancho>
          <span className={estilos.objetivo}>{cobit.objetivo}</span> {cobit.nombre}
        </Campo>
        <Campo etiqueta="Por qué se parece" ancho>
          {cobit.motivo}
        </Campo>
        <Campo etiqueta="Modelo de madurez" ancho>
          <span className={estilos.objetivo}>{modelo.id}</span> {modelo.nombre}, área {modelo.area}. Página {modelo.paginaImpresa} impresa, {modelo.paginaPdf} del PDF de COBIT.
        </Campo>
        <Campo etiqueta="Qué significa cada nivel en este control" ancho>
          <ul className={estilos.niveles}>
            {nivelesMadurez.map((nivel) => (
              <li key={nivel.nivel}>
                <RampaMadurez nivel={nivel.nivel} control={control.id} conNombre />
              </li>
            ))}
          </ul>
          <span className={estilos.ayuda}>Pase el cursor o enfoque cada nivel para leer su definición en este control.</span>
        </Campo>
      </Rejilla>
    </section>
  )
}
