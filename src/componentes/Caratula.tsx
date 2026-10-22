import { legajo } from '../data/legajo'
import estilos from './Caratula.module.css'

export function Caratula() {
  return (
    <header className={estilos.caratula}>
      <h1 className={estilos.titulo}>{legajo.titulo}</h1>
      <dl className={estilos.formulario}>
        <div className={estilos.ancho}>
          <dt>Curso</dt>
          <dd>
            {legajo.curso}, UNA, {legajo.periodo}
          </dd>
        </div>
        <div>
          <dt>Preparado por</dt>
          <dd>{legajo.autor}</dd>
        </div>
        <div className={estilos.ancho}>
          <dt>Entidad evaluada</dt>
          <dd>Oracle Database 21c XE {legajo.version}, PDB XEPDB1</dd>
        </div>
        <div>
          <dt>Revisa</dt>
          <dd>{legajo.profesor}</dd>
        </div>
        <div className={estilos.ancho}>
          <dt>Norma y método</dt>
          <dd>ISO/IEC 27001:2022 Anexo A e ISO/IEC 27002:2022, ciclo PHVA</dd>
        </div>
        <div>
          <dt>Pruebas ejecutadas</dt>
          <dd className={estilos.mono}>
            {legajo.fechaEjecucion} {legajo.horaEjecucion}
          </dd>
        </div>
      </dl>
    </header>
  )
}
