import type { UsoIA } from './tipos'

export const validacionPendiente = 'Por completar por el estudiante'

export const usosIA: UsoIA[] = [
  {
    id: 'IA-01',
    herramienta: 'Claude (Anthropic), en Claude Code',
    prompt: 'Explícame que es lo que hay que hacer (adjuntando el PDF del enunciado)',
    aporte: 'Resumen de los seis componentes del artefacto, los entregables y los pesos de la rúbrica; señaló que pg_hba.conf es de PostgreSQL y que el masking dinámico en Oracle se llama Data Redaction.',
    validacion: validacionPendiente,
    fuente: 'Enunciado de la asignación, secciones 6, 9 y 10',
  },
  {
    id: 'IA-02',
    herramienta: 'Claude (Anthropic), en Claude Code',
    prompt: 'NOTA: EN D:\\UNA\\AdministracionBasesDatos\\Documentacion Tienes varia documentación sobre varias cosas que podrían ser importantes entre ellas esta el documento que compre y tengo licencia para usar, además se puede usar pues es para un trabajo meramente academico: ISO IEC 27002-2022.pdf No hagas nada todavía, solo toma contexto de la información',
    aporte: 'Lectura de los 15 controles en la norma y de los catálogos previos; advirtió que A8.13 no está marcado como control de confidencialidad y que la escala del enunciado es 0-4.',
    validacion: validacionPendiente,
    fuente: 'ISO/IEC 27002:2022, tablas de atributos de los controles 5.12 a 8.20',
  },
  {
    id: 'IA-03',
    herramienta: 'Claude (Anthropic), en Claude Code',
    prompt: 'Olvídate del informe PDF, lo que vamos a hacer es el artefacto. Que me recomiendas? estaba pensando en un HTML que tenga incrustado CSS y JavaScript.',
    aporte: 'Recomendación de React con Vite y TypeScript como sitio estático, sin backend, y la idea de mostrar el resultado real de los scripts como evidencia.',
    validacion: validacionPendiente,
    fuente: 'Documentación oficial de Vite y React',
  },
  {
    id: 'IA-04',
    herramienta: 'Claude (Anthropic), en Claude Code',
    prompt: 'Para realizar esta pagina quiero que instales y uses con libertad y auto criterio las siguientes skills: Emil Kowalskis, Impeccable, Taste Skill',
    aporte: 'Redacción de los 5 riesgos, las 13 tareas, el mapeo de 18 controles, los 15 observables, la matriz, los 10 hallazgos y el marco teórico; escritura y ejecución de los 23 scripts sobre la instancia XE; diseño y código del sitio.',
    validacion: validacionPendiente,
    fuente: 'Evidencias de ejecución en evidencias/ y Oracle Database Security Guide 21c',
  },
]

export const declaracionJurada =
  'Declaro que todo contenido generado con IA ha sido declarado en la tabla anterior, validado contra fuentes oficiales (ISO, documentación del motor de base de datos) y que asumo responsabilidad por su veracidad. Entiendo que omitir esta declaración constituye falta grave.'
