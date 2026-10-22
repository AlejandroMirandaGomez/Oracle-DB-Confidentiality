import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Detalle } from '../componentes/Detalles'
import { Papel } from '../componentes/Papel'
import { controles } from '../data/controles'
import estilos from './PapelControles.module.css'

const grupos = [
  { titulo: 'Controles pedidos por el enunciado', complementario: false },
  { titulo: 'Complementarios elegidos por criterio propio', complementario: true },
]

export function PapelControles() {
  const [seleccion, setSeleccion] = useState('A5.12')
  const reducir = useReducedMotion() ?? false
  const control = controles.find((item) => item.id === seleccion) ?? controles[0]

  return (
    <Papel
      letra="C"
      titulo="Mapeo de controles ISO/IEC 27001:2022"
      objetivo="Los 15 controles del Anexo A que pide el enunciado y tres complementarios, cada uno con su justificación para el DBA, su implementación en Oracle 21c XE y la evidencia que un auditor puede observar."
    >
      <div className={estilos.composicion}>
        <nav className={estilos.indice} aria-label="Controles">
          {grupos.map((grupo) => (
            <div key={grupo.titulo} className={estilos.grupo}>
              <h3 className={estilos.grupoTitulo}>{grupo.titulo}</h3>
              <ul className={estilos.lista}>
                {controles
                  .filter((item) => item.complementario === grupo.complementario)
                  .map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={estilos.opcion}
                        aria-current={item.id === seleccion ? 'true' : undefined}
                        onClick={() => setSeleccion(item.id)}
                      >
                        <span className={estilos.id}>{item.id}</span>
                        <span className={estilos.nombre}>{item.nombre}</span>
                        <span className={estilos.propiedades} aria-label={`Propiedades ${item.propiedades.join(', ')}`}>
                          {(['C', 'I', 'D'] as const).map((propiedad) => (
                            <span key={propiedad} data-marcada={item.propiedades.includes(propiedad) || undefined}>
                              {propiedad}
                            </span>
                          ))}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>

        {control && (
          <div className={estilos.detalle} aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={control.id}
                initial={reducir ? { opacity: 0 } : { opacity: 0, transform: 'translateY(6px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)', transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <h3 className={estilos.titulo}>
                  <span className={estilos.tituloId}>{control.id}</span>
                  {control.nombre}
                </h3>
                <Detalle entidad={{ tipo: 'control', dato: control }} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </Papel>
  )
}
