import type { NormaControl } from '../tipos'

export const normas = {
  'A5.12': {
    fuente: {
      apartado: '5.12',
      paginasPdf: '30 a 31',
      paginasImpresas: '22 a 23',
    },
    descripcion: 'La información debe clasificarse de acuerdo con las necesidades de seguridad de la información de la organización en función de la confidencialidad, la integridad, la disponibilidad y los requisitos pertinentes de las partes interesadas.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'La organización debe establecer una política específica de un tema sobre la clasificación de la información y comunicarla a todas las partes interesadas relevantes.',
      },
      {
        tipo: 'parrafo',
        texto: 'La organización debe tener en cuenta los requisitos de confidencialidad, integridad y disponibilidad en el esquema de clasificación.',
      },
      {
        tipo: 'parrafo',
        texto: 'Las clasificaciones y los controles de protección asociados para la información deben tener en cuenta las necesidades comerciales para compartir o restringir la información, proteger la integridad de la información y garantizar la disponibilidad, así como los requisitos legales relacionados con la confidencialidad, integridad o disponibilidad de la información. Los activos distintos de la información también pueden clasificarse de acuerdo con la clasificación de la información, que se almacena, procesa o maneja o protege de otro modo por el activo.',
      },
      {
        tipo: 'parrafo',
        texto: 'Los propietarios de la información deben ser responsables de su clasificación.',
      },
      {
        tipo: 'parrafo',
        texto: 'El esquema de clasificación debe incluir convenciones para la clasificación y criterios para la revisión de la clasificación a lo largo del tiempo. Los resultados de la clasificación deben actualizarse de acuerdo con los cambios del valor, la sensibilidad y la criticidad de la información a lo largo de su ciclo de vida.',
      },
      {
        tipo: 'parrafo',
        texto: 'El esquema debe estar alineado con la política específica del tema sobre el control de acceso (ver5.1 ) y debe ser capaz de abordar las necesidades comerciales específicas de la organización.',
      },
      {
        tipo: 'parrafo',
        texto: 'La clasificación puede ser determinada por el nivel de impacto que el compromiso de la información tendría para la organización. Cada nivel definido en el esquema debe recibir un nombre que tenga sentido en el contexto de la aplicación del esquema de clasificación.',
      },
      {
        tipo: 'parrafo',
        texto: 'El esquema debe ser consistente en toda la organización e incluirse en sus procedimientos para que todos clasifiquen la información y otros activos asociados aplicables de la misma manera. De esta manera, todos tienen un entendimiento común de los requisitos de protección y aplican la protección adecuada.',
      },
      {
        tipo: 'parrafo',
        texto: 'El esquema de clasificación utilizado dentro de la organización puede ser diferente de los esquemas utilizados por otras organizaciones, incluso si los nombres de los niveles son similares. Además, la información que se mueve entre las organizaciones pueden variar en clasificación dependiendo de su contexto en cada organización, incluso si sus esquemas de clasificación son idénticos. Por lo tanto, los acuerdos con otras organizaciones que incluyen el intercambio de información deben incluir procedimientos para identificar la clasificación de esa información y para interpretar los niveles de clasificación de otras organizaciones. La correspondencia entre diferentes esquemas se puede determinar buscando la equivalencia en los métodos de manejo y protección asociados.',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'La clasificación brinda a las personas que manejan información una indicación concisa de cómo manejarla y protegerla. La creación de grupos de información con necesidades de protección similares y la especificación de procedimientos de seguridad de la información que se aplican a toda la información de cada grupo facilita esto. Este enfoque reduce la necesidad de una evaluación de riesgos caso por caso y un diseño personalizado de los controles.',
      },
      {
        tipo: 'parrafo',
        texto: 'La información puede dejar de ser sensible o crítica después de un cierto período de tiempo. Por ejemplo, cuando la información se ha hecho pública, ya no tiene requisitos de confidencialidad pero aún puede requerir protección para sus propiedades de integridad y disponibilidad. Estos aspectos deben tenerse en cuenta, ya que la sobreclasificación puede llevar a la implementación de controles innecesarios que resulten en gastos adicionales o, por el contrario, la subclasificación puede llevar a controles insuficientes para proteger la información de compromisos.',
      },
      {
        tipo: 'parrafo',
        texto: 'A modo de ejemplo, un esquema de clasificación de la confidencialidad de la información puede basarse en los cuatro niveles siguientes:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) la divulgación no causa daño;',
          },
          {
            texto: 'b) la divulgación causa un daño reputacional menor o un impacto operativo menor;',
          },
          {
            texto: 'c) la divulgación tiene un impacto significativo a corto plazo en las operaciones o los objetivos comerciales;',
          },
          {
            texto: 'd) la divulgación tiene un impacto grave en los objetivos comerciales a largo plazo o pone en riesgo la supervivencia de la organización.',
          },
        ],
      },
    ],
    conceptos: ['Identificar'],
    dominios: ['Protección', 'Defensa'],
  },
  'A5.15': {
    fuente: {
      apartado: '5.15',
      paginasPdf: '35 a 36',
      paginasImpresas: '27 a 28',
    },
    descripcion: 'Las reglas para controlar el acceso físico y lógico a la información y otros activos asociados deben establecerse e implementarse en función de los requisitos comerciales y de seguridad de la información.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'Los propietarios de la información y otros activos asociados deben determinar la seguridad de la información y los requisitos comerciales relacionados con el control de acceso. Debe definirse una política específica de tema sobre control de acceso que tenga en cuenta estos requisitos y debe comunicarse a todas las partes interesadas relevantes.',
      },
      {
        tipo: 'parrafo',
        texto: 'Estos requisitos y la política específica del tema deben considerar lo siguiente:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) determinar qué entidades requieren qué tipo de acceso a la información y otros activos asociados;',
          },
          {
            texto: 'b) seguridad de las aplicaciones (ver8.26 );',
          },
          {
            texto: 'c) acceso físico, que debe estar respaldado por controles de entrada físicos apropiados (ver7.2 ,7.3 , 7.4 );',
          },
          {
            texto: 'd) diseminación y autorización de la información (por ejemplo, el principio de necesidad de saber) y niveles de seguridad de la información y clasificación de la información (ver5.10 ,5.12 ,5.13 );',
          },
          {
            texto: 'e) restricciones al acceso privilegiado (ver8.2 );',
          },
          {
            texto: 'f) segregación de funciones (ver5.3 );',
          },
          {
            texto: 'g) la legislación, los reglamentos y las obligaciones contractuales pertinentes con respecto a la limitación del acceso a datos o servicios (ver5.31 ,5.32 ,5.33 ,5.34 ,8.3 );',
          },
          {
            texto: 'h) segregación de las funciones de control de acceso (por ejemplo, solicitud de acceso, autorización de acceso, administración de acceso);',
          },
          {
            texto: 'i) autorización formal de solicitudes de acceso (ver5.16 y5.18 );',
          },
          {
            texto: 'j) la gestión de los derechos de acceso (ver5.18 );',
          },
          {
            texto: 'k) registro (ver8.15 ).',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Las reglas de control de acceso deben implementarse definiendo y mapeando los derechos y restricciones de acceso apropiados para las entidades relevantes (ver5.16 ). Una entidad puede representar tanto a un usuario humano como a un elemento técnico o lógico (por ejemplo, una máquina, un dispositivo o un servicio). Para simplificar la gestión del control de acceso, se pueden asignar roles específicos a grupos de entidades.',
      },
      {
        tipo: 'parrafo',
        texto: 'Se debe tener en cuenta lo siguiente al definir e implementar reglas de control de acceso:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) coherencia entre los derechos de acceso y la clasificación de la información;',
          },
          {
            texto: 'b) coherencia entre los derechos de acceso y las necesidades y requisitos de seguridad del perímetro físico;',
          },
          {
            texto: 'c) considerar todos los tipos de conexiones disponibles en entornos distribuidos para que las entidades solo tengan acceso a la información y otros activos asociados, incluidas las redes y los servicios de red, que están autorizadas a usar;',
          },
          {
            texto: 'd) considerar cómo se pueden reflejar los elementos o factores relevantes para el control de acceso dinámico.',
          },
        ],
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'A menudo se utilizan principios generales en el contexto del control de acceso. Dos de los principios más utilizados son:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) necesidad de saber: una entidad solo tiene acceso a la información que esa entidad requiere para realizar sus tareas (diferentes tareas o roles significan diferente información de necesidad de saber y, por lo tanto, diferentes perfiles de acceso);',
          },
          {
            texto: 'b) necesidad de uso: a una entidad solo se le asigna acceso a la infraestructura de tecnología de la información cuando existe una necesidad clara.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Se debe tener cuidado al especificar reglas de control de acceso para considerar:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) establecer reglas basadas en la premisa del privilegio mínimo, “Todo está generalmente prohibido a menos que esté expresamente permitido”, en lugar de la regla más débil, “Todo está generalmente permitido a menos que esté expresamente prohibido”;',
          },
          {
            texto: 'b) cambios en las etiquetas de información (ver5.13 ) que son iniciados automáticamente por las instalaciones de procesamiento de información y aquellos iniciados a discreción de un usuario;',
          },
          {
            texto: 'c) cambios en los permisos de usuario que son iniciados automáticamente por el sistema de información y aquellos iniciados por un administrador;',
          },
          {
            texto: 'd) cuándo definir y revisar periódicamente la aprobación.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Las reglas de control de acceso deben estar respaldadas por procedimientos documentados (ver5.16 ,5.17 ,5.18 ,8.2 ,8.3 ,8.4 , 8.5 ,8.18 ) y responsabilidades definidas (ver5.2 ,5.17 ).',
      },
      {
        tipo: 'parrafo',
        texto: 'Hay varias formas de implementar el control de acceso, como MAC (control de acceso obligatorio), DAC (control de acceso discrecional), RBAC (control de acceso basado en roles) y ABAC (control de acceso basado en atributos).',
      },
      {
        tipo: 'parrafo',
        texto: 'Las reglas de control de acceso también pueden contener elementos dinámicos (por ejemplo, una función que evalúa accesos anteriores o valores de entorno específicos). Las reglas de control de acceso se pueden implementar en diferentes granularidades, que van desde cubrir redes o sistemas completos hasta campos de datos específicos y también pueden considerar propiedades como la ubicación del usuario o el tipo de conexión de red que se utiliza para el acceso. Estos principios y cómo se define el control de acceso granular pueden tener un impacto significativo en los costos. Reglas más estrictas y más granularidad generalmente conducen a un costo más alto. Los requisitos comerciales y las consideraciones de riesgo deben usarse para definir qué reglas de control de acceso se aplican y qué granularidad se requiere.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A5.16': {
    fuente: {
      apartado: '5.16',
      paginasPdf: '37 a 38',
      paginasImpresas: '29 a 30',
    },
    descripcion: 'Debe gestionarse el ciclo de vida completo de las identidades.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'Los procesos utilizados en el contexto de la gestión de la identidad deben garantizar que:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) para las identidades asignadas a personas, una identidad específica solo se vincula a una sola persona para poder responsabilizar a la persona por las acciones realizadas con esta identidad específica;',
          },
          {
            texto: 'b) las identidades asignadas a varias personas (por ejemplo, identidades compartidas) solo se permiten cuando son necesarias por razones comerciales u operativas y están sujetas a aprobación y documentación específicas;',
          },
          {
            texto: 'c) las identidades asignadas a entidades no humanas están sujetas a una aprobación segregada adecuada y a una supervisión continua independiente;',
          },
          {
            texto: 'd) las identidades se inhabilitan o eliminan de manera oportuna si ya no son necesarias (por ejemplo, si sus entidades asociadas se eliminan o ya no se utilizan, o si la persona vinculada a una identidad ha dejado la organización o ha cambiado de función);',
          },
          {
            texto: 'e) en un dominio específico, una sola identidad se mapea a una sola entidad, [es decir, se evita el mapeo de múltiples identidades a la misma entidad dentro del mismo contexto (identidades duplicadas)];',
          },
          {
            texto: 'f) se mantienen registros de todos los eventos significativos relacionados con el uso y la gestión de las identidades de los usuarios y de la información de autenticación.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'La organización debe contar con un proceso de soporte para manejar los cambios en la información relacionada con las identidades de los usuarios. Estos procesos pueden incluir la reverificación de documentos confiables relacionados con una persona.',
      },
      {
        tipo: 'parrafo',
        texto: 'Al utilizar identidades proporcionadas o emitidas por terceros (p. ej., credenciales de redes sociales), la organización debe asegurarse de que las identidades de terceros brinden el nivel de confianza requerido y que los riesgos asociados se conozcan y se traten adecuadamente. Esto puede incluir controles relacionados con terceros (ver5.19 ), así como los controles relacionados con la información de autenticación asociada (ver5.17 ).',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Proporcionar o revocar el acceso a la información y otros activos asociados suele ser un procedimiento de varios pasos:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) confirmar los requisitos comerciales para establecer una identidad;',
          },
          {
            texto: 'b) verificar la identidad de una entidad antes de asignarles una identidad lógica;',
          },
          {
            texto: 'c) establecer una identidad;',
          },
          {
            texto: 'd) configurar y activar la identidad. Esto también incluye la configuración y configuración inicial de los servicios de autenticación relacionados;',
          },
          {
            texto: 'e) otorgar o revocar derechos de acceso específicos a la identidad, con base en las decisiones de autorización o derecho correspondientes (ver5.18 ).',
          },
        ],
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A5.17': {
    fuente: {
      apartado: '5.17',
      paginasPdf: '38 a 39',
      paginasImpresas: '30 a 31',
    },
    descripcion: 'La asignación y gestión de la información de autenticación debe controlarse mediante un proceso de gestión, incluido el asesoramiento al personal sobre el manejo adecuado de la información de autenticación.',
    guia: [
      {
        tipo: 'subtitulo',
        texto: 'Asignación de información de autenticación',
      },
      {
        tipo: 'parrafo',
        texto: 'El proceso de asignación y gestión debe garantizar que:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) las contraseñas personales o los números de identificación personal (PIN) generados automáticamente durante los procesos de inscripción como información de autenticación secreta temporal no se pueden adivinar y son únicos para cada persona, y los usuarios deben cambiarlos después del primer uso;',
          },
          {
            texto: 'b) se establecen procedimientos para verificar la identidad de un usuario antes de proporcionar información de autenticación nueva, de reemplazo o temporal;',
          },
          {
            texto: 'c) la información de autenticación, incluida la información de autenticación temporal, se transmite a los usuarios de manera segura (por ejemplo, a través de un canal autenticado y protegido) y se evita el uso de mensajes de correo electrónico sin protección (texto claro) para este fin;',
          },
          {
            texto: 'd) los usuarios acusan recibo de la información de autenticación;',
          },
          {
            texto: 'e) la información de autenticación predeterminada predefinida o proporcionada por los proveedores se cambia inmediatamente después de la instalación de sistemas o software;',
          },
          {
            texto: 'f) se mantienen registros de eventos significativos relacionados con la asignación y gestión de la información de autenticación y se garantiza su confidencialidad, y se aprueba el método de mantenimiento de registros (p. ej. utilizando una herramienta de bóveda de contraseñas aprobada).',
          },
        ],
      },
      {
        tipo: 'subtitulo',
        texto: 'Responsabilidades del usuario',
      },
      {
        tipo: 'parrafo',
        texto: 'Cualquier persona que tenga acceso o utilice información de autenticación debe ser advertida de que se asegure de que:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) la información de autenticación secreta, como las contraseñas, se mantiene confidencial. La información de autenticación secreta personal no debe compartirse con nadie. La información de autenticación secreta utilizada en el contexto de identidades vinculadas a múltiples usuarios o vinculadas a entidades no personales se comparte únicamente con personas autorizadas;',
          },
          {
            texto: 'b) la información de autenticación afectada o comprometida se cambia inmediatamente después de la notificación o cualquier otra indicación de un compromiso;',
          },
          {
            texto: 'c) cuando se utilizan contraseñas como información de autenticación, se seleccionan contraseñas seguras de acuerdo con las recomendaciones de las mejores prácticas, por ejemplo:',
            subitems: [
              '1) las contraseñas no se basan en nada que otra persona pueda adivinar u obtener fácilmente utilizando información relacionada con la persona (por ejemplo, nombres, números de teléfono y fechas de nacimiento);',
              '2) las contraseñas no se basan en palabras del diccionario o combinaciones de las mismas;',
              '3) use frases de contraseña fáciles de recordar e intente incluir caracteres alfanuméricos y especiales;',
              '4) las contraseñas tienen una longitud mínima;',
            ],
          },
          {
            texto: 'd) las mismas contraseñas no se utilizan en distintos servicios y sistemas;',
          },
          {
            texto: 'e) la obligación de seguir estas reglas también está incluida en los términos y condiciones de empleo (ver 6.2 ).',
          },
        ],
      },
      {
        tipo: 'subtitulo',
        texto: 'Sistema de gestión de contraseñas',
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando se utilizan contraseñas como información de autenticación, el sistema de administración de contraseñas debe:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) permitir a los usuarios seleccionar y cambiar sus propias contraseñas e incluir un procedimiento de confirmación para abordar los errores de entrada;',
          },
          {
            texto: 'b) aplicar contraseñas seguras de acuerdo con las recomendaciones de buenas prácticas [ver c) de "Responsabilidades del usuario];',
          },
          {
            texto: 'c) obligar a los usuarios a cambiar sus contraseñas en el primer inicio de sesión;',
          },
          {
            texto: 'd) hacer cumplir los cambios de contraseña según sea necesario, por ejemplo, después de un incidente de seguridad, o al terminar o cambiar de empleo cuando un usuario tiene contraseñas conocidas para identidades que permanecen activas (por ejemplo, identidades compartidas);',
          },
          {
            texto: 'e) evitar la reutilización de contraseñas anteriores;',
          },
          {
            texto: 'f) evitar el uso de contraseñas de uso común y nombres de usuario comprometidos, combinaciones de contraseñas de sistemas pirateados;',
          },
          {
            texto: 'g) no mostrar contraseñas en la pantalla cuando se ingresan;',
          },
          {
            texto: 'h) almacenar y transmitir contraseñas en forma protegida.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'El cifrado y el hashing de contraseñas deben realizarse de acuerdo con las técnicas criptográficas aprobadas para contraseñas (ver8.24 ).',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Las contraseñas o frases de contraseña son un tipo de información de autenticación de uso común y son un medio común para verificar la identidad de un usuario. Otros tipos de información de autenticación son claves criptográficas, datos almacenados en tokens de hardware (por ejemplo, tarjetas inteligentes) que producen códigos de autenticación y datos biométricos, como escaneos de iris o huellas dactilares. Se puede encontrar información adicional en la serie ISO/IEC 24760.',
      },
      {
        tipo: 'parrafo',
        texto: 'Requerir cambios frecuentes de contraseñas puede ser problemático porque los usuarios pueden molestarse por los cambios frecuentes, olvidar nuevas contraseñas, anotarlas en lugares inseguros o elegir contraseñas no seguras. La provisión de inicio de sesión único (SSO) u otras herramientas de gestión de autenticación (por ejemplo, bóvedas de contraseñas) reduce la cantidad de información de autenticación que los usuarios deben proteger y, por lo tanto, puede aumentar la eficacia de este control. Sin embargo, estas herramientas también pueden aumentar el impacto de la divulgación de información de autenticación.',
      },
      {
        tipo: 'parrafo',
        texto: 'Algunas aplicaciones requieren que una autoridad independiente asigne contraseñas de usuario. En tales casos, a), c) yd) del "Sistema de gestión de contraseñas" no se aplican.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A5.18': {
    fuente: {
      apartado: '5.18',
      paginasPdf: '40 a 41',
      paginasImpresas: '32 a 33',
    },
    descripcion: 'Los derechos de acceso a la información y otros activos asociados deben proporcionarse, revisarse, modificarse y eliminarse de acuerdo con la política y las reglas de control de acceso específicas del tema de la organización.',
    guia: [
      {
        tipo: 'subtitulo',
        texto: 'Concesión y revocación de los derechos de acceso',
      },
      {
        tipo: 'parrafo',
        texto: 'El proceso de aprovisionamiento para asignar o revocar los derechos de acceso físico y lógico otorgados a la identidad autenticada de una entidad debe incluir:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) obtener autorización del propietario de la información y otros activos asociados para el uso de la información y otros activos asociados (ver5.9 ). La aprobación por separado de los derechos de acceso por parte de la gerencia también puede ser apropiada;',
          },
          {
            texto: 'b) considerando los requisitos comerciales y la política y las reglas específicas del tema de la organización sobre el control de acceso;',
          },
          {
            texto: 'c) considerar la segregación de funciones, incluida la segregación de las funciones de aprobación e implementación de los derechos de acceso y la separación de funciones en conflicto;',
          },
          {
            texto: 'd) garantizar que los derechos de acceso se eliminen cuando alguien no necesite acceder a la información y otros activos asociados, en particular garantizar que los derechos de acceso de los usuarios que han dejado la organización se eliminen de manera oportuna;',
          },
          {
            texto: 'e) considerar otorgar derechos de acceso temporal por un período de tiempo limitado y revocarlos en la fecha de vencimiento, en particular para el personal temporal o el acceso temporal requerido por el personal;',
          },
          {
            texto: 'f) verificar que el nivel de acceso otorgado esté de acuerdo con las políticas específicas del tema sobre control de acceso (ver5.15 ) y es coherente con otros requisitos de seguridad de la información, como la segregación de funciones (ver5.3 );',
          },
          {
            texto: 'g) garantizar que los derechos de acceso se activen (por ejemplo, por parte de los proveedores de servicios) solo después de que se completen con éxito los procedimientos de autorización;',
          },
          {
            texto: 'h) mantener un registro central de los derechos de acceso otorgados a un identificador de usuario (ID, lógico o físico) para acceder a la información y otros activos asociados;',
          },
          {
            texto: 'i) modificar los derechos de acceso de los usuarios que han cambiado de rol o trabajo;',
          },
          {
            texto: 'j) eliminar o ajustar los derechos de acceso físico y lógico, lo que puede hacerse mediante la eliminación, revocación o reemplazo de claves, información de autenticación, tarjetas de identificación o suscripciones;',
          },
          {
            texto: 'k) mantener un registro de cambios en los derechos de acceso lógico y físico de los usuarios.',
          },
        ],
      },
      {
        tipo: 'subtitulo',
        texto: 'Revisión de los derechos de acceso',
      },
      {
        tipo: 'parrafo',
        texto: 'Las revisiones regulares de los derechos de acceso físico y lógico deben considerar lo siguiente:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) los derechos de acceso de los usuarios después de cualquier cambio dentro de la misma organización (por ejemplo, cambio de trabajo, promoción, descenso) o terminación del empleo (ver6.1 a6.5 );',
          },
          {
            texto: 'b) autorizaciones de derechos de acceso privilegiado.',
          },
        ],
      },
      {
        tipo: 'subtitulo',
        texto: 'Consideración antes del cambio o terminación del empleo',
      },
      {
        tipo: 'parrafo',
        texto: 'Los derechos de acceso de un usuario a la información y otros activos asociados deben revisarse y ajustarse o eliminarse antes de cualquier cambio o terminación del empleo en función de la evaluación de factores de riesgo tales como:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) si la terminación o cambio es iniciado por el usuario o por la administración y el motivo de la terminación;',
          },
          {
            texto: 'b) las responsabilidades actuales del usuario;',
          },
          {
            texto: 'c) el valor de los activos actualmente accesibles.',
          },
        ],
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Se debe considerar el establecimiento de roles de acceso de usuario en función de los requisitos comerciales que resumen una serie de derechos de acceso en perfiles de acceso de usuario típicos. Las solicitudes de acceso y las revisiones de los derechos de acceso se gestionan más fácilmente a nivel de dichos roles que a nivel de derechos particulares.',
      },
      {
        tipo: 'parrafo',
        texto: 'Se debe considerar la posibilidad de incluir cláusulas en los contratos de personal y de servicios que especifiquen sanciones si el personal intenta acceder sin autorización (ver5.20 ,6.2 ,6.4 ,6.6 ).',
      },
      {
        tipo: 'parrafo',
        texto: 'En casos de rescisión iniciada por la gerencia, el personal descontento o los usuarios externos pueden corromper deliberadamente la información o sabotear las instalaciones de procesamiento de información. En los casos de personas que renuncian o son despedidas, pueden verse tentados a recopilar información para uso futuro.',
      },
      {
        tipo: 'parrafo',
        texto: 'La clonación es una forma eficiente para que las organizaciones asignen acceso a los usuarios. Sin embargo, debe hacerse con cuidado en función de los distintos roles identificados por la organización en lugar de simplemente clonar una identidad con todos los derechos de acceso asociados. La clonación tiene un riesgo inherente de dar lugar a derechos de acceso excesivos a la información y otros activos asociados.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A5.33': {
    fuente: {
      apartado: '5.33',
      paginasPdf: '61 a 62',
      paginasImpresas: '53 a 54',
    },
    descripcion: 'Los registros deben protegerse contra pérdida, destrucción, falsificación, acceso no autorizado y publicación no autorizada.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'La organización debe tomar los siguientes pasos para proteger la autenticidad, confiabilidad, integridad y usabilidad de los registros, ya que su contexto comercial y los requisitos para su gestión cambian con el tiempo:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) emitir lineamientos sobre el almacenamiento, el manejo de la cadena de custodia y la eliminación de registros, lo que incluye la prevención de la manipulación de registros. Estas pautas deben estar alineadas con la política específica del tema de la organización sobre la gestión de registros y otros requisitos de registros;',
          },
          {
            texto: 'b) elaborar un calendario de conservación que defina los registros y el período de tiempo durante el cual deben conservarse.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'El sistema de almacenamiento y manejo debe garantizar la identificación de los registros y de su período de retención teniendo en cuenta la legislación o los reglamentos nacionales o regionales, así como las expectativas de la comunidad o la sociedad, si corresponde. Este sistema debería permitir la destrucción adecuada de registros después de ese período si la organización no los necesita.',
      },
      {
        tipo: 'parrafo',
        texto: 'Al decidir sobre la protección de registros organizacionales específicos, se debe considerar su clasificación de seguridad de la información correspondiente, con base en el esquema de clasificación de la organización. Los registros deben clasificarse en tipos de registros (p. ej., registros contables, registros de transacciones comerciales, registros de personal, registros legales), cada uno con detalles sobre los períodos de retención y el tipo de medio de almacenamiento permitido, que puede ser físico o electrónico.',
      },
      {
        tipo: 'parrafo',
        texto: 'Los sistemas de almacenamiento de datos deben elegirse de manera que los registros requeridos puedan recuperarse en un marco de tiempo y formato aceptables, según los requisitos que se deban cumplir.',
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando se elijan medios de almacenamiento electrónico, se deben establecer procedimientos para garantizar la capacidad de acceder a los registros (tanto los medios de almacenamiento como la legibilidad del formato) durante todo el período de retención para salvaguardar contra pérdidas debido a futuros cambios tecnológicos. Cualquier clave criptográfica relacionada y programas asociados con archivos cifrados o firmas digitales también deben conservarse para permitir el descifrado de los registros durante el tiempo que se conservan los registros (ver8.24 ).',
      },
      {
        tipo: 'parrafo',
        texto: 'Los procedimientos de almacenamiento y manipulación deben implementarse de acuerdo con las recomendaciones proporcionadas por los fabricantes de los medios de almacenamiento. Se debe considerar la posibilidad de deterioro de los medios utilizados para el almacenamiento de registros.',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Los registros documentan eventos o transacciones individuales o pueden formar agregados que han sido diseñados para documentar procesos de trabajo, actividades o funciones. Ambos son evidencia de actividad comercial y activos de información. Cualquier conjunto de información, independientemente de su estructura o forma, puede gestionarse como un registro. Esto incluye información en forma de documento, una recopilación de datos u otros tipos de información digital o análoga que se crean, capturan y gestionan en el curso del negocio.',
      },
      {
        tipo: 'parrafo',
        texto: 'En la gestión de documentos, los metadatos son datos que describen el contexto, el contenido y la estructura de los documentos, así como su gestión a lo largo del tiempo. Los metadatos son un componente esencial de cualquier registro.',
      },
      {
        tipo: 'parrafo',
        texto: 'Puede ser necesario conservar algunos registros de forma segura para cumplir con los requisitos legales, estatutarios, reglamentarios o contractuales, así como para respaldar las actividades comerciales esenciales. La ley o regulación nacional puede establecer el período de tiempo y el contenido de los datos para la retención de la información. Puede encontrar más información sobre la gestión de registros en la norma ISO 15489.',
      },
    ],
    conceptos: ['Identificar', 'Proteger'],
    dominios: ['Defensa'],
  },
  'A8.2': {
    fuente: {
      apartado: '8.2',
      paginasPdf: '91 a 92',
      paginasImpresas: '83 a 84',
    },
    descripcion: 'La asignación y el uso de derechos de acceso privilegiado deben restringirse y administrarse.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'La asignación de derechos de acceso privilegiado debe controlarse a través de un proceso de autorización de acuerdo con la política de control de acceso específica del tema pertinente (ver5.15 ). Se debe considerar lo siguiente:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) identificar a los usuarios que necesitan derechos de acceso privilegiado para cada sistema o proceso (por ejemplo, sistemas operativos, sistemas de gestión de bases de datos y aplicaciones);',
          },
          {
            texto: 'b) asignar derechos de acceso privilegiado a los usuarios según sea necesario y caso por caso de acuerdo con la política específica del tema sobre control de acceso (ver5.15 ) (es decir, solo a personas con la competencia necesaria para llevar a cabo actividades que requieren un acceso privilegiado y con base en el requisito mínimo para sus roles funcionales);',
          },
          {
            texto: 'c) mantener un proceso de autorización (es decir, determinar quién puede aprobar derechos de acceso privilegiado o no otorgar derechos de acceso privilegiado hasta que se complete el proceso de autorización) y un registro de todos los privilegios asignados;',
          },
          {
            texto: 'd) definir e implementar los requisitos para la expiración de los derechos de acceso privilegiado;',
          },
          {
            texto: 'e) tomar medidas para garantizar que los usuarios conozcan sus derechos de acceso privilegiado y cuándo se encuentran en el modo de acceso privilegiado. Las posibles medidas incluyen el uso de identidades de usuario específicas, configuraciones de interfaz de usuario o incluso equipos específicos;',
          },
          {
            texto: 'f) los requisitos de autenticación para los derechos de acceso privilegiado pueden ser más altos que los requisitos para los derechos de acceso normales. Puede ser necesario volver a autenticarse o aumentar la autenticación antes de trabajar con derechos de acceso privilegiados;',
          },
          {
            texto: 'g) regularmente, y después de cualquier cambio organizacional, revisar a los usuarios que trabajan con derechos de acceso privilegiado para verificar si sus deberes, roles, responsabilidades y competencia aún los califican para trabajar con derechos de acceso privilegiado (ver5.18 );',
          },
          {
            texto: 'h) establecer reglas específicas para evitar el uso de identificaciones de usuario de administración impersonales (como “root”), dependiendo de las capacidades de configuración de los sistemas. Administrar y proteger la información de autenticación de dichas identidades (ver5.17 );',
          },
          {
            texto: 'i) otorgar acceso privilegiado temporal solo durante el período de tiempo necesario para implementar cambios o actividades aprobados (por ejemplo, para actividades de mantenimiento o algunos cambios críticos), en lugar de otorgar derechos de acceso privilegiado de forma permanente. Esto a menudo se conoce como procedimiento de rotura de cristal y, a menudo, se automatiza mediante tecnologías de gestión de acceso privilegiado;',
          },
          {
            texto: 'j) registrar todos los accesos privilegiados a los sistemas con fines de auditoría;',
          },
          {
            texto: 'k) no compartir o vincular identidades con derechos de acceso privilegiado a múltiples personas, asignando a cada persona una identidad separada que permita asignar derechos de acceso privilegiado específicos. Las identidades se pueden agrupar (p. ej., definiendo un grupo de administradores) para simplificar la gestión de los derechos de acceso privilegiado;',
          },
          {
            texto: 'l) usar únicamente identidades con derechos de acceso privilegiado para realizar tareas administrativas y no para tareas generales del día a día [es decir, revisar el correo electrónico, acceder a la web (los usuarios deben tener una identidad de red normal separada para estas actividades)].',
          },
        ],
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Los derechos de acceso privilegiado son derechos de acceso proporcionados a una identidad, un rol o un proceso que permite realizar actividades que los usuarios o procesos típicos no pueden realizar. Los roles de administrador del sistema generalmente requieren derechos de acceso privilegiado.',
      },
      {
        tipo: 'parrafo',
        texto: 'El uso inapropiado de los privilegios del administrador del sistema (cualquier característica o instalación de un sistema de información que permita al usuario anular los controles del sistema o de la aplicación) es un factor importante que contribuye a las fallas o violaciones de los sistemas.',
      },
      {
        tipo: 'parrafo',
        texto: 'Puede encontrar más información relacionada con la gestión de acceso y la gestión segura del acceso a la información y los recursos de tecnologías de la información y las comunicaciones en ISO/IEC 29146.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A8.3': {
    fuente: {
      apartado: '8.3',
      paginasPdf: '92 a 94',
      paginasImpresas: '84 a 86',
    },
    descripcion: 'El acceso a la información y otros activos asociados debe estar restringido de acuerdo con la política específica del tema establecida sobre control de acceso.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'El acceso a la información y otros activos asociados debe estar restringido de acuerdo con las políticas específicas del tema establecidas. Se debe considerar lo siguiente para respaldar los requisitos de restricción de acceso:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) no permitir el acceso a información sensible por parte de usuarios con identidades desconocidas o de forma anónima. El acceso público o anónimo solo debe otorgarse a ubicaciones de almacenamiento que no contengan información confidencial;',
          },
          {
            texto: 'b) proporcionar mecanismos de configuración para controlar el acceso a la información en sistemas, aplicaciones y servicios;',
          },
          {
            texto: 'c) controlar a qué datos puede acceder un usuario en particular;',
          },
          {
            texto: 'd) controlar qué identidades o grupo de identidades tienen qué acceso, como lectura, escritura, eliminación y ejecución;',
          },
          {
            texto: 'e) proporcionar controles de acceso físicos o lógicos para el aislamiento de aplicaciones sensibles, datos de aplicaciones o sistemas.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Además, se deben considerar técnicas y procesos de gestión de acceso dinámico para proteger información confidencial que tiene un gran valor para la organización cuando la organización:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) necesita un control granular sobre quién puede acceder a dicha información durante qué período y de qué manera;',
          },
          {
            texto: 'b) quiere compartir dicha información con personas ajenas a la organización y mantener el control sobre quién puede acceder a ella;',
          },
          {
            texto: 'c) quiere gestionar dinámicamente, en tiempo real, el uso y distribución de dicha información;',
          },
          {
            texto: 'd) quiere proteger dicha información contra cambios no autorizados, copia y distribución (incluida la impresión);',
          },
          {
            texto: 'e) quiere monitorear el uso de la información;',
          },
          {
            texto: 'f) quiere registrar cualquier cambio en dicha información que tenga lugar en caso de que se requiera una investigación futura.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Las técnicas de gestión de acceso dinámico deben proteger la información a lo largo de su ciclo de vida (es decir, creación, procesamiento, almacenamiento, transmisión y eliminación), incluyendo:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) establecer reglas sobre la gestión del acceso dinámico en función de casos de uso específicos considerando:',
            subitems: [
              '1) otorgar permisos de acceso en función de la identidad, el dispositivo, la ubicación o la aplicación;',
              '2) aprovechar el esquema de clasificación para determinar qué información debe protegerse con técnicas de gestión de acceso dinámico;',
            ],
          },
          {
            texto: 'b) establecer procesos operativos, de seguimiento y de presentación de informes e infraestructura técnica de apoyo.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Los sistemas de gestión de acceso dinámico deben proteger la información mediante:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) exigir autenticación, credenciales apropiadas o un certificado para acceder a la información;',
          },
          {
            texto: 'b) restringir el acceso, por ejemplo, a un período de tiempo específico (por ejemplo, después de una fecha dada o hasta una fecha particular);',
          },
          {
            texto: 'c) usar cifrado para proteger la información;',
          },
          {
            texto: 'd) definir los permisos de impresión de la información;',
          },
          {
            texto: 'e) registrar quién accede a la información y cómo se utiliza la información;',
          },
          {
            texto: 'f) generar alertas si se detectan intentos de mal uso de la información.',
          },
        ],
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Las técnicas de gestión de acceso dinámico y otras tecnologías de protección de información dinámica pueden respaldar la protección de la información incluso cuando los datos se comparten más allá de la organización de origen, donde no se pueden aplicar los controles de acceso tradicionales. Se puede aplicar a documentos, correos electrónicos u otros archivos que contengan información para limitar quién puede acceder al contenido y de qué manera. Puede ser a nivel granular y adaptarse a lo largo del ciclo de vida de la información.',
      },
      {
        tipo: 'parrafo',
        texto: 'Las técnicas de gestión de acceso dinámico no reemplazan la gestión de acceso clásica [p. ej., el uso de listas de control de acceso (ACL)], pero pueden agregar más factores de condicionalidad, evaluación en tiempo real, reducción de datos justo a tiempo y otras mejoras que pueden ser útiles para el información más sensible. Ofrece una forma de controlar el acceso fuera del entorno de la organización. La respuesta a incidentes se puede respaldar con técnicas de gestión de acceso dinámico, ya que los permisos se pueden modificar o revocar en cualquier momento.',
      },
      {
        tipo: 'parrafo',
        texto: 'En ISO/IEC 29146 se proporciona información adicional sobre un marco para la gestión de acceso.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A8.5': {
    fuente: {
      apartado: '8.5',
      paginasPdf: '95 a 97',
      paginasImpresas: '87 a 89',
    },
    descripcion: 'Las tecnologías y los procedimientos de autenticación segura deben implementarse en función de las restricciones de acceso a la información y la política específica del tema sobre el control de acceso.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'Se debe elegir una técnica de autenticación adecuada para corroborar la identidad reclamada de un usuario, software, mensajes y otras entidades.',
      },
      {
        tipo: 'parrafo',
        texto: 'La fuerza de la autenticación debe ser adecuada para la clasificación de la información a la que se accede. Cuando se requiera una fuerte autenticación y verificación de identidad, los métodos de autenticación Se deben utilizar alternativas a las contraseñas, como certificados digitales, tarjetas inteligentes, tokens o medios biométricos.',
      },
      {
        tipo: 'parrafo',
        texto: 'La información de autenticación debe ir acompañada de factores de autenticación adicionales para acceder a los sistemas de información crítica (también conocida como autenticación de múltiples factores). El uso de una combinación de múltiples factores de autenticación, como lo que sabe, lo que tiene y lo que es, reduce las posibilidades de accesos no autorizados. La autenticación multifactor se puede combinar con otras técnicas para requerir factores adicionales en circunstancias específicas, en función de reglas y patrones predefinidos, como el acceso desde una ubicación inusual, desde un dispositivo inusual o en un momento inusual.',
      },
      {
        tipo: 'parrafo',
        texto: 'La información de autenticación biométrica debe invalidarse si alguna vez se ve comprometida. La autenticación biométrica puede no estar disponible según las condiciones de uso (p. ej., humedad o envejecimiento). Para prepararse para estos problemas, la autenticación biométrica debe ir acompañada de al menos una técnica de autenticación alternativa.',
      },
      {
        tipo: 'parrafo',
        texto: 'El procedimiento para iniciar sesión en un sistema o aplicación debe estar diseñado para minimizar el riesgo de acceso no autorizado. Los procedimientos y tecnologías de inicio de sesión deben implementarse teniendo en cuenta lo siguiente:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) no mostrar información confidencial del sistema o de la aplicación hasta que el proceso de inicio de sesión se haya completado con éxito para evitar proporcionar asistencia innecesaria a un usuario no autorizado;',
          },
          {
            texto: 'b) exhibir un aviso general advirtiendo que el sistema o la aplicación o el servicio solo deben ser accedidos por usuarios autorizados;',
          },
          {
            texto: 'c) no proporcionar mensajes de ayuda durante el procedimiento de inicio de sesión que ayuden a un usuario no autorizado (por ejemplo, si surge una condición de error, el sistema no debe indicar qué parte de los datos es correcta o incorrecta);',
          },
          {
            texto: 'd) validar la información de inicio de sesión solo al completar todos los datos de entrada;',
          },
          {
            texto: 'e) protección contra intentos de inicio de sesión de fuerza bruta en nombres de usuario y contraseñas [p. ej., usar la prueba de Turing pública completamente automatizada para diferenciar a las computadoras de los humanos (CAPTCHA), requerir el restablecimiento de la contraseña después de un número predefinido de intentos fallidos o bloquear al usuario después de un número máximo de errores];',
          },
          {
            texto: 'f) registrar intentos fallidos y exitosos;',
          },
          {
            texto: 'g) generar un evento de seguridad si se detecta un intento potencial o una violación exitosa de los controles de inicio de sesión (p. ej., enviar una alerta al usuario ya los administradores del sistema de la organización cuando se alcanza un cierto número de intentos de contraseña incorrectos);',
          },
          {
            texto: 'h) mostrar o enviar la siguiente información en un canal separado al completar un inicio de sesión exitoso:',
            subitems: [
              '1) fecha y hora del inicio de sesión exitoso anterior;',
              '2) detalles de cualquier intento fallido de inicio de sesión desde el último inicio de sesión exitoso;',
            ],
          },
          {
            texto: 'i) no mostrar una contraseña en texto claro cuando se ingresa; en algunos casos, puede ser necesario desactivar esta funcionalidad para facilitar el inicio de sesión del usuario (por ejemplo, por razones de accesibilidad o para evitar el bloqueo de usuarios debido a errores repetidos);',
          },
          {
            texto: 'j) no transmitir contraseñas en texto claro a través de una red para evitar ser capturado por un programa "sniffer" de la red;',
          },
          {
            texto: 'k) finalizar sesiones inactivas después de un período definido de inactividad, especialmente en ubicaciones de alto riesgo, como áreas públicas o externas fuera de la gestión de seguridad de la organización o en los dispositivos de punto final del usuario;',
          },
          {
            texto: 'l) restringir los tiempos de duración de la conexión para proporcionar seguridad adicional para aplicaciones de alto riesgo y reducir la ventana de oportunidad para el acceso no autorizado.',
          },
        ],
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Se puede encontrar información adicional sobre la garantía de autenticación de entidades en ISO/IEC 29115.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A8.10': {
    fuente: {
      apartado: '8.10',
      paginasPdf: '106 a 107',
      paginasImpresas: '97 a 98',
    },
    descripcion: 'La información almacenada en sistemas de información, dispositivos o en cualquier otro medio de almacenamiento debe ser eliminada cuando ya no sea necesaria.',
    guia: [
      {
        tipo: 'subtitulo',
        texto: 'General',
      },
      {
        tipo: 'parrafo',
        texto: 'La información confidencial no debe conservarse más tiempo del necesario para reducir el riesgo de divulgación no deseada.',
      },
      {
        tipo: 'parrafo',
        texto: 'Al eliminar información sobre sistemas, aplicaciones y servicios, se debe considerar lo siguiente:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) seleccionar un método de eliminación (p. ej., sobrescritura electrónica o borrado criptográfico) de acuerdo con los requisitos comerciales y teniendo en cuenta las leyes y reglamentos pertinentes;',
          },
          {
            texto: 'b) registrar los resultados de la eliminación como prueba;',
          },
          {
            texto: 'c) al utilizar proveedores de servicios de eliminación de información, obtener evidencia de la eliminación de información de ellos.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando terceros almacenen la información de la organización en su nombre, la organización debe considerar la inclusión de requisitos sobre la eliminación de información en los acuerdos de terceros para hacerlos cumplir durante y después de la finalización de dichos servicios.',
      },
      {
        tipo: 'subtitulo',
        texto: 'Métodos de eliminación',
      },
      {
        tipo: 'parrafo',
        texto: 'De acuerdo con la política de retención de datos específica del tema de la organización y teniendo en cuenta la legislación y las reglamentaciones pertinentes, la información confidencial debe eliminarse cuando ya no se necesite:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) configurar sistemas para destruir información de forma segura cuando ya no se necesite (por ejemplo, después de un período definido sujeto a la política específica del tema sobre retención de datos o por solicitud de acceso del sujeto);',
          },
          {
            texto: 'b) eliminar versiones obsoletas, copias y archivos temporales dondequiera que se encuentren;',
          },
          {
            texto: 'c) usar un software de eliminación seguro y aprobado para eliminar información de forma permanente para ayudar a garantizar que la información no se pueda recuperar mediante el uso de herramientas forenses o de recuperación especializadas;',
          },
          {
            texto: 'd) usar proveedores aprobados y certificados de servicios de eliminación segura;',
          },
          {
            texto: 'e) utilizar mecanismos de eliminación apropiados para el tipo de medio de almacenamiento que se va a eliminar (p. ej., desmagnetización de unidades de disco duro y otros medios de almacenamiento magnético).',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando se utilizan servicios en la nube, la organización debe verificar si el método de eliminación proporcionado por el proveedor de servicios en la nube es aceptable y, de ser así, la organización debe usarlo o solicitar que el proveedor de servicios en la nube elimine la información. Estos procesos de eliminación deben automatizarse en de acuerdo con las políticas específicas del tema, cuando estén disponibles y sean aplicables. Dependiendo de la confidencialidad de la información eliminada, los registros pueden rastrear o verificar que estos procesos de eliminación hayan ocurrido.',
      },
      {
        tipo: 'parrafo',
        texto: 'Para evitar la exposición involuntaria de información confidencial cuando el equipo se devuelve a los proveedores, la información confidencial debe protegerse eliminando los almacenamientos auxiliares (por ejemplo, unidades de disco duro) y la memoria antes de que el equipo abandone las instalaciones de la organización.',
      },
      {
        tipo: 'parrafo',
        texto: 'Teniendo en cuenta que la eliminación segura de algunos dispositivos (por ejemplo, teléfonos inteligentes) solo se puede lograr mediante la destrucción o el uso de las funciones integradas en estos dispositivos (por ejemplo, "restaurar la configuración de fábrica"), la organización debe elegir el método apropiado de acuerdo con la clasificación de la información manejada por tales dispositivos.',
      },
      {
        tipo: 'parrafo',
        texto: 'Medidas de control descritas en7.14 debe aplicarse para destruir físicamente el dispositivo de almacenamiento y eliminar simultáneamente la información que contiene.',
      },
      {
        tipo: 'parrafo',
        texto: 'Un registro oficial de borrado de información es útil a la hora de analizar la causa de un posible evento de fuga de información.',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Puede encontrar información sobre la eliminación de datos de usuario en servicios en la nube en ISO/IEC 27017.',
      },
      {
        tipo: 'parrafo',
        texto: 'La información sobre la eliminación de PII se puede encontrar en ISO/IEC 27555.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A8.11': {
    fuente: {
      apartado: '8.11',
      paginasPdf: '107 a 109',
      paginasImpresas: '98 a 100',
    },
    descripcion: 'El enmascaramiento de datos se debe utilizar de acuerdo con la política específica del tema de la organización sobre el control de acceso y otras políticas relacionadas con el tema específico, y los requisitos comerciales, teniendo en cuenta la legislación aplicable.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'Cuando la protección de datos confidenciales (p. ej., PII) sea una preocupación, la organización debería considerar ocultar dichos datos mediante el uso de técnicas como el enmascaramiento de datos, la seudonimización o la anonimización.',
      },
      {
        tipo: 'parrafo',
        texto: 'Las técnicas de seudonimización o anonimización pueden ocultar la PII, disfrazar la verdadera identidad de los titulares de la PII u otra información confidencial, y desconectar el vínculo entre la PII y la identidad del titular de la PII o el vínculo entre otra información confidencial.',
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando se utilicen técnicas de seudonimización o anonimización, se debe verificar que los datos hayan sido adecuadamente seudonimizados o anonimizados. La anonimización de datos debe considerar todos los elementos de la información sensible para ser efectivos. A modo de ejemplo, si no se considera adecuadamente, una persona puede ser identificada incluso si los datos que pueden identificarla directamente se anonimizan, por la presencia de otros datos que permiten identificar a la persona indirectamente.',
      },
      {
        tipo: 'parrafo',
        texto: 'Las técnicas adicionales para el enmascaramiento de datos incluyen:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) encriptación (que requiere que los usuarios autorizados tengan una clave);',
          },
          {
            texto: 'b) anular o eliminar caracteres (evitando que los usuarios no autorizados vean los mensajes completos);',
          },
          {
            texto: 'c) números y fechas variables;',
          },
          {
            texto: 'd) sustitución (cambiar un valor por otro para ocultar datos sensibles);',
          },
          {
            texto: 'e) reemplazar valores con su hash.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Se debe considerar lo siguiente al implementar técnicas de enmascaramiento de datos:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) no otorgar a todos los usuarios acceso a todos los datos, por lo tanto, diseñar consultas y máscaras para mostrar solo los datos mínimos requeridos al usuario;',
          },
          {
            texto: 'b) hay casos en los que algunos datos no deberían ser visibles para el usuario para algunos registros de un conjunto de datos; en este caso, diseñar e implementar un mecanismo para la ofuscación de datos (por ejemplo, si un paciente no quiere que el personal del hospital pueda ver todos sus registros, incluso en caso de emergencia, entonces el personal del hospital recibe datos parcialmente ofuscados y los datos solo pueden ser accedidos por personal con roles específicos si contienen información útil para un tratamiento adecuado);',
          },
          {
            texto: 'c) cuando los datos están ofuscados, dando al director de PII la posibilidad de exigir que los usuarios no puedan ver si los datos están ofuscados (ofuscación de la ofuscación; esto se usa en los centros de salud, por ejemplo, si el paciente no quiere que el personal vea esa información confidencial). se ha ofuscado información como embarazos o resultados de análisis de sangre);',
          },
          {
            texto: 'd) cualquier requisito legal o reglamentario (p. ej., exigir el enmascaramiento de la información de las tarjetas de pago durante el procesamiento o el almacenamiento).',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Se debe tener en cuenta lo siguiente al utilizar el enmascaramiento de datos, la seudonimización o la anonimización:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) nivel de fuerza del enmascaramiento de datos, seudonimización o anonimización según el uso de los datos procesados;',
          },
          {
            texto: 'b) controles de acceso a los datos procesados;',
          },
          {
            texto: 'c) acuerdos o restricciones en el uso de los datos procesados;',
          },
          {
            texto: 'd) prohibir cotejar los datos procesados   con otra información para identificar al principal de la PII;',
          },
          {
            texto: 'e) realizar un seguimiento del suministro y recepción de los datos tratados.',
          },
        ],
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'La anonimización altera irreversiblemente la PII de tal manera que el principal de la PII ya no se puede identificar directa o indirectamente.',
      },
      {
        tipo: 'parrafo',
        texto: 'La seudonimización reemplaza la información de identificación con un alias. El conocimiento del algoritmo (a veces denominado "información adicional") utilizado para realizar la seudonimización permite al menos alguna forma de identificación del principal de PII. Por lo tanto, dicha “información adicional” debe mantenerse separada y protegida.',
      },
      {
        tipo: 'parrafo',
        texto: 'Si bien la seudonimización es, por lo tanto, más débil que la anonimización, los conjuntos de datos seudonimizados pueden ser más útiles en la investigación estadística.',
      },
      {
        tipo: 'parrafo',
        texto: 'El enmascaramiento de datos es un conjunto de técnicas para ocultar, sustituir u ofuscar elementos de datos confidenciales. El enmascaramiento de datos puede ser estático (cuando los elementos de datos están enmascarados en la base de datos original), dinámico (usando automatización y reglas para proteger los datos en tiempo real) o sobre la marcha (con datos enmascarados en la memoria de una aplicación).',
      },
      {
        tipo: 'parrafo',
        texto: 'Las funciones hash se pueden utilizar para anonimizar la PII. Para evitar ataques de enumeración, siempre deben combinarse con una función salt.',
      },
      {
        tipo: 'parrafo',
        texto: 'La PII en los identificadores de recursos y sus atributos [por ejemplo, nombres de archivo, localizadores uniformes de recursos (URL)] debe evitarse o anonimizarse adecuadamente.',
      },
      {
        tipo: 'parrafo',
        texto: 'En ISO/IEC 27018 se proporcionan controles adicionales relacionados con la protección de PII en nubes públicas.',
      },
      {
        tipo: 'parrafo',
        texto: 'Información adicional sobre técnicas de desidentificación está disponible en ISO/IEC 20889.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A8.12': {
    fuente: {
      apartado: '8.12',
      paginasPdf: '109 a 110',
      paginasImpresas: '100 a 101',
    },
    descripcion: 'Las medidas de prevención de fuga de datos deben aplicarse a los sistemas, redes y cualquier otro dispositivo que procese, almacene o transmita información confidencial.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'La organización debería considerar lo siguiente para reducir el riesgo de fuga de datos:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) identificar y clasificar la información para protegerla contra fugas (p. ej., información personal, modelos de precios y diseños de productos);',
          },
          {
            texto: 'b) monitorear los canales de fuga de datos (por ejemplo, correo electrónico, transferencias de archivos, dispositivos móviles y dispositivos portátiles de almacenamiento);',
          },
          {
            texto: 'c) actuar para evitar que se filtre información (p. ej., poner en cuarentena los correos electrónicos que contengan información confidencial).',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Las herramientas de prevención de fuga de datos deben utilizarse para:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) identificar y monitorear información sensible en riesgo de divulgación no autorizada (por ejemplo, en datos no estructurados en el sistema de un usuario);',
          },
          {
            texto: 'b) detectar la divulgación de información confidencial (p. ej., cuando la información se carga en servicios en la nube de terceros no confiables o se envía por correo electrónico);',
          },
          {
            texto: 'c) bloquear las acciones de los usuarios o las transmisiones de la red que expongan información confidencial (p. ej., impedir que se copien las entradas de la base de datos en una hoja de cálculo).',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'La organización debe determinar si es necesario restringir la capacidad de un usuario para copiar y pegar o cargar datos en servicios, dispositivos y medios de almacenamiento fuera de la organización. Si ese es el caso, la organización debe implementar tecnología como herramientas de prevención de fuga de datos o la configuración de herramientas existentes que permitan a los usuarios ver y manipular datos almacenados de forma remota pero evitar copiar y pegar fuera del control de la organización.',
      },
      {
        tipo: 'parrafo',
        texto: 'Si se requiere la exportación de datos, se debe permitir que el propietario de los datos apruebe la exportación y responsabilice a los usuarios por sus acciones.',
      },
      {
        tipo: 'parrafo',
        texto: 'La toma de capturas de pantalla o fotografías de la pantalla debe abordarse a través de los términos y condiciones de uso, capacitación y auditoría.',
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando se realiza una copia de seguridad de los datos, se debe tener cuidado para garantizar que la información confidencial esté protegida mediante medidas como el cifrado, el control de acceso y la protección física de los medios de almacenamiento que contienen la copia de seguridad.',
      },
      {
        tipo: 'parrafo',
        texto: 'También se debe considerar la prevención de fuga de datos para protegerse contra las acciones de inteligencia de un adversario de obtener información confidencial o secreta (geopolítica, humana, financiera, comercial, científica o cualquier otra) que puede ser de interés para el espionaje o puede ser crítica para la comunidad. . El Las acciones de prevención de fuga de datos deben estar orientadas a confundir las decisiones del adversario, por ejemplo, reemplazando información auténtica con información falsa, ya sea como una acción independiente o como respuesta a las acciones de inteligencia del adversario. Ejemplos de este tipo de acciones son la ingeniería social inversa o el uso de honeypots para atraer a los atacantes.',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Las herramientas de prevención de fuga de datos están diseñadas para identificar datos, monitorear el uso y el movimiento de datos y tomar medidas para evitar la fuga de datos (por ejemplo, alertar a los usuarios sobre su comportamiento de riesgo y bloquear la transferencia de datos a dispositivos portátiles de almacenamiento).',
      },
      {
        tipo: 'parrafo',
        texto: 'La prevención de la fuga de datos implica de forma inherente el control de las comunicaciones y las actividades en línea del personal y, por extensión, los mensajes de terceros, lo que plantea problemas legales que deben tenerse en cuenta antes de implementar herramientas de prevención de la fuga de datos. Existe una variedad de legislación relacionada con la privacidad, la protección de datos, el empleo, la interceptación de datos y las telecomunicaciones que es aplicable al monitoreo y procesamiento de datos en el contexto de la prevención de fugas de datos.',
      },
      {
        tipo: 'parrafo',
        texto: 'La prevención de la fuga de datos puede estar respaldada por controles de seguridad estándar, como políticas específicas de un tema sobre el control de acceso y la gestión segura de documentos (consulte5.12 y5.15 ).',
      },
    ],
    conceptos: ['Proteger', 'Detectar'],
    dominios: ['Protección', 'Defensa'],
  },
  'A8.13': {
    fuente: {
      apartado: '8.13',
      paginasPdf: '110 a 111',
      paginasImpresas: '101 a 102',
    },
    descripcion: 'Las copias de respaldo de la información, el software y los sistemas deben mantenerse y probarse regularmente de acuerdo con la política de respaldo específica del tema acordada.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'Se debe establecer una política de respaldo específica del tema para abordar los requisitos de seguridad de la información y retención de datos de la organización.',
      },
      {
        tipo: 'parrafo',
        texto: 'Se deben proporcionar instalaciones de respaldo adecuadas para garantizar que toda la información y el software esenciales se puedan recuperar después de un incidente, falla o pérdida de medios de almacenamiento.',
      },
      {
        tipo: 'parrafo',
        texto: 'Se deben desarrollar e implementar planes sobre cómo la organización respaldará la información, el software y los sistemas, para abordar la política específica del tema sobre respaldo.',
      },
      {
        tipo: 'parrafo',
        texto: 'Al diseñar un plan de respaldo, se deben tener en cuenta los siguientes elementos:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) la producción de registros precisos y completos de las copias de seguridad y los procedimientos de restauración documentados;',
          },
          {
            texto: 'b) reflejar los requisitos comerciales de la organización (p. ej., el objetivo del punto de recuperación, véase 5.30 ), los requisitos de seguridad de la información involucrada y la criticidad de la información para la operación continua de la organización en la medida (por ejemplo, copia de seguridad completa o diferencial) y la frecuencia de las copias de seguridad;',
          },
          {
            texto: 'c) almacenar las copias de seguridad en una ubicación remota segura y protegida, a una distancia suficiente para escapar de cualquier daño de un desastre en el sitio principal;',
          },
          {
            texto: 'd) dar a la información de respaldo un nivel adecuado de protección física y ambiental (ver Cláusula 7 y 8.1 ) consistente con los estándares aplicados en el sitio principal;',
          },
          {
            texto: 'e) probar regularmente los medios de respaldo para garantizar que se pueda confiar en ellos para uso de emergencia cuando sea necesario. Probar la capacidad de restaurar datos respaldados en un sistema de prueba, sin sobrescribir los medios de almacenamiento originales en caso de que el proceso de respaldo o restauración falle y cause daños o pérdidas irreparables de datos;',
          },
          {
            texto: 'f) proteger las copias de seguridad mediante encriptación de acuerdo con los riesgos identificados (por ejemplo, en situaciones donde la confidencialidad es importante);',
          },
          {
            texto: 'g) asegurarse de que se detecte la pérdida inadvertida de datos antes de realizar la copia de seguridad.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Los procedimientos operativos deben monitorear la ejecución de las copias de seguridad y abordar las fallas de las copias de seguridad programadas para garantizar la integridad de las copias de seguridad de acuerdo con la política de copias de seguridad específica del tema.',
      },
      {
        tipo: 'parrafo',
        texto: 'Las medidas de respaldo para los sistemas y servicios individuales deben probarse regularmente para garantizar que cumplan con los objetivos de los planes de respuesta a incidentes y continuidad del negocio (ver5.30 ). Esto debe combinarse con una prueba de los procedimientos de restauración y compararse con el tiempo de restauración requerido por el plan de continuidad del negocio. En el caso de sistemas y servicios críticos, las medidas de respaldo deben cubrir toda la información de los sistemas, las aplicaciones y los datos necesarios para recuperar el sistema completo en caso de un desastre.',
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando la organización utiliza un servicio en la nube, se deben realizar copias de seguridad de la información, las aplicaciones y los sistemas de la organización en el entorno del servicio en la nube. La organización debe determinar si se cumplen los requisitos de copia de seguridad y cómo se cumplen cuando se utiliza el servicio de copia de seguridad de la información proporcionado como parte del servicio en la nube.',
      },
      {
        tipo: 'parrafo',
        texto: 'El período de retención de la información comercial esencial debe determinarse, teniendo en cuenta cualquier requisito para la retención de copias de archivo. La organización debe considerar la eliminación de la información (ver8.10 ) en los medios de almacenamiento utilizados para la copia de seguridad una vez que expire el período de retención de la información y debe tener en cuenta la legislación y las reglamentaciones.',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Para obtener más información sobre la seguridad del almacenamiento, incluida la consideración de retención, consulte ISO/IEC 27040.',
      },
    ],
    conceptos: ['Recuperar'],
    dominios: ['Protección'],
  },
  'A8.15': {
    fuente: {
      apartado: '8.15',
      paginasPdf: '112 a 115',
      paginasImpresas: '103 a 106',
    },
    descripcion: 'Se deben producir, almacenar, proteger y analizar registros que registren actividades, excepciones, fallas y otros eventos relevantes.',
    guia: [
      {
        tipo: 'subtitulo',
        texto: 'General',
      },
      {
        tipo: 'parrafo',
        texto: 'La organización debe determinar el propósito para el cual se crean los registros, qué datos se recopilan y registran y cualquier requisito específico del registro para proteger y manejar los datos de registro. Esto debe documentarse en una política específica del tema sobre el registro.',
      },
      {
        tipo: 'parrafo',
        texto: 'Los registros de eventos deben incluir para cada evento, según corresponda:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) identificaciones de usuario;',
          },
          {
            texto: 'b) actividades del sistema;',
          },
          {
            texto: 'c) fechas, horas y detalles de eventos relevantes (por ejemplo, inicio y cierre de sesión);',
          },
          {
            texto: 'd) identidad del dispositivo, identificador del sistema y ubicación;',
          },
          {
            texto: 'e) direcciones de red y protocolos.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Los siguientes eventos deben ser considerados para el registro:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) intentos de acceso al sistema exitosos y rechazados;',
          },
          {
            texto: 'b) datos exitosos y rechazados y otros intentos de acceso a recursos;',
          },
          {
            texto: 'c) cambios en la configuración del sistema;',
          },
          {
            texto: 'd) uso de privilegios;',
          },
          {
            texto: 'e) uso de programas de utilidad y aplicaciones;',
          },
          {
            texto: 'f) los archivos a los que se accede y el tipo de acceso, incluida la eliminación de archivos de datos importantes;',
          },
          {
            texto: 'g) alarmas emitidas por el sistema de control de acceso;',
          },
          {
            texto: 'h) activación y desactivación de sistemas de seguridad, como sistemas antivirus y sistemas de detección de intrusos;',
          },
          {
            texto: 'i) creación, modificación o supresión de identidades;',
          },
          {
            texto: 'j) transacciones ejecutadas por los usuarios en las aplicaciones. En algunos casos, las aplicaciones son un servicio o producto proporcionado o ejecutado por un tercero.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Es importante que todos los sistemas tengan fuentes de tiempo sincronizadas (ver8.17 ) ya que esto permite la correlación de registros entre sistemas para el análisis, alerta e investigación de un incidente.',
      },
      {
        tipo: 'subtitulo',
        texto: 'Protección de registros',
      },
      {
        tipo: 'parrafo',
        texto: 'Los usuarios, incluidos aquellos con derechos de acceso privilegiados, no deben tener permiso para eliminar o desactivar registros de sus propias actividades. Pueden potencialmente manipular los registros en las instalaciones de procesamiento de información bajo su control directo. Por lo tanto, es necesario proteger y revisar los registros para mantener la responsabilidad de los usuarios privilegiados.',
      },
      {
        tipo: 'parrafo',
        texto: 'Los controles deben tener como objetivo proteger contra cambios no autorizados en la información de registro y problemas operativos con la instalación de registro, incluidos:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) alteraciones en los tipos de mensajes que se registran;',
          },
          {
            texto: 'b) archivos de registro que se están editando o eliminando;',
          },
          {
            texto: 'c) falla en el registro de eventos o sobreescritura de eventos pasados   registrados si se excede el medio de almacenamiento que contiene un archivo de registro.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Para la protección de los registros, se debe considerar el uso de las siguientes técnicas: hashing criptográfico, registro en un archivo de solo lectura y solo para agregar, registro en un archivo de transparencia pública.',
      },
      {
        tipo: 'parrafo',
        texto: 'Es posible que se requiera archivar algunos registros de auditoría debido a los requisitos sobre la retención de datos o los requisitos para recopilar y conservar evidencia (ver5.28 ).',
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando la organización necesite enviar registros del sistema o de la aplicación a un proveedor para ayudar con la depuración o la resolución de errores, los registros deben anonimizarse cuando sea posible utilizando técnicas de enmascaramiento de datos (ver 8.11 ) para obtener información como nombres de usuario, direcciones de protocolo de Internet (IP), nombres de host o nombre de la organización, antes de enviarlo al proveedor.',
      },
      {
        tipo: 'parrafo',
        texto: 'Los registros de eventos pueden contener datos confidenciales e información de identificación personal. Deben tomarse las medidas adecuadas de protección de la privacidad (ver5.34 ).',
      },
      {
        tipo: 'subtitulo',
        texto: 'Análisis de registro',
      },
      {
        tipo: 'parrafo',
        texto: 'El análisis de registros debe cubrir el análisis y la interpretación de los eventos de seguridad de la información, para ayudar a identificar actividades inusuales o comportamientos anómalos, que pueden representar indicadores de compromiso.',
      },
      {
        tipo: 'parrafo',
        texto: 'El análisis de los eventos debe realizarse teniendo en cuenta:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) las habilidades necesarias para los expertos que realizan el análisis;',
          },
          {
            texto: 'b) determinar el procedimiento de análisis de registros;',
          },
          {
            texto: 'c) los atributos requeridos de cada evento relacionado con la seguridad;',
          },
          {
            texto: 'd) excepciones identificadas mediante el uso de reglas predeterminadas [por ejemplo, gestión de eventos e información de seguridad (SIEM) o reglas de cortafuegos, y sistemas de detección de intrusos (IDS) o firmas de malware];',
          },
          {
            texto: 'e) patrones de comportamiento conocidos y tráfico de red estándar en comparación con actividad y comportamiento anómalos [análisis de comportamiento de usuarios y entidades (UEBA)];',
          },
          {
            texto: 'f) resultados del análisis de tendencias o patrones (p. ej., como resultado del uso de análisis de datos, técnicas de macrodatos y herramientas de análisis especializadas);',
          },
          {
            texto: 'g) inteligencia de amenazas disponible.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'El análisis de registros debe estar respaldado por actividades de monitoreo específicas para ayudar a identificar y analizar el comportamiento anómalo, que incluye:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) revisar los intentos exitosos y fallidos de acceder a los recursos protegidos [por ejemplo, servidores del sistema de nombres de dominio (DNS), portales web y recursos compartidos de archivos];',
          },
          {
            texto: 'b) verificar los registros de DNS para identificar conexiones de red salientes a servidores maliciosos, como los asociados con servidores de comando y control de botnet;',
          },
          {
            texto: 'c) examinar los informes de uso de los proveedores de servicios (p. ej., facturas o informes de servicios) en busca de actividad inusual dentro de los sistemas y redes (p. ej., mediante la revisión de patrones de actividad);',
          },
          {
            texto: 'd) incluir registros de eventos de monitoreo físico, como entrada y salida, para garantizar una detección y un análisis de incidentes más precisos;',
          },
          {
            texto: 'e) correlación de registros para permitir un análisis eficiente y altamente preciso.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Los incidentes de seguridad de la información presuntos y reales deben identificarse (p. ej., infección de malware o sondeo de cortafuegos) y estar sujetos a una mayor investigación (p. ej., como parte de un proceso de gestión de incidentes de seguridad de la información, consulte5.25 ).',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Los registros del sistema suelen contener un gran volumen de información, gran parte de la cual es ajena al control de la seguridad de la información. Para ayudar a identificar eventos significativos con fines de monitoreo de la seguridad de la información, se puede considerar el uso de programas de utilidad o herramientas de auditoría adecuados para realizar la interrogación de archivos.',
      },
      {
        tipo: 'parrafo',
        texto: 'El registro de eventos sienta las bases para los sistemas de monitoreo automatizados (ver8.16 ) que son capaces de generar informes consolidados y alertas sobre la seguridad del sistema.',
      },
      {
        tipo: 'parrafo',
        texto: 'Se puede utilizar una herramienta SIEM o un servicio equivalente para almacenar, correlacionar, normalizar y analizar la información de registro., y generar alertas. Los SIEM tienden a requerir una configuración cuidadosa para optimizar sus beneficios. Las configuraciones a considerar incluyen la identificación y selección de fuentes de registro apropiadas, ajuste y prueba de reglas y desarrollo de casos de uso.',
      },
      {
        tipo: 'parrafo',
        texto: 'Los archivos de transparencia pública para el registro de registros se utilizan, por ejemplo, en sistemas de transparencia de certificados. Dichos archivos pueden proporcionar un mecanismo de detección adicional útil para protegerse contra la manipulación del registro.',
      },
      {
        tipo: 'parrafo',
        texto: 'En entornos de nube, las responsabilidades de gestión de registros se pueden compartir entre el cliente del servicio de nube y el proveedor de servicios de nube. Las responsabilidades varían según el tipo de servicio en la nube que se utilice. Se puede encontrar más orientación en ISO/IEC 27017.',
      },
    ],
    conceptos: ['Detectar'],
    dominios: ['Protección', 'Defensa'],
  },
  'A8.20': {
    fuente: {
      apartado: '8.20',
      paginasPdf: '120 a 121',
      paginasImpresas: '111 a 112',
    },
    descripcion: 'Las redes y los dispositivos de red deben protegerse, administrarse y controlarse para proteger la información en los sistemas y aplicaciones.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'Se deben implementar controles para garantizar la seguridad de la información en las redes y para proteger los servicios conectados del acceso no autorizado. En particular, se deben considerar los siguientes elementos:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) el tipo y nivel de clasificación de la información que la red puede soportar;',
          },
          {
            texto: 'b) establecer responsabilidades y procedimientos para la gestión de equipos y dispositivos de red;',
          },
          {
            texto: 'c) mantener la documentación actualizada, incluidos los diagramas de red y los archivos de configuración de los dispositivos (por ejemplo, enrutadores, conmutadores);',
          },
          {
            texto: 'd) separar la responsabilidad operativa de las redes de las operaciones del sistema TIC cuando corresponda (ver5.3 );',
          },
          {
            texto: 'e) establecer controles para salvaguardar la confidencialidad e integridad de los datos que pasan por redes públicas, redes de terceros o redes inalámbricas y para proteger los sistemas y aplicaciones conectados (ver5.22 ,8.24 ,5.14 y6.6 ). También se pueden requerir controles adicionales para mantener la disponibilidad de los servicios de red y las computadoras conectadas a la red;',
          },
          {
            texto: 'f) registro y monitoreo adecuados para permitir el registro y la detección de acciones que pueden afectar o son relevantes para la seguridad de la información (ver8.16 y8.15 );',
          },
          {
            texto: 'g) coordinar estrechamente las actividades de gestión de la red tanto para optimizar el servicio a la organización como para garantizar que los controles se apliquen de forma coherente en toda la infraestructura de procesamiento de la información;',
          },
          {
            texto: 'h) sistemas de autenticación en la red;',
          },
          {
            texto: 'i) restringir y filtrar la conexión de los sistemas a la red (por ejemplo, usando firewalls);',
          },
          {
            texto: 'j) detectar, restringir y autenticar la conexión de equipos y dispositivos a la red;',
          },
          {
            texto: 'k) endurecimiento de los dispositivos de red;',
          },
          {
            texto: 'l) segregar los canales de administración de red de otro tráfico de red;',
          },
          {
            texto: 'm) aislar temporalmente subredes críticas (por ejemplo, con puentes levadizos) si la red está bajo ataque;',
          },
          {
            texto: 'n) deshabilitar protocolos de red vulnerables.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'La organización debe garantizar que se apliquen los controles de seguridad adecuados al uso de redes virtualizadas. Las redes virtualizadas también cubren las redes definidas por software (SDN, SD-WAN). Las redes virtualizadas pueden ser deseables desde el punto de vista de la seguridad, ya que pueden permitir la separación lógica de la comunicación que tiene lugar en las redes físicas, en particular para los sistemas y aplicaciones que se implementan mediante computación distribuida.',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Puede encontrar información adicional sobre la seguridad de la red en la serie ISO/IEC 27033.',
      },
      {
        tipo: 'parrafo',
        texto: 'Se puede encontrar más información sobre redes virtualizadas en ISO/IEC TS 23167.',
      },
    ],
    conceptos: ['Proteger', 'Detectar'],
    dominios: ['Protección'],
  },
  'A8.24': {
    fuente: {
      apartado: '8.24',
      paginasPdf: '124 a 126',
      paginasImpresas: '115 a 117',
    },
    descripcion: 'Deben definirse e implementarse reglas para el uso eficaz de la criptografía, incluida la gestión de claves criptográficas.',
    guia: [
      {
        tipo: 'subtitulo',
        texto: 'General',
      },
      {
        tipo: 'parrafo',
        texto: 'Al usar criptografía, se debe considerar lo siguiente:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) la política específica del tema sobre criptografía definida por la organización, incluidos los principios generales para la protección de la información. Es necesaria una política específica sobre el uso de la criptografía para maximizar los beneficios y minimizar los riesgos del uso de técnicas criptográficas y para evitar el uso inapropiado o incorrecto;',
          },
          {
            texto: 'b) identificar el nivel de protección requerido y la clasificación de la información y en consecuencia establecer el tipo, fortaleza y calidad de los algoritmos criptográficos requeridos;',
          },
          {
            texto: 'c) el uso de criptografía para la protección de la información contenida en los dispositivos móviles o medios de almacenamiento de los usuarios y transmitida a través de redes a dichos dispositivos o medios de almacenamiento;',
          },
          {
            texto: 'd) el enfoque de la gestión de claves, incluidos los métodos para gestionar la generación y protección de claves criptográficas y la recuperación de información cifrada en caso de pérdida, compromiso o daño de claves;',
          },
          {
            texto: 'e) roles y responsabilidades para:',
            subitems: [
              '1) la implementación de las reglas para el uso efectivo de la criptografía;',
              '2) la gestión de claves, incluida la generación de claves (ver8.24 );',
            ],
          },
          {
            texto: 'f) los estándares a adoptar, así como los algoritmos criptográficos, la fuerza del cifrado, las soluciones criptográficas y las prácticas de uso que se aprueban o requieren para su uso en la organización;',
          },
          {
            texto: 'g) el impacto del uso de información cifrada en los controles que se basan en la inspección de contenido (por ejemplo, detección de malware o filtrado de contenido).',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Al implementar las reglas de la organización para el uso eficaz de la criptografía, se deben tener en cuenta las reglamentaciones y las restricciones nacionales que pueden aplicarse al uso de técnicas criptográficas en diferentes partes del mundo, así como los problemas del flujo transfronterizo de información cifrada ( ver5.31 ).',
      },
      {
        tipo: 'parrafo',
        texto: 'El contenido de los acuerdos de nivel de servicio o contratos con proveedores externos de servicios criptográficos (por ejemplo, con una autoridad de certificación) debe cubrir cuestiones de responsabilidad, confiabilidad de los servicios y tiempos de respuesta para la prestación de servicios (ver5.22 ).',
      },
      {
        tipo: 'subtitulo',
        texto: 'Gestión de claves',
      },
      {
        tipo: 'parrafo',
        texto: 'La gestión adecuada de claves requiere procesos seguros para generar, almacenar, archivar, recuperar, distribuir, retirar y destruir claves criptográficas.',
      },
      {
        tipo: 'parrafo',
        texto: 'Un sistema de gestión de claves debe basarse en un conjunto acordado de normas, procedimientos y métodos seguros para:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) generar claves para diferentes sistemas criptográficos y diferentes aplicaciones;',
          },
          {
            texto: 'b) emitir y obtener certificados de clave pública;',
          },
          {
            texto: 'c) distribuir claves a las entidades previstas, incluido cómo activar las claves cuando se reciben;',
          },
          {
            texto: 'd) almacenar claves, incluida la forma en que los usuarios autorizados obtienen acceso a las claves;',
          },
          {
            texto: 'e) cambiar o actualizar las claves, incluidas las reglas sobre cuándo cambiar las claves y cómo se hará;',
          },
          {
            texto: 'f) tratar con claves comprometidas;',
          },
          {
            texto: 'g) revocación de claves, incluido cómo retirar o desactivar claves [por ejemplo, cuando las claves se han visto comprometidas o cuando un usuario abandona una organización (en cuyo caso, las claves también deben archivarse)];',
          },
          {
            texto: 'h) recuperar claves perdidas o dañadas;',
          },
          {
            texto: 'i) realizar copias de seguridad o archivar claves;',
          },
          {
            texto: 'j) destrucción de llaves;',
          },
          {
            texto: 'k) registro y auditoría de actividades clave relacionadas con la gestión;',
          },
          {
            texto: 'l) establecer fechas de activación y desactivación de claves para que las claves solo se puedan usar durante el período de tiempo de acuerdo con las reglas de la organización sobre administración de claves;',
          },
          {
            texto: 'm) tramitar solicitudes legales de acceso a claves criptográficas (p. ej., se puede exigir que la información cifrada esté disponible sin cifrar como prueba en un caso judicial).',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Todas las claves criptográficas deben protegerse contra modificaciones y pérdidas. Además, las claves secretas y privadas necesitan protección contra el uso no autorizado y la divulgación. El equipo utilizado para generar, almacenar y archivar claves debe protegerse físicamente.',
      },
      {
        tipo: 'parrafo',
        texto: 'Además de la integridad, para muchos casos de uso, también se debe considerar la autenticidad de las claves públicas.',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'La autenticidad de las claves públicas generalmente se aborda mediante procesos de administración de claves públicas que utilizan autoridades de certificación y certificados de clave pública, pero también es posible abordarla mediante el uso de tecnologías como la aplicación de procesos manuales para claves de números pequeños.',
      },
      {
        tipo: 'parrafo',
        texto: 'La criptografía se puede utilizar para lograr diferentes objetivos de seguridad de la información, por ejemplo:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) confidencialidad: uso de cifrado de información para proteger información sensible o crítica, ya sea almacenada o transmitida;',
          },
          {
            texto: 'b) integridad o autenticidad: uso de firmas digitales o códigos de autenticación de mensajes para verificar la autenticidad o integridad de la información sensible o crítica almacenada o transmitida. Usar algoritmos con el fin de verificar la integridad de los archivos;',
          },
          {
            texto: 'c) no repudio: uso de técnicas criptográficas para proporcionar evidencia de la ocurrencia o no ocurrencia de un evento o acción;',
          },
          {
            texto: 'd) autenticación: uso de técnicas criptográficas para autenticar usuarios y otras entidades del sistema que solicitan acceso o realizan transacciones con usuarios, entidades y recursos del sistema.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'La serie ISO/IEC 11770 proporciona más información sobre la gestión de claves.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
  'A8.8': {
    fuente: {
      apartado: '8.8',
      paginasPdf: '100 a 104',
      paginasImpresas: '92 a 95',
    },
    descripcion: 'Debería obtenerse información sobre las vulnerabilidades técnicas de los sistemas de información en uso, debería evaluarse la exposición de la organización a tales vulnerabilidades y deberían tomarse las medidas apropiadas.',
    guia: [
      {
        tipo: 'subtitulo',
        texto: 'Identificación de vulnerabilidades técnicas',
      },
      {
        tipo: 'parrafo',
        texto: 'La organización debe tener un inventario preciso de activos (ver5.9 a5.14 ) como requisito previo para una gestión técnica eficaz de la vulnerabilidad; el inventario debe incluir el proveedor del software, el nombre del software, los números de versión, el estado actual de implementación (por ejemplo, qué software está instalado en qué sistemas) y la(s) persona(s) dentro de la organización responsable del software.',
      },
      {
        tipo: 'parrafo',
        texto: 'Para identificar vulnerabilidades técnicas, la organización debe considerar:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) definir y establecer las funciones y responsabilidades asociadas con la gestión técnica de vulnerabilidades, incluido el monitoreo de vulnerabilidades, la evaluación de riesgos de vulnerabilidades, la actualización, el seguimiento de activos y cualquier responsabilidad de coordinación requerida;',
          },
          {
            texto: 'b) para software y otras tecnologías (basado en la lista de inventario de activos, véase5.9 ), identificando los recursos de información que se utilizarán para identificar vulnerabilidades técnicas relevantes y mantener la conciencia sobre ellas. Actualizar la lista de recursos de información en función de los cambios en el inventario o cuando se encuentren otros recursos nuevos o útiles;',
          },
          {
            texto: 'c) exigir a los proveedores de sistemas de información (incluidos sus componentes) que garanticen la notificación, el manejo y la divulgación de vulnerabilidades, incluidos los requisitos de los contratos aplicables (véase5.20 );',
          },
          {
            texto: 'd) usar herramientas de escaneo de vulnerabilidades adecuadas para las tecnologías en uso para identificar vulnerabilidades y verificar si la reparación de vulnerabilidades fue exitosa;',
          },
          {
            texto: 'e) realizar pruebas de penetración planificadas, documentadas y repetibles o evaluaciones de vulnerabilidad por parte de personas competentes y autorizadas para respaldar la identificación de vulnerabilidades. Tener precaución ya que tales actividades pueden comprometer la seguridad del sistema;',
          },
          {
            texto: 'f) rastrear el uso de bibliotecas de terceros y código fuente en busca de vulnerabilidades. Esto debe incluirse en la codificación segura (ver8.28 ).',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'La organización debe desarrollar procedimientos y capacidades para:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) detectar la existencia de vulnerabilidades en sus productos y servicios incluyendo cualquier componente externo utilizado en estos;',
          },
          {
            texto: 'b) recibir informes de vulnerabilidad de fuentes internas o externas.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'La organización debe proporcionar un punto de contacto público como parte de una política específica de un tema sobre la divulgación de vulnerabilidades para que los investigadores y otras personas puedan informar problemas. La organización debería establecer procedimientos de notificación de vulnerabilidades, formularios de notificación en línea y hacer uso de inteligencia de amenazas o foros de intercambio de información apropiados. La organización también debe considerar los programas de recompensas por errores. donde las recompensas se ofrecen como un incentivo para ayudar a las organizaciones a identificar vulnerabilidades para remediarlas adecuadamente. La organización también debería compartir información con los organismos competentes de la industria u otras partes interesadas.',
      },
      {
        tipo: 'subtitulo',
        texto: 'Evaluación de vulnerabilidades técnicas',
      },
      {
        tipo: 'parrafo',
        texto: 'Para evaluar las vulnerabilidades técnicas identificadas, se debe considerar la siguiente guía:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) analizar y verificar los informes para determinar qué actividad de respuesta y remediación se necesita;',
          },
          {
            texto: 'b) una vez identificada una potencial vulnerabilidad técnica, identificar los riesgos asociados y las acciones a tomar. Tales acciones pueden implicar la actualización de sistemas vulnerables o la aplicación de otros controles.',
          },
        ],
      },
      {
        tipo: 'subtitulo',
        texto: 'Tomar las medidas apropiadas para abordar las vulnerabilidades técnicas',
      },
      {
        tipo: 'parrafo',
        texto: 'Se debe implementar un proceso de administración de actualizaciones de software para garantizar que se instalen los parches aprobados y las actualizaciones de aplicaciones más actualizados para todo el software autorizado. Si es necesario realizar cambios, se debe conservar el software original y aplicar los cambios a una copia designada. Todos los cambios deben probarse y documentarse por completo, de modo que puedan volver a aplicarse, si es necesario, a futuras actualizaciones de software. Si es necesario, las modificaciones deben ser probadas y validadas por un organismo de evaluación independiente.',
      },
      {
        tipo: 'parrafo',
        texto: 'Se debe considerar la siguiente orientación para abordar las vulnerabilidades técnicas:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) tomar medidas apropiadas y oportunas en respuesta a la identificación de posibles vulnerabilidades técnicas; definir un cronograma para reaccionar a las notificaciones de vulnerabilidades técnicas potencialmente relevantes;',
          },
          {
            texto: 'b) dependiendo de la urgencia con la que se deba abordar una vulnerabilidad técnica, llevar a cabo la acción de acuerdo con los controles relacionados con la gestión del cambio (ver8.32 ) o siguiendo los procedimientos de respuesta a incidentes de seguridad de la información (ver5.26 );',
          },
          {
            texto: 'c) utilizar únicamente actualizaciones de fuentes legítimas (que pueden ser internas o externas a la organización);',
          },
          {
            texto: 'd) probar y evaluar las actualizaciones antes de instalarlas para garantizar que sean efectivas y que no produzcan efectos secundarios que no se puedan tolerar [es decir, si hay una actualización disponible, evaluar los riesgos asociados con la instalación de la actualización (los riesgos que plantea la vulnerabilidad deben compararse con el riesgo de instalar la actualización)];',
          },
          {
            texto: 'e) abordar primero los sistemas de alto riesgo;',
          },
          {
            texto: 'f) desarrollar soluciones (por lo general, actualizaciones o parches de software);',
          },
          {
            texto: 'g) prueba para confirmar si la remediación o mitigación es efectiva;',
          },
          {
            texto: 'h) proporcionar mecanismos para verificar la autenticidad de la remediación;',
          },
          {
            texto: 'i) si no hay ninguna actualización disponible o no se puede instalar la actualización, considerando otros controles, tales como:',
            subitems: [
              '1) aplicar cualquier solución alternativa sugerida por el proveedor de software u otras fuentes relevantes;',
              '2) apagar servicios o capacidades relacionadas con la vulnerabilidad;',
              '3) adaptar o agregar controles de acceso (por ejemplo, cortafuegos) en los límites de la red (ver8.20 a8.22 );',
              '4) proteger los sistemas, dispositivos o aplicaciones vulnerables de los ataques mediante la implementación de filtros de tráfico adecuados (a veces denominados parches virtuales);',
              '5) aumentar el monitoreo para detectar ataques reales;',
              '6) sensibilización sobre la vulnerabilidad.',
            ],
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Para el software adquirido, si los proveedores publican regularmente información sobre actualizaciones de seguridad para su software y brindan una instalación para instalar dichas actualizaciones automáticamente, la organización debe decidir si usar la actualización automática o no.',
      },
      {
        tipo: 'subtitulo',
        texto: 'Otras Consideraciones',
      },
      {
        tipo: 'parrafo',
        texto: 'Se debe mantener un registro de auditoría para todos los pasos realizados en la gestión de vulnerabilidades técnicas.',
      },
      {
        tipo: 'parrafo',
        texto: 'El proceso de gestión de vulnerabilidades técnicas debe ser monitoreado y evaluado regularmente para asegurar su efectividad y eficiencia.',
      },
      {
        tipo: 'parrafo',
        texto: 'Un proceso eficaz de gestión de vulnerabilidades técnicas debe estar alineado con las actividades de gestión de incidentes, para comunicar datos sobre vulnerabilidades a la función de respuesta a incidentes y proporcionar procedimientos técnicos que se llevarán a cabo en caso de que ocurra un incidente.',
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando la organización utiliza un servicio en la nube proporcionado por un proveedor de servicios en la nube externo, el proveedor de servicios en la nube debe garantizar la gestión de la vulnerabilidad técnica de los recursos del proveedor de servicios en la nube. Las responsabilidades del proveedor de servicios en la nube para la gestión de vulnerabilidades técnicas deben ser parte del acuerdo de servicios en la nube y esto debe incluir procesos para informar las acciones del proveedor de servicios en la nube relacionadas con las vulnerabilidades técnicas (ver5.23 ). Para algunos servicios en la nube, existen responsabilidades respectivas para el proveedor del servicio en la nube y el cliente del servicio en la nube. Por ejemplo, el cliente del servicio en la nube es responsable de la gestión de vulnerabilidades de sus propios activos utilizados para los servicios en la nube.',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'La gestión de vulnerabilidades técnicas puede verse como una subfunción de la gestión de cambios y, como tal, puede aprovechar los procesos y procedimientos de gestión de cambios (ver8.32 ).',
      },
      {
        tipo: 'parrafo',
        texto: 'Existe la posibilidad de que una actualización no resuelva el problema adecuadamente y tenga efectos secundarios negativos. Además, en algunos casos, la desinstalación de una actualización no se puede lograr fácilmente una vez que se ha aplicado la actualización.',
      },
      {
        tipo: 'parrafo',
        texto: 'Si no es posible realizar pruebas adecuadas de las actualizaciones (por ejemplo, debido a los costos o la falta de recursos), se puede considerar un retraso en la actualización para evaluar los riesgos asociados, según la experiencia informada por otros usuarios. El uso de ISO/IEC 27031 puede ser beneficioso.',
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando se produzcan parches o actualizaciones de software, la organización puede considerar proporcionar un proceso de actualización automatizado en el que estas actualizaciones se instalen en los sistemas o productos afectados sin necesidad de intervención por parte del cliente o el usuario. Si se ofrece un proceso de actualización automática, puede permitir que el cliente o usuario elija una opción para desactivar la actualización automática o controlar el tiempo de instalación de la actualización.',
      },
      {
        tipo: 'parrafo',
        texto: 'Cuando el proveedor proporciona un proceso de actualización automatizado y las actualizaciones se pueden instalar en los sistemas o productos afectados sin necesidad de intervención, la organización determina si aplica el proceso automatizado o no. Una razón para no elegir la actualización automática es mantener el control sobre cuándo se realiza la actualización. Por ejemplo, un software utilizado para una operación comercial no se puede actualizar hasta que la operación se haya completado.',
      },
      {
        tipo: 'parrafo',
        texto: 'Una debilidad del análisis de vulnerabilidades es que es posible que no tenga en cuenta completamente la defensa en profundidad: dos contramedidas que siempre se invocan en secuencia pueden tener vulnerabilidades que están enmascaradas por las fortalezas de la otra. La contramedida compuesta no es vulnerable, mientras que un escáner de vulnerabilidades puede informar que ambos componentes son vulnerables. Por lo tanto, la organización debe tener cuidado al revisar y actuar sobre los informes de vulnerabilidad.',
      },
      {
        tipo: 'parrafo',
        texto: 'Muchas organizaciones suministran software, sistemas, productos y servicios no solo dentro de la organización sino también a partes interesadas como clientes, socios u otros usuarios. Estos software, sistemas, productos y servicios pueden tener vulnerabilidades de seguridad de la información que afecten la seguridad de los usuarios.',
      },
      {
        tipo: 'parrafo',
        texto: 'Las organizaciones pueden publicar la remediación y divulgar información sobre las vulnerabilidades a los usuarios (generalmente a través de un aviso público) y proporcionar la información adecuada para los servicios de base de datos de vulnerabilidades de software.',
      },
      {
        tipo: 'parrafo',
        texto: 'Para obtener más información relacionada con la gestión de vulnerabilidades técnicas al utilizar la computación en la nube, consulte la serie ISO/IEC 19086 e ISO/IEC 27017.',
      },
      {
        tipo: 'parrafo',
        texto: 'ISO/IEC 29147 proporciona información detallada sobre cómo recibir informes de vulnerabilidad y publicar avisos de vulnerabilidad. ISO/IEC 30111 proporciona información detallada sobre el manejo y la resolución de vulnerabilidades informadas.',
      },
    ],
    conceptos: ['Identificar', 'Proteger'],
    dominios: ['Gobernanza y ecosistema', 'Protección', 'Defensa'],
  },
  'A8.31': {
    fuente: {
      apartado: '8.31',
      paginasPdf: '136 a 137',
      paginasImpresas: '127 a 128',
    },
    descripcion: 'Los entornos de desarrollo, prueba y producción deben estar separados y protegidos.',
    guia: [
      {
        tipo: 'parrafo',
        texto: 'Debe identificarse e implementarse el nivel de separación entre los entornos de producción, prueba y desarrollo que es necesario para evitar problemas de producción.',
      },
      {
        tipo: 'parrafo',
        texto: 'Se deben considerar los siguientes elementos:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) separar adecuadamente los sistemas de desarrollo y producción y operarlos en diferentes dominios (por ejemplo, en entornos físicos o virtuales separados);',
          },
          {
            texto: 'b) definir, documentar e implementar reglas y autorizaciones para el despliegue de software desde el estado de desarrollo hasta el de producción;',
          },
          {
            texto: 'c) probar los cambios en los sistemas de producción y las aplicaciones en un entorno de prueba o ensayo antes de aplicarlos a los sistemas de producción (ver8.29 );',
          },
          {
            texto: 'd) no realizar pruebas en entornos de producción excepto en circunstancias que hayan sido definidas y aprobadas;',
          },
          {
            texto: 'e) compiladores, editores y otras herramientas de desarrollo o programas de utilidad que no sean accesibles desde los sistemas de producción cuando no se requieran;',
          },
          {
            texto: 'f) mostrar etiquetas de identificación del entorno adecuadas en los menús para reducir el riesgo de error;',
          },
          {
            texto: 'g) no copiar información confidencial en los entornos del sistema de desarrollo y prueba a menos que se proporcionen controles equivalentes para los sistemas de desarrollo y prueba.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'En todos los casos, los entornos de desarrollo y pruebas deben protegerse teniendo en cuenta:',
      },
      {
        tipo: 'lista',
        items: [
          {
            texto: 'a) aplicación de parches y actualización de todas las herramientas de desarrollo, integración y prueba (incluidos constructores, integradores, compiladores, sistemas de configuración y bibliotecas);',
          },
          {
            texto: 'b) configuración segura de sistemas y software;',
          },
          {
            texto: 'c) control de acceso a los ambientes;',
          },
          {
            texto: 'd) seguimiento de cambios en el entorno y código almacenado en el mismo;',
          },
          {
            texto: 'e) monitoreo seguro de los ambientes;',
          },
          {
            texto: 'f) realizar copias de seguridad de los entornos.',
          },
        ],
      },
      {
        tipo: 'parrafo',
        texto: 'Una sola persona no debe tener la capacidad de realizar cambios tanto en el desarrollo como en la producción sin una revisión y aprobación previas. Esto se puede lograr, por ejemplo, mediante la segregación de los derechos de acceso o mediante reglas supervisadas. En situaciones excepcionales, se deben implementar medidas adicionales como registro detallado y monitoreo en tiempo real para detectar y actuar sobre cambios no autorizados.',
      },
    ],
    otraInformacion: [
      {
        tipo: 'parrafo',
        texto: 'Sin medidas y procedimientos adecuados, los desarrolladores y evaluadores que tienen acceso a los sistemas de producción pueden presentar riesgos significativos (por ejemplo, modificación no deseada de los archivos o del entorno del sistema, falla del sistema, ejecución de código no autorizado y no probado en los sistemas de producción, divulgación de datos confidenciales, integridad de datos y problemas de disponibilidad ). Es necesario mantener un entorno conocido y estable en el que realizar pruebas significativas y evitar el acceso inapropiado del desarrollador al entorno de producción.',
      },
      {
        tipo: 'parrafo',
        texto: 'Las medidas y los procedimientos incluyen roles cuidadosamente diseñados junto con la implementación de requisitos de segregación de tareas y la implementación de procesos de monitoreo adecuados.',
      },
      {
        tipo: 'parrafo',
        texto: 'El personal de desarrollo y pruebas también representa una amenaza para la confidencialidad de la información de producción. Las actividades de desarrollo y prueba pueden provocar cambios no deseados en el software o la información si comparten el mismo entorno informático. Por lo tanto, es deseable separar los entornos de desarrollo, prueba y producción para reducir el riesgo de cambios accidentales o acceso no autorizado al software de producción y los datos comerciales (ver8.33 para la protección de la información de prueba).',
      },
      {
        tipo: 'parrafo',
        texto: 'En algunos casos, la distinción entre entornos de desarrollo, prueba y producción se puede desdibujar deliberadamente y las pruebas se pueden llevar a cabo en un entorno de desarrollo o mediante implementaciones controladas para usuarios o servidores reales (por ejemplo, una pequeña población de usuarios piloto). En algunos casos, la prueba del producto puede ocurrir mediante el uso en vivo del producto dentro de la organización. Además, para reducir el tiempo de inactividad de las implementaciones en vivo, se pueden admitir dos entornos de producción idénticos donde solo uno está en vivo en cualquier momento.',
      },
      {
        tipo: 'parrafo',
        texto: 'Procesos de soporte para el uso de datos de producción en entornos de desarrollo y prueba (8.33 ) son necesarios.',
      },
      {
        tipo: 'parrafo',
        texto: 'Las organizaciones también pueden considerar la orientación proporcionada en esta sección para los entornos de capacitación al realizar la capacitación del usuario final.',
      },
    ],
    conceptos: ['Proteger'],
    dominios: ['Protección'],
  },
} satisfies Record<string, NormaControl>

export type IdControl = keyof typeof normas
