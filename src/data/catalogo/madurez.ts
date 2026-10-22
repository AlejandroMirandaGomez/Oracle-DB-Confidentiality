import type { IdControl } from './norma'
import type { Control, ModeloMadurez, ObjetivoCobit } from '../tipos'

export const modelosMadurez = {
  PO2: {
    id: 'PO2',
    nombre: 'Definir la Arquitectura de la Información',
    area: 'Planear y Organizar',
    descripcion: 'La administración del proceso de Definir la arquitectura de la información que satisface el requerimiento de negocio de TI de agilizar la respuesta a los requerimientos, para brindar información confiable y consistente y para integrar de forma transparente las aplicaciones hacia los procesos de negocio es:',
    paginaImpresa: '36',
    paginaPdf: '41',
    niveles: {
      '0': [
        {
          origen: 'COBIT 0 No Existente',
          texto: 'No existe conciencia de la importancia de la arquitectura de la información para la organización. El conocimiento, la experiencia y las responsabilidades necesarias para desarrollar esta arquitectura no existen en la organización.',
        },
      ],
      '1': [
        {
          origen: 'COBIT 1 Inicial / Ad Hoc',
          texto: 'La gerencia reconoce la necesidad de una arquitectura de información. El desarrollo de algunos componentes de una arquitectura de información ocurre de manera ad hoc. Las definiciones abarcan datos en lugar de información, y son impulsadas por ofertas de proveedores de software aplicativo. Existe una comunicación esporádica e inconsistente de la necesidad de una arquitectura de información.',
        },
        {
          origen: 'COBIT 2 Repetible pero Intuitivo',
          texto: 'Surge un proceso de arquitectura de información y existen procedimientos similares, aunque intuitivos e informales, que se siguen por distintos individuos dentro de la organización. Las personas obtienen sus habilidades al construir la arquitectura de información por medio de experiencia práctica y la aplicación repetida de técnicas. Los requerimientos tácticos impulsan el desarrollo de los componentes de la arquitectura de la información por parte de los individuos.',
        },
      ],
      '2': [
        {
          origen: 'COBIT 3 Definido',
          texto: 'La importancia de la arquitectura de la información se entiende y se acepta, y la responsabilidad de su aplicación se asigna y se comunica de forma clara. Los procedimientos, herramientas y técnicas relacionados, aunque no son sofisticados, se han estandarizado y documentado y son parte de actividades informales de entrenamiento. Se han desarrollado políticas básicas de arquitectura de información, incluyendo algunos requerimientos estratégicos, aunque el cumplimiento de políticas, estándares y herramientas no se refuerza de manera consistente. Existe una función de administración de datos definida formalmente, que establece estándares para toda la organización, y empieza a reportar sobre la aplicación y uso de la arquitectura de la información. Las herramientas automatizadas se empiezan a utilizar, aunque los procesos y reglas son definidos por los proveedores de software de bases de datos. Un plan formal de entrenamiento ha sido desarrollado, pero el entrenamiento formal se basa en iniciativas individuales.',
        },
      ],
      '3': [
        {
          origen: 'COBIT 4 Administrado y Medible',
          texto: 'Se da soporte completo al desarrollo e implantación de la arquitectura de información por medio de métodos y técnicas formales. La responsabilidad sobre el desempeño del proceso de desarrollo de la arquitectura se refuerza y se mide el éxito de la arquitectura de información. Las herramientas automatizadas de soporte están ampliamente generalizadas, pero todavía no están integradas. Se han identificado métricas básicas y existe un sistema de medición. El proceso de definición de la arquitectura de información es proactivo y se enfoca en resolver necesidades futuras del negocio. La organización de administración de datos está activamente involucrada en todos los esfuerzos de desarrollo de las aplicaciones, para garantizar la consistencia. Un repositorio automatizado está totalmente implementado. Se encuentran en implantación modelos de datos más complejos para aprovechar el contenido informativo de las bases de datos. Los sistemas de información ejecutiva y los sistemas de soporte a la toma de decisiones aprovechan la información existente.',
        },
      ],
      '4': [
        {
          origen: 'COBIT 5 Optimizado',
          texto: 'La arquitectura de información es reforzada de forma consistente a todos los niveles. El valor de la arquitectura de la información para el negocio se enfatiza de forma continua. El personal de TI cuenta con la experiencia y las habilidades necesarias para desarrollar y dar mantenimiento a una arquitectura de información robusta y sensible que refleje todos los requerimientos del negocio. La información provista por la arquitectura se aplica de modo consistente y amplio. Se hace un uso amplio de las mejores prácticas de la industria en el desarrollo y mantenimiento de la arquitectura de información incluyendo un proceso de mejora continua. La estrategia para el aprovechamiento de la información por medio de tecnologías de bodega de datos y minería de datos está bien definida. La arquitectura de la información se encuentra en mejora continua y toma en cuenta información no tradicional sobre los procesos, organizaciones y sistemas.',
        },
      ],
    },
  },
  DS5: {
    id: 'DS5',
    nombre: 'Garantizar la Seguridad de los Sistemas',
    area: 'Entregar y Dar Soporte',
    descripcion: 'La administración del proceso de Garantizar la seguridad de los sistemas que satisfaga el requerimiento de negocio de TI de mantener la integridad de la información y de la infraestructura de procesamiento y minimizar el impacto de vulnerabilidades e incidentes de seguridad es:',
    paginaImpresa: '120',
    paginaPdf: '127',
    niveles: {
      '0': [
        {
          origen: 'COBIT 0 No Existente',
          texto: 'La organización no reconoce la necesidad de la seguridad para TI. Las responsabilidades y la rendición de cuentas no están asignadas para garantizar la seguridad. Las medidas para soportar la administrar la seguridad de TI no están implementadas. No hay reportes de seguridad de TI ni un proceso de respuesta para resolver brechas de seguridad de TI. Hay una total falta de procesos reconocibles de administración de seguridad de sistemas.',
        },
      ],
      '1': [
        {
          origen: 'COBIT 1 Inicial / Ad Hoc',
          texto: 'La organización reconoce la necesidad de seguridad para TI. La conciencia de la necesidad de seguridad depende principalmente del individuo. La seguridad de TI se lleva a cabo de forma reactiva. No se mide la seguridad de TI. Las brechas de seguridad de TI ocasionan respuestas con acusaciones personales, debido a que las responsabilidades no son claras. Las respuestas a las brechas de seguridad de TI son impredecibles.',
        },
        {
          origen: 'COBIT 2 Repetible pero Intuitivo',
          texto: 'Las responsabilidades y la rendición de cuentas sobre la seguridad, están asignadas a un coordinador de seguridad de TI, pero la autoridad gerencial del coordinador es limitada. La conciencia sobre la necesidad de la seguridad esta fraccionada y limitada. Aunque los sistemas producen información relevante respecto a la seguridad, ésta no se analiza. Los servicios de terceros pueden no cumplir con los requerimientos específicos de seguridad de la empresa. Las políticas de seguridad se han estado desarrollando, pero las herramientas y las habilidades son inadecuadas. Los reportes de la seguridad de TI son incompletos, engañosos o no aplicables. La habilitación sobre seguridad está disponible pero depende principalmente de la iniciativa del individuo. La seguridad de TI es vista primordialmente como responsabilidad y disciplina de TI, y el negocio no ve la seguridad de TI como parte de su propia disciplina.',
        },
      ],
      '2': [
        {
          origen: 'COBIT 3 Definido',
          texto: 'Existe conciencia sobre la seguridad y ésta es promovida por la gerencia. Los procedimientos de seguridad de TI están definidos y alineados con la política de seguridad de TI. Las responsabilidades de la seguridad de TI están asignadas y entendidas, pero no continuamente implementadas. Existe un plan de seguridad de TI y existen soluciones de seguridad motivadas por un análisis de riesgo. Los reportes no contienen un enfoque claro de negocio. Se realizan pruebas de seguridad adecuadas (por ejemplo, pruebas contra intrusos). Existe habilitación en seguridad para TI y para el negocio, pero se programa y se comunica de manera informal.',
        },
      ],
      '3': [
        {
          origen: 'COBIT 4 Administrado y Medible',
          texto: 'Las responsabilidades sobre la seguridad de TI son asignadas, administradas e implementadas de forma clara. Regularmente se lleva a cabo un análisis de impacto y de riesgos de seguridad. Las políticas y prácticas de seguridad se complementan con referencias de seguridad específicas. El contacto con métodos para promover la conciencia de la seguridad es obligatorio. La identificación, autenticación y autorización de los usuarios está estandarizada. La certificación en seguridad es buscada por parte del personal que es responsable de la auditoría y la administración de la seguridad. Las pruebas de seguridad se hacen utilizando procesos estándares y formales que llevan a mejorar los niveles de seguridad. Los procesos de seguridad de TI están coordinados con la función de seguridad de toda la organización. Los reportes de seguridad están ligados con los objetivos del negocio. La habilitación sobre seguridad se imparte tanto para TI como para el negocio. La habilitación sobre seguridad de TI se planea y se administra de manera que responda a las necesidades del negocio y a los perfiles de riesgo de seguridad. Los KGIs y KPIs ya están definidos pero no se miden aún.',
        },
      ],
      '4': [
        {
          origen: 'COBIT 5 Optimizado',
          texto: 'La seguridad en TI es una responsabilidad conjunta del negocio y de la gerencia de TI y está integrada con los objetivos de seguridad del negocio en la corporación. Los requerimientos de seguridad de TI están definidos de forma clara, optimizados e incluidos en un plan de seguridad aprobado. Los usuarios y los clientes se responsabilizan cada vez más de definir requerimientos de seguridad, y las funciones de seguridad están integradas con las aplicaciones en la fase de diseño. Los incidentes de seguridad son atendidos de forma inmediata con procedimientos formales de respuesta soportados por herramientas automatizadas. Se llevan a cabo valoraciones de seguridad de forma periódica para evaluar la efectividad de la implementación del plan de seguridad. La información sobre amenazas y vulnerabilidades se recolecta y analiza de manera sistemática. Se recolectan e implementan de forma oportuna controles adecuados para mitigar riesgos. Se llevan acabo pruebas de seguridad, análisis de causa-efecto e identificación pro-activa de riesgos para la mejora continua de procesos. Los procesos de seguridad y la tecnología están integrados a lo largo de toda la organización. Los KGIs y KPIs para administración de seguridad son recopilados y comunicados. La gerencia utiliza los KGIs y KPIs para ajustar el plan de seguridad en un proceso de mejora continua',
        },
      ],
    },
  },
  DS11: {
    id: 'DS11',
    nombre: 'Administración de Datos',
    area: 'Entregar y Dar Soporte',
    descripcion: 'La administración del proceso de Administrar los datos que satisfaga el requerimiento de negocio de TI de optimizar el uso de la información y garantizar la disponibilidad de la información cuando se requiera es:',
    paginaImpresa: '144',
    paginaPdf: '151',
    niveles: {
      '0': [
        {
          origen: 'COBIT 0 No Existente',
          texto: 'Los datos no son reconocidos como parte de los recursos y los activos de la empresa. No está asignada la propiedad sobre los datos o sobre la rendición de cuentas individual sobre la administración de los datos. La calidad y la seguridad de los datos son deficientes o inexistentes.',
        },
      ],
      '1': [
        {
          origen: 'COBIT 1 Inicial / Ad Hoc',
          texto: 'La organización reconoce la necesidad de una correcta administración de los datos. Hay un método adecuado para especificar requerimientos de seguridad en la administración de datos, pero no hay procedimientos implementados de comunicación formal. No se lleva a cabo habilitación específica sobre administración de los datos. La responsabilidad sobre la administración de los datos no es clara. Los procedimientos de respaldo y recuperación y los acuerdos sobre desechos están en orden.',
        },
        {
          origen: 'COBIT 2 Repetible pero Intuitivo',
          texto: 'A lo largo de toda la organización existe conciencia sobre la necesidad de una adecuada administración de los datos. A un alto nivel empieza a observarse la propiedad o responsabilidad sobre los datos. Los requerimientos de seguridad para la administración de datos son documentados por individuos clave. Se lleva a cabo algún tipo de monitoreo dentro de TI sobre algunas actividades clave de la administración de datos (respaldos, recuperación y desecho). Las responsabilidades para la administración de datos son asignadas de manera informal a personal clave de TI.',
        },
      ],
      '2': [
        {
          origen: 'COBIT 3 Definido',
          texto: 'Se entiende y acepta la necesidad de la administración de datos, tanto dentro de TI como a lo largo de toda la organización. Se establece la responsabilidad sobre la administración de los datos. Se asigna la propiedad sobre los datos a la parte responsable que controla la integridad y la seguridad. Los procedimientos de administración de datos se formalizan dentro de TI y se utilizan algunas herramientas para respaldos / recuperación y desecho de equipo. Se lleva a cabo algún tipo de monitoreo sobre la administración de datos. Se definen métricas básicas de desempeño. Comienza a aparecer el entrenamiento sobre administración de información.',
        },
      ],
      '3': [
        {
          origen: 'COBIT 4 Administrado y Medible',
          texto: 'Se entiende la necesidad de la administración de los datos y las acciones requeridas son aceptadas a lo largo de toda la organización. La responsabilidad de la propiedad y la administración de los datos están definidas, asignada y comunicada de forma clara en la organización. Los procedimientos se formalizan y son ampliamente conocidos, el conocimiento se comparte. Comienza a aparecer el uso de herramientas. Se acuerdan con los clientes los indicadores de desempeño y meta y se monitorean por medio de un proceso bien definido. Se lleva a cabo entrenamiento formal para el personal de administración de los datos.',
        },
      ],
      '4': [
        {
          origen: 'COBIT 5 Optimizado',
          texto: 'Se entiende y acepta dentro de la organización la necesidad de realizar todas las actividades requeridas para la administración de datos. Las necesidades y los requerimientos futuros son explorados de manera proactiva. Las responsabilidades sobre la propiedad de los datos y la administración de los mismos están establecidas de forma clara, se conocen ampliamente a lo largo de la organización y se actualizan periódicamente. Los procedimientos se formalizan y se conocen ampliamente, la compartición del conocimiento es una práctica estándar. Se utilizan herramientas sofisticadas con un máximo de automatización de la administración de los datos. Se acuerdan con los clientes los indicadores de desempeño y meta, se ligan con los objetivos del negocio y se monitorean de manera regular utilizando un proceso bien definido. Se exploran constantemente oportunidades de mejora. El entrenamiento para el personal de administración de datos se institucionaliza.',
        },
      ],
    },
  },
  AI3: {
    id: 'AI3',
    nombre: 'Adquirir y Mantener Infraestructura Tecnológica',
    area: 'Adquirir e Implementar',
    descripcion: 'La administración del proceso de Adquirir y mantener infraestructura de tecnología que satisfaga el requerimiento de negocio de TI de adquirir y mantener una infraestructura de TI integrada y estandarizada es:',
    paginaImpresa: '84',
    paginaPdf: '90',
    niveles: {
      '0': [
        {
          origen: 'COBIT 0 No Existente',
          texto: 'No se reconoce la administración de la infraestructura de tecnología como un asunto importante al cual deba ser resuelto.',
        },
      ],
      '1': [
        {
          origen: 'COBIT 1 Inicial / Ad Hoc',
          texto: 'Se realizan cambios a la infraestructura para cada nueva aplicación, sin ningún plan en conjunto. Aunque se tiene la percepción de que la infraestructura de TI es importante, no existe un enfoque general consistente. La actividad de mantenimiento reacciona a necesidades de corto plazo. El ambiente de producción es el ambiente de prueba.',
        },
        {
          origen: 'COBIT 2 Repetible pero Intuitivo',
          texto: 'No hay consistencia entre enfoques tácticos al adquirir y dar mantenimiento a la infraestructura de TI. La adquisición y mantenimiento de la infraestructura de TI no se basa en una estrategia definida y no considera las necesidades de las aplicaciones del negocio que se deben respaldar. Se tiene la noción de que la infraestructura de TI es importante, que se apoya en algunas prácticas formales. Algunos mantenimientos se programan, pero no se programa ni se coordina en su totalidad. Para algunos ambientes, existe un ambiente de prueba por separado.',
        },
      ],
      '2': [
        {
          origen: 'COBIT 3 Definido',
          texto: 'Existe un claro, definido y generalmente entendido proceso para adquirir y dar mantenimiento a la infraestructura TI. El proceso respalda las necesidades de las aplicaciones críticas del negocio y concuerda con la estrategia de negocio de TI, pero no se aplica en forma consistente. Se planea, programa y coordina el mantenimiento. Existen ambientes separados para prueba y producción.',
        },
      ],
      '3': [
        {
          origen: 'COBIT 4 Administrado y Medible',
          texto: 'Se desarrolla el proceso de adquisición y mantenimiento de la infraestructura de tecnología a tal punto que funciona bien para la mayoría de las situaciones, se le da un seguimiento consistente y un enfoque hacia la reutilización. La infraestructura de TI soporta adecuadamente las aplicaciones del negocio. El proceso está bien organizado y es preventivo. Tanto el costo como el tiempo de realización para alcanzar el nivel esperado de escalamiento, flexibilidad e integración se han optimizado parcialmente.',
        },
      ],
      '4': [
        {
          origen: 'COBIT 5 Optimizado',
          texto: 'El proceso de adquisición y mantenimiento de la infraestructura de tecnología es preventivo y está estrechamente en línea con las aplicaciones críticas del negocio y con la arquitectura de la tecnología. Se siguen buenas prácticas respecto a las soluciones de tecnología, y la organización tiene conciencia de las últimas plataformas desarrolladas y herramientas de administración. Se reducen costos al racionalizar y estandarizar los componentes de la infraestructura y con el uso de la automatización. Con un alto nivel de conciencia se pueden identificar los medios óptimos para mejorar el desempeño en forma preventiva, incluyendo el considerar la opción de contratar servicios externos. La infraestructura de TI se entiende como el apoyo clave para impulsar el uso de TI.',
        },
      ],
    },
  },
  AI7: {
    id: 'AI7',
    nombre: 'Instalar y Acreditar Soluciones y Cambios',
    area: 'Adquirir e Implementar',
    descripcion: 'La administración del proceso de Instalar y acreditar soluciones y cambios que satisfagan el requerimiento de negocio de TI de implementar sistemas nuevos o modificados que funcionen sin mayores problemas después de su instalación es:',
    paginaImpresa: '100',
    paginaPdf: '106',
    niveles: {
      '0': [
        {
          origen: 'COBIT 0 No Existente',
          texto: 'Hay una ausencia completa de procesos formales de instalación o acreditación y ni la gerencia senior ni el personal de TI reconocen la necesidad de verificar que las soluciones se ajustan para el propósito deseado.',
        },
      ],
      '1': [
        {
          origen: 'COBIT 1 Inicial / Ad Hoc',
          texto: 'Existe la percepción de la necesidad de verificar y confirmar que las soluciones implantadas sirven para el propósito esperado. Las pruebas se realizan para algunos proyectos, pero la iniciativa de pruebas se deja a los equipos de proyectos particulares y los enfoques que se toman varían. La acreditación formal y la autorización son raras o no existentes.',
        },
        {
          origen: 'COBIT 2 Repetible pero Intuitivo',
          texto: 'Existe cierta consistencia entre los enfoques de prueba y acreditación, pero por lo regular no se basan en ninguna metodología. Los equipos individuales de desarrollo deciden normalmente el enfoque de prueba y casi siempre hay ausencia de pruebas de integración. Hay un proceso de aprobación informal.',
        },
      ],
      '2': [
        {
          origen: 'COBIT 3 Definido',
          texto: 'Se cuenta con una metodología formal en relación con la instalación, migración, conversión y aceptación. Los procesos de TI para instalación y acreditación están integrados dentro del ciclo de vida del sistema y están automatizados hasta cierto punto. El entrenamiento, pruebas y transición y acreditación a producción tienen muy probablemente variaciones respecto al proceso definido, con base en las decisiones individuales. La calidad de los sistemas que pasan a producción es inconsistente, y los nuevos sistemas a menudo generan un nivel significativo de problemas posteriores a la implantación.',
        },
      ],
      '3': [
        {
          origen: 'COBIT 4 Administrado y Medible',
          texto: 'Los procedimientos son formales y se desarrollan para ser organizados y prácticos con ambientes de prueba definidos y con procedimientos de acreditación. En la práctica, todos los cambios mayores de sistemas siguen este enfoque formal. La evaluación de la satisfacción a los requerimientos del usuario es estándar y medible, y produce mediciones que la gerencia puede revisar y analizar de forma efectiva. La calidad de los sistemas que entran en producción es satisfactoria para la gerencia, aún con niveles razonables de problemas posteriores a la implantación. La automatización del proceso es ad hoc y depende del proyecto. Es posible que la gerencia esté satisfecha con el nivel actual de eficiencia a pesar de la ausencia de una evaluación posterior a la implantación. El sistema de prueba refleja adecuadamente el ambiente de producción. La prueba de stress para los nuevos sistemas y la prueba de regresión para sistemas existentes se aplican para proyectos mayores.',
        },
      ],
      '4': [
        {
          origen: 'COBIT 5 Optimizado',
          texto: 'Los procesos de instalación y acreditación se han refinado a un nivel de buena práctica, con base en los resultados de mejora continua y refinamiento. Los procesos de TI para la instalación y acreditación están totalmente integrados dentro del ciclo de vida del sistema y se automatizan cuando es apropiado, arrojando el estatus más eficiente de entrenamiento, pruebas y transición a producción para los nuevos sistemas. Los ambientes de prueba bien desarrollados, los registros de problemas y los procesos de resolución de fallas aseguran la transición eficiente y efectiva al ambiente de producción. La acreditación toma lugar regularmente sin repetición de trabajos, y los problemas posteriores a la implantación se limitan normalmente a correcciones menores. Las revisiones posteriores a la implantación son estándar, y las lecciones aprendidas se canalizan nuevamente hacia el proceso para asegurar el mejoramiento continuo de la calidad. Las pruebas de stress para los nuevos sistemas y las pruebas de regresión para sistemas modificados se aplican en forma consistente.',
        },
      ],
    },
  },
} satisfies Record<string, ModeloMadurez>

