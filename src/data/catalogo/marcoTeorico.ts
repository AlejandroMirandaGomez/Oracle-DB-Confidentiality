import type { SeccionTeorica } from '../tipos'

export const marcoTeorico: SeccionTeorica[] = [
  {
    id: 'MT-1',
    titulo: 'ISO/IEC 27001:2022 frente a la edición 2013',
    parrafos: [
      'ISO/IEC 27001 define los requisitos de un sistema de gestión de seguridad de la información y su Anexo A enumera los controles de referencia; ISO/IEC 27002 desarrolla cada control con su propósito y su guía de implementación (ISO/IEC, 2022a, 2022b). La edición 2022 reorganizó el anexo: pasó de 114 controles en 14 dominios a 93 controles agrupados en cuatro temas, 37 organizacionales, 8 de personas, 14 físicos y 34 tecnológicos.',
      'La reorganización fusionó controles que se superponían y agregó 11 nuevos. Entre los nuevos están tres que este trabajo usa directamente: eliminación de información (8.10), enmascaramiento de datos (8.11) y prevención de fuga de datos (8.12). La edición también introdujo cinco atributos por control (tipo de control, propiedades de seguridad, conceptos de ciberseguridad, capacidades operativas y dominios de seguridad), que permiten filtrar el catálogo; aquí se usó la propiedad Confidencialidad para seleccionar los controles.',
    ],
  },
  {
    id: 'MT-2',
    titulo: 'Mínimo privilegio y separación de funciones en el rol DBA',
    parrafos: [
      'El principio de mínimo privilegio establece que cada identidad recibe solo el acceso que su función necesita y que lo no permitido queda prohibido por omisión (ISO/IEC, 2022b, control 5.15). En una base Oracle se aplica con roles por función, con la revisión de privilegios ANY y con la ausencia de concesiones a PUBLIC.',
      'El DBA es el caso más delicado, porque su función exige privilegios capaces de anular los demás controles. La norma pide que esos privilegios se asignen a identidades nominales, por tiempo limitado cuando sea posible, y que su uso quede registrado (ISO/IEC, 2022b, control 8.2). La separación de funciones complementa este principio: quien administra la base no debería administrar también su auditoría, por eso Oracle separa los roles AUDIT_ADMIN y AUDIT_VIEWER del rol DBA (Oracle, 2021a).',
    ],
  },
  {
    id: 'MT-3',
    titulo: 'Defensa en profundidad y confianza cero aplicadas a bases de datos',
    parrafos: [
      'La defensa en profundidad superpone controles independientes para que la falla de uno no exponga los datos: red cifrada, autenticación robusta, privilegios mínimos, filtrado de filas, redacción de columnas, cifrado en reposo y auditoría. Cada capa de esta matriz responde a un riesgo distinto y ninguna se considera suficiente por sí sola.',
      'El modelo de confianza cero parte de que ninguna conexión es confiable por estar dentro de la red; cada solicitud se autentica y autoriza según la identidad y el contexto (Rose et al., 2020). Aplicado a una base de datos, implica cifrar también el tráfico local, autorizar fila por fila con políticas que evalúan la sesión y registrar cada acceso a datos clasificados.',
    ],
  },
  {
    id: 'MT-4',
    titulo: 'Controles técnicos de confidencialidad en Oracle',
    parrafos: [
      'Transparent Data Encryption cifra los datafiles y los respaldos con una clave maestra guardada en un almacén de claves, de modo que una copia física del archivo no sea legible (Oracle, 2021b). Data Redaction transforma el resultado de una consulta en tiempo de ejecución, de forma completa, parcial o por expresión regular, sin modificar el dato almacenado; corresponde al enmascaramiento dinámico que describe la norma (ISO/IEC, 2022b, control 8.11).',
      'Virtual Private Database agrega a cada sentencia un predicado devuelto por una función de política, con lo que dos usuarios con el mismo privilegio de objeto ven filas distintas (Oracle, 2021a). Para la red, Oracle Net ofrece cifrado nativo e integridad criptográfica, o TLS con certificados; el servidor puede exigirlos con SQLNET.ENCRYPTION_SERVER = REQUIRED. En Oracle Database 21c Express Edition estas opciones están disponibles, con límites de dos núcleos y 12 GB de datos de usuario (Oracle, 2021c).',
    ],
  },
  {
    id: 'MT-5',
    titulo: 'Prevención de fuga de datos y respaldos cifrados',
    parrafos: [
      'La prevención de fuga de datos busca identificar la información sensible, vigilar los canales por los que puede salir y bloquear las transmisiones no autorizadas (ISO/IEC, 2022b, control 8.12). Dentro del motor, esos canales son los paquetes que escriben archivos o abren conexiones (UTL_FILE, UTL_HTTP, UTL_TCP), los roles de exportación masiva y los directorios.',
      'Los respaldos son el canal de fuga más completo, porque contienen la base entera. La guía del control 8.13 pide protegerlos con cifrado cuando la confidencialidad es importante, y RMAN lo permite con cifrado transparente basado en TDE o con una contraseña (ISO/IEC, 2022b; Oracle, 2021b).',
    ],
  },
  {
    id: 'MT-6',
    titulo: 'Registro, monitoreo y correlación',
    parrafos: [
      'El control 8.15 pide producir, proteger y analizar registros con la identidad del usuario, la acción, la fecha y el origen, e impedir que los usuarios privilegiados borren los registros de su propia actividad (ISO/IEC, 2022b). La auditoría unificada de Oracle concentra esos eventos en UNIFIED_AUDIT_TRAIL, cuya tabla subyacente rechaza operaciones DML incluso de SYS.',
      'Un SIEM recoge los registros de varias fuentes, los normaliza y los correlaciona para generar alertas; en la base de datos, el insumo mínimo es el rastro de inicios de sesión fallidos, de uso de privilegios y de acceso a tablas clasificadas. El control 5.33 completa esta capa con la definición de cuánto tiempo se conservan los registros y cómo se archivan antes de purgarse.',
    ],
  },
  {
    id: 'MT-7',
    titulo: 'Ley 8968 y su reglamento',
    parrafos: [
      'La Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales, N.º 8968, regula el tratamiento de datos personales en bases públicas y privadas en Costa Rica (Asamblea Legislativa, 2011). Su artículo 9 distingue los datos sensibles, los de acceso restringido y los de acceso irrestricto; esa distinción alimenta el esquema de clasificación de este trabajo.',
      'El artículo 10 obliga al responsable de la base de datos a adoptar medidas técnicas y organizativas que eviten la alteración, la pérdida y el acceso no autorizado, y el artículo 11 impone el deber de confidencialidad a quienes intervienen en el tratamiento, aun después de terminada su relación con la base. El reglamento, Decreto Ejecutivo N.º 37554-JP, desarrolla esas obligaciones y las facultades de la Agencia de Protección de Datos de los Habitantes, PRODHAB (Poder Ejecutivo, 2013).',
    ],
  },
]
