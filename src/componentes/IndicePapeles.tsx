import { FlagPennantIcon, SealCheckIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useLegajo } from '../estado/LegajoProvider'
import estilos from './IndicePapeles.module.css'

type Entrada = { letra: string; titulo: string }

const gruposDePapeles: { fase: string; papeles: Entrada[] }[] = [
  { fase: 'Sumaria', papeles: [{ letra: 'S', titulo: 'Cédula sumaria' }] },
  {
    fase: 'Planificar',
    papeles: [
      { letra: 'A', titulo: 'Riesgos R-CONF' },
      { letra: 'B', titulo: 'Tareas del DBA' },
    ],
  },
  { fase: 'Hacer', papeles: [{ letra: 'C', titulo: 'Mapeo de controles' }] },
  {
    fase: 'Verificar',
    papeles: [
      { letra: 'D', titulo: 'Controles observables' },
      { letra: 'E', titulo: 'Matriz de evaluación' },
      { letra: 'F', titulo: 'Batería de pruebas' },
    ],
  },
  { fase: 'Actuar', papeles: [{ letra: 'G', titulo: 'Hallazgos y plan' }] },
  {
    fase: 'Soporte',
    papeles: [
      { letra: 'H', titulo: 'Marco teórico' },
      { letra: 'I', titulo: 'Uso de IA' },
      { letra: 'J', titulo: 'Referencias' },
    ],
  },
]

const letras = gruposDePapeles.flatMap((grupo) => grupo.papeles.map((papel) => papel.letra))

export function IndicePapeles() {
  const { firmas, ultimoPapel } = useLegajo()
  const [actual, setActual] = useState('S')

  useEffect(() => {
    const secciones = letras
      .map((letra) => document.getElementById(`papel-${letra.toLowerCase()}`))
      .filter((elemento): elemento is HTMLElement => elemento !== null)
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.find((entrada) => entrada.isIntersecting)
        if (visible) setActual(visible.target.id.replace('papel-', '').toUpperCase())
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    secciones.forEach((seccion) => observador.observe(seccion))
    return () => observador.disconnect()
  }, [])

  const firmados = Object.keys(firmas).length

  return (
    <nav className={estilos.indice} aria-label="Índice de papeles de trabajo">
      <p className={estilos.titulo}>Índice del legajo</p>
      <div className={estilos.grupos}>
        {gruposDePapeles.map((grupo) => (
          <div key={grupo.fase} className={estilos.grupo}>
            <p className={estilos.fase}>{grupo.fase}</p>
            <ul className={estilos.lista}>
              {grupo.papeles.map((papel) => {
                const firmado = firmas[papel.letra] !== undefined
                const quedo = ultimoPapel === papel.letra && papel.letra !== 'S'
                return (
                  <li key={papel.letra}>
                    <a
                      href={`#papel-${papel.letra.toLowerCase()}`}
                      className={estilos.enlace}
                      aria-current={actual === papel.letra ? 'location' : undefined}
                    >
                      <span className={estilos.letra}>
                        {papel.letra}
                        <svg className={estilos.circulo} viewBox="0 0 40 32" aria-hidden="true">
                          <path d="M21 3.5 C 31 3, 37.5 9, 36.5 16.5 C 35.5 25, 27 29.5, 18.5 28.8 C 9 28, 3 22.5, 3.6 15.2 C 4.3 7.8, 11.5 3.2, 23.5 4.8" pathLength={1} />
                        </svg>
                      </span>
                      <span className={estilos.nombre}>{papel.titulo}</span>
                      {firmado && <SealCheckIcon className={estilos.sello} weight="bold" aria-label="Firmado" />}
                      {quedo && !firmado && <FlagPennantIcon className={estilos.bandera} weight="fill" aria-label="Aquí quedó la última lectura" />}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className={estilos.pie}>
        {firmados === 0 ? 'Ningún papel firmado' : `${firmados} de ${letras.length} papeles firmados`}
      </p>
    </nav>
  )
}