export type IdModelo = keyof typeof modelosMadurez

export const cobitPorControl = {
  'A5.12': {
    objetivo: 'PO2.3',
    nombre: 'Esquema de Clasificación de Datos',
    modelo: 'PO2',
    motivo: 'Establece un esquema de clasificación según qué tan crítica y sensible es la información (pública, confidencial, secreta), que es lo que pide el control.',
  },
  'A5.15': {
    objetivo: 'DS5.3',
    nombre: 'Administración de Identidad',
    modelo: 'DS5',
    motivo: 'Confirma que los permisos de acceso del usuario al sistema y a los datos están en línea con las necesidades del negocio definidas y documentadas.',
  },
  'A5.16': {
    objetivo: 'DS5.3',
    nombre: 'Administración de Identidad',
    modelo: 'DS5',
    motivo: 'Exige que todos los usuarios (internos, externos y temporales) y su actividad sean identificables de manera única.',
  },
  'A5.17': {
    objetivo: 'DS5.3',
    nombre: 'Administración de Identidad',
    modelo: 'DS5',
    motivo: 'Permite que el usuario se identifique a través de mecanismos de autenticación.',
  },
  'A5.18': {
    objetivo: 'DS5.4',
    nombre: 'Administración de Cuentas del Usuario',
    modelo: 'DS5',
    motivo: 'Cubre la solicitud, establecimiento, emisión, suspensión, modificación y cierre de cuentas de usuario y de los privilegios relacionados.',
  },
  'A5.33': {
    objetivo: 'DS11.2',
    nombre: 'Acuerdos de Almacenamiento y Conservación',
    modelo: 'DS11',
    motivo: 'Define procedimientos para el archivo, almacenamiento y retención de los datos conforme a la política de seguridad y a los requerimientos regulatorios.',
  },
  'A8.2': {
    objetivo: 'DS5.4',
    nombre: 'Administración de Cuentas del Usuario',
    modelo: 'DS5',
    motivo: 'Sus procedimientos de cuentas y privilegios incluyen expresamente a los administradores (usuarios privilegiados).',
  },
  'A8.3': {
    objetivo: 'DS5.3',
    nombre: 'Administración de Identidad',
    modelo: 'DS5',
    motivo: 'Confirma que el acceso del usuario al sistema y a los datos corresponde a las necesidades del negocio definidas y documentadas.',
  },
  'A8.5': {
    objetivo: 'DS5.3',
    nombre: 'Administración de Identidad',
    modelo: 'DS5',
    motivo: 'Permite que el usuario se identifique a través de mecanismos de autenticación.',
  },
  'A8.10': {
    objetivo: 'DS11.4',
    nombre: 'Eliminación',
    modelo: 'DS11',
    motivo: 'Define procedimientos para proteger los datos sensitivos cuando se eliminan o transfieren los datos o el hardware.',
  },
  'A8.11': {
    objetivo: 'DS11.6',
    nombre: 'Requerimientos de Seguridad para la Administración de Datos',
    modelo: 'DS11',
    motivo: 'Aplica requerimientos de seguridad al recibo, procesamiento, almacén y salida de los datos.',
  },
  'A8.12': {
    objetivo: 'DS11.6',
    nombre: 'Requerimientos de Seguridad para la Administración de Datos',
    modelo: 'DS11',
    motivo: 'Aplica requerimientos de seguridad al almacén y a la salida de los datos.',
  },
  'A8.13': {
    objetivo: 'DS11.5',
    nombre: 'Respaldo y Restauración',
    modelo: 'DS11',
    motivo: 'Define procedimientos de respaldo y restauración de sistemas, aplicaciones y datos en línea con los requerimientos del negocio y el plan de continuidad.',
  },
  'A8.15': {
    objetivo: 'DS5.5',
    nombre: 'Pruebas, Vigilancia y Monitoreo de la Seguridad',
    modelo: 'DS5',
    motivo: 'Una función de ingreso al sistema (logging) y de monitoreo permite la detección oportuna de actividades inusuales o anormales.',
  },
  'A8.20': {
    objetivo: 'DS5.10',
    nombre: 'Seguridad de la Red',
    modelo: 'DS5',
    motivo: 'Usa técnicas de seguridad y procedimientos de administración (firewalls, segmentación de redes, detección de intrusos) para controlar los flujos de información desde y hacia las redes.',
  },
  'A8.24': {
    objetivo: 'DS5.8',
    nombre: 'Administración de Llaves Criptográficas',
    modelo: 'DS5',
    motivo: 'Establece políticas y procedimientos para la generación, cambio, revocación, almacenamiento y uso de llaves criptográficas.',
  },
  'A8.8': {
    objetivo: 'AI3.3',
    nombre: 'Mantenimiento de la Infraestructura',
    modelo: 'AI3',
    motivo: 'Incluye administración de parches, estrategias de actualización y evaluación de vulnerabilidades dentro del mantenimiento de la infraestructura.',
  },
  'A8.31': {
    objetivo: 'AI7.4',
    nombre: 'Ambiente de Prueba',
    modelo: 'AI7',
    motivo: 'Define y establece un entorno seguro de pruebas representativo del entorno de operaciones planeado.',
  },
} satisfies Record<IdControl, ObjetivoCobit>

export function modeloDeControl(control: Pick<Control, 'cobit'>): ModeloMadurez {
  return modelosMadurez[control.cobit.modelo]
}
